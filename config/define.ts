let _basePath = '/v0_0_2';
if(process.env.NODE_ENV === 'development') {
    _basePath = '';
}
export const basePath = _basePath;
export const apiUrl = 'https://wallet.dcnetio.com/api';