import { SystemInfo } from '@shared/types/system'

/**
 * Service d'accès aux fonctionnalités Electron sécurisées.
 * Assure un découplage propre entre les composants React et l'API Electron globale.
 */
class ElectronService {
  private get api() {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI
    }
    return null
  }

  public isElectron(): boolean {
    return Boolean(this.api)
  }

  public async getSystemInfo(): Promise<SystemInfo | null> {
    if (!this.api) {
      console.warn('Electron API is not available in browser mode.')
      return null
    }
    return await this.api.system.getInfo()
  }

  public async ping(message: string): Promise<string> {
    if (!this.api) {
      return `Mock Pong: Mode navigateur (${message})`
    }
    return await this.api.system.ping(message)
  }

  public async minimize(): Promise<void> {
    await this.api?.window.minimize()
  }

  public async maximize(): Promise<void> {
    await this.api?.window.maximize()
  }

  public async close(): Promise<void> {
    await this.api?.window.close()
  }

  public async isMaximized(): Promise<boolean> {
    return (await this.api?.window.isMaximized()) ?? false
  }
}

export const electronService = new ElectronService()
