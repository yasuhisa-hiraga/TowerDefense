import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css'
import TopPage from './pages/TopPage.tsx'
import GamePage from './pages/GamePage.tsx'

const router = createBrowserRouter([
  { path: "/", Component: TopPage },
  { path: "/game", Component: GamePage },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
