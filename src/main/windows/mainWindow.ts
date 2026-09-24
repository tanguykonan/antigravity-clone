import { BrowserWindow, shell } from 'electron'
import { join } from 'path'

export function createMainWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    icon: join(__dirname, '../../resources/myicon.png'),
    show: false,
    frame: false,          // Remove native Windows title bar - we use custom TitleBar
    autoHideMenuBar: true,
    backgroundColor: '#141414',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Show window only when ready to prevent white flash
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Open external web links in OS default browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load Vite dev server URL in development or static index.html in production
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
