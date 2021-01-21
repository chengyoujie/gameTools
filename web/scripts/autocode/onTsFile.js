/**
 * egret AutoCodeEui 初始化
 * 默认配置如果是ts文件按下F12会执行此条命令（autocode.config.js  可以用 >Egret AutoCode  打开生成代码配置 打开编辑)
 * 输出当前文件的选择内容
 */
var fs = require("fs");
var path = require("path");
var progress = require("process");
console.log("开始解析ts文件");
console.log("===输入参数====");
for(let key in progress.argv)
{
	console.log("key: "+key+ " value:"+progress.argv[key]);
}
let url = progress.argv[2];
let selectStart = progress.argv[3];
let selectEnd = progress.argv[4];
if(!fs.existsSync(url))
{
    console.log("没有找到："+url);
    return;
}
let txt = fs.readFileSync(url, "utf-8");
if(!txt || !txt.replace(/\/\/\s*TypeScript\s*file/gi, ""))//空的文本
{
    let pinfo = path.parse(url);
    let clsName = pinfo.name.replace(/\.\w+$/, "");
    clsName = clsName.charAt(0).toUpperCase()+clsName.substr(1);
    let content = 
    `module tools {
        /**
         * 
         * ${clsName}类
         * made by 
         * create on ${getDateStr()} 
        */
        export class ${clsName} {

            public constructor() {
                
            }

        }
}`
    fs.writeFileSync(url, content, "utf-8");
    // let selectTxt = txt.substring(selectStart, selectEnd);
    // console.log("选中文本： "+selectTxt);
}else{
    console.log("文件内容为空： "+url);
}


function getDateStr(format)
    {
        format = format?format:"yyyy-MM-dd hh:mm:ss";
        let date = new Date();
        var dateReg = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S+": date.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in dateReg) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? dateReg[k] : ("00" + dateReg[k]).substr(("" + dateReg[k]).length));
                }
        }
        return format;
    }