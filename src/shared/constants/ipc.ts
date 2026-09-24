/**
 * Centralized IPC channel contract between Main and Renderer processes.
 */
export const IPC_CHANNELS = {
  // System information
  SYSTEM_GET_INFO: 'system:get-info',
  SYSTEM_PING: 'system:ping',

  // Window controls
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
  WINDOW_IS_MAXIMIZED: 'window:is-maximized'
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]
