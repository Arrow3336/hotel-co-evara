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
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 2.2);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.003, ctx.currentTime + 2.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.2);

      const bufferSize = ctx.sampleRate * 2.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.002;
      }
      const noise = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      noise.buffer = buffer;
      noiseGain.gain.setValueAtTime(0.6, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.2);
      noise.connect(noiseGain).connect(ctx.destination);
      noise.start();

      setTimeout(() => {
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(40, ctx.currentTime);
        thudGain.gain.setValueAtTime(0.04, ctx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start();
        thud.stop(ctx.currentTime + 0.12);
      }, 2100);
    }

    if (type === "ding") {
      [1318, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(i === 0 ? 0.06 : 0.035, ctx.currentTime + i * 0.15 + 0.02);
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
      osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 1.8);
      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.8);
    }
  } catch (e) {}
};

const ElevatorDoor = ({ side, phase }: { side: "left" | "right"; phase: string }) => {
  const text = side === "left" ? "Evara" : "Co.";
  const isClosed = phase === "closed" || phase === "glow";

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #faf9f7 0%, #f5f3ef 20%, #f0ede8 40%, #ece9e3 60%, #e8e5df 80%, #e4e1db 100%)",
        willChange: "transform",
      }}
    >
      {/* Brushed metal texture */}
      <div className="absolute inset-0" style={{
        background: `repeating-linear-gradient(180deg, transparent, transparent 1px, rgba(0,0,0,0.004) 1px, rgba(0,0,0,0.004) 2px)`,
      }} />

      {/* Panel frame - outer edge */}
      <div className="absolute inset-0" style={{
        boxShadow: side === "left"
          ? "inset -2px 0 8px rgba(0,0,0,0.06), inset 0 2px 4px rgba(0,0,0,0.02)"
          : "inset 2px 0 8px rgba(0,0,0,0.06), inset 0 2px 4px rgba(0,0,0,0.02)",
      }} />

      {/* Elegant panel groove - inner frame */}
      <div className="absolute" style={{
        top: "4%", bottom: "4%",
        left: side === "left" ? "6%" : "8%",
        right: side === "left" ? "8%" : "6%",
        border: "0.5px solid rgba(180,170,155,0.12)",
        borderRadius: "2px",
      }} />

      {/* Second inner frame for depth */}
      <div className="absolute" style={{
        top: "8%", bottom: "8%",
        left: side === "left" ? "10%" : "12%",
        right: side === "left" ? "12%" : "10%",
        border: "0.5px solid rgba(180,170,155,0.08)",
        borderRadius: "1px",
      }} />

      {/* Horizontal decorative trim lines */}
      <div className="absolute left-[12%] right-[12%] h-px" style={{ top: "15%", background: "linear-gradient(90deg, transparent, rgba(190,175,150,0.15), transparent)" }} />
      <div className="absolute left-[12%] right-[12%] h-px" style={{ bottom: "15%", background: "linear-gradient(90deg, transparent, rgba(190,175,150,0.15), transparent)" }} />

      {/* Diamond accent */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 opacity-15" style={{ background: "rgba(180,160,130,0.4)", border: "0.5px solid rgba(180,160,130,0.3)" }} />
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 opacity-15" style={{ background: "rgba(180,160,130,0.4)", border: "0.5px solid rgba(180,160,130,0.3)" }} />

      {/* Vertical reflection highlight */}
      <div className="absolute top-0 bottom-0 w-[40%]" style={{
        left: side === "left" ? "30%" : "30%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
      }} />

      {/* Center text with elegant animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="select-none"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
            fontWeight: 300,
            letterSpacing: "0.2em",
            color: "#a89880",
            textShadow: "0 1px 2px rgba(255,255,255,0.8)",
          }}
          animate={isClosed ? {
            opacity: [0.5, 0.9, 0.5],
            textShadow: [
              "0 1px 2px rgba(255,255,255,0.8)",
              "0 0 25px rgba(180,160,130,0.25), 0 1px 2px rgba(255,255,255,0.8)",
              "0 1px 2px rgba(255,255,255,0.8)",
            ],
          } : { opacity: 0.7 }}
          transition={isClosed ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
        >
          {text}
        </motion.span>
      </div>

      {/* Edge highlight on meeting side */}
      <div className="absolute top-0 bottom-0 w-px" style={{
        [side === "left" ? "right" : "left"]: 0,
        background: "linear-gradient(180deg, transparent 5%, rgba(200,190,170,0.15) 30%, rgba(200,190,170,0.25) 50%, rgba(200,190,170,0.15) 70%, transparent 95%)",
      }} />
    </div>
  );
};

const ElevatorTransition = ({ isActive, onComplete, onDoorsFullyClosed }: ElevatorTransitionProps) => {
  const [phase, setPhase] = useState<"idle" | "closing" | "closed" | "glow" | "opening" | "done">("idle");

  const runSequence = useCallback(() => {
    setPhase("closing");
    playElevatorSound("close");

    // Doors close over 2.2s
    setTimeout(() => {
      setPhase("closed");
      onDoorsFullyClosed?.();

      // Hold 1.2s for page load, then glow + ding
      setTimeout(() => {
        setPhase("glow");
        playElevatorSound("ding");

        // Glow 1s, then open with 3D effect
        setTimeout(() => {
          setPhase("opening");
          playElevatorSound("open");

          // Doors open over 2s
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 2000);
        }, 1000);
      }, 1200);
    }, 2200);
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

  const doorDuration = isClosing ? 2.2 : isOpening ? 2.0 : 0.3;

  // 3D perspective zoom when opening — camera moves forward
  const getScale = () => {
    if (isOpening) return 1.15;
    return 1;
  };
  const getZ = () => {
    if (isOpening) return "80px";
    return "0px";
  };

  return (
    <AnimatePresence>
      {(isActive || phase !== "idle") && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
            background: "transparent",
          }}
        >
          {/* 3D container that zooms forward when doors open */}
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
            animate={{
              scale: getScale(),
              z: getZ(),
            }}
            transition={{
              duration: isOpening ? 2.0 : 0.3,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* Left door */}
            <motion.div
              className="absolute top-0 left-0 w-1/2 h-full"
              style={{ willChange: "transform", backfaceVisibility: "hidden" }}
              initial={{ x: "-100%" }}
              animate={{ x: getLeftX() }}
              transition={{ duration: doorDuration, ease: [0.4, 0, 0.15, 1] }}
            >
              <ElevatorDoor side="left" phase={phase} />
            </motion.div>

            {/* Right door */}
            <motion.div
              className="absolute top-0 right-0 w-1/2 h-full"
              style={{ willChange: "transform", backfaceVisibility: "hidden" }}
              initial={{ x: "100%" }}
              animate={{ x: getRightX() }}
              transition={{ duration: doorDuration, ease: [0.4, 0, 0.15, 1] }}
            >
              <ElevatorDoor side="right" phase={phase} />
            </motion.div>

            {/* Center seam */}
            {isClosed && (
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full z-10"
                style={{
                  background: "linear-gradient(180deg, transparent 3%, rgba(180,165,140,0.3) 25%, rgba(180,165,140,0.5) 50%, rgba(180,165,140,0.3) 75%, transparent 97%)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Golden glow when doors meet */}
            {isGlowing && (
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5] }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px]" style={{
                  background: "linear-gradient(90deg, transparent 15%, rgba(200,180,140,0.6) 40%, rgba(220,200,160,0.9) 50%, rgba(200,180,140,0.6) 60%, transparent 85%)",
                  boxShadow: "0 0 80px 30px rgba(200,180,140,0.12)",
                }} />
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(200,180,140,0.2) 0%, transparent 70%)",
                  }}
                  animate={{ scale: [0.5, 2], opacity: [0.8, 0] }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </motion.div>
            )}

            {/* Floor indicator */}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElevatorTransition;
