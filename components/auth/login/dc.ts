// lib/dc-init.js
let dcInstance = null;

export const initDC = async (dcConfig) => {
  if (dcInstance) return dcInstance;

  const { DC } = await import("web-dc-api");
  const dc = new DC(dcConfig);
  const startTime = Date.now();
  const res = await dc.init();
  console.log(`DC init time: ${Date.now() - startTime}ms`);
  if (!res) {
    console.error("DC init failed");
    return null;
  }
  console.log(`DC init success`);

  dcInstance = dc;
  return dc;
};

export const getDC = () => {
  if (!dcInstance) {
    console.warn("DC not initialized yet");
  }
  return dcInstance;
};
export const checkDCInitialized = async () => {
  const MAX_WAIT_TIME = 10000; // 10秒超时
  const CHECK_INTERVAL = 500; // 500ms检查一次

  return new Promise<any>((resolve) => {
    let elapsedTime = 0;

    const checkInitialized = () => {
      // 检查是否超时
      if (elapsedTime >= MAX_WAIT_TIME) {
        console.warn("DC初始化超时");
        resolve(null);
        return;
      }

      // 检查实例是否存在
      if (dcInstance) {
        resolve(dcInstance);
        return;
      }

      // 继续轮询
      elapsedTime += CHECK_INTERVAL;
      setTimeout(checkInitialized, CHECK_INTERVAL);
    };

    // 立即开始第一次检查
    checkInitialized();
  });
};
