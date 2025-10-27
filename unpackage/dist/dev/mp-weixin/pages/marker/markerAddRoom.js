"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      submitflag: false,
      roomdata: {
        RoomNumber: "",
        RoomAddress: "",
        RoomArea: "",
        RoomType: "",
        RoomPayment: {
          "monthly": 0,
          "quarterly": 0,
          "yearly": 0
        },
        RoomFurniture: [false, false, false, false, false, false, false],
        RoomVideo: [],
        // 提取文件路径
        PropertyId: 0
      },
      roomCount: null,
      MaxCount: null,
      houseName: ["浴缸", "花洒", "冰箱", "空调", "微波炉", "洗衣机", "油烟机"],
      filepath: [],
      msg: null,
      PropertyId: 0
    };
  },
  onLoad(res) {
    this.roomdata.PropertyId = res.id;
    this.PropertyId = res.id;
  },
  methods: {
    //删除视频路径
    deleteFilePath(index) {
      this.filepath.splice(index, 1);
    },
    //点击家具
    onhouse(index) {
      this.roomdata.RoomFurniture[index] = !this.roomdata.RoomFurniture[index];
    },
    //关闭弹窗
    successbvideo_close() {
      this.$refs.error.close("center");
    },
    successbvideo_toMap() {
      this.$refs.success.close("center");
      common_vendor.index.navigateBack({
        url: "/pages/marker/marker?id=" + this.PropertyId
      });
    },
    //上传视频
    selectvideo() {
      if (this.roomdata.RoomVideo.length < 3) {
        common_vendor.wx$1.chooseMedia({
          count: 3,
          mediaType: ["video"],
          maxDuration: 60,
          success: (res) => {
            common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:180", res.tempFiles[0].size / 1048576);
            this.filepath.push(...res.tempFiles);
            common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:183", this.filepath);
          },
          fail: (res) => {
          }
        });
      }
    },
    // 添加支付方式
    addPaymentOption() {
      common_vendor.index.showModal({
        title: "添加支付方式",
        content: "输入支付方式名称（如：半年付）",
        editable: true,
        success: (res) => {
          if (res.confirm && res.content) {
            const key = res.content.trim();
            if (key && !this.RoomFurniture[key]) {
              this.$set(this.RoomFurniture, key, 0);
            }
          }
        }
      });
    },
    // 提交房源信息
    submitHouseInfo() {
      if (!this.roomsVerify())
        return;
      this.submitVideo().then(() => {
        common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:221", "-----submit----");
        common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:222", this.roomdata);
        this.sumbit();
      });
    },
    // 单独封装的视频上传方法（异步）传入房间号，对当前房间的视频临时路径进行上传
    async VideoUp(title) {
      if (!this.filepath || this.filepath.length === 0) {
        return [];
      }
      let fileID = [];
      this.filepath.forEach((item, index) => {
        let cloudPath = "map/" + title + "_" + index + ".mp4";
        let filePath = item.tempFilePath;
        let p = common_vendor.wx$1.cloud.uploadFile({
          cloudPath,
          filePath,
          config: {
            env: "prod-7g3ji5ui73a4702f"
            // 显式指定环境ID
          }
        });
        fileID.push(p);
      });
      fileID = await Promise.all(fileID);
      fileID = fileID.map((item) => {
        return item.fileID;
      });
      return fileID;
    },
    //视频上传
    async submitVideo() {
      common_vendor.index.showLoading({ title: "视频上传中...", mask: true });
      await this.VideoUp(this.roomdata.RoomNumber).then((res) => {
        res.forEach((item, index) => {
          this.roomdata.RoomVideo[index] = item;
        });
        common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:262", this.roomdata.RoomVideo);
        common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:263", "---------");
      });
      common_vendor.index.hideLoading();
      common_vendor.index.showToast({
        title: "上传成功",
        icon: "success"
      });
    },
    //房间信息验证模块
    roomsVerify() {
      const validPayments = Object.values(this.roomdata.RoomPayment).filter((amount) => amount > 0);
      if (validPayments.length === 0) {
        common_vendor.index.showToast({
          title: "请至少设置一种有效的支付价格",
          icon: "none",
          duration: 3e3
        });
        return false;
      }
      if (this.filepath.length === 0) {
        common_vendor.index.showToast({
          title: "请至少上传一个视频文件",
          icon: "none",
          duration: 3e3
        });
        common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:314", "请至少上传一个视频文件");
        return false;
      }
      return true;
    },
    //上传表单信息
    sumbit() {
      const res = common_vendor.wx$1.cloud.callContainer({
        "config": {
          "env": "prod-7g3ji5ui73a4702f"
        },
        "path": "/api/room/insert",
        "header": {
          "X-WX-SERVICE": "springboot-x535",
          "content-type": "application/json"
        },
        "method": "POST",
        "data": this.roomdata
      });
      common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:339", res);
      res.then((response) => {
        common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:342", "API 响应:", response);
        if (response.statusCode === 200) {
          if (response.data.code === "200") {
            common_vendor.index.__f__("log", "at pages/marker/markerAddRoom.vue:348", "操作成功:", response.data.msg);
            this.msg = response.data.msg;
            this.$refs.success.open("center");
          } else {
            common_vendor.index.__f__("error", "at pages/marker/markerAddRoom.vue:353", "业务错误:", response.data.msg);
            this.msg = response.data.msg;
            this.$refs.error.open("center");
          }
        } else {
          common_vendor.index.__f__("error", "at pages/marker/markerAddRoom.vue:358", "HTTP 错误:", response.statusCode);
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/marker/markerAddRoom.vue:362", "请求失败:", error);
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.roomdata.RoomNumber,
    b: common_vendor.o(($event) => $data.roomdata.RoomNumber = $event.detail.value),
    c: $data.roomdata.RoomAddress,
    d: common_vendor.o(($event) => $data.roomdata.RoomAddress = $event.detail.value),
    e: $data.roomdata.RoomArea,
    f: common_vendor.o(($event) => $data.roomdata.RoomArea = $event.detail.value),
    g: $data.roomdata.RoomType,
    h: common_vendor.o(($event) => $data.roomdata.RoomType = $event.detail.value),
    i: common_vendor.f($data.roomdata.RoomPayment, (value, key, index) => {
      return {
        a: `${key}价格`,
        b: $data.roomdata.RoomPayment[key],
        c: common_vendor.o(($event) => $data.roomdata.RoomPayment[key] = $event.detail.value, index),
        d: common_vendor.t(key == "monthly" ? "月付" : key == "quarterly" ? "半年付" : "年付"),
        e: index
      };
    }),
    j: common_vendor.f(7, (index, k0, i0) => {
      return common_vendor.e({
        a: $data.roomdata.RoomFurniture[index]
      }, $data.roomdata.RoomFurniture[index] ? {
        b: common_vendor.t($data.houseName[index - 1]),
        c: `/static/map/furniture/select/${index}.png`
      } : {
        d: common_vendor.t($data.houseName[index - 1]),
        e: `/static/map/furniture/de/${index}.png`
      }, {
        f: common_vendor.o(($event) => $options.onhouse(index), index),
        g: index
      });
    }),
    k: common_vendor.o((...args) => $options.selectvideo && $options.selectvideo(...args)),
    l: common_vendor.f(this.filepath, (item, index, i0) => {
      return {
        a: item.thumbTempFilePath,
        b: common_vendor.t((item.size / 1048576).toFixed(2)),
        c: common_vendor.o(($event) => $options.deleteFilePath(index), index),
        d: index
      };
    }),
    m: common_assets._imports_0$1,
    n: common_vendor.t($data.msg),
    o: common_vendor.o((...args) => $options.successbvideo_close && $options.successbvideo_close(...args)),
    p: common_vendor.sr("error", "2af1d951-0"),
    q: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    }),
    r: common_assets._imports_1,
    s: common_vendor.t($data.msg),
    t: common_vendor.o((...args) => $options.successbvideo_toMap && $options.successbvideo_toMap(...args)),
    v: common_vendor.sr("success", "2af1d951-1"),
    w: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    }),
    x: common_vendor.o((...args) => $options.submitHouseInfo && $options.submitHouseInfo(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/marker/markerAddRoom.js.map
