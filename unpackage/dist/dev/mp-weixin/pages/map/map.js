"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      msg: "demo",
      data: null,
      latitude: 1,
      longitude: 1,
      old_latitude: 1,
      old_longitude: 1,
      inclde_covers: [{
        id: 1,
        latitude: 1,
        longitude: 1,
        iconPath: "../../static/map/redMarker.png",
        callout: {
          content: "",
          textAlign: "center",
          color: "#00aa00",
          borderRadius: 10,
          borderWidth: 2,
          display: "ALWAYS"
        },
        label: {
          content: "当前位置",
          x: 100,
          color: "#FB3109"
        },
        width: 30,
        height: 30
      }],
      covers: [{
        id: 1,
        latitude: 1,
        longitude: 1,
        iconPath: "../../static/map/redMarker.png",
        callout: {
          content: "",
          textAlign: "center",
          color: "#00aa00",
          borderRadius: 10,
          borderWidth: 2,
          display: "ALWAYS"
        },
        label: {
          content: "当前位置",
          x: 100,
          color: "#FB3109"
        },
        width: 30,
        height: 30
      }],
      controls: [{
        id: 1,
        position: {
          left: 10,
          top: 570,
          width: 30,
          height: 30
        },
        iconPath: "/static/map/currentLocation_bule.png",
        clickable: true
      }]
    };
  },
  onLoad() {
    common_vendor.wx$1.cloud.init({
      env: "prod-7g3ji5ui73a4702f",
      // 替换为你的实际环境ID
      traceUser: true
      // 是否记录用户访问
    });
    const res = common_vendor.wx$1.cloud.callContainer({
      "config": {
        "env": "prod-7g3ji5ui73a4702f"
      },
      "path": "/api/count",
      "header": {
        "X-WX-SERVICE": "springboot-x535"
      },
      "method": "POST",
      "data": {
        "action": "inc"
      }
    });
    common_vendor.index.__f__("log", "at pages/map/map.vue:107", res);
    this.getSetting();
    this.getAllMark();
  },
  refreshMarkers() {
    this.getAllMark();
  },
  onPullDownRefresh() {
    this.getAllMark();
    setTimeout(() => {
      common_vendor.index.stopPullDownRefresh();
    }, 3e3);
  },
  onShow() {
    if (common_vendor.wx$1.canIUse("hideHomeButton")) {
      common_vendor.wx$1.hideHomeButton();
    }
  },
  methods: {
    //选择视频
    selectviode() {
      common_vendor.wx$1.chooseMedia({
        count: 3,
        mediaType: ["video"],
        maxDuration: 60,
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/map/map.vue:137", res);
          common_vendor.index.__f__("log", "at pages/map/map.vue:138", res.tempFiles[0].size / 1048576);
          common_vendor.index.__f__("log", "at pages/map/map.vue:139", "chooseMedia_Success");
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/map/map.vue:143", "chooseMedia");
        }
      });
    },
    //点击刷新
    startrefresh() {
      common_vendor.index.startPullDownRefresh();
    },
    // 将 API 数据转换为地图标记格式
    convertApiDataToMarkers(apiData) {
      return apiData.map((item) => {
        return {
          id: item.id,
          // 使用 API 返回的 id
          latitude: item.latitude,
          // 使用 API 返回的 latitude
          longitude: item.longitude,
          // 使用 API 返回的 longitude
          iconPath: "../../static/map/buleMarker.png",
          // 根据 ID 获取图标
          callout: {
            content: item.title + "(" + item.count + ")",
            // 使用 API 返回的 title
            textAlign: "center",
            color: "#00aa00",
            borderRadius: 10,
            borderWidth: 2,
            display: "ALWAYS"
          },
          width: 30,
          height: 30
        };
      });
    },
    //获取所有标记
    getAllMark() {
      const res = common_vendor.wx$1.cloud.callContainer({
        "config": {
          "env": "prod-7g3ji5ui73a4702f"
        },
        "path": "/api/mark/get",
        "header": {
          "X-WX-SERVICE": "springboot-x535",
          "content-type": "application/json"
        },
        "method": "GET"
      });
      common_vendor.index.__f__("log", "at pages/map/map.vue:189", res);
      res.then((response) => {
        if (response.statusCode === 200) {
          if (response.data.code === "200") {
            common_vendor.index.__f__("log", "at pages/map/map.vue:195", "操作成功:", response.data.msg);
            this.data = this.convertApiDataToMarkers(response.data.data);
            this.covers.push(...this.data);
            common_vendor.index.__f__("log", "at pages/map/map.vue:199", this.covers);
          } else {
            common_vendor.index.__f__("error", "at pages/map/map.vue:201", "业务错误:", response.data.msg);
            this.$refs.error.open("center");
          }
        } else {
          common_vendor.index.__f__("error", "at pages/map/map.vue:206", "HTTP 错误:", response.statusCode);
        }
      }).catch((error) => {
        common_vendor.index.__f__("error", "at pages/map/map.vue:210", "标记请求失败:", error);
      });
    },
    //当前位置定位
    getSetting() {
      common_vendor.wx$1.getSetting({
        success: (res) => {
          if (!res.authSetting["scope.userLocation"]) {
            common_vendor.wx$1.authorize({
              scope: "scope.userLocation",
              success: () => {
                this.fetchLocation();
              }
            });
          } else {
            this.fetchLocation();
          }
        }
      });
    },
    fetchLocation() {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          this.old_latitude = res.latitude;
          this.old_longitude = res.longitude;
          this.inclde_covers[0] = {
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: "../../static/map/redMarker.png",
            width: 30,
            height: 30,
            callout: {
              content: "",
              textAlign: "center",
              color: "#00aa00",
              borderRadius: 10,
              borderWidth: 2,
              display: "ALWAYS"
            },
            label: {
              content: "当前位置",
              x: -25,
              color: "#FB3109"
            }
          };
          this.covers[0] = this.inclde_covers[0];
          common_vendor.index.__f__("log", "at pages/map/map.vue:263", "坐标设置完毕");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/map/map.vue:266", "定位失败:", err);
        }
      });
    },
    returnPostion() {
      common_vendor.index.__f__("log", "at pages/map/map.vue:271", "cz");
      this.covers[0] = null;
      this.inclde_covers[0] = null;
      common_vendor.index.__f__("log", "at pages/map/map.vue:274", this.latitude + "\n" + this.longitude);
      this.fetchLocation();
    },
    TapMarker(e) {
      common_vendor.index.__f__("log", "at pages/map/map.vue:278", e.markerId);
      common_vendor.wx$1.navigateTo({
        url: "/pages/marker/marker?id=" + e.markerId,
        fail(e2) {
          common_vendor.index.__f__("log", "at pages/map/map.vue:282", e2);
        }
      });
    },
    addmarker() {
      common_vendor.index.navigateTo({
        url: "/pages/marker/addMarker/addMarker"
      });
    }
    //----------------methods方法分割线-------------------
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.longitude,
    b: $data.latitude,
    c: $data.covers,
    d: $data.inclde_covers,
    e: common_vendor.o((...args) => $options.TapMarker && $options.TapMarker(...args)),
    f: $data.controls,
    g: common_vendor.o((...args) => $options.returnPostion && $options.returnPostion(...args)),
    h: common_vendor.o((...args) => $options.TapMarker && $options.TapMarker(...args)),
    i: common_vendor.o((...args) => $options.addmarker && $options.addmarker(...args)),
    j: common_vendor.o((...args) => $options.startrefresh && $options.startrefresh(...args)),
    k: common_vendor.o((...args) => $options.selectviode && $options.selectviode(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/map/map.js.map
