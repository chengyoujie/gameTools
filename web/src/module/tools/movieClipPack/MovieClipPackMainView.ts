namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\tools\movieClipPack\MovieClipPackMainSkin.exml  
     * made by cyj
     * create on 2021-02-18 20:14:28 
    */
    export class MovieClipPackMainView extends AbstractToolsView {

        constructor(opt?: ShowOptions){
            super(opt);
            this.skinName = 'MovieClipPackMainSkin';
        }

        /**界面创建成功**/
        protected onCreate() {

        }
        
        public onProjectChange(projectInfo:ProjectConfig):void
        {
            let s = this;
            s.lbl_msg.text = "项目改变"+projectInfo.name;
        }

        /**界面打开**/
        onOpen(){
            let s = this;
            s.btn_oper.clk(s.handleStarRead, s);
        }

        private handleStarRead(){
            let s = this;
            // FileUtils.openFileSelect((path)=>{
            //     console.log("选择了"+path);
            //     s.lbl_msg.text = node.fs.readFileSync(path, "utf-8")
            // }, s, "D:/", "选择json文件", ["json", "txt"])
            // FileUtils.openDirSelect((path)=>{
            //     console.log("选择了"+path);
            //     s.lbl_msg.text = path;
            // })
            // ui.alert("测试"); 
            // console.log(node.fs.existsSync(node.path.join(ToolsApp.rootPath, "lib/texturepacker")))
            // CmdUtils.execmd("")
        }

        onDragFile(files:string[]){
            let s = this;
            s.lbl_msg.text = node.fs.readFileSync(files[0], "utf-8");
        }

        /**界面销毁**/
        public onClose(): void {
            
        }
    }
}
