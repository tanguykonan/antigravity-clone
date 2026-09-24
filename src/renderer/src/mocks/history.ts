export interface HistoryEntry {
  id: string
  title: string
  projectName: string
  time: string
}

export const DEFAULT_HISTORY: HistoryEntry[] = [
  {
    id: 'h-1',
    title: "Architecture overview and system setup",
    projectName: 'project1',
    time: 'now'
  },
  {
    id: 'h-2',
    title: "Refactoring authentication state flow",
    projectName: 'project1',
    time: '3h'
  },
  {
    id: 'h-3',
    title: "Fixing build script and dependency conflicts",
    projectName: 'project2',
    time: '19h'
  },
  {
    id: 'h-4',
    title: "Unit tests for CLI runner and sandbox permissions",
    projectName: 'project3',
    time: '1d'
  },
  {
    id: 'h-5',
    title: "Landing page hero section design review",
    projectName: 'project4',
    time: '2d'
  },
  {
    id: 'h-6',
    title: "Interactive widgets and canvas animations",
    projectName: 'project5',
    time: '3d'
  },
  {
    id: 'h-7',
    title: "REST API integration for dataset sync",
    projectName: 'project6',
    time: '4d'
  },
  {
    id: 'h-8',
    title: "Medical diagnosis assistant prompts benchmark",
    projectName: 'project7',
    time: '5d'
  },
  {
    id: 'h-9',
    title: "Resume parsing NLP pipeline improvements",
    projectName: 'project8',
    time: '6d'
  },
  {
    id: 'h-10',
    title: "ATS candidate scoring algorithm optimization",
    projectName: 'project9',
    time: '1w'
  },
  {
    id: 'h-11',
    title: "Autonomous subagent tool orchestration workflow",
    projectName: 'project10',
    time: '2w'
  }
]
