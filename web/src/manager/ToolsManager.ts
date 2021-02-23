module tools {
    
 

    /**
     * 
     * ToolsManager类
     * made by 
     * create on 2021-02-18 19:48:46 
    */
    export class ToolsManager {
        /**工具类id对应的类字典 */
        private _toolsClsDic:{[id:number]:{new ():AbstractToolsView}} = {};
        /**工具类id对应的实例字典 */
        private _toolsViewDic:{[id:number]:AbstractToolsView} ={};

        public constructor() {
            let s = this;
            s.init();
        }
        /**初始化 */
        private init(){
            let s = this;
            //注册工具id对应的主界面
            s.registerView(ToolsId.MovieClipPack, MovieClipPackMainView);
            s.registerView(ToolsId.TextureMerger, TextureMergerMainView);
        }


        /**注册 tools id 对应的类 */
        public registerView(toolsId:ToolsId, toolsMainCls:{new ():AbstractToolsView})
        {
            let s = this;
            if(s._toolsClsDic[toolsId])
            {
                console.warn(toolsId+"对应的类重复注册");
            }
            s._toolsClsDic[toolsId] = toolsMainCls;
        }


        /**根据工具id 获取工具的界面，如果没有则会新建一个 */
        public getToolsView(toolsId:ToolsId){
            let s = this;
            if(s._toolsViewDic[toolsId])
            {
                return s._toolsViewDic[toolsId];
            }
            if(!s._toolsClsDic[toolsId])return null;
            s._toolsViewDic[toolsId] = new s._toolsClsDic[toolsId]();
            return s._toolsViewDic[toolsId];
        }

    }

    
    export let toolsManager:ToolsManager;
}