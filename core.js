const {app, BrowserWindow, ipcMain} = require('electron');
const url = require('url');
const path = require('path');
const client = require('discord-rich-presence')('705749603802152992');

let win,
    jsonparse;

function createWindow() {
   win = new BrowserWindow({
       width: 1100,
       height: 700,
       minHeight: 600,
       minWidth: 900,
       webPreferences: {
           webSecurity: false,
           nodeIntegration: false,
           webviewTag: true,
           preload: __dirname + "/page.js"
       },
       frame: false,
       icon: __dirname + "resources/icon.ico"
   });
   win.loadURL(url.format ({
      pathname: path.join(__dirname, 'page.html'),
      protocol: 'file:',
      slashes: true
  }));
}
//app.disableHardwareAcceleration();

app.on("ready", createWindow);

ipcMain.on("ytm-discord-rp", (e, message) => {
    jsonparse = JSON.parse(message);
    jsonparse.largeImageKey = "logo";
    jsonparse.smallImageKey = "smuwn";
    jsonparse.smallImageText = "App made by smuwn";

    if(jsonparse.details && !jsonparse.paused){
        if(!jsonparse.state){
            jsonparse.state = "   ";
        }
        client.updatePresence(jsonparse);
    }
    else client.updatePresence({
        smallImageText: jsonparse.smallImageText,
        smallImageKey: jsonparse.smallImageKey,
        largeImageKey: jsonparse.largeImageKey
    });
 });

 ipcMain.on("ytm-close", (e, message) => {
    if(message === "close") app.quit();
 });