import React, { useState, useRef, useEffect } from 'react'
import { electronService } from '../../services/electronService'

interface MenuItemDef {
  label: string
  shortcut?: string
  separator?: boolean
  disabled?: boolean
}

interface MenuItem {
  label: string
  items: MenuItemDef[]
}

const MENU: MenuItem[] = [
  {
    label: 'Antigravity',
    items: [
      { label: 'About Antigravity' },
      { label: '', separator: true },
      { label: 'Preferences...', shortcut: 'Ctrl+,' },
      { label: '', separator: true },
      { label: 'Quit Antigravity', shortcut: 'Ctrl+Q' }
    ]
  },
  {
    label: 'File',
    items: [
      { label: 'New Conversation', shortcut: 'Ctrl+N' },
      { label: 'New Project', shortcut: 'Ctrl+Shift+N' },
      { label: '', separator: true },
      { label: 'Open Folder...', shortcut: 'Ctrl+O' },
      { label: '', separator: true },
      { label: 'Close Window', shortcut: 'Ctrl+W' }
    ]
  },
  {
    label: 'View',
    items: [
      { label: 'Toggle Sidebar', shortcut: 'Ctrl+B' },
      { label: '', separator: true },
      { label: 'Zoom In', shortcut: 'Ctrl++' },
      { label: 'Zoom Out', shortcut: 'Ctrl+-' },
      { label: 'Reset Zoom', shortcut: 'Ctrl+0' },
      { label: '', separator: true },
      { label: 'Toggle Full Screen', shortcut: 'F11' }
    ]
  },
  {
    label: 'Window',
    items: [
      { label: 'Minimize', shortcut: 'Ctrl+M' },
      { label: 'Maximize' },
      { label: '', separator: true },
      { label: 'Close', shortcut: 'Alt+F4' }
    ]
  }
]

export const TitleBar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    if (openMenu) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [openMenu])

  const handleMenuClick = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label))
  }

  const handleMenuEnter = (label: string) => {
    // Si un menu est déjà ouvert, changer au survol
    if (openMenu) setOpenMenu(label)
  }

  const handleItemClick = (item: MenuItemDef) => {
    if (item.separator || item.disabled) return
    // Actions spéciales
    if (item.label === 'Quit Antigravity') electronService.close()
    if (item.label === 'Minimize') electronService.minimize()
    if (item.label === 'Maximize') electronService.maximize()
    if (item.label === 'Close') electronService.close()
    setOpenMenu(null)
  }

  return (
    <div
      className="titlebar-drag h-9 flex items-center bg-bg-base border-b border-bg-border select-none flex-shrink-0"
    >
      {/* Menu bar — zone non-draggable */}
      <div
        ref={menuRef}
        className="titlebar-no-drag flex items-center h-full relative z-50"
      >
        {MENU.map((menu) => (
          <div key={menu.label} className="relative h-full flex items-center">
            <button
              onMouseDown={() => handleMenuClick(menu.label)}
              onMouseEnter={() => handleMenuEnter(menu.label)}
              className={`px-3 h-full text-sm transition-colors ${
                openMenu === menu.label
                  ? 'bg-bg-hover text-text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              {menu.label}
            </button>

            {/* Dropdown */}
            {openMenu === menu.label && menu.items && (
              <div className="absolute top-full left-0 mt-0 bg-bg-elevated border border-bg-border rounded-md shadow-2xl py-1 min-w-[200px] z-50">
                {menu.items.map((item, i) =>
                  item.separator ? (
                    <div key={i} className="h-px bg-bg-border my-1 mx-1" />
                  ) : (
                    <button
                      key={i}
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors disabled:opacity-40 disabled:cursor-default"
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="text-text-muted text-xs ml-8">{item.shortcut}</span>
                      )}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Zone draggable centrale */}
      <div className="flex-1 h-full" />

      {/* Bouton Github Repository compact */}
      <div className="titlebar-no-drag flex items-center pr-2.5">
        <button
          onClick={() => window.open('https://github.com', '_blank')}
          className="flex items-center gap-1.5 px-2 rounded-md transition-colors cursor-pointer"
          style={{
            height: '22px',
            backgroundColor: '#242622',
            border: '1px solid #333630',
            color: '#dcded9'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2c2e29')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#242622')}
          title="Ouvrir le dépôt GitHub"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#e2e4df">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.01em' }}>Github Repository</span>
        </button>
      </div>

      {/* Window controls — style macOS rouge / jaune / vert (taille agrandie 14px) */}
      <div className="titlebar-no-drag flex items-center h-full pr-4 pl-1">
        {electronService.isElectron() && (
          <div className="flex items-center gap-2.5 group">
            {/* Rouge - Fermer */}
            <button
              onClick={() => electronService.close()}
              className="w-[14px] h-[14px] rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer hover:brightness-110 active:brightness-90"
              style={{ backgroundColor: '#ff5f56', border: '1px solid rgba(0,0,0,0.2)' }}
              title="Fermer"
            >
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <line x1="1" y1="1" x2="6" y2="6" />
                <line x1="6" y1="1" x2="1" y2="6" />
              </svg>
            </button>

            {/* Jaune - Réduire */}
            <button
              onClick={() => electronService.minimize()}
              className="w-[14px] h-[14px] rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer hover:brightness-110 active:brightness-90"
              style={{ backgroundColor: '#ffbd2e', border: '1px solid rgba(0,0,0,0.2)' }}
              title="Réduire"
            >
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <line x1="1" y1="3.5" x2="6" y2="3.5" />
              </svg>
            </button>

            {/* Vert - Agrandir */}
            <button
              onClick={() => electronService.maximize()}
              className="w-[14px] h-[14px] rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer hover:brightness-110 active:brightness-90"
              style={{ backgroundColor: '#27c93f', border: '1px solid rgba(0,0,0,0.2)' }}
              title="Agrandir"
            >
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <polyline points="4.5,1 6,1 6,2.5" />
                <polyline points="2.5,6 1,6 1,4.5" />
                <line x1="1" y1="6" x2="6" y2="1" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
