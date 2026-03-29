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
      // Smooth hydraulic slide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(35, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);

      // Soft thud at end
      setTimeout(() => {
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(45, ctx.currentTime);
        thudGain.gain.setValueAtTime(0.1, ctx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start();
        thud.stop(ctx.currentTime + 0.2);
      }, 1100);
    }

    if (type === "ding") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1568, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    }

    if (type === "open") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(35, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.005, ctx.currentTime + 0.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    }
  } catch (e) {
    // Audio not available
  }
};

const ElevatorDoor = ({ side }: { side: "left" | "right" }) => {
  const text = side === "left" ? "Evara" : "Co.";
  return (
    <div className="w-full h-full relative" style={{ background: "linear-gradient(180deg, #f8f6f2 0%, #eae6df 30%, #e2ddd5 70%, #d8d2c8 100%)" }}>
      {/* Panel lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-full" style={{
          background: side === "left"
            ? "linear-gradient(90deg, rgba(0,0,0,0.03) 0%, transparent 3%, transparent 97%, rgba(0,0,0,0.06) 100%)"
            : "linear-gradient(90deg, rgba(0,0,0,0.06) 0%, transparent 3%, transparent 97%, rgba(0,0,0,0.03) 100%)"
        }} />
        {/* Horizontal panel dividers */}
        <div className="absolute top-[15%] left-[8%] right-[8%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)" }} />
        <div className="absolute top-[85%] left-[8%] right-[8%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)" }} />
      </div>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display tracking-[0.15em] select-none"
          style={{
            fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
            color: "#8a7d6b",
            fontWeight: 500,
            textShadow: "0 1px 2px rgba(255,255,255,0.8)",
          }}
        >
          {text}
        </span>
      </div>
      {/* Subtle bottom reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{
        background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.08))"
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
          }, 800);
        }, 500);
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

  const leftX = isClosing ? "0%" : isClosed ? "0%" : isOpening ? "-100%" : "-100%";
  const rightX = isClosing ? "0%" : isClosed ? "0%" : isOpening ? "100%" : "100%";
  const doorDuration = isOpening ? 1.0 : 1.2;

  return (
    <AnimatePresence>
      {(isActive || phase !== "idle") && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Left door */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full gpu-accelerated"
            style={{ willChange: "transform" }}
            initial={{ x: "-100%" }}
            animate={{ x: leftX }}
            transition={{ duration: doorDuration, ease: [0.4, 0, 0.2, 1] }}
          >
            <ElevatorDoor side="left" />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full gpu-accelerated"
            style={{ willChange: "transform" }}
            initial={{ x: "100%" }}
            animate={{ x: rightX }}
            transition={{ duration: doorDuration, ease: [0.4, 0, 0.2, 1] }}
          >
            <ElevatorDoor side="right" />
          </motion.div>

          {/* Center seam glow when closed */}
          {isClosed && (
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full z-10"
              style={{
                background: "linear-gradient(180deg, transparent 5%, hsl(38 70% 45% / 0.4) 30%, hsl(38 70% 45% / 0.6) 50%, hsl(38 70% 45% / 0.4) 70%, transparent 95%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElevatorTransition;
