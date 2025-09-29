"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "登录页面",
      showAccountLogin: false,
      // 是否显示账号登录表单
      account: "",
      // 账号
      password: "",
      // 密码
      agreement: false,
      // 是否同意协议
      canUsePhone: false,
      // 是否支持手机号授权
      isLandlord: false,
      // 是否为房东
      msg: "提示信息"
    };
  },
  onLoad() {
    common_vendor.wx$1.cloud.init({
      env: "prod-7g3ji5ui73a4702f",
      // 替换为你的实际环境ID
      traceUser: true
      // 是否记录用户访问
    });
  },
  methods: {
    ToMap1() {
      common_vendor.index.redirectTo({
        url: "/pages/marker/marker"
      });
    },
    openr() {
      this.msg = "成功登录";
      this.$refs.popup.open("center");
    },
    openLoing() {
      common_vendor.wx$1.login({
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:63", res.code);
          if (res.code) {
            common_vendor.index.request({
              url: "https://api.weixin.qq.com/sns/jscode2session",
              method: "GET",
              data: {
                appid: "wxb987e736434c92bd",
                secret: "c3bec3b7409f9c4f4bdc83f1197515a2",
                js_code: res.code,
                grant_type: "authorization_code"
              },
              success: (res2) => {
                common_vendor.index.__f__("log", "at pages/index/index.vue:77", res2);
                common_vendor.wx$1.setStorageSync("session_key", res2.data.session_key);
                common_vendor.wx$1.setStorageSync("openid", res2.data.openid);
                this.msg = "成功登录";
                this.$refs.popup.open("center");
              },
              fail(res2) {
                common_vendor.index.__f__("log", "at pages/index/index.vue:83", res2);
              }
            });
          }
        },
        fail: (res) => {
          common_vendor.index.__f__("log", "at pages/index/index.vue:88", res);
        }
      });
    },
    ToMap() {
      common_vendor.index.redirectTo({
        url: "/pages/map/map"
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
    a: common_assets._imports_0,
    b: common_vendor.o((...args) => $options.openLoing && $options.openLoing(...args)),
    c: common_vendor.o(($event) => $options.ToMap1()),
    d: common_assets._imports_1,
    e: common_vendor.t($data.msg),
    f: common_vendor.o((...args) => $options.ToMap && $options.ToMap(...args)),
    g: common_vendor.sr("popup", "1cf27b2a-0"),
    h: common_vendor.p({
      type: "bottom",
      ["border-radius"]: "10px 10px 0 0"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
