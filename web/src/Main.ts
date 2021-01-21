

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();
        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        tools.ToolsApp.stage = egret.sys.$TempStage;
        this.runGame();
    }

    private async runGame() {
        await RES.loadConfig("resource/default.res.json", "resource/");
        await this.loadTheme();
        
        const loadingView = new tools.LoadingView();
        this.stage.addChild(loadingView);
        await RES.loadGroup("preload", 0, loadingView);
        this.stage.removeChild(loadingView);
        const view = new tools.MainView();
        this.stage.addChild(view);
        node.fs.existsSync("D:/text.txt");
    }


    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve("");
            }, this);

        })
    }

}
