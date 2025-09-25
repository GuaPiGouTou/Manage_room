"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
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
          "月付": 0,
          "半年付": 0,
          "年付": 0
        },
        RoomFurniture: [false, false, false, false, false, false, false],
        RoomVideo: []
        // 提取文件路径
      },
      roomCount: null,
      MaxCount: null,
      houseName: ["浴缸", "花洒", "冰箱", "空调", "微波炉", "洗衣机", "油烟机"],
      filepath: [],
      msg: null
    };
  },
  onLoad() {
    this.roomCount = this.$store.state.currentRoomIndex;
    this.MaxCount = this.$store.state.baseInfo.roomcount;
    common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:147", "onLoad");
    common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:148", this.$store.state.rooms);
    if (this.$store.state.rooms[this.roomCount] != null) {
      this.roomdata = this.$store.state.rooms[this.roomCount];
    }
  },
  onUnload() {
    common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:158", this.roomdata);
    if (this.roomdata.RoomNumber.trim() != null || this.roomdata.RoomAddress.trim() != null || this.roomdata.RoomType.trim() != null) {
      this.$store.commit("UPDATE_ROOM", { index: this.roomCount, data: this.roomdata });
      this.$store.commit("UPDATE_BASEROOMS", { index: this.roomCount, data: this.roomdata });
    }
  },
  methods: {
    //跳转上一个房间
    ReturnRoom() {
      if (this.roomCount + 1 > 1) {
        this.$store.commit("SET_CURRENT_ROOM_INDEX", this.roomCount - 1);
        common_vendor.index.redirectTo({
          url: "/pages/marker/addMarker/NextRoom"
        });
      } else {
        common_vendor.index.redirectTo({
          url: "/pages/marker/addMarker/addMarker"
        });
      }
    },
    //跳转下一个房间
    NextRoom() {
      if (this.roomCount + 1 < this.MaxCount) {
        common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:186", this.roomdata);
        if (this.roomdata.RoomNumber.trim() != null && this.roomdata.RoomAddress.trim() != null && this.roomdata.RoomType.trim()) {
          this.$store.commit("SET_CURRENT_ROOM_INDEX", this.roomCount + 1);
          common_vendor.index.redirectTo({
            url: "/pages/marker/addMarker/NextRoom"
          });
        } else {
          this.msg = "当前房间未完成填写";
          this.$refs.error.open("center");
        }
      } else {
        this.msg = "当前房间已经为最后一个房间！";
        this.$refs.error.open("center");
      }
    },
    //删除视频路径
    deleteFilePath(index) {
      this.roomdata.RoomVideo.splice(index, 1);
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
      common_vendor.index.redirectTo({
        url: "/pages/map/map"
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
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:234", res.tempFiles[0].size / 1048576);
            this.roomdata.RoomVideo.push(...res.tempFiles);
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:236", "chooseMedia_Success");
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:237", this.roomdata.RoomVideo);
          },
          fail: (res) => {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:240", "chooseMedia");
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
              this.RoomAddress = res.name;
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
        common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:314", "-----submit----");
        common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:315", this.$store.state.baseInfo);
        this.sumbit();
      });
    },
    //视频上传
    async submitVideo() {
      common_vendor.index.showLoading({ title: "视频上传中...", mask: true });
      let rooms = this.$store.state.baseInfo.room;
      let house = this.$store.state.baseInfo;
      let p = rooms.map((item, index) => {
        return this.VideoUp(house, item).then((res) => {
          let room = item;
          room.RoomVideo = [];
          res.forEach((item2, index2) => {
            room.RoomVideo[index2] = item2;
          });
          this.$store.commit("UPDATE_BASEROOMS", { index, data: room });
          common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:338", this.$store.state.baseInfo.room[index]);
          common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:339", "---------");
        });
      });
      await Promise.all(p);
      common_vendor.index.hideLoading();
      common_vendor.index.showToast({
        title: "上传成功",
        icon: "success"
      });
      common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:351", "----base-----");
      common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:352", this.$store.state.baseInfo);
      common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:353", "-----rooms----");
      common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:354", this.$store.state.rooms);
    },
    // 单独封装的视频上传方法（异步）
    async VideoUp(title, room) {
      let fileID = [];
      room.RoomVideo.forEach((item, index) => {
        let cloudPath = "map/" + title + "_" + index + ".mp4";
        let filePath = item.tempFilePath;
        let p = common_vendor.wx$1.cloud.uploadFile({
          cloudPath,
          filePath
        });
        fileID.push(p);
      });
      fileID = await Promise.all(fileID);
      fileID = fileID.map((item) => {
        return item.fileID;
      });
      return fileID;
    },
    //验证房源信息模块
    houseInfoVerify() {
      const housedata = this.$store.state.baseInfo;
      if (!housedata.address || !housedata.longitude || !housedata.latitude) {
        common_vendor.index.showToast({
          title: "房源信息中未选择地图位置",
          icon: "none",
          duration: 3e3
        });
        return false;
      }
      if (!housedata.wechat && !housedata.phone) {
        common_vendor.index.showToast({ title: "房源信息至少填写一种联系方式", icon: "none" });
        return false;
      }
      if (housedata.phone && !/^1[3-9]\d{9}$/.test(housedata.phone)) {
        common_vendor.index.showToast({ title: "手机号格式不正确", icon: "none" });
        return false;
      }
      if (!housedata.title.trim()) {
        common_vendor.index.showToast({ title: "房源信息中未填写标题", icon: "none", duration: 3e3 });
        return false;
      }
      if (!housedata.location.trim()) {
        common_vendor.index.showToast({ title: "房源信息中未填写具体地点", icon: "none" });
        return false;
      }
      if (!housedata.area.trim()) {
        common_vendor.index.showToast({ title: "房源信息中未填写面积", icon: "none" });
        return false;
      }
      return true;
    },
    //房间信息验证模块
    roomsVerify() {
      if (this.roomdata.RoomNumber.trim() != "" && this.roomdata.RoomAddress.trim() != "" && this.roomdata.RoomType.trim() != "") {
        this.$store.commit("UPDATE_ROOM", { index: this.roomCount, data: this.roomdata });
        this.$store.commit("UPDATE_BASEROOMS", { index: this.roomCount, data: this.roomdata });
        common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:428", "roomsVerify");
      } else {
        common_vendor.index.showToast({
          title: "房间信息不能为空",
          icon: "none",
          duration: 3e3
        });
        return false;
      }
      const rooms = this.$store.state.rooms;
      for (var i = 0; i < rooms.length; i++) {
        const validPayments = Object.values(rooms[i].RoomPayment).filter((amount) => amount > 0);
        if (validPayments.length === 0) {
          common_vendor.index.showToast({
            title: "请至少设置一种有效的支付价格",
            icon: "none",
            duration: 3e3
          });
          return false;
        }
        if (rooms[i].RoomVideo.length === 0) {
          common_vendor.index.showToast({
            title: "请至少上传一个视频文件",
            icon: "none",
            duration: 3e3
          });
          common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:461", "请至少上传一个视频文件");
          return false;
        }
        return true;
      }
    },
    //上传表单信息
    sumbit() {
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
        "data": this.$store.state.baseInfo
      });
      common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:484", res);
      res.then((response) => {
        common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:487", "API 响应:", response);
        if (response.statusCode === 200) {
          if (response.data.code === "200") {
            common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:493", "操作成功:", response.data.msg);
            this.$store.commit("CLEAR_ALL_DATA");
            this.msg = response.data.msg;
            this.$refs.success.open("center");
          } else {
            common_vendor.index.__f__("error", "at pages/marker/addMarker/NextRoom.vue:498", "业务错误:", response.data.msg);
            this.msg = response.data.msg;
            this.$refs.error.open("center");
          }
        } else {
          common_vendor.index.__f__("error", "at pages/marker/addMarker/NextRoom.vue:503", "HTTP 错误:", response.statusCode);
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/marker/addMarker/NextRoom.vue:507", "请求失败:", error);
      });
    }
    //
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
  return common_vendor.e({
    a: common_vendor.t($data.roomCount + 1),
    b: common_vendor.t($data.MaxCount),
    c: $data.roomdata.RoomNumber,
    d: common_vendor.o(($event) => $data.roomdata.RoomNumber = $event.detail.value),
    e: $data.roomdata.RoomAddress,
    f: common_vendor.o(($event) => $data.roomdata.RoomAddress = $event.detail.value),
    g: $data.roomdata.RoomArea,
    h: common_vendor.o(($event) => $data.roomdata.RoomArea = $event.detail.value),
    i: $data.roomdata.RoomType,
    j: common_vendor.o(($event) => $data.roomdata.RoomType = $event.detail.value),
    k: common_vendor.f($data.roomdata.RoomPayment, (value, key, index) => {
      return {
        a: `${key}价格`,
        b: $data.roomdata.RoomPayment[key],
        c: common_vendor.o(($event) => $data.roomdata.RoomPayment[key] = $event.detail.value, index),
        d: common_vendor.t(key),
        e: index
      };
    }),
    l: common_vendor.f(7, (index, k0, i0) => {
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
    m: common_vendor.o((...args) => $options.selectvideo && $options.selectvideo(...args)),
    n: common_vendor.f(this.roomdata.RoomVideo, (item, index, i0) => {
      return {
        a: item.thumbTempFilePath,
        b: common_vendor.t((item.size / 1048576).toFixed(2)),
        c: common_vendor.o(($event) => $options.deleteFilePath(index), index),
        d: index
      };
    }),
    o: common_assets._imports_0$2,
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
    z: $data.roomCount + 1 - $data.MaxCount == 0
  }, $data.roomCount + 1 - $data.MaxCount == 0 ? {
    A: common_vendor.o((...args) => $options.submitHouseInfo && $options.submitHouseInfo(...args))
  } : {
    B: common_vendor.o((...args) => $options.NextRoom && $options.NextRoom(...args))
  }, {
    C: common_vendor.o((...args) => $options.ReturnRoom && $options.ReturnRoom(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/marker/addMarker/NextRoom.js.map
