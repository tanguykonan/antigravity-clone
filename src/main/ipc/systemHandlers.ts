import { app, ipcMain } from 'electron'
import { IPC_CHANNELS } from '../../shared/constants/ipc'
import { SystemInfo } from '../../shared/types/system'

export function registerSystemHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.SYSTEM_GET_INFO, async (): Promise<SystemInfo> => {
    return {
      platform: process.platform,
      arch: process.arch,
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node,
      appVersion: app.getVersion()
    }
  })

  ipcMain.handle(IPC_CHANNELS.SYSTEM_PING, async (_event, message: string): Promise<string> => {
    return `Pong from Electron Main! Reçu: "${message}" à ${new Date().toLocaleTimeString()}`
  })
}
