class IndexedDBHelper {  
    constructor(dbName, storeConfigs, version = 1) {  
        this.dbName = dbName;  
        this.storeConfigs = storeConfigs; // Array of store configurations  
        this.version = version;  
        this.db = null;  
    }  

    // 打开数据库  
    open() {  
        return new Promise((resolve, reject) => {  
            const request = indexedDB.open(this.dbName, this.version);  

            request.onupgradeneeded = (event) => {  
                this.db = event.target.result;  
                this.storeConfigs.forEach(config => {  
                    if (!this.db.objectStoreNames.contains(config.name)) {  
                        const store = this.db.createObjectStore(config.name, { keyPath: config.keyPath, autoIncrement: config.autoIncrement });  
                        if (config.indexes) {  
                            config.indexes.forEach(index => {  
                                store.createIndex(index.name, index.keyPath, { unique: index.unique });  
                            });  
                        }  
                    }  
                });  
            };  

            request.onsuccess = (event) => {  
                this.db = event.target.result;  
                resolve(this.db);  
            };  

            request.onerror = (event) => {  
                reject(`数据库打开失败: ${event.target.errorCode}`);  
            };  
        });  
    }  

    // 添加数据  
    addData(storeName, data) {  
        return new Promise((resolve, reject) => {  
            const transaction = this.db.transaction(storeName, 'readwrite');  
            const store = transaction.objectStore(storeName);  
            const request = store.add(data);  

            request.onsuccess = () => {  
                resolve('数据添加成功');  
            };  

            request.onerror = () => {  
                reject('数据添加失败');  
            };  
        });  
    }  

    // 修改数据  
    updateData(storeName, data) {  
        return new Promise((resolve, reject) => {  
            const transaction = this.db.transaction(storeName, 'readwrite');  
            const store = transaction.objectStore(storeName);  
            const request = store.put(data);  

            request.onsuccess = () => {  
                resolve('数据更新成功');  
            };  

            request.onerror = () => {  
                reject('数据更新失败');  
            };  
        });  
    }  

    // 删除数据  
    deleteData(storeName, key) {  
        return new Promise((resolve, reject) => {  
            const transaction = this.db.transaction(storeName, 'readwrite');  
            const store = transaction.objectStore(storeName);  
            const request = store.delete(key);  

            request.onsuccess = () => {  
                resolve('数据删除成功');  
            };  

            request.onerror = () => {  
                reject('数据删除失败');  
            };  
        });  
    }  

    // 查询数据  
    getData(storeName, key) {  
        return new Promise((resolve, reject) => {  
            const transaction = this.db.transaction(storeName, 'readonly');  
            const store = transaction.objectStore(storeName);  
            const request = store.get(key);  

            request.onsuccess = () => {  
                resolve(request.result);  
            };  

            request.onerror = () => {  
                reject('读取数据失败');  
            };  
        });  
    }  

    // 查询所有数据  
    getAllData(storeName) {  
        return new Promise((resolve, reject) => {  
            const transaction = this.db.transaction(storeName, 'readonly');  
            const store = transaction.objectStore(storeName);  
            const request = store.getAll();  

            request.onsuccess = () => {  
                resolve(request.result);  
            };  

            request.onerror = () => {  
                reject('读取所有数据失败');  
            };  
        });  
    }  

    // 根据索引查询数据  
    queryData(storeName, indexName, queryValue) {  
        return new Promise((resolve, reject) => {  
            const transaction = this.db.transaction(storeName, 'readonly');  
            const store = transaction.objectStore(storeName);  
            const index = store.index(indexName);  
            const request = index.getAll(queryValue);  

            request.onsuccess = () => {  
                resolve(request.result);  
            };  

            request.onerror = () => {  
                reject('查询数据失败');  
            };  
        });  
    }  
}  


export default IndexedDBHelper;