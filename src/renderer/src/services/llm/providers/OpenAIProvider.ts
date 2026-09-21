import { LLMProvider, Message, LLMOptions, ProviderModelTier } from '../types'

export class OpenAIProvider implements LLMProvider {
  id = 'openai' as const
  name = 'OpenAI'
  isLocal = false

  models: ProviderModelTier[] = [
    {
      id: 'openai-4o-mini-low',
      name: 'GPT-4o mini',
      modelName: 'gpt-4o-mini',
      providerId: 'openai',
      tier: 'low',
      badge: 'Fast',
      description: 'Léger, rapide et très économique'
    },
    {
      id: 'openai-4o-medium',
      name: 'GPT-4o',
      modelName: 'gpt-4o',
      providerId: 'openai',
      tier: 'medium',
      description: 'Polyvalent et performant en multimodal'
    },
    {
      id: 'openai-o1-high',
      name: 'o1 (Thinking)',
      modelName: 'o1',
      providerId: 'openai',
      tier: 'high',
      description: 'Raisonnement logique et mathématique avancé'
    }
  ]

  async isAvailable(): Promise<boolean> {
    return Boolean(localStorage.getItem('openai_api_key'))
  }

  async *send(messages: Message[], options: LLMOptions): AsyncIterable<string> {
    const apiKey = options.apiKey || localStorage.getItem('openai_api_key')
    if (!apiKey) throw new Error('API Key OpenAI manquante')

    const tierModel = options.tier
      ? this.models.find((m) => m.tier === options.tier)?.modelName
      : options.model || 'gpt-4o'

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
      throw new Error(`Erreur OpenAI: ${response.statusText}`)
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
