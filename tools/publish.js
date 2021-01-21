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
    if(publishType == "debug")
    {
        debug();
    }else{
        release();
    }
}

async function release(){
    console.log("=====RELEASE====")
    console.log("开始编译 web")
    await execmd("egret publish", path.join(__dirname, "./../web/"));
    console.log("web编译完毕")
    console.log("开始打包应用")
    await execmd("electron-packager . --platform win32 --out release/ --ignore tools --ignore .vscode --ignore web  --ignore src --ignore release --icon icon.ico --app-version=1.0.0 --overwrite --asar", path.join(__dirname, "./../"));
    console.log("打包完毕")
}


async function debug(){
    console.log("=====DEBUG====")
    console.log("开始打包应用")
    await execmd("electron-packager . --platform win32 --out debug/ --ignore tools --ignore .vscode  --ignore src --ignore release --icon icon.ico --app-version=1.0.0 --overwrite --asar", path.join(__dirname, "./../"));
    console.log("打包完毕")
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