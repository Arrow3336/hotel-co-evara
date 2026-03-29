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
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 1.0);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.008, ctx.currentTime + 1.0);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);

      setTimeout(() => {
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(40, ctx.currentTime);
        thudGain.gain.setValueAtTime(0.08, ctx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start();
        thud.stop(ctx.currentTime + 0.15);
      }, 900);
    }

    if (type === "ding") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1480, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    }

    if (type === "open") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(30, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.7);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.004, ctx.currentTime + 0.7);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    }
  } catch (e) {
    // Audio not available
  }
};

const ElevatorDoor = ({ side }: { side: "left" | "right" }) => {
  const text = side === "left" ? "Evara" : "Co.";
  return (
    <div
      className="w-full h-full relative gpu-accelerated"
      style={{
        background: "linear-gradient(180deg, #f5f3f0 0%, #ece9e4 40%, #e5e1db 70%, #ddd8d0 100%)",
      }}
    >
      {/* Subtle panel edge */}
      <div
        className="absolute inset-0"
        style={{
          background:
            side === "left"
              ? "linear-gradient(90deg, rgba(0,0,0,0.02) 0%, transparent 2%, transparent 98%, rgba(0,0,0,0.04) 100%)"
              : "linear-gradient(90deg, rgba(0,0,0,0.04) 0%, transparent 2%, transparent 98%, rgba(0,0,0,0.02) 100%)",
        }}
      />
      {/* Horizontal lines */}
      <div className="absolute top-[12%] left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)" }} />
      <div className="absolute top-[88%] left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)" }} />

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display tracking-[0.12em] select-none font-medium"
          style={{
            fontSize: "clamp(1.2rem, 3.5vw, 2.4rem)",
            color: "#8a7e6e",
            textShadow: "0 1px 1px rgba(255,255,255,0.7)",
          }}
        >
          {text}
        </span>
      </div>

      {/* Bottom reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%]" style={{
        background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.06))"
      }} />
    </div>
  );
};

const ElevatorTransition = ({ isActive, onComplete }: ElevatorTransitionProps) => {
  const [phase, setPhase] = useState<"idle" | "closing" | "closed" | "opening" | "done">("idle");

  const runSequence = useCallback(() => {
    setPhase("closing");
    playElevatorSound("close");

    setTimeout(() => {
      setPhase("closed");
      setTimeout(() => {
        playElevatorSound("ding");
        setTimeout(() => {
          setPhase("opening");
          playElevatorSound("open");
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 700);
        }, 400);
      }, 500);
    }, 1000);
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

  const leftX = isClosing ? "0%" : isClosed ? "0%" : isOpening ? "-100%" : "-100%";
  const rightX = isClosing ? "0%" : isClosed ? "0%" : isOpening ? "100%" : "100%";
  const doorDuration = isOpening ? 0.8 : 1.0;

  return (
    <AnimatePresence>
      {(isActive || phase !== "idle") && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Left door */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full gpu-accelerated"
            initial={{ x: "-100%" }}
            animate={{ x: leftX }}
            transition={{ duration: doorDuration, ease: [0.32, 0.72, 0.35, 1] }}
          >
            <ElevatorDoor side="left" />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full gpu-accelerated"
            initial={{ x: "100%" }}
            animate={{ x: rightX }}
            transition={{ duration: doorDuration, ease: [0.32, 0.72, 0.35, 1] }}
          >
            <ElevatorDoor side="right" />
          </motion.div>

          {/* Center seam glow when closed */}
          {isClosed && (
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full z-10"
              style={{
                background: "linear-gradient(180deg, transparent 10%, hsl(30 45% 42% / 0.3) 35%, hsl(30 45% 42% / 0.5) 50%, hsl(30 45% 42% / 0.3) 65%, transparent 90%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElevatorTransition;