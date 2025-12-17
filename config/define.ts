import { versionName, peerAddr } from "../config.json";
let _basePath = "/" + versionName;
let _apiUrl = "/api";
let _peerUrl = peerAddr;
let _dcConfig = {
  wssUrl: "wss://dcchain.baybird.cn",
  backWssUrl: "wss://dcchain.baybird.cn",
  appInfo: {
    appId: "dologin",
    appName: "dologin",
  },
};
let _APPThemeConfig = {
  appThemeAuthor: "DcChain",
};
let _DefChainId = 176;
if (
  typeof process !== "undefined" &&
  process.env &&
  process.env["NODE_ENV"].trim() === "development"
) {
  _basePath = "";
  _apiUrl = "http://192.168.31.31:9001/api";
  _dcConfig = {
    wssUrl: "ws://192.168.31.31:9944",
    backWssUrl: "ws://192.168.31.31:9944",
    appInfo: {
      appId: "dologin",
      appName: "dologin",
    },
  };
}
export const basePath = _basePath;
export const apiUrl = _apiUrl;
export const dcConfig = _dcConfig;
export const APPThemeConfig = _APPThemeConfig;
export const DefChainId = _DefChainId;
export const peerUrl = _peerUrl;
