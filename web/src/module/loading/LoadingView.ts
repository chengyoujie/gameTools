namespace tools {
    /**
     * AutoCodeEui 生成的界面 
     * euiPath:resource\skin\loading\LoadingSkin.exml  
     * made by cyj
     * create on 2021-01-21 11:02:12 
    */
    export class LoadingView extends eui.Component implements RES.PromiseTaskReporter {

        constructor(){
            super();
            this.skinName = 'LoadingSkin';
        }

        /**界面创建成功**/
        protected childrenCreated() {
            super.childrenCreated();
            let s = this;
            s.width = s.stage.stageWidth;
            s.height = s.stage.stageHeight;
        }

        
        public onProgress(current: number, total: number): void {
            let s = this;
            s.progress_bar.maximum = total;
            this.progress_bar.value = current;
        }

        

        /**界面销毁**/
        public destroy(): void {
            
        }
    }
}
