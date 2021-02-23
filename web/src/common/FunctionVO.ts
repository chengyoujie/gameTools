namespace tools {
    /**
     * FunctionVO
     */
    export class FunctionVO extends egret.HashObject  {
        public fun: Function;
        public thisObject;
        public param: any[];
        constructor($fun?: Function, $thisObject?: any, ...param: any[]) {
            super();
            let self = this;
            self.fun = $fun;
            self.thisObject = $thisObject;
            self.param = param;
        }

        /** 记录传进参数，且调用回调 */
        public exec(...param: any[]): any {
            let self = this;
            if (self.fun) {
                if (param.length > 0) self.param = param;
                return self.fun.apply(self.thisObject, self.param);
            }
        }

        /** 不记录传进参数，且调用回调 */
        public execParam(...param: any[]): any {
            let self = this;
            if (self.fun) return self.fun.apply(self.thisObject, param);
        }

        static create($fun?: Function, $thisObject?: any, ...param: any[]) {
            let vo = FunctionVO.pop();
            vo.fun = $fun;
            vo.thisObject = $thisObject;
            vo.param = param;
            return vo;
        }

        static pop(): FunctionVO {
            let functionVO: FunctionVO = <FunctionVO>objPool.pop(FunctionVO);
            return functionVO;
        }

        public onReset() {

        }
        public onRecycle() {

        }


        public reset() {
            let s = this;
            s.fun = undefined;
            s.thisObject = undefined;
            s.param = undefined;
        }

        recycle(exec = false) {
            let s = this;
            if (exec) s.exec();
            s.reset();
            objPool.push(s);
        }
    }
}