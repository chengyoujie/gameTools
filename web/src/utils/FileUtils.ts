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
        public static walkDir(url:string,onFile:(url:string)=>void,onDir:(url:string)=>void,thisObj:any) {
            url = node.path.normalize(url);
            var stats = node.fs.statSync(url);
            if (stats.isDirectory()) {
                if(onDir) onDir.call(thisObj,url);
                var files = node.fs.readdirSync(url);
                for (var i = 0, len = files.length; i < len; i++) {
                    FileUtils.walkDir(node.path.join(url,files[i]),onFile,onDir,thisObj);
                }
                return true;
            } else {
                if(onFile) onFile.call(thisObj,url);
                return false;
            }
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

    }
}