module tools {
    /**
     * 存储本地的数据
     * LocalDB类
     * made by cyj
     * create on 2021-01-21 21:21:15 
    */
    export class LocalDB {

        public constructor() {
            
        }

        public save(key:LocalDBKey, value:string|number){
            localStorage.setItem("db_"+key, value+"");
        }

        public get(key:LocalDBKey){
            return localStorage.getItem("db_"+key);
        }
    }
    /**本地存储的键值 */
    export const enum LocalDBKey {
        /**用户上次选择的项目 */
        SELECT_PROJECT =  1, 
    }

    export let localDB:LocalDB;
}