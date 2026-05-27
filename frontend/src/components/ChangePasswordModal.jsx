import { useState } from 'react'
import { X, KeyRound } from 'lucide-react'
import { api } from '../lib/api'

export default function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.current_password || !form.new_password || !form.confirm_password) {
      setError('Please fill all password fields.')
      return
    }

    if (form.new_password !== form.confirm_password) {
      setError('New password and confirm password do not match.')
      return
    }

    setSaving(true)
    try {
      await api('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      setForm({ current_password: '', new_password: '', confirm_password: '' })
      onClose?.()
      onSuccess?.('Password changed successfully.')
    } catch (err) {
      setError(err?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[16px] bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-[20px] font-bold text-[#0f172a]">Change password</h3>
            <p className="mt-1 text-[13px] text-[#64748b]">Update your account password securely.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/[0.1] p-1.5 text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 sm:px-6">
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className="text-[12px] font-semibold text-[#0f172a]">Current password</span>
              <input
                type="password"
                value={form.current_password}
                onChange={(event) => updateField('current_password', event.target.value)}
                className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                placeholder="Enter current password"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[12px] font-semibold text-[#0f172a]">New password</span>
              <input
                type="password"
                value={form.new_password}
                onChange={(event) => updateField('new_password', event.target.value)}
                className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                placeholder="Enter new password"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[12px] font-semibold text-[#0f172a]">Confirm new password</span>
              <input
                type="password"
                value={form.confirm_password}
                onChange={(event) => updateField('confirm_password', event.target.value)}
                className="rounded-[10px] border border-black/[0.1] px-3 py-2.5 text-[13px] outline-none transition focus:border-[#5b3df6] focus:ring-2 focus:ring-[#5b3df6]/15"
                placeholder="Re-enter new password"
              />
            </label>

            {error ? <p className="text-[12px] text-red-600">{error}</p> : null}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[10px] border border-black/[0.1] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#0f172a] hover:bg-[#f8fafc] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-[10px] bg-[#5b3df6] px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#4a2ed8] disabled:opacity-60 transition-colors inline-flex items-center justify-center gap-1.5"
            >
              <KeyRound className="h-4 w-4" />
              {saving ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
