namespace tools {
    /**
     * 有缩放效果的按钮
     */
    export class ScaleButton extends eui.Button {
        private _offx: number;
        private _offy: number;
        private _bgIcon: string;
        public useBgSize = true;
        public imgBg: eui.Image;
        private _measureed: boolean;


        protected childrenCreated(): void {
            super.childrenCreated();
            let s = this;
            if (!s.useBgSize) {
                if (!s.hitArea) s.hitArea = new egret.Rectangle(0, 0, s.width, s.height);
                else { s.hitArea.width = s.width; s.hitArea.height = s.height; }
            }
            else if (s.numChildren > 0) {
                let btnBg: eui.Image = s.getChildAt(0) as eui.Image;
                if (btnBg && btnBg instanceof eui.Image) {
                    btnBg.on(egret.Event.COMPLETE, () => {
                        if (btnBg.texture) {
                            if (!s.hitArea) s.hitArea = new egret.Rectangle(0, 0, btnBg.texture.textureWidth, btnBg.texture.textureHeight);
                            else { s.hitArea.width = btnBg.texture.textureWidth; s.hitArea.height = btnBg.texture.textureHeight; }
                        }
                    }, s);
                }
            }
        }

        $onAddToStage(stage: egret.Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);
            let s = this;
            s.on(egret.TouchEvent.TOUCH_BEGIN, s.onTouchBegin, s);
            if (s.imgBg && s._bgIcon) s.imgBg.source = s._bgIcon;
        }

        $onRemoveFromStage(): void {
            super.$onRemoveFromStage();
            let s = this;
            s.filters = null;
            egret.Tween.removeTweens(s);
            s.off(egret.TouchEvent.TOUCH_BEGIN, s.onTouchBegin, s);
        }

        /** 触碰事件处理 */
        protected onTouchBegin(event: egret.TouchEvent): void {
            let s = this;
            super.onTouchBegin(event);
            if (!s._measureed) {
                s._offx = s.scaleX;
                s._offy = s.scaleY;
                s._measureed = true;
                s.measureScale();
            }
            egret.Tween.get(s).to({ scaleX: s._offx - 0.02, scaleY: s._offy - 0.02 }, 50);
        }

        private measureScale(): void {
            let s = this;
            s.x += Math.round(s.width * s._offx / 2);
            s.y += Math.round(s.height * s._offy / 2);
            s.anchorOffsetX = Math.round(s.width / 2);
            s.anchorOffsetY = Math.round(s.height / 2);
        }

        /** 解除触碰事件处理 */
        protected onTouchCancle(event: egret.TouchEvent): void {
            let s = this;
            super.onTouchCancle(event);
            s.buttonReleased();
        }

        /** 舞台上触摸弹起事件 */
        protected buttonReleased(): void {
            let s = this;
            egret.Tween.removeTweens(s);
            egret.Tween.get(s).to({ scaleX: s._offx, scaleY: s._offy }, 50);
        }

    }
}