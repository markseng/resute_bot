import { app , ipcMain, dialog} from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { autoUpdater } from 'electron-updater';

const isProd: boolean = process.env.NODE_ENV === 'production';
let mainWindow
if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

   mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

function sendStatusToWindow(text) {
  

  
 switch (text){
   case  "isUpdate":
    dialog.showMessageBox(mainWindow, {
      message: "Há uma nova atualização! Por favor não feche o app. em breve recebera outra menssagem para está reniciando o app"
    })
   break
   case "DowloadFinish":
    dialog.showMessageBox(mainWindow, {
      message: "Atualizações foram feitas, por favor renicie o app!"
    })
    app.relaunch()
    app.exit()
     break

 }

  mainWindow.webContents.send('message', text);
}

ipcMain.on('checkUpdate', async (ev ,data)=>{
  await autoUpdater.checkForUpdatesAndNotify();
})

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('isUpdate');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('DowloadFinish');
});
