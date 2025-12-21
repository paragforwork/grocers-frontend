import { StrictMode,useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {RouterProvider,createBrowserRouter} from 'react-router-dom'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Cakes from './pages/cakes.jsx'
import Product from './components/product.jsx'
import Accounts from './pages/accounts.jsx'
import PrivateRoute from './components/privateRoute.jsx'
import AdminRoute from './components/adminRoute.jsx'
import AdminLayout from './components/adminLayout.jsx'
import Cart from './pages/cart.jsx'
import Checkout from './pages/checkout.jsx'
import MyOrders from './pages/myorder.jsx'
import AdminDashboard from './pages/adminDashboard.jsx'
import AdminOrders from './pages/adminOrders.jsx'
import AdminProducts from './pages/adminProducts.jsx'
import AdminUsers from './pages/adminUsers.jsx'


const router =createBrowserRouter([
 {
    path:'/login',
    element:<Login/>
  },{
    path:'/signup',
    element:<Signup/>
  },
  // protected routes


  {
    // The parent route uses the PrivateRoute component
    element: <PrivateRoute />,
    // All these children will be checked by PrivateRoute before rendering
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/cakes',
        element: <Cakes />,
      },
      {
        path: '/products/:id',
        element: <Product />,
      },
      {
        path: '/account',
        element: <Accounts />,
      },
      {
        path:'/cart',
        element:<Cart/>
      },{
        path:'/checkout',
        element:<Checkout/>
      },{
        path:'/myorders',
        element:<MyOrders/>
      }
    ]
  },
  // Admin routes
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />
          },
          {
            path: 'orders',
            element: <AdminOrders />
          },
          {
            path: 'products',
            element: <AdminProducts />
          },
          {
            path: 'users',
            element: <AdminUsers />
          }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
