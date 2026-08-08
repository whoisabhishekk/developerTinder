import React, { useEffect, useRef, useCallback } from "react";

const ParticleBackground = ({ densityFactor = 2800, drawLines = true, interactive = true }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  const initParticles = useCallback((width, height) => {
    const colors = [
      "#4285F4",
      "#EA4335",
      "#FBBC05",
      "#34A853",
      "#FF6D01",
      "#46BDC6",
      "#7B61FF",
      "#F538A0",
      "#EC4899",
      "#8B5CF6",
    ];
    const count = Math.floor((width * height) / densityFactor);
    const particles = [];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.floor(Math.random() * 3), // 0=circle, 1=square, 2=line
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.55 + 0.25,
      });
    }
    return particles;
  }, [densityFactor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.parentElement.offsetWidth;
    let height = canvas.parentElement.offsetHeight;

    const setSize = () => {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      if (particlesRef.current.length === 0) {
        particlesRef.current = initParticles(width, height);
      }
    };

    setSize();

    const handleResize = () => {
      setSize();
      particlesRef.current = initParticles(width, height);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;
      const repelRadius = 140;
      const repelForce = 10;
      const particles = particlesRef.current;

      if (drawLines) {
        // Draw constellation connecting lines between nearby particles
        for (let i = 0; i < particles.length; i += 2) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j += 2) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 75) {
              ctx.save();
              ctx.globalAlpha = (1 - dist / 75) * 0.18;
              ctx.strokeStyle = p1.color;
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      for (const p of particles) {
        // Mouse repulsion
        if (interactive) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repelRadius && dist > 0) {
            const force = ((repelRadius - dist) / repelRadius) * repelForce;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
        }

        // Spring back towards origin with continuous drift
        const springForce = 0.02;
        p.vx += (p.originX - p.x) * springForce + (Math.random() - 0.5) * 0.1;
        p.vy += (p.originY - p.y) * springForce + (Math.random() - 0.5) * 0.1;

        // Friction
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Update position & rotation
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === 0) {
          // Circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 1) {
          // Square
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // Line
          ctx.fillRect(-p.size * 1.5, -1, p.size * 3, 2);
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles, drawLines]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
};

export default ParticleBackground;
