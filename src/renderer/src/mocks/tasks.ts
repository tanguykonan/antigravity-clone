export interface ScheduledTask {
  id: string
  name: string
  projectId: string
  projectName: string
  frequency: string
  time: string
  prompt: string
  enabled?: boolean
  createdAt: number
}

export const DEFAULT_SCHEDULED_TASKS: ScheduledTask[] = [
  {
    id: 'task-1',
    name: 'Daily Code Review & Security Scan',
    projectId: 'project1',
    projectName: 'project1',
    frequency: 'Daily',
    time: '9:00 AM',
    prompt: 'Review git changes from the last 24h, verify dependency security audits, and prepare a summary report.',
    enabled: true,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'task-2',
    name: 'Weekly Dependency Update Check',
    projectId: 'project2',
    projectName: 'project2',
    frequency: 'Weekly',
    time: '8:00 AM',
    prompt: 'Check for outdated packages and create migration notes for breaking changes.',
    enabled: false,
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: 'task-3',
    name: 'Automated Benchmark & Performance Report',
    projectId: 'project3',
    projectName: 'project3',
    frequency: 'Weekly',
    time: '6:00 PM',
    prompt: 'Execute sandbox benchmark suite and record memory allocation profiles.',
    enabled: true,
    createdAt: Date.now() - 86400000 * 10
  }
]
