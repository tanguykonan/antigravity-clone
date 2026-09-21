import React, { useState, useEffect, useRef } from 'react'
import {
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Command,
  MessageSquare,
  Download,
  Plus,
  Settings
} from 'lucide-react'

export interface CommandItemDef {
  id: string
  label: string
  shortcut?: string
  icon?: React.ReactNode
  action: () => void
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onToggleSidebar?: () => void
  onNewConversation?: () => void
  onOpenSettings?: () => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onToggleSidebar,
  onNewConversation,
  onOpenSettings
}) => {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Liste des commandes inspirée d'Antigravity / VS Code
  const commands: CommandItemDef[] = [
    {
      id: 'open-settings',
      label: 'Preferences: Open Settings',
      shortcut: 'Ctrl+,',
      icon: <Settings size={15} className="text-[#8a8c87]" />,
      action: () => {
        onClose()
        onOpenSettings?.()
      }
    },
    {
      id: 'collapse-folders',
      label: 'Collapse All Folders',
      icon: <ChevronsDownUp size={15} className="text-[#8a8c87]" />,
      action: () => onClose()
    },
    {
      id: 'expand-folders',
      label: 'Expand All Folders',
      icon: <ChevronsUpDown size={15} className="text-[#8a8c87]" />,
      action: () => onClose()
    },
    {
      id: 'shortcuts',
      label: 'Open Keyboard Shortcuts',
      shortcut: 'Ctrl+?',
      icon: <Command size={15} className="text-[#8a8c87]" />,
      action: () => onClose()
    },
    {
      id: 'feedback',
      label: 'Provide Feedback',
      icon: <MessageSquare size={15} className="text-[#8a8c87]" />,
      action: () => onClose()
    },
    {
      id: 'next-aux-tab',
      label: 'Next Aux Pane Tab',
      shortcut: 'Ctrl+Shift+.',
      action: () => onClose()
    },
    {
      id: 'prev-aux-tab',
      label: 'Previous Aux Pane Tab',
      shortcut: 'Ctrl+Shift+,',
      action: () => onClose()
    },
    {
      id: 'diagnostics',
      label: 'Download Diagnostics',
      icon: <Download size={15} className="text-[#8a8c87]" />,
      action: () => onClose()
    },
    {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      shortcut: 'Ctrl+B',
      icon: (
        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="#8a8c87" strokeWidth="1.3">
          <rect x="0.65" y="0.65" width="13.7" height="11.7" rx="1.5" />
          <line x1="4.5" y1="0.65" x2="4.5" y2="12.35" />
        </svg>
      ),
      action: () => {
        onToggleSidebar?.()
        onClose()
      }
    },
    {
      id: 'toggle-aux-pane',
      label: 'Toggle Auxiliary Pane',
      shortcut: 'Ctrl+Shift+B',
      icon: (
        <svg width="15" height="13" viewBox="0 0 15 13" fill="none" stroke="#8a8c87" strokeWidth="1.3">
          <rect x="0.65" y="0.65" width="13.7" height="11.7" rx="1.5" />
          <line x1="10.5" y1="0.65" x2="10.5" y2="12.35" />
        </svg>
      ),
      action: () => onClose()
    },
    {
      id: 'new-terminal',
      label: 'New Terminal Tab',
      shortcut: 'Ctrl+T',
      icon: <Plus size={15} className="text-[#8a8c87]" />,
      action: () => onClose()
    },
    {
      id: 'new-conversation',
      label: 'New Conversation',
      shortcut: 'Ctrl+N',
      icon: <Plus size={15} className="text-[#8a8c87]" />,
      action: () => {
        onNewConversation?.()
        onClose()
      }
    }
  ]

  // Filtrer les commandes selon la recherche
  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    (cmd.shortcut && cmd.shortcut.toLowerCase().includes(search.toLowerCase()))
  )

  // Focus automatique à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Navigation au clavier (Flèches, Entrée, Echap)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filtered, selectedIndex, onClose])

  // Scroll automatique de l'élément sélectionné
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex justify-center items-start pt-[12vh] select-none"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(8px)' }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Fenêtre bulle Command Palette — style macOS Frosted Glass */}
      <div
        className="w-full max-w-[620px] rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-150 animate-in fade-in zoom-in-95"
        style={{
          backgroundColor: 'rgba(32, 34, 30, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 28px 64px -12px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.14)',
          backdropFilter: 'blur(24px)'
        }}
      >
        {/* Barre de recherche avec pill "Commands ⌵" */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          {/* Pill Commands ⌵ */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#dcded9] transition-colors cursor-pointer select-none"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <span>Commands</span>
          </button>

          {/* Input de recherche */}
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search for commands..."
            className="flex-1 bg-transparent text-sm text-white placeholder-[#7a7c78] outline-none"
            style={{ fontSize: '13.5px', caretColor: '#007aff' }}
          />
        </div>

        {/* Liste des commandes filtrées */}
        <div
          ref={listRef}
          className="sidebar-scrollbar max-h-[380px] overflow-y-auto p-1.5 space-y-0.5"
        >
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#7a7c78]">
              No matching commands found.
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className="w-full flex items-center justify-between px-3 rounded-lg text-left transition-all duration-100 cursor-pointer select-none group"
                  style={{
                    height: 36,
                    backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    border: isSelected ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid transparent',
                    boxShadow: isSelected ? 'inset 0 1px 0 rgba(255, 255, 255, 0.08)' : 'none',
                    color: isSelected ? '#ffffff' : '#b0b2ac'
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                    {/* Icône de commande */}
                    <div className="w-5 flex items-center justify-center flex-shrink-0">
                      {cmd.icon ?? <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                    </div>
                    <span
                      className="truncate"
                      style={{ fontSize: '13px', fontWeight: isSelected ? 450 : 400 }}
                    >
                      {cmd.label}
                    </span>
                  </div>

                  {/* Raccourci clavier discret */}
                  {cmd.shortcut && (
                    <span
                      className="font-mono text-[11.5px] transition-colors ml-3 flex-shrink-0"
                      style={{
                        color: isSelected ? '#a8aaa4' : '#6f716c'
                      }}
                    >
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
