import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const AuthPortal: React.FC = () => {
  const { loginUser, currentUser, showToast, setActiveView } = useApp();

  // Mode switcher tab
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Name state initialized to current user name or default 'Snehith Varma'
  const [passengerName, setPassengerName] = useState(currentUser?.name || 'Snehith Varma');
  const [passengerId, setPassengerId] = useState('ME-984201');
  const [passengerSecret, setPassengerSecret] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPrefs, setRememberPrefs] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Micro-interaction states for milestones
  const [kavachStatus, setKavachStatus] = useState('FAIL-SAFE ENGAGED');
  const [kavachBlockText, setKavachBlockText] = useState('Block 108 · Distance: 8.4 km Clear');
  const [tatkalStatus, setTatkalStatus] = useState('99.4% ALLOCATION');
  const [tatkalPing, setTatkalPing] = useState('240ms Ping');
  const [tatkalBarWidth, setTatkalBarWidth] = useState('94%');
  const [climateIdx, setClimateIdx] = useState(1);
  const [whisperIdx, setWhisperIdx] = useState(0);
  const [warmMode, setWarmMode] = useState(true);
  const [tintIdx, setTintIdx] = useState(0);

  // Telemetry HUD state
  const [hudTrainStatus, setHudTrainStatus] = useState('LOCOMOTIVE 12401 · DEPARTURE DOCK');
  const [hudVelocity, setHudVelocity] = useState('40 KM/H');
  const [hudProgress, setHudProgress] = useState('TRACK 0%');
  const [hudCoords, setHudCoords] = useState('LAT 28.6139° N · LON 77.2090° E');
  const [activeWaypoint, setActiveWaypoint] = useState<number | null>(null);
  const [autoCruise, setAutoCruise] = useState(false);

  // Canvas & Scroll refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trackContainerRef = useRef<HTMLDivElement | null>(null);
  const masterPathRef = useRef<SVGPathElement | null>(null);
  const trackGlowRef = useRef<SVGPathElement | null>(null);
  const locoRef = useRef<HTMLDivElement | null>(null);
  const coach1Ref = useRef<HTMLDivElement | null>(null);
  const coach2Ref = useRef<HTMLDivElement | null>(null);
  const sparkContainerRef = useRef<HTMLDivElement | null>(null);

  // Handle Form Submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = passengerName.trim() || 'Snehith Varma';
    setSubmitting(true);

    showToast(`Welcome aboard, ${finalName}! Synchronizing IRCTC gateway...`);

    setTimeout(() => {
      loginUser('USER', `${finalName.toLowerCase().replace(/\s+/g, '.')}@midnight.express`, finalName);
      setSubmitting(false);
      setActiveView('dashboard');
    }, 600);
  };

  const handleAdminQuickLogin = () => {
    loginUser('ADMIN', 'controller@midnight.express', 'Chief Controller');
    setActiveView('dashboard');
  };

  // 1. STARFIELD & FLOATING MOTES
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars: { x: number; y: number; radius: number; alpha: number; delta: number }[] = [];
    for (let i = 0; i < 110; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        delta: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const motes: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 28; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Stars
      for (const s of stars) {
        s.alpha += s.delta;
        if (s.alpha > 0.95 || s.alpha < 0.15) s.delta = -s.delta;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 197, 255, ${Math.max(0.1, s.alpha)})`;
        ctx.fill();
      }

      // Motes
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < 0) m.y = height;
        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 185, 95, ${m.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. SCROLL DRIVEN TRAIN CONVOY & MILESTONE TRACKING
  useEffect(() => {
    const masterPath = masterPathRef.current;
    const trackGlow = trackGlowRef.current;
    const trackContainer = trackContainerRef.current;
    const locoUnit = locoRef.current;
    const coach1Unit = coach1Ref.current;
    const coach2Unit = coach2Ref.current;
    const sparkContainer = sparkContainerRef.current;

    let pathLength = masterPath ? masterPath.getTotalLength() : 4800;
    if (trackGlow) {
      trackGlow.style.strokeDasharray = `${pathLength} ${pathLength}`;
      trackGlow.style.strokeDashoffset = `${pathLength}`;
    }

    let targetProgress = 0;
    let currentProgress = 0;
    let isTicking = false;
    let lastSparkTime = 0;

    const calculateScrollProgress = () => {
      if (!trackContainer) return 0;
      const rect = trackContainer.getBoundingClientRect();
      const winH = window.innerHeight;
      const startY = rect.top - winH * 0.42;
      const totalTravelDist = rect.height - winH * 0.35;
      if (totalTravelDist <= 0) return 0;
      const p = -startY / totalTravelDist;
      return Math.max(0, Math.min(1, p));
    };

    const emitSparks = () => {
      const now = performance.now();
      if (now - lastSparkTime < 90) return;
      lastSparkTime = now;
      if (!sparkContainer) return;

      for (let i = 0; i < 2; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        const angle = Math.random() * Math.PI + Math.PI / 2;
        const dist = Math.random() * 26 + 12;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        spark.style.left = `${Math.random() * 20 - 10}px`;
        spark.style.top = '0px';
        sparkContainer.appendChild(spark);
        setTimeout(() => spark.remove(), 600);
      }
    };

    const getPathTransform = (dist: number, scaleX: number, scaleY: number) => {
      if (!masterPath) return '';
      const clampedDist = Math.max(0, Math.min(pathLength, dist));
      const pt = masterPath.getPointAtLength(clampedDist);

      const step = 4;
      const forwardDist = Math.min(pathLength, clampedDist + step);
      const backwardDist = Math.max(0, clampedDist - step);

      const ptForward = masterPath.getPointAtLength(forwardDist);
      const ptBackward = masterPath.getPointAtLength(backwardDist);

      const dx = (ptForward.x - ptBackward.x) * scaleX;
      const dy = (ptForward.y - ptBackward.y) * scaleY;

      const rad = Math.atan2(dy, dx);
      const angleDeg = (rad * 180) / Math.PI + 90;

      const realX = pt.x * scaleX;
      const realY = pt.y * scaleY;

      return `translate3d(${realX}px, ${realY}px, 0) translate(-50%, -50%) rotate(${angleDeg}deg)`;
    };

    const renderTrainFrame = () => {
      currentProgress += (targetProgress - currentProgress) * 0.12;
      if (Math.abs(targetProgress - currentProgress) < 0.0003) {
        currentProgress = targetProgress;
      }

      if (masterPath && trackContainer && pathLength > 0) {
        const scaleX = trackContainer.offsetWidth / 1200;
        const scaleY = trackContainer.offsetHeight / 4300;

        const leadIn = 280;
        const availableTravel = Math.max(100, pathLength - leadIn - 120);
        const locoDist = leadIn + currentProgress * availableTravel;
        const coach1Dist = locoDist - 96;
        const coach2Dist = locoDist - 188;

        if (locoUnit) locoUnit.style.transform = getPathTransform(locoDist, scaleX, scaleY);
        if (coach1Unit) coach1Unit.style.transform = getPathTransform(coach1Dist, scaleX, scaleY);
        if (coach2Unit) coach2Unit.style.transform = getPathTransform(coach2Dist, scaleX, scaleY);

        if (trackGlow) {
          const offset = pathLength * (1 - currentProgress);
          trackGlow.style.strokeDashoffset = `${offset}`;
        }

        const pct = Math.round(currentProgress * 100);
        setHudProgress(`TRACK ${pct}%`);

        let baseSpeed = 40;
        let sectorName = 'PLATFORM 04 · DEPARTURE ACCEL';
        const lat = (28.6139 - currentProgress * 9.645).toFixed(4);
        const lon = (77.209 + currentProgress * 5.618).toFixed(4);

        if (currentProgress < 0.1) {
          baseSpeed = Math.round(40 + currentProgress * 920);
          sectorName = 'PLATFORM 04 · ACCELERATING';
        } else if (currentProgress >= 0.1 && currentProgress < 0.28) {
          baseSpeed = Math.round(208 + Math.sin(currentProgress * 30) * 10);
          sectorName = 'CORRIDOR 01 · 220 KM/H CRUISE';
        } else if (currentProgress >= 0.28 && currentProgress < 0.46) {
          baseSpeed = Math.round(220 + Math.cos(currentProgress * 25) * 6);
          sectorName = 'WAYPOINT 02 · KAVACH 4.0 ACTIVE';
        } else if (currentProgress >= 0.46 && currentProgress < 0.64) {
          baseSpeed = Math.round(214 + Math.sin(currentProgress * 22) * 8);
          sectorName = 'WAYPOINT 03 · TATKAL AI QUOTA SYNC';
        } else if (currentProgress >= 0.64 && currentProgress < 0.82) {
          baseSpeed = Math.round(195 + Math.cos(currentProgress * 18) * 10);
          sectorName = 'WAYPOINT 04 · 1AC & VISTADOME ACTIVE';
        } else {
          const decel = Math.max(0, (1 - currentProgress) / 0.18);
          baseSpeed = Math.max(16, Math.round(180 * decel));
          sectorName = 'ARRIVING: GRAND CENTRAL TERMINAL';
        }

        setHudVelocity(`${baseSpeed} KM/H`);
        setHudTrainStatus(sectorName);
        setHudCoords(`LAT ${lat}° N · LON ${lon}° E`);

        if (baseSpeed > 100 && Math.abs(targetProgress - currentProgress) > 0.001) {
          emitSparks();
        }

        // Active milestone tracking
        const waypointThresholds = [0.1, 0.26, 0.42, 0.58, 0.74, 0.9];
        let foundWaypoint: number | null = null;
        waypointThresholds.forEach((thresh, idx) => {
          if (Math.abs(currentProgress - thresh) < 0.08) {
            foundWaypoint = idx + 1;
          }
        });
        setActiveWaypoint(foundWaypoint);
      }

      if (Math.abs(targetProgress - currentProgress) > 0.0003) {
        requestAnimationFrame(renderTrainFrame);
      } else {
        isTicking = false;
      }
    };

    const onScrollUpdate = () => {
      targetProgress = calculateScrollProgress();
      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(renderTrainFrame);
      }
    };

    let cruiseInterval: any = null;
    if (autoCruise) {
      cruiseInterval = setInterval(() => {
        targetProgress += 0.0028;
        if (targetProgress > 1) targetProgress = 0;
        if (!isTicking) {
          isTicking = true;
          requestAnimationFrame(renderTrainFrame);
        }
      }, 40);
    }

    window.addEventListener('scroll', onScrollUpdate, { passive: true });
    targetProgress = calculateScrollProgress();
    currentProgress = targetProgress;
    onScrollUpdate();

    return () => {
      window.removeEventListener('scroll', onScrollUpdate);
      if (cruiseInterval) clearInterval(cruiseInterval);
    };
  }, [autoCruise]);

  // Waypoint navigation helper
  const scrollToWaypoint = (step: number) => {
    const el = document.getElementById(`waypoint-anchor-${step}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (step === 7) {
      const portal = document.getElementById('terminal-portal');
      if (portal) portal.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Milestone interactions
  const handlePingKavach = () => {
    setKavachStatus('QUANTUM PINGING...');
    setKavachBlockText('Broadcasting UHF 433MHz Beacon...');
    setTimeout(() => {
      setKavachStatus('FAIL-SAFE LOCKED');
      setKavachBlockText('Block 109 · Clearance Verified (12ms)');
    }, 550);
  };

  const handleRerollTatkal = () => {
    setTatkalStatus('RE-SCANNING...');
    setTatkalBarWidth('25%');
    setTatkalPing('112ms Ping');
    setTimeout(() => {
      setTatkalBarWidth('100%');
      setTatkalStatus('99.8% ALLOCATED');
      setTatkalPing('240ms Ping');
    }, 450);
  };

  const temps = ['20.0°C', '21.5°C', '23.0°C'];
  const dampeners = ['34 dB', '28 dB (Ultra)', '42 dB (Open)'];
  const glassModes = ['Tint: Clear 10%', 'Tint: Dark Polarized 75%', 'Tint: Starlight Prism 45%'];

  return (
    <div className="bg-[#030816] text-[#d7e3fc] font-sans antialiased min-h-screen selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Starlight & Floating Dust Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* Atmospheric Moving Gradient Auras */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute top-[28%] right-10 w-[700px] h-[700px] bg-amber-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute top-[60%] left-6 w-[750px] h-[750px] bg-sky-500/15 blur-[170px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-8 w-[700px] h-[700px] bg-blue-600/15 blur-[160px] rounded-full animate-pulse" />
      </div>

      {/* ==================== WIDESCREEN NAVIGATION TOP BAR ==================== */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#030816]/80 border-b border-[#2a3548]/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand & Locomotive ID */}
          <div
            className="flex items-center gap-3 sm:gap-4 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-[#142032] to-[#ffb95f] flex items-center justify-center shadow-lg shadow-blue-600/30 border border-[#b4c5ff]/30 transition-transform hover:scale-105">
              <span className="material-symbols-outlined text-white text-[22px] sm:text-[24px]">train</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold tracking-wider text-sm sm:text-base lg:text-lg">
                  MIDNIGHT EXPRESS
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-widest bg-[#ffb95f]/15 text-[#ffb95f] border border-[#ffb95f]/30">
                  RAIL 12401
                </span>
              </div>
              <p className="text-[11px] text-[#c3c6d7] hidden sm:block">
                National Nocturnal High-Speed Rail Corridor
              </p>
            </div>
          </div>

          {/* Live GPS & Telemetry HUD Badges */}
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-[#142032]/70 border border-[#2a3548]/40 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb95f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb95f]"></span>
              </span>
              <span className="text-[#ffb95f] font-medium tracking-wide">TRACK 04 · CLEAR ROUTE</span>
              <span className="text-[#8d90a0]">|</span>
              <span className="text-[#7bd0ff] flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-[15px]">sensors</span> NAVIC GPS 99.8%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#c3c6d7] hover:text-white transition-colors"
              >
                Journey Corridor
              </button>
              <button
                onClick={() => {
                  document.getElementById('terminal-portal')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">airplane_ticket</span>
                <span>Reserve Berth</span>
              </button>
              {currentUser && (
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="hidden sm:flex px-3 py-2 rounded-lg bg-[#1f2a3d] hover:bg-[#2a3548] text-[#7bd0ff] font-semibold text-xs border border-[#7bd0ff]/30 items-center gap-1 transition-colors"
                >
                  <span>Dashboard ({currentUser.name.split(' ')[0]})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Waypoint Quick Jump Scrubber Bar */}
        <div className="border-t border-[#2a3548]/20 bg-[#030816]/60 backdrop-blur-md px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#c3c6d7] gap-4 min-w-[780px]">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#8d90a0] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#7bd0ff]">alt_route</span> Quick Jump:
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="quick-nav-btn px-2.5 py-1 rounded-md hover:bg-[#1f2a3d] hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
                onClick={() => scrollToWaypoint(1)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> 01 Departure
              </button>
              <button
                className="quick-nav-btn px-2.5 py-1 rounded-md hover:bg-[#1f2a3d] hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
                onClick={() => scrollToWaypoint(2)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> 02 Kavach 4.0
              </button>
              <button
                className="quick-nav-btn px-2.5 py-1 rounded-md hover:bg-[#1f2a3d] hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
                onClick={() => scrollToWaypoint(3)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f]"></span> 03 Tatkal AI
              </button>
              <button
                className="quick-nav-btn px-2.5 py-1 rounded-md hover:bg-[#1f2a3d] hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
                onClick={() => scrollToWaypoint(4)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span> 04 1AC Sleeper
              </button>
              <button
                className="quick-nav-btn px-2.5 py-1 rounded-md hover:bg-[#1f2a3d] hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
                onClick={() => scrollToWaypoint(5)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span> 05 Vistadome
              </button>
              <button
                className="quick-nav-btn px-2.5 py-1 rounded-md hover:bg-[#1f2a3d] hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
                onClick={() => scrollToWaypoint(6)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> 06 NavIC
              </button>
              <button
                className="quick-nav-btn px-2.5 py-1 rounded-md hover:bg-[#ffb95f]/20 hover:text-[#ffb95f] text-[#ffb95f] transition-all text-xs font-mono flex items-center gap-1.5 border border-[#ffb95f]/30"
                onClick={() => scrollToWaypoint(7)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f] animate-pulse"></span> 07 Terminal Gate
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full flex flex-col items-center">
        {/* ==================== HERO VIEW: DEPARTURE DOCK ==================== */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 lg:pt-14 pb-16 flex flex-col items-center relative">
          {/* Top Signal Beacon Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1f2a3d]/90 border border-[#434655] backdrop-blur-md mb-6 shadow-xl hover:border-[#ffb95f]/50 transition-all cursor-default">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffb95f] animate-pulse"></span>
            <span className="text-[#ffb95f] font-semibold text-xs tracking-widest uppercase">
              PLATFORM 04 · DEPARTURE READY
            </span>
            <span className="text-[#8d90a0] text-xs">•</span>
            <span className="text-[#7bd0ff] font-mono text-xs">CLEARANCE ID #DLH-882</span>
          </div>

          {/* Large Hero Title & Teaser */}
          <div className="text-center max-w-3xl mx-auto mb-10 px-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase leading-tight">
              THE MIDNIGHT{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b4c5ff] via-[#7bd0ff] to-[#ffb95f]">
                EXPRESS
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#c3c6d7] leading-relaxed font-normal">
              Transcending nocturnal voyages across India. Unmatched luxury coupes, AI-powered Tatkal confirmation, and
              sub-meter satellite telemetry under starlit horizons.
            </p>
          </div>

          {/* Hero Cinematic Engine Dock Widescreen Card */}
          <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl border border-[#2a3548]/50 bg-[#030816] group">
            <div
              className="relative w-full h-[340px] sm:h-[400px] lg:h-[480px] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.01]"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVdJlca6VjljgzVDP9StFIjZhTRgzH3XMrc2tBgvMqmpH0czj4QeIECZ5TXcnWfvsIOLdprAjJs09IrhTa8Qu2hiD3p6Mye5Iog0fgZL8XQ3iOR3d5rmtkI61fwlJVKpH4RMpmRFKahJJTCwBJLb3JL1mp-ldIsRp_q044hDSZG7Vube2Cwd_OkG4RRO4vEvv6dliIc1YhZ9zSvipwR6LkH79_ZRPYoqqCG5ekDtfjhQVqSzMAOyFeHQ')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#030816] via-[#030816]/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#030816]/80 via-transparent to-[#030816]/80"></div>

              {/* Dynamic Cockpit Overlay Badges */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#030816]/85 backdrop-blur-md border border-[#2a3548]/40 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-[#d7e3fc] font-mono text-[11px] sm:text-xs">
                  LOCOMOTIVE 12401 + 2 COACH CONVOY · CLEARANCE GRANTED
                </span>
              </div>
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#030816]/85 backdrop-blur-md border border-[#2a3548]/40 text-xs text-[#ffb95f] font-mono">
                <span className="material-symbols-outlined text-[16px]">wb_twilight</span>
                <span>2200K NOCTURNAL CABIN MODE</span>
              </div>

              {/* Bottom Telemetry HUD Bar */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-4 rounded-xl bg-[#1f2a3d]/90 backdrop-blur-md border border-[#2a3548]/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#ffb95f]/15 flex items-center justify-center text-[#ffb95f] border border-[#ffb95f]/30">
                      <span className="material-symbols-outlined text-[20px] sm:text-[22px]">speed</span>
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#c3c6d7] font-medium">
                        Max Velocity
                      </div>
                      <div className="text-[#ffb95f] font-bold text-base sm:text-lg font-mono">180 – 220 KM/H</div>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-[#2a3548] hidden md:block"></div>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-[#b4c5ff] border border-blue-500/30">
                      <span className="material-symbols-outlined text-[22px]">bolt</span>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#c3c6d7] font-medium">Power Grid</div>
                      <div className="text-[#b4c5ff] font-bold text-lg font-mono">25 kV AC Pantograph</div>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-[#2a3548] hidden lg:block"></div>
                  <div className="hidden lg:flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-600/30 flex items-center justify-center text-[#7bd0ff] border border-sky-400/30">
                      <span className="material-symbols-outlined text-[22px]">airline_seat_recline_extra</span>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#c3c6d7] font-medium">Current Status</div>
                      <div className="text-[#7bd0ff] font-bold text-lg">Suites 88% Reserved</div>
                    </div>
                  </div>
                </div>

                <button
                  className="shimmer-btn px-4 sm:px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wider uppercase transition-transform active:scale-95 flex items-center gap-2 shadow-lg"
                  onClick={() => document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span>Begin Track Descent</span>
                  <span className="material-symbols-outlined text-[18px]">south</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Invitation Indicator */}
          <div
            className="mt-8 flex flex-col items-center gap-2 text-[#7bd0ff] cursor-pointer hover:text-white transition-colors"
            onClick={() => document.getElementById('journey-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7bd0ff]/80 animate-pulse">
              Scroll to drive locomotive convoy along track
            </span>
            <div className="w-9 h-9 rounded-full bg-[#1f2a3d] border border-blue-500/30 flex items-center justify-center shadow-lg animate-bounce">
              <span className="material-symbols-outlined text-[#7bd0ff] text-[20px]">
                keyboard_double_arrow_down
              </span>
            </div>
          </div>
        </section>

        {/* ==================== THE EXTENDED S-CURVE INTERACTIVE TRACK CORRIDOR ==================== */}
        <section className="w-full relative py-12" id="journey-section">
          {/* Dynamic Live Train Status Floating Tracker Badge */}
          <div className="sticky top-20 sm:top-28 z-30 flex justify-center w-full px-4 mb-6">
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#14233c]/95 backdrop-blur-xl border border-blue-500/40 shadow-2xl text-xs transition-all duration-300 pointer-events-auto">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb95f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ffb95f]"></span>
              </span>
              <span className="material-symbols-outlined text-[#b4c5ff] text-[18px]">train</span>
              <span className="font-bold text-white uppercase tracking-wider font-mono text-[10px] sm:text-xs">
                {hudTrainStatus}
              </span>
              <span className="text-[#8d90a0]">|</span>
              <span className="text-[#ffb95f] font-mono font-semibold">{hudVelocity}</span>
              <span className="text-[#8d90a0]">|</span>
              <span className="text-[#7bd0ff] font-mono">{hudProgress}</span>
              <span className="text-[#8d90a0] hidden md:inline">|</span>
              <span className="text-[#dbe1ff] hidden md:inline font-mono text-[10px]">{hudCoords}</span>
              <span className="text-[#8d90a0]">|</span>
              <button
                type="button"
                onClick={() => setAutoCruise(!autoCruise)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition-all shadow-xs flex items-center gap-1 ${
                  autoCruise
                    ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-300 font-extrabold animate-pulse'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <span>{autoCruise ? '⏸ Pause Cruise' : '▶ Auto Drive Convoy'}</span>
              </button>
            </div>
          </div>

          {/* S-CURVE TRACK CANVAS CONTAINER */}
          <div
            ref={trackContainerRef}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-[4300px]"
            id="track-canvas-container"
          >
            {/* CONTINUOUS EXTENDED SVG S-CURVE DUAL TRACK */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
              id="railway-svg"
              preserveAspectRatio="none"
              viewBox="0 0 1200 4300"
            >
              <defs>
                <linearGradient id="neonTrackGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95"></stop>
                  <stop offset="16%" stopColor="#2563eb" stopOpacity="1"></stop>
                  <stop offset="34%" stopColor="#ffb95f" stopOpacity="1"></stop>
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="1"></stop>
                  <stop offset="68%" stopColor="#ffb95f" stopOpacity="1"></stop>
                  <stop offset="85%" stopColor="#7bd0ff" stopOpacity="0.95"></stop>
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="1"></stop>
                </linearGradient>
                <linearGradient id="activeGlowGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="1"></stop>
                  <stop offset="30%" stopColor="#7bd0ff" stopOpacity="1"></stop>
                  <stop offset="70%" stopColor="#ffb95f" stopOpacity="1"></stop>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="1"></stop>
                </linearGradient>
                <filter id="railBloom" x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur result="blur" stdDeviation="4.5"></feGaussianBlur>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                </filter>
              </defs>

              {/* 1. Railway Bed / Gravel Foundation */}
              <path
                d="M 600, -250 L 600, 50 C 920, 360 980, 680 600, 960 C 240, 1220 200, 1540 600, 1820 C 980, 2080 1000, 2400 600, 2680 C 220, 2960 220, 3280 600, 3560 C 960, 3820 900, 4080 600, 4260 L 600, 4420"
                fill="none"
                opacity="0.45"
                stroke="#101c2e"
                strokeLinecap="round"
                strokeWidth="58"
              />
              {/* 2. Neon Cross Sleepers */}
              <path
                d="M 600, -250 L 600, 50 C 920, 360 980, 680 600, 960 C 240, 1220 200, 1540 600, 1820 C 980, 2080 1000, 2400 600, 2680 C 220, 2960 220, 3280 600, 3560 C 960, 3820 900, 4080 600, 4260 L 600, 4420"
                fill="none"
                opacity="0.75"
                stroke="#1f2a3d"
                strokeDasharray="3, 16"
                strokeLinecap="round"
                strokeWidth="38"
              />
              {/* 3. Left Steel Rail */}
              <path
                d="M 586, -250 L 586, 50 C 906, 360 966, 680 586, 960 C 226, 1220 186, 1540 586, 1820 C 966, 2080 986, 2400 586, 2680 C 206, 2960 206, 3280 586, 3560 C 946, 3820 886, 4080 586, 4260 L 586, 4420"
                fill="none"
                filter="url(#railBloom)"
                opacity="0.9"
                stroke="url(#neonTrackGrad)"
                strokeWidth="3"
              />
              {/* 4. Right Steel Rail */}
              <path
                d="M 614, -250 L 614, 50 C 934, 360 994, 680 614, 960 C 254, 1220 214, 1540 614, 1820 C 994, 2080 1014, 2400 614, 2680 C 234, 2960 234, 3280 614, 3560 C 974, 3820 914, 4080 614, 4260 L 614, 4420"
                fill="none"
                filter="url(#railBloom)"
                opacity="0.9"
                stroke="url(#neonTrackGrad)"
                strokeWidth="3"
              />
              {/* 5. Dynamic Illuminated Glow Progress */}
              <path
                ref={trackGlowRef}
                d="M 600, -250 L 600, 50 C 920, 360 980, 680 600, 960 C 240, 1220 200, 1540 600, 1820 C 980, 2080 1000, 2400 600, 2680 C 220, 2960 220, 3280 600, 3560 C 960, 3820 900, 4080 600, 4260 L 600, 4420"
                fill="none"
                filter="url(#railBloom)"
                id="track-progress-glow"
                opacity="0.95"
                stroke="url(#activeGlowGrad)"
                strokeLinecap="round"
                strokeWidth="5"
              />
              {/* 6. Guidance Center Line */}
              <path
                ref={masterPathRef}
                d="M 600, -250 L 600, 50 C 920, 360 980, 680 600, 960 C 240, 1220 200, 1540 600, 1820 C 980, 2080 1000, 2400 600, 2680 C 220, 2960 220, 3280 600, 3560 C 960, 3820 900, 4080 600, 4260 L 600, 4420"
                fill="none"
                id="train-master-path"
                opacity="0.4"
                stroke="#7bd0ff"
                strokeDasharray="5, 12"
                strokeWidth="1.5"
              />

              {/* Milestone Station Nodes */}
              <circle cx="815" cy="480" r="14" fill="#071325" stroke="#38BDF8" strokeWidth="2.5" />
              <circle cx="815" cy="480" r="5" fill="#38BDF8" />

              <circle cx="420" cy="1180" r="14" fill="#071325" stroke="#ffb95f" strokeWidth="2.5" />
              <circle cx="420" cy="1180" r="5" fill="#ffb95f" />

              <circle cx="620" cy="1840" r="14" fill="#071325" stroke="#38BDF8" strokeWidth="2.5" />
              <circle cx="620" cy="1840" r="5" fill="#38BDF8" />

              <circle cx="770" cy="2500" r="14" fill="#071325" stroke="#ffb95f" strokeWidth="2.5" />
              <circle cx="770" cy="2500" r="5" fill="#ffb95f" />

              <circle cx="390" cy="3180" r="14" fill="#071325" stroke="#38BDF8" strokeWidth="2.5" />
              <circle cx="390" cy="3180" r="5" fill="#38BDF8" />

              <circle cx="810" cy="3840" r="14" fill="#071325" stroke="#ffb95f" strokeWidth="2.5" />
              <circle cx="810" cy="3840" r="5" fill="#ffb95f" />
            </svg>

            {/* ==================== ANIMATED 3-UNIT TRAIN CONVOY ==================== */}
            {/* Unit 1: Locomotive */}
            <div ref={locoRef} className="train-unit z-40" id="loco-unit">
              <div className="relative flex flex-col items-center justify-center">
                <div className="absolute -top-36 w-44 h-40 pointer-events-none loco-forward-cone"></div>
                <div className="absolute -top-16 w-16 h-20 pointer-events-none bg-gradient-to-t from-amber-300 via-sky-300/40 to-transparent blur-[6px]"></div>
                <div className="absolute inset-0 rounded-2xl loco-underglow bg-cyan-400/20 blur-md pointer-events-none"></div>
                <div ref={sparkContainerRef} className="absolute -bottom-6 inset-x-0 h-8 pointer-events-none overflow-visible" />

                <div className="w-14 h-24 rounded-2xl bg-gradient-to-b from-blue-600 via-[#1f2a3d] to-[#030816] border-2 border-[#b4c5ff]/70 shadow-[0_0_35px_rgba(37,99,235,0.85)] flex flex-col items-center justify-between p-2 relative overflow-hidden">
                  <div className="flex items-center justify-between w-full px-1 pt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffb95f] shadow-[0_0_12px_#ffb95f] ring-2 ring-amber-300"></span>
                    <span className="w-1.5 h-1 rounded-full bg-[#b4c5ff]/70"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffb95f] shadow-[0_0_12px_#ffb95f] ring-2 ring-amber-300"></span>
                  </div>
                  <div className="w-9 h-5 rounded-md bg-gradient-to-b from-[#7bd0ff]/40 to-[#030816] border border-[#7bd0ff]/60 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-[#7bd0ff] font-bold">12401</span>
                  </div>
                  <div className="w-7 space-y-1">
                    <div className="h-0.5 bg-[#b4c5ff]/40 rounded-full"></div>
                    <div className="h-0.5 bg-[#b4c5ff]/40 rounded-full"></div>
                    <div className="h-0.5 bg-[#b4c5ff]/40 rounded-full"></div>
                  </div>
                  <div className="w-3 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
                </div>

                <div className="absolute -right-28 top-3 px-2 py-0.5 rounded-md bg-[#030816]/90 border border-blue-500/40 text-[10px] font-mono text-white whitespace-nowrap shadow-lg backdrop-blur-sm">
                  LOCO 12401 <span className="text-[#ffb95f] font-bold">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Unit 2: Coach 01 (1AC) */}
            <div ref={coach1Ref} className="train-unit z-35" id="coach1-unit">
              <div className="relative flex flex-col items-center justify-center">
                <div className="absolute -top-3 w-7 h-3 rounded-sm bg-neutral-900 border border-[#2a3548] flex items-center justify-center">
                  <div className="w-4 h-1 bg-neutral-700 rounded-full"></div>
                </div>
                <div className="absolute inset-0 rounded-xl bg-cyan-400/15 blur-sm pointer-events-none"></div>

                <div
                  className="rounded-xl bg-gradient-to-b from-[#1f2a3d] via-[#142032] to-[#030816] border border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex flex-col items-center justify-between p-1.5 relative overflow-hidden"
                  style={{ width: '52px', height: '86px' }}
                >
                  <div className="w-8 h-1 bg-[#2a3548] rounded-full mt-0.5"></div>
                  <div className="w-full flex flex-col gap-1 px-1 my-auto">
                    <div className="flex justify-between items-center px-0.5">
                      <span className="w-3.5 h-2 rounded-[2px] bg-amber-200/90 shadow-[0_0_6px_#ffddb8]"></span>
                      <span className="w-3.5 h-2 rounded-[2px] bg-sky-200/90 shadow-[0_0_6px_#c4e7ff]"></span>
                    </div>
                    <div className="flex justify-between items-center px-0.5">
                      <span className="w-3.5 h-2 rounded-[2px] bg-amber-200/90 shadow-[0_0_6px_#ffddb8]"></span>
                      <span className="w-3.5 h-2 rounded-[2px] bg-amber-200/90 shadow-[0_0_6px_#ffddb8]"></span>
                    </div>
                    <div className="flex justify-between items-center px-0.5">
                      <span className="w-3.5 h-2 rounded-[2px] bg-sky-200/90 shadow-[0_0_6px_#c4e7ff]"></span>
                      <span className="w-3.5 h-2 rounded-[2px] bg-amber-200/90 shadow-[0_0_6px_#ffddb8]"></span>
                    </div>
                  </div>
                  <div className="text-[8px] font-mono text-[#7bd0ff] tracking-wider uppercase mb-0.5">C1 · 1AC</div>
                </div>
              </div>
            </div>

            {/* Unit 3: Coach 02 (Pantry & Tail Markers) */}
            <div ref={coach2Ref} className="train-unit z-30" id="coach2-unit">
              <div className="relative flex flex-col items-center justify-center">
                <div className="absolute -top-3 w-7 h-3 rounded-sm bg-neutral-900 border border-[#2a3548] flex items-center justify-center">
                  <div className="w-4 h-1 bg-neutral-700 rounded-full"></div>
                </div>
                <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-sm pointer-events-none"></div>

                <div
                  className="rounded-xl bg-gradient-to-b from-[#1f2a3d] via-[#142032] to-[#030816] border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.35)] flex flex-col items-center justify-between p-1.5 relative overflow-hidden"
                  style={{ width: '52px', height: '86px' }}
                >
                  <div className="w-8 h-1 bg-[#2a3548] rounded-full mt-0.5"></div>
                  <div className="w-full flex flex-col gap-1 px-1 my-auto">
                    <div className="flex justify-between items-center px-0.5">
                      <span className="w-3.5 h-2 rounded-[2px] bg-amber-200/85 shadow-[0_0_5px_#ffddb8]"></span>
                      <span className="w-3.5 h-2 rounded-[2px] bg-amber-200/85 shadow-[0_0_5px_#ffddb8]"></span>
                    </div>
                    <div className="flex justify-between items-center px-0.5">
                      <span className="w-3.5 h-2 rounded-[2px] bg-sky-200/85 shadow-[0_0_5px_#c4e7ff]"></span>
                      <span className="w-3.5 h-2 rounded-[2px] bg-sky-200/85 shadow-[0_0_5px_#c4e7ff]"></span>
                    </div>
                    <div className="flex justify-between items-center px-0.5">
                      <span className="w-3.5 h-2 rounded-[2px] bg-amber-200/85 shadow-[0_0_5px_#ffddb8]"></span>
                      <span className="w-3.5 h-2 rounded-[2px] bg-amber-200/85 shadow-[0_0_5px_#ffddb8]"></span>
                    </div>
                  </div>
                  <div className="text-[8px] font-mono text-[#c3c6d7] tracking-wider uppercase">C2 · PANTRY</div>
                  <div className="flex items-center justify-between w-full px-1.5 pb-0.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] ring-1 ring-rose-300 animate-pulse"></span>
                    <span className="w-4 h-1 rounded-sm bg-[#2a3548]"></span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] ring-1 ring-rose-300 animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== 6 ALTERNATING MILESTONE CARDS ==================== */}
            {/* MILESTONE 1: Departure Telemetry (Left) */}
            <div className="relative pt-20 mb-52 flex justify-start items-center" id="waypoint-anchor-1">
              <div
                className={`tilt-card w-full lg:w-[480px] transition-all duration-300 ${
                  activeWaypoint === 1 ? 'ring-2 ring-sky-400' : ''
                }`}
              >
                <div className="tilt-card-inner p-6 border border-[#2a3548]/80 shadow-2xl relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7bd0ff] via-blue-600 to-transparent"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-900/30 text-[#7bd0ff] text-xs font-semibold uppercase tracking-wider border border-[#7bd0ff]/30">
                      <span className="material-symbols-outlined text-[15px]">sensors</span> Milestone #01 · Departure
                    </span>
                    <span className="text-[#ffb95f] text-xs font-mono font-bold">220 KM/H CRUISE</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">High-Speed Midnight Departure</h3>
                  <p className="text-sm text-[#c3c6d7] leading-relaxed mb-4">
                    AI Pantograph monitoring system synchronizes with smart overhead 25kV power corridors. Biometric platform
                    checkpoints ensure expedited zero-queue passenger boarding in under 90 seconds.
                  </p>
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#030816]/80 border border-[#2a3548]/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-600/20 flex items-center justify-center text-[#b4c5ff]">
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#c3c6d7]">Traction Matrix</div>
                        <div className="text-xs font-semibold text-white">Dynamic 12,000 HP</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-[#ffb95f]/15 flex items-center justify-center text-[#ffb95f]">
                        <span className="material-symbols-outlined text-[18px]">security</span>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#c3c6d7]">KAVACH 4.0 Grid</div>
                        <div className="text-xs font-semibold text-[#ffb95f]">Active Radio Lock</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MILESTONE 2: KAVACH 4.0 Collision Shield (Right) */}
            <div className="relative pt-12 mb-52 flex justify-end items-center" id="waypoint-anchor-2">
              <div
                className={`tilt-card w-full lg:w-[490px] transition-all duration-300 ${
                  activeWaypoint === 2 ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                <div className="tilt-card-inner p-6 border border-[#2a3548]/80 shadow-2xl relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffb95f] via-amber-400 to-transparent"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffb95f]/15 text-[#ffb95f] text-xs font-semibold uppercase tracking-wider border border-[#ffb95f]/30">
                      <span className="material-symbols-outlined text-[15px]">shield</span> Milestone #02 · Kavach 4.0
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">
                      {kavachStatus}
                    </span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">KAVACH 4.0 Collision Shield</h3>
                  <p className="text-sm text-[#c3c6d7] leading-relaxed mb-4">
                    Direct UHF radio transponder block protection coupled with millisecond automatic braking protocols.
                    Ultra-dense quantum beacon telemetry guarantees zero SPAD (Signal Passed At Danger) anomalies.
                  </p>
                  <div className="p-3.5 rounded-xl bg-[#030816]/80 border border-[#2a3548]/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#c3c6d7] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> Radio Block Clearance
                      </span>
                      <span className="text-xs font-mono text-[#ffb95f] font-bold">{kavachBlockText}</span>
                    </div>
                    <div className="w-full bg-[#1f2a3d] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 via-[#ffb95f] to-emerald-400 rounded-full w-[96%]"></div>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[#d7e3fc] flex items-center gap-1">
                        <span className="material-symbols-outlined text-emerald-400 text-[15px]">verified_user</span>
                        Continuous Track Signal Lock
                      </span>
                      <button
                        className="text-[#7bd0ff] hover:text-white font-mono text-[11px] underline transition-colors"
                        onClick={handlePingKavach}
                      >
                        Ping Safety Beacon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MILESTONE 3: Tatkal AI (Left) */}
            <div className="relative pt-12 mb-52 flex justify-start items-center" id="waypoint-anchor-3">
              <div
                className={`tilt-card w-full lg:w-[490px] transition-all duration-300 ${
                  activeWaypoint === 3 ? 'ring-2 ring-sky-400' : ''
                }`}
              >
                <div className="tilt-card-inner p-6 border border-[#2a3548]/80 shadow-2xl relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffb95f] via-blue-600 to-transparent"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffb95f]/15 text-[#ffb95f] text-xs font-semibold uppercase tracking-wider border border-[#ffb95f]/30">
                      <span className="material-symbols-outlined text-[15px]">psychology</span> Milestone #03 · Tatkal AI v4.2
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">
                      {tatkalStatus}
                    </span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Instant PNR &amp; Berth Allocation</h3>
                  <p className="text-sm text-[#c3c6d7] leading-relaxed mb-4">
                    Predictive neural booking routes emergency tatkal allocations, solo traveler safety corridors, and locked
                    First-Class 1AC coupes in 240ms with direct IRCTC database syncing.
                  </p>
                  <div className="p-3.5 rounded-xl bg-[#030816]/80 border border-[#2a3548]/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#c3c6d7] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Auto-Confirm Algorithm
                      </span>
                      <span className="text-xs font-mono text-blue-400 font-bold">{tatkalPing}</span>
                    </div>
                    <div className="w-full bg-[#1f2a3d] h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-[#7bd0ff] to-[#ffb95f] rounded-full transition-all duration-700"
                        style={{ width: tatkalBarWidth }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[#d7e3fc] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#ffb95f] text-[14px]">check_circle</span>
                        Priority Lower Berth Locked
                      </span>
                      <button
                        className="text-[#ffb95f] hover:text-white font-mono text-[11px] underline transition-colors"
                        onClick={handleRerollTatkal}
                      >
                        Re-run AI Match
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MILESTONE 4: 1AC Grand Suite (Right) */}
            <div className="relative pt-12 mb-52 flex justify-end items-center" id="waypoint-anchor-4">
              <div
                className={`tilt-card w-full lg:w-[500px] transition-all duration-300 ${
                  activeWaypoint === 4 ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                <div className="tilt-card-inner p-6 border border-[#2a3548]/80 shadow-2xl relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7bd0ff] via-[#ffb95f] to-blue-600"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-[#b4c5ff] text-xs font-semibold uppercase tracking-wider border border-blue-500/30">
                      <span className="material-symbols-outlined text-[15px]">king_bed</span> Milestone #04 · 1AC Grand Suite
                    </span>
                    <span className="text-[#7bd0ff] text-xs font-mono">SOUND ISOLATED CABIN</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">1AC Royal Sleeper &amp; Coupe Suites</h3>
                  <p className="text-sm text-[#c3c6d7] leading-relaxed mb-4">
                    Soundproofed mahogany coupe compartments featuring memory-foam bunks, 2200K circadian mood lighting, panoramic
                    starlight viewports, and 24/7 midnight gourmet butler pantry.
                  </p>

                  <div
                    className="w-full h-44 rounded-xl overflow-hidden relative mb-4 bg-[#030816] border border-[#2a3548]/50 group cursor-pointer"
                    onClick={() => setWarmMode(prev => !prev)}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCIovxi0u9_nxKVNby25E8uopxr_F0bwH2nFyfM_n5KNwNY0RUHR6IEJQ5MvxHEw8S5nxeHrRARaRLWwYOsOY6I1R32LXdJFfhp4BljTKtDDE8C3_uBAv5tTsIh39iSPbYIPpzxTNvR9hoLu28behpRB4xTuWb2pDFDBBEZmT96MNEDVOL7Kj3qsTvHf1d2Nq3vz277u4b2zQEFFUPsyM4J8BURL93xyq0nWgjhJc4HfixCMlqcq81xQQ')",
                        filter: warmMode ? 'sepia(25%) saturate(120%)' : 'none',
                      }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030816] via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded-md bg-[#030816]/90 backdrop-blur-md border border-white/10 text-white font-mono text-xs flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#ffb95f] text-[14px]">verified</span>
                      <span>Coupe Suite 04 · Dual Berth &amp; Private Lavatory</span>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] bg-black/60 backdrop-blur-md text-[#ffb95f] border border-[#ffb95f]/30">
                      Click image to toggle 2200K / 4000K
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <button
                      className="p-2.5 rounded-lg bg-[#101c2e] hover:bg-[#1f2a3d] border border-[#2a3548]/40 transition-all text-left"
                      onClick={() => setClimateIdx((climateIdx + 1) % temps.length)}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#c3c6d7]">
                        <span>Climate</span>
                        <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">thermostat</span>
                      </div>
                      <div className="font-bold text-[#ffb95f] text-sm font-mono mt-0.5">{temps[climateIdx]}</div>
                    </button>
                    <button
                      className="p-2.5 rounded-lg bg-[#101c2e] hover:bg-[#1f2a3d] border border-[#2a3548]/40 transition-all text-left"
                      onClick={() => setWhisperIdx((whisperIdx + 1) % dampeners.length)}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#c3c6d7]">
                        <span>Whisper</span>
                        <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">volume_mute</span>
                      </div>
                      <div className="font-bold text-[#ffb95f] text-sm font-mono mt-0.5">{dampeners[whisperIdx]}</div>
                    </button>
                    <button
                      className="p-2.5 rounded-lg bg-[#101c2e] hover:bg-[#1f2a3d] border border-[#2a3548]/40 transition-all text-left"
                      onClick={() => setWarmMode(!warmMode)}
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#c3c6d7]">
                        <span>Mood Glow</span>
                        <span className="material-symbols-outlined text-[14px] text-[#ffb95f]">wb_sunny</span>
                      </div>
                      <div className="font-bold text-[#ffb95f] text-sm font-mono mt-0.5">{warmMode ? '2200K' : '4000K'}</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MILESTONE 5: Vistadome (Left) */}
            <div className="relative pt-12 mb-52 flex justify-start items-center" id="waypoint-anchor-5">
              <div
                className={`tilt-card w-full lg:w-[490px] transition-all duration-300 ${
                  activeWaypoint === 5 ? 'ring-2 ring-sky-400' : ''
                }`}
              >
                <div className="tilt-card-inner p-6 border border-[#2a3548]/80 shadow-2xl relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-blue-600 to-[#7bd0ff]"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-900/30 text-[#7bd0ff] text-xs font-semibold uppercase tracking-wider border border-[#7bd0ff]/30">
                      <span className="material-symbols-outlined text-[15px]">auto_awesome</span> Milestone #05 · Vistadome
                    </span>
                    <span className="text-sky-300 font-mono text-xs font-bold">180° SKY VIEWPORT</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Vistadome Starlight Lounge</h3>
                  <p className="text-sm text-[#c3c6d7] leading-relaxed mb-4">
                    Floor-to-ceiling curved smart electrochromic glass coach. Includes interactive celestial star maps, real-time
                    constellation projection, and ambient binaural soundscapes tuned for deep relaxation.
                  </p>
                  <div className="p-3.5 rounded-xl bg-[#030816]/80 border border-[#2a3548]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-950/60 border border-sky-400/40 flex items-center justify-center text-sky-400">
                          <span className="material-symbols-outlined text-[18px]">bedtime</span>
                        </div>
                        <div>
                          <div className="text-xs text-white font-semibold">Overhead Orion Zenith</div>
                          <div className="text-[11px] text-[#c3c6d7]">Cloud Cover: 4% (Clear Starlight)</div>
                        </div>
                      </div>
                      <button
                        className="px-2.5 py-1 rounded bg-[#1f2a3d] hover:bg-[#2a3548] text-[#7bd0ff] text-[11px] font-mono border border-[#7bd0ff]/30 transition-colors"
                        onClick={() => setTintIdx((tintIdx + 1) % glassModes.length)}
                      >
                        <span>{glassModes[tintIdx]}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-lg bg-[#1f2a3d]/60 border border-[#2a3548]/30 flex items-center justify-between">
                        <span className="text-[#c3c6d7]">Audio Guide</span>
                        <span className="text-[#ffb95f] font-mono">Binaural 432Hz</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#1f2a3d]/60 border border-[#2a3548]/30 flex items-center justify-between">
                        <span className="text-[#c3c6d7]">Observation Deck</span>
                        <span className="text-emerald-400 font-mono">Open Access</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MILESTONE 6: NavIC Satellite Telemetry (Right) */}
            <div className="relative pt-12 mb-36 flex justify-end items-center" id="waypoint-anchor-6">
              <div
                className={`tilt-card w-full lg:w-[490px] transition-all duration-300 ${
                  activeWaypoint === 6 ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                <div className="tilt-card-inner p-6 border border-[#2a3548]/80 shadow-2xl relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-[#7bd0ff] to-[#ffb95f]"></div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 text-[#7bd0ff] text-xs font-semibold uppercase tracking-wider border border-[#7bd0ff]/30">
                      <span className="material-symbols-outlined text-[15px]">radar</span> Milestone #06 · Telemetry
                    </span>
                    <span className="text-emerald-400 font-mono text-xs font-bold">ON-TIME: ZERO DELAY</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Sub-Meter NavIC Satellite Telemetry</h3>
                  <p className="text-sm text-[#c3c6d7] leading-relaxed mb-4">
                    Dual-satellite indigenous NavIC transponders stream position telemetry every 300ms. Coach alignment radar
                    matches your compartment precisely to platform markings before stopping.
                  </p>
                  <div className="p-4 rounded-xl bg-[#030816]/80 border border-[#2a3548]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-sky-400/40 relative overflow-hidden flex items-center justify-center bg-sky-950/40">
                          <div className="radar-sweep"></div>
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 z-10 animate-ping"></span>
                        </div>
                        <div>
                          <div className="text-xs text-white font-semibold">Platform Alignment Lock</div>
                          <div className="text-[11px] text-[#c3c6d7]">Switching to Dock 01</div>
                        </div>
                      </div>
                      <span className="text-lg font-mono font-bold text-[#ffb95f]">168 KM/H</span>
                    </div>
                    <div className="w-full bg-[#1f2a3d] h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#7bd0ff] to-[#ffb95f] rounded-full w-[92%]"></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#c3c6d7] pt-0.5 font-mono">
                      <span>Distance to Terminal: 2.1 km</span>
                      <span className="text-[#7bd0ff]">EST ARRIVAL: 00:45 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TERMINAL ARRIVAL & MASTER AUTHENTICATION PORTAL ==================== */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-20" id="terminal-portal">
          {/* Terminal Grand Signboard */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a3548] border border-[#434655]/60 text-[#ffb95f] text-xs font-semibold uppercase tracking-widest mb-3 shadow-lg">
              <span className="material-symbols-outlined text-[16px]">account_balance</span>
              Terminal Grand Central · Platform Gate 01
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Ready for Departure
            </h2>
            <p className="text-sm sm:text-base text-[#c3c6d7] mt-2 max-w-md mx-auto">
              Authenticate your passenger credentials to download boarding passes, reserve luxury berths, and view live coupe
              telemetry.
            </p>
          </div>

          {/* Master Glassmorphic Auth Portal Card */}
          <div className="w-full bg-[#142032]/95 backdrop-blur-2xl border border-[#2a3548]/80 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-20 bg-blue-500/25 blur-3xl pointer-events-none"></div>

            {/* Mode Switcher Tabs with Sliding Backdrop Pill */}
            <div
              className="relative p-1.5 rounded-xl bg-[#101c2e] border border-[#2a3548]/50 max-w-md mx-auto mb-8 grid grid-cols-2"
              role="tablist"
            >
              <div
                className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-blue-600 rounded-lg shadow-md transition-all duration-300 pointer-events-none ${
                  authMode === 'signup' ? 'translate-x-full' : 'translate-x-0'
                }`}
              ></div>
              <button
                className={`relative z-10 py-2.5 px-4 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
                  authMode === 'login' ? 'text-white' : 'text-[#c3c6d7] hover:text-white'
                }`}
                onClick={() => setAuthMode('login')}
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">login</span>
                Passenger Login
              </button>
              <button
                className={`relative z-10 py-2.5 px-4 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 ${
                  authMode === 'signup' ? 'text-white' : 'text-[#c3c6d7] hover:text-white'
                }`}
                onClick={() => setAuthMode('signup')}
                type="button"
              >
                <span className="material-symbols-outlined text-[17px]">person_add</span>
                New Passenger
              </button>
            </div>

            {/* Form */}
            <form className="max-w-xl mx-auto space-y-5" onSubmit={handleAuthSubmit}>
              {/* Passenger Full Name Field (Crucial: Whatever name is entered reflects in whole website!) */}
              <div className="auth-input-group">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#d7e3fc] transition-colors" htmlFor="passenger-name">
                    Passenger Full Name (Reflects Across Tickets &amp; Records)
                  </label>
                  <span className="text-[#7bd0ff] text-xs flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-[14px]">verified</span> Primary Traveler
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-[#c3c6d7]">
                    <span className="material-symbols-outlined text-[20px]">badge</span>
                  </div>
                  <input
                    id="passenger-name"
                    type="text"
                    required
                    value={passengerName}
                    onChange={e => setPassengerName(e.target.value)}
                    placeholder="e.g. Snehith Varma"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#030816] border border-[#2a3548]/60 text-white placeholder:text-[#8d90a0]/70 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Field 1: User ID / Mobile */}
              <div className="auth-input-group">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#d7e3fc] transition-colors" htmlFor="passenger-id">
                    IRCTC User ID / Mobile Number
                  </label>
                  <span className="text-emerald-400 text-xs flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Valid Format
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-[#c3c6d7]">
                    <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
                  </div>
                  <input
                    id="passenger-id"
                    type="text"
                    required
                    value={passengerId}
                    onChange={e => setPassengerId(e.target.value)}
                    placeholder="e.g. ME984201 or +91 98765 43210"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#030816] border border-[#2a3548]/60 text-white placeholder:text-[#8d90a0]/70 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all font-mono"
                  />
                </div>
              </div>

              {/* Field 2: Password / MPIN */}
              <div className="auth-input-group">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#d7e3fc] transition-colors" htmlFor="passenger-secret">
                    Password or 4-Digit MPIN
                  </label>
                  <button
                    className="text-[#7bd0ff] hover:underline text-xs"
                    type="button"
                    onClick={() => showToast('Reset token dispatched to registered IRCTC mobile!')}
                  >
                    Forgot MPIN?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center pointer-events-none text-[#c3c6d7]">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <input
                    id="passenger-secret"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passengerSecret}
                    onChange={e => setPassengerSecret(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-[#030816] border border-[#2a3548]/60 text-white placeholder:text-[#8d90a0]/70 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-all font-mono tracking-widest"
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-3.5 text-[#c3c6d7] hover:text-white p-1 transition-transform active:scale-90"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Checkbox Options */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    checked={rememberPrefs}
                    onChange={e => setRememberPrefs(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#030816] border-[#2a3548] text-blue-600 focus:ring-0 transition-transform active:scale-90"
                    type="checkbox"
                  />
                  <span className="text-xs text-[#c3c6d7] hover:text-white transition-colors">
                    Remember my berth preferences &amp; dinner order
                  </span>
                </label>
                <span className="text-xs text-[#8d90a0] hidden sm:inline">Encrypted Tunnel #24</span>
              </div>

              {/* Prominent CTA Button */}
              <button
                disabled={submitting}
                className="shimmer-btn w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/25 transition-all hover:shadow-blue-600/50 active:scale-[0.98] border border-blue-400/30"
                type="submit"
              >
                <span className="material-symbols-outlined text-[20px]">train</span>
                <span>
                  {submitting
                    ? 'Synchronizing with IRCTC Gateway...'
                    : authMode === 'signup'
                    ? `Create Rail ID for ${passengerName || 'Passenger'}`
                    : `Authorize & Board Train as ${passengerName || 'Passenger'}`}
                </span>
              </button>

              {/* One-Click Quick Demo Sign-Ins for immediate convenience */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const finalName = passengerName.trim() || 'Snehith Varma';
                    setPassengerName(finalName);
                    loginUser('USER', 'snehith@midnight.express', finalName);
                    setActiveView('dashboard');
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#1f2a3d] hover:bg-[#2a3548] text-xs font-semibold text-white border border-blue-500/30 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>1-Click Demo: Snehith Varma</span>
                </button>
                <button
                  type="button"
                  onClick={handleAdminQuickLogin}
                  className="py-2 px-3 rounded-lg bg-[#1f2a3d] hover:bg-[#2a3548] text-xs font-semibold text-[#ffb95f] border border-[#ffb95f]/30 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">shield_person</span>
                  <span>Chief Controller (Admin)</span>
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative flex py-6 items-center max-w-xl mx-auto">
              <div className="flex-grow h-px bg-[#2a3548]/70"></div>
              <span className="flex-shrink mx-4 text-[#8d90a0] text-xs uppercase tracking-widest font-mono">
                Fast Pass Clearance
              </span>
              <div className="flex-grow h-px bg-[#2a3548]/70"></div>
            </div>

            {/* Biometric Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
              <button
                className="p-3.5 rounded-xl bg-[#101c2e] hover:bg-[#1f2a3d] border border-[#2a3548]/40 transition-all flex items-center justify-center gap-2.5 text-[#d7e3fc] text-xs font-semibold active:scale-95 group hover:border-[#ffb95f]/50"
                onClick={() => {
                  const finalName = passengerName.trim() || 'Snehith Varma';
                  showToast('Biometric Face ID scanned! Authenticating...');
                  setTimeout(() => {
                    loginUser('USER', 'snehith@midnight.express', finalName);
                    setActiveView('dashboard');
                  }, 500);
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-[#ffb95f] text-[22px] group-hover:scale-110 transition-transform">
                  fingerprint
                </span>
                <span>Biometric Touch / Face ID</span>
              </button>
              <button
                className="p-3.5 rounded-xl bg-[#101c2e] hover:bg-[#1f2a3d] border border-[#2a3548]/40 transition-all flex items-center justify-center gap-2.5 text-[#d7e3fc] text-xs font-semibold active:scale-95 group hover:border-[#7bd0ff]/50"
                onClick={() => {
                  const finalName = passengerName.trim() || 'Snehith Varma';
                  showToast('IRCTC Rail e-Wallet linked: Balance ₹4,850');
                  setTimeout(() => {
                    loginUser('USER', 'snehith@midnight.express', finalName);
                    setActiveView('dashboard');
                  }, 500);
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-[#7bd0ff] text-[22px] group-hover:scale-110 transition-transform">
                  account_balance_wallet
                </span>
                <span>IRCTC Rail e-Wallet</span>
              </button>
            </div>

            {/* Promo Banner */}
            <div className="mt-8 max-w-xl mx-auto p-4 rounded-xl bg-[#ee9800]/15 border border-[#ffb95f]/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#ffb95f] text-[22px] flex-shrink-0 mt-0.5">stars</span>
              <div>
                <div className="text-[#ffb95f] font-bold text-xs uppercase tracking-wider">
                  First Nocturnal Journey?
                </div>
                <div className="text-[#d7e3fc] text-xs mt-0.5 leading-relaxed">
                  Enroll today in the Midnight RailMiles Tier. Receive an instant ₹250 deduction on your First Class Coupe
                  Suite reservation.
                </div>
              </div>
            </div>

            {/* Trust Badges Row */}
            <div className="mt-8 pt-6 border-t border-[#2a3548]/40 flex flex-wrap items-center justify-center gap-6 text-xs text-[#c3c6d7]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#7bd0ff]">lock</span>
                <span>256-Bit IRCTC SSL Encryption</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ffb95f]">verified</span>
                <span>Official High-Speed Rail Directorate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-blue-400">support_agent</span>
                <span>24/7 Concierge: 139</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== WIDESCREEN FOOTER ==================== */}
      <footer className="w-full border-t border-[#2a3548]/40 bg-[#030816] relative z-10 py-10 px-6 lg:px-12 text-xs text-[#c3c6d7]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-blue-400 text-[24px]">train</span>
            <div>
              <div className="text-white font-semibold tracking-wider">MIDNIGHT EXPRESS CORPORATION</div>
              <div className="text-[#8d90a0] text-[11px]">
                Next-Generation Indian Nocturnal Transit © 2026. All Rights Reserved.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> GPS LINK ACTIVE
            </span>
            <span className="text-[#8d90a0]">|</span>
            <span>SERVER PING: 18ms</span>
            <span className="text-[#8d90a0]">|</span>
            <button
              onClick={() => setActiveView('dashboard')}
              className="hover:text-blue-400 transition-colors text-left"
            >
              Passenger Dispatch System
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
