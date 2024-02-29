import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'
import BottomMenu from './components/BottomMenu'
import Artikel from './pages/Artikel'
import Video from './pages/Video'
import Kesehatan from './pages/Kesehatan'
import Profile from './pages/Profile'

function AppContent() {
  const navigate = useLocation();

  // Mengecek apakah kita berada di halaman '/' atau '/register'
  const isHomeOrRegister = navigate.pathname === '/' || navigate.pathname === '/register';

  return (
    <>
      <div className='flex justify-center'>
        {!isHomeOrRegister && <BottomMenu />}
      </div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/video" element={<Video />} />
        <Route path="/kesehatan" element={<Kesehatan />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
