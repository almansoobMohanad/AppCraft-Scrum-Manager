import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './cssFiles/index.css';
import SprintBoard from './pages/Board/SprintBoard.jsx';
import AccountPage from './pages/Account/AccountPage.jsx';
import AdminView from './pages/Admin/AdminView.jsx';
import SprintBacklogPage from './pages/SprintBacklog/SprintBacklogPage.jsx';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />, 
    },    
    {
      path: "/sprintboard",
      element: <SprintBoard />, 
    },
    {
      path: "/account",
      element: <AccountPage/>, 
    },
    {
      path: "/admin",
      element: <AdminView/>, 
    },
    {
      path: "/sprintbacklog",
      element: <SprintBacklogPage/>,
    },
  ]);


createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)
