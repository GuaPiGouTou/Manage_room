"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const _sfc_main = {
  data() {
    return {
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
  methods: {
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
      common_vendor.wx$1.chooseMedia({
        count: 3,
        mediaType: ["video"],
        maxDuration: 60,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:199", "chooseMedia_Success");
          common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:200", res.tempFiles[0].size / 1048576);
          const that = this;
          that.filepath.push(...res.tempFiles);
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:206", "chooseMedia");
        }
      });
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
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:352", "uploadFile_success");
            that.uid[i] = res2.fileID;
          },
          fail(res2) {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:358", "uploadFile_fail");
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
      common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:394", res);
      res.then((response) => {
        common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:397", "API 响应:", response);
        if (response.statusCode === 200) {
          if (response.data.code === "200") {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:403", "操作成功:", response.data.msg);
            this.msg = response.data.msg;
            this.$refs.success.open("center");
          } else {
            common_vendor.index.__f__("error", "at pages/marker/addMarker/NextRoom.vue:407", "业务错误:", response.data.msg);
            this.msg = response.data.msg;
            this.$refs.error.open("center");
          }
        } else {
          common_vendor.index.__f__("error", "at pages/marker/addMarker/NextRoom.vue:412", "HTTP 错误:", response.statusCode);
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/marker/addMarker/NextRoom.vue:416", "请求失败:", error);
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
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_popup2 + _component_uni_icons)();
}
const _easycom_uni_popup = () => "../../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.chooseLocation && $options.chooseLocation(...args)),
    b: $data.locationName
  }, $data.locationName ? {
    c: common_vendor.t($data.locationName),
    d: common_vendor.t($data.longitude),
    e: common_vendor.t($data.latitude)
  } : {}, {
    f: $data.title,
    g: common_vendor.o(($event) => $data.title = $event.detail.value),
    h: $data.location,
    i: common_vendor.o(($event) => $data.location = $event.detail.value),
    j: $data.area,
    k: common_vendor.o(($event) => $data.area = $event.detail.value),
    l: $data.houseType,
    m: common_vendor.o(($event) => $data.houseType = $event.detail.value),
    n: $data.count,
    o: common_vendor.o(($event) => $data.count = $event.detail.value),
    p: $data.wechat,
    q: common_vendor.o(($event) => $data.wechat = $event.detail.value),
    r: $data.phone,
    s: common_vendor.o(($event) => $data.phone = $event.detail.value),
    t: common_vendor.f($data.paymentOptions, (value, key, index) => {
      return {
        a: `${key}价格`,
        b: $data.paymentOptions[key],
        c: common_vendor.o(($event) => $data.paymentOptions[key] = $event.detail.value, index),
        d: common_vendor.t(key),
        e: index
      };
    }),
    v: common_vendor.f(7, (index, k0, i0) => {
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
    w: common_vendor.o((...args) => $options.selectvideo && $options.selectvideo(...args)),
    x: common_vendor.f($data.filepath, (item, index, i0) => {
      return {
        a: common_vendor.t((item.size / 1048576).toFixed(2)),
        b: common_vendor.o(($event) => $options.deleteFilePath(index), index),
        c: index
      };
    }),
    y: common_assets._imports_0$1,
    z: common_vendor.t($data.msg),
    A: common_vendor.o((...args) => $options.successbvideo_close && $options.successbvideo_close(...args)),
    B: common_vendor.sr("error", "6d1511a3-0"),
    C: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    }),
    D: common_assets._imports_1,
    E: common_vendor.t($data.msg),
    F: common_vendor.o((...args) => $options.successbvideo_toMap && $options.successbvideo_toMap(...args)),
    G: common_vendor.sr("success", "6d1511a3-1"),
    H: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    }),
    I: common_vendor.p({
      type: "camera",
      size: "24"
    }),
    J: common_vendor.o(($event) => _ctx.chooseMedia("camera", "image")),
    K: common_vendor.p({
      type: "image",
      size: "24"
    }),
    L: common_vendor.o(($event) => _ctx.chooseMedia("album", "image")),
    M: common_vendor.p({
      type: "videocam",
      size: "24"
    }),
    N: common_vendor.o(($event) => _ctx.chooseMedia("camera", "video")),
    O: common_vendor.o((...args) => _ctx.closeMediaPopup && _ctx.closeMediaPopup(...args)),
    P: common_vendor.sr("mediaPopup", "6d1511a3-2"),
    Q: common_vendor.p({
      type: "bottom"
    }),
    R: common_vendor.o((...args) => $options.submitHouseInfo && $options.submitHouseInfo(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/marker/addMarker/NextRoom.js.map
