import react from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import ThemeProvider from './components/ThemeProvider'

function App() {
  

  return (
    <>
    <ThemeProvider>
     <AppRoutes />
    </ThemeProvider>
    
    
    </>
  )
}

export default App
