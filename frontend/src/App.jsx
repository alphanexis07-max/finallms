import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getDashboardPathByRole } from './lib/api'
import Layout from './components/layout'
import Login from './components/Login'
import SignUp from './components/SignUp'
import AdminSignup from './components/AdminSignup'
import InstructorSignup from './components/InstructorSignup'
import SuperAdminSignup from './components/SuperAdminSignup'
import ForgetPassword from './components/forgetPassword'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Contact from './pages/Contact'
import SuperAdminLayout from './components/superadmin/SuperAdminLayout'
import SuperAdminOverview from './pages/super admin/SuperAdminOverview'
import SuperAdminDashboard from './pages/super admin/SuperAdminDashboard'
import SuperAdminTenantManagement from './pages/super admin/SuperAdminTenantManagement'
import SuperAdminRevenue from './pages/super admin/SuperAdminRevenue'
import SuperAdminUsers from './pages/super admin/SuperAdminUsers'
import SuperAdminReports from './pages/super admin/SuperAdminReports'
import SuperAdminPlansBilling from './pages/super admin/SuperAdminPlansBilling'
import SuperAdminSettings from './pages/super admin/SuperAdminSettings'
import SuperAdminProfile from './pages/super admin/SuperAdminProfile'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCourseManagement from './pages/admin/AdminCourseManagement'
import AdminInstructorManagement from './pages/admin/AdminInstructorManagement'
import AdminStudentManagement from './pages/admin/AdminStudentManagement'
import AdminSchoolEvents from './pages/admin/AdminSchoolEvents'
import AdminPaymentsCupons from './pages/admin/AdminPayments&Cupons'
import AdminLiveClasses from './pages/admin/AdminLiveClasses'
import AdminELibrary from './pages/admin/AdminELibrary'
import AdminSubscription from './pages/admin/AdminSubscription'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminProfile from './pages/admin/AdminProfile'
import AdminNotification from './pages/admin/AdminNotification'
import InstructorLayout from './components/Instructor/InstructorLayout'
import InstructorDashboard from './pages/instructor/InstructorDashboard'
import InstructorMycourses from './pages/instructor/InstructorMycourses'
import InstructorOnlineClasses from './pages/instructor/InstructorOnlineClasses'
import InstructorWeeklyTest from './pages/instructor/InstructorWeeklyTest'
import InstructorStudentInsights from './pages/instructor/InstructorStudentInsights'
import InstructorProfile from './pages/instructor/InstructorProfile'
import StudentLayout from './components/student/StudentLayout'
import StudentDashboard from './pages/student panel/StudentDashboard'
import StudentContinueLearning from './pages/student panel/StudentContinueLearning'
import StudentMyCourses from './pages/student panel/StudentMyCourses'
import StudentBrowseCourses from './pages/student panel/StudentBrowseCourse'
import StudentELibrary from './pages/student panel/StudentELibrary'
import StudentLiveClasses from './pages/student panel/StudentLiveClasses'
import StudentCertificates from './pages/student panel/StudentCertificates'
import StudentProfile from './pages/student panel/StudentProfile'

function ProtectedPanel({ children, allowedRoles = [] }) {
  const token = localStorage.getItem('lms_token')
  const role = localStorage.getItem('lms_role') || ''

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPathByRole(role)} replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route path="/superadmin-signup" element={<SuperAdminSignup />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/instructor-signup" element={<InstructorSignup />} />
        <Route path="/superadmin" element={<ProtectedPanel allowedRoles={['super_admin']}><SuperAdminLayout /></ProtectedPanel>}>
          <Route index element={<SuperAdminOverview />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="tenant-management" element={<SuperAdminTenantManagement />} />
          <Route path="revenue" element={<SuperAdminRevenue />} />
          <Route path="user-management" element={<SuperAdminUsers />} />
          <Route path="reports" element={<SuperAdminReports />} />
          <Route path="plans-billing" element={<SuperAdminPlansBilling />} />
          <Route path="platform-settings" element={<SuperAdminSettings />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>
        <Route path="/admin" element={<ProtectedPanel allowedRoles={['admin', 'sub_admin']}><AdminLayout /></ProtectedPanel>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="course-management" element={<AdminCourseManagement />} />
          <Route path="instructor-management" element={<AdminInstructorManagement />} />
          <Route path="student-management" element={<AdminStudentManagement />} />
          <Route path="School-Events" element={<AdminSchoolEvents/>} />
          <Route path="payments-coupons" element={<AdminPaymentsCupons />} />
          <Route path="live-classes" element={<AdminLiveClasses />} />
          <Route path="e-library" element={<AdminELibrary />} />
          <Route path="subscription" element={<AdminSubscription />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="notification" element={<AdminNotification />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
        <Route path="/instructor" element={<ProtectedPanel allowedRoles={['instructor']}><InstructorLayout /></ProtectedPanel>}>
          <Route index element={<InstructorDashboard />} />
          <Route path="dashboard" element={<InstructorDashboard />} />
          <Route path="my-courses" element={<InstructorMycourses />} />
          <Route path="online-classes" element={<InstructorOnlineClasses />} />
          <Route path="weekly-tests" element={<InstructorWeeklyTest />} />
          <Route path="student-insights" element={<InstructorStudentInsights />} />
          <Route path="profile" element={<InstructorProfile />} />
        </Route>
        <Route path="/student-panel" element={<ProtectedPanel allowedRoles={['student']}><StudentLayout /></ProtectedPanel>}>
          <Route index element={<StudentDashboard />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="continue-learning" element={<StudentContinueLearning />} />
          <Route path="my-courses" element={<StudentMyCourses />} />
          <Route path="browse-courses" element={<StudentBrowseCourses />} />
          <Route path="e-library" element={<StudentELibrary />} />
          <Route path="live-classes" element={<StudentLiveClasses />} />
          <Route path="certificates" element={<StudentCertificates />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
