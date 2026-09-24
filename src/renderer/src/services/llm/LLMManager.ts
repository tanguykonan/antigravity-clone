import { LLMProvider, LLMProviderId, Message, LLMOptions, ProviderModelTier } from './types'
import { OllamaProvider } from './providers/OllamaProvider'
import { GeminiProvider } from './providers/GeminiProvider'
import { AnthropicProvider } from './providers/AnthropicProvider'
import { OpenAIProvider } from './providers/OpenAIProvider'
import { MistralProvider } from './providers/MistralProvider'

export interface ProviderGroup {
  id: LLMProviderId
  name: string
  isLocal: boolean
  tag?: string
  modelsCount?: number
}

class LLMManagerService {
  private providers: Map<LLMProviderId, LLMProvider> = new Map()
  private activeProviderId: LLMProviderId = 'anthropic'
  private activeTierId: string = 'claude-sonnet-medium'

  constructor() {
    this.registerProvider(new OllamaProvider())
    this.registerProvider(new GeminiProvider())
    this.registerProvider(new AnthropicProvider())
    this.registerProvider(new OpenAIProvider())
    this.registerProvider(new MistralProvider())
  }

  registerProvider(provider: LLMProvider) {
    this.providers.set(provider.id, provider)
  }

  getProvider(id: LLMProviderId): LLMProvider | undefined {
    return this.providers.get(id)
  }

  getAllProviders(): LLMProvider[] {
    return Array.from(this.providers.values())
  }

  getLocalProviders(): LLMProvider[] {
    return this.getAllProviders().filter((p) => p.isLocal)
  }

  getCloudProviders(): LLMProvider[] {
    return this.getAllProviders().filter((p) => !p.isLocal)
  }

  getActiveProvider(): LLMProvider {
    return this.providers.get(this.activeProviderId) || this.providers.get('anthropic')!
  }

  setActiveProvider(id: LLMProviderId) {
    if (this.providers.has(id)) {
      this.activeProviderId = id
    }
  }

  getActiveTierId(): string {
    return this.activeTierId
  }

  setActiveTierId(tierId: string) {
    this.activeTierId = tierId
  }

  // Returns models for a given provider (dynamic for Ollama, static for Cloud)
  async getModelsForProvider(providerId: LLMProviderId): Promise<ProviderModelTier[]> {
    const provider = this.providers.get(providerId)
    if (!provider) return []

    if (provider.id === 'ollama' && provider.listModels) {
      try {
        const localNames = await provider.listModels()
        return localNames.map((name) => ({
          id: `ollama-${name}`,
          name: name,
          modelName: name,
          providerId: 'ollama',
          tier: name.includes('coder') ? 'code' : 'low',
          badge: name.includes('coder') ? 'Code' : 'Local',
          isLocal: true
        }))
      } catch {
        return provider.models
      }
    }

    return provider.models
  }

  // Unified send stream method invoked by ChatInput
  async *send(messages: Message[], options: LLMOptions = {}): AsyncIterable<string> {
    const provider = this.getActiveProvider()
    yield* provider.send(messages, options)
  }
}

export const llmManager = new LLMManagerService()
