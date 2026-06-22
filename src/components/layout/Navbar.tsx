import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Languages, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import GooeyNav from '@/components/effects/GooeyNav'

const navItems = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/problem1', labelKey: 'nav.problem1' },
  { to: '/problem2', labelKey: 'nav.problem2' },
  { to: '/problem3', labelKey: 'nav.problem3' },
]

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const { i18n, t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en')

  return (
    <div className="relative z-40 shrink-0 bg-background">
      <header className="flex items-center justify-between px-4 py-2 w-full max-w-[100vw] bg-background border-b border-border md:border-b-0 overflow-x-hidden">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm">99</span>
          </div>
          <span className="font-bold text-sm text-foreground hidden sm:block">
            {t('brand.suffix')}
          </span>
        </Link>

        <div className="hidden md:block overflow-hidden isolate">
          <GooeyNav items={navItems} />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title={t('theme.toggle')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="h-8 px-2 text-muted-foreground hover:text-foreground text-xs font-semibold"
            title={t('language.toggle')}
          >
            <Languages className="h-4 w-4 mr-1" />
            {i18n.language === 'en' ? 'VI' : 'EN'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 md:hidden bg-background/60 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 z-40 md:hidden bg-background border-b border-border py-2 px-4 flex flex-col gap-1 shadow-lg"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
