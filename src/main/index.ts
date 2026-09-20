import { app, BrowserWindow } from 'electron'
import { createMainWindow } from './windows/mainWindow'
import { registerIpcHandlers } from './ipc'

// Empêcher les lancements multiples de l'application
const gotTheLock = app.requestSingleInstanceLock()

let mainWindow: BrowserWindow | null = null

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    mainWindow = createMainWindow()
    registerIpcHandlers(mainWindow)

    app.on('activate', () => {
      // Sur macOS, recréer une fenêtre quand l'icône du dock est cliquée et qu'aucune fenêtre n'est ouverte
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createMainWindow()
        registerIpcHandlers(mainWindow)
      }
    })
  })

  app.on('window-all-closed', () => {
    // Sur macOS, les applications restent généralement actives jusqu'à ce que l'utilisateur quitte explicitement avec Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
