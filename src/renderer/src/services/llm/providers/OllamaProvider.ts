import { LLMProvider, Message, LLMOptions, ProviderModelTier } from '../types'

export class OllamaProvider implements LLMProvider {
  id = 'ollama' as const
  name = 'Ollama'
  isLocal = true

  models: ProviderModelTier[] = [
    {
      id: 'ollama-llama3.2',
      name: 'llama3.2',
      modelName: 'llama3.2',
      providerId: 'ollama',
      tier: 'low',
      badge: 'Fast'
    },
    {
      id: 'ollama-qwen2.5-coder',
      name: 'qwen2.5-coder',
      modelName: 'qwen2.5-coder:7b',
      providerId: 'ollama',
      tier: 'code',
      badge: 'Code'
    },
    {
      id: 'ollama-mistral',
      name: 'mistral',
      modelName: 'mistral:7b',
      providerId: 'ollama',
      tier: 'medium'
    }
  ]

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch('http://localhost:11434/api/tags', {
        signal: AbortSignal.timeout(1000)
      })
      return res.ok
    } catch {
      return false
    }
  }

  async listModels(): Promise<string[]> {
    try {
      const res = await fetch('http://localhost:11434/api/tags', {
        signal: AbortSignal.timeout(1200)
      })
      if (!res.ok) return this.models.map((m) => m.modelName)
      const data = await res.json()
      if (data.models && Array.isArray(data.models)) {
        return data.models.map((m: { name: string }) => m.name)
      }
      return this.models.map((m) => m.modelName)
    } catch {
      return this.models.map((m) => m.modelName)
    }
  }

  async *send(messages: Message[], options: LLMOptions): AsyncIterable<string> {
    const model = options.model || this.models[0].modelName

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        options: {
          temperature: options.temperature ?? 0.7
        }
      }),
      signal: options.signal
    })

    if (!response.ok || !response.body) {
      throw new Error(`Ollama request failed: ${response.statusText}`)
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
        if (!line.trim()) continue
        try {
          const parsed = JSON.parse(line)
          if (parsed.message?.content) {
            yield parsed.message.content
          }
        } catch {
          // Ignore incomplete JSON chunks
        }
      }
    }
  }
}
