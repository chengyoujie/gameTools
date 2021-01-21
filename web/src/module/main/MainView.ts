



namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\main\MainSkin.exml  
     * made by cyj
     * create on 2021-01-21 10:37:16 
    */
    export class MainView extends eui.Component {
        constructor(){
            super();
            this.skinName = 'MainSkin';
        }

        /**界面创建成功**/
        protected childrenCreated() {
            super.childrenCreated();
            let s = this;
            s.lbl_test.text = node.fs.readFileSync("D:/text.txt", "utf-8");
            
        }

        

        /**界面销毁**/
        public destroy(): void {
            
        }
    }
}

