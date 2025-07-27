const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu
} = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 700,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });
  mainWindow.on('close', (e) => {
    e.preventDefault();
    mainWindow.hide();
  });
}
function enableAutoLaunch() {
  app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath,
    args: ['--hidden']
  });
}

const DATA_PATH = path.join(app.getPath('userData'), 'messages.json');
ipcMain.handle('load-messages', () => {
  try {
    if (!fs.existsSync(DATA_PATH)) {
      fs.writeFileSync(DATA_PATH, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_PATH));
  } catch (err) {
    console.error('読み込みエラー:', err);
    return [];
  }
});
ipcMain.on('save-messages', (event, messages) => {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error('保存エラー:', err);
  }
});


app.whenReady().then(() => {
  createWindow();
  enableAutoLaunch();
  tray = new Tray(path.join(__dirname, 'assets', 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: '表示', click: () => {
        if (!mainWindow || mainWindow.isDestroyed()) {
          mainWindow = new BrowserWindow({
            width: 600,
            height: 700,
            show: false,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false,
            }
          });
          mainWindow.loadFile('index.html');
        }
        mainWindow.show();
      }
    },
    { label: '終了', click: () => app.quit() },
  ]);
  tray.setToolTip('爆速メッセージ');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });

  // TD: Check if app is set to launch at login
  const settings = app.getLoginItemSettings();
  console.log('Auto Launch:', settings.openAtLogin);
});
app.on('before-quit', () => {
  if (tray) tray.destroy();
});
app.on('window-all-closed', (e) => {
  e.preventDefault();
});

// for macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});