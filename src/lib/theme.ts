import type { AccentColor } from '@/types/curriculum'

export interface AccentStyle {
  soft: string
  softText: string
  chip: string
  solid: string
  solidHover: string
  grad: string
  border: string
  ring: string
  dot: string
}

const accents: Record<AccentColor, AccentStyle> = {
  amber: {
    soft: 'bg-amber-50',
    softText: 'text-amber-700',
    chip: 'bg-amber-100 text-amber-800',
    solid: 'bg-amber-500',
    solidHover: 'hover:bg-amber-600',
    grad: 'from-amber-400 to-amber-600',
    border: 'border-amber-200',
    ring: 'ring-amber-300',
    dot: 'bg-amber-500',
  },
  indigo: {
    soft: 'bg-indigo-50',
    softText: 'text-indigo-700',
    chip: 'bg-indigo-100 text-indigo-800',
    solid: 'bg-indigo-600',
    solidHover: 'hover:bg-indigo-700',
    grad: 'from-indigo-500 to-indigo-700',
    border: 'border-indigo-200',
    ring: 'ring-indigo-300',
    dot: 'bg-indigo-600',
  },
  rose: {
    soft: 'bg-rose-50',
    softText: 'text-rose-700',
    chip: 'bg-rose-100 text-rose-800',
    solid: 'bg-rose-500',
    solidHover: 'hover:bg-rose-600',
    grad: 'from-rose-400 to-rose-600',
    border: 'border-rose-200',
    ring: 'ring-rose-300',
    dot: 'bg-rose-500',
  },
  emerald: {
    soft: 'bg-emerald-50',
    softText: 'text-emerald-700',
    chip: 'bg-emerald-100 text-emerald-800',
    solid: 'bg-emerald-600',
    solidHover: 'hover:bg-emerald-700',
    grad: 'from-emerald-500 to-emerald-700',
    border: 'border-emerald-200',
    ring: 'ring-emerald-300',
    dot: 'bg-emerald-600',
  },
}

export function accent(name: string): AccentStyle {
  if (name === 'amber' || name === 'indigo' || name === 'rose' || name === 'emerald') {
    return accents[name]
  }
  return accents.indigo
}
