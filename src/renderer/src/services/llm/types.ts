export type LLMProviderId = 'ollama' | 'gemini' | 'anthropic' | 'openai' | 'mistral'
export type LLMTier = 'low' | 'medium' | 'high' | 'code'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface LLMOptions {
  model?: string
  tier?: LLMTier
  temperature?: number
  maxTokens?: number
  apiKey?: string
  signal?: AbortSignal
}

export interface ProviderModelTier {
  id: string
  name: string
  modelName: string
  providerId: LLMProviderId
  tier: LLMTier
  badge?: string
  description?: string
  hasSubmenu?: boolean
  isLocal?: boolean
}

export type LLMModel = ProviderModelTier

export interface LLMProvider {
  id: LLMProviderId
  name: string
  isLocal: boolean
  models: ProviderModelTier[]
  send(messages: Message[], options: LLMOptions): AsyncIterable<string>
  listModels?(): Promise<string[]>
  isAvailable(): Promise<boolean>
}
