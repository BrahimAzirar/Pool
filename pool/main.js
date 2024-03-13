const path = require('path');
const { app, BrowserWindow } = require('electron');

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
    title: "Pool",
      width: 1200,
      height: 700
    })
  
    // mainWindow.loadFile(path.join(__dirname, './src/index.html'))
    mainWindow.loadURL("http://localhost:3000/")
    mainWindow.setTitle("Pool");
    mainWindow.setIcon("app/public/imgs/icon.png");
    mainWindow.setMenu(null);
  }

  app.whenReady().then(() => {
    createMainWindow()
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
      })
  })