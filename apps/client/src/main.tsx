import React, { StrictMode, type ReactNode } from 'react'
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
import SignupPage from './pages/SignUp.tsx'


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
