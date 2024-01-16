
import { app, BrowserWindow, ipcMain } from 'electron'
//import { BinaryValue, Gpio } from 'onoff';
import path from 'node:path'
const { exec } = require('child_process');
const Gpio = require("onoff").Gpio;
const ThermalPrinter = require("node-thermal-printer").printer;
const Types = require("node-thermal-printer").types;
// Obtener la fecha y hora actual


async function printImage() {
  const fechaHoraActual = new Date();
  fechaHoraActual.setHours(fechaHoraActual.getHours());

  // Formatear la fecha y hora en una cadena
  const cadenaFechaHora = fechaHoraActual.toLocaleString();
  const printer = new ThermalPrinter({
    type: Types.EPSON,
    interface: '/home/pi/ticket.bin',
  });
  printer.alignCenter();
  await printer.printImage('/home/pi/BuzonElectron/Prueba/g.png')
  printer.bold(true);
  printer.setTextSize(1, 1);
  printer.println("SUS DOCUMENTOS");
  printer.println("SERAN REVISADOS");
  printer.newLine();
  printer.newLine();
  printer.bold(true);
  printer.setTextSize(0, 0);
  printer.println(cadenaFechaHora);

  printer.cut();
  printer.execute();
}



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
function executeCommand(command: any) {
  return new Promise<void>((resolve, reject) => {
    exec(command, (error: any, stdout: any) => {
      if (error) {
        console.error(`Error: ${error}`);
        reject(error);
      } else {
        console.log(stdout);
        resolve();
      }
    });
  });
}
function mainFun(){
  const led = new Gpio(4, 'out');
  setTimeout(() => {

    led.writeSync(0);
    led.writeSync(1);
  }, 100);
  printImage();
}
ipcMain.on('data', () => {
  
  Promise.all([
    mainFun()
  ])
    .then(() => {
      // Luego de que ambos comandos anteriores hayan terminado, ejecutar el tercer comando
      return executeCommand('lp /home/pi/ticket.bin');
    })
    .catch((error) => {
      console.error(`Error en algún comando: ${error}`);
    });
    
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
