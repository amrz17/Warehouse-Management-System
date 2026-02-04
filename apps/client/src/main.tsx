import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from './services/auth.service.ts'

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


function Protected({ children }: { children: ReactNode }) {

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

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
    element: (
      <Protected>
         <Purchase />
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
