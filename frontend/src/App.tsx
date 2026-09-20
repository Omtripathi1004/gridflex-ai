import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { NavbarWrapper } from './components/NavbarWrapper';
import { Footer } from './components/Footer';

// Direct synchronous imports for 0ms instantaneous navigation without Suspense layout jumps
import HomePage from './app/page';
import AboutPage from './app/about/page';
import LoginPage from './app/login/page';
import DemandForecastPage from './app/demand-forecast/page';
import RenewablePage from './app/renewable-forecast/page';
import FlexibilityPage from './app/flexibility/page';
import DigitalTwinPage from './app/digital-twin/page';
import P2PPage from './app/p2p/page';
import ResiliencePage from './app/resilience/page';
import StoragePage from './app/storage/page';
import SkyVisionPage from './app/sky-vision/page';
import SpatialTwinPage from './app/spatial-twin/page';
import TariffEnginePage from './app/tariff-engine/page';
import CommandCenterPage from './app/command-center/page';
import ExplainableAIPage from './app/explainable-ai/page';
import SelfHealingPage from './app/self-healing/page';
import IncidentCopilotPage from './app/incident-copilot/page';
import DiscomPage from './app/discom/page';
import ArchitecturePage from './app/architecture/page';
import JudgeModePage from './app/judge-mode/page';
import CopilotPage from './app/copilot/page';
import NotFoundPage from './app/not-found';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AuthGuard>
          <div className="app-container">
            <NavbarWrapper />
            <main className="main-content">
              <Routes>
                <Route path="/"                 element={<HomePage />} />
                <Route path="/about"            element={<AboutPage />} />
                <Route path="/login"            element={<LoginPage />} />
                <Route path="/demand-forecast"  element={<DemandForecastPage />} />
                <Route path="/renewable-forecast" element={<RenewablePage />} />
                <Route path="/flexibility"      element={<FlexibilityPage />} />
                <Route path="/digital-twin"     element={<DigitalTwinPage />} />
                <Route path="/p2p"              element={<P2PPage />} />
                <Route path="/resilience"       element={<ResiliencePage />} />
                <Route path="/storage"          element={<StoragePage />} />
                <Route path="/sky-vision"       element={<SkyVisionPage />} />
                <Route path="/spatial-twin"     element={<SpatialTwinPage />} />
                <Route path="/tariff-engine"    element={<TariffEnginePage />} />
                <Route path="/command-center"   element={<CommandCenterPage />} />
                <Route path="/explainable-ai"   element={<ExplainableAIPage />} />
                <Route path="/self-healing"     element={<SelfHealingPage />} />
                <Route path="/incident-copilot" element={<IncidentCopilotPage />} />
                <Route path="/discom"           element={<DiscomPage />} />
                <Route path="/architecture"     element={<ArchitecturePage />} />
                <Route path="/judge-mode"       element={<JudgeModePage />} />
                <Route path="/copilot"          element={<CopilotPage />} />
                {/* Catch-all 404 */}
                <Route path="*"                 element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthGuard>
      </AuthProvider>
    </LanguageProvider>
  );
}
