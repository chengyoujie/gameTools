namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\main\MainSkin.exml  
     * made by cyj
     * create on 2021-01-21 10:37:16 
    */
    export class MainView extends Component {
        constructor(){
            super();
            this.skinName = 'MainSkin';
        }

        /**界面创建成功**/
        onCreate() {

        }

        onOpen(){
            let s = this;
            s.dropDown.lbl_name.text = "选择项目";
            s.dropDown.setData(config.projectConfig, "name");
            s.dropDown.on(eui.ItemTapEvent.ITEM_TAP, s.handleProjectChange, s);
            let selectIndex =  +localDB.get(LocalDBKey.SELECT_PROJECT);
            if(isNaN(selectIndex))selectIndex = 0;
            s.dropDown.selectIndex = selectIndex;
        }

        onResize(){
            let s = this;
            s.width = ToolsApp.stage.stageWidth;
            s.height = ToolsApp.stage.stageHeight;
        }

        /**项目发生改变 */
        private handleProjectChange(){
            let s = this;
            let dropDownData = s.dropDown.selectData;
            if(dropDownData)
            {
                config.setCurProject(dropDownData.id);
            }
            localDB.save(LocalDBKey.SELECT_PROJECT, s.dropDown.selectIndex);
        }

        /**界面关闭**/
        public onClose(): void {
            
        }
    }
}

