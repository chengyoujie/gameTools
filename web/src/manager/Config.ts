module tools {
    /**
     * 配置相关类
     * Config类
     * made by 
     * create on 2021-01-21 20:05:13 
    */
    export class Config {

        private _userConfig:UserConfig;
        private _userConfigPath:string = "";
        private _projectConfig:{[key:string]:ProjectConfig};
        /**当前选择的项目 对应 resource/config/project.json*/
        private _curProject:ProjectConfig;
        /**工具 对应 resource/config/project.json*/
        private _toolsConfig:ToolsData;
        /**工具每一项数据id对应的数据 字典*/
        private _toolsItemDataDic:{[id:number]:ToolsItemData};

        public constructor() {
            let s = this;
            s.init();
        }
        /**初始化 */
        private init(){
            let s = this;
            observer.on(tools.EventType.PRE_LOAD_COMPLETE, s.handlePreLoadComplete, s);
        }

        private handlePreLoadComplete()
        {
            let s = this;
            s._projectConfig = RES.getRes("project_json")
            s._toolsConfig = RES.getRes("toolsData_json")
        }
        /**当前选择的项目 */
        public get curProjectConfig(){
            let s = this;
            return s._curProject;
        }

        public setCurProject(projectId:string){
            let s = this;
            if(!s._projectConfig)return;
            s._curProject = s._projectConfig[projectId];
        }

        /**项目的配置 */
        public get projectConfig(){
            return this._projectConfig;
        }
        /**工具对应的数据 */
        public get toolsConfig(){
            return this._toolsConfig;
        }
        /**根据工具的id获取工具数据 */
        public getToolsItemDataById(id:ToolsId):ToolsItemData
        {
            let s = this;
            if(s._toolsItemDataDic){
                return s._toolsItemDataDic[id];
            }
            s._toolsItemDataDic = {};
            for(let i=0; i<s._toolsConfig.tools.length; i++)
            {
                let item = s._toolsConfig.tools[i];
                s._toolsItemDataDic[item.id] = item;
            }
            return s._toolsItemDataDic[id];
        }

        /**用户的配置 */
        public getUserConfig(key:keyof ProjectLocalPath, project?:string){
            let s = this;
            if(!project)
            {
                if(!s._curProject){
                    console.log("获取用户配置失败，当前没有选中项目");
                    return null;
                }
                project = s._curProject.id;
            }
            let localPath = s.userConfig[project];
            if(localPath)return localPath[key];
            return null;
        }
        /**设置用户的配置 */
        public setUserConfig(key:keyof ProjectLocalPath, value:string, project?:string)
        {
            let s = this;
            if(!project)
            {
                if(!s._curProject){
                    console.log("设置用户配置失败，当前没有选中项目");
                    return null;
                }
                project = s._curProject.id;
            }
            let localPath = s.userConfig[project];
            if(!localPath)
            {
                s.userConfig[project] = localPath = {};
            }
            localPath[key] = value;
            node.fs.writeFileSync(s._userConfigPath, JSON.stringify(s.userConfig), "utf-8");
        }
        /**用户配置， 不对外 */
        private get userConfig(){
            let s = this;
            if(!s._userConfig)
            {
                if(node.fs.existsSync(s._userConfigPath))
                {
                    let content = node.fs.readFileSync(s._userConfigPath, "utf-8");
                    s._userConfig = JSON.parse(content);
                }else{
                    s._userConfig = {localPath:{}};
                }
            }
            return s._userConfig;
        }

        

    }




    export let config:Config;


}