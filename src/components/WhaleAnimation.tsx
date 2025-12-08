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

    // 座头鲸轮廓 - 更精确的形状
    const getWhaleOutline = (centerX: number, centerY: number, scale: number) => {
      const points: { x: number; y: number; isOutline: boolean }[] = [];
      
      // 使用贝塞尔曲线插值创建平滑的鲸鱼轮廓
      const outlinePoints = [
        // 头部（圆润的大头）
        { x: 0, y: 0.02 },
        { x: 0.02, y: -0.02 },
        { x: 0.05, y: -0.05 },
        { x: 0.08, y: -0.06 },
        { x: 0.12, y: -0.065 },
        { x: 0.16, y: -0.06 },
        // 背部隆起（座头鲸特征）
        { x: 0.2, y: -0.055 },
        { x: 0.22, y: -0.05 },
        { x: 0.25, y: -0.04 },
        // 背鳍位置
        { x: 0.55, y: -0.035 },
        { x: 0.58, y: -0.055 }, // 背鳍顶部
        { x: 0.6, y: -0.04 },
        { x: 0.62, y: -0.035 },
        // 向尾部过渡
        { x: 0.7, y: -0.025 },
        { x: 0.78, y: -0.015 },
        { x: 0.84, y: -0.005 },
        // 尾柄（变细）
        { x: 0.88, y: 0 },
        { x: 0.91, y: 0.005 },
        // 尾鳍（座头鲸标志性的大尾巴）
        { x: 0.94, y: -0.01 },
        { x: 0.97, y: -0.04 },
        { x: 1.0, y: -0.07 },
        { x: 0.98, y: -0.08 },
        { x: 0.95, y: -0.065 },
        { x: 0.93, y: -0.02 },
        { x: 0.91, y: 0.005 },
        { x: 0.93, y: 0.03 },
        { x: 0.95, y: 0.075 },
        { x: 0.98, y: 0.09 },
        { x: 1.0, y: 0.08 },
        { x: 0.97, y: 0.05 },
        { x: 0.94, y: 0.02 },
        // 腹部返回
        { x: 0.88, y: 0.015 },
        { x: 0.8, y: 0.025 },
        { x: 0.7, y: 0.04 },
        { x: 0.6, y: 0.055 },
        { x: 0.5, y: 0.07 },
        { x: 0.4, y: 0.085 },
        // 胸鳍位置（座头鲸特征：超长胸鳍）
        { x: 0.28, y: 0.09 },
        { x: 0.25, y: 0.1 },
        { x: 0.22, y: 0.14 },
        { x: 0.18, y: 0.2 },
        { x: 0.15, y: 0.24 },
        { x: 0.13, y: 0.22 },
        { x: 0.15, y: 0.16 },
        { x: 0.18, y: 0.1 },
        { x: 0.2, y: 0.085 },
        // 腹部褶皱区域
        { x: 0.15, y: 0.075 },
        { x: 0.1, y: 0.06 },
        { x: 0.05, y: 0.04 },
        { x: 0.02, y: 0.025 },
        { x: 0, y: 0.02 },
      ];

      // 沿轮廓创建更密集的点
      for (let i = 0; i < outlinePoints.length; i++) {
        const p1 = outlinePoints[i];
        const p2 = outlinePoints[(i + 1) % outlinePoints.length];
        
        // 在两点之间插入更多点
        const steps = 3;
        for (let s = 0; s < steps; s++) {
          const t = s / steps;
          points.push({
            x: centerX + (p1.x + (p2.x - p1.x) * t - 0.5) * scale,
            y: centerY + (p1.y + (p2.y - p1.y) * t) * scale,
            isOutline: true,
          });
        }
      }

      // 添加眼睛
      points.push({
        x: centerX + (0.08 - 0.5) * scale,
        y: centerY + (-0.02) * scale,
        isOutline: true,
      });

      // 添加腹部纹理线（座头鲸特征）
      for (let line = 0; line < 6; line++) {
        const startX = 0.05 + line * 0.03;
        const endX = 0.18 + line * 0.04;
        for (let i = 0; i < 5; i++) {
          const t = i / 4;
          const x = startX + (endX - startX) * t;
          const y = 0.03 + t * 0.04 + line * 0.008;
          points.push({
            x: centerX + (x - 0.5) * scale,
            y: centerY + y * scale,
            isOutline: false,
          });
        }
      }

      // 添加身体内部的点来填充
      for (let i = 0; i < 60; i++) {
        const t = Math.random() * 0.85 + 0.05;
        const bodyWidth = 0.06 * Math.sin(t * Math.PI * 0.9);
        const yOffset = (Math.random() - 0.5) * bodyWidth * 1.5;
        const baseY = -0.02 + t * 0.04;
        
        points.push({
          x: centerX + (t - 0.5) * scale,
          y: centerY + (baseY + yOffset) * scale,
          isOutline: false,
        });
      }

      return points;
    };

    const initParticles = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const scale = Math.min(width * 0.8, height * 1.4);

      const whalePoints = getWhaleOutline(centerX, centerY, scale);
      const particles: Particle[] = [];

      whalePoints.forEach((point, i) => {
        const hueOffset = (point.x - centerX + scale * 0.5) / scale * 40;
        particles.push({
          x: point.x,
          y: point.y,
          baseX: point.x,
          baseY: point.y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: point.isOutline ? Math.random() * 2.5 + 2 : Math.random() * 1.5 + 0.8,
          alpha: point.isOutline ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3 + 0.2,
          hue: 185 + hueOffset,
        });
      });

      particlesRef.current = particles;
    };

    const drawConnections = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
      const maxDistance = 45;

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
