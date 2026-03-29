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
      const duration = 1.8;

      // Deep hydraulic rumble
      const rumble = ctx.createOscillator();
      const rumbleGain = ctx.createGain();
      rumble.type = "sawtooth";
      rumble.frequency.setValueAtTime(42, ctx.currentTime);
      rumble.frequency.linearRampToValueAtTime(28, ctx.currentTime + duration);
      rumbleGain.gain.setValueAtTime(0.03, ctx.currentTime);
      rumbleGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + duration * 0.4);
      rumbleGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + duration);
      rumble.connect(rumbleGain).connect(ctx.destination);
      rumble.start();
      rumble.stop(ctx.currentTime + duration);

      // Metal-on-metal rail slide
      const rail = ctx.createOscillator();
      const railGain = ctx.createGain();
      const railFilter = ctx.createBiquadFilter();
      rail.type = "sawtooth";
      rail.frequency.setValueAtTime(2200, ctx.currentTime);
      rail.frequency.linearRampToValueAtTime(400, ctx.currentTime + duration);
      railFilter.type = "bandpass";
      railFilter.frequency.setValueAtTime(1000, ctx.currentTime);
      railFilter.Q.setValueAtTime(3, ctx.currentTime);
      railGain.gain.setValueAtTime(0.005, ctx.currentTime);
      railGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + duration * 0.3);
      railGain.gain.linearRampToValueAtTime(0.002, ctx.currentTime + duration);
      rail.connect(railFilter).connect(railGain).connect(ctx.destination);
      rail.start();
      rail.stop(ctx.currentTime + duration);

      // Pneumatic hiss
      const bufferSize = ctx.sampleRate * 0.8;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(4000, ctx.currentTime);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.008, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.003, ctx.currentTime + 0.8);
      noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
      noise.start(ctx.currentTime + 0.1);
      noise.stop(ctx.currentTime + 0.9);

      // Final thud when doors meet
      setTimeout(() => {
        const thud = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(50, ctx.currentTime);
        thud.frequency.exponentialRampToValueAtTime(18, ctx.currentTime + 0.3);
        thudGain.gain.setValueAtTime(0.18, ctx.currentTime);
        thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        thud.connect(thudGain).connect(ctx.destination);
        thud.start();
        thud.stop(ctx.currentTime + 0.35);
      }, duration * 1000 - 100);
    }

    if (type === "motor") {
      const duration = 1.2;
      // Elevator cabin motor hum
      const motor = ctx.createOscillator();
      const motorGain = ctx.createGain();
      motor.type = "sine";
      motor.frequency.setValueAtTime(80, ctx.currentTime);
      motor.frequency.linearRampToValueAtTime(110, ctx.currentTime + duration * 0.3);
      motor.frequency.linearRampToValueAtTime(75, ctx.currentTime + duration);
      motorGain.gain.setValueAtTime(0, ctx.currentTime);
      motorGain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.2);
      motorGain.gain.setValueAtTime(0.035, ctx.currentTime + duration * 0.7);
      motorGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      motor.connect(motorGain).connect(ctx.destination);
      motor.start();
      motor.stop(ctx.currentTime + duration);

      // Secondary motor harmonic
      const harm = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harm.type = "triangle";
      harm.frequency.setValueAtTime(160, ctx.currentTime);
      harm.frequency.linearRampToValueAtTime(220, ctx.currentTime + duration * 0.3);
      harm.frequency.linearRampToValueAtTime(150, ctx.currentTime + duration);
      harmGain.gain.setValueAtTime(0, ctx.currentTime);
      harmGain.gain.linearRampToValueAtTime(0.012, ctx.currentTime + 0.2);
      harmGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      harm.connect(harmGain).connect(ctx.destination);
      harm.start();
      harm.stop(ctx.currentTime + duration);
    }

    if (type === "ding") {
      // Classic 3-tone elevator ding
      const frequencies = [1567.98, 2093, 2637];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(idx === 0 ? 0.14 : 0.08, ctx.currentTime + 0.015);
        gain.gain.setValueAtTime(idx === 0 ? 0.14 : 0.08, ctx.currentTime + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.02);
        osc.stop(ctx.currentTime + 1.8);
      });
    }

    if (type === "open") {
      const duration = 1.5;
      // Door release mechanism
      const release = ctx.createOscillator();
      const releaseGain = ctx.createGain();
      release.type = "sawtooth";
      release.frequency.setValueAtTime(25, ctx.currentTime);
      release.frequency.linearRampToValueAtTime(50, ctx.currentTime + duration);
      releaseGain.gain.setValueAtTime(0.04, ctx.currentTime);
      releaseGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + duration);
      release.connect(releaseGain).connect(ctx.destination);
      release.start();
      release.stop(ctx.currentTime + duration);

      // Air release hiss
      const bufferSize = ctx.sampleRate * 0.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.2;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(5000, ctx.currentTime);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.006, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 0.5);
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

    // Doors close slowly in 1.8s
    setTimeout(() => {
      setPhase("closed");
      playElevatorSound("motor");

      // Motor hum + pause, then ding, then open
      setTimeout(() => {
        playElevatorSound("ding");
        setTimeout(() => {
          setPhase("opening");
          playElevatorSound("open");

          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 1200);
        }, 600);
      }, 900);
    }, 1800);
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

  const doorDuration = isOpening ? 1.5 : 1.8;

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
            style={{ willChange: "transform" }}
            initial={{ x: "-100%" }}
            animate={{ x: leftX }}
            transition={{ duration: doorDuration, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img src={doorLeftImg} alt="" className="w-full h-full object-cover" />
            {/* Edge shadow */}
            <div
              className="absolute right-0 top-0 w-4 h-full"
              style={{ background: "linear-gradient(270deg, rgba(0,0,0,0.15) 0%, transparent 100%)" }}
            />
          </motion.div>

          {/* Right door */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full overflow-hidden gpu-accelerated"
            style={{ willChange: "transform" }}
            initial={{ x: "100%" }}
            animate={{ x: rightX }}
            transition={{ duration: doorDuration, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img src={doorRightImg} alt="" className="w-full h-full object-cover" />
            {/* Edge shadow */}
            <div
              className="absolute left-0 top-0 w-4 h-full"
              style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 100%)" }}
            />
          </motion.div>

          {/* Center seam glow when closed */}
          {isClosed && (
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full z-10"
              style={{
                background: "linear-gradient(180deg, transparent 5%, hsl(var(--gold) / 0.6) 30%, hsl(var(--gold) / 0.9) 50%, hsl(var(--gold) / 0.6) 70%, transparent 95%)",
                boxShadow: "0 0 20px 6px hsl(var(--gold) / 0.15)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.7, 1] }}
              transition={{ duration: 0.6 }}
            />
          )}

          {/* Floor indicator */}
          {isClosed && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
              <div
                className="px-6 py-2 rounded-sm"
                style={{
                  background: "linear-gradient(180deg, hsl(220 20% 15%) 0%, hsl(220 20% 8%) 100%)",
                  border: "1px solid hsl(var(--gold) / 0.3)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                <motion.span
                  className="font-display text-sm tracking-[0.2em]"
                  style={{ color: "hsl(var(--gold-light))" }}
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
