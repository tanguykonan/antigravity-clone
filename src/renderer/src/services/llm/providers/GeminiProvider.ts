import { LLMProvider, Message, LLMOptions, ProviderModelTier } from '../types'

export class GeminiProvider implements LLMProvider {
  id = 'gemini' as const
  name = 'Google Gemini'
  isLocal = false

  models: ProviderModelTier[] = [
    {
      id: 'gemini-flash-low',
      name: 'Gemini 2.5 Flash',
      modelName: 'gemini-2.5-flash',
      providerId: 'gemini',
      tier: 'low',
      badge: 'Fast',
      description: 'Rapide, économique et performant',
      hasSubmenu: true
    },
    {
      id: 'gemini-flash-medium',
      name: 'Gemini 2.5 Flash',
      modelName: 'gemini-2.5-flash',
      providerId: 'gemini',
      tier: 'medium',
      description: 'Équilibré pour toutes tâches quotidiennes',
      hasSubmenu: true
    },
    {
      id: 'gemini-pro-high',
      name: 'Gemini 2.5 Pro',
      modelName: 'gemini-2.5-pro',
      providerId: 'gemini',
      tier: 'high',
      description: 'Puissant avec raisonnement avancé',
      hasSubmenu: true
    }
  ]

  async isAvailable(): Promise<boolean> {
    return Boolean(localStorage.getItem('gemini_api_key'))
  }

  async *send(messages: Message[], options: LLMOptions): AsyncIterable<string> {
    const apiKey = options.apiKey || localStorage.getItem('gemini_api_key')
    if (!apiKey) throw new Error('API Key Gemini manquante')

    const tierModel = options.tier
      ? this.models.find((m) => m.tier === options.tier)?.modelName
      : options.model || 'gemini-2.5-flash'

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${tierModel}:streamGenerateContent?alt=sse&key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
      signal: options.signal
    })

    if (!response.ok || !response.body) {
      throw new Error(`Erreur Gemini: ${response.statusText}`)
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
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) yield text
          } catch {
            // Ignore
          }
        }
      }
    }
  }
}
