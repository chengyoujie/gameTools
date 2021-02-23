namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\common\DropDownRenderSkinSkin.exml  
     * made by cyj
     * create on 2021-01-21 19:47:38 
    */
    export class DropDownSkinRender extends BaseRender {
    
        constructor() {
            super();
        }
        
        /** 数据发生改变 */
        public dataChanged(): void {
            super.dataChanged();
            let s = this;
            let data = s.data;
            if(!data)
            {
                s.lbl_name.text = "";
            }else{
                s.lbl_name.text = data["label"];
            }
        }
    }
}

    