import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const Generation = lazy(() => import('./pages/Generation'))
const Compare = lazy(() => import('./pages/Compare'))

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#f8f9fa] text-[#202124]" style={{ fontFamily: "'Roboto', sans-serif" }}>
        <Header />
        <Suspense fallback={<div className="pt-20 text-center text-gray-500">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generation/:id" element={<Generation />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
