namespace tools {
    /**弹窗的显示内容 */
    export const enum AlertButtonShowType{
        /**显示确认按钮 */
        OK = 1,
        /**显示取消按钮 */
        Cancle = 2,
        /**显示确认和取消按钮 */
        OK_Cancle = 3,
    }

    /**弹窗显示参数 */
    export interface AlertShowOption{
        /**显示的文本信息 */
        msg?:string;
        /**标题 */
        title?:string;
        /**确认按钮文本 */
        okBtnLabel?:string;
        /**取消按钮文本 */
        cancleBtnLabel?:string;
        /**点击确认后回调 */
        onOkCallBack?:(...args:any[])=>any;
        /**点击取消后回调 */
        onCancleCallBack?:(...args:any[])=>any;
        /**回调的this对象 */
        callBackThisObj?:any;
        /**回调的参数 */
        callBackParams?:any[];
        /**是否显示关闭按钮 */
        showClose?:boolean;
    }


    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\common\AlertSkin.exml  
     * made by cyj
     * create on 2021-02-20 11:47:41 
    */
    export class AlertView extends Component {

        private _showParams:AlertShowOption;

        constructor(opt?: ShowOptions){
            super(opt);
            this.skinName = 'AlertSkin';
        } 

        /**界面创建成功**/
        protected onCreate() {

        }

        /**界面打开**/
        onOpen(msg:string|AlertShowOption, showType:AlertButtonShowType){
            let s = this;
            if(typeof msg == "string")
            {
                s._showParams = {};
                s._showParams.msg = msg;
            }else{
                s._showParams = msg;
            }
            s.lbl_msg.text = s._showParams.msg;
            s.btn_cancle.label = s._showParams.cancleBtnLabel || "取消";
            s.btn_ok.label = s._showParams.okBtnLabel || "确定";
            s.lbl_title.text = s._showParams.title || "提示";

            if(!showType)showType = AlertButtonShowType.OK;
            s.btn_ok.visible = !!(showType&AlertButtonShowType.OK);
            s.btn_cancle.visible = !!(showType&AlertButtonShowType.Cancle);

            s.btn_ok.clk(s.handleSuerClick, s);
            s.btn_cancle.clk(s.handleCancleClick, s);
        }
        /**点击确定按钮 */
        private handleSuerClick(){
            let s = this;
            let okCallBack = s._showParams.onOkCallBack;
            let callBackParams = s._showParams.callBackParams;
            let callBackThisObj = s._showParams.callBackThisObj;
            s.close();
            if(okCallBack)
            {
                okCallBack.call(callBackThisObj, callBackParams);
            }
        }
        /**点击取消按钮 */
        private handleCancleClick(){
            let s = this;
            let cancleCallBack = s._showParams.onCancleCallBack;
            let callBackParams = s._showParams.callBackParams;
            let callBackThisObj = s._showParams.callBackThisObj;
            s.close();
            if(cancleCallBack)
            {
                cancleCallBack.call(callBackThisObj, callBackParams);
            }
        }

        

        /**界面销毁**/
        public onClose(): void {
            
        }

        
        
    }
}
