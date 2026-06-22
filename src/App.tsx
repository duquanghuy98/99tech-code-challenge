import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import Problem1Page from './problem1/Problem1Page'
import Problem2Page from './problem2/Problem2Page'
import { Skeleton } from './components/ui/skeleton'

const Problem3Page = lazy(() => import('./problem3/Problem3Page'))

export default function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/problem1" element={<Problem1Page />} />
          <Route path="/problem2" element={<Problem2Page />} />
          <Route
            path="/problem3"
            element={
              <Suspense fallback={<div className="p-10"><Skeleton className="h-96 w-full rounded-xl" /></div>}>
                <Problem3Page />
              </Suspense>
            }
          />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}
