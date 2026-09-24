import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  ChevronDown,
  ChevronRight,
  Info,
  Check,
  Paperclip,
  Monitor,
  Sun,
  Moon,
  RotateCcw,
  RotateCw,
  Copy,
  Pencil,
  Trash2,
  Folder
} from 'lucide-react'
import { llmManager } from '../../services/llm/LLMManager'
import { DEFAULT_SKILLS, DEFAULT_PLUGINS } from '../../mocks'

export type SettingsTab =
  | 'General'
  | 'Application'
  | 'Appearance'
  | 'Models'
  | 'Customizations'
  | 'Shortcuts'
  | 'Provide Feedback'
  | 'Account'
  | string

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: string
  projects?: { id: string; name: string; conversations?: any[] }[]
  onSignOut?: () => void
  onDeleteProject?: (projectId: string) => void
}

// Switch Toggle Component
const MacOSToggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({
  checked,
  onChange
}) => {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className="relative inline-flex items-center flex-shrink-0 cursor-pointer transition-all duration-200 ease-out focus:outline-none group select-none"
      style={{
        width: 38,
        height: 22,
        borderRadius: 11,
        backgroundColor: checked ? '#e91e63' : '#30322d',
        boxShadow: checked
          ? '0 0 10px rgba(233, 30, 99, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2)'
          : 'inset 0 1px 2px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.03)'
      }}
    >
      <span
        className="pointer-events-none absolute top-[2px] left-0 rounded-full bg-white"
        style={{
          width: isPressed ? 21 : 18,
          height: 18,
          transform: checked
            ? isPressed
              ? 'translateX(15px)'
              : 'translateX(18px)'
            : 'translateX(2px)',
          transition: 'transform 240ms cubic-bezier(0.2, 0.9, 0.3, 1.2), width 150ms ease-out',
          boxShadow:
            '0 2px 4px rgba(0, 0, 0, 0.35), 0 1px 2px rgba(0, 0, 0, 0.25), inset 0 0 0 0.5px rgba(0, 0, 0, 0.06)'
        }}
      />
    </button>
  )
}

// Custom Select Dropdown Component
const CustomSelect: React.FC<{
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  className?: string
}> = ({ value, options, onChange, className = 'w-full' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside)
    }
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isOpen])

  const selectedOption = options.find((opt) => opt.value === value) || options[0]

  return (
    <div ref={dropdownRef} className={`relative ${className} select-none`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#1a1c18] border border-[#2a2c28] hover:border-white/15 text-[13px] text-white transition-all cursor-pointer focus:outline-none"
      >
        <span className="font-normal text-white truncate">{selectedOption?.label}</span>
        <ChevronDown
          size={14}
          className={`text-[#7a7c78] transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full mt-1.5 z-[11000] rounded-xl overflow-hidden shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-100"
          style={{
            backgroundColor: '#1f211d',
            border: '1px solid #333530',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className="w-full text-left px-3.5 py-2 text-[13px] flex items-center justify-between transition-colors cursor-pointer"
                style={{
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: isSelected ? '#ffffff' : '#dcded9'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'
                    e.currentTarget.style.color = '#ffffff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#dcded9'
                  }
                }}
              >
                <span className={isSelected ? 'font-medium' : 'font-normal'}>{opt.label}</span>
                {isSelected && <Check size={13} className="text-[#007aff]" strokeWidth={2.5} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Color Picker Row Component
const ColorPickerRow: React.FC<{
  label: string
  color: string
  onChange: (color: string) => void
}> = ({ label, color, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const hexValue = color.replace(/^#/, '').toUpperCase()

  return (
    <div className="p-3.5 px-4 flex items-center justify-between">
      <span className="font-normal text-white text-[13.5px]">{label}</span>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181a16] border border-[#2e302b] hover:border-white/20 transition-colors cursor-pointer select-none"
      >
        <input
          ref={inputRef}
          type="color"
          value={color.startsWith('#') ? color : `#${color}`}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="sr-only"
        />
        <div
          className="w-4 h-4 rounded-[4px] border border-black/30 flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-[12.5px] font-mono text-[#dcded9]">
          # {hexValue}
        </span>
      </div>
    </div>
  )
}

// Circular Quota Gauge Component
const CircularProgress: React.FC<{
  percentage: number
  size?: number
  strokeWidth?: number
}> = ({ percentage, size = 26, strokeWidth = 3 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90 flex-shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(74, 150, 80, 0.22)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#48a75e"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="transparent"
      />
    </svg>
  )
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'General',
  projects = [
    { id: 'project1', name: 'project1' },
    { id: 'project2', name: 'project2' },
    { id: 'project3', name: 'project3' }
  ],
  onSignOut,
  onDeleteProject
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  // Options state
  const [queuedMessagesMode, setQueuedMessagesMode] = useState<'queue' | 'immediate'>('queue')
  const [securityPreset, setSecurityPreset] = useState('Default')
  const [artifactReviewPolicy, setArtifactReviewPolicy] = useState('Always Ask')
  const [browserJsExecutionPolicy, setBrowserJsExecutionPolicy] = useState('Request Review')
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [launchAtLogin, setLaunchAtLogin] = useState(false)

  // Project-specific settings state
  const [projectSecurityPresets, setProjectSecurityPresets] = useState<Record<string, string>>({})
  const [projectArtifactPolicies, setProjectArtifactPolicies] = useState<Record<string, string>>({})
  const [enabledPlugins, setEnabledPlugins] = useState<Record<string, boolean>>({
    'android-cli-plugin': true,
    'chrome-devtools-plugin': true,
    firebase: true,
    'google-antigravity-sdk': true,
    'modern-web-guidance-plugin': true,
    science: true
  })

  // Application tab state
  const [preventSleep, setPreventSleep] = useState(false)
  const [keepInMenuBar, setKeepInMenuBar] = useState(false)
  const [enableRemoteControl, setEnableRemoteControl] = useState(false)

  // Appearance tab state
  const [appearanceTheme, setAppearanceTheme] = useState<'system' | 'light' | 'dark'>('system')
  const [contrastMode, setContrastMode] = useState<'default' | 'strong'>('default')
  const [lightPreset, setLightPreset] = useState('Default Light')
  const [lightBg, setLightBg] = useState('#EEEEEE')
  const [lightFg, setLightFg] = useState('#101010')
  const [lightAccent, setLightAccent] = useState('#007ACC')
  const [darkPreset, setDarkPreset] = useState('Default Dark')
  const [darkBg, setDarkBg] = useState('#101010')
  const [darkFg, setDarkFg] = useState('#EEEEEE')
  const [darkAccent, setDarkAccent] = useState('#007ACC')

  // Models & Usage state
  const [enableCreditOverages, setEnableCreditOverages] = useState(false)

  const [feedbackCategory, setFeedbackCategory] = useState('Bug Report')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackSteps, setFeedbackSteps] = useState('')
  const [screenshotName, setScreenshotName] = useState<string | null>(null)
  const [attachServerLogs, setAttachServerLogs] = useState(true)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Account tab state
  const [enableTelemetry, setEnableTelemetry] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(true)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
      setFeedbackSent(false)
      setScreenshotName(null)
    }
  }, [isOpen, initialTab])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center select-none"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif'
      }}
      onClick={onClose}
    >
      {/* Main modal container */}
      <div
        className="relative flex w-[940px] max-w-[95vw] h-[640px] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-100"
        style={{
          backgroundColor: '#222420',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow:
            '0 32px 80px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.02), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left sidebar: Settings navigation */}
        <div
          className="w-[210px] flex-shrink-0 flex flex-col justify-between"
          style={{
            backgroundColor: '#1f211d',
            borderRight: '1px solid #282a26'
          }}
        >
          {/* Sections and tabs list */}
          <div className="flex-1 overflow-y-auto px-2.5 pt-4 pb-2 space-y-4 custom-scrollbar">
            {/* Main Settings Section */}
            <div className="space-y-0.5">
              <div className="px-2 pb-1 text-[11.5px] font-normal text-[#7a7c78]">
                Settings
              </div>
              {['General', 'Application', 'Appearance', 'Models', 'Customizations'].map(
                (item) => {
                  const isActive = activeTab === item
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setActiveTab(item)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer group"
                      style={{
                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                        color: isActive ? '#ffffff' : '#9e9e9a',
                        fontWeight: isActive ? 500 : 400,
                        fontSize: '13px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)'
                          e.currentTarget.style.color = '#dcded9'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = '#9e9e9a'
                        }
                      }}
                    >
                      <span className="truncate leading-normal">{item}</span>
                    </button>
                  )
                }
              )}
            </div>

            {/* Projects Section */}
            <div className="space-y-0.5">
              <div className="px-2 pb-1 text-[11.5px] font-normal text-[#7a7c78]">
                Projects
              </div>
              {projects.map((proj) => {
                const isActive = activeTab === `proj-${proj.id}`
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setActiveTab(`proj-${proj.id}`)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer group"
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      color: isActive ? '#ffffff' : '#9e9e9a',
                      fontWeight: isActive ? 500 : 400,
                      fontSize: '13px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)'
                        e.currentTarget.style.color = '#dcded9'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#9e9e9a'
                      }
                    }}
                  >
                    <span className="truncate leading-normal">{proj.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Subtle divider */}
            <div className="my-1 px-1">
              <div className="h-px bg-[#282a26]" />
            </div>

            {/* Shortcuts & Feedback Section */}
            <div className="space-y-0.5">
              {['Shortcuts', 'Provide Feedback'].map((item) => {
                const isActive = activeTab === item
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveTab(item)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer group"
                    style={{
                      backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                      color: isActive ? '#ffffff' : '#9e9e9a',
                      fontWeight: isActive ? 500 : 400,
                      fontSize: '13px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)'
                        e.currentTarget.style.color = '#dcded9'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#9e9e9a'
                      }
                    }}
                  >
                    <span className="truncate leading-normal">{item}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Zone Profil Utilisateur en bas à gauche ── */}
          <div
            className="p-2 flex-shrink-0 relative select-none"
            style={{
              borderTop: '1px solid #282a26',
              backgroundColor: 'rgba(31, 33, 29, 0.95)'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('Account')}
              className="w-full flex items-center gap-2.5 p-1.5 rounded-xl transition-all cursor-pointer group text-left"
              style={{
                backgroundColor: activeTab === 'Account' ? 'rgba(255, 255, 255, 0.08)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'Account') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.035)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'Account') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {/* Avatar circulaire utilisateur */}
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/10 bg-gradient-to-tr from-orange-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-[12px] font-semibold text-white">UT</span>
              </div>

              {/* Nom & Email */}
              <div className="truncate flex-1 min-w-0">
                <div
                  className="text-[12.5px] font-medium truncate leading-tight"
                  style={{ color: activeTab === 'Account' ? '#ffffff' : '#f0f2ed' }}
                >
                  Ulrich Tanguy
                </div>
                <div className="text-[11px] text-[#7a7c78] group-hover:text-[#9e9e9a] truncate leading-tight mt-0.5">
                  tanguydelone95@gmail.com
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ── Colonne de droite : Contenu fidèle & pleine largeur ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#222420]">
          {/* Header de l'onglet avec bouton de fermeture (sans séparateur) */}
          <div className="flex items-start justify-between px-8 pt-7 pb-4 flex-shrink-0">
            <div>
              <h2 className="text-[22px] font-semibold text-white tracking-tight leading-snug flex items-center gap-2.5">
                {activeTab === 'Account'
                  ? 'Account'
                  : activeTab === 'Models'
                  ? (
                      <>
                        <span>Models and Usage</span>
                        <button
                          type="button"
                          className="p-1 text-[#8e9089] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="Refresh model quotas"
                        >
                          <RotateCw size={15} strokeWidth={2} />
                        </button>
                      </>
                    )
                  : activeTab.startsWith('proj-')
                  ? (
                      <div className="flex items-center gap-2">
                        <span>
                          {projects.find((p) => `proj-${p.id}` === activeTab)?.name || 'Project'}
                        </span>
                        <button
                          type="button"
                          className="p-1 text-[#8e9089] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                          title="Rename project"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    )
                  : activeTab}
              </h2>
              {activeTab !== 'Provide Feedback' && (
                <p className="text-[12.5px] text-[#8e9089] mt-1">
                  {activeTab === 'Account' &&
                    'Manage your plan, credentials, and general preferences.'}
                  {activeTab === 'General' &&
                    'Configure agent execution, queued message delivery, and permissions.'}
                  {activeTab === 'Application' &&
                    'Manage Antigravity app settings.'}
                  {activeTab === 'Appearance' &&
                    "Configure the agent's visual theme and display preferences."}
                  {activeTab === 'Models' &&
                    'Manage your model quota and credits.'}
                  {activeTab === 'Customizations' && (
                    <>
                      Configure default behaviors, skills, and MCP servers.{' '}
                      <a
                        href="#learn-more"
                        onClick={(e) => e.preventDefault()}
                        className="text-[#007aff] hover:underline cursor-pointer"
                      >
                        Learn more
                      </a>
                      .
                    </>
                  )}
                  {activeTab === 'Shortcuts' &&
                    'Quick keyboard shortcuts and fast action triggers.'}
                  {activeTab.startsWith('proj-') &&
                    'Manage project folders, agent settings, and permissions.'}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-[#7a7c78] hover:text-white hover:bg-white/10 transition-colors cursor-pointer active:scale-95"
            >
              <X size={17} strokeWidth={1.8} />
            </button>
          </div>

          {/* Corps de défilement étendu */}
          <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6 custom-scrollbar text-[13px]">
            {/* ─────────── 0. ACCOUNT ─────────── */}
            {activeTab === 'Account' && (
              <div className="space-y-6 pt-1">
                {/* Section General de Account */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">General</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {/* Enable Telemetry */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="max-w-md">
                        <div className="font-medium text-white text-[13.5px]">Enable Telemetry</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5 leading-relaxed">
                          When toggled on, Progravity collects usage data to help Google enhance performance and features.
                        </div>
                      </div>

                      {/* Switch toggle macOS */}
                      <MacOSToggle
                        checked={enableTelemetry}
                        onChange={setEnableTelemetry}
                      />
                    </div>

                    {/* Marketing Emails */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="max-w-md">
                        <div className="font-medium text-white text-[13.5px]">Marketing Emails</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5 leading-relaxed">
                          Receive product updates, tips, and promotions from Google Progravity via email.
                        </div>
                      </div>

                      {/* Switch toggle macOS */}
                      <MacOSToggle
                        checked={marketingEmails}
                        onChange={setMarketingEmails}
                      />
                    </div>
                  </div>
                </div>

                {/* Section Account */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Account</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {/* Your Plan */}
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Your Plan: Google AI Pro</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          You can upgrade to a Google AI Ultra plan to receive higher rate limits.
                        </div>
                      </div>

                      {/* Bouton Upgrade rose vif/magenta */}
                      <button
                        type="button"
                        className="px-4 py-1.5 rounded-lg text-white font-medium text-[12.5px] transition-all cursor-pointer active:scale-95 shadow-md"
                        style={{
                          backgroundColor: '#e60067'
                        }}
                      >
                        Upgrade
                      </button>
                    </div>

                    {/* Email & Sign Out */}
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Email</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          tanguydelone95@gmail.com
                        </div>
                      </div>

                      {/* Bouton Sign Out */}
                      <button
                        type="button"
                        onClick={() => {
                          onSignOut?.()
                          onClose()
                        }}
                        className="px-4 py-1.5 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer active:scale-95"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Terms of service */}
                <div className="pt-4 text-[12px] text-[#7a7c78]">
                  By using this app, you agree to its{' '}
                  <a
                    href="#terms"
                    onClick={(e) => e.preventDefault()}
                    className="text-[#6495ed] hover:underline cursor-pointer"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            )}

            {/* ─────────── 1. GENERAL ─────────── */}
            {activeTab === 'General' && (
              <div className="space-y-6 pt-1 max-w-2xl">
                {/* 1. Execution */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Execution</h3>
                  <div
                    className="p-4 rounded-xl flex items-center justify-between"
                    style={{
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      backgroundColor: 'rgba(255, 255, 255, 0.015)'
                    }}
                  >
                    <div>
                      <div className="font-medium text-white text-[13.5px]">Queued Messages</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5">
                        Configure when follow-up messages are sent.
                      </div>
                      <div className="flex items-center gap-1 text-[11.5px] text-[#7a7c78] hover:text-[#a0a29c] transition-colors cursor-pointer mt-1">
                        <span>Keyboard shortcuts</span>
                        <Info size={12} />
                      </div>
                    </div>

                    {/* Segmented control Queue / Send Immediately */}
                    <div
                      className="flex p-0.5 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setQueuedMessagesMode('queue')}
                        className={`px-3 py-1 rounded-md text-[12.5px] transition-all cursor-pointer ${
                          queuedMessagesMode === 'queue'
                            ? 'bg-[#383a35] text-white font-medium shadow-sm'
                            : 'text-[#8e9089] hover:text-white'
                        }`}
                      >
                        Queue
                      </button>
                      <button
                        type="button"
                        onClick={() => setQueuedMessagesMode('immediate')}
                        className={`px-3 py-1 rounded-md text-[12.5px] transition-all cursor-pointer ${
                          queuedMessagesMode === 'immediate'
                            ? 'bg-[#383a35] text-white font-medium shadow-sm'
                            : 'text-[#8e9089] hover:text-white'
                        }`}
                      >
                        Send Immediately
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Global Permissions */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Global Permissions</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {/* Security Preset */}
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Security Preset</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          Controls the actions the agent can take.
                        </div>
                        <div className="flex items-center gap-1 text-[11.5px] text-[#7a7c78] hover:text-[#a0a29c] transition-colors cursor-pointer mt-1">
                          <span>Learn more about Default</span>
                          <Info size={12} />
                        </div>
                      </div>

                      <div className="w-40">
                        <CustomSelect
                          value={securityPreset}
                          options={[
                            { value: 'Default', label: 'Default' },
                            { value: 'Strict', label: 'Strict' },
                            { value: 'Permissive', label: 'Permissive' }
                          ]}
                          onChange={setSecurityPreset}
                        />
                      </div>
                    </div>

                    {/* Tool Permissions */}
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-[13.5px]">Tool Permissions</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[10.5px] font-mono bg-white/10 text-[#a0a29c]">
                            2
                          </span>
                        </div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          Modify permissions for file, terminal, and MCP tools.
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-4 py-1.5 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Agent Behavior */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Agent Behavior</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div>
                      <div className="font-medium text-white text-[13.5px]">Artifact Review Policy</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5">
                        Whether the agent asks you to review its documents.
                      </div>
                    </div>

                    <div className="w-52">
                      <CustomSelect
                        value={artifactReviewPolicy}
                        options={[
                          { value: 'Always Ask', label: 'Always Ask' },
                          { value: 'Ask on Modifications', label: 'Ask on Modifications' },
                          { value: 'Never Ask', label: 'Never Ask' }
                        ]}
                        onChange={setArtifactReviewPolicy}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Network Permissions */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Network Permissions</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div>
                      <div className="font-medium text-white text-[13.5px]">Network Access Rules</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5">
                        Configure allowed and denied URLs for reading.
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer"
                    >
                      Open
                    </button>
                  </div>
                </div>

                {/* 5. Terminal & Tooling Permissions */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Terminal &amp; Tooling Permissions</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div>
                      <div className="font-medium text-white text-[13.5px]">Commands Outside Sandbox</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5">
                        Configure allowed commands outside the sandbox.
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer"
                    >
                      Open
                    </button>
                  </div>
                </div>

                {/* 6. Browser */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-1">Browser</h3>
                  <p className="text-[12px] text-[#8e9089] mb-2.5 leading-relaxed">
                    Configure the browser subagent. It requires{' '}
                    <a
                      href="#chrome"
                      onClick={(e) => e.preventDefault()}
                      className="text-[#007aff] hover:underline cursor-pointer"
                    >
                      Google Chrome
                    </a>{' '}
                    to be installed. The browser subagent can be invoked by typing /browser in the conversation input box.
                  </p>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {/* Browser Javascript Execution Policy */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="max-w-md pr-4">
                        <div className="font-medium text-white text-[13.5px]">Browser Javascript Execution Policy</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5 leading-relaxed">
                          Controls whether the agent can run custom JavaScript to automate complex browser actions.
                        </div>
                      </div>

                      <div className="w-48 flex-shrink-0">
                        <CustomSelect
                          value={browserJsExecutionPolicy}
                          options={[
                            { value: 'Request Review', label: 'Request Review' },
                            { value: 'Always Allow', label: 'Always Allow' },
                            { value: 'Never Allow', label: 'Never Allow' }
                          ]}
                          onChange={setBrowserJsExecutionPolicy}
                        />
                      </div>
                    </div>

                    {/* Browser Actuation Rules */}
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Browser Actuation Rules</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          Configure allowed and denied URLs for browser actuation.
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-4 py-1.5 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── 2. APPLICATION ─────────── */}
            {activeTab === 'Application' && (
              <div className="space-y-6 pt-1 max-w-2xl">
                {/* 1. General */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">General</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {/* Prevent Sleep */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="max-w-md">
                        <div className="font-medium text-white text-[13.5px]">Prevent Sleep</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5 leading-relaxed">
                          Prevent the computer from sleeping while the app is running.
                        </div>
                      </div>
                      <MacOSToggle checked={preventSleep} onChange={setPreventSleep} />
                    </div>

                    {/* Keep In Menu Bar */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="max-w-md">
                        <div className="font-medium text-white text-[13.5px]">Keep In Menu Bar</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5 leading-relaxed">
                          Keep the app accessible from the menu bar and running in the background when all windows are closed.
                        </div>
                      </div>
                      <MacOSToggle checked={keepInMenuBar} onChange={setKeepInMenuBar} />
                    </div>
                  </div>
                </div>

                {/* 2. Remote Control */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Remote Control</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="max-w-md">
                      <div className="font-medium text-white text-[13.5px]">Enable Remote Control</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5 leading-relaxed">
                        Work with local agents from another device.
                      </div>
                    </div>
                    <MacOSToggle checked={enableRemoteControl} onChange={setEnableRemoteControl} />
                  </div>
                </div>

                {/* 3. Notifications */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Notifications</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="max-w-md">
                      <div className="font-medium text-white text-[13.5px]">Notification Settings</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5 leading-relaxed">
                        To modify notification settings, open your operating system's system preferences.
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer flex-shrink-0"
                    >
                      Open System Preferences
                    </button>
                  </div>
                </div>

                {/* 4. Version */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Version</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="font-medium text-white text-[13.5px]">App version</div>
                    <div className="text-[13px] text-[#8e9089] font-mono select-all">2.15.1</div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── 3. APPEARANCE ─────────── */}
            {activeTab === 'Appearance' && (
              <div className="space-y-6 pt-1 max-w-2xl">
                {/* Section Appearance (Theme & Contrast) */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Appearance</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {/* Theme selector */}
                    <div className="p-3.5 px-4 flex items-center justify-between">
                      <span className="font-medium text-white text-[13.5px]">Theme</span>
                      <div
                        className="flex p-0.5 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.35)',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setAppearanceTheme('system')}
                          className={`p-1.5 px-2.5 rounded-md transition-all cursor-pointer ${
                            appearanceTheme === 'system'
                              ? 'bg-[#383a35] text-white shadow-sm'
                              : 'text-[#8e9089] hover:text-white'
                          }`}
                          title="System theme"
                        >
                          <Monitor size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppearanceTheme('light')}
                          className={`p-1.5 px-2.5 rounded-md transition-all cursor-pointer ${
                            appearanceTheme === 'light'
                              ? 'bg-[#383a35] text-white shadow-sm'
                              : 'text-[#8e9089] hover:text-white'
                          }`}
                          title="Light theme"
                        >
                          <Sun size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppearanceTheme('dark')}
                          className={`p-1.5 px-2.5 rounded-md transition-all cursor-pointer ${
                            appearanceTheme === 'dark'
                              ? 'bg-[#383a35] text-white shadow-sm'
                              : 'text-[#8e9089] hover:text-white'
                          }`}
                          title="Dark theme"
                        >
                          <Moon size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Contrast selector */}
                    <div className="p-3.5 px-4 flex items-center justify-between">
                      <span className="font-medium text-white text-[13.5px]">Contrast</span>
                      <div
                        className="flex p-0.5 rounded-lg"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.35)',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setContrastMode('default')}
                          className={`px-3 py-1 rounded-md text-[12.5px] transition-all cursor-pointer ${
                            contrastMode === 'default'
                              ? 'bg-[#383a35] text-white font-medium shadow-sm'
                              : 'text-[#8e9089] hover:text-white'
                          }`}
                        >
                          Default
                        </button>
                        <button
                          type="button"
                          onClick={() => setContrastMode('strong')}
                          className={`px-3 py-1 rounded-md text-[12.5px] transition-all cursor-pointer ${
                            contrastMode === 'strong'
                              ? 'bg-[#383a35] text-white font-medium shadow-sm'
                              : 'text-[#8e9089] hover:text-white'
                          }`}
                        >
                          Strong
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Light Theme */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Light Theme</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {/* Preset row */}
                    <div className="p-3.5 px-4 flex items-center justify-between">
                      <span className="font-medium text-white text-[13.5px]">Preset</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setLightBg('#EEEEEE')
                            setLightFg('#101010')
                            setLightAccent('#007ACC')
                            setLightPreset('Default Light')
                          }}
                          className="p-1.5 rounded-md text-[#7a7c78] hover:text-white transition-colors cursor-pointer"
                          title="Reset to default"
                        >
                          <RotateCcw size={13.5} />
                        </button>
                        <div className="w-44">
                          <CustomSelect
                            value={lightPreset}
                            options={[
                              { value: 'Default Light', label: 'Default Light' },
                              { value: 'Solarized Light', label: 'Solarized Light' },
                              { value: 'Quiet Light', label: 'Quiet Light' }
                            ]}
                            onChange={(val) => {
                              setLightPreset(val)
                              if (val === 'Default Light') {
                                setLightBg('#EEEEEE')
                                setLightFg('#101010')
                                setLightAccent('#007ACC')
                              } else if (val === 'Solarized Light') {
                                setLightBg('#FDF6E3')
                                setLightFg('#657B83')
                                setLightAccent('#268BD2')
                              } else if (val === 'Quiet Light') {
                                setLightBg('#F5F5F5')
                                setLightFg('#333333')
                                setLightAccent('#7A3E9D')
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Background */}
                    <ColorPickerRow label="Background" color={lightBg} onChange={setLightBg} />

                    {/* Foreground */}
                    <ColorPickerRow label="Foreground" color={lightFg} onChange={setLightFg} />

                    {/* Accent */}
                    <ColorPickerRow label="Accent" color={lightAccent} onChange={setLightAccent} />
                  </div>
                </div>

                {/* Section Dark Theme */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Dark Theme</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {/* Preset row */}
                    <div className="p-3.5 px-4 flex items-center justify-between">
                      <span className="font-medium text-white text-[13.5px]">Preset</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDarkBg('#101010')
                            setDarkFg('#EEEEEE')
                            setDarkAccent('#007ACC')
                            setDarkPreset('Default Dark')
                          }}
                          className="p-1.5 rounded-md text-[#7a7c78] hover:text-white transition-colors cursor-pointer"
                          title="Reset to default"
                        >
                          <RotateCcw size={13.5} />
                        </button>
                        <div className="w-44">
                          <CustomSelect
                            value={darkPreset}
                            options={[
                              { value: 'Default Dark', label: 'Default Dark' },
                              { value: 'Progravity Dark', label: 'Progravity Dark' },
                              { value: 'Monokai', label: 'Monokai' },
                              { value: 'Dracula', label: 'Dracula' }
                            ]}
                            onChange={(val) => {
                              setDarkPreset(val)
                              if (val === 'Default Dark') {
                                setDarkBg('#101010')
                                setDarkFg('#EEEEEE')
                                setDarkAccent('#007ACC')
                              } else if (val === 'Progravity Dark') {
                                setDarkBg('#151613')
                                setDarkFg('#DCDED9')
                                setDarkAccent('#E91E63')
                              } else if (val === 'Monokai') {
                                setDarkBg('#272822')
                                setDarkFg('#F8F8F2')
                                setDarkAccent('#A6E22E')
                              } else if (val === 'Dracula') {
                                setDarkBg('#282A36')
                                setDarkFg('#F8F8F2')
                                setDarkAccent('#BD93F9')
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Background */}
                    <ColorPickerRow label="Background" color={darkBg} onChange={setDarkBg} />

                    {/* Foreground */}
                    <ColorPickerRow label="Foreground" color={darkFg} onChange={setDarkFg} />

                    {/* Accent */}
                    <ColorPickerRow label="Accent" color={darkAccent} onChange={setDarkAccent} />
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── 4. MODELS & USAGE ─────────── */}
            {activeTab === 'Models' && (
              <div className="space-y-6 pt-1 max-w-2xl">
                {/* 1. Plan */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Plan</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div>
                      <div className="font-medium text-white text-[13.5px]">Your Plan: Google AI Pro</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5">
                        You can upgrade to a Google AI Ultra plan to receive higher rate limits.
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-4 py-1.5 rounded-lg text-white font-medium text-[12.5px] transition-all cursor-pointer active:scale-95 shadow-md flex-shrink-0"
                      style={{
                        backgroundColor: '#e60067'
                      }}
                    >
                      Upgrade
                    </button>
                  </div>
                </div>

                {/* 2. Model Credits */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Model Credits</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="max-w-xl pr-4">
                      <div className="font-medium text-white text-[13.5px]">Enable AI Credit Overages</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5 leading-relaxed">
                        When toggled on, Antigravity will use your AI credits to fulfill model requests once you're out of model quota. Antigravity will always use your model quota first before using AI credits.
                      </div>
                    </div>

                    <MacOSToggle
                      checked={enableCreditOverages}
                      onChange={setEnableCreditOverages}
                    />
                  </div>
                </div>

                {/* 3. Gemini Models */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <h3 className="text-[13px] font-medium text-white">Gemini Models</h3>
                    <Info size={13} className="text-[#7a7c78] hover:text-[#9e9e9a] cursor-pointer" />
                  </div>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Weekly Limit Remaining</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          You have used some of your weekly limit, it will fully refresh in 6 days, 17 hours.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-[13.5px] font-medium text-white">91%</span>
                        <CircularProgress percentage={91} />
                      </div>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Five Hour Limit Remaining</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          You have used some of your 5-hour limit, it will fully refresh in 4 hours, 48 minutes.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-[13.5px] font-medium text-white">98%</span>
                        <CircularProgress percentage={98} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Anthropic Models */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <h3 className="text-[13px] font-medium text-white">Anthropic Models</h3>
                    <Info size={13} className="text-[#7a7c78] hover:text-[#9e9e9a] cursor-pointer" />
                  </div>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Weekly Limit Remaining</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          You have used some of your weekly limit, it will fully refresh in 6 days, 18 hours.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-[13.5px] font-medium text-white">84%</span>
                        <CircularProgress percentage={84} />
                      </div>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Five Hour Limit Remaining</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          You have full 5-hour limit remaining.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-[13.5px] font-medium text-white">100%</span>
                        <CircularProgress percentage={100} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. OpenAI Models */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <h3 className="text-[13px] font-medium text-white">OpenAI Models</h3>
                    <Info size={13} className="text-[#7a7c78] hover:text-[#9e9e9a] cursor-pointer" />
                  </div>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Weekly Limit Remaining</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          You have used some of your weekly limit, it will fully refresh in 5 days, 14 hours.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-[13.5px] font-medium text-white">92%</span>
                        <CircularProgress percentage={92} />
                      </div>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Five Hour Limit Remaining</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          You have used some of your 5-hour limit, it will fully refresh in 3 hours, 20 minutes.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-[13.5px] font-medium text-white">96%</span>
                        <CircularProgress percentage={96} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Mistral Models */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <h3 className="text-[13px] font-medium text-white">Mistral Models</h3>
                    <Info size={13} className="text-[#7a7c78] hover:text-[#9e9e9a] cursor-pointer" />
                  </div>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Weekly Limit Remaining</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          You have used some of your weekly limit, it will fully refresh in 6 days, 22 hours.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-[13.5px] font-medium text-white">95%</span>
                        <CircularProgress percentage={95} />
                      </div>
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Five Hour Limit Remaining</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          You have full 5-hour limit remaining.
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-4">
                        <span className="text-[13.5px] font-medium text-white">100%</span>
                        <CircularProgress percentage={100} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── 5. CUSTOMIZATIONS ─────────── */}
            {activeTab === 'Customizations' && (
              <div className="space-y-6 pt-1 max-w-2xl">
                {/* 1. Token Usage */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Token Usage</h3>
                  <div className="p-4 rounded-xl border border-[#282a26] bg-[#1c1e1a]/60 space-y-3">
                    <p className="text-[12.5px] text-[#8e9089] leading-relaxed">
                      The breakdown below shows token usage from customizations like skills, rules, and MCP. If the budget is exceeded, large customizations will be truncated automatically.
                    </p>
                    <div className="text-[12.5px] text-[#8e9089]">
                      70.4% of the customization budget is available.
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#007aff]"
                        style={{ width: '29.6%' }}
                      />
                    </div>

                    {/* Footer info */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-[12.5px]">
                        <span className="w-2 h-2 rounded-full bg-[#007aff] flex-shrink-0" />
                        <span className="font-medium text-white">Skills</span>
                        <span className="text-[#8e9089]">(5 921 tokens) 29.6%</span>
                      </div>

                      <button
                        type="button"
                        className="text-[12.5px] text-[#007aff] hover:underline cursor-pointer"
                      >
                        Show 42 breakdowns
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Skills */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-medium text-white">Skills</h3>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-white font-medium">
                        47
                      </span>
                      <ChevronDown size={13} className="text-[#8e9089]" />
                    </div>
                  </div>

                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {DEFAULT_SKILLS.map((skill) => (
                      <div key={skill.name} className="p-3.5 px-4 group/skill">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-white text-[13.5px] tracking-tight">
                              {skill.name}
                            </span>
                            {skill.isGlobal && (
                              <span className="px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-[#1a2936] text-[#38bdf8] border border-[#224460]">
                                Global
                              </span>
                            )}
                            {skill.plugin && (
                              <span className="px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-[#2d1b36] text-[#c678dd] border border-[#4a2656]">
                                Plugin: {skill.plugin}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(skill.name)}
                            className="text-[#60625c] group-hover/skill:text-white p-1 rounded transition-colors cursor-pointer"
                            title="Copy skill name"
                          >
                            <Copy size={13} />
                          </button>
                        </div>

                        <p className="text-[12px] text-[#8e9089] mt-1.5 leading-relaxed line-clamp-2">
                          {skill.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Installed MCP Servers */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-medium text-white">Installed MCP Servers</h3>
                      <button
                        type="button"
                        className="text-[#8e9089] hover:text-white transition-colors cursor-pointer"
                        title="Refresh MCP servers"
                      >
                        <RotateCw size={12.5} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12px] font-medium transition-colors cursor-pointer"
                      >
                        Add MCP +
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12px] font-medium transition-colors cursor-pointer"
                      >
                        Open MCP Config
                      </button>
                    </div>
                  </div>

                  <div className="p-8 rounded-xl border border-[#282a26] bg-[#1c1e1a]/60 flex flex-col items-center justify-center text-center">
                    <div className="font-medium text-white text-[13.5px] mb-1">
                      No MCP servers installed
                    </div>
                    <div className="text-[12px] text-[#8e9089] max-w-sm leading-relaxed">
                      Use Add MCP to browse the store, or add a custom server via the MCP config.
                    </div>
                  </div>
                </div>

                {/* 4. Plugins */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Plugins</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div>
                      <div className="font-medium text-white text-[13.5px]">Build With Google Plugins</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5">
                        Browse and enable plugins from the Build With Google catalog.
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer flex-shrink-0"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── 6. SHORTCUTS ─────────── */}
            {activeTab === 'Shortcuts' && (
              <div className="space-y-3 pt-1">
                <h3 className="text-[13px] font-medium text-white mb-1">Keyboard Shortcuts</h3>
                <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                  {[
                    { label: 'Command Palette', keys: ['Ctrl', 'Shift', 'P'] },
                    { label: 'Open Settings', keys: ['Ctrl', ','] },
                    { label: 'Toggle Sidebar', keys: ['Ctrl', 'B'] },
                    { label: 'New Conversation', keys: ['Ctrl', 'N'] },
                    { label: 'Attach Context', keys: ['@'] },
                    { label: 'Quick Actions', keys: ['/'] }
                  ].map((sc, i) => (
                    <div key={i} className="px-4 py-3 flex items-center justify-between">
                      <span className="text-white text-[13px]">{sc.label}</span>
                      <div className="flex items-center gap-1">
                        {sc.keys.map((k, j) => (
                          <span
                            key={j}
                            className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[11.5px] font-mono text-[#c5c7c2]"
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─────────── 7. PROVIDE FEEDBACK ─────────── */}
            {activeTab === 'Provide Feedback' && (
              <div className="space-y-5 pt-1 max-w-2xl">
                {/* Feedback Type Selector */}
                <div>
                  <label className="text-[13px] font-medium text-white block mb-2">
                    Feedback Type
                  </label>
                  <CustomSelect
                    value={feedbackCategory}
                    options={[
                      { value: 'Bug Report', label: 'Bug Report' },
                      { value: 'Feature Request', label: 'Feature Request' },
                      { value: 'Auth and Billing', label: 'Auth and Billing' },
                      { value: 'Remote Control Issue', label: 'Remote Control Issue' },
                      { value: 'General Feedback', label: 'General Feedback' }
                    ]}
                    onChange={setFeedbackCategory}
                  />
                </div>

                {/* Description Section with Context-Aware Instructions */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Description</h3>

                  {feedbackCategory === 'Auth and Billing' && (
                    <>
                      <p className="text-[12.5px] text-[#9e9e9a] leading-relaxed mb-2">
                        Please describe your auth or billing issue. More details will help our support team resolve your issue quicker. Some helpful information includes:
                      </p>
                      <ul className="space-y-1 text-[12.5px] text-[#9e9e9a] mb-3 pl-0.5">
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>What quota or feature is being incorrectly limited</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>What functionality you expect your account tier to have available that is missing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>Any error messages seen when trying to log in</span>
                        </li>
                      </ul>
                    </>
                  )}

                  {feedbackCategory === 'Bug Report' && (
                    <>
                      <p className="text-[12.5px] text-[#9e9e9a] leading-relaxed mb-2">
                        Please describe the bug you encountered. More details will help our team investigate and resolve the issue quicker. Some helpful information includes:
                      </p>
                      <ul className="space-y-1 text-[12.5px] text-[#9e9e9a] mb-3 pl-0.5">
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>What behavior you expected vs what actually happened</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>Any error messages or unexpected behaviors</span>
                        </li>
                      </ul>
                    </>
                  )}

                  {feedbackCategory === 'Feature Request' && (
                    <>
                      <p className="text-[12.5px] text-[#9e9e9a] leading-relaxed mb-2">
                        Please describe the feature you would like to see. Some helpful information includes:
                      </p>
                      <ul className="space-y-1 text-[12.5px] text-[#9e9e9a] mb-3 pl-0.5">
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>What problem does this feature solve for you</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>How you envision this feature working in your workflow</span>
                        </li>
                      </ul>
                    </>
                  )}

                  {feedbackCategory === 'Remote Control Issue' && (
                    <>
                      <p className="text-[12.5px] text-[#9e9e9a] leading-relaxed mb-2">
                        Please describe your remote control or connection issue. Some helpful information includes:
                      </p>
                      <ul className="space-y-1 text-[12.5px] text-[#9e9e9a] mb-3 pl-0.5">
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>What connection error or latency behavior occurred</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>Your network environment and operating system details</span>
                        </li>
                      </ul>
                    </>
                  )}

                  {feedbackCategory === 'General Feedback' && (
                    <>
                      <p className="text-[12.5px] text-[#9e9e9a] leading-relaxed mb-2">
                        Please share your thoughts, impressions, or suggestions about Progravity:
                      </p>
                      <ul className="space-y-1 text-[12.5px] text-[#9e9e9a] mb-3 pl-0.5">
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>What you enjoy most about the experience</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#8e9089] select-none">•</span>
                          <span>What areas feel confusing, slow, or could be improved</span>
                        </li>
                      </ul>
                    </>
                  )}

                  {/* Description Textarea */}
                  <textarea
                    rows={5}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={
                      feedbackCategory === 'Auth and Billing'
                        ? 'Describe your auth or billing issue...'
                        : feedbackCategory === 'Bug Report'
                        ? 'Describe the bug you encountered...'
                        : feedbackCategory === 'Feature Request'
                        ? 'Describe your feature request...'
                        : feedbackCategory === 'Remote Control Issue'
                        ? 'Describe your remote control issue...'
                        : 'Describe your general feedback...'
                    }
                    className="w-full bg-[#181a16] border border-[#282a26] rounded-xl p-3.5 text-[13px] text-white placeholder-[#585a54] outline-none focus:border-[#007aff]/60 transition-colors resize-none custom-scrollbar"
                  />
                  {feedbackText.trim().length > 0 && feedbackText.trim().length < 20 && (
                    <div className="text-[11px] text-[#7a7c78] mt-1 px-1">
                      {20 - feedbackText.trim().length} more characters needed
                    </div>
                  )}
                </div>

                {/* Steps to Reproduce Section — Visible ONLY for Bug Report (Required 20 min) */}
                {feedbackCategory === 'Bug Report' && (
                  <div>
                    <h3 className="text-[13px] font-medium text-white mb-2">Steps to Reproduce</h3>
                    <textarea
                      rows={5}
                      value={feedbackSteps}
                      onChange={(e) => setFeedbackSteps(e.target.value)}
                      placeholder="Please list the steps to reproduce the issue"
                      className="w-full bg-[#181a16] border border-[#282a26] rounded-xl p-3.5 text-[13px] text-white placeholder-[#585a54] outline-none focus:border-[#007aff]/60 transition-colors resize-none custom-scrollbar"
                    />
                    {feedbackSteps.trim().length > 0 && feedbackSteps.trim().length < 20 && (
                      <div className="text-[11px] text-[#7a7c78] mt-1 px-1">
                        {20 - feedbackSteps.trim().length} more characters needed
                      </div>
                    )}
                  </div>
                )}

                {/* Attach screenshot */}
                <div className="pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setScreenshotName(file.name)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-[12.5px] text-[#9e9e9a] hover:text-white transition-colors cursor-pointer group"
                  >
                    <Paperclip size={14} className="text-[#7a7c78] group-hover:text-white transition-colors" />
                    <span>{screenshotName ? `Attached: ${screenshotName}` : 'Attach a screenshot (optional)'}</span>
                    {screenshotName && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          setScreenshotName(null)
                        }}
                        className="ml-1 text-[11px] text-red-400 hover:text-red-300"
                      >
                        (remove)
                      </span>
                    )}
                  </button>
                </div>

                {/* Attach Progravity Server Logs Checkbox */}
                <div className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => setAttachServerLogs(!attachServerLogs)}
                    className="flex items-center gap-2.5 text-left cursor-pointer group select-none"
                  >
                    <div
                      className="w-4 h-4 rounded-[4px] flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: attachServerLogs ? '#e91e63' : 'rgba(255, 255, 255, 0.08)',
                        border: attachServerLogs ? '1px solid #e91e63' : '1px solid #4a4c46'
                      }}
                    >
                      {attachServerLogs && (
                        <Check size={12} strokeWidth={3} className="text-white" />
                      )}
                    </div>
                    <span className="text-[13px] text-white font-normal group-hover:text-white">
                      Attach Progravity server logs
                    </span>
                  </button>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-3">
                  {(() => {
                    const isDescriptionValid = feedbackText.trim().length >= 20
                    const isStepsValid = feedbackSteps.trim().length >= 20
                    const isFormValid =
                      feedbackCategory === 'Bug Report'
                        ? isDescriptionValid && isStepsValid
                        : isDescriptionValid

                    return (
                      <button
                        type="button"
                        disabled={!isFormValid || feedbackSent}
                        onClick={() => {
                          if (!isFormValid) return
                          setFeedbackSent(true)
                          setTimeout(() => {
                            setFeedbackText('')
                            setFeedbackSteps('')
                            setScreenshotName(null)
                            setFeedbackSent(false)
                          }, 2500)
                        }}
                        className={`px-5 py-2 rounded-xl text-white text-[13px] font-medium transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
                          feedbackSent
                            ? 'bg-[#10b981] shadow-emerald-500/20'
                            : 'bg-[#007aff] hover:bg-[#0071eb] shadow-blue-500/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'
                        }`}
                      >
                        {feedbackSent && <Check size={14} strokeWidth={2.5} />}
                        <span>{feedbackSent ? 'Feedback Sent' : 'Submit Feedback'}</span>
                      </button>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* ─────────── 8. PROJECT SETTINGS ─────────── */}
            {activeTab.startsWith('proj-') && (() => {
              const currentProjectId = activeTab.replace('proj-', '')
              const currentProject = projects.find((p) => p.id === currentProjectId) || {
                id: currentProjectId,
                name: currentProjectId,
                conversations: []
              }
              const currentFolders = [currentProject.name + '/']
              const currentSecurity = projectSecurityPresets[currentProjectId] || 'Inherit Global'
              const currentArtifact = projectArtifactPolicies[currentProjectId] || 'Inherit Global'
              const convCount = currentProject.conversations?.length ?? 1

              return (
                <div className="space-y-6 pt-1 max-w-2xl">
                  {/* 1. Folders */}
                  <div>
                    <h3 className="text-[13px] font-medium text-white mb-2">Folders</h3>
                    <div className="rounded-xl border border-[#282a26] bg-[#1c1e1a]/60 overflow-hidden divide-y divide-[#282a26]">
                      {currentFolders.map((folder, idx) => (
                        <div key={idx} className="p-3.5 px-4 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Folder size={15} className="text-[#8e9089]" />
                            <span className="text-[13px] font-normal text-white">{folder}</span>
                          </div>
                          <button
                            type="button"
                            className="text-[#7a7c78] hover:text-white transition-colors cursor-pointer p-0.5"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="w-full py-2.5 flex items-center justify-center text-[12.5px] font-medium text-[#c5c7c2] hover:text-white hover:bg-white/[0.03] transition-colors cursor-pointer"
                      >
                        + Add Folder
                      </button>
                    </div>
                  </div>

                  {/* 2. Agent Settings */}
                  <div>
                    <h3 className="text-[13px] font-medium text-white mb-2">Agent Settings</h3>
                    <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Security Preset</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          Controls the actions the agent can take.
                        </div>
                        <div className="flex items-center gap-1 text-[11.5px] text-[#7a7c78] hover:text-[#a0a29c] transition-colors cursor-pointer mt-1">
                          <span>Learn more about {currentSecurity}</span>
                          <Info size={12} />
                        </div>
                      </div>

                      <div className="w-44">
                        <CustomSelect
                          value={currentSecurity}
                          options={[
                            { value: 'Inherit Global', label: 'Inherit Global' },
                            { value: 'Default', label: 'Default' },
                            { value: 'Strict', label: 'Strict' },
                            { value: 'Permissive', label: 'Permissive' }
                          ]}
                          onChange={(val) =>
                            setProjectSecurityPresets((prev) => ({
                              ...prev,
                              [currentProjectId]: val
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Agent Behavior */}
                  <div>
                    <h3 className="text-[13px] font-medium text-white mb-2">Agent Behavior</h3>
                    <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Artifact Review Policy</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          Whether the agent asks you to review its documents.
                        </div>
                      </div>

                      <div className="w-44">
                        <CustomSelect
                          value={currentArtifact}
                          options={[
                            { value: 'Inherit Global', label: 'Inherit Global' },
                            { value: 'Always Ask', label: 'Always Ask' },
                            { value: 'Ask on Modifications', label: 'Ask on Modifications' },
                            { value: 'Never Ask', label: 'Never Ask' }
                          ]}
                          onChange={(val) =>
                            setProjectArtifactPolicies((prev) => ({
                              ...prev,
                              [currentProjectId]: val
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Local Permissions */}
                  <div>
                    <h3 className="text-[13px] font-medium text-white mb-1">Local Permissions</h3>
                    <p className="text-[12px] text-[#8e9089] mb-2.5 leading-relaxed">
                      Also includes{' '}
                      <a
                        href="#global"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTab('General')
                        }}
                        className="text-[#007aff] hover:underline cursor-pointer"
                      >
                        Global Permissions
                      </a>{' '}
                      when working in this project.{' '}
                      <a
                        href="#learn-more"
                        onClick={(e) => e.preventDefault()}
                        className="text-[#007aff] hover:underline cursor-pointer"
                      >
                        Learn more
                      </a>
                      .
                    </p>
                    <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                      {[
                        { label: 'File Access Rules', desc: 'Configure allowed and denied paths for file reads and writes.' },
                        { label: 'Network Access Rules', desc: 'Configure allowed and denied URLs for reading.' },
                        { label: 'Terminal Commands', desc: 'Configure allowed terminal commands.' },
                        { label: 'Commands Outside Sandbox', desc: 'Configure allowed commands outside the sandbox.' },
                        { label: 'MCP Tools', desc: 'Configure external tools via Model Context Protocol.' }
                      ].map((item, i) => (
                        <div key={i} className="p-4 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-white text-[13.5px]">{item.label}</div>
                            <div className="text-[12px] text-[#8e9089] mt-0.5">{item.desc}</div>
                          </div>
                          <button
                            type="button"
                            className="px-4 py-1.5 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer"
                          >
                            Open
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Customizations */}
                  <div>
                    <h3 className="text-[13px] font-medium text-white mb-2">Customizations</h3>
                    <div className="p-4 rounded-xl border border-[#282a26] bg-[#1c1e1a]/60 space-y-3">
                      <p className="text-[12.5px] text-[#8e9089] leading-relaxed">
                        The breakdown below shows token usage from customizations like skills, rules, and MCP. If the budget is exceeded, large customizations will be truncated automatically.
                      </p>
                      <div className="text-[12.5px] text-[#8e9089]">
                        70.4% of the customization budget is available.
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#007aff]"
                          style={{ width: '29.6%' }}
                        />
                      </div>

                      {/* Footer info */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 text-[12.5px]">
                          <span className="w-2 h-2 rounded-full bg-[#007aff] flex-shrink-0" />
                          <span className="font-medium text-white">Skills</span>
                          <span className="text-[#8e9089]">(5 921 tokens) 29.6%</span>
                        </div>

                        <button
                          type="button"
                          className="text-[12.5px] text-[#007aff] hover:underline cursor-pointer"
                        >
                          Show 42 breakdowns
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 6. Skills */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-medium text-white">Skills</h3>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-white font-medium">
                          47
                        </span>
                        <ChevronDown size={13} className="text-[#8e9089]" />
                      </div>
                    </div>

                    <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                      {DEFAULT_SKILLS.map((skill) => (
                        <div key={skill.name} className="p-3.5 px-4 group/skill">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-white text-[13.5px] tracking-tight">
                                {skill.name}
                              </span>
                              {skill.isGlobal && (
                                <span className="px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-[#1a2936] text-[#38bdf8] border border-[#224460]">
                                  Global
                                </span>
                              )}
                              {skill.plugin && (
                                <span className="px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-[#2d1b36] text-[#c678dd] border border-[#4a2656]">
                                  Plugin: {skill.plugin}
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => navigator.clipboard.writeText(skill.name)}
                              className="text-[#60625c] group-hover/skill:text-white p-1 rounded transition-colors cursor-pointer"
                              title="Copy skill name"
                            >
                              <Copy size={13} />
                            </button>
                          </div>

                          <p className="text-[12px] text-[#8e9089] mt-1.5 leading-relaxed line-clamp-2">
                            {skill.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7. Plugins */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[13px] font-medium text-white">Plugins</h3>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-white font-medium">
                          6
                        </span>
                        <ChevronDown size={13} className="text-[#8e9089]" />
                      </div>
                    </div>

                    <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                      {DEFAULT_PLUGINS.map((plugin) => (
                        <div key={plugin.id} className="p-3.5 px-4 group/plugin">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white text-[13.5px] tracking-tight">
                                {plugin.name}
                              </span>
                              {plugin.isGlobal && (
                                <span className="px-1.5 py-0.5 rounded text-[10.5px] font-medium bg-[#1a2936] text-[#38bdf8] border border-[#224460]">
                                  Global
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(plugin.name)}
                                className="text-[#60625c] group-hover/plugin:text-white transition-colors cursor-pointer p-1"
                                title="Copy plugin name"
                              >
                                <Copy size={13.5} />
                              </button>
                              <button
                                type="button"
                                className="text-[#60625c] hover:text-red-400 transition-colors cursor-pointer p-1"
                                title="Remove plugin"
                              >
                                <Trash2 size={13.5} />
                              </button>
                              <MacOSToggle
                                checked={enabledPlugins[plugin.id] ?? true}
                                onChange={(val) =>
                                  setEnabledPlugins((prev) => ({
                                    ...prev,
                                    [plugin.id]: val
                                  }))
                                }
                              />
                            </div>
                          </div>

                          {plugin.description && (
                            <p className="text-[12px] text-[#8e9089] mt-1 leading-relaxed">
                              {plugin.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 8. Danger Zone */}
                  <div>
                    <h3 className="text-[13px] font-medium text-white mb-2">Danger Zone</h3>
                    <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Delete Project</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          Permanently delete{' '}
                          <span className="text-white font-medium">{currentProject.name}</span>{' '}
                          including {convCount} active conversation{convCount > 1 ? 's' : ''}.
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              `Are you sure you want to delete project "${currentProject.name}"?`
                            )
                          ) {
                            onDeleteProject?.(currentProjectId)
                            setActiveTab('General')
                          }
                        }}
                        className="px-4 py-1.5 rounded-lg text-white font-medium text-[12.5px] bg-[#e03838] hover:bg-[#c92a2a] transition-all cursor-pointer active:scale-95 shadow-md flex-shrink-0"
                      >
                        Delete Project
                      </button>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
