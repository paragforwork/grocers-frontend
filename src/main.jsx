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
import Cart from './pages/cart.jsx'
import Checkout from './pages/checkout.jsx'
import MyOrders from './pages/myorder.jsx'


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
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
