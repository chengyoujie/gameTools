module tools {
    //=================用户配置=============
    /**用户的配置 */
    export interface UserConfig{
        /**记录用户的本地配置 */
        localPath:{[project:string]:ProjectLocalPath};
    }
    /**用户的项目本地路径 */
    export interface ProjectLocalPath{

        /**用户的数据配置 */
        dataPath?:string;
        /**用户的web目录路径 */
        webPath?:string;
        /**用户的客户端代码目录位置 */
        codePath?:string;
    }

    /**项目配置 */
    export interface ProjectConfig{
        id:string;
        name:string;
    }


    //=============工具相关   ==================
    
    /**工具Id */
    export const enum ToolsId{
        /**动画打包 */
        MovieClipPack=1,
        /**图集合并 */
        TextureMerger=2,
    }

    /**工具的配置数据， 对应 */
    export interface ToolsData {
        tools:ToolsItemData[];
    }
    /**工具的每一项数据**/
   export interface ToolsItemData {
        id:number;
        name:string;

    }
}