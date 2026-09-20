import { BrowserWindow } from 'electron'
import { registerSystemHandlers } from './systemHandlers'
import { registerWindowHandlers } from './windowHandlers'

/**
 * Enregistrement centralisé de tous les modules IPC
 */
export function registerIpcHandlers(mainWindow: BrowserWindow): void {
  registerSystemHandlers()
  registerWindowHandlers(mainWindow)
}
