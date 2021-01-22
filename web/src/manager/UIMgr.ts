module tools {
    /** 舞台层级 */
        export const enum GameLayer {
            /** 主界面 */
            mainLayer,
            /** 模块层 */
            moduleLayer,
            /** 弹出层 */
            popLayer,
            /** tip层 */
            tipLayer,
        }
        /**
         * ui界面管理类
         * UIMgr类
         * made by cyj
         * create on 2021-01-21 18:02:28 
        */
        export class UIMgr extends Observer{
            /** 主界面 */
            private mainLayer:egret.Sprite;
            /** 模块层 */
            private moduleLayer:egret.Sprite;
            /** 弹出层 */
            private popLayer:egret.Sprite;
            /** tip层 */
            private tipsLayer:egret.Sprite;
            /** digView缓存数据 */
            private _viewDic = {}; 
            /**层级数据集      */
            private _layerDic = {};


            public constructor() {
                super();
                let s = this;
                s.mainLayer = s.createLayer(GameLayer.mainLayer);
                s.moduleLayer = s.createLayer(GameLayer.moduleLayer);
                s.popLayer = s.createLayer(GameLayer.popLayer);
                s.tipsLayer = s.createLayer(GameLayer.tipLayer);
            }

            /**创建图层并添加到舞台 */
            private createLayer(layerIdx:GameLayer){
                let s = this;
                let layer = new egret.Sprite();
                ToolsApp.stage.addChild(layer);
                s._layerDic[layerIdx] = layer;
                return layer;
            }

            //-----------------------------------------------------------------------------界面开启---------------------------------------------------------------------------------------
            /** @第一层级模块界面显示 */
            public show<T extends Component>(c:new (...params: any[])=>T, opt?: ShowOptions, layer: GameLayer = GameLayer.moduleLayer): T {
                let s = this;
                opt = opt || {};
                let clsName = egret.getQualifiedClassName(c);
                let dlg = <T>s._viewDic[clsName];
                if (!dlg) {
                    dlg = new c(opt);
                    s._viewDic[clsName] = dlg;
                }
                let content = s._layerDic[layer];
                content.addChild(dlg);
                return dlg;
            }



        }

        export let ui:UIMgr;
}