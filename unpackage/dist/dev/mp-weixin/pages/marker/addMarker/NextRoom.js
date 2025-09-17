"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      facilities: ["空调", "洗衣机", "冰箱", "厨房", "电视", "WiFi", "书桌", "衣柜"],
      roomData: {}
    };
  },
  computed: {
    ...common_vendor.mapState(["baseInfo", "currentRoomIndex"]),
    ...common_vendor.mapGetters(["currentRoom"])
  },
  onLoad(options) {
    common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:105", "S+" + baseInfo);
    this.roomData = { ...this.currentRoom };
  },
  onUnload() {
    this.saveRoomData();
  },
  methods: {
    ...common_vendor.mapActions(["saveRoomInfo"]),
    ...common_vendor.mapMutations(["SET_CURRENT_ROOM_INDEX"]),
    // 保存当前房间数据
    saveRoomData() {
      this.saveRoomInfo({
        index: this.currentRoomIndex,
        data: this.roomData
      });
    },
    // 上一个房间
    prevRoom() {
      this.saveRoomData();
      const prevIndex = this.currentRoomIndex - 1;
      this.SET_CURRENT_ROOM_INDEX(prevIndex);
      this.roomData = { ...this.currentRoom };
      common_vendor.index.redirectTo({
        url: `/pages/marker/addMarker/NextRoom?index=${prevIndex}`
      });
    },
    // 下一个房间
    nextRoom() {
      this.saveRoomData();
      const nextIndex = this.currentRoomIndex + 1;
      this.SET_CURRENT_ROOM_INDEX(nextIndex);
      this.roomData = { ...this.currentRoom };
      common_vendor.index.redirectTo({
        url: `/pages/marker/addMarker/NextRoom?index=${nextIndex}`
      });
    },
    // 选择视频
    selectVideo() {
      common_vendor.index.chooseMedia({
        count: 3,
        mediaType: ["video"],
        success: (res) => {
          const newVideos = res.tempFiles.map((file) => ({
            name: file.tempFilePath.split("/").pop(),
            size: file.size,
            path: file.tempFilePath
          }));
          this.roomData.videos = [...this.roomData.videos, ...newVideos];
        }
      });
    },
    // 删除视频
    deleteVideo(index) {
      this.roomData.videos.splice(index, 1);
    },
    // 选择缩略图
    selectThumbnail() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.roomData.thumbnail = res.tempFilePaths[0];
        }
      });
    },
    // 切换设施
    toggleFacility(facility) {
      const index = this.roomData.facilities.indexOf(facility);
      if (index === -1) {
        this.roomData.facilities.push(facility);
      } else {
        this.roomData.facilities.splice(index, 1);
      }
    },
    // 提交所有数据
    submitAll() {
      this.saveRoomData();
      common_vendor.index.__f__("log", "at pages/marker/addMarker/NextRoom.vue:203", "所有房间数据:", this.$store.state.rooms);
      common_vendor.index.showToast({
        title: "提交成功",
        icon: "success",
        success: () => {
          common_vendor.index.navigateBack({
            delta: 999
            // 返回首页
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.currentRoomIndex + 1),
    b: common_vendor.t(_ctx.baseInfo.count),
    c: _ctx.currentRoomIndex > 0
  }, _ctx.currentRoomIndex > 0 ? {
    d: common_vendor.o((...args) => $options.prevRoom && $options.prevRoom(...args))
  } : {}, {
    e: _ctx.currentRoomIndex < _ctx.baseInfo.count - 1
  }, _ctx.currentRoomIndex < _ctx.baseInfo.count - 1 ? {
    f: common_vendor.o((...args) => $options.nextRoom && $options.nextRoom(...args))
  } : {
    g: common_vendor.o((...args) => $options.submitAll && $options.submitAll(...args))
  }, {
    h: $data.roomData.roomNumber,
    i: common_vendor.o(($event) => $data.roomData.roomNumber = $event.detail.value),
    j: $data.roomData.roomType,
    k: common_vendor.o(($event) => $data.roomData.roomType = $event.detail.value),
    l: common_vendor.o((...args) => $options.selectVideo && $options.selectVideo(...args)),
    m: common_vendor.f($data.roomData.videos, (video, idx, i0) => {
      return {
        a: common_vendor.t(idx + 1),
        b: common_vendor.t((video.size / 1024 / 1024).toFixed(2)),
        c: common_vendor.o(($event) => $options.deleteVideo(idx), idx),
        d: idx
      };
    }),
    n: common_vendor.o((...args) => $options.selectThumbnail && $options.selectThumbnail(...args)),
    o: $data.roomData.thumbnail
  }, $data.roomData.thumbnail ? {
    p: $data.roomData.thumbnail
  } : {}, {
    q: common_vendor.f($data.facilities, (facility, idx, i0) => {
      return {
        a: common_vendor.t(facility),
        b: idx,
        c: $data.roomData.facilities.includes(facility) ? 1 : "",
        d: common_vendor.o(($event) => $options.toggleFacility(facility), idx)
      };
    }),
    r: $data.roomData.paymentOptions.monthly,
    s: common_vendor.o(($event) => $data.roomData.paymentOptions.monthly = $event.detail.value),
    t: $data.roomData.paymentOptions.quarterly,
    v: common_vendor.o(($event) => $data.roomData.paymentOptions.quarterly = $event.detail.value),
    w: $data.roomData.paymentOptions.yearly,
    x: common_vendor.o(($event) => $data.roomData.paymentOptions.yearly = $event.detail.value)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/marker/addMarker/NextRoom.js.map
