namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\tips\CmdTipSkin.exml  
     * made by cyj
     * create on 2021-02-22 14:04:00 
    */
    export class CmdTipView extends Component {

        private _msg:string;

        constructor(opt?: ShowOptions){
            super(opt);
            this.skinName = 'CmdTipSkin';
        }

        /**界面创建成功**/
        protected onCreate() {

        }

        /**界面打开**/
        onOpen(){
            let s = this;
            s.lbl_msg.text = s._msg = "";
        }

        public appendText(msg:string){
            let s = this;
            s._msg += msg+"\n";
            s.lbl_msg.textFlow = HtmlUtil.getHtmlStr(s._msg);
            s.img_bg.width = s.lbl_msg.x * 2 + s.lbl_msg.textWidth;
            s.img_bg.height = s.lbl_msg.y*2 + s.lbl_msg.textHeight;
        }

        public resetText(){
            let s = this;
            s._msg = "";
            s.appendText("");
        }
        

        /**界面销毁**/
        public onClose(): void {
            let s= this;
            s._msg = "";
        }
    }
}
