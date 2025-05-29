
let _baseUrl = '/v0_0_1'
if (process.env.NODE_ENV === 'development') {
  _baseUrl =''
}
console.log('_baseUrl === ', _baseUrl)
export const apiUrl = 'http://127.0.0.1:9001/api';
export const baseUrl = _baseUrl;