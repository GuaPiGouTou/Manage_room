"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      fileID: "cloud://prod-7g3ji5ui73a4702f.7072-prod-7g3ji5ui73a4702f-1371216117/map/demo1.mp4",
      value: 0,
      range: [
        { value: 0, text: "月付" },
        { value: 1, text: "季付" },
        { value: 2, text: "半年付" },
        { value: 3, text: "年付" }
      ]
    };
  },
  // onLoad() {
  // 	   // 初始化云开发
  // 	    wx.cloud.init({
  // 	      env: 'prod-7g3ji5ui73a4702f', // 替换为你的实际环境ID
  // 	      traceUser: true // 是否记录用户访问
  // 	    })
  // },
  methods: {
    selectvideo() {
      common_vendor.wx$1.chooseMedia({
        count: 3,
        maxDuration: 60,
        success(res2) {
          common_vendor.index.__f__("log", "at pages/marker/marker.vue:80", res2.tempFiles[0].tempFilePath);
          common_vendor.index.__f__("log", "at pages/marker/marker.vue:82", res2.tempFiles[0].size);
          common_vendor.wx$1.cloud.uploadFile({
            cloudPath: "map/demo1.mp4",
            filePath: res2.tempFiles[0].tempFilePath,
            config: {
              env: "prod-7g3ji5ui73a4702f"
              // 微信云托管环境ID
            },
            success: console.log,
            fail: console.error
          });
        }
      });
    },
    getvideo() {
      common_vendor.wx$1.cloud.callFunction({
        // 要调用的云函数名称
        name: "setvideojson",
        // 传递给云函数的参数
        data: {
          x: 1,
          y: 2
        },
        success: (res2) => {
          common_vendor.index.__f__("log", "at pages/marker/marker.vue:105", res2);
        },
        fail: (err) => {
          common_vendor.index.__f__("log", "at pages/marker/marker.vue:110", res);
        },
        complete: () => {
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: _ctx.indicatorDots,
    b: _ctx.autoplay,
    c: _ctx.interval,
    d: _ctx.duration,
    e: $data.fileID,
    f: common_vendor.o((...args) => $options.selectvideo && $options.selectvideo(...args)),
    g: common_vendor.o((...args) => $options.getvideo && $options.getvideo(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/marker/marker.js.map
