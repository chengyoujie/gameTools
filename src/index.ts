import { app, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";

let mainWindow;
  
const createWindow = () => {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences:{
        nodeIntegration: true
      }
    });
    if(fs.existsSync(path.join(__dirname, "./../web/")))//本地测试的地址
    {
      mainWindow.loadURL(`http://localhost:3000/index.html`);
      mainWindow.webContents.openDevTools();
    }else{//发布后的正式地址
      mainWindow.loadURL(`http://172.18.2.61/web/`);
    }
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
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
  