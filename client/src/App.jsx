import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { auth, googleProvider, githubProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const POPULAR_BRANDS = [
  { name: 'Netflix', color: 'rgba(229,9,20,1)' },
  { name: 'Spotify', color: 'rgba(29,185,84,1)' },
  { name: 'Amazon Prime', color: 'rgba(0,168,225,1)' },
  { name: 'Disney+', color: 'rgba(17,60,207,1)' },
  { name: 'Hulu', color: 'rgba(28,231,131,1)' },
  { name: 'Apple Music', color: 'rgba(250,36,60,1)' },
  { name: 'YouTube Premium', color: 'rgba(255,0,0,1)' },
  { name: 'ChatGPT Plus', color: 'rgba(16,163,127,1)' },
  { name: 'Adobe Creative Cloud', color: 'rgba(255,0,0,1)' },
  { name: 'Notion', color: 'rgba(200,200,200,1)' },
];

const CURRENCY_SYMBOLS = { USD: '$', INR: '₹', EUR: '€', JPY: '¥', GBP: '£' };

function Starfield() {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    const generatedStars = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 3 + 2,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [star.opacity, Math.min(1, star.opacity * 2.5), star.opacity] }}
          transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full bg-cyan-100"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.8)`
          }}
        />
      ))}
    </div>
  );
}

function ShootingStars() {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    let timeoutId;
    const spawnMeteor = () => {
      const newMeteor = {
        id: Date.now(),
        top: Math.random() * 30 - 10, 
        left: Math.random() * 60 + 40, 
      };
      setMeteors(current => [...current, newMeteor]);
      
      setTimeout(() => {
        setMeteors(current => current.filter(m => m.id !== newMeteor.id));
      }, 1000);

      timeoutId = setTimeout(spawnMeteor, Math.random() * 3000 + 2000);
    };

    spawnMeteor();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {meteors.map(meteor => (
        <motion.div
          key={meteor.id}
          initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: -45 }}
          animate={{ opacity: 0, x: -1200, y: 1200, scale: 0.2, rotate: -45 }}
          transition={{ duration: 0.6, ease: "easeIn" }}
          className="absolute h-0.5 w-32 bg-gradient-to-l from-transparent via-cyan-200 to-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]"
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
          }}
        />
      ))}
    </div>
  );
}

function ParticleWake({ mouseX, mouseY }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    let lastSpawn = 0;
    const handleMouseMove = () => {
      const now = Date.now();
      if (now - lastSpawn < 16) return;
      lastSpawn = now;

      const cx = mouseX.get();
      const cy = mouseY.get();
      if (cx < 0 || cy < 0) return;

      const newParticles = Array.from({ length: 4 }).map(() => ({
        id: Math.random().toString(36),
        timestamp: now,
        x: cx,
        y: cy,
        offsetX: (Math.random() - 0.5) * 100,
        offsetY: (Math.random() - 0.5) * 100,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? '#00ffff' : '#ff00ff'
      }));

      setParticles(prev => [...prev.slice(-30), ...newParticles]);
    };

    const unsub = mouseX.on("change", handleMouseMove);
    return () => unsub();
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setParticles(prev => prev.filter(p => now - p.timestamp < 400));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
          animate={{ x: p.x + p.offsetX, y: p.y + p.offsetY, opacity: 0, scale: 0.1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute rounded-full shadow-[0_0_10px_currentColor]"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            color: p.color,
            marginTop: -p.size / 2,
            marginLeft: -p.size / 2,
          }}
        />
      ))}
    </div>
  );
}

function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
      {/* Planet 1: Large Purple Gas Giant */}
      <motion.div
        animate={{ 
          x: ['0vw', '10vw', '0vw'],
          y: ['0vh', '-5vh', '0vh'],
          rotate: [0, 360]
        }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 -left-20 w-[40vw] h-[40vw] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(0,0,0,0) 70%)' }}
      />
      
      {/* Planet 2: Cyan Ice Giant */}
      <motion.div
        animate={{ 
          x: ['0vw', '-10vw', '0vw'],
          y: ['0vh', '10vh', '0vh'],
          rotate: [360, 0]
        }}
        transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 -right-20 w-[30vw] h-[30vw] rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, rgba(0,0,0,0) 70%)' }}
      />

      {/* Galaxy: Pinkish Nebula */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(236,72,153,0.3) 0%, rgba(0,0,0,0) 60%)' }}
      />
    </div>
  );
}

function UFO() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(k => k + 1);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <motion.div
        key={key}
        initial={{ x: '-10vw', y: '80vh', rotate: 10, scale: 0.5, opacity: 0 }}
        animate={{ 
          x: ['-10vw', '50vw', '110vw'], 
          y: ['80vh', '20vh', '10vh'],
          rotate: [10, -20, -30],
          opacity: [0, 1, 0]
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="absolute w-12 h-4 rounded-full bg-slate-300 shadow-[0_0_20px_rgba(6,182,212,1)] flex items-center justify-center"
      >
        <div className="absolute -top-2 w-6 h-4 rounded-t-full bg-cyan-400/50 backdrop-blur-sm border border-cyan-300/30 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
        <div className="flex gap-1 w-full px-2 justify-between">
          <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
          <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}

function AuthModal({ onClose, onSimulateLogin }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMethod, setAuthMethod] = useState(null);
  const [email, setEmail] = useState('');
  const [authError, setAuthError] = useState(null);

  const handleLogin = async (e, method) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAuthenticating(true);
    setAuthMethod(method);
    setAuthError(null);
    try {
      if (method === 'Google') {
        await signInWithPopup(auth, googleProvider);
      } else if (method === 'GitHub') {
        await signInWithPopup(auth, githubProvider);
      } else {
        // Magic Link simulated for now
        await new Promise(r => setTimeout(r, 1000));
      }
      setAuthError(null);
      onSimulateLogin();
    } catch (error) {
      console.error("Auth error:", error);
      setAuthError(error.message);
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Cinematic Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-[#0b0618]/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-[0_0_80px_rgba(6,182,212,0.15)] flex flex-col gap-6"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mt-2">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Sync Your Universe</h2>
          <p className="text-slate-400 text-sm">Save your subscriptions securely to the cloud.</p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={(e) => handleLogin(e, 'Google')}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 px-4 text-white font-medium flex items-center justify-center gap-3 transition-all group relative overflow-hidden"
          >
            {isAuthenticating && authMethod === 'Google' ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
              </>
            )}
          </button>
          
          <button 
            onClick={(e) => handleLogin(e, 'GitHub')}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 px-4 text-white font-medium flex items-center justify-center gap-3 transition-all"
          >
            {isAuthenticating && authMethod === 'GitHub' ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Continue with GitHub
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 my-2">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Or</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="flex flex-col gap-3">
          <input 
            type="email" 
            placeholder="name@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:bg-white/10 focus:border-cyan-400 transition-all placeholder:text-slate-500"
          />

          <button 
            onClick={(e) => handleLogin(e, 'Magic Link')}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-50 font-bold rounded-2xl px-6 py-3.5 text-sm transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 flex items-center justify-center"
          >
            {isAuthenticating && authMethod === 'Magic Link' ? (
               <div className="w-5 h-5 border-2 border-cyan-100/20 border-t-cyan-100 rounded-full animate-spin" />
            ) : "Send Magic Link"}
          </button>
        </div>

        {authError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-xs text-center font-medium bg-red-400/10 border border-red-400/20 rounded-xl p-3"
          >
            {authError}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function FloatingCard({ 
  sub, index, mouseX, mouseY, onDelete, formatPrice, isLoadingRates, viewMode, registerPhysics, setPhysicsHovered,
  editingId, setEditingId, editName, setEditName, editCost, setEditCost, handleUpdate, currency, liveRates, currencySymbol
}) {
  const anchorRef = useRef(null);
  const isSandbox = viewMode === 'sandbox';

  // --- Reset transform when leaving sandbox ---
  useEffect(() => {
    if (!isSandbox && anchorRef.current) {
       anchorRef.current.style.transform = 'none';
    }
  }, [isSandbox]);

  // --- Supernova Shatter State ---
  const [isShattering, setIsShattering] = useState(false);
  const [shatterParticles, setShatterParticles] = useState([]);

  const handleShatter = () => {
    setIsShattering(true);

    const particles = Array.from({ length: 12 }).map(() => ({
      id: Math.random(),
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * 120 + 60,
      size: Math.random() * 4 + 2,
      color: sub.brandColor || '#00ffff'
    }));
    setShatterParticles(particles);

    setTimeout(() => {
      onDelete();
    }, 400);
  };

  // --- Global Repulsion Physics (Grid Mode Only) ---
  const repulseX = useMotionValue(0);
  const repulseY = useMotionValue(0);
  const springRepulseX = useSpring(repulseX, { stiffness: 80, damping: 15 });
  const springRepulseY = useSpring(repulseY, { stiffness: 80, damping: 15 });

  useEffect(() => {
    const handleGlobalMouse = () => {
      if (!anchorRef.current || isSandbox) {
        repulseX.set(0);
        repulseY.set(0);
        return; 
      }
      const rect = anchorRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      
      const dx = cx - mouseX.get();
      const dy = cy - mouseY.get();
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const threshold = 150;
      if (distance < threshold && distance > 0) {
        const force = (threshold - distance) / threshold;
        const maxPush = 60;
        const pushX = (dx / distance) * force * maxPush;
        const pushY = (dy / distance) * force * maxPush;
        
        repulseX.set(pushX);
        repulseY.set(pushY);
      } else {
        repulseX.set(0);
        repulseY.set(0);
      }
    };

    const unsubX = mouseX.on("change", handleGlobalMouse);
    const unsubY = mouseY.on("change", handleGlobalMouse);
    return () => {
      unsubX();
      unsubY();
    };
  }, [mouseX, mouseY, isSandbox, repulseX, repulseY]);

  // --- Local Aggressive 3D Parallax Tilt Physics ---
  const [isHovered, setIsHovered] = useState(false);
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);

  const springLocalX = useSpring(localX, { stiffness: 300, damping: 30 });
  const springLocalY = useSpring(localY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springLocalY, [-0.5, 0.5], [25, -25]);
  const rotateY = useTransform(springLocalX, [-0.5, 0.5], [-25, 25]);

  const glareX = useTransform(springLocalX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springLocalY, [-0.5, 0.5], [0, 100]);
  
  const laserPrimary = sub.brandColor || 'rgba(0,255,255,1)';
  const laserSecondary = laserPrimary.replace('1)', '0.8)');
  const laserBackground = useMotionTemplate`radial-gradient(circle 120px at ${glareX}% ${glareY}%, ${laserPrimary} 0%, ${laserSecondary} 40%, transparent 100%)`;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;

    const xPct = (mouseXPos / width) - 0.5;
    const yPct = (mouseYPos / height) - 0.5;

    localX.set(xPct);
    localY.set(yPct);
  };

  const handleMouseLeave = () => {
    if (editingId === sub.id) return; // Freeze physics while editing
    setIsHovered(false);
    if (isSandbox) setPhysicsHovered(sub.id, false);
    localX.set(0);
    localY.set(0);
  };

  const duration = 3 + (index % 3);
  const delay = index * 0.4;

  const tints = [
    'bg-pink-500/10 border-pink-400/20 shadow-[0_8px_32px_rgba(236,72,153,0.15)]',
    'bg-cyan-500/10 border-cyan-400/20 shadow-[0_8px_32px_rgba(6,182,212,0.15)]',
    'bg-purple-500/10 border-purple-400/20 shadow-[0_8px_32px_rgba(168,85,247,0.15)]',
    'bg-emerald-500/10 border-emerald-400/20 shadow-[0_8px_32px_rgba(16,185,129,0.15)]',
    'bg-blue-500/10 border-blue-400/20 shadow-[0_8px_32px_rgba(59,130,246,0.15)]',
    'bg-fuchsia-500/10 border-fuchsia-400/20 shadow-[0_8px_32px_rgba(217,70,239,0.15)]'
  ];
  
  const customTintStyle = sub.brandColor ? {
    backgroundColor: sub.brandColor.replace('1)', '0.1)'),
    borderColor: sub.brandColor.replace('1)', '0.2)'),
    boxShadow: `0 8px 32px ${sub.brandColor.replace('1)', '0.15)')}`
  } : {};
  const baseClasses = sub.brandColor ? '' : tints[index % tints.length];

  const isEditing = editingId === sub.id;

  return (
    <motion.div 
      ref={(el) => {
        anchorRef.current = el;
        // Always register so physics state is maintained
        if (registerPhysics) registerPhysics(sub.id, el);
      }}
      layout={!isSandbox}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={isSandbox 
        ? `absolute top-0 left-0 perspective-1000 ${isEditing ? 'w-full sm:w-64 aspect-square scale-100 z-50' : 'w-[160px] h-[56px] z-10'}`
        : `w-full h-full perspective-1000 relative ${isEditing ? 'z-50' : ''}`
      }
      onMouseEnter={() => { setIsHovered(true); if (isSandbox) setPhysicsHovered(sub.id, true); }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Supernova Shatter Particles */}
      {isShattering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          {shatterParticles.map(p => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(p.angle) * p.distance, y: Math.sin(p.angle) * p.distance, opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute rounded-full shadow-[0_0_10px_currentColor]"
              style={{ width: p.size, height: p.size, backgroundColor: p.color, color: p.color }}
            />
          ))}
        </div>
      )}

      <motion.div 
        style={{ x: isSandbox ? 0 : springRepulseX, y: isSandbox ? 0 : springRepulseY }}
        className="w-full h-full pointer-events-none"
      >
        <motion.div
          animate={isShattering ? { scale: 0, opacity: 0 } : { y: isSandbox ? 0 : [0, -15, 0], scale: isHovered ? (isSandbox ? 1.2 : 1.05) : 1 }}
          transition={isShattering ? { duration: 0.3, ease: "easeIn" } : { y: { duration: duration, repeat: Infinity, ease: "easeInOut", delay: delay }, scale: { type: 'spring', stiffness: 300, damping: 20 } }}
          className="w-full h-full pointer-events-auto"
        >
            <motion.div
              onMouseMove={handleMouseMove}
              style={{ 
                rotateX, 
                rotateY,
                transformPerspective: 750,
                ...customTintStyle
              }}
              className={`relative backdrop-blur-xl border ${isSandbox ? 'rounded-full p-0' : 'rounded-2xl p-8'} text-white flex flex-col justify-between h-full group w-full ${baseClasses}`}
            >
            {/* Dynamic Laser Trace */}
            <motion.div
              className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }} 
              transition={{ duration: 0.3 }}
              style={{
                padding: '2px',
                background: laserBackground,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />

            <div className={`relative z-10 w-full h-full flex ${isSandbox ? 'items-center justify-between px-5 py-0' : 'flex-col justify-between'} pointer-events-none`}>
              
              {editingId === sub.id ? (
                // EDIT MODE
                <div className="flex flex-col gap-2 w-full pointer-events-auto mt-[24px] mb-2 px-1 relative z-50">
                  <input 
                    type="text" 
                    value={editName} 
                    placeholder="App Name"
                    onChange={(e) => setEditName(e.target.value)}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full bg-black/40 border border-white/20 rounded-lg px-2 py-1.5 text-white outline-none focus:border-cyan-400 ${isSandbox ? 'text-xs' : 'text-sm'} shadow-inner`}
                  />
                  <div className="flex items-center gap-1 w-full">
                    <input 
                      type="number" 
                      value={editCost} 
                      placeholder={`Cost (${currencySymbol})`}
                      onChange={(e) => setEditCost(e.target.value)}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-full bg-black/40 border border-white/20 rounded-lg px-2 py-1.5 text-white outline-none focus:border-cyan-400 ${isSandbox ? 'text-xs' : 'text-sm'} shadow-inner`}
                    />
                  </div>
                  <div className="flex gap-2 absolute -top-8 right-0">
                    <button 
                      onMouseDown={(e) => { e.stopPropagation(); handleUpdate(sub.id); }} 
                      className="w-7 h-7 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 flex items-center justify-center hover:bg-green-500/40 hover:text-green-300 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </button>
                    <button 
                      onMouseDown={(e) => { e.stopPropagation(); setEditingId(null); }} 
                      className="w-7 h-7 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 flex items-center justify-center hover:bg-slate-500/40 hover:text-white transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ) : (
                // NORMAL MODE
                <>
                  <div className={`flex gap-1.5 absolute ${isSandbox ? '-top-1 -right-1' : '-top-4 -right-4'} pointer-events-auto`}>
                    <button 
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setEditingId(sub.id);
                        setEditName(sub.name);
                        const displayCost = liveRates[currency] ? (sub.cost * liveRates[currency]).toFixed(2) : sub.cost.toFixed(2);
                        setEditCost(displayCost);
                      }}
                      className={`w-7 h-7 rounded-full bg-[#0b0618] border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-400 cursor-pointer shadow-lg`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button 
                      onMouseDown={(e) => { e.stopPropagation(); handleShatter(); }}
                      className={`w-7 h-7 rounded-full bg-[#0b0618] border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 text-slate-400 cursor-pointer shadow-lg`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  
                  <div className={`flex items-center ${isSandbox ? 'mb-0 pr-2' : 'mb-6 pr-6'}`}>
                    <h2 className={`${isSandbox ? 'text-xs font-semibold truncate max-w-[70px]' : 'text-base font-medium'} text-slate-300 tracking-wide`}>{sub.name}</h2>
                  </div>
                  
                  <div className={`${isSandbox ? 'text-sm' : 'text-4xl'} font-bold tracking-tight`}>
                    {isLoadingRates ? (
                      <span className="animate-pulse opacity-50 text-xs">...</span>
                    ) : (
                      formatPrice(sub.cost)
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [subs, setSubs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth State Changed:", user);
      setCurrentUser(user);
      if (user) {
        setToastMessage(`Welcome back, ${user.displayName || user.email.split('@')[0]}!`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setSubs([]);
      return;
    }
    fetch(`https://subtrack-backend-86nz.onrender.com/api/subscriptions?userId=${currentUser.uid}`)
      .then(res => res.json())
      .then(data => {
        const mappedData = data.map(d => ({ ...d, id: d._id }));
        setSubs(mappedData);
      })
      .catch(err => {
        console.error("DB Fetch Error:", err);
      });
  }, [currentUser]);

  const handleSignOut = async (e) => {
    if (e) e.preventDefault();
    try {
      await signOut(auth);
      setCurrentUser(null);
      setSubs([]);
      setToastMessage('Signed out securely.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCost, setEditCost] = useState('');

  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');
  
  const [currency, setCurrency] = useState('USD');
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'JPY' ? '¥' : '$';
  const [sortBy, setSortBy] = useState('price-desc');
  const [viewMode, setViewMode] = useState('grid');
  const [isSandboxReady, setIsSandboxReady] = useState(false);
  
  const [liveRates, setLiveRates] = useState({});
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  const [suggestions, setSuggestions] = useState([]);
  const [selectedBrandColor, setSelectedBrandColor] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(res => res.json())
      .then(data => {
        setLiveRates(data.rates);
        setIsLoadingRates(false);
      })
      .catch(err => {
        console.error("Failed to fetch rates", err);
        setIsLoadingRates(false); 
      });
  }, []);

  const formatPrice = (costInUSD) => {
    if (isLoadingRates || !liveRates[currency]) return '...';
    const converted = costInUSD * liveRates[currency];
    return `${CURRENCY_SYMBOLS[currency] || '$'}${converted.toFixed(2)}`;
  };

  const totalSpend = subs.reduce((sum, sub) => sum + sub.cost, 0);

  const deleteSubscription = async (id) => {
    try {
      await fetch(`https://subtrack-backend-86nz.onrender.com/api/subscriptions/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn("DB offline, proceeding locally");
    }
    setSubs(subs.filter(sub => sub.id !== id));
    physicsNodes.current.delete(id);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setNewName(val);
    
    if (val.length > 1) {
      const matches = POPULAR_BRANDS.filter(b => b.name.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (brand) => {
    setNewName(brand.name);
    setSelectedBrandColor(brand.color);
    setSuggestions([]);
  };

  const handleUpdate = async (id) => {
    let baseCost = parseFloat(editCost);
    if (currency !== 'USD' && liveRates[currency]) {
      baseCost = baseCost / liveRates[currency];
    }

    const payload = {
      name: editName,
      cost: baseCost
    };

    // Optimistic Update
    setSubs(prev => prev.map(s => s.id === id ? { ...s, name: editName, cost: baseCost } : s));
    setEditingId(null);

    try {
      await fetch(`https://subtrack-backend-86nz.onrender.com/api/subscriptions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn("DB Update Error", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newCost || !currentUser) return;
    
    let baseCost = parseFloat(newCost);
    if (currency !== 'USD' && liveRates[currency]) {
      baseCost = baseCost / liveRates[currency];
    }
    
    const newSubscription = {
      id: Date.now().toString(),
      name: newName,
      cost: baseCost,
      brandColor: selectedBrandColor,
      userId: currentUser.uid,
      userName: currentUser.displayName || currentUser.email
    };

    // Physics Safety Check
    if (viewMode === 'sandbox') {
      const container = containerRef.current;
      if (container && container.clientWidth > 0 && container.clientHeight > 0) {
        newSubscription.x = Math.random() * Math.max(0, container.clientWidth - 160);
        newSubscription.y = Math.random() * Math.max(0, container.clientHeight - 56);
      } else {
        newSubscription.x = window.innerWidth / 2;
        newSubscription.y = window.innerHeight / 2;
      }
    }

    console.log("Added new sub:", newSubscription);

    // Optimistic Update: Render instantly
    setSubs(prev => [...prev, newSubscription]);
    setNewName('');
    setNewCost('');
    setSelectedBrandColor(null);
    setSuggestions([]);
    setIsInputFocused(false);

    // Background DB Sync
    fetch('https://subtrack-backend-86nz.onrender.com/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newSubscription.name,
        cost: newSubscription.cost,
        brandColor: newSubscription.brandColor,
        userId: newSubscription.userId,
        userName: newSubscription.userName
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Server rejected the save");
      return res.json();
    })
    .then(savedSub => {
      console.log("Synced to DB securely.");
    })
    .catch(err => {
      console.warn("DB Sync Error - removing local item to stay synced.", err);
      setSubs(current => current.filter(s => s.id !== newSubscription.id));
      if (physicsNodes.current.has(newSubscription.id)) {
        physicsNodes.current.delete(newSubscription.id);
      }
    });
  };
  
  const mouseX = useMotionValue(-1000); 
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // --- Zero-Gravity Physics Engine ---
  const containerRef = useRef(null);
  const physicsNodes = useRef(new Map());

  // Measurement Effect & Safe Spawning
  useEffect(() => {
    if (viewMode === 'grid') {
      setIsSandboxReady(false);
      return;
    }

    if (viewMode === 'sandbox') {
      let attempts = 0;
      let timeoutId;
      const checkMeasurements = () => {
        attempts++;
        const container = containerRef.current;
        if ((container && container.clientWidth > 0 && container.clientHeight > 0) || attempts > 10) {
          const cardWidth = 160;
          const cardHeight = 56;
          const w = container && container.clientWidth > 0 ? container.clientWidth : (window.innerWidth || 800);
          const h = container && container.clientHeight > 0 ? container.clientHeight : (window.innerHeight || 600);

          physicsNodes.current.forEach(node => {
            node.x = Math.random() * Math.max(0, w - cardWidth);
            node.y = Math.random() * Math.max(0, h - cardHeight);
            node.dx = (Math.random() > 0.5 ? 1 : -1) * 0.8;
            node.dy = (Math.random() > 0.5 ? 1 : -1) * 0.8;
            node.radius = 60;
          });
          
          setIsSandboxReady(true);
        } else {
          timeoutId = setTimeout(checkMeasurements, 50);
        }
      };
      
      checkMeasurements();
      return () => clearTimeout(timeoutId);
    }
  }, [viewMode]);

  const registerPhysics = (id, el) => {
    if (!physicsNodes.current.has(id)) {
      const container = containerRef.current;
      const w = container && container.clientWidth > 0 ? container.clientWidth : (window.innerWidth || 800);
      const h = container && container.clientHeight > 0 ? container.clientHeight : (window.innerHeight || 600);
      const cardWidth = 160;
      const cardHeight = 56;
      
      physicsNodes.current.set(id, {
        el,
        x: Math.random() * Math.max(0, w - cardWidth),
        y: Math.random() * Math.max(0, h - cardHeight),
        dx: (Math.random() > 0.5 ? 1 : -1) * 0.8,
        dy: (Math.random() > 0.5 ? 1 : -1) * 0.8,
        radius: 60,
        isHovered: false
      });
    } else {
      // Update DOM element reference without resetting physics state
      physicsNodes.current.get(id).el = el;
    }
  };

  const setPhysicsHovered = (id, isHovered) => {
    const node = physicsNodes.current.get(id);
    if (node) node.isHovered = isHovered;
  };

  useEffect(() => {
    if (viewMode !== 'sandbox') return; 

    let rafId;

    const loop = () => {
      const container = containerRef.current;
      if (!container) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // Safety pause if container hasn't fully painted
      if (width === 0 || height === 0) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const nodes = Array.from(physicsNodes.current.values());

      nodes.forEach(node => {
        if (node.isHovered) return; 

        // Apply Velocity
        node.x += node.dx;
        node.y += node.dy;

        // Prevent NaN entirely
        if (isNaN(node.dx) || isNaN(node.dy) || isNaN(node.x) || isNaN(node.y)) {
           node.x = 100; node.y = 100; node.dx = 0.8; node.dy = 0.8;
        }

        // Apply Speed Limits
        const speed = Math.sqrt(node.dx * node.dx + node.dy * node.dy);
        const MAX_SPEED = 1.2;
        const MIN_SPEED = 0.1;

        if (speed > MAX_SPEED) {
          node.dx = (node.dx / speed) * MAX_SPEED;
          node.dy = (node.dy / speed) * MAX_SPEED;
        } else if (speed < MIN_SPEED && speed > 0) {
          node.dx = (node.dx / speed) * MIN_SPEED;
          node.dy = (node.dy / speed) * MIN_SPEED;
        }

        // Boundary Collisions (Top-Left Coordinate System)
        const cardWidth = 160;
        const cardHeight = 56;

        if (node.x < 0) {
          node.x = 0;
          node.dx = Math.abs(node.dx);
        } else if (node.x > width - cardWidth) {
          node.x = Math.max(0, width - cardWidth);
          node.dx = -Math.abs(node.dx);
        }

        if (node.y < 0) {
          node.y = 0;
          node.dy = Math.abs(node.dy);
        } else if (node.y > height - cardHeight) {
          node.y = Math.max(0, height - cardHeight);
          node.dy = -Math.abs(node.dy);
        }
      });

      // Elastic Circle Collisions
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          // Calculate center points for collision math
          const cxA = a.x + 80; // 160 / 2
          const cyA = a.y + 28;  // 56 / 2
          const cxB = b.x + 80;
          const cyB = b.y + 28;

          const dx = cxB - cxA;
          const dy = cyB - cyA;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = a.radius + b.radius;

          if (distance < minDistance && distance > 0) {
            // Resolve Penetration
            const overlap = minDistance - distance;
            const nx = dx / distance;
            const ny = dy / distance;

            if (a.isHovered && !b.isHovered) {
              b.x += nx * overlap;
              b.y += ny * overlap;
            } else if (!a.isHovered && b.isHovered) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            } else if (!a.isHovered && !b.isHovered) {
              a.x -= nx * (overlap / 2);
              a.y -= ny * (overlap / 2);
              b.x += nx * (overlap / 2);
              b.y += ny * (overlap / 2);
            }

            // Resolve Velocity (Elastic Bounce)
            const relativeVelocityX = b.dx - a.dx;
            const relativeVelocityY = b.dy - a.dy;
            const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny;

            if (velocityAlongNormal > 0) continue;

            const restitution = 1; 

            const invMassA = a.isHovered ? 0 : 1;
            const invMassB = b.isHovered ? 0 : 1;
            if (invMassA === 0 && invMassB === 0) continue;

            const impulse = -(1 + restitution) * velocityAlongNormal / (invMassA + invMassB);
            const impulseX = impulse * nx;
            const impulseY = impulse * ny;

            if (!a.isHovered) {
              a.dx -= impulseX * invMassA;
              a.dy -= impulseY * invMassA;
            }
            if (!b.isHovered) {
              b.dx += impulseX * invMassB;
              b.dy += impulseY * invMassB;
            }
          }
        }
      }

      // Render Transforms (Direct DOM manipulation for 60fps)
      nodes.forEach(node => {
        if (node.el && !isNaN(node.x) && !isNaN(node.y)) {
          // translate by top-left directly
          node.el.style.transform = `translate(${node.x}px, ${node.y}px)`;
        }
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [viewMode]);

  const sortedSubs = [...subs].sort((a, b) => {
    if (sortBy === 'price-desc') return b.cost - a.cost;
    if (sortBy === 'price-asc') return a.cost - b.cost;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="h-screen w-full bg-[#080314] relative overflow-hidden font-sans">

      {/* Background Layers */}
      <CosmicBackground />
      <Starfield />
      <ShootingStars />
      <ParticleWake mouseX={mouseX} mouseY={mouseY} />
      <UFO />



      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-4 flex items-center justify-between bg-slate-950/50 backdrop-blur-2xl border-b border-white/10">
        {/* Left: App Name */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight select-none inline-block">
            SubTrack
          </h1>
        </div>

        {/* Center: Live Metrics */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,1)] animate-pulse" />
            <div className="text-xl font-bold text-white tracking-tight flex items-baseline">
              {isLoadingRates ? '...' : formatPrice(totalSpend)}
              <span className="text-xs text-slate-400 ml-1 font-medium tracking-wide">/mo</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-slate-500 mt-0.5 tracking-wide">
            {isLoadingRates ? '...' : formatPrice(totalSpend * 12)} /yr
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex gap-3 items-center justify-end flex-1">
          {!currentUser ? (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl px-8 py-3 text-white outline-none cursor-pointer backdrop-blur-md transition-all text-sm font-semibold hidden sm:flex items-center gap-3 w-52 justify-center shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              Sign In to Sync
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 p-[2px] cursor-pointer shrink-0">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white tracking-widest uppercase">
                    {currentUser.email ? currentUser.email.charAt(0) : 'U'}
                  </div>
                )}
              </div>
              <button 
                onMouseDown={handleSignOut}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm whitespace-nowrap hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 shadow-2xl font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}

          <button 
            onClick={() => setViewMode(v => v === 'grid' ? 'sandbox' : 'grid')}
            className="bg-cyan-500/20 border border-cyan-400/50 rounded-xl px-5 py-2 text-cyan-50 outline-none cursor-pointer backdrop-blur-md hover:bg-cyan-500/30 transition-all text-sm font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] hidden sm:block whitespace-nowrap"
          >
            {viewMode === 'grid' ? 'Sandbox Mode' : 'Grid Mode'}
          </button>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none cursor-pointer backdrop-blur-md appearance-none hover:bg-white/10 transition-all text-sm font-semibold hidden lg:block"
          >
            <option value="price-desc" className="bg-[#080314]">Price (High to Low)</option>
            <option value="price-asc" className="bg-[#080314]">Price (Low to High)</option>
            <option value="name-asc" className="bg-[#080314]">Name (A-Z)</option>
          </select>

          <select 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white outline-none cursor-pointer backdrop-blur-md appearance-none hover:bg-white/10 transition-all text-sm font-semibold"
          >
            <option value="USD" className="bg-[#080314]">USD ($)</option>
            <option value="EUR" className="bg-[#080314]">EUR (€)</option>
            <option value="GBP" className="bg-[#080314]">GBP (£)</option>
            <option value="INR" className="bg-[#080314]">INR (₹)</option>
            <option value="JPY" className="bg-[#080314]">JPY (¥)</option>
          </select>
        </div>
      </header>

      {/* Main Container Area */}
      <motion.main 
        animate={{ opacity: isInputFocused ? 0.4 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        ref={containerRef}
        className={`relative z-20 w-full ${viewMode === 'grid' ? 'h-full overflow-y-auto pt-32 pb-48 px-6' : 'overflow-hidden'}`}
        style={viewMode === 'sandbox' ? { height: 'calc(100vh - 180px)', marginTop: '80px' } : {}}
      >
        <motion.div 
          layout={viewMode === 'grid'}
          className={viewMode === 'grid' ? "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "w-full h-full"}
        >
          {viewMode === 'sandbox' && !isSandboxReady ? (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-50">
               <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
               <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">Initializing Sandbox...</span>
            </div>
          ) : (
            sortedSubs.map((sub, index) => (
              <FloatingCard 
                key={sub._id || sub.id} 
                sub={sub} 
                index={index} 
                mouseX={mouseX} 
                mouseY={mouseY} 
                onDelete={() => deleteSubscription(sub.id)}
                formatPrice={formatPrice}
                isLoadingRates={isLoadingRates}
                viewMode={viewMode}
                registerPhysics={registerPhysics}
                setPhysicsHovered={setPhysicsHovered}
                editingId={editingId}
                setEditingId={setEditingId}
                editName={editName}
                setEditName={setEditName}
                editCost={editCost}
                setEditCost={setEditCost}
                handleUpdate={handleUpdate}
                currency={currency}
                liveRates={liveRates}
                currencySymbol={currencySymbol}
              />
            ))
          )}
        </motion.div>
      </motion.main>

      {/* Dynamic Island Bottom Dock */}
      <div className="fixed bottom-10 left-0 w-full z-50 flex justify-center pointer-events-none px-6">
        <motion.div 
          animate={{ width: isInputFocused ? 700 : 450 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="bg-slate-950/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-3 pointer-events-auto relative"
          style={{
            boxShadow: selectedBrandColor 
              ? `0 20px 80px ${selectedBrandColor.replace('1)', '0.4)')}` 
              : '0 20px 60px rgba(0,0,0,0.6)'
          }}
        >
          {/* Auto-Suggest Dropdown */}
          <form onSubmit={handleSubmit} className="flex gap-3 items-center w-full">
            <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="App Name"
              value={newName}
              onChange={handleNameChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white outline-none focus:bg-white/10 focus:border-cyan-400 transition-all placeholder:text-slate-500 shadow-inner w-full"
            />
            {suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#0b0618]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[9999]">
                {suggestions.map(brand => (
                  <div 
                    key={brand.name}
                    className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm text-white flex items-center gap-3 transition-colors"
                    onClick={() => selectSuggestion(brand)}
                  >
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: brand.color }}></div>
                    {brand.name}
                  </div>
                ))}
              </div>
            )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                {currencySymbol}
              </span>
              <input 
                type="number" 
                placeholder="0.00"
                value={newCost}
                onChange={(e) => setNewCost(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                className="w-28 bg-white/5 border border-white/10 rounded-2xl pl-8 pr-4 py-3.5 text-sm text-white outline-none focus:bg-white/10 focus:border-cyan-400 transition-all placeholder:text-slate-500 shadow-inner"
              />
            </div>
            <button 
              type="submit"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-50 font-bold rounded-2xl px-6 py-3.5 text-sm transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 whitespace-nowrap"
            >
              Add
            </button>
          </form>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onSimulateLogin={() => {
              setShowAuthModal(false);
            }}
          />
        )}
        
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-cyan-500/20 border border-cyan-400/50 backdrop-blur-xl rounded-full px-6 py-3 text-cyan-50 font-medium shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center gap-3"
          >
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;