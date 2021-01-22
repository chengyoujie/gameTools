

namespace tools {
    /**
     * 游戏内全部的变量
     * made by cyj
     * create on 2021-01-21 11:02:12 
    */
    export class ToolsApp{
        
        public static stage:egret.Stage;

        constructor(){
            
        }
        /**初始化项目  （可以控制变量的初始化顺序） */
        public static init(){
            localDB = new LocalDB();
            loopMgr = new LoopMgr();
            observer = new Observer();
            config = new Config();
            ui = new UIMgr();
        }

    }
}
