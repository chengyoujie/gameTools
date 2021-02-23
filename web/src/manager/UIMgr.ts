module tools {
        /**
         * ui界面管理类
         * UIMgr类
         * made by cyj
         * create on 2021-01-21 18:02:28 
        */
        export class UIMgr extends Observer{
            /** 主界面 */
            private mainLayer:egret.DisplayObjectContainer;
            /** 弹出层 */
            private popLayer:egret.DisplayObjectContainer;
            /** tip层 */
            private tipsLayer:egret.DisplayObjectContainer;
            /** digView缓存数据 */
            private _viewDic = {}; 
            /**层级数据集      */
            private _layerDic:{[id:number]:egret.DisplayObjectContainer} = {};


            public constructor() {
                super();
                let s = this;
                s.mainLayer = s.createLayer(GameLayer.mainLayer);
                s.popLayer = s.createLayer(GameLayer.popLayer);
                s.tipsLayer = s.createLayer(GameLayer.tipLayer);
                ToolsApp.stage.on(egret.Event.RESIZE, s.onResize, s);
                s.onResize();
            }

            /**创建图层并添加到舞台 */
            private createLayer(layerIdx:GameLayer){
                let s = this;
                let layer = new eui.Component();//为了使用布局， 所以容器使用eui.Component
                ToolsApp.stage.addChild(layer);
                s._layerDic[layerIdx] = layer;
                return layer;
            }

            private onResize(){
                let s = this;
                let sw = ToolsApp.stage.stageWidth;
                let sh = ToolsApp.stage.stageHeight;
                for(let key in s._layerDic)
                {
                    let layer = s._layerDic[key];
                    layer.width = sw;
                    layer.height = sh;
                }
            }

            //-----------------------------------------------------------------------------界面开启---------------------------------------------------------------------------------------
            /** @显示弹窗界面 */
            public show<T extends Component>(c:new (...params: any[])=>T, opt?: ShowOptions, layer: GameLayer = GameLayer.popLayer): T {
                let s = this;
                opt = opt || {};
                let clsName = egret.getQualifiedClassName(c);
                let dlg = <T>s._viewDic[clsName];
                if (!dlg) {
                    dlg = new c(opt);
                    s._viewDic[clsName] = dlg;
                    dlg.verticalCenter = 0;
                    dlg.horizontalCenter = 0;
                }else{
                    dlg.showOpt = opt;
                }
                let content = s._layerDic[layer];
                content.addChild(dlg);
                return dlg;
            }
            /**关闭界面 */
            public close<T extends Component>(c:new (...params: any[])=>T){
                let s = this;
                let clsName = egret.getQualifiedClassName(c);
                let dlg = <T>s._viewDic[clsName];
                if (dlg) {
                    dlg.close();
                }
            }

            public alert(msg:string|ShowOptions, showType:AlertButtonShowType=AlertButtonShowType.OK){
                ui.show(AlertView, {params:[msg, showType]})
            }


        }

        export let ui:UIMgr;
}