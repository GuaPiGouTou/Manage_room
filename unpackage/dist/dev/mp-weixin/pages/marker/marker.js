"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      propertyId: 1,
      baseInfo: {
        address: "",
        longitude: 0,
        latitude: 0,
        wechat: "",
        phone: "",
        title: "",
        location: "",
        area: "",
        roomcount: 0,
        room: [{
          roomId: 101,
          roomNumber: "101",
          roomAddress: "主卧",
          roomArea: 45.5,
          roomType: "主卧室",
          roomPayment: {
            monthly: 8e3,
            quarterly: 22e3,
            yearly: 8e4
          },
          roomFurniture: [true, true, true, false],
          roomVideo: ["video1", "video2"],
          propertyId: 1
        }]
      }
    };
  },
  created() {
  },
  onLoad(res) {
    common_vendor.index.__f__("log", "at pages/marker/marker.vue:135", res);
    this.propertyId = res.id;
    this.getHouse(res.id);
  },
  methods: {
    insert_room(id) {
      common_vendor.index.__f__("log", "at pages/marker/marker.vue:141", id);
      common_vendor.index.navigateTo({
        url: "/pages/marker/markerAddRoom?id=" + id
      });
    },
    delete_room(roomId, index) {
      common_vendor.index.__f__("log", "at pages/marker/marker.vue:147", roomId);
      const res = common_vendor.wx$1.cloud.callContainer({
        "config": {
          "env": "prod-7g3ji5ui73a4702f"
        },
        "path": "/api/room/delete?RoomId=" + roomId,
        "header": {
          "X-WX-SERVICE": "springboot-2wum",
          "content-type": "application/json"
        },
        "method": "GET"
      });
      res.then((res2) => {
        common_vendor.index.__f__("log", "at pages/marker/marker.vue:160", res2);
        if (res2.data.code === "200") {
          common_vendor.index.showToast({
            title: "删除成功！",
            icon: "success"
          });
          this.getHouse(this.propertyId);
        } else {
          common_vendor.index.showToast({
            title: "删除失败！",
            icon: "error"
          });
        }
      });
    },
    room() {
      common_vendor.index.__f__("log", "at pages/marker/marker.vue:179", this.baseInfo.room);
    },
    apiget() {
      this.baseInfo.title = "xxxx";
    },
    getHouse(id) {
      const succ = common_vendor.wx$1.cloud.callContainer({
        "config": {
          "env": "prod-7g3ji5ui73a4702f"
        },
        "path": "/api/house/gethouse?id=39",
        "header": {
          "X-WX-SERVICE": "springboot-2wum",
          "content-type": "application/json"
        },
        "method": "GET"
      });
      common_vendor.index.__f__("log", "at pages/marker/marker.vue:197", succ);
      succ.then((res) => {
        if (res.data.code === "200")
          this.baseInfo = res.data.data;
        common_vendor.index.__f__("log", "at pages/marker/marker.vue:202", this.baseInfo);
      });
    },
    formatPayment(payment) {
      if (!payment)
        return "暂无数据";
      const methods = [];
      common_vendor.index.__f__("log", "at pages/marker/marker.vue:209", payment);
      if (payment.monthly)
        methods.push(`月付: ¥${payment.monthly}`);
      if (payment.quarterly)
        methods.push(`半年付: ¥${payment.quarterly}`);
      if (payment.yearly)
        methods.push(`年付: ¥${payment.yearly}`);
      return methods.join(" / ") || "价格面议";
    },
    formatFurniture(furniture) {
      if (!furniture || !furniture.length)
        return "无";
      const items = ["浴缸", "花洒", "冰箱", "空调", "微波炉", "洗衣机", "油烟机"];
      return furniture.map((hasItem, index) => hasItem ? items[index] : null).filter(Boolean).join("、") || "基础配置";
    },
    previewVideo(videoUrl) {
      common_vendor.index.previewVideo({
        current: 0,
        urls: [videoUrl]
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.baseInfo.title || "未命名小区"),
    b: common_vendor.t($data.baseInfo.location),
    c: common_vendor.t($data.baseInfo.address || "暂无数据"),
    d: common_vendor.t($data.baseInfo.area || "0"),
    e: common_vendor.t($data.baseInfo.phone || "暂无数据"),
    f: common_vendor.t($data.baseInfo.wechat || "暂无数据"),
    g: common_vendor.o(($event) => $options.insert_room(this.propertyId)),
    h: common_vendor.t($data.baseInfo.roomcount),
    i: common_vendor.o((...args) => $options.room && $options.room(...args)),
    j: common_vendor.f($data.baseInfo.room, (room, index, i0) => {
      return {
        a: common_vendor.t(room.roomNumber || "未编号"),
        b: common_vendor.t(room.roomType || "未分类"),
        c: common_vendor.t(room.roomAddress || "同小区地址"),
        d: common_vendor.t(room.roomArea || "0"),
        e: common_vendor.t($options.formatPayment(room.roomPayment)),
        f: common_vendor.t($options.formatFurniture(room.roomFurniture)),
        g: common_vendor.o(($event) => $options.delete_room(room.roomId, index), index),
        h: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/marker/marker.js.map
