
import { app, BrowserWindow, ipcMain } from 'electron'
//import { BinaryValue, Gpio } from 'onoff';
import path from 'node:path'
const { exec } = require('child_process');


// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
    win = new BrowserWindow({
      icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    })
  win.setMenu(null);
win.setFullScreen(true);
exec('gpio mode 2 out&&gpio write 2 1', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
});
// Test active push message to Renderer-process.
win.webContents.on('did-finish-load', () => {
  win?.webContents.send('main-process-message', (new Date).toLocaleString())
})

if (VITE_DEV_SERVER_URL) {
  win.loadURL(VITE_DEV_SERVER_URL)
} else {
  // win.loadFile('dist/index.html')
  win.loadFile(path.join(process.env.DIST, 'index.html'))
}
}
ipcMain.on('data', (event, msg) => {
  exec('gpio write 2 0', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }

    // Después de 500 ms, revertir a 1
    setTimeout(() => {
      exec('gpio write 2 1', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error}`);
          return;
        }
        console.log('gpio write 2 1 completado');
      });
    }, 100);
  });
  exec('node /home/orangepi/Desktop/prueba/index.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    console.log('ticket listo ');
  });
  setTimeout(() => {
    exec('lp ticket.bin', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        return;
      }
      console.log('ticket impreso ');
    });
  }, 100);
  
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
