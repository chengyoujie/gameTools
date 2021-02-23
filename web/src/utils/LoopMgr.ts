namespace tools {
    export class LoopMgr extends egret.HashObject {
        private _onlyId = 0;
        // private _frameTimer: egret.Timer;
        private _tmDoArr:TmDoData[] = [];
        private _tmSecndDoArr:TmDoData[] = [];
        private _tmDoMap:egret.MapLike<TmDoData> = {};
        private _tarFun:egret.MapLike<TmDoData[]> = {};
        private _loopTime: number = 0;//游戏启动时长（毫秒）
        private _loopScendTime:number = 0;
        private _frameInterval: number;//实时帧间隔（毫秒）(上一帧开始和上一帧结束之间的间隔)
        public curFrame = 0;
        constructor(frameRate:number = 60) {
            super();
            let self = this;
            // let frameTimer = self._frameTimer = new egret.Timer(1000 / frameRate);
            // frameTimer.on(egret.TimerEvent.TIMER, self.update, this);
            self._loopTime = egret.getTimer();
            self._loopScendTime = self._loopTime;
            egret.startTick( self.update,self);
            // frameTimer.start();
        }

        private update(curTm): boolean {
            let self = this;
            self.curFrame++;
            let lastTm = self._loopTime;
            self._frameInterval = curTm - lastTm;
            self._loopTime = curTm;
            self.doTmCheck(false);
            if(curTm - self._loopScendTime >= 1000)
            {
                self._loopScendTime = self._loopScendTime+1000;
                self.doTmCheck(true);
            }
            return false;
        }

        private doTmCheck(isScend:boolean):void
        {
            let self = this;
            let tmDo: TmDoData;
            //采用倒序，保证先注册先执行
            let tmDoArr = isScend?self._tmSecndDoArr:self._tmDoArr;
            let len = tmDoArr.length;
            let curTm = self._loopTime;
            for(let i = len - 1; i >= 0; i--)
            {
                tmDo = tmDoArr[i];
                if (tmDo.loop > 0 && tmDo.st < curTm) {
                    tmDo.st += tmDo.delay/self.scale;
                    if(tmDo.st < curTm) tmDo.st = curTm;
                    tmDo.fun.apply(tmDo.thisObject, tmDo.params);
                    tmDo.loop--;
                }
                if(tmDo.loop > 0) continue;
                tmDoArr.splice(i,1);
                delete self._tmDoMap[tmDo.id];
                let hashCode = tmDo.thisObject.hashCode;
                if(!hashCode) continue;
                let tarDoArr = self._tarFun[hashCode];
                if(!tarDoArr) continue;
                let idx = tarDoArr.indexOf(tmDo);
                if(idx < 0) continue;
                tarDoArr.splice(idx,1);
                if(tarDoArr.length <= 0) delete self._tarFun[hashCode];
                self.deleteTmDoData(tmDo);    
            }
        }

        private _poolSize:number = 100;
        private _timeDataPool:TmDoData[] = [];
        private getTmDoData(fun: Function, thisObject: any, delay:number, loop = 0, cover = true, params?:any[]){
            let self = this;
            let data:TmDoData;
            if(self._timeDataPool.length>0)
            {
                data = self._timeDataPool.pop();
            }else{
                data = {} as TmDoData;
            }
            data.fun = fun;
            data.thisObject = thisObject;
            data.st = self._loopTime + delay;
            data.delay = delay;
            data.loop = loop;
            data.params = params;
            data.invalid = false;
            data.id =  ++self._onlyId;
            return data;
        }

        private deleteTmDoData(data:TmDoData)
        {
            if(!data)return;
            let self = this;
            if(self._timeDataPool.length<self._poolSize)
            {
                data.fun = data.thisObject = data.params = null;
                data.st = data.delay =  data.id = 0;
                data.invalid = false;
                self._timeDataPool.push(data);
            }
            // delete self._tmDoMap[data.id];
        }

        private addTmDo(fun: Function, thisObject: any, delay:number, right = false, loop = 0, cover = true, params?:any[]):number{
            let self = this;
            if(loop <= 0) loop = 10000000000;
            if(right){
                fun.apply(thisObject, params);
            } 
            if(cover) self.clear(fun,thisObject);
            let tmDoData = self.getTmDoData(fun, thisObject, delay, loop, cover, params);//{ fun: fun,thisObject:thisObject, st: self._loopTime + delay,delay:delay, loop: loop, params:params,invalid:false ,id: ++self._onlyId};
            if(thisObject.hashCode) self.bindHash(thisObject.hashCode,tmDoData);
            if(self.isScend(delay))
            {
                self._tmSecndDoArr.push(tmDoData);
            }else{
                self._tmDoArr.push(tmDoData);
            }
            self._tmDoMap[tmDoData.id] = tmDoData;
            return self._onlyId;
        }

        private bindHash(hashCode: number, tmDoData: TmDoData):void{
            let tarFun = this._tarFun;
            let tmDoArr = tarFun[hashCode];
            if(!tmDoArr) tmDoArr = tarFun[hashCode] = [];
            tmDoArr.push(tmDoData);
        }
        
        private checkLoop(fun: Function, thisObject: any,type:number):boolean{
            let self = this;
            let hashCode = thisObject.hashCode;
            let tmDoArr = hashCode?self._tarFun[hashCode]:self._tmDoArr.concat(self._tmSecndDoArr);
            if(!tmDoArr) return false;
            if(hashCode && type == 1) delete self._tarFun[hashCode];
            let tmDo: TmDoData;
            for(let i = 0,len = tmDoArr.length; i < len; i++)
            {
                tmDo = tmDoArr[i];
                if(tmDo.loop <= 0) continue;
                if(type != 1 && tmDo.fun != fun) continue;
                if(hashCode || tmDo.thisObject == thisObject){
                    if(type <= 1) tmDo.loop = 0;
                    else return true;
                }
            }
            return false;
        }

        private isScend(time:number):boolean
        {
            if(time > 3000 && (time%1000 == 0))
            {
                return true;
            }
            return false;
        }

        //---------------------------------------------------↓对外接口↓--------------------------------------------------------------
        /**定时调用*/
        public loop(fun: Function, thisObject: any, delay: number, right:boolean = false,loop = 0, ...args): number {return this.addTmDo(fun, thisObject, delay, right, loop, true, args);}
        /**延迟执行*/
        public once(fun: Function, thisObject: any, delay: number, cover = true, ...args): number {return this.addTmDo(fun, thisObject, delay, false, 1, cover, args);}
        /**帧循环*/
        public frameLoop(fun: Function, thisObject: any, right = false, loop = 0, ...args): number {return this.addTmDo(fun, thisObject, 0, right, loop, true, args);}
        /**下帧调用*/
        public doNextFrame(fun: Function, thisObject: any, ...args): number {return this.addTmDo(fun, thisObject, 0, false, 1, true, args);}
        /** 清理定时器。*/
        public clear(fun: Function, thisObject: any):void{this.checkLoop(fun,thisObject,0);}
        /** 通过唯一id清理定时器。*/
        public clearById(id:number):void{if(this._tmDoMap[id]) this._tmDoMap[id].loop = 0;}
        /** 清理对象身上的所有定时器。*/
        public clearAll(thisObject: any): void {this.checkLoop(null,thisObject,1);}
        /** 是否有定时器*/
        public has(fun: Function, thisObject: any): boolean {return this.checkLoop(fun,thisObject,2);}
        /** 通过唯一id确定是否有定时器*/
        public hasById(id:number):boolean{return this._tmDoMap[id] && this._tmDoMap[id].loop > 0;}
        /** 实时帧间隔（毫秒）*/
        public get delta(): number {return this._frameInterval;}
        /** 时间缩放 */
        public scale: number = 1;
        //---------------------------------------------------↑对外接口↑--------------------------------------------------------------
    }
    interface TmDoData{ fun: Function; thisObject:any; st: number; delay:number; invalid:boolean; loop: number; params:any[]; id:number}
    export let loopMgr:LoopMgr;// = new LoopMgr();
}