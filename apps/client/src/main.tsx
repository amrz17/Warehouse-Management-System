import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { isAuthenticated, hasAnyRole } from './services/auth.service.ts'

import LoginPage from './pages/Login.tsx'
import SignupPage from './pages/SignUp.tsx'
import Inventory from './pages/Inventory.tsx'
import Reporting from './pages/Reporting.tsx'
import Support from './pages/Support.tsx'
import Settings from './pages/Settings.tsx'
import Dashboard from './pages/Dashboard.tsx'
import { Toaster } from 'sonner'
import Sales from './pages/Sales.tsx'
import Purchase from './pages/Purchase.tsx'
import Inbound from './pages/Inbound.tsx'
import Outbound from './pages/Outbound.tsx'
import { UserRoleEnum, type UserRole } from './schemas/schema.ts'

const { ADMIN, MANAGER, STAFF_GUDANG, PICKER } = UserRoleEnum.enum;

function Protected({ children }: { children: ReactNode }) {

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Ganti type roles dari string[] ke UserRole[]
function ProtectedRole({ children, roles }: { children: ReactNode, roles: UserRole[] }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!hasAnyRole(roles)) return <Navigate to="/403" replace />;
  return <>{children}</>;
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
  {
    path: "/",
    element: (
      <Protected>
         <Dashboard />
      </Protected>
    )
  },
  {
    path: "/inventory",
    element: (
      <Protected>
         <Inventory />
      </Protected>
    )
  },
  {
    path: "/purchase",
    element: <ProtectedRole roles={[ADMIN, MANAGER, STAFF_GUDANG]}><Purchase /></ProtectedRole>
  },
  {
    path: "/inbound",
    element: (
      <Protected>
        <Inbound />
      </Protected>
    )
  },
  {
    path: "/sales",
    element: (
      <Protected>
         <Sales />
      </Protected>
    )
  },
  {
    path: "/outbound",
    element: (
      <Protected>
         <Outbound />
      </Protected>
    )
  },
  {
    path: "/reporting",
    element: (
      <Protected>
         <Reporting />
      </Protected>
    )
  },
  {
    path: "/support",
    element: (
      <Protected>
         <Support />
      </Protected>
    )
  },
  {
    path: "/settings",
    element: (
      <Protected>
         <Settings />
      </Protected>
    )
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>,
)
