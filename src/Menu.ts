import {Menu, MenuItem, MenuItemConstructorOptions, ipcMain, BrowserWindow} from "electron";
import { ProcessMsg } from "./ProcessMsg";
import { execmd } from "./Utils";
import * as fs from "fs";
import * as path from "path";

export function getMenuList(isDebug:boolean, mainWindow:BrowserWindow, processMsg:ProcessMsg)
{
    //设置菜单
  const template:MenuItemConstructorOptions[] | MenuItem[] = [
    {
      label:"工具",
      submenu:[
        {
          label:"刷新",
          accelerator:"F5",
          role:"reload"
        },
        {
          label:"打开控制台",
          accelerator:"F12",
          role:"toggleDevTools"
        }
      ]
    }
  ];
  if(isDebug)
  {
    template.push({
      label:"开发",
      submenu:[
        {
          label:"编译web",
          accelerator:"F11",
          click:()=>{
            processMsg.send2Render(11, __dirname);
            processMsg.send2Render(Main2RenderMsgType.EgretBuild);
          }
        }
      ]
    })
  }
  var list = Menu.buildFromTemplate(template);
  return list;
}