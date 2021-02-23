namespace tools {

    export interface IPoolObject{
        /**从缓存池拿出前重置的函数 */
        onReset?:()=>void;
        /**放进缓存池前调用的函数 */
        onRecycle?:()=>any;// { () };
    }

    export class ObjPool  extends egret.HashObject {
        private _poolMap: egret.MapLike<IPoolObject[]> = {};
        // public pop<T>(thisObj: {new():eui.Label}): T 
        // public pop<T>(thisObj: {new():eui.Image}): T 
        // public pop<T>(thisObj: {new():egret.BitmapText}): T 
        // public pop<T>(thisObj: {new():egret.TextField}): T 
        // public pop<T>(thisObj: {new():T&IPoolObject}): T 
        public pop<T>(thisObj: {new(...args):T&IPoolObject}): T {
            let self = this;
            let pool: T&IPoolObject;
            let clsName: string = egret.getQualifiedClassName(thisObj);
            let pools: any[] = self._poolMap[clsName];
            if (!pools || pools.length <= 0) {
                pool = new thisObj();
            }
            else {
                pool = pools.shift();
                if(typeof pool.onReset == "function")
                    pool.onReset();
            }
            return pool;
        }

        public push(pool: any,max:number = 20): void {
            if(!pool)return;//空对象不能放到池中
            let self = this;
            let clsName: string = egret.getQualifiedClassName(pool);
            let pools: IPoolObject[] = self._poolMap[clsName];
            if (!pools) pools = self._poolMap[clsName] = [];
            else if(pools.length > max) return;
            if (pools.indexOf(pool) < 0) {
                if(typeof pool.onRecycle == "function")
                    pool.onRecycle();
                pools.push(pool);
            }
        }
    }
    export var objPool: ObjPool = new ObjPool();
}