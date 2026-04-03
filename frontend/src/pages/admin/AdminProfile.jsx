// import { useState } from "react";
// import { Search, Upload, Bell, Settings, Shield, Mail, Globe, Save, X, Users, BookOpen, Wallet, BarChart3, GraduationCap } from "lucide-react";

// const Avatar = () => (
//   <div className="w-[64px] h-[64px] rounded-[8px] bg-gradient-to-br from-[#5b3df6] to-[#2dd4bf] flex items-center justify-center text-white text-[20px] font-bold flex-shrink-0 shadow-md">
//     RM
//   </div>
// );

// const Badge = ({ children, color = "blue" }) => {
//   const colors = {
//     blue: "bg-[#e8f5ff] text-[#5b3df6]",
//     green: "bg-[#2dd4bf] text-[#023b33]",
//     purple: "bg-[#e8f5ff] text-[#5b3df6]",
//   };
//   return (
//     <span className={`inline-flex h-[28px] items-center px-[10px] rounded-[12px] text-[12px] font-medium ${colors[color]}`}>
//       {children}
//     </span>
//   );
// };

// const Toggle = ({ enabled, onChange }) => (
//   <button
//     onClick={() => onChange(!enabled)}
//     className={`relative inline-flex h-[24px] w-[44px] items-center rounded-full transition-colors duration-200 focus:outline-none ${
//       enabled ? "bg-[#5b3df6]" : "bg-[#f1f5f9]"
//     }`}
//   >
//     <span
//       className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform duration-200 ${
//         enabled ? "translate-x-[22px]" : "translate-x-[3px]"
//       }`}
//     />
//   </button>
// );

// const InfoField = ({ label, value }) => (
//   <div className="bg-[#f8fafc] rounded-[8px] p-[12px] border border-black/[0.08]">
//     <p className="text-[11px] text-[#94a3b8] mb-[4px]">{label}</p>
//     <p className="text-[13px] font-medium text-[#0f172a]">{value}</p>
//   </div>
// );

// const ActivityItem = ({ icon, title, subtitle, badge, badgeColor }) => (
//   <div className="flex items-start gap-[12px] py-[12px] border-b border-black/[0.08] last:border-0">
//     <div className="w-[32px] h-[32px] rounded-[6px] bg-[#e8f5ff] flex items-center justify-center text-[#5b3df6] flex-shrink-0 text-[14px]">
//       {icon}
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="text-[13px] font-semibold text-[#0f172a]">{title}</p>
//       <p className="text-[11px] text-[#94a3b8] mt-[4px]">{subtitle}</p>
//     </div>
//     {badge && (
//       <span
//         className={`inline-flex h-[24px] items-center px-[8px] rounded-[10px] text-[10px] font-medium ${
//           badgeColor === "green"
//             ? "bg-[#2dd4bf] text-[#023b33]"
//             : "bg-[#f1f5f9] text-[#64748b]"
//         }`}
//       >
//         {badge}
//       </span>
//     )}
//   </div>
// );

// export default function ProfileSettings() {
//   const [prefs, setPrefs] = useState({
//     email: true,
//     mobile: true,
//     quiet: false,
//   });

//   const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

//   return (
//     <div className="min-h-full bg-[#F7FAFD]">
//       <div className="bg-gradient-to-b flex flex-col from-[#f6f8fa] gap-[24px] h-full p-[28px] to-[#f7fcff]">
//         {/* Hero card */}
//         <div className="border border-black/[0.08] border-solid content-stretch flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
//           <div className="flex items-center justify-between w-full">
//             <div className="flex items-center gap-[16px]">
//               <Avatar />
//               <div>
//                 <div className="flex items-center gap-[8px] mb-[8px]">
//                   <Badge color="blue">🛡 Owner account</Badge>
//                 </div>
//                 <h2 className="text-[28px] font-bold text-[#0f172a]">Rahul Mehta</h2>
//                 <p className="text-[14px] text-[#94a3b8] mt-[4px] max-w-md">
//                   Manage your personal details, security, notification preferences, and account visibility across the institute workspace.
//                 </p>
//               </div>
//             </div>
//             <button className="bg-[#5b3df6] flex items-center gap-[8px] h-[40px] justify-center px-[16px] rounded-[6px] shrink-0">
//               <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-white text-[14px]">✏️ Edit profile</div>
//             </button>
//           </div>
//         </div>

//         {/* Workspace access */}
//         <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
//           <div className="flex items-center justify-between w-full">
//             <div>
//               <h3 className="font-bold text-[18px] text-[#0f172a]">Workspace access</h3>
//               <p className="text-[13px] text-[#94a3b8] mt-[4px]">Your current institute ownership and access scope</p>
//             </div>
//             <button className="border border-black/[0.08] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px] bg-white">
//               <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#0f172a] text-[12px]">Review permissions</div>
//             </button>
//           </div>
//           <div className="grid grid-cols-4 gap-[16px] w-full">
//             {[
//               { label: "Managed teams", value: "6" },
//               { label: "Institute role", value: "Owner" },
//               { label: "Permissions", value: "Full access" },
//               { label: "Last updated", value: "2d ago" },
//             ].map(({ label, value }) => (
//               <div key={label} className="bg-[#f8fafc] rounded-[8px] p-[14px] border border-black/[0.08]">
//                 <p className="text-[11px] text-[#94a3b8] mb-[4px]">{label}</p>
//                 <p className="text-[20px] font-bold text-[#0f172a]">{value}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Personal info + Security */}
//         <div className="gap-x-[24px] gap-y-[24px] grid grid-cols-2">
//           {/* Personal Information */}
//           <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
//             <div className="flex items-center justify-between w-full">
//               <div>
//                 <h3 className="font-bold text-[18px] text-[#0f172a]">Personal information</h3>
//                 <p className="text-[13px] text-[#94a3b8] mt-[4px]">Core profile details shown across your institute workspace</p>
//               </div>
//               <button className="border border-black/[0.08] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px] bg-white">
//                 <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-[#0f172a] text-[12px]">Update details</div>
//               </button>
//             </div>
//             <div className="grid grid-cols-2 gap-[12px] w-full">
//               <InfoField label="Full name" value="Rahul Mehta" />
//               <InfoField label="Role" value="Institute Owner" />
//               <InfoField label="Email address" value="rahul.mehta@lmsinstitute.com" />
//               <InfoField label="Phone number" value="+91 98765 43210" />
//               <InfoField label="Timezone" value="GMT+5:30 · India Standard Time" />
//               <InfoField label="Language" value="English" />
//             </div>
//             <div className="bg-[#f8fafc] rounded-[8px] p-[12px] border border-black/[0.08] w-full">
//               <p className="text-[11px] text-[#94a3b8] mb-[4px]">Bio</p>
//               <p className="text-[13px] text-[#0f172a] leading-relaxed">
//                 Leading operations, admissions, and curriculum growth for the institute. Focused on scaling student success and instructor quality.
//               </p>
//             </div>
//           </div>

//           {/* Security + Recent Activity */}
//           <div className="flex flex-col gap-[24px]">
//             {/* Security */}
//             <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
//               <div className="flex items-center justify-between w-full">
//                 <div>
//                   <h3 className="font-bold text-[18px] text-[#0f172a]">Security</h3>
//                   <p className="text-[13px] text-[#94a3b8] mt-[4px]">Keep your owner account protected</p>
//                 </div>
//                 <button className="bg-[#5b3df6] flex items-center gap-[8px] h-[36px] justify-center px-[14px] rounded-[6px]">
//                   <div className="flex flex-col font-medium h-[15px] justify-center leading-[0] text-white text-[12px]">Manage security</div>
//                 </button>
//               </div>
//               <div className="flex flex-col w-full gap-[12px]">
//                 <div className="flex items-center justify-between py-[12px] border-b border-black/[0.08]">
//                   <div>
//                     <p className="text-[13px] font-semibold text-[#0f172a]">Password</p>
//                     <p className="text-[11px] text-[#94a3b8]">Last changed 14 days ago</p>
//                   </div>
//                   <button className="border border-black/[0.08] flex items-center gap-[8px] h-[32px] justify-center px-[12px] rounded-[6px] bg-white">
//                     <div className="flex flex-col font-medium h-[13px] justify-center leading-[0] text-[#0f172a] text-[11px]">Change</div>
//                   </button>
//                 </div>
//                 <div className="flex items-center justify-between py-[12px] border-b border-black/[0.08]">
//                   <div>
//                     <p className="text-[13px] font-semibold text-[#0f172a]">2-factor authentication</p>
//                     <p className="text-[11px] text-[#94a3b8]">Authenticator app plus SMS backup enabled</p>
//                   </div>
//                   <span className="inline-flex h-[24px] items-center px-[8px] rounded-[10px] text-[10px] font-medium bg-[#2dd4bf] text-[#023b33]">Enabled</span>
//                 </div>
//                 <div className="flex items-center justify-between py-[12px]">
//                   <div>
//                     <p className="text-[13px] font-semibold text-[#0f172a]">Recovery email</p>
//                     <p className="text-[11px] text-[#94a3b8]">backup.rahul@proton.me</p>
//                   </div>
//                   <button className="border border-black/[0.08] flex items-center gap-[8px] h-[32px] justify-center px-[12px] rounded-[6px] bg-white">
//                     <div className="flex flex-col font-medium h-[13px] justify-center leading-[0] text-[#0f172a] text-[11px]">Review</div>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
//               <div>
//                 <h3 className="font-bold text-[18px] text-[#0f172a]">Recent activity</h3>
//                 <p className="text-[13px] text-[#94a3b8] mt-[4px]">A quick view of your latest account events</p>
//               </div>
//               <div className="flex flex-col w-full">
//                 <ActivityItem
//                   icon="→"
//                   title="New login from Mumbai"
//                   subtitle="Today · 9:12 AM · Chrome on macOS"
//                   badge="Approved"
//                   badgeColor="green"
//                 />
//                 <ActivityItem
//                   icon="🔒"
//                   title="2-factor check completed"
//                   subtitle="Yesterday · 7:48 PM · Authenticator code accepted"
//                   badge="Logged"
//                   badgeColor="slate"
//                 />
//                 <ActivityItem
//                   icon="✉️"
//                   title="Primary email verified"
//                   subtitle="Aug 18 · Verification completed successfully"
//                   badge="Complete"
//                   badgeColor="slate"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Preferences */}
//         <div className="bg-white border border-black/[0.08] border-solid flex flex-col gap-[16px] items-start p-[21px] rounded-[8px]">
//           <div>
//             <h3 className="font-bold text-[18px] text-[#0f172a]">Preferences</h3>
//             <p className="text-[13px] text-[#94a3b8] mt-[4px]">Control how updates and reminders are delivered to you</p>
//           </div>
//           <div className="flex flex-col w-full gap-[12px]">
//             {[
//               {
//                 key: "email",
//                 icon: "✉️",
//                 title: "Email notifications",
//                 desc: "Receive enrollment, payment, and instructor updates by email",
//               },
//               {
//                 key: "mobile",
//                 icon: "📱",
//                 title: "Mobile alerts",
//                 desc: "Get urgent reminders for live classes and payment issues",
//               },
//               {
//                 key: "quiet",
//                 icon: "🌙",
//                 title: "Quiet hours",
//                 desc: "Pause non-critical notifications between 10:00 PM and 7:00 AM",
//               },
//             ].map(({ key, icon, title, desc }) => (
//               <div key={key} className="flex items-center justify-between py-[12px] border-b border-black/[0.08] last:border-0">
//                 <div className="flex items-center gap-[12px]">
//                   <div className="w-[32px] h-[32px] rounded-[6px] bg-[#f1f5f9] flex items-center justify-center text-[14px]">
//                     {icon}
//                   </div>
//                   <div>
//                     <p className="text-[13px] font-semibold text-[#0f172a]">{title}</p>
//                     <p className="text-[11px] text-[#94a3b8]">{desc}</p>
//                   </div>
//                 </div>
//                 <Toggle enabled={prefs[key]} onChange={() => togglePref(key)} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Save button */}
//         <div className="flex justify-end">
//           <button className="bg-[#5b3df6] flex items-center gap-[8px] h-[44px] justify-center px-[24px] rounded-[8px]">
//             <Save className="h-[16px] w-[16px] text-white" />
//             <div className="flex flex-col font-medium h-[17px] justify-center leading-[0] text-white text-[14px]">
//               Save changes
//             </div>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }









import { useState } from "react";
import { 
  Search, Upload, Bell, Settings, Shield, Mail, Globe, Save, X, 
  Users, BookOpen, Wallet, BarChart3, GraduationCap, Plus, 
  Trash2, Edit2, MoreVertical, CheckCircle, AlertCircle, 
  UserPlus, UserCog, Eye, Lock, Unlock 
} from "lucide-react";

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
const SubAdminModal = ({ isOpen, onClose, onSave, editingAdmin, currentUser }) => {
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
            disabled={!formData.name || !formData.email}
            className={`rounded-[6px] px-4 py-2 text-[13px] font-semibold transition-colors ${
              formData.name && formData.email
                ? 'bg-[#5b3df6] text-white hover:bg-[#4a2ed8]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {editingAdmin ? 'Save Changes' : 'Create Sub-admin'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, adminName }) => {
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
            <button onClick={onClose} className="flex-1 rounded-[6px] border border-black/[0.08] px-4 py-2 text-[13px] font-medium text-[#64748b] hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 rounded-[6px] bg-red-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ProfileSettings() {
  // Current logged-in user (in real app, this would come from auth context)
  const [currentUser] = useState({
    id: 'owner_1',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@lmsinstitute.com',
    role: 'owner',
    instituteId: 'inst_001',
  });

  // Sub-admins state - each sub-admin is linked to the admin who created them
  const [subAdmins, setSubAdmins] = useState([
    {
      id: 'sub_1',
      name: 'Priya Sharma',
      email: 'priya.sharma@institute.com',
      role: 'Sub-admin',
      permissions: ['students', 'instructors', 'payments'],
      status: 'active',
      createdBy: 'owner_1',
      createdByName: 'Rahul Mehta',
      createdAt: '2024-03-15',
      lastLogin: '2024-03-20',
    },
    {
      id: 'sub_2',
      name: 'Amit Kumar',
      email: 'amit.kumar@institute.com',
      role: 'Manager',
      permissions: ['students', 'instructors', 'courses', 'reports'],
      status: 'active',
      createdBy: 'owner_1',
      createdByName: 'Rahul Mehta',
      createdAt: '2024-03-10',
      lastLogin: '2024-03-19',
    },
    {
      id: 'sub_3',
      name: 'Neha Gupta',
      email: 'neha.gupta@institute.com',
      role: 'Viewer',
      permissions: ['students', 'reports'],
      status: 'inactive',
      createdBy: 'owner_1',
      createdByName: 'Rahul Mehta',
      createdAt: '2024-03-05',
      lastLogin: '2024-03-15',
    },
  ]);

  const [prefs, setPrefs] = useState({
    email: true,
    mobile: true,
    quiet: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deletingAdminId, setDeletingAdminId] = useState(null);

  const togglePref = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  // Filter sub-admins to only show those created by current user
  const mySubAdmins = subAdmins.filter(admin => admin.createdBy === currentUser.id);

  const handleCreateSubAdmin = (newAdmin) => {
    const adminWithId = {
      ...newAdmin,
      id: `sub_${Date.now()}`,
      status: 'active',
      lastLogin: null,
    };
    setSubAdmins([...subAdmins, adminWithId]);
  };

  const handleEditSubAdmin = (updatedAdmin) => {
    setSubAdmins(subAdmins.map(admin => 
      admin.id === updatedAdmin.id ? { ...admin, ...updatedAdmin } : admin
    ));
    setEditingAdmin(null);
  };

  const handleDeleteSubAdmin = () => {
    setSubAdmins(subAdmins.filter(admin => admin.id !== deletingAdminId));
    setIsDeleteModalOpen(false);
    setDeletingAdminId(null);
  };

  const handleToggleStatus = (adminId) => {
    setSubAdmins(subAdmins.map(admin =>
      admin.id === adminId 
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
    ));
  };

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
        {/* Hero card */}
        <div className="border border-black/[0.08] border-solid flex flex-col items-start pb-[23px] pt-[25px] px-[25px] relative rounded-[8px] shrink-0 w-full bg-gradient-to-br from-white to-[#e8f5ff]">
          <div className="flex items-center justify-between w-full flex-wrap gap-4">
            <div className="flex items-center gap-[16px]">
              <Avatar name={currentUser.name} size="md" />
              <div>
                <div className="flex items-center gap-[8px] mb-[8px] flex-wrap">
                  <Badge color="blue">👑 Owner account</Badge>
                  <Badge color="green">🎓 Institute Admin</Badge>
                </div>
                <h2 className="text-[28px] font-bold text-[#0f172a]">{currentUser.name}</h2>
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
              { label: "Institute role", value: "Owner" },
              { label: "Permissions", value: "Full access" },
              { label: "Last updated", value: "2d ago" },
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
              <InfoField label="Full name" value={currentUser.name} />
              <InfoField label="Role" value="Institute Owner" />
              <InfoField label="Email address" value={currentUser.email} />
              <InfoField label="Phone number" value="+91 98765 43210" />
              <InfoField label="Timezone" value="GMT+5:30 · India Standard Time" />
              <InfoField label="Language" value="English" />
            </div>
            <div className="bg-[#f8fafc] rounded-[8px] p-[12px] border border-black/[0.08] w-full">
              <p className="text-[11px] text-[#94a3b8] mb-[4px]">Bio</p>
              <p className="text-[13px] text-[#0f172a] leading-relaxed">
                Leading operations, admissions, and curriculum growth for the institute. Focused on scaling student success and instructor quality.
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
                <ActivityItem
                  icon="→"
                  title="New login from Mumbai"
                  subtitle="Today · 9:12 AM · Chrome on macOS"
                  badge="Approved"
                  badgeColor="green"
                />
                <ActivityItem
                  icon="🔒"
                  title="2-factor check completed"
                  subtitle="Yesterday · 7:48 PM · Authenticator code accepted"
                  badge="Logged"
                  badgeColor="slate"
                />
                <ActivityItem
                  icon="👥"
                  title={`New sub-admin "${mySubAdmins[mySubAdmins.length-1]?.name || '...'}" added`}
                  subtitle={mySubAdmins.length > 0 ? `${mySubAdmins[mySubAdmins.length-1].createdAt}` : 'No recent additions'}
                  badge="Complete"
                  badgeColor="slate"
                />
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
      </div>

      {/* Modals */}
      <SubAdminModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAdmin(null);
        }}
        onSave={editingAdmin ? handleEditSubAdmin : handleCreateSubAdmin}
        editingAdmin={editingAdmin}
        currentUser={currentUser}
      />
      
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSubAdmin}
        adminName={getDeletingAdminName()}
      />
    </div>
  );
}
