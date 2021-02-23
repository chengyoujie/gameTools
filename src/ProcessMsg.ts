import * as fs from "fs";
import * as path from "path";
import * as electron from "electron";
/**
 * 处理主进程和渲染进程的通信
 */
export class ProcessMsg{
    //渲染进程的窗口
    private win:electron.BrowserWindow;
    
    constructor(window:electron.BrowserWindow){
        let s = this;
        s.win = window;
        this.init();
    }
    private init(){
        let s = this;
        electron.ipcMain.on("renderSendMsg",(evt, ...args)=>{
            s.handleRenderMsg.apply(s, args);
            evt.returnValue = true;
        })

    }

    private handleRenderMsg(type:Render2MainMsgType, data?:any){
        console.log("收到消息")
    }

    public send2Render(type:Main2RenderMsgType, data?:any){
        let s = this;
        s.win.webContents.send("mainSendMsg", type, data);
    }
}