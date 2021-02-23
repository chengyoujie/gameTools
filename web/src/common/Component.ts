module tools {
        /** 模板界面控制参数 */
        export interface ShowOptions {
            /** 构造函数的参数 */
            params?: any[];
        }
        /**
         * 界面UI基础类
         * Component类
         * made by cyj
         * create on 2021-01-21 17:24:15 
        */
        export class Component extends eui.Component{
            /** 被事件类隐式调用 */
            private evtObInfo: { evtObjs: (Observer | egret.EventDispatcher)[], evtHash: egret.MapLike<boolean> } = { evtObjs: [], evtHash: {} };
        
            /** 显示有关的设置 */
            public showOpt: ShowOptions;

            public constructor(opt?: ShowOptions) {
                super();
                let s = this;
                s.showOpt = opt;
                s.once(eui.UIEvent.COMPLETE, s.onSkinCompelet, s);
            }
            /**界面打开时的处理 */
            public onOpen?(...params:any[]):void;
            /** 界面关闭时的处理 */
            public onClose?(): void;
            /**界面销毁 */
            protected onDestroy?():void;

            protected onCreate?():void;

            public onResize?():void;

            
            /** 皮肤加载完成回调 */
            private onSkinCompelet(): void {
                let s = this;
                if(s.onCreate) s.onCreate();
            }
            /**界面尺寸发生改变 */
            private handleSizeChange():void{
                let s = this;
                if(s.onResize)
                {
                    s.onResize();
                }
            }

            /**重写添加到舞台 */
            $onAddToStage(stage: egret.Stage, nestLevel: number) {
                super.$onAddToStage(stage, nestLevel);
                let s = this;
                let params = s.showOpt ? s.showOpt.params : undefined;
                if(s.onOpen)
                {
                    s.onOpen(...params);
                }
                if(s.onResize)
                {
                    ToolsApp.stage.on(egret.Event.RESIZE,s.handleSizeChange, s);
                }
                s.once(egret.Event.REMOVED_FROM_STAGE, s.handleOnClose, s);
            } 

            /**关闭界面 */
            protected handleOnClose(e:egret.Event){
                let s = this;
                s.off(egret.Event.REMOVED_FROM_STAGE, s.handleOnClose, s);
                ToolsApp.stage.off(egret.Event.RESIZE,s.handleSizeChange, s);
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

            public close(){
                let s = this;
                s.removeSelf();
            }

            /**销毁界面 */
            public destory(){
                let s = this;
                if(s.onDestroy)
                {
                    s.onDestroy();
                }
            }

    }
}