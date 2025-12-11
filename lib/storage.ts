import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      console.log("getItem", _key);
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      console.log("setItem", _key, value);
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      console.log("removeItem", _key);
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export default storage;
