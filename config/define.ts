import { versionName } from "../version.json";
let _basePath = '/' + versionName;
let _apiUrl = '/api';
let _dcConfig = {
    wssUrl: 'wss://dcchain.baybird.cn',
    backWssUrl: 'wss://dcchain.baybird.cn',
}
if (typeof process !== 'undefined' && process.env && process.env['NODE_ENV'].trim() === 'development') {
    _basePath = '';
    _apiUrl = 'http://192.168.31.31:9001/api';
    _dcConfig = {
        wssUrl: 'ws://192.168.31.31:9944',
        backWssUrl: 'ws://192.168.31.31:9944',
    }
}
export const basePath = _basePath;
export const apiUrl = _apiUrl;
export const dcConfig = _dcConfig;