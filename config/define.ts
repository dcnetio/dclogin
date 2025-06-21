let _basePath = '/v0_0_8';
let _apiUrl = 'https://wallet.dcnetio.com/api';
let _dcConfig = {
    wssUrl: 'wss://dcchain.baybird.cn',
    backWssUrl: 'wss://dcchain.baybird.cn',
}
// if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
//     _basePath = '';
//     _apiUrl = 'http://localhost:9001/api';
//     _dcConfig = {
//         wssUrl: 'ws://192.168.31.31:9944',
//         backWssUrl: 'ws://192.168.31.31:9944',
//     }
// }
export const basePath = _basePath;
export const apiUrl = _apiUrl;
export const dcConfig = _dcConfig;