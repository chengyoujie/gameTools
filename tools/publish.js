var fs = require("fs");
var path = require("path")
var progress = require("process")
var childprocess = require("child_process");
for(let key in progress.argv)
{
	console.log("key: "+key+ " value:"+progress.argv[key]);
}
let publishType = process.argv[2];//debug 或者 release

publish();

async function publish(){
    if(publishType == "init")//初始化项目
    {
        console.log("开始安装依赖  比较耗时")
        await execmd("npm install", path.join(__dirname, "./../"));
        /**let modifyJsPath = path.join(__dirname, "./../node_modules/@egret/egret-webpack-bundler/lib/loaders/ts-loader", "ts-transformer.js");
        if(fs.existsSync(modifyJsPath))
        {
            let content = fs.readFileSync(modifyJsPath, "utf-8");
            content = content.replace(/if\s*\(node\.kind\s*===\s*ts\.SyntaxKind\.EnumDeclaration\)\s*\{\s*result\s*=\s*ts\.visitEachChild\(node,\s*visitor,\s*ctx\);\s*\}/gi, 
                `if (node.kind === ts.SyntaxKind.EnumDeclaration) {
                    // result = visitFunctionOrEnumDeclaration(node);
                    result = ts.visitEachChild(node, visitor, ctx);
                }`);
            fs.writeFileSync(modifyJsPath, content, "utf-8");
            console.log("修改 "+modifyJsPath+"成功");
        }else{
            console.log("没有找到 "+modifyJsPath+" 对应的路径")
        }**/

    }else if(publishType == "debug")
    {
        await execmd("tsc", path.join(__dirname, "./../"));
        debug();
    }else{
        await execmd("tsc", path.join(__dirname, "./../"));
        release();
    }
}

async function release(){
    console.log("=====RELEASE====")
    console.log("开始编译 web")
    await execmd("egret publish", path.join(__dirname, "./../web/"));
    console.log("web编译完毕")
    console.log("删除bin-release");
    removeDirSync(path.join(path.join(__dirname, "./../web/bin-release")));
    console.log("开始打包应用")
    await execmd("electron-packager . --platform win32 --out release/ --ignore tools --ignore .vscode --ignore lib --ignore web  --ignore src --ignore release --icon icon.ico --app-version=1.0.0 --overwrite --asar", path.join(__dirname, "./../"));
    console.log("打包完毕")
    let libFrom = path.join(__dirname, "./../lib");
    let libTo = path.join(__dirname, "./../release/gametools-win32-x64/lib");
    console.log("准备拷贝文件")
    copy(libFrom, libTo);
    console.log("打包结束");
}


async function debug(){
    console.log("=====DEBUG====")
    console.log("开始打包应用")
    await execmd("electron-packager . --platform win32 --out debug/ --ignore tools --ignore .vscode --ignore lib --ignore src --ignore release --icon icon.ico --app-version=1.0.0 --overwrite --asar", path.join(__dirname, "./../"));
    console.log("打包完毕")
    let libFrom = path.join(__dirname, "./../lib");
    let libTo = path.join(__dirname, "./../debug/gametools-win32-x64/lib");
    console.log("准备拷贝文件")
    copy(libFrom, libTo);
    console.log("打包结束");
}








///////////////////////////
//常用方法
//////////////////////////
/**拷贝文件 */
function copy(from, to){
    console.log("开始拷贝："+from+"->"+to);
    if(!fs.existsSync(from))
    {
        console.log("拷贝失败， 文件不存在："+from)
        return;
    }
    checkOrCreateDir(to);
    fs.copyFileSync(from, to);
    console.log("拷贝结束");
}
/**
 * 拷贝文件
 * @param url 
 * @param toUrl 
 * @param override 
 */
function copy(url, toUrl, override=true)
{
    if(!fs.existsSync(url))
    {
        console.log("拷贝失败：没有找到"+url);
        return;
    }
    var stats = fs.statSync(url);
    if (stats.isDirectory()) {
        url = path.normalize(url); 
        walkDir(url, (walkUrl)=>{
            let walkToUrl = walkUrl.replace(url, toUrl);
            copyFileSync(walkUrl, walkToUrl, override);
        });
    }else{
        copyFileSync(url, toUrl, override);
    }
}

/**
 * 同步拷贝文件
 * @param url 
 * @param toUrl 
 * @param override 
 */
function copyFileSync(url, toUrl, override=true)
{
    if(!override && fs.existsSync(toUrl))return;
    checkOrCreateDir(toUrl);
    if(fs.copyFileSync)//有的版本的nodejs可能没有这个方法导致报错
    {
        fs.copyFileSync(url, toUrl);
    }else{
        let data = fs.readFileSync(url);
        fs.writeFileSync(toUrl, data);
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
    } else {
        if(onFile) onFile.call(thisObj,url);
    }
}/**
    * 删除文件或文件将
    * @param url 
    */
function removeDirSync(url) {
    var files = [];
    if (fs.existsSync(url)) {
        files = fs.readdirSync(url);
        files.forEach(function(file, index) {
            var subUrl = path.join(url, file);
            if (fs.statSync(subUrl).isDirectory()) { // recurse
                removeDirSync(subUrl);
            } else { // delete file
                fs.unlinkSync(subUrl);
            }
        });
        fs.rmdirSync(url);
    }
}

/**创建新的文件夹 */
function checkOrCreateDir(filePath)
{
    filePath = path.normalize(filePath);
    let arr = path.parse(filePath).dir.split(path.sep);
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

function execmd(cmd, cwd)
{
	return new Promise((resolve, reject)=>{
		cwd = cwd || __dirname;
		console.log("执行： "+cmd)
		let p = childprocess.exec(cmd, {cwd:cwd}, (err, stdout, stderr)=>{
			let errstr = err ;
			if(errstr)
			{
				console.log("ERROR: "+errstr+"");
				resolve(errstr)
			}else{
				console.log("执行成功"+cmd);
				resolve(stdout);
			}	
		})
        p.stdout.on('data', function(data) {
            console.log(data);
        });
        p.stderr.on('data', function(data) {
            console.log("ERROR:"+data+"");
        });
	})
}