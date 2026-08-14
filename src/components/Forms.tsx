import type { CSSProperties, ReactNode } from 'react'
import { C } from './tokens'

const inputBase: CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  fontSize: 14,
  fontFamily: 'inherit',
  color: C.text,
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 12,
  outline: 'none',
}

export function Field({
  label,
  hint,
  children,
  style,
}: {
  label?: string
  hint?: string
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <label style={{ display: 'block', marginBottom: 16, ...style }}>
      {label && (
        <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 7 }}>
          {label}
        </span>
      )}
      {children}
      {hint && (
        <span style={{ display: 'block', fontSize: 11.5, color: C.faint, marginTop: 6 }}>{hint}</span>
      )}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { style, ...rest } = props
  return <input {...rest} className="sl-input" style={{ ...inputBase, ...style }} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { style, ...rest } = props
  return (
    <textarea
      {...rest}
      className="sl-input"
      style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6, ...style }}
    />
  )
}

export function Select({
  value,
  onChange,
  options,
  style,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  style?: CSSProperties
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="sl-input"
      style={{ ...inputBase, cursor: 'pointer', appearance: 'none', paddingRight: 34, ...style }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
      <span
        style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 14,
          color: C.faint,
        }}
      >
        🔍
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="sl-input"
        style={{ ...inputBase, paddingLeft: 40 }}
      />
    </div>
  )
}
