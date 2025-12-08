import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  hue: number;
}

export function WhaleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const whaleOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles();
    };

    // Whale shape points (座头鲸轮廓)
    const getWhalePoints = (centerX: number, centerY: number, scale: number) => {
      const points: { x: number; y: number }[] = [];
      
      // 身体主体轮廓
      const bodyPoints = [
        // 头部
        { x: 0, y: 0 },
        { x: 0.05, y: -0.08 },
        { x: 0.12, y: -0.12 },
        { x: 0.2, y: -0.1 },
        // 背部
        { x: 0.3, y: -0.08 },
        { x: 0.4, y: -0.06 },
        { x: 0.5, y: -0.04 },
        { x: 0.6, y: -0.02 },
        // 尾部过渡
        { x: 0.7, y: 0 },
        { x: 0.8, y: 0.02 },
        { x: 0.85, y: 0.04 },
        // 尾鳍
        { x: 0.95, y: -0.06 },
        { x: 1.0, y: -0.1 },
        { x: 0.98, y: -0.02 },
        { x: 0.95, y: 0.04 },
        { x: 1.0, y: 0.1 },
        { x: 0.95, y: 0.06 },
        { x: 0.85, y: 0.04 },
        // 腹部
        { x: 0.7, y: 0.06 },
        { x: 0.6, y: 0.08 },
        { x: 0.5, y: 0.1 },
        { x: 0.4, y: 0.12 },
        { x: 0.3, y: 0.14 },
        { x: 0.2, y: 0.14 },
        // 胸鳍
        { x: 0.25, y: 0.2 },
        { x: 0.3, y: 0.25 },
        { x: 0.28, y: 0.18 },
        { x: 0.2, y: 0.14 },
        // 回到头部
        { x: 0.1, y: 0.1 },
        { x: 0.05, y: 0.06 },
        { x: 0, y: 0 },
      ];

      bodyPoints.forEach((p) => {
        points.push({
          x: centerX + (p.x - 0.5) * scale,
          y: centerY + p.y * scale,
        });
      });

      // 添加内部细节点（腹部纹理）
      for (let i = 0; i < 12; i++) {
        const t = i / 12;
        points.push({
          x: centerX + (0.15 + t * 0.35 - 0.5) * scale,
          y: centerY + (0.06 + Math.sin(t * Math.PI) * 0.04) * scale,
        });
      }

      return points;
    };

    const initParticles = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scale = Math.min(width * 0.7, height * 1.2);

      const whalePoints = getWhalePoints(centerX, centerY, scale);
      const particles: Particle[] = [];

      // 从鲸鱼轮廓点创建粒子 - 增加粒子大小
      whalePoints.forEach((point, i) => {
        const hueOffset = (i / whalePoints.length) * 60; // 0-60 hue range
        particles.push({
          x: point.x,
          y: point.y,
          baseX: point.x,
          baseY: point.y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 2, // 增大粒子
          alpha: Math.random() * 0.6 + 0.4, // 提高透明度
          hue: 180 + hueOffset, // 青色到蓝绿色渐变
        });
      });

      // 添加更多随机粒子填充鲸鱼形状
      for (let i = 0; i < 120; i++) {
        const t = Math.random();
        const bodyX = centerX + (t * 0.8 - 0.4) * scale;
        const bodyY = centerY + (Math.sin(t * Math.PI) * 0.08 - 0.02) * scale + (Math.random() - 0.5) * scale * 0.15;
        const hueOffset = t * 60;
        
        particles.push({
          x: bodyX,
          y: bodyY,
          baseX: bodyX,
          baseY: bodyY,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.4 + 0.2,
          hue: 175 + hueOffset + Math.random() * 20,
        });
      }

      particlesRef.current = particles;
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      const maxDistance = 60;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const alpha = (1 - distance / maxDistance) * 0.35;
            const avgHue = (particles[i].hue + particles[j].hue) / 2;
            ctx.beginPath();
            ctx.strokeStyle = `hsla(${avgHue}, 70%, 55%, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.clearRect(0, 0, width, height);

      timeRef.current += 0.008;

      // 鲸鱼缓慢游动
      whaleOffsetRef.current.x = Math.sin(timeRef.current * 0.5) * 25;
      whaleOffsetRef.current.y = Math.sin(timeRef.current * 0.3) * 12;

      const particles = particlesRef.current;

      // 更新粒子位置
      particles.forEach((particle, index) => {
        // 基于时间的波动
        const waveX = Math.sin(timeRef.current + index * 0.1) * 4;
        const waveY = Math.cos(timeRef.current * 0.8 + index * 0.15) * 3;

        // 呼吸效果
        const breathScale = 1 + Math.sin(timeRef.current * 0.5) * 0.025;
        const centerX = width * 0.5 + whaleOffsetRef.current.x;
        const centerY = height * 0.5 + whaleOffsetRef.current.y;

        particle.x = particle.baseX + waveX + whaleOffsetRef.current.x;
        particle.y = particle.baseY + waveY + whaleOffsetRef.current.y;

        // 应用呼吸缩放
        particle.x = centerX + (particle.x - centerX) * breathScale;
        particle.y = centerY + (particle.y - centerY) * breathScale;

        // 动态调整颜色
        particle.hue = particle.hue + Math.sin(timeRef.current + index * 0.05) * 0.5;

        // 更新透明度
        particle.alpha = 0.3 + Math.sin(timeRef.current + index * 0.2) * 0.2 + 0.2;
      });

      // 绘制连接线
      drawConnections(ctx, particles);

      // 绘制粒子 - 使用渐变色
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 75%, 60%, ${particle.alpha})`;
        ctx.fill();
        
        // 添加发光效果
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 65%, ${particle.alpha * 0.3})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
    />
  );
}
