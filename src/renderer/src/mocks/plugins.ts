export interface PluginItem {
  id: string
  name: string
  isGlobal: boolean
  description: string
  enabled?: boolean
}

export const DEFAULT_PLUGINS: PluginItem[] = [
  {
    id: 'android-cli-plugin',
    name: 'android-cli-plugin',
    isGlobal: true,
    description: 'Core tools and knowledge required to develop for Android',
    enabled: true
  },
  {
    id: 'chrome-devtools-plugin',
    name: 'chrome-devtools-plugin',
    isGlobal: true,
    description:
      'Reliable automation, in-depth debugging, and performance analysis in Chrome using Chrome DevTools and Puppeteer',
    enabled: true
  },
  {
    id: 'firebase',
    name: 'firebase',
    isGlobal: true,
    description: 'Tools for building and deploying applications to Google Firebase',
    enabled: true
  },
  {
    id: 'google-antigravity-sdk',
    name: 'google-antigravity-sdk',
    isGlobal: true,
    description: 'Using the Google Antigravity Python SDK to build AI agents',
    enabled: true
  },
  {
    id: 'modern-web-guidance-plugin',
    name: 'modern-web-guidance-plugin',
    isGlobal: true,
    description: 'Curated collection of agent skills for modern web development.',
    enabled: true
  },
  {
    id: 'science',
    name: 'science',
    isGlobal: true,
    description: 'Curated collection of agent skills for science tasks.',
    enabled: true
  }
]
