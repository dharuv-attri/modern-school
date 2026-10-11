import React, { useState, useEffect } from 'react';
import { PublicSchoolData } from './types.ts';
import { Header } from './components/public/Header.tsx';
import { Hero } from './components/public/Hero.tsx';
import { About } from './components/public/About.tsx';
import { Academics } from './components/public/Academics.tsx';
import { Facilities } from './components/public/Facilities.tsx';
import { FeeStructure } from './components/public/FeeStructure.tsx';
import { Faculty } from './components/public/Faculty.tsx';
import { NoticesCalendar } from './components/public/NoticesCalendar.tsx';
import { Gallery } from './components/public/Gallery.tsx';
import { Transport } from './components/public/Transport.tsx';
import { AdmissionsForm } from './components/public/AdmissionsForm.tsx';
import { Contact } from './components/public/Contact.tsx';
import { Footer } from './components/public/Footer.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminPortal } from './components/admin/AdminPortal.tsx';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  const [schoolData, setSchoolData] = useState<PublicSchoolData | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('home');

  // Handle URL route initialization (/admin)
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      if (path === '/admin' || window.location.hash === '#admin') {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Check auth session
  useEffect(() => {
    checkAdminSession();
  }, [isAdminView]);

  // Load public school data
  useEffect(() => {
    loadPublicData();
  }, []);

  const checkAdminSession = async () => {
    setAuthChecking(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setAdminUser(data.admin);
        } else {
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
    } catch (err) {
      setAdminUser(null);
    } finally {
      setAuthChecking(false);
    }
  };

  const loadPublicData = async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/public/data');
      if (res.ok) {
        const data = await res.json();
        setSchoolData(data);
      }
    } catch (err) {
      console.error('Failed to load public school data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminView(true);
  };

  const navigateToWebsite = () => {
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
    loadPublicData(); // Reload latest published content
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If viewing admin route
  if (isAdminView) {
    if (authChecking) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <span className="text-xs">Verifying administrator security session...</span>
        </div>
      );
    }

    if (adminUser) {
      return (
        <AdminPortal
          adminUser={adminUser}
          onLogout={() => {
            setAdminUser(null);
            navigateToWebsite();
          }}
          onViewWebsite={navigateToWebsite}
        />
      );
    }

    return (
      <AdminLogin
        onLoginSuccess={(admin) => {
          setAdminUser(admin);
        }}
        onBackToWebsite={navigateToWebsite}
      />
    );
  }

  // Public School Website View
  if (dataLoading && !schoolData) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <span className="text-xs tracking-wider uppercase text-slate-300">
          Loading Modern Public Sr. Sec. School, Swarghat...
        </span>
      </div>
    );
  }

  const settings = schoolData?.settings || {};
  const notices = schoolData?.notices || [];
  const calendar = schoolData?.calendar || [];
  const faculty = schoolData?.faculty || [];
  const feeStructures = schoolData?.feeStructures || [];
  const facilities = schoolData?.facilities || [];
  const gallery = schoolData?.gallery || [];
  const transportRoutes = schoolData?.transportRoutes || [];
  const latestNotice = notices[0];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-indigo-900 selection:text-white">
      {/* Navigation Header */}
      <Header
        settings={settings}
        onNavigateToAdmin={navigateToAdmin}
        activeSection={activeSection}
        onNavigateSection={scrollToSection}
      />

      {/* Main Public Content */}
      <main className="flex-1">
        <Hero
          settings={settings}
          latestNotice={latestNotice}
          onNavigateSection={scrollToSection}
        />

        <About settings={settings} />

        <Academics />

        <Facilities facilities={facilities} />

        <FeeStructure feeStructures={feeStructures} />

        <Faculty faculty={faculty} />

        <NoticesCalendar notices={notices} calendar={calendar} />

        <Gallery gallery={gallery} />

        <Transport routes={transportRoutes} />

        <AdmissionsForm />

        <Contact settings={settings} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigateToAdmin={navigateToAdmin}
        onNavigateSection={scrollToSection}
      />
    </div>
  );
}
