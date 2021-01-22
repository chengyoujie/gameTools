namespace tools {
    /**
     * @project Cqll
     * @export class ColorUtil
     * @author tools
     * @usage 颜色管理器
     * @since 2016-6-27
     * @modified 2016-6-27
     * @modifier taoweiguo
    */
    export class ColorUtil {

        /** 常用颜色 */
        public static NORMAL: number = 0xede7c9;
        public static NORMAL_S: string = "#ede7c9";

        /**
         * 普通品质  -- 灰色 
         */
        public static GRAY: number = 0xafb7bd;
        public static GRAY_S: string = "#afb7bd";
        public static get GRAY_CH(): string { return "灰色"; }

        /**
         * 绿色品质  -- 绿色 
         */
        public static GREEN: number = 0x6eb84a;
        public static GREEN_S: string = "#6eb84a";
        public static get GREEN_CH(): string { return "绿色"; }

        /**
         * 蓝色品质  -- 蓝色 
         */
        public static BLUE: number = 0x43a4f6;
        public static BLUE_S: string = "#43a4f6";
        public static get BLUE_CH(): string { return "蓝色"; }

        /**
         * 紫色品质  -- 紫色 
         */
        public static PURPLE: number = 0xaf86e8;
        public static PURPLE_S: string = "#af86e8";
        public static get PURPLE_CH(): string { return "紫色"; }

        /**
        * 橙色品质  -- 橙色
        */
        public static ORANGE: number = 0xf65c20;
        public static ORANGE_S: string = "#f65c20";
        public static get ORANGE_CH(): string { return "橙色"; }

        /**
         * 红色品质  -- 红色
         */
        public static RED: number = 0xff0c0c;
        public static RED_S: string = "#ff0c0c";
        public static get RED_CH(): string { return "红色"; }

        /** 彩色品质 --彩色 */
        public static COLOUR: number = 0xffed2a;
        public static COLOUR_S: string = "#ffed2a";
        public static get COLOUR_CH(): string { return "彩色"; }


        /**
         * 品质字符串颜色
         * */
        public static COLOR_STR: any = { 1: ColorUtil.GRAY_S, 2: ColorUtil.GREEN_S, 3: ColorUtil.BLUE_S, 4: ColorUtil.PURPLE_S, 5: ColorUtil.ORANGE_S, 6: ColorUtil.RED_S, 7: ColorUtil.COLOUR_S };

        /**
         * 品质16进制颜色
         * */
        public static COLOR_NUM: any = { 1: ColorUtil.GRAY, 2: ColorUtil.GREEN, 3: ColorUtil.BLUE, 4: ColorUtil.PURPLE, 5: ColorUtil.ORANGE, 6: ColorUtil.RED, 7: ColorUtil.COLOUR };

        /** 品质汉字文本 */
        public static get COLOR_NAME(): any { return { 1: ColorUtil.GRAY_CH, 2: ColorUtil.GREEN_CH, 3: ColorUtil.BLUE_CH, 4: ColorUtil.PURPLE_CH, 5: ColorUtil.ORANGE_CH, 6: ColorUtil.RED_CH, 7: ColorUtil.COLOUR_CH }; }

        /**
         * 灰色滤镜
         */
        public static FILTER_GRAY: Array<egret.ColorMatrixFilter> = [new egret.ColorMatrixFilter([0.3, 0.59, 0.11, 0, 0, 0.3, 0.59, 0.11, 0, 0, 0.3, 0.59, 0.11, 0, 0, 0, 0, 0, 1, 0])];
        
        /**
         * 变暗滤镜
         */
        public static FILTER_AN: Array<egret.ColorMatrixFilter> = [new egret.ColorMatrixFilter(
            [0.2, 0, 0, 0, 0,
                0, 0.2, 0, 0, 0,
               0, 0, 0.2, 0, 0,
                0, 0, 0, 1, 0]
            )];


        /**
         * 变暗滤镜 暗的轻
         * 颜色值： 0x606060, 透明度 0.9
         */
        public static FILTER_AN2: Array<egret.ColorMatrixFilter> = [new egret.ColorMatrixFilter(
            [0.3764705882352941,0,0,0,0,0,0.3764705882352941,0,0,0,0,0,0.3764705882352941,0,0,0,0,0,0.9,0]
            )];
        
        /**
         * 条件对比，判断字符串颜色
         */
        public static compareBackColor(front: number, behind: number): string {
            if (front >= behind) {
                return ColorUtil.GREEN_S;
            }
            return ColorUtil.RED_S;
        }

        /**
         * 根据颜色值和透明度获取滤镜egret.ColorMatrixFilter参数
         * 如果多个地方使用建议声明一个常量
         * @param color rgb颜色值转16进制颜色值
         * @param alpha 透明度 0-1
         */
        public static getColorFilter( color: number, alpha:number=1) {
            let result = {r: -1, g: -1, b: -1};// 将16进制颜色分割成rgb值
            result.b = color % 256;
            result.g = Math.floor((color / 256)) % 256;
            result.r = Math.floor((color / 256) / 256);
            let colorMatrix = [
                1, 0, 0, 0, 0,
                0, 1, 0, 0, 0,
                0, 0, 1, 0, 0,
                0, 0, 0, 1, 0
            ];
            colorMatrix[0] = result.r / 255;
            colorMatrix[6] = result.g / 255;
            colorMatrix[12] = result.b / 255;
            colorMatrix[18] = alpha;
            let colorFilter = new egret.ColorMatrixFilter(colorMatrix);
            return [colorFilter];
        }

        /**
         * 条件对比，判断16进制颜色
         */
        public static compareBackNumColor(front: number, behind: number): number {
            if (front >= behind) {
                return ColorUtil.GREEN;
            }
            return ColorUtil.RED;
        }

        /** rgb颜色值转16进制颜色值 */
        public static colorRGB2Hex(color: string) {
            var rgb = color.split(',');
            var r = parseInt(rgb[0].split('(')[1].trim());
            var g = parseInt(rgb[1].trim());
            var b = parseInt(rgb[2].split(')')[0].trim());

            var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            return hex;
        }
    }
}