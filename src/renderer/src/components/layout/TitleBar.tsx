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
    label: 'Progravity',
    items: [
      { label: 'About Progravity' },
      { label: '', separator: true },
      { label: 'Check for Updates...' },
      { label: '', separator: true },
      { label: 'Quit Progravity', shortcut: 'Ctrl+Q' }
    ]
  },
  {
    label: 'File',
    items: [
      { label: 'New Conversation', shortcut: 'Ctrl+N' },
      { label: 'New Project', shortcut: 'Ctrl+Shift+N' },
      { label: '', separator: true },
      { label: 'Command Palette', shortcut: 'Ctrl+Shift+P' }
    ]
  },
  {
    label: 'View',
    items: [
      { label: 'Zoom In', shortcut: 'Ctrl++' },
      { label: 'Zoom Out', shortcut: 'Ctrl+-' },
      { label: 'Reset Zoom', shortcut: 'Ctrl+0' }
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

interface TitleBarProps {
  onOpenCommandPalette?: () => void
}

export const TitleBar: React.FC<TitleBarProps> = ({ onOpenCommandPalette }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
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
    // If a menu is already open, switch on hover
    if (openMenu) setOpenMenu(label)
  }

  const handleItemClick = (item: MenuItemDef) => {
    if (item.separator || item.disabled) return
    // Special actions
    if (item.label === 'Command Palette') onOpenCommandPalette?.()
    if (item.label === 'Quit Progravity') electronService.close()
    if (item.label === 'Minimize') electronService.minimize()
    if (item.label === 'Maximize') electronService.maximize()
    if (item.label === 'Close') electronService.close()
    setOpenMenu(null)
  }

  return (
    <div
      className="titlebar-drag h-9 flex items-center bg-bg-sidebar select-none flex-shrink-0"
    >
      {/* Menu bar with native app style */}
      <div
        ref={menuRef}
        className="titlebar-no-drag flex items-center h-full pl-2.5 gap-0.5 relative z-50"
      >
        {MENU.map((menu) => {
          const isAppMenu = menu.label === 'Progravity'
          const isOpen = openMenu === menu.label
          return (
            <div key={menu.label} className="relative flex items-center">
              <button
                onMouseDown={() => handleMenuClick(menu.label)}
                onMouseEnter={(e) => {
                  handleMenuEnter(menu.label)
                  if (!isOpen) {
                    e.currentTarget.style.backgroundColor = '#292b26'
                    e.currentTarget.style.color = '#ffffff'
                  }
                }}
                className="px-2.5 py-1 rounded-md transition-colors cursor-pointer select-none"
                style={{
                  fontSize: '13px',
                  fontWeight: isAppMenu ? 600 : 400,
                  letterSpacing: '-0.01em',
                  color: isOpen ? '#ffffff' : isAppMenu ? '#f0f0ee' : '#c8cac5',
                  backgroundColor: isOpen ? '#383a35' : 'transparent'
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = isAppMenu ? '#f0f0ee' : '#c8cac5'
                  }
                }}
              >
                {menu.label}
              </button>

              {/* Dropdown menu */}
              {isOpen && menu.items && (
                <div
                  className="absolute top-[calc(100%+3px)] left-0 py-1.5 min-w-[210px] rounded-lg shadow-[0_12px_32px_rgba(0,0,0,0.55)] backdrop-blur-xl z-50"
                  style={{
                    backgroundColor: 'rgba(32, 34, 30, 0.96)',
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                >
                  {menu.items.map((item, i) =>
                    item.separator ? (
                      <div
                        key={i}
                        className="h-[1px] my-1 mx-2"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                      />
                    ) : (
                      <button
                        key={i}
                        onClick={() => handleItemClick(item)}
                        disabled={item.disabled}
                        className="w-[calc(100%-8px)] mx-1 flex items-center justify-between px-3 py-1 text-left rounded-[5px] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default group"
                        style={{
                          fontSize: '13px',
                          color: '#e4e6e1'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#007aff'
                          e.currentTarget.style.color = '#ffffff'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = '#e4e6e1'
                        }}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.shortcut && (
                          <span
                            className="text-xs ml-6 opacity-60 font-mono tracking-tight group-hover:opacity-100"
                          >
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Central draggable area */}
      <div className="flex-1 h-full" />

      {/* GitHub Repository button */}
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
          data-tooltip="Open GitHub Repository"
          data-tooltip-side="bottom"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#e2e4df">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.01em' }}>Github</span>
        </button>
      </div>

      {/* Window controls (Close, Minimize, Maximize) */}
      <div className="titlebar-no-drag flex items-center h-full pr-4 pl-1">
        {electronService.isElectron() && (
          <div className="flex items-center gap-2.5 group">
            {/* Red - Close */}
            <button
              onClick={() => electronService.close()}
              className="w-[14px] h-[14px] rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer hover:brightness-110 active:brightness-90"
              style={{ backgroundColor: '#ff5f56', border: '1px solid rgba(0,0,0,0.2)' }}
              data-tooltip="Close"
              data-tooltip-side="bottom"
            >
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <line x1="1" y1="1" x2="6" y2="6" />
                <line x1="6" y1="1" x2="1" y2="6" />
              </svg>
            </button>

            {/* Yellow - Minimize */}
            <button
              onClick={() => electronService.minimize()}
              className="w-[14px] h-[14px] rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer hover:brightness-110 active:brightness-90"
              style={{ backgroundColor: '#ffbd2e', border: '1px solid rgba(0,0,0,0.2)' }}
              data-tooltip="Minimize"
              data-tooltip-side="bottom"
            >
              <svg width="7" height="7" viewBox="0 0 7 7" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <line x1="1" y1="3.5" x2="6" y2="3.5" />
              </svg>
            </button>

            {/* Green - Maximize */}
            <button
              onClick={() => electronService.maximize()}
              className="w-[14px] h-[14px] rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer hover:brightness-110 active:brightness-90"
              style={{ backgroundColor: '#27c93f', border: '1px solid rgba(0,0,0,0.2)' }}
              data-tooltip="Maximize"
              data-tooltip-side="bottom"
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
