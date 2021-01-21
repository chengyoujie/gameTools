var fs = require("fs")
var path = require("path")

let from = path.normalize("D:/nodejs/electron/goddess2/node_modules/@types/node");
let root  = path.normalize("E:/Electron/gametools/web/libs/node");
let modules = [];

walkDir(from, (url)=>{
    let pinfo = path.parse(url);
    if(pinfo.ext != ".ts")
    {
        // fs.writeFileSync(path.join(root, pinfo.name+pinfo.ext), content, "utf-8");
        return;
    }
    let content = fs.readFileSync(url, "utf-8");
    let declareReg = /declare\s+module\s+['"](\w+)['"]\s*\{/gi;
    if(!declareReg.test(content) || pinfo.dir.indexOf("ts3.") != -1)
    {
        let newurl = url.replace(from, root);
        checkOrCreateDir(newurl);
        fs.writeFileSync(newurl, content, "utf-8");
        return;
    }
    declareReg.lastIndex = -1;
    let arr ;
    content.replace(/\n/g, "\n\t");
    while(arr = declareReg.exec(content))
    {
            if(modules.indexOf(arr[1]) == -1)
            {
                modules.push(arr[1]);
            }
        content = content.replace(arr[0], "declare namespace node { \n namespace "+arr[1]+" {");
        content = content + "}";
    }
    content = content.replace(/(export\s*=\s*\w+)/gi, "//$1");
    content = content.replace(/(import\s+\*\s+as\s+(\w+)\s+from\s+['"]\2['"])/gi, "//$1");//import * as events from "events";形式的去掉
    let importClsReg = /import\s+\{(.*?)\}\s+from\s+['"](\w+)['"]\s*;*/gi;//对如：import { Writable, Readable, Stream, Pipe } from "stream"; 形式的解析
    while(arr = importClsReg.exec(content))
    {
        let clsArr = arr[1].split(",");
        let clsPack = arr[2];
        let repStr = "";
        for(let i=0; i<clsArr.length; i++)
        {
            let clsName = clsArr[i].trim();
            repStr = "let "+clsName+" = "+clsPack+"."+clsName+";\n";
        }
        content = content.replace(arr[0], repStr)
    }
    let newurl = url.replace(from, root);
    checkOrCreateDir(newurl);
    fs.writeFileSync(newurl, content, "utf-8");
})
console.log("查找到所有模块")
console.log(JSON.stringify(modules))
console.log("执行完毕")




function checkOrCreateDir(filePath)
{
	filePath = path.normalize(filePath);
	let pinfo = path.parse(filePath);
	let arr = pinfo.dir.split(path.sep);
	if(pinfo.base.indexOf(".") == -1)//名字中没有.的按照文件夹处理
	{
		arr.push(pinfo.base);
	}
	if(!arr || arr.length == 0)return;
	let dirpath = arr[0];
	for(let i=1; i<arr.length; i++)
	{
		dirpath = dirpath + path.sep+arr[i];
		if(!fs.existsSync(dirpath))
		{
			fs.mkdirSync(dirpath);
		}
	}
}


function walkDir(url,onFile,onDir,thisObj) {
    url = path.normalize(url);
    var stats = fs.statSync(url);
    if (stats.isDirectory()) {
        if(onDir) onDir.call(thisObj,url);
        var files = fs.readdirSync(url);
        for (var i = 0, len = files.length; i < len; i++) {
            walkDir(path.join(url,files[i]),onFile,onDir,thisObj);
        }
        return true;
    } else {
        if(onFile) onFile.call(thisObj,url);
        return false;
    }
}