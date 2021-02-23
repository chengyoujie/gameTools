namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\main\ToolsTypeRenderSkin.exml  
     * made by cyj
     * create on 2021-02-18 21:30:23 
    */
    export class ToolsTypeRender extends BaseRender {
        
        constructor() {
            super();
        }
        
        /** 数据发生改变 */
        public dataChanged(): void {
            super.dataChanged();
            let s = this;
            let data:ToolsItemData = s.data;
            s.lbl_name.text = data.name;
        }
    }
}

    