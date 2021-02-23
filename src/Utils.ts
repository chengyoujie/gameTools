
import * as childprocess from "child_process";

  export function execmd(cmd:string, cwd:string, showLog?:boolean, msgCallBack?:(msg:string)=>any, msgCallBackThisObj?:any)
  {
    return new Promise((resolve, reject)=>{
      cwd = cwd || __dirname;
      console.log("执行： "+cmd)
      if(msgCallBack)msgCallBack.call(msgCallBackThisObj, "执行:"+cmd+" in "+cwd)
      let p = childprocess.exec(cmd, {cwd:cwd}, (err, stdout, stderr)=>{
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
  