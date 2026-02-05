import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import { HashRouter, Routes, Route } from "react-router";
import Header from '@/Header.tsx';
import Home from '@/pages/home/Home.tsx'
import { LanguageProvider } from './languages/LanguageContext';
import SeatMatch from './pages/seatmatch/nameassignment/SeatMatch.tsx';
import SeatMatchLayout from './pages/seatmatch/nameassignment/SeatMatchLayout.tsx';
import SeatingArrangement from './pages/seatmatch/arrangementbuilder/DeskArrangement.tsx';
import GroupGenLayout from './pages/groupgenerator/groupgen/GroupGenLayout.tsx';
import GroupGen from "@/pages/groupgenerator/groupgen/GroupGen.tsx"
import ClassManagement from './pages/classmanagement/ClassManagement.tsx';
import PersonSelect from './pages/groupgenerator/namepicker/NamePicker.tsx';
import LesssonCountdown from './pages/clock/countdown.tsx';
import License from './pages/legal/licenses.tsx';
import { useEffect } from "react";
import { useLocation } from "react-router";

export const maxXSize: number = 1300;

// Scroll to top on route change
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <LanguageProvider>
        <ThemeProvider defaultTheme='system' storageKey="vite-ui-theme">
          <HashRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Header />}>
                <Route index element={<Home />} />
                <Route element={<SeatMatchLayout />}>
                  <Route path="/seatmatch" element={<SeatMatch />} />
                </Route>

                <Route path="/deskarrangement" element={<SeatingArrangement />} />

                <Route element={<GroupGenLayout />}>
                  <Route path="/group-generator" element={<GroupGen />} />
                  <Route path="/name-picker" element={<PersonSelect />} />
                </Route>

                <Route path='/class-management' element={<ClassManagement />}/>

                <Route path="/lesson-countdown" element={<LesssonCountdown />} />

                <Route path="/license" element={<License />} />

              </Route>
            </Routes>
          </HashRouter>
        </ThemeProvider>
      </LanguageProvider>
  </StrictMode>,
)
