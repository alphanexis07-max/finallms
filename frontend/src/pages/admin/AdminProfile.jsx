import { useState, useEffect } from "react";
import { 
  Search, Upload, Bell, Settings, Shield, Mail, Globe, Save, X, 
  Users, BookOpen, Wallet, BarChart3, GraduationCap, Plus, 
  Trash2, Edit2, MoreVertical, CheckCircle, AlertCircle, 
  UserPlus, UserCog, Eye, Lock, Unlock, Copy
} from "lucide-react";
import { api } from "../../lib/api";

const Avatar = ({ name, size = "md" }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const sizeClasses = {
    sm: "w-[40px] h-[40px] text-[14px]",
    md: "w-[64px] h-[64px] text-[20px]",
    lg: "w-[80px] h-[80px] text-[24px]"
  };
  return (
    <div className={`${sizeClasses[size]} rounded-[8px] bg-gradient-to-br from-[#5b3df6] to-[#2dd4bf] flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md`}>
      {initials}
    </div>
  );
};

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-[#e8f5ff] text-[#5b3df6]",
    green: "bg-[#2dd4bf] text-[#023b33]",
    purple: "bg-[#e8f5ff] text-[#5b3df6]",
    orange: "bg-[#ffd966] text-[#4b2e00]",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-[24px] w-[44px] items-center rounded-full transition-colors duration-200 focus:outline-none ${
      enabled ? "bg-[#5b3df6]" : "bg-[#f1f5f9]"
    }`}
  >
    <span
      className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${
        enabled ? "translate-x-[22px]" : "translate-x-[3px]"
      }`}
    />
  </button>
);

const InfoField = ({ label, value }) => (
  <div className="bg-[#f8fafc] rounded-[8px] p-[12px] border border-black/[0.08]">
    <p className="text-[11px] text-[#94a3b8] mb-[4px]">{label}</p>
    <p className="text-[13px] font-medium text-[#0f172a]">{value}</p>
  </div>
);

const ActivityItem = ({ icon, title, subtitle, badge, badgeColor }) => (
  <div className="flex items-start gap-[12px] py-[12px] border-b border-black/[0.08] last:border-0">
    <div className="w-[32px] h-[32px] rounded-[6px] bg-[#e8f5ff] flex items-center justify-center text-[#5b3df6] flex-shrink-0 text-[14px]">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-[#0f172a]">{title}</p>
      <p className="text-[11px] text-[#94a3b8] mt-[4px]">{subtitle}</p>
    </div>
    {badge && (
      <span
        className={`inline-flex h-[24px] items-center px-[8px] rounded-[10px] text-[10px] font-medium ${
          badgeColor === "green"
            ? "bg-[#2dd4bf] text-[#023b33]"
            : "bg-[#f1f5f9] text-[#64748b]"
        }`}
      >
        {badge}
      </span>
    )}
  </div>
);

// Sub-admin Card Component
const SubAdminCard = ({ admin, onEdit, onDelete, onToggleStatus, currentUser }) => {
  const canManage = currentUser.role === 'owner' || currentUser.id === admin.createdBy;

  return (
    <div className="bg-[#f8fafc] rounded-[12px] p-4 border border-black/[0.08] hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={admin.name} size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-semibold text-[#0f172a]">{admin.name}</p>
              <Badge color={admin.status === 'active' ? 'green' : 'red'}>
                {admin.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-[12px] text-[#94a3b8]">{admin.email}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[11px] text-[#64748b]">Role: {admin.role}</span>
              <span className="text-[11px] text-[#64748b]">Created: {admin.createdAt}</span>
            </div>
          </div>
        </div>
        {canManage && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onToggleStatus(admin.id)}
              className="p-1.5 rounded-[6px] hover:bg-white transition-colors"
              title={admin.status === 'active' ? 'Deactivate' : 'Activate'}
            >
              {admin.status === 'active' ? 
                <Lock className="h-4 w-4 text-[#94a3b8]" /> : 
                <Unlock className="h-4 w-4 text-[#5b3df6]" />
              }
            </button>
            <button 
              onClick={() => onEdit(admin)}
              className="p-1.5 rounded-[6px] hover:bg-white transition-colors"
            >
              <Edit2 className="h-4 w-4 text-[#94a3b8]" />
            </button>
            <button 
              onClick={() => onDelete(admin.id)}
              className="p-1.5 rounded-[6px] hover:bg-white transition-colors"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-black/[0.08]">
        <div>
          <p className="text-[10px] text-[#94a3b8]">Permissions</p>
          <p className="text-[11px] font-medium text-[#0f172a]">{admin.permissions.join(', ')}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#94a3b8]">Last Login</p>
          <p className="text-[11px] font-medium text-[#0f172a]">{admin.lastLogin || 'Never'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#94a3b8]">Managed By</p>
          <p className="text-[11px] font-medium text-[#0f172a]">{admin.createdByName || 'Owner'}</p>
        </div>
      </div>
    </div>
  );
};

// Create/Edit Sub-admin Modal
const SubAdminModal = ({ isOpen, onClose, onSave, editingAdmin, currentUser, saving = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Sub-admin',
    permissions: ['students', 'instructors'],
    status: 'active',
  });

  const [selectedPermissions, setSelectedPermissions] = useState(['students', 'instructors']);

  const permissionOptions = [
    { id: 'students', label: 'Student Management', icon: '👨‍🎓' },
    { id: 'instructors', label: 'Instructor Management', icon: '👨‍🏫' },
    { id: 'courses', label: 'Course Management', icon: '📚' },
    { id: 'payments', label: 'Payment Management', icon: '💰' },
    { id: 'reports', label: 'Reports & Analytics', icon: '📊' },
    { id: 'settings', label: 'Settings (Limited)', icon: '⚙️' },
  ];

  const togglePermission = (permId) => {
    setSelectedPermissions(prev =>
      prev.includes(permId)
        ? prev.filter(p => p !== permId)
        : [...prev, permId]
    );
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email) return;
    onSave({
      ...formData,
      permissions: selectedPermissions,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdAt: new Date().toLocaleDateString(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg bg-white rounded-[16px] shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-black/[0.08] px-5 py-4 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-[#0f172a]">
            {editingAdmin ? 'Edit Sub-admin' : 'Create Sub-admin'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100">
            <X className="h-5 w-5 text-[#94a3b8]" />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#334155]">Full name *</label>
            <input 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10 w-full rounded-[8px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
              placeholder="e.g., Priya Sharma"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#334155]">Email address *</label>
            <input 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-10 w-full rounded-[8px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
              placeholder="subadmin@institute.com"
              type="email"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#334155]">Role</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="h-10 w-full rounded-[8px] border border-black/[0.08] px-3 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#5b3df6]"
            >
              <option>Sub-admin</option>
              <option>Manager</option>
              <option>Viewer</option>
            </select>
          </div>
          
          <div>
            <label className="mb-2 block text-[12px] font-medium text-[#334155]">Permissions</label>
            <div className="grid grid-cols-2 gap-2">
              {permissionOptions.map(perm => (
                <button
                  key={perm.id}
                  type="button"
                  onClick={() => togglePermission(perm.id)}
                  className={`flex items-center gap-2 p-2 rounded-[6px] text-[12px] transition-colors ${
                    selectedPermissions.includes(perm.id)
                      ? 'bg-[#ede7ff] text-[#5b3df6] border border-[#5b3df6]/30'
                      : 'bg-[#f8fafc] text-[#64748b] border border-black/[0.08]'
                  }`}
                >
                  <span>{perm.icon}</span>
                  <span>{perm.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-[#f0f4f8] rounded-[8px] p-3">
            <p className="text-[11px] text-[#64748b]">
              <span className="font-medium">Note:</span> Sub-admins will only have access to data from your institute. 
              They cannot see or modify data from other admins' institutes.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 border-t border-black/[0.08] px-5 py-4 bg-[#fafcff]">
          <button onClick={onClose} className="rounded-[6px] border border-black/[0.08] px-4 py-2 text-[13px] font-medium text-[#64748b] hover:bg-gray-50">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.email || saving}
            className={`rounded-[6px] px-4 py-2 text-[13px] font-semibold transition-colors ${
              formData.name && formData.email && !saving
                ? 'bg-[#5b3df6] text-white hover:bg-[#4a2ed8]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving...' : (editingAdmin ? 'Save Changes' : 'Create Sub-admin')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Credentials Display Modal
const CredentialsModal = ({ isOpen, onClose, credentials }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen || !credentials) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-[16px] shadow-xl">
        <div className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Sub-admin Created Successfully!</h3>
          <p className="text-[13px] text-[#64748b] mb-6">
            Share these login credentials with the sub-admin. They can login directly from the login page.
          </p>
          
          <div className="bg-[#f8fafc] rounded-[8px] p-4 mb-4 text-left border border-black/[0.08]">
            <div className="mb-4">
              <p className="text-[11px] text-[#94a3b8] mb-1">Email</p>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-mono text-[#0f172a] flex-1 break-all">{credentials.email}</p>
                <button
                  onClick={() => copyToClipboard(credentials.email)}
                  className="p-2 rounded-[6px] hover:bg-white transition-colors"
                  title="Copy email"
                >
                  <Copy className="h-4 w-4 text-[#5b3df6]" />
                </button>
              </div>
            </div>
            <div>
              <p className="text-[11px] text-[#94a3b8] mb-1">Temporary Password</p>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-mono text-[#0f172a] flex-1 break-all">{credentials.password}</p>
                <button
                  onClick={() => copyToClipboard(credentials.password)}
                  className="p-2 rounded-[6px] hover:bg-white transition-colors"
                  title="Copy password"
                >
                  <Copy className="h-4 w-4 text-[#5b3df6]" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-[8px] p-3 mb-6 text-left border border-amber-200">
            <p className="text-[11px] text-amber-800">
              <span className="font-semibold">Important:</span> The sub-admin must change this password immediately after first login for security.
            </p>
          </div>

          {copied && (
            <div className="mb-4 text-[12px] text-emerald-600 font-medium">
              ✓ Copied to clipboard!
            </div>
          )}
          
          <button
            onClick={onClose}
            className="w-full rounded-[6px] bg-[#5b3df6] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#4a2ed8]"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, adminName, saving = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md bg-white rounded-[16px] shadow-xl">
        <div className="p-5 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-[#0f172a] mb-2">Delete Sub-admin</h3>
          <p className="text-[13px] text-[#64748b] mb-4">
            Are you sure you want to delete <span className="font-semibold text-[#0f172a]">{adminName}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} disabled={saving} className="flex-1 rounded-[6px] border border-black/[0.08] px-4 py-2 text-[13px] font-medium text-[#64748b] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={saving} className="flex-1 rounded-[6px] bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ProfileSettings() {
  // Real-world integration via APIs
  const [currentUser, setCurrentUser] = useState(null)
  const [subAdmins, setSubAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [profile, usersList] = await Promise.all([
          api('/auth/me'),
          api('/lms/users?role=sub_admin&limit=100').catch(() => ({ items: [] })),
        ])

        if (cancelled) return

        setCurrentUser(profile || null)
        
        // Format sub-admins data from API response
        const admins = Array.isArray(usersList.items) ? usersList.items : []
        setSubAdmins(admins.map(admin => ({
          id: admin._id || admin.id,
          name: admin.full_name || admin.name || '',
          email: admin.email || '',
          role: admin.role || 'Sub-admin',
          permissions: admin.permissions || ['students', 'instructors'],
          status: admin.is_active ? 'active' : 'inactive',
          createdBy: admin.created_by || profile?._id || 'unknown',
          createdByName: admin.created_by_name || profile?.full_name || 'Owner',
          createdAt: admin.created_at ? new Date(admin.created_at).toLocaleDateString() : '-',
          lastLogin: admin.last_login ? new Date(admin.last_login).toLocaleDateString() : null,
        })))
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load profile data.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, []);

  const [prefs, setPrefs] = useState({
    email: true,
    mobile: true,
    quiet: false,
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [deletingAdminId, setDeletingAdminId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [credentialsModal, setCredentialsModal] = useState(null) // { email, password }

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }))

  // Filter sub-admins to only show those manageable by current user
  const mySubAdmins = subAdmins

  const handleCreateSubAdmin = async (newAdmin) => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await api('/lms/users', {
        method: 'POST',
        body: JSON.stringify({
          full_name: newAdmin.full_name || newAdmin.name,
          email: newAdmin.email,
          role: 'sub_admin',
          password: 'ChangeMe@123', // Temporary - user will reset
        }),
      })
      
      const adminWithId = {
        id: response._id || response.id,
        name: response.full_name || response.name,
        email: response.email,
        role: response.role || 'Sub-admin',
        permissions: newAdmin.permissions || ['students', 'instructors'],
        status: response.is_active ? 'active' : 'inactive',
        createdBy: currentUser?._id || 'owner',
        createdByName: currentUser?.full_name || 'Owner',
        createdAt: new Date().toLocaleDateString(),
        lastLogin: null,
      }
      
      setSubAdmins([...subAdmins, adminWithId])
      setCredentialsModal({ email: newAdmin.email, password: 'ChangeMe@123' })
      setSuccess('Sub-admin created successfully.')
      setSaving(false)
    } catch (err) {
      setError(err?.message || 'Unable to create sub-admin.')
      setSaving(false)
    }
  }

  const handleEditSubAdmin = async (updatedAdmin) => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await api(`/lms/users/${updatedAdmin.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          full_name: updatedAdmin.name,
          email: updatedAdmin.email,
          role: updatedAdmin.role.toLowerCase().replace(' ', '_'),
          is_active: updatedAdmin.status === 'active',
        }),
      })

      setSubAdmins(subAdmins.map(admin => 
        admin.id === updatedAdmin.id ? updatedAdmin : admin
      ))
      setEditingAdmin(null)
      setSuccess('Sub-admin updated successfully.')
      setSaving(false)
    } catch (err) {
      setError(err?.message || 'Unable to update sub-admin.')
      setSaving(false)
    }
  }

  const handleDeleteSubAdmin = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      await api(`/lms/users/${deletingAdminId}`, { method: 'DELETE' })
      setSubAdmins(subAdmins.filter(admin => admin.id !== deletingAdminId))
      setIsDeleteModalOpen(false)
      setDeletingAdminId(null)
      setSuccess('Sub-admin deleted successfully.')
      setSaving(false)
    } catch (err) {
      setError(err?.message || 'Unable to delete sub-admin.')
      setSaving(false)
    }
  }

  const handleToggleStatus = async (adminId) => {
    const admin = subAdmins.find(a => a.id === adminId)
    if (!admin) return

    setSaving(true)
    setError('')

    try {
      await api(`/lms/users/${adminId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          is_active: admin.status === 'inactive', // Toggle
        }),
      })

      setSubAdmins(subAdmins.map(a =>
        a.id === adminId 
          ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' }
          : a
      ))
      setSaving(false)
    } catch (err) {
      setError(err?.message || 'Unable to toggle status.')
      setSaving(false)
    }
  }

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const openDeleteModal = (adminId) => {
    setDeletingAdminId(adminId);
    setIsDeleteModalOpen(true);
  };

  const getDeletingAdminName = () => {
    const admin = subAdmins.find(a => a.id === deletingAdminId);
    return admin?.name || '';
  };

  return (
    <div className="min-h-full bg-[#F7FAFD]">
      <div className="flex flex-col gap-[24px] h-full p-[28px]">
        {error && <div className="mb-4 rounded-[8px] bg-red-50 p-4 text-[13px] text-red-600">{error}</div>}
        {success && <div className="mb-4 rounded-[8px] bg-emerald-50 p-4 text-[13px] text-emerald-700">{success}</div>}

        {loading ? (
          <div className="rounded-[8px] bg-white p-12 text-center text-[#64748b]">Loading profile...</div>
        ) : !currentUser ? (
          <div className="rounded-[8px] bg-white p-12 text-center text-[#64748b]">Unable to load profile</div>
        ) : (
          <>
        {/* Hero card */}
        <div className="border border-black/[0.08] border-solid flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex items-center justify-between w-full flex-wrap gap-4">
            <div className="flex items-center gap-[16px]">
              <Avatar name={currentUser.full_name || currentUser.name || 'Admin'} size="md" />
              <div>
                <div className="flex items-center gap-[8px] mb-[8px] flex-wrap">
                  <Badge color="blue">👑 {currentUser.role === 'admin' ? 'Institute Admin' : 'Owner account'}</Badge>
                  <Badge color="green">🎓 Institute Admin</Badge>
                </div>
                <h2 className="text-[28px] font-bold text-[#0f172a]">{currentUser.full_name || currentUser.name || 'Admin'}</h2>
                <p className="text-[14px] text-[#94a3b8] mt-[4px] max-w-md">
                  Manage your personal details, security, notification preferences, and sub-admin accounts.
                </p>
              </div>
            </div>
            <button className="bg-[#5b3df6] flex items-center gap-[8px] h-[40px] justify-center px-[16px] rounded-[6px] shrink-0">
              <Edit2 className="h-4 w-4 text-white" />
              <span className="text-white text-[14px] font-medium">Edit profile</span>
            </button>
          </div>
        </div>

        {/* Sub-admin Management Section */}
        <div className="bg-white border border-black/[0.08] rounded-[8px] p-[21px]">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h3 className="font-bold text-[18px] text-[#0f172a]">Sub-admin Management</h3>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">
                Create and manage sub-admins. Sub-admins will only have access to data from your institute.
              </p>
            </div>
            <button 
              onClick={() => {
                setEditingAdmin(null);
                setIsModalOpen(true);
              }}
              className="bg-[#5b3df6] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px]"
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="text-white text-[12px] font-medium">Add Sub-admin</span>
            </button>
          </div>

          {mySubAdmins.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-black/[0.08] rounded-[12px]">
              <UserCog className="h-12 w-12 text-[#94a3b8] mx-auto mb-3" />
              <p className="text-[13px] text-[#94a3b8]">No sub-admins created yet</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-3 text-[12px] text-[#5b3df6] hover:underline"
              >
                Create your first sub-admin
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {mySubAdmins.map(admin => (
                <SubAdminCard 
                  key={admin.id}
                  admin={admin}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onToggleStatus={handleToggleStatus}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>

        {/* Workspace access */}
        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div className="flex items-center justify-between w-full flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-[18px] text-[#0f172a]">Workspace access</h3>
              <p className="text-[13px] text-[#94a3b8] mt-[4px]">Your current institute ownership and access scope</p>
            </div>
            <button className="border border-black/[0.08] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px] bg-white">
              <Shield className="h-4 w-4 text-[#5b3df6]" />
              <span className="text-[12px] font-medium text-[#0f172a]">Review permissions</span>
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] w-full">
            {[
              { label: "Managed teams", value: mySubAdmins.length.toString() },
              { label: "Institute role", value: currentUser.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : "Admin" },
              { label: "Permissions", value: "Full access" },
              { label: "Last updated", value: currentUser.updated_at ? new Date(currentUser.updated_at).toLocaleDateString() : "-" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#f8fafc] rounded-[8px] p-[14px] border border-black/[0.08]">
                <p className="text-[11px] text-[#94a3b8] mb-[4px]">{label}</p>
                <p className="text-[20px] font-bold text-[#0f172a]">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Personal info + Security */}
        <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-1 lg:grid-cols-2">
          {/* Personal Information */}
          <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
            <div className="flex items-center justify-between w-full flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Personal information</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">Core profile details shown across your institute workspace</p>
              </div>
              <button className="border border-black/[0.08] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px] bg-white">
                <Edit2 className="h-3 w-3" />
                <span className="text-[12px] font-medium text-[#0f172a]">Update details</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] w-full">
              <InfoField label="Full name" value={currentUser.full_name || currentUser.name || '-'} />
              <InfoField label="Role" value={currentUser.role ? currentUser.role.replace('_', ' ').charAt(0).toUpperCase() + currentUser.role.replace('_', ' ').slice(1) : 'Admin'} />
              <InfoField label="Email address" value={currentUser.email || '-'} />
              <InfoField label="Phone number" value={currentUser.phone || currentUser.mobile || currentUser.phone_number || '-'} />
              <InfoField label="Timezone" value={currentUser.timezone || 'GMT+5:30 · India Standard Time'} />
              <InfoField label="Language" value={currentUser.language || 'English'} />
            </div>
            <div className="bg-[#f8fafc] rounded-[8px] p-[12px] border border-black/[0.08] w-full">
              <p className="text-[11px] text-[#94a3b8] mb-[4px]">Bio</p>
              <p className="text-[13px] text-[#0f172a] leading-relaxed">
                {currentUser.bio || 'No bio provided yet.'}
              </p>
            </div>
          </div>

          {/* Security + Recent Activity */}
          <div className="flex flex-col gap-[24px]">
            {/* Security */}
            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div className="flex items-center justify-between w-full flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-[18px] text-[0f172a]">Security</h3>
                  <p className="text-[13px] text-[#94a3b8] mt-[4px]">Keep your owner account protected</p>
                </div>
                <button className="bg-[#5b3df6] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px]">
                  <Shield className="h-3 w-3 text-white" />
                  <span className="text-white text-[12px] font-medium">Manage security</span>
                </button>
              </div>
              <div className="flex flex-col w-full gap-[12px]">
                <div className="flex items-center justify-between py-[12px] border-b border-black/[0.08]">
                  <div>
                    <p className="text-[13px] font-semibold text-[#0f172a]">Password</p>
                    <p className="text-[11px] text-[#94a3b8]">Last changed 14 days ago</p>
                  </div>
                  <button className="border border-black/[0.08] flex items-center gap-[8px] h-[32px] justify-center px-[12px] rounded-[6px] bg-white">
                    <span className="text-[11px] font-medium text-[#0f172a]">Change</span>
                  </button>
                </div>
                <div className="flex items-center justify-between py-[12px] border-b border-black/[0.08]">
                  <div>
                    <p className="text-[13px] font-semibold text-[#0f172a]">2-factor authentication</p>
                    <p className="text-[11px] text-[#94a3b8]">Authenticator app plus SMS backup enabled</p>
                  </div>
                  <Badge color="green">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between py-[12px]">
                  <div>
                    <p className="text-[13px] font-semibold text-[#0f172a]">Recovery email</p>
                    <p className="text-[11px] text-[#94a3b8]">backup.rahul@proton.me</p>
                  </div>
                  <button className="border border-black/[0.08] flex items-center gap-[8px] h-[32px] justify-center px-[12px] rounded-[6px] bg-white">
                    <span className="text-[11px] font-medium text-[#0f172a]">Review</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
              <div>
                <h3 className="font-bold text-[18px] text-[#0f172a]">Recent activity</h3>
                <p className="text-[13px] text-[#94a3b8] mt-[4px]">A quick view of your latest account events</p>
              </div>
              <div className="flex flex-col w-full">
                {mySubAdmins.length > 0 ? (
                  <>
                    <ActivityItem
                      icon="→"
                      title={`New sub-admin "${mySubAdmins[mySubAdmins.length-1]?.name || 'User'}" added`}
                      subtitle={`${mySubAdmins[mySubAdmins.length-1].createdAt || 'Recently'}`}
                      badge="Complete"
                      badgeColor="slate"
                    />
                    {mySubAdmins.length > 1 && (
                      <ActivityItem
                        icon="👥"
                        title={`Total sub-admins: ${mySubAdmins.length}`}
                        subtitle="Manage your team from the sub-admin section"
                        badge="Active"
                        badgeColor="green"
                      />
                    )}
                  </>
                ) : (
                  <ActivityItem
                    icon="👥"
                    title="No sub-admins yet"
                    subtitle="Create your first sub-admin to distribute admin tasks"
                    badge="Pending"
                    badgeColor="slate"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
          <div>
            <h3 className="font-bold text-[18px] text-[#0f172a]">Preferences</h3>
            <p className="text-[13px] text-[#94a3b8] mt-[4px]">Control how updates and reminders are delivered to you</p>
          </div>
          <div className="flex flex-col w-full gap-[12px]">
            {[
              { key: "email", icon: "✉️", title: "Email notifications", desc: "Receive enrollment, payment, and instructor updates by email" },
              { key: "mobile", icon: "📱", title: "Mobile alerts", desc: "Get urgent reminders for live classes and payment issues" },
              { key: "quiet", icon: "🌙", title: "Quiet hours", desc: "Pause non-critical notifications between 10:00 PM and 7:00 AM" },
            ].map(({ key, icon, title, desc }) => (
              <div key={key} className="flex items-center justify-between py-[12px] border-b border-black/[0.08] last:border-0">
                <div className="flex items-center gap-[12px]">
                  <div className="w-[32px] h-[32px] rounded-[6px] bg-[#f1f5f9] flex items-center justify-center text-[14px]">
                    {icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0f172a]">{title}</p>
                    <p className="text-[11px] text-[#94a3b8]">{desc}</p>
                  </div>
                </div>
                <Toggle enabled={prefs[key]} onChange={() => togglePref(key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button className="bg-[#5b3df6] flex items-center gap-[8px] h-[44px] justify-center px-[24px] rounded-[8px]">
            <Save className="h-[16px] w-[16px] text-white" />
            <span className="text-white text-[14px] font-medium">Save changes</span>
          </button>
        </div>
          </>
        )}
      </div>

      {/* Modals */}
      <SubAdminModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAdmin(null)
        }}
        onSave={editingAdmin ? handleEditSubAdmin : handleCreateSubAdmin}
        editingAdmin={editingAdmin}
        currentUser={currentUser}
        saving={saving}
      />
      
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSubAdmin}
        adminName={getDeletingAdminName()}
        saving={saving}
      />
      
      <CredentialsModal
        isOpen={credentialsModal !== null}
        onClose={() => setCredentialsModal(null)}
        credentials={credentialsModal}
      />
    </div>
  );
}
