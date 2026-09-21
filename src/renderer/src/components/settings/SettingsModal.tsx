import React, { useState, useEffect, useRef } from 'react'
import { X, ChevronDown, Info, Check, Paperclip } from 'lucide-react'
import { llmManager } from '../../services/llm/LLMManager'

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
  projects?: { id: string; name: string }[]
  onSignOut?: () => void
}

// ── Composant Switch Toggle macOS ultra fluide, tactile et vivant ──
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

// ── Custom macOS Select Dropdown harmonisé (pas de dégradation de couleur) ──
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

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'General',
  projects = [
    { id: 'desktop-llm', name: 'desktop-llm' },
    { id: 'SmoothTerminal', name: 'SmoothTerminal' },
    { id: 'test-box', name: 'test-box' }
  ],
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab)

  // Options state
  const [queuedMessagesMode, setQueuedMessagesMode] = useState<'queue' | 'immediate'>('queue')
  const [securityPreset, setSecurityPreset] = useState('Default')
  const [artifactReviewPolicy, setArtifactReviewPolicy] = useState('Always Ask')
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [launchAtLogin, setLaunchAtLogin] = useState(false)
  const [themeMode, setThemeMode] = useState<'dark' | 'system' | 'light'>('dark')
  const [interfaceScale, setInterfaceScale] = useState('100%')
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
      {/* ── Boîte modale principale ── */}
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
        {/* ── Colonne de gauche : Sidebar Settings ── */}
        <div
          className="w-[210px] flex-shrink-0 flex flex-col justify-between"
          style={{
            backgroundColor: '#1f211d',
            borderRight: '1px solid #282a26'
          }}
        >
          {/* Liste des sections et onglets avec scrollbar discrète */}
          <div className="flex-1 overflow-y-auto px-2.5 pt-4 pb-2 space-y-4 custom-scrollbar">
            {/* Section Principale */}
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

            {/* Section Projects */}
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

            {/* Section Shortcuts & Feedback */}
            <div className="space-y-0.5 pt-1">
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
              <h2 className="text-[22px] font-semibold text-white tracking-tight leading-snug">
                {activeTab === 'Account'
                  ? 'Account'
                  : activeTab.startsWith('proj-')
                  ? 'Project Settings'
                  : activeTab}
              </h2>
              {activeTab !== 'Provide Feedback' && (
                <p className="text-[12.5px] text-[#8e9089] mt-1">
                  {activeTab === 'Account' &&
                    'Manage your plan, credentials, and general preferences.'}
                  {activeTab === 'General' &&
                    'Configure agent execution, queued message delivery, and permissions.'}
                  {activeTab === 'Application' &&
                    'Manage system behavior, updates, startup preferences, and storage.'}
                  {activeTab === 'Appearance' &&
                    'Customize the user interface theme, typography, and scaling.'}
                  {activeTab === 'Models' &&
                    'Configure local & cloud AI providers, models, and API tokens.'}
                  {activeTab === 'Customizations' &&
                    'Manage system prompts, developer rules, and AI skills.'}
                  {activeTab === 'Shortcuts' &&
                    'Quick keyboard shortcuts and fast action triggers.'}
                  {activeTab.startsWith('proj-') &&
                    'Configure project-level workspace variables, context, and permissions.'}
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
              <div className="space-y-6 pt-1">
                {/* Section Execution */}
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

                {/* Section Global Permissions */}
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Global Permissions</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {/* Ligne 1 : Security Preset */}
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

                    {/* Ligne 2 : Tool Permissions */}
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

                {/* Section Agent Behavior */}
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
              </div>
            )}

            {/* ─────────── 2. APPLICATION ─────────── */}
            {activeTab === 'Application' && (
              <div className="space-y-6 pt-1">
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Startup & Window</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Launch at Login</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          Automatically start Progravity when you log into your system.
                        </div>
                      </div>
                      <MacOSToggle checked={launchAtLogin} onChange={setLaunchAtLogin} />
                    </div>

                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white text-[13.5px]">Automatic Updates</div>
                        <div className="text-[12px] text-[#8e9089] mt-0.5">
                          Keep Progravity up to date with new features and improvements.
                        </div>
                      </div>
                      <MacOSToggle checked={autoUpdate} onChange={setAutoUpdate} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Storage & Cache</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div>
                      <div className="font-medium text-white text-[13.5px]">Temporary Cache</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5">
                        Clear local caches and downloaded models metadata.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => alert('Cache cleared successfully')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[#dcded9] hover:text-white text-[12.5px] font-medium transition-colors cursor-pointer"
                    >
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── 3. APPEARANCE ─────────── */}
            {activeTab === 'Appearance' && (
              <div className="space-y-6 pt-1">
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Theme Mode</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark', label: 'Dark (Default)', desc: 'Pure carbon theme' },
                      { id: 'system', label: 'System', desc: 'Sync with OS setting' },
                      { id: 'light', label: 'Light', desc: 'Classic bright theme' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setThemeMode(item.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          themeMode === item.id
                            ? 'bg-white/10 border-white/20 text-white'
                            : 'bg-[#1c1e1a]/60 border-[#282a26] text-[#8e9089] hover:border-white/15 hover:text-white'
                        }`}
                      >
                        <div className="font-medium text-[13px] text-white">{item.label}</div>
                        <div className="text-[11.5px] text-[#7a7c78] mt-1">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Scaling & Display</h3>
                  <div className="p-4 rounded-xl flex items-center justify-between border border-[#282a26] bg-[#1c1e1a]/60">
                    <div>
                      <div className="font-medium text-white text-[13.5px]">Interface Scale</div>
                      <div className="text-[12px] text-[#8e9089] mt-0.5">
                        Adjust text size and UI proportions.
                      </div>
                    </div>

                    <div className="w-44">
                      <CustomSelect
                        value={interfaceScale}
                        options={[
                          { value: '90%', label: '90%' },
                          { value: '100%', label: '100% (Default)' },
                          { value: '110%', label: '110%' },
                          { value: '125%', label: '125%' }
                        ]}
                        onChange={setInterfaceScale}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── 4. MODELS ─────────── */}
            {activeTab === 'Models' && (
              <div className="space-y-6 pt-1">
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Connected Providers</h3>
                  <div className="rounded-xl divide-y divide-[#282a26] border border-[#282a26] bg-[#1c1e1a]/60">
                    {llmManager.getAllProviders().map((provider) => (
                      <div
                        key={provider.id}
                        className="p-3.5 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white font-medium text-[12px]">
                            {provider.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-white text-[13px] flex items-center gap-2">
                              {provider.name}
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#8e9089]">
                                {provider.isLocal ? 'Local' : 'Cloud'}
                              </span>
                            </div>
                            <div className="text-[11.5px] text-[#7a7c78] mt-0.5">
                              {provider.models.length} models available
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="px-3 py-1 rounded-lg bg-[#2b2d29] hover:bg-white/[0.08] border border-white/[0.06] text-[12px] text-[#dcded9] hover:text-white transition-colors cursor-pointer"
                        >
                          Configure
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─────────── 5. CUSTOMIZATIONS ─────────── */}
            {activeTab === 'Customizations' && (
              <div className="space-y-6 pt-1">
                <div>
                  <h3 className="text-[13px] font-medium text-white mb-2">Developer Instructions</h3>
                  <div className="p-4 rounded-xl border border-[#282a26] bg-[#1c1e1a]/60">
                    <div className="text-[12px] text-[#8e9089] mb-2.5">
                      Custom rules and guidelines provided to all AI models in your workspace.
                    </div>
                    <textarea
                      rows={4}
                      placeholder="e.g. Always write code in TypeScript with strict typing..."
                      className="w-full bg-[#181916] border border-[#282a26] rounded-lg p-2.5 text-[12.5px] text-white placeholder-[#6a6c68] outline-none focus:border-[#007aff]/50 resize-none"
                    />
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
          </div>
        </div>
      </div>
    </div>
  )
}
