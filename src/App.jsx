import { lazy, Suspense, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import CustomCursor from './components/CustomCursor/CustomCursor'
import ScrollProgress from './components/ScrollProgress/ScrollProgress'
import PageLoader from './components/PageLoader/PageLoader'
import ScrollToTop from './components/ScrollToTop'
import PageTransition from './components/PageTransition/PageTransition'

import Home from './pages/Home/Home'
import About from './pages/About/About'
import Skills from './pages/Skills/Skills'
import Experience from './pages/Experience/Experience'
import Projects from './pages/Projects/Projects'
import ProjectDetail from './pages/ProjectDetail/ProjectDetail'
import Services from './pages/Services/Services'
import Contact from './pages/Contact/Contact'
import NotFound from './pages/NotFound/NotFound'

const Admin = lazy(() => import('./pages/Admin/Admin'))

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  if (location.pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<div className="admin-loading">Loading admin panel…</div>}>
        <Admin />
      </Suspense>
    )
  }

  return (
    <>
      <PageLoader onFinish={() => setLoading(false)} />

      {!loading && (
        <>
          <ScrollProgress />
          <CustomCursor />
          <Header />
          <ScrollToTop />

          <main>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                <Route path="/skills" element={<PageTransition><Skills /></PageTransition>} />
                <Route path="/experience" element={<PageTransition><Experience /></PageTransition>} />
                <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
                <Route path="/projects/:slug" element={<PageTransition><ProjectDetail /></PageTransition>} />
                <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
                <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </main>

          <Footer />
        </>
      )}
    </>
  )
}
