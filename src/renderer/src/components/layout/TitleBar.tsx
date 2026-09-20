import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { electronService } from '../../services/electronService'

interface TitleBarProps {
  activeProject: string | null
}

export const TitleBar: React.FC<TitleBarProps> = ({ activeProject }) => {
  return (
    <div
      className="titlebar-drag h-10 flex items-center bg-bg-base border-b border-bg-border select-none flex-shrink-0"
      style={{ minHeight: 40 }}
    >
      {/* Logo Antigravity */}
      <div className="titlebar-no-drag flex items-center pl-3 pr-2 h-full">
        <div className="w-6 h-6 rounded flex items-center justify-center">
          {/* Logo "A" style Antigravity */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L16 14H2L9 2Z" stroke="#7c6aed" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
            <path d="M6 10h6" stroke="#7c6aed" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Nav arrows */}
      <div className="titlebar-no-drag flex items-center gap-0.5 mr-2">
        <button className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">
          <ChevronLeft size={14} />
        </button>
        <button className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Breadcrumb / titre */}
      <div className="flex items-center gap-1.5 text-text-secondary text-sm flex-1">
        {activeProject && (
          <span className="text-text-primary text-sm font-normal">{activeProject}</span>
        )}
      </div>

      {/* Actions droite */}
      <div className="titlebar-no-drag flex items-center pr-0">
        {/* Window controls (Windows style) */}
        {electronService.isElectron() && (
          <div className="flex items-center">
            <button
              onClick={() => electronService.minimize()}
              className="w-11 h-10 flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors"
            >
              <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
                <rect width="10" height="1"/>
              </svg>
            </button>
            <button
              onClick={() => electronService.maximize()}
              className="w-11 h-10 flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="0.5" y="0.5" width="9" height="9"/>
              </svg>
            </button>
            <button
              onClick={() => electronService.close()}
              className="w-11 h-10 flex items-center justify-center text-text-muted hover:bg-red-600 hover:text-white transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="0" y1="0" x2="10" y2="10"/>
                <line x1="10" y1="0" x2="0" y2="10"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
