'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Check, Trash2, Loader2, Package, FileText, Bell, List } from 'lucide-react'
import { toggleChecklistItem, addChecklistItem, deleteChecklistItem } from '@/app/actions/checklist'
import type { Trip, ChecklistItem } from '@/types/database'
import type { ChecklistWithItems } from '@/types/app'

const CHECKLIST_ICONS: Record<string, React.ElementType> = {
  packing: Package,
  documents: FileText,
  reminders: Bell,
  custom: List,
}

const CHECKLIST_COLORS: Record<string, string> = {
  packing: '#D4A017',
  documents: '#0891B2',
  reminders: '#10b981',
  custom: '#a78bfa',
}

interface Props {
  trip: Trip
  checklists: ChecklistWithItems[]
}

function ChecklistItemRow({
  item,
  tripId,
  color,
}: {
  item: ChecklistItem
  tripId: string
  color: string
}) {
  const [optimisticChecked, setOptimisticChecked] = useState(item.is_checked)
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const router = useRouter()

  function handleToggle() {
    const newVal = !optimisticChecked
    setOptimisticChecked(newVal)
    startTransition(async () => {
      await toggleChecklistItem(item.id, tripId, newVal)
      router.refresh()
    })
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteChecklistItem(item.id, tripId)
      router.refresh()
    })
  }

  return (
    <div className="group flex items-center gap-3 py-2.5 border-b border-[rgba(30,45,69,0.3)] last:border-0">
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className="shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
        style={optimisticChecked
          ? { background: color, borderColor: color }
          : { borderColor: 'rgba(30,45,69,0.8)', background: 'transparent' }}
      >
        {optimisticChecked && <Check className="w-3 h-3 text-[#0B1120] font-bold" strokeWidth={3} />}
      </button>

      {/* Label */}
      <span className={`flex-1 text-sm transition-colors ${optimisticChecked ? 'line-through text-[#4d6080]' : 'text-white'}`}>
        {item.text}
      </span>

      {/* Category badge */}
      {item.category && (
        <span className="text-[10px] text-[#4d6080] px-1.5 py-0.5 rounded bg-white/5 hidden group-hover:inline-block">
          {item.category}
        </span>
      )}

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1 rounded-lg text-[#4d6080] hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
      </button>
    </div>
  )
}

function ChecklistCard({ checklist, trip }: { checklist: ChecklistWithItems; trip: Trip }) {
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const Icon = CHECKLIST_ICONS[checklist.type] || List
  const color = CHECKLIST_COLORS[checklist.type] || '#a78bfa'

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newItem.trim()) return
    startTransition(async () => {
      await addChecklistItem(checklist.id, trip.id, newItem.trim())
      setNewItem('')
      setAdding(false)
      router.refresh()
    })
  }

  return (
    <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[rgba(30,45,69,0.4)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{checklist.name}</h3>
              <p className="text-xs text-[#4d6080] mt-0.5">
                {checklist.completedCount}/{checklist.totalCount} completed
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-display font-bold" style={{ color }}>
              {checklist.percentage}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {checklist.totalCount > 0 && (
          <div className="mt-3 progress-bar">
            <div className="progress-fill" style={{ width: `${checklist.percentage}%`, background: color }} />
          </div>
        )}
      </div>

      {/* Items */}
      <div className="px-5 pb-2">
        {checklist.items.length === 0 ? (
          <p className="text-xs text-[#4d6080] py-4 text-center">No items yet.</p>
        ) : (
          checklist.items.map(item => (
            <ChecklistItemRow key={item.id} item={item} tripId={trip.id} color={color} />
          ))
        )}
      </div>

      {/* Add item */}
      <div className="px-5 pb-4">
        {adding ? (
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              placeholder="New item..."
              autoFocus
              className="form-input flex-1 text-sm py-2"
            />
            <button
              type="submit"
              disabled={isPending || !newItem.trim()}
              className="px-3 rounded-xl font-semibold text-xs bg-[#D4A017] text-[#0B1120] hover:bg-[#e8b832] transition-all disabled:opacity-60"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => { setAdding(false); setNewItem('') }}
              className="px-2 rounded-xl text-[#4d6080] hover:text-white text-xs"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-xs text-[#4d6080] hover:text-[#D4A017] transition-colors py-2 w-full"
          >
            <Plus className="w-3.5 h-3.5" />
            Add item
          </button>
        )}
      </div>
    </div>
  )
}

export default function ChecklistClient({ trip, checklists }: Props) {
  if (checklists.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-lg font-display font-semibold text-white mb-2">No checklists yet</h3>
        <p className="text-[#8ea3be] text-sm">Checklists are created automatically when you create a trip.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {checklists.map(cl => (
        <ChecklistCard key={cl.id} checklist={cl} trip={trip} />
      ))}
    </div>
  )
}
