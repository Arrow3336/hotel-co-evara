import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ElevatorTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

const playElevatorSound = (type: "close" | "ding" | "open") => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (type === "close") {
      const duration = 0.6;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noise = ctx.createOscillator();
      const noiseGain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + duration);

      noise.type = "square";
      noise.frequency.setValueAtTime(2000, ctx.currentTime);
      noise.frequency.linearRampToValueAtTime(800, ctx.currentTime + duration);
      noiseGain.gain.setValueAtTime(0.015, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + duration);

      osc.connect(gain).connect(ctx.destination);
      noise.connect(noiseGain).connect(ctx.destination);
      osc.start(); noise.start();
      osc.stop(ctx.currentTime + duration);
      noise.stop(ctx.currentTime + duration);

      setTimeout(() => {
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(60, ctx.currentTime);
        thudGain.gain.setValueAtTime(0.12, ctx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start(); thud.stop(ctx.currentTime + 0.15);
      }, duration * 1000 - 50);
    }

    if (type === "ding") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1760, ctx.currentTime);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(2637, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc1.connect(gain).connect(ctx.destination);
      osc2.connect(gain);
      osc1.start(); osc2.start();
      osc1.stop(ctx.currentTime + 1.2);
      osc2.stop(ctx.currentTime + 1.2);
    }

    if (type === "open") {
      const duration = 0.5;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      osc.connect(gain).connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration);
    }
  } catch (e) {
    // Audio not available, silently skip
  }
};

const ElevatorTransition = ({ isActive, onComplete }: ElevatorTransitionProps) => {
  const [phase, setPhase] = useState<"idle" | "closing" | "closed" | "light" | "opening" | "done">("idle");

  const runSequence = useCallback(() => {
    setPhase("closing");
    playElevatorSound("close");

    setTimeout(() => {
      setPhase("closed");

      setTimeout(() => {
        setPhase("light");
        playElevatorSound("ding");

        setTimeout(() => {
          setPhase("opening");
          playElevatorSound("open");

          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 600);
        }, 400);
      }, 300);
    }, 700);
  }, [onComplete]);

  useEffect(() => {
    if (isActive && phase === "idle") {
      runSequence();
    }
  }, [isActive, phase, runSequence]);

  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
    }
  }, [isActive]);

  if (!isActive && phase === "idle") return null;

  const isClosed = phase === "closed" || phase === "light";
  const isOpening = phase === "opening";
  const showLight = phase === "light";

  const leftX = phase === "closing" ? "0%" : isClosed ? "0%" : isOpening ? "-100%" : "-100%";
  const rightX = phase === "closing" ? "0%" : isClosed ? "0%" : isOpening ? "100%" : "100%";

  return (
    <AnimatePresence>
      {(isActive || phase !== "idle") && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Left door */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full"
            style={{ background: "linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 90%, #3a3a3a 100%)" }}
            initial={{ x: "-100%" }}
            animate={{ x: leftX }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Door panel lines */}
            <div className="absolute right-8 top-0 w-px h-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="absolute right-16 top-0 w-px h-full" style={{ background: "rgba(255,255,255,0.03)" }} />
            {/* Metallic edge */}
            <div className="absolute right-0 top-0 w-1 h-full" style={{ background: "linear-gradient(180deg, #555 0%, #333 50%, #555 100%)" }} />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full"
            style={{ background: "linear-gradient(270deg, #1a1a1a 0%, #2a2a2a 90%, #3a3a3a 100%)" }}
            initial={{ x: "100%" }}
            animate={{ x: rightX }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Door panel lines */}
            <div className="absolute left-8 top-0 w-px h-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="absolute left-16 top-0 w-px h-full" style={{ background: "rgba(255,255,255,0.03)" }} />
            {/* Metallic edge */}
            <div className="absolute left-0 top-0 w-1 h-full" style={{ background: "linear-gradient(180deg, #555 0%, #333 50%, #555 100%)" }} />
          </motion.div>

          {/* Center light line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full z-10">
            {showLight && (
              <motion.div
                className="w-full h-full"
                style={{ background: "linear-gradient(180deg, transparent 10%, rgba(200,170,100,0.8) 50%, transparent 90%)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.6, 1] }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>

          {/* Floor indicator */}
          {(isClosed || showLight) && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ background: "radial-gradient(circle, #c8aa64, #8a6e3a)" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElevatorTransition;
