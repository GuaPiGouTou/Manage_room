"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // 位置信息
      locationName: "s",
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
  computed: {
    ...common_vendor.mapState(["baseInfo"])
  },
  watch: {
    // 监听基本信息变化并保存到Vuex
    baseInfo: {
      deep: true,
      handler(newVal) {
        this.$store.dispatch("saveBaseInfo", newVal);
      }
    }
  },
  //页面卸载时
  onUnload() {
  },
  methods: {
    nextroom() {
      common_vendor.index.navigateTo({
        url: "/pages/marker/addMarker/NextRoom"
      });
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
      common_vendor.wx$1.chooseMedia({
        count: 3,
        mediaType: ["video"],
        maxDuration: 60,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/marker/addMarker/addMarker.vue:133", "chooseMedia_Success");
          common_vendor.index.__f__("log", "at pages/marker/addMarker/addMarker.vue:134", res.tempFiles[0].size / 1048576);
          const that = this;
          that.filepath.push(...res.tempFiles);
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/marker/addMarker/addMarker.vue:140", "chooseMedia");
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
            common_vendor.index.__f__("log", "at pages/marker/addMarker/addMarker.vue:286", "uploadFile_success");
            that.uid[i] = res2.fileID;
          },
          fail(res2) {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/addMarker.vue:292", "uploadFile_fail");
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
      common_vendor.index.__f__("log", "at pages/marker/addMarker/addMarker.vue:328", res);
      res.then((response) => {
        common_vendor.index.__f__("log", "at pages/marker/addMarker/addMarker.vue:331", "API 响应:", response);
        if (response.statusCode === 200) {
          if (response.data.code === "200") {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/addMarker.vue:337", "操作成功:", response.data.msg);
            this.msg = response.data.msg;
            this.$refs.success.open("center");
          } else {
            common_vendor.index.__f__("error", "at pages/marker/addMarker/addMarker.vue:341", "业务错误:", response.data.msg);
            this.msg = response.data.msg;
            this.$refs.error.open("center");
          }
        } else {
          common_vendor.index.__f__("error", "at pages/marker/addMarker/addMarker.vue:346", "HTTP 错误:", response.statusCode);
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/marker/addMarker/addMarker.vue:350", "请求失败:", error);
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.chooseLocation && $options.chooseLocation(...args)),
    b: $data.locationName
  }, $data.locationName ? {
    c: common_vendor.t(_ctx.baseInfo.locationName),
    d: common_vendor.t(_ctx.baseInfo.longitude),
    e: common_vendor.t(_ctx.baseInfo.latitude)
  } : {}, {
    f: _ctx.baseInfo.wechat,
    g: common_vendor.o(($event) => _ctx.baseInfo.wechat = $event.detail.value),
    h: _ctx.baseInfo.phone,
    i: common_vendor.o(($event) => _ctx.baseInfo.phone = $event.detail.value),
    j: _ctx.baseInfo.title,
    k: common_vendor.o(($event) => _ctx.baseInfo.title = $event.detail.value),
    l: _ctx.baseInfo.location,
    m: common_vendor.o(($event) => _ctx.baseInfo.location = $event.detail.value),
    n: _ctx.baseInfo.area,
    o: common_vendor.o(($event) => _ctx.baseInfo.area = $event.detail.value),
    p: _ctx.baseInfo.count,
    q: common_vendor.o(($event) => _ctx.baseInfo.count = $event.detail.value),
    r: common_vendor.o((...args) => $options.nextroom && $options.nextroom(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/marker/addMarker/addMarker.js.map
