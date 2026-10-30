'use client'

import { useRef } from 'react'

export default function TotpCodeInput({
  value,
  onChange,
  disabled,
  autoFocus,
  id = 'totp-code',
}: {
  value: string
  onChange: (next: string) => void
  disabled?: boolean
  autoFocus?: boolean
  id?: string
}) {
  const ref = useRef<HTMLInputElement>(null)

  function setDigits(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 6)
    onChange(digits)
  }

  return (
    <input
      ref={ref}
      id={id}
      name="code"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="\d{6}"
      maxLength={6}
      spellCheck={false}
      autoFocus={autoFocus}
      disabled={disabled}
      value={value}
      onChange={(e) => setDigits(e.target.value)}
      onPaste={(e) => {
        e.preventDefault()
        setDigits(e.clipboardData.getData('text'))
      }}
      aria-label="六位驗證碼"
      className="w-full rounded-lg border border-cyan-500/30 bg-[#07111f] px-4 py-3 text-center font-mono text-2xl tracking-[0.4em] text-cyan-50 outline-none focus:border-cyan-400 disabled:opacity-50"
      placeholder="••••••"
    />
  )
}
