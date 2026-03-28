import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import doorLeftImg from "@/assets/elevator-door-left.jpeg";
import doorRightImg from "@/assets/elevator-door-right.jpeg";

interface ElevatorTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

// Realistic elevator sounds using Web Audio API
const playElevatorSound = (type: "close" | "ding" | "open" | "motor") => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    if (type === "close") {
      const duration = 1.4;

      // Heavy hydraulic rumble
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

      // Metallic rail sliding friction
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

      // Soft pneumatic hiss
      const hissOsc = ctx.createOscillator();
      const hissGain = ctx.createGain();
      const hissFilter = ctx.createBiquadFilter();
      hissOsc.type = "sawtooth";
      hissOsc.frequency.setValueAtTime(6000, ctx.currentTime);
      hissFilter.type = "highpass";
      hissFilter.frequency.setValueAtTime(3000, ctx.currentTime);
      hissGain.gain.setValueAtTime(0.003, ctx.currentTime);
      hissGain.gain.linearRampToValueAtTime(0.006, ctx.currentTime + 0.2);
      hissGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration * 0.6);
      hissOsc.connect(hissFilter).connect(hissGain).connect(ctx.destination);
      hissOsc.start();
      hissOsc.stop(ctx.currentTime + duration * 0.6);

      // Heavy thud when doors meet
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

        // Latch click
        const click = ctx.createOscillator();
        const clickGain = ctx.createGain();
        click.type = "square";
        click.frequency.setValueAtTime(3000, ctx.currentTime + 0.05);
        clickGain.gain.setValueAtTime(0.06, ctx.currentTime + 0.05);
        clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        click.connect(clickGain).connect(ctx.destination);
        click.start(ctx.currentTime + 0.05);
        click.stop(ctx.currentTime + 0.1);
      }, duration * 1000 - 80);
    }

    if (type === "motor") {
      // Elevator motor hum while "moving"
      const duration = 1.2;
      const motor = ctx.createOscillator();
      const motorGain = ctx.createGain();
      motor.type = "sine";
      motor.frequency.setValueAtTime(100, ctx.currentTime);
      motor.frequency.linearRampToValueAtTime(120, ctx.currentTime + duration * 0.3);
      motor.frequency.linearRampToValueAtTime(90, ctx.currentTime + duration);
      motorGain.gain.setValueAtTime(0, ctx.currentTime);
      motorGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.2);
      motorGain.gain.setValueAtTime(0.04, ctx.currentTime + duration * 0.7);
      motorGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      motor.connect(motorGain).connect(ctx.destination);
      motor.start();
      motor.stop(ctx.currentTime + duration);

      // Subtle cable vibration
      const cable = ctx.createOscillator();
      const cableGain = ctx.createGain();
      cable.type = "triangle";
      cable.frequency.setValueAtTime(200, ctx.currentTime);
      cable.frequency.setValueAtTime(220, ctx.currentTime + duration * 0.5);
      cableGain.gain.setValueAtTime(0, ctx.currentTime);
      cableGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.3);
      cableGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      cable.connect(cableGain).connect(ctx.destination);
      cable.start();
      cable.stop(ctx.currentTime + duration);
    }

    if (type === "ding") {
      // Classic warm two-tone elevator ding
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gain = ctx.createGain();
      const reverb = ctx.createBiquadFilter();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1567.98, ctx.currentTime); // G6
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(2093, ctx.currentTime); // C7
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(2637, ctx.currentTime); // E7 (adds warmth)

      reverb.type = "lowpass";
      reverb.frequency.setValueAtTime(4000, ctx.currentTime);
      reverb.Q.setValueAtTime(1, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

      osc1.connect(reverb).connect(gain).connect(ctx.destination);
      osc2.connect(reverb);
      osc3.connect(reverb);
      osc1.start(); osc2.start(); osc3.start();
      osc1.stop(ctx.currentTime + 1.8);
      osc2.stop(ctx.currentTime + 1.8);
      osc3.stop(ctx.currentTime + 1.8);
    }

    if (type === "open") {
      const duration = 1.2;

      // Hydraulic release
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

      // Rail slide (opening direction)
      const rail = ctx.createOscillator();
      const railGain = ctx.createGain();
      rail.type = "sawtooth";
      rail.frequency.setValueAtTime(600, ctx.currentTime);
      rail.frequency.linearRampToValueAtTime(1400, ctx.currentTime + duration);
      railGain.gain.setValueAtTime(0.006, ctx.currentTime);
      railGain.gain.linearRampToValueAtTime(0.002, ctx.currentTime + duration);
      rail.connect(railGain).connect(ctx.destination);
      rail.start();
      rail.stop(ctx.currentTime + duration);

      // Soft bump at end
      setTimeout(() => {
        const bump = ctx.createOscillator();
        const bumpGain = ctx.createGain();
        bump.type = "sine";
        bump.frequency.setValueAtTime(50, ctx.currentTime);
        bumpGain.gain.setValueAtTime(0.06, ctx.currentTime);
        bumpGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        bump.connect(bumpGain).connect(ctx.destination);
        bump.start();
        bump.stop(ctx.currentTime + 0.12);
      }, duration * 1000 - 60);
    }
  } catch (e) {
    // Audio not available, silently skip
  }
};

const ElevatorTransition = ({ isActive, onComplete }: ElevatorTransitionProps) => {
  const [phase, setPhase] = useState<"idle" | "closing" | "closed" | "motor" | "ding" | "opening" | "done">("idle");

  const runSequence = useCallback(() => {
    // Phase 1: Doors close slowly
    setPhase("closing");
    playElevatorSound("close");

    setTimeout(() => {
      // Phase 2: Doors fully closed
      setPhase("closed");

      setTimeout(() => {
        // Phase 3: Motor hum (elevator moving)
        setPhase("motor");
        playElevatorSound("motor");

        setTimeout(() => {
          // Phase 4: Ding — arrived
          setPhase("ding");
          playElevatorSound("ding");

          setTimeout(() => {
            // Phase 5: Doors open slowly
            setPhase("opening");
            playElevatorSound("open");

            setTimeout(() => {
              setPhase("done");
              onComplete();
            }, 1300);
          }, 800);
        }, 1200);
      }, 300);
    }, 1500);
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

  const isClosed = phase === "closed" || phase === "motor" || phase === "ding";
  const isOpening = phase === "opening";

  const leftX = phase === "closing" ? "0%" : isClosed ? "0%" : isOpening ? "-100%" : "-100%";
  const rightX = phase === "closing" ? "0%" : isClosed ? "0%" : isOpening ? "100%" : "100%";

  const showFloorIndicator = isClosed || phase === "ding";
  const showCenterGlow = phase === "ding";
  const isMotorPhase = phase === "motor";

  return (
    <AnimatePresence>
      {(isActive || phase !== "idle") && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Dark background behind doors */}
          <div className="absolute inset-0" style={{ background: "#0a0a0a" }} />

          {/* Left door — uses uploaded image */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full overflow-hidden"
            initial={{ x: "-100%" }}
            animate={{ x: leftX }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ willChange: "transform" }}
          >
            <img
              src={doorLeftImg}
              alt=""
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(1)" }}
            />
            {/* Metallic edge highlight */}
            <div
              className="absolute right-0 top-0 w-[3px] h-full"
              style={{
                background: "linear-gradient(180deg, rgba(200,170,100,0.6) 0%, rgba(200,170,100,0.2) 30%, rgba(200,170,100,0.4) 50%, rgba(200,170,100,0.2) 70%, rgba(200,170,100,0.6) 100%)",
              }}
            />
            {/* Shadow on the edge */}
            <div
              className="absolute right-0 top-0 w-4 h-full"
              style={{ background: "linear-gradient(270deg, rgba(0,0,0,0.3) 0%, transparent 100%)" }}
            />
          </motion.div>

          {/* Right door — uses uploaded image */}
          <motion.div
            className="absolute top-0 right-0 w-1/2 h-full overflow-hidden"
            initial={{ x: "100%" }}
            animate={{ x: rightX }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ willChange: "transform" }}
          >
            <img
              src={doorRightImg}
              alt=""
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(1)" }}
            />
            {/* Metallic edge highlight */}
            <div
              className="absolute left-0 top-0 w-[3px] h-full"
              style={{
                background: "linear-gradient(180deg, rgba(200,170,100,0.6) 0%, rgba(200,170,100,0.2) 30%, rgba(200,170,100,0.4) 50%, rgba(200,170,100,0.2) 70%, rgba(200,170,100,0.6) 100%)",
              }}
            />
            {/* Shadow on the edge */}
            <div
              className="absolute left-0 top-0 w-4 h-full"
              style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%)" }}
            />
          </motion.div>

          {/* Center golden light line — visible when ding */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full z-10 pointer-events-none">
            <AnimatePresence>
              {showCenterGlow && (
                <motion.div
                  className="w-full h-full"
                  style={{
                    background: "linear-gradient(180deg, transparent 5%, rgba(200,170,100,0.9) 30%, rgba(255,215,120,1) 50%, rgba(200,170,100,0.9) 70%, transparent 95%)",
                    boxShadow: "0 0 20px 8px rgba(200,170,100,0.3)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.7, 1] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Floor indicator display */}
          {showFloorIndicator && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
              {/* Indicator housing */}
              <div
                className="px-6 py-2 rounded-sm"
                style={{
                  background: "linear-gradient(180deg, #2a2520 0%, #1a1815 100%)",
                  border: "1px solid rgba(200,170,100,0.3)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,170,100,0.1)",
                }}
              >
                <motion.span
                  className="font-display text-lg tracking-[0.2em]"
                  style={{ color: "#c8aa64" }}
                  animate={isMotorPhase ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
                  transition={isMotorPhase ? { repeat: Infinity, duration: 0.8 } : {}}
                >
                  {isMotorPhase ? "▲" : phase === "ding" ? "✦" : "●"}
                </motion.span>
              </div>
              {/* Small indicator dot */}
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: "radial-gradient(circle, #c8aa64, #8a6e3a)" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
              />
            </div>
          )}

          {/* Subtle vibration during motor phase */}
          {isMotorPhase && (
            <motion.div
              className="absolute inset-0 z-[1] pointer-events-none"
              animate={{ y: [0, 0.5, -0.5, 0.3, -0.3, 0] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElevatorTransition;
