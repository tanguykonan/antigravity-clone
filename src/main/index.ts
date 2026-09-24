import { app, BrowserWindow } from 'electron'
import { createMainWindow } from './windows/mainWindow'
import { registerIpcHandlers } from './ipc'

// Prevent multiple instances of the application
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
      // On macOS, recreate a window when dock icon is clicked and no windows are open
      if (BrowserWindow.getAllWindows().length === 0) {
        mainWindow = createMainWindow()
        registerIpcHandlers(mainWindow)
      }
    })
  })

  app.on('window-all-closed', () => {
    // On macOS, applications typically stay active until the user explicitly quits with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
