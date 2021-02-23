

namespace tools {
    /**
     * 游戏内全部的变量
     * made by cyj
     * create on 2021-01-21 11:02:12 
    */
    export class ToolsApp{
        
        public static stage:egret.Stage;
        /**应用的根路径 */
        public static rootPath:string;

        constructor(){
            
        }
        /**初始化项目  （可以控制变量的初始化顺序） */
        public static init(){
            let s = this;
            s.rootPath = process.cwd();
            localDB = new LocalDB();
            loopMgr = new LoopMgr();
            observer = new Observer();
            processMsgManager = new ProcessMsgManager();
            config = new Config();
            egret.sys.screenAdapter = new tools.CQSceneAdapter(); 
            this.stage.setContentSize(1920, 1000)
            toolsManager = new ToolsManager();
            ui = new UIMgr();
        }

    }
}
