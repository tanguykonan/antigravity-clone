export interface ConversationItem {
  id: string
  title: string
  time?: string
  lastMessage?: string
}

export interface ProjectItem {
  id: string
  name: string
  conversations?: ConversationItem[]
  lastMessage?: string
  lastTime?: string
}

export type Project = ProjectItem

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'project1',
    name: 'project1',
    conversations: [
      {
        id: 'c-1-1',
        title: "Architecture overview and system setup",
        time: 'now',
        lastMessage: 'Set up initial desktop client layout and routing'
      },
      {
        id: 'c-1-2',
        title: "Refactoring authentication state flow",
        time: '3h',
        lastMessage: 'Updated OAuth session persistence'
      }
    ]
  },
  {
    id: 'project2',
    name: 'project2',
    conversations: [
      {
        id: 'c-2-1',
        title: "Fixing build script and dependency conflicts",
        time: '19h',
        lastMessage: 'Resolved esbuild transform issue'
      },
      {
        id: 'c-2-2',
        title: "Optimizing terminal emulator throughput",
        time: '2d',
        lastMessage: 'Enhanced chunk buffering for fast logs'
      }
    ]
  },
  {
    id: 'project3',
    name: 'project3',
    conversations: [
      {
        id: 'c-3-1',
        title: "Unit tests for CLI runner and sandbox permissions",
        time: '1d',
        lastMessage: 'Added 14 test cases covering isolation flags'
      },
      {
        id: 'c-3-2',
        title: "Mock sandbox permissions handler",
        time: '4d',
        lastMessage: 'Implemented local policy verification'
      }
    ]
  },
  {
    id: 'project4',
    name: 'project4',
    conversations: [
      {
        id: 'c-4-1',
        title: "Landing page hero section design review",
        time: '2d',
        lastMessage: 'Adjusted typography and responsive padding'
      },
      {
        id: 'c-4-2',
        title: "Dark mode theme palette adjustments",
        time: '5d',
        lastMessage: 'Fine-tuned neutral grey contrast levels'
      }
    ]
  },
  {
    id: 'project5',
    name: 'project5',
    conversations: [
      {
        id: 'c-5-1',
        title: "Interactive widgets and canvas animations",
        time: '3d',
        lastMessage: 'Added 60fps graph rendering with WebGL'
      },
      {
        id: 'c-5-2',
        title: "Case study layout and media optimization",
        time: '6d',
        lastMessage: 'Compressed sample assets and SVG icons'
      }
    ]
  },
  {
    id: 'project6',
    name: 'project6',
    conversations: [
      {
        id: 'c-6-1',
        title: "REST API integration for dataset sync",
        time: '4d',
        lastMessage: 'Added retry mechanism with exponential backoff'
      },
      {
        id: 'c-6-2',
        title: "Database migration scripts review",
        time: '1w',
        lastMessage: 'Validated schema change compatibility'
      }
    ]
  },
  {
    id: 'project7',
    name: 'project7',
    conversations: [
      {
        id: 'c-7-1',
        title: "Medical diagnosis assistant prompts benchmark",
        time: '5d',
        lastMessage: 'Refined prompt chain for clinical verification'
      },
      {
        id: 'c-7-2',
        title: "PubChem API query client setup",
        time: '1w',
        lastMessage: 'Configured molecular lookup endpoints'
      }
    ]
  },
  {
    id: 'project8',
    name: 'project8',
    conversations: [
      {
        id: 'c-8-1',
        title: "Resume parsing NLP pipeline improvements",
        time: '6d',
        lastMessage: 'Improved section extraction accuracy to 94%'
      },
      {
        id: 'c-8-2',
        title: "Keyword extraction score calibration",
        time: '1w',
        lastMessage: 'Updated TF-IDF weighting dictionary'
      }
    ]
  },
  {
    id: 'project9',
    name: 'project9',
    conversations: [
      {
        id: 'c-9-1',
        title: "ATS candidate scoring algorithm optimization",
        time: '1w',
        lastMessage: 'Implemented vector similarity ranking'
      },
      {
        id: 'c-9-2',
        title: "PDF export report template generator",
        time: '2w',
        lastMessage: 'Structured report layout with summary charts'
      }
    ]
  },
  {
    id: 'project10',
    name: 'project10',
    conversations: [
      {
        id: 'c-10-1',
        title: "Autonomous subagent tool orchestration workflow",
        time: '2w',
        lastMessage: 'Configured hierarchical agent delegation'
      },
      {
        id: 'c-10-2',
        title: "Background synchronization retry policy",
        time: '3w',
        lastMessage: 'Set max retry attempts and timeout alerts'
      }
    ]
  }
]
