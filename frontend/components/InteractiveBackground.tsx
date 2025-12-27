"use client";

import React, { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Particle Config
        const particles: Particle[] = [];
        const particleCount = 100;
        const connectionDistance = 150;
        const mouseDistance = 200;

        let mouse = { x: 0, y: 0 };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            color: string;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                // Blue/Purple/Pink palette
                const colors = ['#60a5fa', '#a78bfa', '#f472b6'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouseDistance) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouseDistance - dist) / mouseDistance;
                    const pushX = Math.cos(angle) * force * 0.5;
                    const pushY = Math.sin(angle) * force * 0.5;

                    this.vx -= pushX;
                    this.vy -= pushY;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Init
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation Loop
        function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Draw background gradient
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, '#0f172a'); // Slate 900
            gradient.addColorStop(1, '#020617'); // Slate 950
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Update and Draw Particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw Connections
            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach(b => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 116, 139, ${1 - dist / connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Event Listeners
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none"
        />
    );
}
