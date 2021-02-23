import { app, BrowserWindow , Menu} from "electron";
import * as fs from "fs";
import * as path from "path";
import {ProcessMsg} from "./ProcessMsg"
import { getMenuList } from "./Menu";


let mainWindow:BrowserWindow;
let processMsg:ProcessMsg;
let isDebug = fs.existsSync(path.join(__dirname, "./../web/"));
  
const createWindow = () => {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences:{
        // 禁用同源策略
        webSecurity: false,
        nodeIntegration: true,
        // 必须手动设置webPreferences中的enableRemoteModule为true之后才能使用
        enableRemoteModule: true,   // 打开remote模块
      }
    });
    if(isDebug)//本地测试的地址
    {
      mainWindow.loadURL(`http://localhost:3000/index.html`);
      mainWindow.webContents.openDevTools();
    }else{//发布后的正式地址
      mainWindow.loadURL(`http://172.18.2.61/web/`);
    }
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
    //开始监听主进程和渲染进程的通信
    processMsg = new ProcessMsg(mainWindow);
    //设置菜单
    Menu.setApplicationMenu(getMenuList(isDebug, mainWindow, processMsg))

  };
  
  
  app.on('ready', createWindow);
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
