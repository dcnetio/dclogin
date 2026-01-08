// @ts-ignore (如果 TS 报错找不到模块，可以忽略或者在 d.ts 里声明一下)
import configInfo from "@app-config";
console.log("环境", configInfo);
export const basePath = configInfo.basePath;
export const apiUrl = configInfo.apiUrl;
export const dcConfig = configInfo.dcConfig;
export const APPThemeConfig = configInfo.APPThemeConfig;
export const DefChainId = configInfo.DefChainId;
export const peerUrl = configInfo.peerAddr;
