
/**
 * 自动刷新 default.res.json 的工具
 * @author wizardc
 */

const fs = require("fs");
const path = require("path");

function getAllFile(fileDir, ext, subfolder = true) {
    fileDir = path.normalize(fileDir);
    let result = [];
    let extList;
    if (ext) {
        extList = ext.split("|");
        extList = extList.map(v => {
            return v.toLowerCase();
        });
    }
    fileExplore(result, fileDir, extList, subfolder);
    return result;
}

function fileExplore(list, fileDir, ext, subfolder) {
    if (fileDir.indexOf("longText") >= 0) return;
    let files = fs.readdirSync(fileDir);
    files.forEach((filename) => {
        let filePath = path.join(fileDir, filename);
        let stats = fs.statSync(filePath);
        let isFile = stats.isFile();
        let isDir = stats.isDirectory();
        if (isFile) {
            if (!ext) {
                list.push(filePath);
            }
            else {
                let extName = path.extname(filePath).toLowerCase().substr(1);
                if (ext.indexOf(extName) != -1) {
                    list.push(filePath);
                }
            }
        }
        if (subfolder && isDir) {
            let name = path.basename(filePath);
            if (name != ".svn") {
                fileExplore(list, filePath, ext, subfolder);
            }
        }
    });
}

const typeMap = {
    ".jpg": "image",
    ".png": "image",
    ".webp": "image",
    ".json": "json",
    ".fnt": "font",
    ".mp3": "sound",
    ".wav": "sound",
    ".ogg": "sound",
    ".txt": "text",
    ".xml": "text",
    ".exml": "text"
};

function hasInClude(path, excludes) {
    if (path) {
        for (let p of excludes) {
            if (path.indexOf(p) >= 0) return true;
        }
    }
    return false;
}

class Main {
    static main(...args) {
        let main = new Main();
        main.start(args[0], args[1], args[2], args[3]);
    }

    start(jsonPath, resourcePath, groupPath, assetsExt) {
        var excludes = assetsExt ? ['assets_' + assetsExt + "/", 'config'] : ['assets/', 'config'];
        jsonPath = path.normalize(jsonPath);
        resourcePath = path.normalize(resourcePath);

        let groups;
        if (groupPath && fs.existsSync(groupPath)) {
            groups = JSON.parse(fs.readFileSync(groupPath, { encoding: "utf8" })).groups;
        } else {
            groups = JSON.parse(fs.readFileSync(jsonPath, { encoding: "utf8" })).groups;
        }
        let resources = [];
        let filePathList = getAllFile(resourcePath);
        for (let i = 0, len = filePathList.length; i < len; i++) {
            let filePath = filePathList[i];
            filePath = this.getUrl(filePath, resourcePath);
            if (!hasInClude(filePath, excludes)) continue;
            let name = path.basename(filePath);
            let ext = path.extname(filePath);
            if (name == "default.res.json" || name == "default.thm.json" || ext == ".exml") {
                continue;
            }
            this.processFile(resources, filePath, name, ext);
        }
        this.processSheet(resources, resourcePath);
        if (assetsExt) {
            var index = resources.findIndex(item => item.name == 'lanJson_' + assetsExt + '_json');
            if (index >= 0) {
                let fileUrl = resources[index].url;
                resources.splice(index, 1);
                let index1 = resources.findIndex(item => item.name == 'lanJson_json');
                if (index1 >= 0) {
                    resources[index1].url = fileUrl;
                    resources[index1].name = 'lanJson_' + assetsExt + '_json';
                }
            }
            index = resources.findIndex(item => item.name == 'config_' + assetsExt + '_zzp');
            if (index >= 0) {
                let fileUrl = resources[index].url;
                resources.splice(index, 1);
                let index1 = resources.findIndex(item => item.name == 'config_zzp');
                if (index1 >= 0) {
                    resources[index1].url = fileUrl;
                    resources[index1].name = 'config_' + assetsExt + '_zzp';
                }
            }
            index = resources.findIndex(item => item.name == 'randName_' + assetsExt + '_json');
            if (index >= 0) {
                let fileUrl = resources[index].url;
                resources.splice(index, 1);
                let index1 = resources.findIndex(item => item.name == 'randName_json');
                if (index1 >= 0) {
                    resources[index1].url = fileUrl;
                    resources[index1].name = 'randName_' + assetsExt + '_json';
                }
            }
            let gIndex = groups.findIndex(item => item.name == 'preload');
            if (gIndex >= 0) {
                groups[gIndex].keys = groups[gIndex].keys.replace('lanJson_json', 'lanJson_' + assetsExt + '_json');
                groups[gIndex].keys = groups[gIndex].keys.replace('config_zzp', 'config_' + assetsExt + '_zzp');
                groups[gIndex].keys = groups[gIndex].keys.replace('randName_json', 'randName_' + assetsExt + '_json');
            }
        }
        fs.writeFileSync(jsonPath, JSON.stringify({ groups, resources }));
        console.log("default.res.json 处理完毕！");
        var duplicates = this.checkDuplicateNames(resources);
        console.log('检测重名：');
        if (duplicates) {
            duplicates.forEach(value => {
                console.log(value);
            })
        }
    }

    checkDuplicateNames(resources) {
        var duplicates = [];
        while (resources.length > 0) {
            var r = resources.shift();
            if (r.type == 'sheet') {
                var subkeys = r.subkeys;
                subkeys = subkeys.split(',');
                for (var i = 0; i < subkeys.length; i++) {
                    var hasO = this.hasInRes(resources, subkeys[i]);
                    if (hasO) {
                        var endStr = hasO.type == 'sheet' ? '图集：' + hasO.name + "中：" + subkeys[i] : hasO.url;
                        duplicates.push('图集：' + r.name + "中：" + subkeys[i] + "与" + endStr + "重名");
                    }
                }
            } else {
                var hasO = this.hasInRes(resources, r.name);
                if (hasO) {//有重名
                    var endStr = hasO.type == 'sheet' ? '图集：' + hasO.name + "中：" + r.name : hasO.url;
                    duplicates.push(r.url + "与" + endStr + "重名");
                }
            }
        }
        return duplicates;
    }

    hasInRes(resources, resName) {
        for (var i = 0; i < resources.length; i++) {
            var o = resources[i];
            if (o.type == 'sheet') {
                var subkeys = o.subkeys;
                subkeys = subkeys.split(',');
                for (var j = 0; j < subkeys.length; j++) {
                    if (resName == subkeys[j]) {
                        return o;
                    }
                }
            } else {
                if (resName == o.name) {
                    return o;
                }
            }
        }
        return undefined;
    }

    getUrl(filePath, resourcePath) {
        filePath = path.normalize(filePath);
        filePath = filePath.replace(resourcePath + "\\", "");
        filePath = filePath.replace(/\\/g, "/");
        return filePath;
    }

    processFile(resources, url, name, ext) {
        let type = typeMap[ext] || "bin";
        name = name.replace(/\./g, "_");

        resources.push({
            url,
            type,
            name,
        });
    }

    processSheet(resources, resourcePath) {
        for (let i = 0; i < resources.length; i++) {
            let resource = resources[i];
            if (resource.type == "json") {
                let jsonPath = path.join(resourcePath, resource.url);
                let data;
                try {
                    data = JSON.parse(fs.readFileSync(jsonPath, { encoding: "utf8" }));
                } catch (error) {
                    console.error(`json格式错误：${jsonPath}`);
                    continue;
                }
                if (data.file && data.frames) {
                    let imagePath = path.join(path.dirname(jsonPath), data.file);
                    if (fs.existsSync(imagePath)) {
                        let index = this.findByUrl(resources, this.getUrl(imagePath, resourcePath));
                        if (index != -1) {
                            resource.type = "sheet";
                            let subkeys = [];
                            for (let key in data.frames) {
                                subkeys.push(key);
                            }
                            resource.subkeys = subkeys.join(",");
                            resources.splice(index, 1);
                            i--;
                        }
                    }
                }
            }
        }
    }

    findByUrl(resources, url) {
        for (let i = 0, len = resources.length; i < len; i++) {
            let resource = resources[i];
            if (resource.url == url) {
                return i;
            }
        }
        return -1;
    }
}

let args = process.argv.splice(2);
console.log(args);
Main.main(...args);
