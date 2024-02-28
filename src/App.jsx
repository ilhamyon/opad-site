import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import Biodata from './pages/Biodata'
import DataRemaja from './pages/DataRemaja'
import BottomMenu from './components/BottomMenu'

function App() {
  return (
    <Router>
      <div className='flex justify-center'>
        <BottomMenu />
      </div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/biodata" element={<Biodata />} />
        <Route path="/data-remaja" element={<DataRemaja />} />
      </Routes>
    </Router>
  )
}

export default App
