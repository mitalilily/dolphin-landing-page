import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/dolphin/MainLayout";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RateCalculatorPage = lazy(() => import("./pages/RateCalculatorPage"));
const TrackingPage = lazy(() => import("./pages/TrackingPage"));
const VolumetricCalculatorPage = lazy(() => import("./pages/VolumetricCalculatorPage"));

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 py-20">
      <div className="w-full max-w-xl rounded-[28px] border border-white/60 bg-white/85 p-8 text-center shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Loading</p>
        <h2 className="mt-4 font-display text-3xl text-slate-900 sm:text-4xl">Preparing your dashboard view.</h2>
        <p className="mt-3 text-sm text-slate-600 sm:text-base">
          We&apos;re pulling in the next page so the experience stays fast and polished.
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<RouteFallback />}>
              <LandingPage />
            </Suspense>
          }
        />
        <Route
          path="/volumetric-weight-calculator"
          element={
            <Suspense fallback={<RouteFallback />}>
              <VolumetricCalculatorPage />
            </Suspense>
          }
        />
        <Route
          path="/rate-calculator"
          element={
            <Suspense fallback={<RouteFallback />}>
              <RateCalculatorPage />
            </Suspense>
          }
        />
        <Route
          path="/tracking"
          element={
            <Suspense fallback={<RouteFallback />}>
              <TrackingPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<RouteFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
