/**
 * Contrat centralisé des canaux IPC entre Main et Renderer process.
 */
export const IPC_CHANNELS = {
  // Informations système
  SYSTEM_GET_INFO: 'system:get-info',
  SYSTEM_PING: 'system:ping',

  // Contrôles de la fenêtre
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
  WINDOW_IS_MAXIMIZED: 'window:is-maximized'
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]
