import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'


import RootLayout from './layouts/RootLayout';
import DashboardLayout from './layouts/DashboardLayout';

import IndexPage from './routes/IndexPage';
import SignInPage from './routes/SignInPage';
import SignUpPage from './routes/SignUpPage';
import DashboardPage from './routes/Dashboard';

const router=createBrowserRouter([
  {
    element: <RootLayout />,
    children:[
      { path: "/", element: <IndexPage /> },
      { path: "/sign-in/*", element: <SignInPage /> },
      { path: "/sign-up/*", element: <SignUpPage /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
        ]
      }
    ]
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
