import { useState } from 'react'
import CancelButton from './components/CancelButton.jsx'
import CreateButton from './components/CreateButton.jsx'
import './App.css'
import NavigationBar from './components/NavigationBar.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <NavigationBar />

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <CreateButton />
        <CancelButton />
      </div>
    </div>
  )
}

export default App
