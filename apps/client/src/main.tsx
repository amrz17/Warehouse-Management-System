import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from './services/auth.service.ts'

import LoginPage from './pages/Login.tsx'
import Home from './pages/Home.tsx'

function Protected({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? children : <Navigate to="/login" />
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: (
      <Protected>
         <Home />
      </Protected>
    )
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
