namespace tools{
    export interface IObserver {
        target: any;
        selector: Function;
        once: boolean;
        name: string | number;
        withEvt: boolean;
    }
    
    /**
     * 事件类
     * */
    export class Observer extends egret.HashObject {
        private _obsMap: egret.MapLike<IObserver[]> = {};
        private _tarMap: egret.MapLike<IObserver[]> = {};

        constructor(check = false){
            super();
            let self = this;
            if(check) loopMgr.loop(self.rmvInvalid,self,300000);
        }
        /**
        * 注册事件
        * name:事件名
        * selector:事件回调
        * target：作用域
        * */
        public on(name: string | number, selector: Function, target: any, right = false, once = false, withEvt = false): void {
            let self = this;
            if(right) selector.apply(target);
            if(self.has(name,selector,target)) return;
            
            let evtObInfo:{evtObjs:Observer[],evtHash:egret.MapLike<boolean>} = target.evtObInfo;
            if(evtObInfo)
            {
                if(!evtObInfo.evtHash[self.hashCode])
                { 
                    evtObInfo.evtHash[self.hashCode] = true;
                    evtObInfo.evtObjs.push(self);
                }
            }
            
            let obsers = self._obsMap[name];
            if(!obsers) obsers = self._obsMap[name] = [];
            let data:IObserver = { target: target, selector: selector, once: once, name: name, withEvt: withEvt};
            obsers.reverse();
            obsers.push(data);
            obsers.reverse();
            if(target.hashCode)
            {
                let tarObsers = self._tarMap[target.hashCode];
                if(!tarObsers) tarObsers = self._tarMap[target.hashCode] = [];
                tarObsers.push(data);
            }
        }

        /**
        * 注册一次性事件
        * name:事件名
        * selector:事件回调
        * target：作用域
        * */
        public once(name: string | number, selector: Function, target: any, withEvt = false): void {
            this.on(name, selector, target, false, true, withEvt);
        }

        /**
         * 移除事件
         * */
        public off(name: string | number, selector: Function, target: any): void {
            let self = this;
            let observer = self.has(name,selector,target);
            if(observer) observer.selector = observer.target = null;
        }

        public rmvByTar(target:any): void {
            let self = this;
            let obsers:IObserver[];
            let observer:IObserver;
            if(target.hashCode)
            {
                obsers = self._tarMap[target.hashCode];
                if(obsers) {
                    for (let i = 0, n = obsers.length; i < n; i++) {
                        observer = obsers[i];
                        if (observer.selector) observer.selector = observer.target = null;
                    }
                }
                delete self._tarMap[target.hashCode];
            }
            else
            {
                let obsMap = self._obsMap;
                for(let name in obsMap)
                {
                    obsers = obsMap[name];
                    if(!obsers) continue;
                    for (let i = obsers.length - 1; i >= 0; i--) {
                        observer = obsers[i];
                        if (observer.target == target) observer.selector = observer.target = null;
                    }
                }    
            } 
        }

        /**
        * 事件抛送
        * */
        public post(name: string | number, ...arg): void {
            let self = this;
            let obsers = self._obsMap[name];
            if(!obsers) return;
            obsers = obsers.concat();//需要拷贝一份，因为后面的方法执行时有可能导致数组内容改变
            let invalidCnt = 0;
            let observer:IObserver;
            let selector:Function;
            let target:any;
            let withEvt:boolean;
            let evtArg = [name].concat(arg);
            for (let i = obsers.length - 1; i >= 0; --i) {
                observer = obsers[i];
                selector = observer.selector;
                if(!selector)
                {
                    invalidCnt++;
                    continue;
                } 
                target = observer.target;
                withEvt = observer.withEvt;
                if (observer.once) observer.selector = observer.target = null;
                selector.apply(target, withEvt?evtArg:arg);
            }
            if(invalidCnt > 10) self.clearInvalid(name,self._obsMap);
        }

        private clearInvalid(key: string | number,map:egret.MapLike<IObserver[]>):void
        {
            let obsers = map[key];
            let newObsers = [];
            let observer:IObserver;
            for(let i = 0, len = obsers.length; i < len; i++)
            {
                observer = obsers[i];
                if(observer.selector) newObsers.push(observer);
            }
            map[key] = newObsers;
        }

        private has(name: string | number, selector: Function, target: any):IObserver
        {
            let self = this;
            let nameObsers = self._obsMap[name];
            let tarObsers = self._tarMap[target.hashCode];
            if(!nameObsers) return null;
            let tarObsersLen = tarObsers?tarObsers.length:0;
            let nameObsersLen = nameObsers.length;
            let temp:IObserver;
            let invalidCnt = 0;
            let i = 0;
            if(target.hashCode && nameObsersLen > tarObsersLen)
            {
                if(!tarObsers) return null;
                for (; i < tarObsersLen; i++) {
                    temp = tarObsers[i];
                    if(!temp.selector)
                    {
                        invalidCnt++;
                        continue;
                    }
                    if (temp.name == name && temp.selector == selector) return temp;
                }
                if(invalidCnt > 5) self.clearInvalid(target.hashCode,self._tarMap);
            }
            else
            {
                for (; i < nameObsersLen; i++) {
                    temp = nameObsers[i];
                    if(!temp.selector)
                    {
                        invalidCnt++;
                        continue;
                    }
                    if (temp.target == target && temp.selector == selector) return temp;
                }
                if(invalidCnt > 5) self.clearInvalid(name,self._obsMap);
            }
            return null;
        }

        private rmvInvalid():void
        {
            let self = this;
            self.rmvInvalidMap(self._obsMap);
            self.rmvInvalidMap(self._tarMap);
        }

        private rmvInvalidMap(obsMap: egret.MapLike<IObserver[]>):void
        {
            let observer:IObserver;
            let observers:IObserver[];
            for(let key in obsMap)
            {
                observers = obsMap[key];
                for(let i = observers.length - 1; i >= 0; i--)
                {
                    observer = observers[i];
                    if(!observer.selector) observers.splice(i,1);
                }
                if(observers.length <= 0) delete obsMap[key]; 
            }
        }
    }
    export let observer;// = new Observer(true);
}