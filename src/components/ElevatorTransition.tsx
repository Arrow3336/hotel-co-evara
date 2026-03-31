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
      // Smooth mechanical slide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 1.8);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.004, ctx.currentTime + 1.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);

      // Soft pneumatic hiss
      const bufferSize = ctx.sampleRate * 1.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.003;
      }
      const noise = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      noise.buffer = buffer;
      noiseGain.gain.setValueAtTime(0.8, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);
      noise.connect(noiseGain).connect(ctx.destination);
      noise.start();

      // Soft thud when doors meet
      setTimeout(() => {
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(40, ctx.currentTime);
        thudGain.gain.setValueAtTime(0.05, ctx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start();
        thud.stop(ctx.currentTime + 0.15);
      }, 1700);
    }

    if (type === "ding") {
      // Classic 2-tone elevator chime
      [1318, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(i === 0 ? 0.07 : 0.04, ctx.currentTime + i * 0.15 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 1.4);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 1.4);
      });
    }

    if (type === "open") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(30, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 1.4);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.002, ctx.currentTime + 1.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.4);
    }
  } catch (e) {
    // Audio not available
  }
};

const ElevatorDoor = ({ side, phase }: { side: "left" | "right"; phase: string }) => {
  const text = side === "left" ? "Evara" : "Co.";
  const isClosed = phase === "closed" || phase === "glow";

  return (
    <div
      className="w-full h-full relative gpu-accelerated overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f8f6f3 0%, #f0ede8 25%, #ebe8e3 50%, #e6e3dd 75%, #e2dfd9 100%)",
      }}
    >
      {/* Brushed steel texture */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(180deg, transparent, transparent 1px, rgba(0,0,0,0.006) 1px, rgba(0,0,0,0.006) 3px)`,
        }}
      />

      {/* Vertical panel groove lines */}
      <div className="absolute inset-0" style={{
        background: side === "left"
          ? "linear-gradient(90deg, rgba(0,0,0,0.02) 0%, transparent 2%, transparent 48%, rgba(0,0,0,0.04) 49%, rgba(0,0,0,0.06) 50%)"
          : "linear-gradient(90deg, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.04) 51%, transparent 52%, transparent 98%, rgba(0,0,0,0.02) 100%)",
      }} />

      {/* Horizontal decorative trim - top */}
      <div className="absolute top-[6%] left-[12%] right-[12%] h-[0.5px]" style={{ background: "linear-gradient(90deg, transparent, rgba(190,175,150,0.2), transparent)" }} />

      {/* Horizontal decorative trim - bottom */}
      <div className="absolute bottom-[6%] left-[12%] right-[12%] h-[0.5px]" style={{ background: "linear-gradient(90deg, transparent, rgba(190,175,150,0.2), transparent)" }} />

      {/* Center diamond accent */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rotate-45 opacity-20" style={{ background: "rgba(180,160,130,0.5)" }} />

      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="select-none"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.6rem, 4.5vw, 3.2rem)",
            fontWeight: 300,
            letterSpacing: "0.18em",
            color: "#a89880",
            textShadow: "0 1px 3px rgba(255,255,255,0.9)",
          }}
          animate={isClosed ? {
            opacity: [0.6, 1, 0.6],
            textShadow: [
              "0 1px 3px rgba(255,255,255,0.9)",
              "0 0 20px rgba(180,160,130,0.3), 0 1px 3px rgba(255,255,255,0.9)",
              "0 1px 3px rgba(255,255,255,0.9)",
            ],
          } : { opacity: 0.8 }}
          transition={isClosed ? {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          } : {}}
        >
          {text}
        </motion.span>
      </div>

      {/* Subtle center reflection */}
      <div className="absolute top-[15%] bottom-[15%] left-1/2 -translate-x-1/2 w-[50%]" style={{
        background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.03), transparent)",
      }} />
    </div>
  );
};

const ElevatorTransition = ({ isActive, onComplete, onDoorsFullyClosed }: ElevatorTransitionProps) => {
  const [phase, setPhase] = useState<"idle" | "closing" | "closed" | "glow" | "opening" | "done">("idle");

  const runSequence = useCallback(() => {
    setPhase("closing");
    playElevatorSound("close");

    // Doors close smoothly over 1.8s
    setTimeout(() => {
      setPhase("closed");
      // Navigate immediately — page loads behind closed doors
      onDoorsFullyClosed?.();

      // Hold closed for 1s while page loads, then glow + ding
      setTimeout(() => {
        setPhase("glow");
        playElevatorSound("ding");

        // Glow for 0.8s, then open
        setTimeout(() => {
          setPhase("opening");
          playElevatorSound("open");

          // Doors slide open over 1.6s
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 1600);
        }, 800);
      }, 1000);
    }, 1800);
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

  const isClosing = phase === "closing";
  const isClosed = phase === "closed" || phase === "glow";
  const isOpening = phase === "opening";
  const isGlowing = phase === "glow";

  const getLeftX = () => {
    if (isClosing) return "0%";
    if (isClosed) return "0%";
    if (isOpening) return "-100%";
    return "-100%";
  };
  const getRightX = () => {
    if (isClosing) return "0%";
    if (isClosed) return "0%";
    if (isOpening) return "100%";
    return "100%";
  };

  const doorDuration = isClosing ? 1.8 : isOpening ? 1.6 : 0.3;

  return (
    <AnimatePresence>
      {(isActive || phase !== "idle") && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{ background: "transparent" }}
        >
          {/* Left door */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full gpu-accelerated"
            initial={{ x: "-100%" }}
            animate={{ x: getLeftX() }}
            transition={{ duration: doorDuration, ease: [0.4, 0, 0.2, 1] }}
          >
            <ElevatorDoor side="left" phase={phase} />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full gpu-accelerated"
            initial={{ x: "100%" }}
            animate={{ x: getRightX() }}
            transition={{ duration: doorDuration, ease: [0.4, 0, 0.2, 1] }}
          >
            <ElevatorDoor side="right" phase={phase} />
          </motion.div>

          {/* Center seam line when closed */}
          {isClosed && (
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full z-10"
              style={{
                background: "linear-gradient(180deg, transparent 3%, rgba(180,165,140,0.25) 25%, rgba(180,165,140,0.4) 50%, rgba(180,165,140,0.25) 75%, transparent 97%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Golden glow effect when doors meet */}
          {isGlowing && (
            <motion.div
              className="absolute inset-0 z-20 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Horizontal light sweep */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px]" style={{
                background: "linear-gradient(90deg, transparent 20%, rgba(200,180,140,0.5) 45%, rgba(220,200,160,0.8) 50%, rgba(200,180,140,0.5) 55%, transparent 80%)",
                boxShadow: "0 0 60px 20px rgba(200,180,140,0.15)",
              }} />
              {/* Center glow burst */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(200,180,140,0.2) 0%, transparent 70%)",
                }}
                animate={{ scale: [0.5, 1.5], opacity: [0.8, 0] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>
          )}

          {/* Floor indicator arrow */}
          {isClosed && (
            <motion.div
              className="absolute top-[5%] left-1/2 -translate-x-1/2 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <motion.span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(0.5rem, 1.2vw, 0.75rem)",
                  letterSpacing: "0.3em",
                  color: "#b4a58c",
                }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
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
