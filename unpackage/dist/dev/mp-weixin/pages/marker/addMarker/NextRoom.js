"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      videoThumb: [],
      MaxCount: 0,
      roomCount: 0,
      // 位置信息
      locationName: "",
      longitude: 0,
      latitude: 0,
      //视频信息
      msg: "成功上传",
      uid: [],
      filepath: [],
      // 房源基本信息
      swiperIds: [],
      title: "",
      videoId: "",
      location: "",
      area: "",
      houseType: "",
      count: 0,
      // 设施信息
      houseFacilities: [false, false, false, false, false, false, false],
      // 空调,洗衣机,冰箱,厨房
      houseName: ["浴缸", "花洒", "冰箱", "空调", "微波炉", "洗衣机", "油烟机"],
      // 联系方式
      wechat: "",
      phone: "",
      // 支付选项
      paymentOptions: {
        "月付": 0,
        "半年付": 0,
        "年付": 0
      }
    };
  },
  onLoad() {
    this.roomCount = this.$store.state.currentRoomIndex;
    this.MaxCount = this.$store.state.baseInfo.count;
  },
  methods: {
    //跳转下一个房间
    NextRoom() {
      this.$store.commit("SET_CURRENT_ROOM_INDEX", this.roomCount + 1);
    },
    //删除视频路径
    deleteFilePath(index) {
      this.filepath.splice(index, 1);
    },
    //点击家具
    onhouse(index) {
      this.houseFacilities[index] = !this.houseFacilities[index];
    },
    //关闭弹窗
    successbvideo_close() {
      this.$refs.success.close("center");
    },
    successbvideo_toMap() {
      this.$refs.success.close("center");
      common_vendor.index.navigateTo({
        url: "/pages/map/map"
      });
    },
    //上传视频
    selectvideo() {
      if (filepath.length < 3) {
        common_vendor.wx$1.chooseMedia({
          count: 3,
          mediaType: ["video"],
          maxDuration: 60,
          success: (res) => {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:217", "chooseMedia_Success");
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:218", res.tempFiles[0].size / 1048576);
            this.filepath.push(...res.tempFiles);
          },
          fail: (res) => {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:223", "chooseMedia");
          }
        });
      }
    },
    // 选择地图位置
    chooseLocation() {
      common_vendor.index.authorize({
        scope: "scope.userLocation",
        success: () => {
          common_vendor.index.chooseLocation({
            type: "gcj02",
            success: (res) => {
              this.locationName = res.name;
              this.longitude = res.longitude;
              this.latitude = res.latitude;
              this.location = res.address;
            },
            fail: (err) => {
              common_vendor.index.showToast({
                title: "位置选择失败",
                icon: "none"
              });
            }
          });
        },
        fail: () => {
          common_vendor.index.showModal({
            title: "权限提示",
            content: "需要位置权限才能选择地点，请开启权限",
            confirmText: "去设置",
            success: (res) => {
              if (res.confirm) {
                common_vendor.index.openSetting();
              }
            }
          });
        }
      });
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
            if (key && !this.paymentOptions[key]) {
              this.$set(this.paymentOptions, key, 0);
            }
          }
        }
      });
    },
    // 提交房源信息
    submitHouseInfo() {
      if (!this.locationName || !this.longitude || !this.latitude) {
        common_vendor.index.showToast({ title: "请先选择地图位置", icon: "none" });
        return;
      }
      const basicInfoErrors = [];
      if (!this.title)
        basicInfoErrors.push("房源标题");
      if (!this.location)
        basicInfoErrors.push("具体地点");
      if (!this.area || isNaN(this.area) || Number(this.area) <= 0) {
        basicInfoErrors.push("有效面积");
      }
      if (!this.houseType)
        basicInfoErrors.push("房型信息");
      if (!this.count || isNaN(this.count) || Number(this.count) <= 0) {
        basicInfoErrors.push("房间数量");
      }
      if (basicInfoErrors.length > 0) {
        common_vendor.index.showToast({
          title: `请填写${basicInfoErrors.join("、")}`,
          icon: "none",
          duration: 3e3
        });
        return;
      }
      const contactErrors = [];
      if (!this.wechat && !this.phone) {
        contactErrors.push("至少填写一种联系方式");
      }
      if (this.phone && !/^1[3-9]\d{9}$/.test(this.phone)) {
        contactErrors.push("手机号格式不正确");
      }
      if (contactErrors.length > 0) {
        common_vendor.index.showToast({
          title: contactErrors.join("，"),
          icon: "none",
          duration: 3e3
        });
        return;
      }
      const validPayments = Object.values(this.paymentOptions).filter((amount) => amount > 0);
      if (validPayments.length === 0) {
        common_vendor.index.showToast({
          title: "请至少设置一种有效的支付价格",
          icon: "none",
          duration: 3e3
        });
        return;
      }
      if (this.filepath.length === 0) {
        common_vendor.index.showToast({
          title: "请至少上传一个视频文件",
          icon: "none",
          duration: 3e3
        });
        return;
      }
      const that = this;
      for (let i = 0; i < that.filepath.length; i++) {
        common_vendor.wx$1.cloud.uploadFile({
          cloudPath: "map/" + this.title + i + ".mp4",
          filePath: that.filepath[i].tempFilePath,
          config: {
            env: "prod-7g3ji5ui73a4702f"
            // 微信云托管环境ID
          },
          success(res2) {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:371", "uploadFile_success");
            that.uid[i] = res2.fileID;
          },
          fail(res2) {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:377", "uploadFile_fail");
          }
        });
      }
      const houseData = {
        longitude: parseFloat(this.longitude),
        // 改为普通浮点数
        latitude: parseFloat(this.latitude),
        // 改为普通浮点数
        address: this.locationName,
        title: this.title,
        location: this.location,
        // 具体地点
        area: this.area.toString(),
        houseType: this.houseType,
        roomCount: parseInt(this.count),
        // 转换为整数
        wechat: this.wechat.toString(),
        phone: this.phone.toString(),
        paymentOptions: this.paymentOptions,
        houseFacilities: this.houseFacilities,
        videoIds: this.uid
        // 提取文件路径
      };
      const res = common_vendor.wx$1.cloud.callContainer({
        "config": {
          "env": "prod-7g3ji5ui73a4702f"
        },
        "path": "/api/house/submit",
        "header": {
          "X-WX-SERVICE": "springboot-2wum",
          "content-type": "application/json"
        },
        "method": "POST",
        "data": houseData
      });
      common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:413", res);
      res.then((response) => {
        common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:416", "API 响应:", response);
        if (response.statusCode === 200) {
          if (response.data.code === "200") {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:422", "操作成功:", response.data.msg);
            this.msg = response.data.msg;
            this.$refs.success.open("center");
          } else {
            common_vendor.index.__f__("error", "at pages/marker/addMarker/NextRoom.vue:426", "业务错误:", response.data.msg);
            this.msg = response.data.msg;
            this.$refs.error.open("center");
          }
        } else {
          common_vendor.index.__f__("error", "at pages/marker/addMarker/NextRoom.vue:431", "HTTP 错误:", response.statusCode);
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/marker/addMarker/NextRoom.vue:435", "请求失败:", error);
      });
    }
    // // 处理支付选项格式
    // processPaymentOptions() {
    //   const processed = {};
    //   for (const [key, value] of Object.entries(this.paymentOptions)) {
    //     processed[key] = Number(value) || 0;
    //   }
    //   return processed;
    // }
  }
};
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.roomCount),
    b: common_vendor.t($data.MaxCount),
    c: $data.title,
    d: common_vendor.o(($event) => $data.title = $event.detail.value),
    e: $data.location,
    f: common_vendor.o(($event) => $data.location = $event.detail.value),
    g: $data.area,
    h: common_vendor.o(($event) => $data.area = $event.detail.value),
    i: $data.houseType,
    j: common_vendor.o(($event) => $data.houseType = $event.detail.value),
    k: common_vendor.f($data.paymentOptions, (value, key, index) => {
      return {
        a: `${key}价格`,
        b: $data.paymentOptions[key],
        c: common_vendor.o(($event) => $data.paymentOptions[key] = $event.detail.value, index),
        d: common_vendor.t(key),
        e: index
      };
    }),
    l: common_vendor.f(7, (index, k0, i0) => {
      return common_vendor.e({
        a: $data.houseFacilities[index]
      }, $data.houseFacilities[index] ? {
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
    m: common_vendor.o((...args) => $options.selectvideo && $options.selectvideo(...args)),
    n: common_vendor.f($data.filepath, (item, index, i0) => {
      return {
        a: item.thumbTempFilePath,
        b: common_vendor.t((item.size / 1048576).toFixed(2)),
        c: common_vendor.o(($event) => $options.deleteFilePath(index), index),
        d: index
      };
    }),
    o: common_assets._imports_0$1,
    p: common_vendor.t($data.msg),
    q: common_vendor.o((...args) => $options.successbvideo_close && $options.successbvideo_close(...args)),
    r: common_vendor.sr("error", "6d1511a3-0"),
    s: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    }),
    t: common_assets._imports_1,
    v: common_vendor.t($data.msg),
    w: common_vendor.o((...args) => $options.successbvideo_toMap && $options.successbvideo_toMap(...args)),
    x: common_vendor.sr("success", "6d1511a3-1"),
    y: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    }),
    z: common_vendor.o((...args) => $options.NextRoom && $options.NextRoom(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/marker/addMarker/NextRoom.js.map
