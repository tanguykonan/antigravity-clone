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
    frame: false,          // Supprime la barre native Windows — on gère notre propre titlebar
    autoHideMenuBar: true,
    backgroundColor: '#141414',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // Afficher la fenêtre uniquement quand elle est prête pour éviter un flash blanc
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Ouvrir les liens web externes dans le navigateur par défaut de l'OS
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Chargement de l'URL Vite en dev ou du fichier html en production
  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}
