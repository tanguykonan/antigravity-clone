import { SystemInfo } from './system'

export interface ElectronAPI {
  system: {
    getInfo: () => Promise<SystemInfo>
    ping: (message: string) => Promise<string>
  }
  window: {
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
    isMaximized: () => Promise<boolean>
  }
}
