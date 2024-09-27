export class IndexedDB {
    constructor(dbName, dbVersion) {
        this.db = null;
        this.dbName = dbName;
        this.dbVersion = dbVersion;
    }

    Open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.addEventListener('success', (event) => { this.OnSuccess(event, resolve); });
            request.addEventListener('error', (event) => { this.OnError(event, reject); });
            request.addEventListener('upgradeneeded', (event) => { this.OnUpgradeNeeded(event); });
        });
    }

    Clear() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(this.db.objectStoreNames, 'readwrite');

            let objectStore;
            let storeName;
            let clearRequest;
            let length = this.db.objectStoreNames.length;
            let i = 0;
            while (i < length) {
                storeName = this.db.objectStoreNames[i];
                objectStore = transaction.objectStore(storeName);
                clearRequest = objectStore.clear();
                clearRequest.onerror = function (event) {
                    console.error(`Error clearing object store:`, event.target.error);
                    reject(event.target.error);
                };

                i++;
            }

            transaction.oncomplete = function () {
                console.log('All object stores cleared.');
                resolve();
            };
            transaction.onerror = function (event) {
                console.error('Transaction error:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    Get(storeName, id = 1) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], "readonly");
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.get(id);

            request.onsuccess = (event) => {
                // console.log('success'); 
                resolve(event.target.result);
            };
            request.onerror = (event) => {
                // console.log("error"); 
                reject(event.target.error);
            };
        });
    }

    Put(storeName, data) {
        // const transaction = this.db.transaction([storeName], 'readwrite');
        // const objectStore = transaction.objectStore(storeName);
        // objectStore.put(data);
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const objectStore = transaction.objectStore(storeName);
            const request = objectStore.put(data);
            request.onsuccess = () => {
                // console.log("success");
                // resolve();
            };
            request.onerror = (event) => {
                // console.log("error");
                reject(event.target.error);
            };

            transaction.oncomplete = () => {
                // console.log("Transaction completed successfully.");
                resolve();
            };
            transaction.onerror = (event) => {
                // console.error("Transaction error:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    OnSuccess(event, resolve) {
        this.db = event.target.result;
        resolve();
    }

    OnError(event, reject) {
        console.error("데이터베이스를 열 수 없습니다:", event.target.error);
        reject(event.target.error);
    }

    OnUpgradeNeeded(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("CourseList")) {
            db.createObjectStore("CourseList", { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains("StepBook")) {
            db.createObjectStore("StepBook", { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains("MenteeCard")) {
            db.createObjectStore("MenteeCard", { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains("ApplyBook")) {
            db.createObjectStore("ApplyBook", { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains("PlayShelf")) {
            db.createObjectStore("PlayShelf", { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains("BookmarkCard")) {
            db.createObjectStore("BookmarkCard", { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains("MentoCard")) {
            db.createObjectStore("MentoCard", { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains("MenteeInfoList")) {
            db.createObjectStore("MenteeInfoList", { keyPath: 'id' });
        }
    }

    // OnCloseUpgradeNeeded(event) {
    //     const db = event.target.result;
    //     if (db.objectStoreNames.contains("CourseList")) {
    //         db.deleteObjectStore("CourseList");
    //     }
    //     if (db.objectStoreNames.contains("StepBook")) {
    //         db.deleteObjectStore("StepBook");
    //     }
    //     if (db.objectStoreNames.contains("MenteeCard")) {
    //         db.deleteObjectStore("MenteeCard");
    //     }
    //     if (db.objectStoreNames.contains("ApplyBook")) {
    //         db.deleteObjectStore("ApplyBook");
    //     }
    //     if (db.objectStoreNames.contains("PlayShelf")) {
    //         db.deleteObjectStore("PlayShelf");
    //     }
    //     if (db.objectStoreNames.contains("BookmarkCard")) {
    //         db.deleteObjectStore("BookmarkCard");
    //     }
    //     if (db.objectStoreNames.contains("MentoCard")) {
    //         db.deleteObjectStore("MentoCard");
    //     }
    //     if (db.objectStoreNames.contains("MenteeInfoList")) {
    //         db.deleteObjectStore("MenteeInfoList");
    //     }
    // }
}