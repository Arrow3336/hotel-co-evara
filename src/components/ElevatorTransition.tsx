import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ElevatorTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  onDoorsFullyClosed?: () => void;
}

const playElevatorSound = (type: "close" | "ding" | "open") => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (type === "close") {
      // Mechanical rumble
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(28, ctx.currentTime + 1.4);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.006, ctx.currentTime + 1.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.4);

      // Soft thud when doors meet
      setTimeout(() => {
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(35, ctx.currentTime);
        thudGain.gain.setValueAtTime(0.06, ctx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start();
        thud.stop(ctx.currentTime + 0.12);
      }, 1300);
    }

    if (type === "ding") {
      // Classic elevator ding — two harmonics
      [1480, 2960].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(i === 0 ? 0.08 : 0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      });
    }

    if (type === "open") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(28, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(45, ctx.currentTime + 1.0);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.003, ctx.currentTime + 1.0);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.0);
    }
  } catch (e) {
    // Audio not available
  }
};

const ElevatorDoor = ({ side, phase }: { side: "left" | "right"; phase: string }) => {
  const text = side === "left" ? "Evara" : "Co.";
  const isClosed = phase === "closed";

  return (
    <div
      className="w-full h-full relative gpu-accelerated overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #faf9f7 0%, #f3f1ee 30%, #edeae6 60%, #e8e5e0 100%)",
      }}
    >
      {/* Brushed metal texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            180deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.008) 2px,
            rgba(0,0,0,0.008) 4px
          )`,
        }}
      />

      {/* Edge shadow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            side === "left"
              ? "linear-gradient(90deg, rgba(0,0,0,0.03) 0%, transparent 3%, transparent 96%, rgba(0,0,0,0.06) 100%)"
              : "linear-gradient(90deg, rgba(0,0,0,0.06) 0%, transparent 4%, transparent 97%, rgba(0,0,0,0.03) 100%)",
        }}
      />

      {/* Top decorative line */}
      <div className="absolute top-[8%] left-[15%] right-[15%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(180,165,140,0.15), transparent)" }} />
      
      {/* Bottom decorative line */}
      <div className="absolute bottom-[8%] left-[15%] right-[15%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(180,165,140,0.15), transparent)" }} />

      {/* Center text with animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="select-none"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.4rem, 4vw, 3rem)",
            fontWeight: 400,
            letterSpacing: "0.15em",
            color: "#9a8e7e",
            textShadow: "0 1px 2px rgba(255,255,255,0.8)",
          }}
          animate={isClosed ? {
            opacity: [0.7, 1, 0.7],
          } : {}}
          transition={isClosed ? {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          } : {}}
        >
          {text}
        </motion.span>
      </div>

      {/* Subtle center reflection */}
      <div className="absolute top-[20%] bottom-[20%] left-1/2 -translate-x-1/2 w-[60%]" style={{
        background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.04), transparent)",
      }} />

      {/* Bottom reflection gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{
        background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.05))"
      }} />
    </div>
  );
};

const ElevatorTransition = ({ isActive, onComplete, onDoorsFullyClosed }: ElevatorTransitionProps) => {
  const [phase, setPhase] = useState<"idle" | "closing" | "closed" | "opening" | "done">("idle");

  const runSequence = useCallback(() => {
    setPhase("closing");
    playElevatorSound("close");

    // Doors close over 1.5s
    setTimeout(() => {
      setPhase("closed");
      // Navigate immediately so page loads behind closed doors
      onDoorsFullyClosed?.();
      
      // Wait for page to load, then ding and open
      setTimeout(() => {
        playElevatorSound("ding");
        setTimeout(() => {
          setPhase("opening");
          playElevatorSound("open");
          // Doors open over 1.2s
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 1200);
        }, 600);
      }, 800);
    }, 1500);
  }, [onComplete, onDoorsFullyClosed]);

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
  const doorDuration = isOpening ? 1.2 : 1.5;

  return (
    <AnimatePresence>
      {(isActive || phase !== "idle") && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: "hsl(40 25% 97%)" }}
        >
          {/* Left door */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full gpu-accelerated"
            initial={{ x: "-100%" }}
            animate={{ x: leftX }}
            transition={{ duration: doorDuration, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ElevatorDoor side="left" phase={phase} />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full gpu-accelerated"
            initial={{ x: "100%" }}
            animate={{ x: rightX }}
            transition={{ duration: doorDuration, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ElevatorDoor side="right" phase={phase} />
          </motion.div>

          {/* Center seam glow when closed */}
          {isClosed && (
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full z-10"
              style={{
                background: "linear-gradient(180deg, transparent 5%, rgba(180,165,140,0.3) 30%, rgba(180,165,140,0.5) 50%, rgba(180,165,140,0.3) 70%, transparent 95%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Floor indicator */}
          {isClosed && (
            <motion.div
              className="absolute top-[6%] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(0.6rem, 1.5vw, 0.9rem)",
                  letterSpacing: "0.3em",
                  color: "#b4a58c",
                }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                ▲
              </motion.span>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElevatorTransition;
