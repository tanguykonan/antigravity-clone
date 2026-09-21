import { LLMProvider, Message, LLMOptions, ProviderModelTier } from '../types'

export class AnthropicProvider implements LLMProvider {
  id = 'anthropic' as const
  name = 'Anthropic'
  isLocal = false

  models: ProviderModelTier[] = [
    {
      id: 'claude-haiku-low',
      name: 'Claude 3.5 Haiku',
      modelName: 'claude-3-5-haiku-20241022',
      providerId: 'anthropic',
      tier: 'low',
      badge: 'Fast',
      description: 'Ultra-rapide et économique'
    },
    {
      id: 'claude-sonnet-medium',
      name: 'Claude 3.7 Sonnet (Thinking)',
      modelName: 'claude-3-7-sonnet-20250219',
      providerId: 'anthropic',
      tier: 'medium',
      description: 'Capacité de raisonnement de pointe'
    },
    {
      id: 'claude-opus-high',
      name: 'Claude 3.7 Opus (Thinking)',
      modelName: 'claude-3-7-opus-20250219',
      providerId: 'anthropic',
      tier: 'high',
      description: 'Expertise maximale et réflexion profonde'
    }
  ]

  async isAvailable(): Promise<boolean> {
    return Boolean(localStorage.getItem('anthropic_api_key'))
  }

  async *send(messages: Message[], options: LLMOptions): AsyncIterable<string> {
    const apiKey = options.apiKey || localStorage.getItem('anthropic_api_key')
    if (!apiKey) throw new Error('API Key Anthropic manquante')

    const tierModel = options.tier
      ? this.models.find((m) => m.tier === options.tier)?.modelName
      : options.model || 'claude-3-7-sonnet-20250219'

    const systemMessage = messages.find((m) => m.role === 'system')?.content
    const conversationMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }))

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: tierModel,
        max_tokens: options.maxTokens || 4096,
        system: systemMessage,
        messages: conversationMessages,
        stream: true
      }),
      signal: options.signal
    })

    if (!response.ok || !response.body) {
      throw new Error(`Erreur Anthropic: ${response.statusText}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.type === 'content_block_delta' && data.delta?.text) {
              yield data.delta.text
            }
          } catch {
            // Ignore
          }
        }
      }
    }
  }
}
