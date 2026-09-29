import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Dashboard from './pages/Dashboard.jsx'

function App() {
  const [message, setMessage] = useState("hello world");

  return <Dashboard />
}

export default App
