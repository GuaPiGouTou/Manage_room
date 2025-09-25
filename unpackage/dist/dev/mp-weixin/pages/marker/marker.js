"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
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
        room: []
      }
    };
  },
  created() {
    this.loadPropertyData();
  },
  methods: {
    loadPropertyData() {
      this.baseInfo = {
        address: "北京市朝阳区朝阳公园路8号",
        longitude: 116.480881,
        latitude: 39.933363,
        wechat: "example_wechat",
        phone: "13800138000",
        title: "朝阳花园小区",
        location: "朝阳区CBD核心区",
        area: "50000",
        roomcount: 2,
        room: [
          {
            RoomNumber: "A-101",
            RoomAddress: "1号楼101室",
            RoomArea: 85,
            RoomType: "两室一厅",
            RoomFurniture: [true, false, true, true, false, false, true],
            RoomVideo: ["video1.mp4", "video2.mp4"],
            RoomPayment: {
              monthly: "5000",
              quarterly: "4800",
              yearly: "4500"
            }
          },
          {
            RoomNumber: "B-202",
            RoomAddress: "2号楼202室",
            RoomArea: 120,
            RoomType: "三室一厅",
            RoomFurniture: [true, true, true, true, true, false, true],
            RoomVideo: ["video3.mp4"],
            RoomPayment: {
              monthly: "8000",
              quarterly: "7500",
              yearly: "7000"
            }
          }
        ]
      };
    },
    formatPayment(payment) {
      if (!payment)
        return "暂无数据";
      const methods = [];
      if (payment.monthly)
        methods.push(`月付: ¥${payment.monthly}`);
      if (payment.quarterly)
        methods.push(`季付: ¥${payment.quarterly}`);
      if (payment.yearly)
        methods.push(`年付: ¥${payment.yearly}`);
      return methods.join(" / ") || "价格面议";
    },
    formatFurniture(furniture) {
      if (!furniture || !furniture.length)
        return "无";
      const items = ["床", "沙发", "餐桌", "衣柜", "电视", "冰箱", "洗衣机"];
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
    g: common_vendor.t($data.baseInfo.room.length),
    h: common_vendor.f($data.baseInfo.room, (room, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(room.RoomNumber || "未编号"),
        b: common_vendor.t(room.RoomType || "未分类"),
        c: common_vendor.t(room.RoomAddress || "同小区地址"),
        d: common_vendor.t(room.RoomArea || "0"),
        e: common_vendor.t($options.formatPayment(room.RoomPayment)),
        f: common_vendor.t($options.formatFurniture(room.RoomFurniture)),
        g: room.RoomVideo.length
      }, room.RoomVideo.length ? {
        h: common_vendor.t(room.RoomVideo.length),
        i: common_vendor.f(room.RoomVideo, (video, idx, i1) => {
          return {
            a: common_vendor.t(idx + 1),
            b: idx,
            c: common_vendor.o(($event) => $options.previewVideo(video), idx)
          };
        }),
        j: common_assets._imports_0$1
      } : {}, {
        k: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/marker/marker.js.map
