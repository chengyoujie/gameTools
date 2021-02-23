namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\main\MainSkin.exml  
     * made by cyj
     * create on 2021-01-21 10:37:16 
    */
    export class MainView extends Component {

        private _curTools:AbstractToolsView;
        /**左侧功能界面是否正在隐藏显示 */
        private _showHideIsTween:boolean = false;

        constructor(){
            super();
            this.skinName = 'MainSkin';
        }

        /**界面创建成功**/
        onCreate() {
            let s = this;
            s.list_tools.itemRenderer = ToolsTypeRender;
            s.list_tools.setDataArr(config.toolsConfig.tools);
            //拖拽本地文件操作
            let egretPlayer = document.getElementsByClassName("egret-player")[0];
            egretPlayer.addEventListener("drop", (e:DragEvent) => {
                //阻止默认行为
                e.preventDefault();
                //获取文件列表
                const files = e.dataTransfer.files;
                if(files && files.length > 0) {
                    if(s._curTools && s._curTools.onDragFile)
                    {
                        let dragFiles = [];
                        for(let i=0;i<files.length; i++)dragFiles.push(files[i].path)
                        s._curTools.onDragFile(dragFiles);
                    }
                }
            })
            
            //阻止拖拽结束事件默认行为
            egretPlayer.addEventListener("dragover", (e) => {
                e.preventDefault();
            })
        }

        onOpen(){
            let s = this;
            s.dropdown_projectSelect.lbl_name.text = "选择项目";
            s.dropdown_projectSelect.setData(config.projectConfig, "name");
            s.dropdown_projectSelect.on(eui.ItemTapEvent.ITEM_TAP, s.handleProjectChange, s);
            s.dropdown_projectSelect.selectIndex = +(localDB.get(LocalDBKey.SELECT_PROJECT) || 0);
            s.list_tools.on(eui.ItemTapEvent.ITEM_TAP, s.handleChangeTools, s);
            s.list_tools.selectedIndex = +(localDB.get(LocalDBKey.SELECT_TOOLS) || 0);
            s.img_showHideTools.clk(s.handleShowHide, s);
            s.onResize();
            s.handleChangeTools();
        }

        private handleShowHide(){
            let s = this;
            if(s._showHideIsTween)return;
            s.group_type.visible = true;
            if(s.group_type.x >= 0)//开始隐藏
            {
                s.group_type.alpha = 1;
                s.img_showHideTools.scaleX = 1;
                egret.Tween.get(s.group_type).to({x:-s.group_type.width, alpha:0.3}, 300).call(s.handleShowHideTweenEnd, s);
            }else{
                s.group_type.alpha = 0.1;
                s.img_showHideTools.scaleX = -1;
                egret.Tween.get(s.group_type).to({x:0, alpha:1}, 300).call(s.handleShowHideTweenEnd, s);
            }
        }

        private handleShowHideTweenEnd(){
            let s = this;
            s._showHideIsTween = false;
            if(s.group_type.x>=0)//显示
            {
                s.group_type.visible = true;
                ToolsApp.stage.on(egret.TouchEvent.TOUCH_TAP, s.handleShowHideStageClick, s);
            }else{
                s.group_type.visible = false;
                ToolsApp.stage.off(egret.TouchEvent.TOUCH_TAP, s.handleShowHideStageClick, s);
            }
        }

        private handleShowHideStageClick(e:egret.TouchEvent){
            let s = this;
            if(!s.group_type.visible)return;
            let globalListPos = s.group_type.localToGlobal(0, 0, SharePoint);
            ShareRect.x = globalListPos.x;
            ShareRect.y = globalListPos.y;
            ShareRect.width = s.group_type.width;
            ShareRect.height = s.group_type.height;
            if(!ShareRect.contains(e.stageX, e.stageY))
            {
                s.handleShowHide();
            }
        }

        onResize(){
            let s = this;
            s.width = ToolsApp.stage.stageWidth;
            s.height = ToolsApp.stage.stageHeight;
            s.group_tools.width = s.width;
            s.group_tools.height = s.height;
            if(s._curTools)
            {
                s._curTools.width = s.group_tools.width;
                s._curTools.height = s.group_tools.height;
            }
        }

        /**项目发生改变 */
        private handleProjectChange(){
            let s = this;
            let dropdown_projectSelectData = s.dropdown_projectSelect.selectData as ProjectConfig;
            if(dropdown_projectSelectData)
            {
                config.setCurProject(dropdown_projectSelectData.id);
            }
            localDB.save(LocalDBKey.SELECT_PROJECT, s.dropdown_projectSelect.selectIndex);
            if(s._curTools)
            {
                s._curTools.onProjectChange(dropdown_projectSelectData)
            }
        }
        /**工具发生改变 */
        private handleChangeTools()
        {
            let s = this;
            if(s._curTools)
            {
                s._curTools.removeSelf();
                s._curTools.onClose();
                s._curTools = null;
            }
            let selectToolsData = s.list_tools.selectedItem as ToolsItemData;
            s._curTools = toolsManager.getToolsView(selectToolsData.id);
            if(!s._curTools)return;
            localDB.save(LocalDBKey.SELECT_TOOLS, s.list_tools.selectedIndex);
            s._curTools.width = s.group_tools.width;
            s._curTools.height = s.group_tools.height;
            s._curTools.onProjectChange(s.dropdown_projectSelect.selectData as ProjectConfig)
            s.group_tools.addChild(s._curTools);

        }
 
        /**界面关闭**/
        public onClose(): void {
            let s = this;
            s._showHideIsTween = false;
        }
    }
}

