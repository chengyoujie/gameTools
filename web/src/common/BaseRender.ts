module tools {
    /**
     * Render 类的基类
     * BaseRender类
     * made by 
     * create on 2021-02-19 17:50:20 
    */
    export class BaseRender extends eui.ItemRenderer{
        /** 被事件类隐式调用 */
        private evtObInfo: { evtObjs: (Observer | egret.EventDispatcher)[], evtHash: egret.MapLike<boolean> } = { evtObjs: [], evtHash: {} };
        /**上次的选中状态 */
        private _lastSelectState:boolean;
        /**默认设置的选中图片 */
        img_select:eui.Image;

        public constructor() {
            super();
        }

        createChildren()
        {
            super.createChildren();
            let s = this;
            if(s.img_select)
            {
                s.img_select.touchEnabled = false;
                s.img_select.visible = false;
            }
        }
        
        /** 界面关闭时的处理 */
        public onClose?(): void;

        /**重写添加到舞台 */
        $onAddToStage(stage: egret.Stage, nestLevel: number) {
            super.$onAddToStage(stage, nestLevel);
            let s = this;
            s.once(egret.Event.REMOVED_FROM_STAGE, s.handleOnClose, s);
        }

        /**关闭界面 */
        protected handleOnClose(e:egret.Event){
            let s = this;
            s.off(egret.Event.REMOVED_FROM_STAGE, s.handleOnClose, s);
            s.rmvsEvt();
            loopMgr.clearAll(s);
            egret.Tween.removeTweens(s);
            if(s.onClose)
            {
                s.onClose();
            }
        }
        /**移除界面事件侦听*/
        protected rmvsEvt(): void {
            let s = this;
            let evtObjs = s.evtObInfo.evtObjs;
            if (evtObjs) {
                for (let i = 0, len = evtObjs.length; i < len; i++) {
                    evtObjs[i].rmvByTar(s);
                }
            }
            s.evtObInfo = { evtObjs: [], evtHash: {} };
        }
        /**重写状态改变 */
        invalidateState()
        {
            super.invalidateState();
            let s = this;
            let selectState = s.selected;
            if(selectState != s._lastSelectState)
            {
                s.selectedChange();
            }
        }
        /**选中状态发生改变 */
        protected selectedChange(){
            let s = this;
            if(s.img_select)
            {
                s.img_select.visible = s.selected;
            }
        }

        // public set selected(value: boolean) {
        //     let s = this;
        //     if (s["_selected"] == value)
        //             return;
        //     s["_selected"] = value;
        //     this.invalidateState();
        // }

        // public get selected(): boolean {
        //     return this.["_selected"];
        // }
        

    }
}