const { Storage } = require("@google-cloud/storage");
const { DataSource } = require("apollo-datasource");
const DataLoader = require("dataloader");
var fs = require("fs");
var path = require("path");

const storage = new Storage({});
const bucket = storage.bucket("sifas-site.appspot.com");

const IS_PROD = process.env.NODE_ENV === "production";

class JSONDataSource extends DataSource {
    constructor() {
        super();
        this.loader = new DataLoader(async (ids) => {
            var ret = [];
            for (let filePath of ids) {
                let readStream = fs.createReadStream(
                    path.join(__dirname, "../", "data", filePath)
                );
                let data = "";
                for await (const chunk of readStream) {
                    data += chunk;
                }
                ret.push(JSON.parse(data));
            }
            return Promise.resolve(ret);
        });
        this.memoizedResults = new Map();
    }

    initialize({ context, cache } = {}) {
        this.context = context;
    }

    cacheKey(path, key) {
        if (key) {
            return `json-pk-${path}-${key}`;
        }
        return `json-p-${path}`;
    }

    async getJSON(filePath) {
        const ckey = this.cacheKey(filePath);

        if (this.memoizedResults.has(ckey)) {
            return this.memoizedResults.get(ckey);
        }

        const dataPromise = this.loader.load(filePath);
        this.memoizedResults.set(ckey, dataPromise);
        const data = await dataPromise;
        return data;
    }

    async getObject(objPath, objKey) {
        const dataMap = await this.getJSON(`${objPath}/all.json`);
        return objKey !== undefined ? dataMap[objKey + ""] : dataMap;
    }
}

const readJSON = async (filePath) => {
    // if (filePath in localStore) {
    //     return localStore[filePath];
    // }
    var readStream;
    // if (process.env.NODE_ENV === "development") {
    readStream = fs.createReadStream(
        path.join(__dirname, "../", "data", filePath)
    );
    // } else {
    //     var file = bucket.file(filePath);
    //     readStream = file.createReadStream();
    // }
    var data = "";
    for await (const chunk of readStream) {
        data += chunk;
    }
    const result = JSON.parse(data);
    // localStore[filePath] = result;
    return result;
    // return new Promise((resolve, reject) => {
    //     readStream
    //         .on("data", (chunk) => (data += chunk))
    //         .on("end", () => {
    //             var result = JSON.parse(data);
    //             localStore[filePath] = result;
    //             resolve(result);
    //         })
    //         .on("error", (error) => reject(error));
    // });
};

const content = (contentPath) => {
    return IS_PROD
        ? `https://content.sifas.guru/${contentPath}`
        : `http://localhost:8080/${contentPath}`;
};

exports.JSONDataSource = JSONDataSource;
exports.content = content;
