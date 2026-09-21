import { LLMProvider, Message, LLMOptions, ProviderModelTier } from '../types'

export class MistralProvider implements LLMProvider {
  id = 'mistral' as const
  name = 'Mistral AI'
  isLocal = false

  models: ProviderModelTier[] = [
    {
      id: 'mistral-small-low',
      name: 'Mistral Small',
      modelName: 'mistral-small-latest',
      providerId: 'mistral',
      tier: 'low',
      badge: 'Fast',
      description: 'Léger et économique'
    },
    {
      id: 'mistral-large-medium',
      name: 'Mistral Large',
      modelName: 'mistral-large-latest',
      providerId: 'mistral',
      tier: 'medium',
      description: 'Capacité de raisonnement supérieure'
    },
    {
      id: 'mistral-codestral',
      name: 'Codestral',
      modelName: 'codestral-latest',
      providerId: 'mistral',
      tier: 'code',
      badge: 'Code',
      description: 'Spécialisé pour le code et la complétion'
    }
  ]

  async isAvailable(): Promise<boolean> {
    return Boolean(localStorage.getItem('mistral_api_key'))
  }

  async *send(messages: Message[], options: LLMOptions): AsyncIterable<string> {
    const apiKey = options.apiKey || localStorage.getItem('mistral_api_key')
    if (!apiKey) throw new Error('API Key Mistral manquante')

    const tierModel = options.tier
      ? this.models.find((m) => m.tier === options.tier)?.modelName
      : options.model || 'mistral-large-latest'

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: tierModel,
        messages,
        stream: true
      }),
      signal: options.signal
    })

    if (!response.ok || !response.body) {
      throw new Error(`Erreur Mistral: ${response.statusText}`)
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
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') return
          try {
            const data = JSON.parse(raw)
            const text = data.choices?.[0]?.delta?.content
            if (text) yield text
          } catch {
            // Ignore
          }
        }
      }
    }
  }
}
