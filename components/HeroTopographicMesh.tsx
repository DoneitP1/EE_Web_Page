"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ── Config ──────────────────────────────────────────────────────
const BALL_COUNT_DESKTOP = 8;
const BALL_COUNT_MOBILE = 5;
const MIN_RADIUS = 80;
const MAX_RADIUS = 200;
const CONTOUR_LEVELS = 5;
const THRESHOLD_BASE = 1.0;
const THRESHOLD_STEP = 0.35;
const STROKE_COLOR = [145, 140, 130]; // RGB for contour lines
const BASE_OPACITY = 0.45;
const OPACITY_DECAY = 0.18;
const LINE_WIDTH_BASE = 2.2;
const LINE_WIDTH_DECAY = 0.3;
const RESOLUTION_DESKTOP = 4;    // cell size — was 3, bumped to 4 for perf
const RESOLUTION_MOBILE = 6;     // mobile: coarser grid
const DPR_CAP = 1;
const SPEED_RANGE = [0.03, 0.1];
const TARGET_FPS = 30;           // cap at 30fps for smooth but efficient rendering
const FRAME_BUDGET = 1000 / TARGET_FPS;

// ── Metaball ────────────────────────────────────────────────────
interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    phase: number;
    pulseSpeed: number;
    pulseAmt: number;
}

function createBalls(w: number, h: number, count: number): Ball[] {
    const balls: Ball[] = [];
    for (let i = 0; i < count; i++) {
        const r = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
        const speed = SPEED_RANGE[0] + Math.random() * (SPEED_RANGE[1] - SPEED_RANGE[0]);
        const angle = Math.random() * Math.PI * 2;
        balls.push({
            x: r + Math.random() * (w - r * 2),
            y: r + Math.random() * (h - r * 2),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r,
            phase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.08 + Math.random() * 0.12,
            pulseAmt: 0.05 + Math.random() * 0.08,
        });
    }
    return balls;
}

function updateBalls(balls: Ball[], w: number, h: number, dt: number) {
    for (const b of balls) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        const margin = 50;
        if (b.x < margin) { b.x = margin; b.vx = Math.abs(b.vx); }
        if (b.x > w - margin) { b.x = w - margin; b.vx = -Math.abs(b.vx); }
        if (b.y < margin) { b.y = margin; b.vy = Math.abs(b.vy); }
        if (b.y > h - margin) { b.y = h - margin; b.vy = -Math.abs(b.vy); }

        b.vx += (Math.random() - 0.5) * 0.001 * dt;
        b.vy += (Math.random() - 0.5) * 0.001 * dt;

        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        const maxSpeed = SPEED_RANGE[1] * 1.3;
        const minSpeed = SPEED_RANGE[0] * 0.7;
        if (speed > maxSpeed) { b.vx = (b.vx / speed) * maxSpeed; b.vy = (b.vy / speed) * maxSpeed; }
        if (speed < minSpeed && speed > 0) { b.vx = (b.vx / speed) * minSpeed; b.vy = (b.vy / speed) * minSpeed; }
    }
}

// ── Optimized marching squares — reuses segments array ─────
function marchingSquares(
    field: Float32Array,
    cols: number,
    rows: number,
    cellSize: number,
    threshold: number,
    segments: number[][]
): void {
    segments.length = 0;

    for (let j = 0; j < rows - 1; j++) {
        const rowOffset = j * cols;
        const nextRowOffset = (j + 1) * cols;
        for (let i = 0; i < cols - 1; i++) {
            const tl = field[rowOffset + i];
            const tr = field[rowOffset + (i + 1)];
            const br = field[nextRowOffset + (i + 1)];
            const bl = field[nextRowOffset + i];

            const config =
                (tl >= threshold ? 8 : 0) |
                (tr >= threshold ? 4 : 0) |
                (br >= threshold ? 2 : 0) |
                (bl >= threshold ? 1 : 0);

            if (config === 0 || config === 15) continue;

            const x = i * cellSize;
            const y = j * cellSize;

            const lerpTlTr = Math.abs(tr - tl) < 0.0001 ? 0.5 : (threshold - tl) / (tr - tl);
            const lerpBlBr = Math.abs(br - bl) < 0.0001 ? 0.5 : (threshold - bl) / (br - bl);
            const lerpTlBl = Math.abs(bl - tl) < 0.0001 ? 0.5 : (threshold - tl) / (bl - tl);
            const lerpTrBr = Math.abs(br - tr) < 0.0001 ? 0.5 : (threshold - tr) / (br - tr);

            const top = x + lerpTlTr * cellSize;
            const bottom = x + lerpBlBr * cellSize;
            const left = y + lerpTlBl * cellSize;
            const right = y + lerpTrBr * cellSize;

            switch (config) {
                case 1: segments.push([x, left, bottom, y + cellSize]); break;
                case 2: segments.push([bottom, y + cellSize, x + cellSize, right]); break;
                case 3: segments.push([x, left, x + cellSize, right]); break;
                case 4: segments.push([top, y, x + cellSize, right]); break;
                case 5:
                    segments.push([x, left, top, y]);
                    segments.push([bottom, y + cellSize, x + cellSize, right]);
                    break;
                case 6: segments.push([top, y, bottom, y + cellSize]); break;
                case 7: segments.push([x, left, top, y]); break;
                case 8: segments.push([top, y, x, left]); break;
                case 9: segments.push([top, y, bottom, y + cellSize]); break;
                case 10:
                    segments.push([top, y, x + cellSize, right]);
                    segments.push([x, left, bottom, y + cellSize]);
                    break;
                case 11: segments.push([top, y, x + cellSize, right]); break;
                case 12: segments.push([x, left, x + cellSize, right]); break;
                case 13: segments.push([bottom, y + cellSize, x + cellSize, right]); break;
                case 14: segments.push([x, left, bottom, y + cellSize]); break;
            }
        }
    }
}

// ── Component ──────────────────────────────────────────────────
interface Props {
    containerRef: React.RefObject<HTMLElement | null>;
    scrollProgress?: MotionValue<number>;
    className?: string;
}

export function HeroTopographicMesh({ containerRef, scrollProgress, className = "" }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    const scrollOpacity = scrollProgress
        ? useTransform(scrollProgress, [0, 0.1, 0.4, 0.65], [0.85, 1, 1, 0])
        : undefined;

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const mobile = window.innerWidth < 768;
        const ballCount = mobile ? BALL_COUNT_MOBILE : BALL_COUNT_DESKTOP;
        const resolution = mobile ? RESOLUTION_MOBILE : RESOLUTION_DESKTOP;
        const contourLevels = mobile ? 3 : CONTOUR_LEVELS; // fewer contour levels on mobile

        let animId = 0;
        let isRunning = true;
        let balls: Ball[] = [];
        let lastTime = performance.now();
        let lastFrameTime = 0;

        // Pre-allocate reusable arrays
        let field: Float32Array | null = null;
        let fieldCols = 0;
        let fieldRows = 0;
        const segmentsBuffer: number[][] = [];

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
            const w = canvas!.clientWidth;
            const h = canvas!.clientHeight;
            canvas!.width = Math.floor(w * dpr);
            canvas!.height = Math.floor(h * dpr);
            ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

            // Pre-allocate field buffer
            const cellSize = resolution;
            fieldCols = Math.ceil(w / cellSize) + 1;
            fieldRows = Math.ceil(h / cellSize) + 1;
            field = new Float32Array(fieldCols * fieldRows);

            if (balls.length === 0) {
                balls = createBalls(w, h, ballCount);
            } else {
                for (const b of balls) {
                    b.x = Math.min(b.x, w - 50);
                    b.y = Math.min(b.y, h - 50);
                }
            }
        }

        resize();
        window.addEventListener("resize", resize);

        function animate(now: number) {
            if (!isRunning) return;

            // Frame rate limiting
            const elapsed = now - lastFrameTime;
            if (elapsed < FRAME_BUDGET) {
                animId = requestAnimationFrame(animate);
                return;
            }
            lastFrameTime = now - (elapsed % FRAME_BUDGET);

            const dt = Math.min(now - lastTime, 50);
            lastTime = now;
            const timeSec = now / 1000;

            const w = canvas!.clientWidth;
            const h = canvas!.clientHeight;

            updateBalls(balls, w, h, dt);

            ctx!.clearRect(0, 0, w, h);

            if (!field) {
                animId = requestAnimationFrame(animate);
                return;
            }

            // Compute field on grid — inline for performance
            const cellSize = resolution;
            for (let j = 0; j < fieldRows; j++) {
                for (let i = 0; i < fieldCols; i++) {
                    const px = i * cellSize;
                    const py = j * cellSize;
                    let sum = 0;
                    for (let bi = 0; bi < balls.length; bi++) {
                        const b = balls[bi];
                        const pulse = 1 + Math.sin(timeSec * b.pulseSpeed + b.phase) * b.pulseAmt;
                        const r = b.r * pulse;
                        const dx = px - b.x;
                        const dy = py - b.y;
                        sum += (r * r) / (dx * dx + dy * dy + 1);
                    }
                    field[j * fieldCols + i] = sum;
                }
            }

            // Draw contour lines
            for (let level = 0; level < contourLevels; level++) {
                const threshold = THRESHOLD_BASE + level * THRESHOLD_STEP;
                marchingSquares(field, fieldCols, fieldRows, cellSize, threshold, segmentsBuffer);

                if (segmentsBuffer.length === 0) continue;

                const opacity = Math.max(0.05, BASE_OPACITY - level * OPACITY_DECAY);
                const lineW = Math.max(0.5, LINE_WIDTH_BASE - level * LINE_WIDTH_DECAY);

                ctx!.strokeStyle = `rgba(${STROKE_COLOR[0]}, ${STROKE_COLOR[1]}, ${STROKE_COLOR[2]}, ${opacity})`;
                ctx!.lineWidth = lineW;
                ctx!.lineCap = "round";
                ctx!.lineJoin = "round";

                ctx!.beginPath();
                for (let si = 0; si < segmentsBuffer.length; si++) {
                    const seg = segmentsBuffer[si];
                    ctx!.moveTo(seg[0], seg[1]);
                    ctx!.lineTo(seg[2], seg[3]);
                }
                ctx!.stroke();
            }

            // Erase center area
            ctx!.save();
            ctx!.globalCompositeOperation = "destination-out";
            const centerX = w / 2;
            const centerY = h * 0.5;
            const maskW = w * 0.38;
            const maskH = h * 0.85;
            const gradient = ctx!.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, Math.max(maskW, maskH)
            );
            gradient.addColorStop(0, "rgba(0,0,0,1)");
            gradient.addColorStop(0.5, "rgba(0,0,0,0.8)");
            gradient.addColorStop(0.75, "rgba(0,0,0,0.3)");
            gradient.addColorStop(1, "rgba(0,0,0,0)");
            ctx!.fillStyle = gradient;
            ctx!.beginPath();
            ctx!.ellipse(centerX, centerY, maskW, maskH, 0, 0, Math.PI * 2);
            ctx!.fill();
            ctx!.restore();

            animId = requestAnimationFrame(animate);
        }

        animId = requestAnimationFrame(animate);

        // IntersectionObserver for perf — pause when off-screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                const wasRunning = isRunning;
                isRunning = entry.isIntersecting;
                if (isRunning && !wasRunning) {
                    lastTime = performance.now();
                    lastFrameTime = performance.now();
                    animId = requestAnimationFrame(animate);
                }
            },
            { threshold: 0.05 },
        );
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            isRunning = false;
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            observer.disconnect();
        };
    }, [containerRef]);

    return (
        <motion.div
            style={scrollOpacity ? { opacity: scrollOpacity } : undefined}
            className={`absolute inset-0 ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
                style={{ background: "transparent" }}
            />
        </motion.div>
    );
}
