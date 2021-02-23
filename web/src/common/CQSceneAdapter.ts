
namespace tools {
    /*
    *屏幕适配
    */
	export class CQSceneAdapter extends egret.HashObject implements egret.sys.IScreenAdapter {
        
        public calculateStageSize(e: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): egret.sys.StageDisplaySize {
            let displayWidth = screenWidth;
            let displayHeight = screenHeight;
            let stageWidth = contentWidth;
            let stageHeight = contentHeight;

            // let cmax = 1920 / 1000;// 2  游戏高宽比上限
            // let minH = 920;
            // let cmin = minH / 1000;//  1.53125  游戏高宽比下限
            // let c = screenHeight / screenWidth;
            // if (c < cmin) {
            //     if(stageWidth && minH/stageWidth > c)
            //     {
            //         stageWidth = stageWidth;
            //         displayWidth = Math.round(displayHeight * stageWidth / minH);
            //     }
            //     else
            //     {
            //         stageWidth = Math.round(minH * displayWidth / displayHeight);
            //     }
                
            // }
            // else if (c > cmax) {
            //     displayHeight = Math.round(screenWidth * cmax);
            // }

            stageHeight = Math.round(stageWidth * displayHeight / displayWidth);
            if (stageWidth % 2 != 0) stageWidth += 1;
            if (stageHeight % 2 != 0) stageHeight += 1;
            if (displayWidth % 2 != 0) displayWidth += 1;
            if (displayHeight % 2 != 0) displayHeight += 1;
            return {
                stageWidth: stageWidth,
                stageHeight: stageHeight,
                displayWidth: displayWidth,
                displayHeight: displayHeight
            };
        }
    }
}