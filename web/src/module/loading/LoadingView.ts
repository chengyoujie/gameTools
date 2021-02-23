namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\loading\LoadingSkin.exml  
     * made by cyj
     * create on 2021-01-21 11:02:12 
    */
    export class LoadingView extends Component implements RES.PromiseTaskReporter {

        constructor(){
            super();
            this.skinName = 'LoadingSkin';
        }

        /**界面创建成功**/
        protected onCreate() {
            let s = this;
        }

        onOpen(){
            let s = this;
            s.onResize();
        }

        /**界面创建成功**/
        onResize() {
            let s = this;
            s.width = ToolsApp.stage.stageWidth;
            s.height = ToolsApp.stage.stageHeight;
        }
        
        public onProgress(current: number, total: number): void {
            let s = this;
            s.progress_bar.maximum = total;
            this.progress_bar.value = current;
        }

        /**界面关闭**/
        public onClose(): void {
            
        }

        
        /**界面销毁**/
        public onDestroy(): void {
            
        }

    }
}
