module tools {
    /**
     * 命令行工具类
     * CmdUtils类
     * made by cyj
     * create on 2021-02-22 20:23:22 
    */
    export class CmdUtils {

        public constructor() {
            
        }

        /**
         * 执行cmd 
         * cmd  需要执行的命令行
         * cwd  命令行在那个目录下运行（如果为全局可以为空）
         * showLog 是否显示命令行的输出
         * msgCallBack     命令行执行的回调
         * msgCallBackThisObj  命令行执行后调的this对象
         * 
        */
       public static execmd(cmd:string, cwd?:string, showLog?:boolean, msgCallBack?:(msg:string)=>any, msgCallBackThisObj?:any)
        {
            return new Promise((resolve, reject)=>{
            cwd = cwd || __dirname;
            console.log("执行： "+cmd)
            if(msgCallBack)msgCallBack.call(msgCallBackThisObj, "执行:"+cmd+" in "+cwd)
            let p = node.child_process.exec(cmd, {cwd:cwd}, (err, stdout, stderr)=>{
                let errstr = err ;
                if(errstr)
                {
                console.log("执行失败"+errstr);
                if(msgCallBack)msgCallBack.call(msgCallBackThisObj, "执行失败"+errstr)
                reject(errstr)
                }else{
                console.log("执行成功"+cmd);
                if(msgCallBack)msgCallBack.call(msgCallBackThisObj, "执行成功"+errstr)
                resolve(stdout);
                }	
            })
            if(showLog)
            {
                p.stdout.on('data', function(data) {
                console.log(data);
                if(msgCallBack)msgCallBack.call(msgCallBackThisObj, data)
                });
                p.stderr.on('data', function(data) {
                console.log("ERROR: "+data);
                if(msgCallBack)msgCallBack.call(msgCallBackThisObj, "ERROR: "+data)
                });
            }
            })

        }
    }
}