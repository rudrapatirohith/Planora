'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2, Trash2, Edit2, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { createExpense, updateExpense, deleteExpense, createBudgetCategory, updateBudgetCategory } from '@/app/actions/budget'
import { CURRENCIES, CHART_COLORS } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Trip } from '@/types/database'
import type { ExpenseWithCategory, BudgetCategoryWithStats } from '@/types/app'

interface Props {
  trip: Trip
  expenses: ExpenseWithCategory[]
  categories: BudgetCategoryWithStats[]
}

// ==================== Expense Modal ====================

function ExpenseModal({
  tripId,
  tripCurrency,
  categories,
  onClose,
  existing,
}: {
  tripId: string
  tripCurrency: string
  categories: BudgetCategoryWithStats[]
  onClose: () => void
  existing?: ExpenseWithCategory
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    fd.append('trip_id', tripId)

    startTransition(async () => {
      const result = existing
        ? await updateExpense(existing.id, fd)
        : await createExpense(fd)
      if (result.success) { onClose(); router.refresh() }
      else setError(result.error || 'Failed to save')
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[#111827] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold text-white">{existing ? 'Edit Expense' : 'Add Expense'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#4d6080] hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Title *</label>
            <input name="title" defaultValue={existing?.title} required placeholder="e.g. Hotel dinner" className="form-input w-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Amount *</label>
              <input name="amount" type="number" defaultValue={existing?.amount} required min="0" step="0.01" placeholder="0.00" className="form-input w-full" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Currency</label>
              <select name="currency" defaultValue={existing?.currency || tripCurrency} className="form-input w-full">
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Date *</label>
            <input name="date" type="date" defaultValue={existing?.date || new Date().toISOString().split('T')[0]} required className="form-input w-full" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Category</label>
            <select name="category_id" defaultValue={existing?.category_id || ''} className="form-input w-full">
              <option value="">— No category —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Paid by</label>
            <input name="paid_by" defaultValue={existing?.paid_by || ''} placeholder="Your name" className="form-input w-full" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#8ea3be] mb-1.5">Notes</label>
            <textarea name="notes" defaultValue={existing?.notes || ''} rows={2} className="form-input w-full resize-none" />
          </div>

          {error && <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={isPending} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-bold text-sm hover:bg-[#e8b832] transition-all disabled:opacity-60">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {existing ? 'Save' : 'Add Expense'}
            </button>
            <button type="button" onClick={onClose} className="px-4 rounded-xl border border-[rgba(30,45,69,0.8)] text-[#8ea3be] text-sm hover:text-white transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== Main Client ====================

export default function BudgetClient({ trip, expenses, categories }: Props) {
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | undefined>()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalBudget = trip.total_budget || 0
  const budgetPct = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0
  const remaining = totalBudget - totalSpent

  // Pie chart data
  const pieData = categories
    .filter(c => c.actual_amount > 0)
    .map((c, i) => ({ name: c.name, value: c.actual_amount, color: c.color || CHART_COLORS[i % CHART_COLORS.length] }))

  const uncategorized = expenses.filter(e => !e.category_id).reduce((s, e) => s + e.amount, 0)
  if (uncategorized > 0) pieData.push({ name: 'Other', value: uncategorized, color: '#6b7280' })

  function handleDeleteExpense(id: string) {
    startTransition(async () => {
      await deleteExpense(id, trip.id)
      router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      {/* Budget summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: formatCurrency(totalBudget, trip.currency), icon: DollarSign, color: '#D4A017', sub: totalBudget > 0 ? `${budgetPct}% used` : 'Not set' },
          { label: 'Total Spent', value: formatCurrency(totalSpent, trip.currency), icon: totalSpent > totalBudget && totalBudget > 0 ? TrendingDown : TrendingUp, color: totalSpent > totalBudget && totalBudget > 0 ? '#ef4444' : '#10b981', sub: `${expenses.length} expenses` },
          { label: totalBudget > 0 ? 'Remaining' : 'Avg / Day', value: totalBudget > 0 ? formatCurrency(remaining, trip.currency) : '—', icon: totalBudget > 0 && remaining < 0 ? AlertTriangle : DollarSign, color: totalBudget > 0 && remaining < 0 ? '#ef4444' : '#0891B2', sub: totalBudget > 0 && remaining < 0 ? 'Over budget!' : '' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl font-display font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-sm text-[#8ea3be]">{stat.label}</div>
              {stat.sub && <div className="text-xs text-[#4d6080] mt-0.5">{stat.sub}</div>}
            </div>
          )
        })}
      </div>

      {/* Overall budget bar */}
      {totalBudget > 0 && (
        <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-[#8ea3be]">Budget progress</span>
            <span className={`font-semibold ${budgetPct > 90 ? 'text-red-400' : 'text-[#8ea3be]'}`}>{budgetPct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{
              width: `${budgetPct}%`,
              background: budgetPct > 90 ? '#ef4444' : budgetPct > 70 ? '#f59e0b' : '#10b981',
            }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-5">
            <h2 className="text-base font-display font-semibold text-white mb-4">Categories</h2>
            <div className="space-y-3">
              {categories.map(cat => (
                <div key={cat.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                      <span className="text-white font-medium">{cat.name}</span>
                      {cat.isOverBudget && <AlertTriangle className="w-3 h-3 text-red-400" />}
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${cat.isOverBudget ? 'text-red-400' : 'text-[#8ea3be]'}`}>
                        {formatCurrency(cat.actual_amount, trip.currency)}
                      </span>
                      {cat.planned_amount > 0 && (
                        <span className="text-[#4d6080] text-xs ml-1">/ {formatCurrency(cat.planned_amount, trip.currency)}</span>
                      )}
                    </div>
                  </div>
                  {cat.planned_amount > 0 && (
                    <div className="progress-bar" style={{ height: 4 }}>
                      <div className="progress-fill" style={{
                        width: `${Math.min(100, cat.percentage)}%`,
                        background: cat.isOverBudget ? '#ef4444' : cat.color,
                      }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pie chart */}
        {pieData.length > 0 && (
          <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm p-5">
            <h2 className="text-base font-display font-semibold text-white mb-4">Spending Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0), trip.currency), '']}
                  contentStyle={{ background: '#111827', border: '1px solid rgba(30,45,69,0.8)', borderRadius: 10, fontSize: 12 }}
                />
                <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11, color: '#8ea3be' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Expense table */}
      <div className="rounded-2xl border border-[rgba(30,45,69,0.8)] bg-[rgba(20,29,46,0.6)] backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[rgba(30,45,69,0.6)]">
          <h2 className="text-base font-display font-semibold text-white">Expenses</h2>
          <button
            onClick={() => { setEditingExpense(undefined); setShowExpenseModal(true) }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#D4A017] text-[#0B1120] font-semibold text-sm hover:bg-[#e8b832] transition-all hover:-translate-y-px"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-3">💸</div>
            <p className="text-[#8ea3be] text-sm mb-4">No expenses yet. Start tracking your spending.</p>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4A017] text-[#0B1120] font-semibold text-sm hover:bg-[#e8b832] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add first expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Paid By</th>
                  <th className="text-right">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} className="group">
                    <td className="text-[#8ea3be] whitespace-nowrap text-xs">{formatDate(exp.date)}</td>
                    <td className="font-medium text-white text-sm">{exp.title}</td>
                    <td>
                      {exp.category ? (
                        <span className="flex items-center gap-1.5 text-xs">
                          <div className="w-2 h-2 rounded-full" style={{ background: exp.category.color }} />
                          <span className="text-[#8ea3be]">{exp.category.name}</span>
                        </span>
                      ) : <span className="text-[#4d6080] text-xs">—</span>}
                    </td>
                    <td className="text-[#8ea3be] text-xs">{exp.paid_by || '—'}</td>
                    <td className="text-right font-semibold text-white text-sm">{formatCurrency(exp.amount, exp.currency)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditingExpense(exp); setShowExpenseModal(true) }}
                          className="p-1.5 rounded-lg text-[#4d6080] hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg text-[#4d6080] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Expense modal */}
      {showExpenseModal && (
        <ExpenseModal
          tripId={trip.id}
          tripCurrency={trip.currency}
          categories={categories}
          onClose={() => { setShowExpenseModal(false); setEditingExpense(undefined) }}
          existing={editingExpense}
        />
      )}
    </div>
  )
}
