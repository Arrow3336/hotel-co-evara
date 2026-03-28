import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import doorLeftImg from "@/assets/elevator-door-left.jpeg";
import doorRightImg from "@/assets/elevator-door-right.jpeg";

interface ElevatorTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

const playElevatorSound = (type: "close" | "ding" | "open" | "motor") => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (type === "close") {
      const duration = 1.2;
      const rumble = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumble.type = "sawtooth";
      rumble.frequency.setValueAtTime(55, ctx.currentTime);
      rumble.frequency.linearRampToValueAtTime(30, ctx.currentTime + duration);
      rumbleGain.gain.setValueAtTime(0.04, ctx.currentTime);
      rumbleGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + duration * 0.5);
      rumbleGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + duration);
      rumble.connect(rumbleGain).connect(ctx.destination);
      rumble.start();
      rumble.stop(ctx.currentTime + duration);

      const rail = ctx.createOscillator();
      const railGain = ctx.createGain();
      const railFilter = ctx.createBiquadFilter();
      rail.type = "sawtooth";
      rail.frequency.setValueAtTime(1800, ctx.currentTime);
      rail.frequency.linearRampToValueAtTime(600, ctx.currentTime + duration);
      railFilter.type = "bandpass";
      railFilter.frequency.setValueAtTime(1200, ctx.currentTime);
      railFilter.Q.setValueAtTime(2, ctx.currentTime);
      railGain.gain.setValueAtTime(0.008, ctx.currentTime);
      railGain.gain.linearRampToValueAtTime(0.012, ctx.currentTime + duration * 0.3);
      railGain.gain.linearRampToValueAtTime(0.003, ctx.currentTime + duration);
      rail.connect(railFilter).connect(railGain).connect(ctx.destination);
      rail.start();
      rail.stop(ctx.currentTime + duration);

      setTimeout(() => {
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(45, ctx.currentTime);
        thud.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.2);
        thudGain.gain.setValueAtTime(0.15, ctx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start();
        thud.stop(ctx.currentTime + 0.25);
      }, duration * 1000 - 80);
    }

    if (type === "motor") {
      const duration = 0.8;
      const motor = ctx.createOscillator();
      const motorGain = ctx.createGain();
      motor.type = "sine";
      motor.frequency.setValueAtTime(100, ctx.currentTime);
      motor.frequency.linearRampToValueAtTime(120, ctx.currentTime + duration * 0.3);
      motor.frequency.linearRampToValueAtTime(90, ctx.currentTime + duration);
      motorGain.gain.setValueAtTime(0, ctx.currentTime);
      motorGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.15);
      motorGain.gain.setValueAtTime(0.04, ctx.currentTime + duration * 0.7);
      motorGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      motor.connect(motorGain).connect(ctx.destination);
      motor.start();
      motor.stop(ctx.currentTime + duration);
    }

    if (type === "ding") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1567.98, ctx.currentTime);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(2093, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc1.connect(gain).connect(ctx.destination);
      osc2.connect(gain);
      osc1.start(); osc2.start();
      osc1.stop(ctx.currentTime + 1.5);
      osc2.stop(ctx.currentTime + 1.5);
    }

    if (type === "open") {
      const duration = 1.0;
      const release = ctx.createOscillator();
      const releaseGain = ctx.createGain();
      release.type = "sawtooth";
      release.frequency.setValueAtTime(30, ctx.currentTime);
      release.frequency.linearRampToValueAtTime(60, ctx.currentTime + duration);
      releaseGain.gain.setValueAtTime(0.05, ctx.currentTime);
      releaseGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + duration);
      release.connect(releaseGain).connect(ctx.destination);
      release.start();
      release.stop(ctx.currentTime + duration);
    }
  } catch (e) {
    // Audio not available
  }
};

const ElevatorTransition = ({ isActive, onComplete }: ElevatorTransitionProps) => {
  const [phase, setPhase] = useState<"idle" | "closing" | "closed" | "opening" | "done">("idle");

  const runSequence = useCallback(() => {
    setPhase("closing");
    playElevatorSound("close");

    // Doors close in 1.2s
    setTimeout(() => {
      setPhase("closed");
      playElevatorSound("motor");

      // Brief pause + ding, then open
      setTimeout(() => {
        playElevatorSound("ding");
        setTimeout(() => {
          setPhase("opening");
          playElevatorSound("open");

          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 800);
        }, 400);
      }, 600);
    }, 1200);
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

  const isClosed = phase === "closed";
  const isClosing = phase === "closing";
  const isOpening = phase === "opening";

  // Door positions: closing slides in from edges, closed stays, opening slides out
  const leftX = isClosing ? "0%" : isClosed ? "0%" : isOpening ? "-100%" : "-100%";
  const rightX = isClosing ? "0%" : isClosed ? "0%" : isOpening ? "100%" : "100%";

  return (
    <AnimatePresence>
      {(isActive || phase !== "idle") && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Left door */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full overflow-hidden gpu-accelerated"
            initial={{ x: "-100%" }}
            animate={{ x: leftX }}
            transition={{ duration: 1.2, ease: [0.22, 0.68, 0.36, 1] }}
          >
            <img src={doorLeftImg} alt="" className="w-full h-full object-cover" />
            <div
              className="absolute right-0 top-0 w-[2px] h-full"
              style={{ background: "linear-gradient(180deg, hsl(38 70% 45% / 0.5) 0%, hsl(38 70% 45% / 0.2) 50%, hsl(38 70% 45% / 0.5) 100%)" }}
            />
            <div
              className="absolute right-0 top-0 w-3 h-full"
              style={{ background: "linear-gradient(270deg, rgba(0,0,0,0.2) 0%, transparent 100%)" }}
            />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full overflow-hidden gpu-accelerated"
            initial={{ x: "100%" }}
            animate={{ x: rightX }}
            transition={{ duration: 1.2, ease: [0.22, 0.68, 0.36, 1] }}
          >
            <img src={doorRightImg} alt="" className="w-full h-full object-cover" />
            <div
              className="absolute left-0 top-0 w-[2px] h-full"
              style={{ background: "linear-gradient(180deg, hsl(38 70% 45% / 0.5) 0%, hsl(38 70% 45% / 0.2) 50%, hsl(38 70% 45% / 0.5) 100%)" }}
            />
            <div
              className="absolute left-0 top-0 w-3 h-full"
              style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 100%)" }}
            />
          </motion.div>

          {/* Center glow line when closed */}
          {isClosed && (
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full z-10"
              style={{
                background: "linear-gradient(180deg, transparent 10%, hsl(38 70% 45% / 0.8) 30%, hsl(38 70% 55% / 1) 50%, hsl(38 70% 45% / 0.8) 70%, transparent 90%)",
                boxShadow: "0 0 15px 5px hsl(38 70% 45% / 0.25)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1] }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Floor indicator */}
          {isClosed && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
              <div
                className="px-5 py-1.5 rounded-sm"
                style={{
                  background: "linear-gradient(180deg, hsl(220 20% 15%) 0%, hsl(220 20% 8%) 100%)",
                  border: "1px solid hsl(38 70% 45% / 0.3)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
              >
                <motion.span
                  className="font-display text-sm tracking-[0.2em]"
                  style={{ color: "hsl(38 70% 55%)" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  ▲
                </motion.span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElevatorTransition;
