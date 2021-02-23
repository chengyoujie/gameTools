module tools {
    /**
     * 
     * ProcessMsgManager类
     * made by 
     * create on 2021-02-22 14:08:29 
    */
    export class ProcessMsgManager {

        public constructor() {
            this.init();    
        }

        private init(){
            let s = this;
            Electron.ipcRenderer.on("mainSendMsg", (evt, ...args)=>{
                s.handleMainMsg.apply(s, args);
                evt.returnValue  = true;
            });
        }

        private handleMainMsg(type:Main2RenderMsgType, msg:any){
            console.log("收到消息"+type+" data: "+msg);
            let s  = this;
            switch(type)
            {
                case Main2RenderMsgType.EgretBuild:
                   s.handleRunEgretBuild();
                break;
                case 11:
                console.log("测试：：：：：："+msg);
                break;
            }
        }

        /**编译项目 */
        private handleRunEgretBuild(){
            let view = ui.show(CmdTipView);
            view.resetText();
            view.appendText("<font color='#FFFF00'>开始编译项目</font>")
            CmdUtils.execmd("egret build ", node.path.join(ToolsApp.rootPath, "web"), true, 
            (msg:string)=>{//消息同步到渲染进程
              view.appendText("<font color='#FFFF00'>"+msg+"</font>")
            })
            .then(()=>{//编译完成
              view.appendText("<font color='#00ff00'>编译成功</font>");
              loopMgr.once(()=>{
                window.location.reload();
              }, this, 800);
            })
            .catch((reson)=>{
              view.appendText("<font color='#ff0000'>编译失败</font>");
            })
        }

        public sendToMain(type:Render2MainMsgType, data:any)
        {
            Electron.ipcRenderer.send("renderSendMsg", type, data);
        }



    }

    export let processMsgManager:ProcessMsgManager;
}