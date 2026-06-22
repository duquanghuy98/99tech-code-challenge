import { ReactNode } from 'react'
import Navbar from './Navbar'
import Particles from '@/components/effects/Particles'
import ClickSpark from '@/components/effects/ClickSpark'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-dvh bg-background">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Particles
          particleCount={300}
          particleSpread={12}
          speed={0.08}
          alphaParticles
          moveParticlesOnHover
          particleHoverFactor={0.5}
          particleBaseSize={80}
          sizeRandomness={1.2}
          particleColors={['#a78bfa', '#818cf8', '#38bdf8', '#ffffff', '#e879f9']}
          pixelRatio={window.devicePixelRatio}
        />
      </div>
      <ClickSpark
        sparkColor="#a78bfa"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={10}
        duration={500}
        extraScale={1.2}
      >
        <div className="relative z-10 flex flex-col min-h-dvh">
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </div>
      </ClickSpark>
    </div>
  )
}
