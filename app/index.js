var fs = require('fs');  
var path = require('path');  
var node_modules_folder = path.join(__dirname, "node_modules");

if (!fs.existsSync(node_modules_folder)){
  const {dialog} = require('electron')
  dialog.showErrorBox("setup incomplete", "cannot find folder \"" + node_modules_folder + "\".\nplease open a shell and type `cd " + __dirname + " && npm install`.");
  process.exit(1);
} else {
  const {app} = require('electron');
  const {BrowserWindow} = require('electron');

  // Report crashes to our server.
  //require('crash-reporter').start();

  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the javascript object is GCed.
  var mainWindow = null; 
  app.on('window-all-closed', function() {
    if (process.platform !== 'darwin'){
      app.quit();
    }
  });

  app.setAppUserModelId('<sulu>');

  app.on('ready', function() {

    mainWindow = new BrowserWindow({ 
      width: 800, height: 600, title : "sulu",
      icon: __dirname + '/icon.png',
      transparent: false,
      frame: true
    });

  

    mainWindow.loadURL('file://' + __dirname + '/index.html');
     mainWindow.maximize();

    mainWindow.on('closed', function() {
      mainWindow = null;
    });
  });
}