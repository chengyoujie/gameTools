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

    export let localDB:LocalDB;
}