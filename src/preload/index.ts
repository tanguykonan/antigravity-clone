import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from '../shared/constants/ipc'
import { ElectronAPI } from '../shared/types/ipc'

/**
 * Secure bridge exposing typed API to the Renderer Process.
 * No raw Node.js API is directly exposed to the Renderer.
 */
const api: ElectronAPI = {
  system: {
    getInfo: () => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_GET_INFO),
    ping: (message: string) => ipcRenderer.invoke(IPC_CHANNELS.SYSTEM_PING, message)
  },
  window: {
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_MAXIMIZE),
    close: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_CLOSE),
    isMaximized: () => ipcRenderer.invoke(IPC_CHANNELS.WINDOW_IS_MAXIMIZED)
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', api)
  } catch (error) {
    console.error('Failed to expose electronAPI in main world:', error)
  }
} else {
  // Fallback if contextIsolation is disabled (discouraged)
  // @ts-ignore (define in window)
  window.electronAPI = api
}
