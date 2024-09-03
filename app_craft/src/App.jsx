import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CancelButton from './components/CancelButton.jsx'
import CreateButton from './components/CreateButton.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (


    
    <>
    <CreateButton/>
    <CancelButton/>

    </>

  )
}

export default App
