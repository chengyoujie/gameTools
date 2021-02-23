namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\common\DropDownSkin.exml  
     * made by cyj
     * create on 2021-01-21 19:45:29 
    */
    export class DropDownView extends Component {

        constructor(){
            super();
            this.skinName = 'DropDownSkin';
        }

        /**界面创建成功**/
        onCreate() {
            let s = this;
            s.list_drop.itemRenderer = DropDownSkinRender;
        }
        /**界面打开**/
        onOpen(){
            let s = this;
            s.btn_down.clk(s.handleClkDown, s);
            s.lbl_name.clk(s.handleClkDown, s);
            s.list_drop.on(eui.ItemTapEvent.ITEM_TAP, s.handleItemChange, s);
        }

        private handleItemChange(){
            let s = this;
            let data = s.list_drop.selectedItem;
            if(data)
            {
                s.lbl_name.text = data.label;
            }
            s.setDropListShow(false);
            s.post(eui.ItemTapEvent.ITEM_TAP);
        }
        
		/**btn_down点击事件处理**/
		private handleClkDown(){
            let s = this;
            s.setDropListShow(!s.group_drop.visible);
        }

        /**设置dropList是否显示 */
        private setDropListShow(isShow:boolean)
        {
            let s = this;
            if(s.group_drop.visible == isShow)return;
            s.group_drop.visible = isShow;
            if(isShow)
            {
                ToolsApp.stage.on(egret.TouchEvent.TOUCH_TAP, s.handleTouchStage, s);
            }else{
                ToolsApp.stage.off(egret.TouchEvent.TOUCH_TAP, s.handleTouchStage, s);

            }
        }
        /**点击舞台 */
        private handleTouchStage(e:egret.TouchEvent){
            let s = this;
            if(!s.group_drop.visible)return;
            let globalListPos = s.localToGlobal(0, 0, SharePoint);
            ShareRect.x = globalListPos.x;
            ShareRect.y = globalListPos.y;
            ShareRect.width = s.width;
            ShareRect.height = s.height;
            if(!ShareRect.contains(e.stageX, e.stageY))
            {
                s.setDropListShow(false)
            }
        }

        public set selectIndex(value:number){
            let s = this;
            s.list_drop.selectedIndex = value;
            s.handleItemChange();
        }

        /**当前选择的index */
        public get selectIndex(){
            return this.list_drop.selectedIndex;
        }
        /**当前选择的数据 */
        public get selectData(){
            let s = this;
            if(s.list_drop.selectedItem)
            {
                return s.list_drop.selectedItem.data;
            }
            return null;
        }
		
        /**设置list列表的数据源 */
        setData<T extends {}>(value:T[], key:keyof T)
        setData(value:string[])
        setData(value:{[key:string]:any})
        setData<T extends {}>(value:{[key:string]:T}, key:keyof T)
        setData<T extends {}>(value:string[]|T[]|{[key:string]:any}, key?:keyof T)
        {
            let s = this;
            if(!value)value = [];
            let list = [];
            if(value instanceof Array)
            {
                for(let i=0; i<value.length; i++)
                {
                    let item = value[i];
                    if(typeof item != "string")
                    {
                        list.push({label:item[key], data:item});
                    }else{
                        list.push({label:item, data:item});
                    }
                }
            }else{
                for(let k in value)
                {
                    let item = value[k];
                    if(key)
                    {
                        list.push({label:item[key], data:item})
                    }else{
                        list.push({label:item[k], data:item})
                    }
                }
            }
            s.list_drop.setDataArr(list);
            let len = list?list.length:0;
            let layout = s.list_drop.layout as eui.VerticalLayout;
            s.img_listBg.height = len*(s.list_drop.getVirtualElementAt(0).height+layout.gap);
        }

        

        /**界面销毁**/
        public onClose(): void {
            
        }
    }
}
