import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import RequireAdmin from '@/components/layout/RequireAdmin'
import About from '@/pages/About'
import Collection from '@/pages/Collection'
import Contact from '@/pages/Contact'
import Faqs from '@/pages/Faqs'
import Inquiries from '@/pages/Inquiries'
import Privacy from '@/pages/Privacy'
import Terms from '@/pages/Terms'
import DressDetails from '@/pages/DressDetails'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import SignIn from '@/pages/SignIn'
import Account from '@/pages/Account'

// The owner area is loaded only when someone opens /admin, so customers never download it.
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'))
const AdminLogin = lazy(() => import('@/pages/AdminLogin'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const DressEditor = lazy(() => import('@/pages/DressEditor'))
const DressManager = lazy(() => import('@/pages/DressManager'))
const AdminInquiries = lazy(() => import('@/pages/AdminInquiries'))
const AdminBookings = lazy(() => import('@/pages/AdminBookings'))
const AdminCategories = lazy(() => import('@/pages/AdminCategories'))
const AdminSettings = lazy(() => import('@/pages/AdminSettings'))
const ManageDates = lazy(() => import('@/pages/ManageDates'))

export default function App() {
  return (
    <Suspense fallback={<p role="status" className="container-page py-20 text-muted">Loading…</p>}>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="collection" element={<Collection />} />
        <Route path="collection/:id" element={<DressDetails />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="terms" element={<Terms />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="account" element={<Account />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="dashboard/*" element={<Navigate to="/admin" replace />} />
      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<RequireAdmin />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dresses" element={<DressManager />} />
          <Route path="dresses/new" element={<DressEditor />} />
          <Route path="dresses/:id/edit" element={<DressEditor />} />
          <Route path="availability" element={<ManageDates />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
    </Suspense>
  )
}
