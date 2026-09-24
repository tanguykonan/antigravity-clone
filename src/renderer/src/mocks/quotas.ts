export interface ProviderQuotaInfo {
  id: 'gemini' | 'anthropic' | 'openai' | 'mistral'
  name: string
  resetDate: string
  periods: {
    label: string
    limit: string
    percentage: number
  }[]
}

export const MOCK_PROVIDER_QUOTAS: ProviderQuotaInfo[] = [
  {
    id: 'gemini',
    name: 'Gemini Models',
    resetDate: 'Resets Oct 28',
    periods: [
      { label: 'Weekly Quota', limit: '100% of weekly limit left', percentage: 100 },
      { label: '5-Hour Quota', limit: '100% left', percentage: 100 }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic Models',
    resetDate: 'Resets Oct 28',
    periods: [
      { label: 'Weekly Quota', limit: '100% of weekly limit left', percentage: 100 },
      { label: '5-Hour Quota', limit: '100% left', percentage: 100 }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI Models',
    resetDate: 'Resets Oct 28',
    periods: [
      { label: 'Weekly Quota', limit: '100% of weekly limit left', percentage: 100 },
      { label: '5-Hour Quota', limit: '100% left', percentage: 100 }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral Models',
    resetDate: 'Resets Oct 28',
    periods: [
      { label: 'Weekly Quota', limit: '100% of weekly limit left', percentage: 100 },
      { label: '5-Hour Quota', limit: '100% left', percentage: 100 }
    ]
  }
]

export interface TokenUsageStats {
  usedTokens: number
  maxTokens: number
  percentage: number
  breakdown: {
    systemPrompt: number
    skills: number
    mcp: number
  }
}

export const MOCK_TOKEN_USAGE: TokenUsageStats = {
  usedTokens: 18.2,
  maxTokens: 128,
  percentage: 14.2,
  breakdown: {
    systemPrompt: 4.8,
    skills: 8.6,
    mcp: 4.8
  }
}
