import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./components/dolphin/MainLayout";
import logoImage from "./assets/dolphin-logo-transparent.png";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const RateCalculatorPage = lazy(() => import("./pages/RateCalculatorPage"));
const TrackingPage = lazy(() => import("./pages/TrackingPage"));
const VolumetricCalculatorPage = lazy(() => import("./pages/VolumetricCalculatorPage"));
const MotionDiv = motion.div;
const MotionImg = motion.img;
const MotionP = motion.p;

function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 py-20">
      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-center"
      >
        <MotionImg
          src={logoImage}
          alt="Dolphin Enterprises"
          className="mx-auto h-24 w-auto object-contain sm:h-28"
          animate={{ opacity: [1, 0.46, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <MotionP
          className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500"
          animate={{ opacity: [0.42, 1, 0.42] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Site is loading
        </MotionP>
      </MotionDiv>
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
