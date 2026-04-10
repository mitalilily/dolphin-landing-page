import { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

function LoadingScreen() {
  return (
    <MotionDiv
      key="site-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex min-h-screen items-center justify-center bg-[#FBFBFB] px-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(198,231,255,0.45),transparent_24%),radial-gradient(circle_at_78%_28%,rgba(255,221,174,0.42),transparent_24%),linear-gradient(180deg,#FBFBFB_0%,#f6fbff_100%)]" />
      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <MotionImg
          src={logoImage}
          alt="Dolphin Enterprises"
          className="mx-auto h-28 w-auto object-contain sm:h-32"
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
    </MotionDiv>
  );
}

function RouteFallback() {
  return <LoadingScreen />;
}

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(() =>
    typeof document === "undefined" ? false : document.readyState === "complete"
  );

  useEffect(() => {
    const minimumTimer = window.setTimeout(() => {
      setMinimumElapsed(true);
    }, 1200);

    const handleLoad = () => {
      setPageLoaded(true);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      window.clearTimeout(minimumTimer);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(() => {
    if (minimumElapsed && pageLoaded) {
      setShowLoader(false);
    }
  }, [minimumElapsed, pageLoaded]);

  return (
    <>
      <MotionDiv
        initial={false}
        animate={{ opacity: showLoader ? 0 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={showLoader ? "pointer-events-none" : undefined}
      >
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
      </MotionDiv>

      <AnimatePresence>{showLoader ? <LoadingScreen /> : null}</AnimatePresence>
    </>
  );
}

export default App;
