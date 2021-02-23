module tools {
        /**
         * 文件处理类
         * FileUtils类
         * made by cyj
         * create on 2021-01-21 17:22:05 
        */
        export class FileUtils {

            /**
             * 删除文件或文件将
             * @param url 
             */
            public static removeDirSync(url:string) {
                var files = [];
                if (node.fs.existsSync(url)) {
                    files = node.fs.readdirSync(url);
                    files.forEach(function(file, index) {
                        var subUrl = node.path.join(url, file);
                        if (node.fs.statSync(subUrl).isDirectory()) { // recurse
                            FileUtils.removeDirSync(subUrl);
                        } else { // delete file
                            node.fs.unlinkSync(subUrl);
                        }
                    });
                    node.fs.rmdirSync(url);
                }
            }
    
        /**
         * 遍历文件或文件夹
         * @param url 
         * @param onFile 
         * @param onDir 
         * @param thisObj 
         */
        public static walkDir(url:string,onFile?:(url:string)=>void,onDir?:(url:string)=>void,thisObj?:any) {
            url = node.path.normalize(url);
            var stats = node.fs.statSync(url);
            if (stats.isDirectory()) {
                if(onDir) onDir.call(thisObj,url);
                var files = node.fs.readdirSync(url);
                for (var i = 0, len = files.length; i < len; i++) {
                    FileUtils.walkDir(node.path.join(url,files[i]),onFile,onDir,thisObj);
                }
            } else {
                if(onFile) onFile.call(thisObj,url);
            }
        }

        public static openFileSelect(onSelect?:(path:string)=>any, callBackThisObj?:any, defaultPath?:string, title?:string, selectFileType?:string[],  onCancle?:()=>any)
        {
            let filters:{name:string, extensions:string[]}[] = [
                { name: 'All Files', extensions: ['*'] }
            ];
            if(selectFileType)
            {
                filters.unshift({name:"文件", extensions:selectFileType});
            }
            title = title || "选择文件";
            Electron.dialog.showOpenDialog(
                {
                    title,
                    defaultPath:defaultPath,
                    filters,
                    properties:["openFile"]
                }
            ).then(result=>{
                if(result.filePaths && result.filePaths.length>0)
                {
                    if(onSelect)onSelect.call(callBackThisObj, result.filePaths[0]);
                }else{
                    if(onCancle)onCancle.call(callBackThisObj)
                }
            })
        }


        public static openDirSelect(onSelect?:(path:string)=>any, callBackThisObj?:any, defaultPath?:string, title?:string, onCancle?:()=>any){
            let filters:{name:string, extensions:string[]}[] = [
                { name: 'All Files', extensions: ['*'] }
            ];
            title = title ||"选择文件夹";
            Electron.dialog.showOpenDialog(
                {
                    title,
                    defaultPath:defaultPath,
                    filters,
                    properties:["openDirectory"]
                }
            ).then(result=>{
                if(result.filePaths && result.filePaths.length>0)
                {
                    if(onSelect)onSelect.call(callBackThisObj, result.filePaths[0]);
                }else{
                    if(onCancle)onCancle.call(callBackThisObj)
                }
            })
        }

        /**创建新的文件夹 */
        public static checkOrCreateDir(filePath:string)
        {
            filePath = node.path.normalize(filePath);
            let arr = node.path.parse(filePath).dir.split(node.path.sep);
            if(!arr || arr.length == 0)return;
            let dirpath = arr[0];
            for(let i=1; i<arr.length; i++)
            {
                dirpath = dirpath + node.path.sep+arr[i];
                if(!node.fs.existsSync(dirpath))
                {
                    node.fs.mkdirSync(dirpath);
                }
            }
        }


        /**
     * 拷贝文件
     * @param url 
     * @param toUrl 
     * @param override 
     */
    public static copy(url:string, toUrl:string, override:boolean=true)
    {
        if(!node.fs.existsSync(url))
        {
            console.log("拷贝失败：没有找到"+url);
            return;
        }
        this.checkOrCreateDir(toUrl);
        var stats = node.fs.statSync(url);
        if (stats.isDirectory()) {
            url = node.path.normalize(url); 
            this.walkDir(url, (walkUrl:string)=>{
                let walkToUrl = walkUrl.replace(url, toUrl);
                this.copyFileSync(walkUrl, walkToUrl, override);
            });
        }else{
            this.copyFileSync(url, toUrl, override);
        }
    }

    /**
     * 同步拷贝文件
     * @param url 
     * @param toUrl 
     * @param override 
     */
    private static copyFileSync(url:string, toUrl:string, override:boolean=true)
    {
        if(!override && node.fs.existsSync(toUrl))return;
        if(node.fs.copyFileSync)//有的版本的nodejs可能没有这个方法导致报错
        {
            node.fs.copyFileSync(url, toUrl);
        }else{
            let data = node.fs.readFileSync(url);
            node.fs.writeFileSync(toUrl, data);
        }
    }

    }
}