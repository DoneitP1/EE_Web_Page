"use client";

import { useEffect, useRef, useState } from "react";

// ==================== TYPES ====================

interface ColorRGB {
    r: number;
    g: number;
    b: number;
}

interface Pointer {
    id: number;
    texcoordX: number;
    texcoordY: number;
    prevTexcoordX: number;
    prevTexcoordY: number;
    deltaX: number;
    deltaY: number;
    down: boolean;
    moved: boolean;
    color: ColorRGB;
}

interface FBO {
    texture: WebGLTexture;
    fbo: WebGLFramebuffer;
    width: number;
    height: number;
    texelSizeX: number;
    texelSizeY: number;
    attach: (id: number) => number;
}

interface DoubleFBO {
    width: number;
    height: number;
    texelSizeX: number;
    texelSizeY: number;
    read: FBO;
    write: FBO;
    swap: () => void;
}

interface HeroFluidCyborgProps {
    cyborgSrc: string;
    containerRef: React.RefObject<HTMLElement | null>;
    photoContainerRef: React.RefObject<HTMLElement | null>;
    className?: string;
}

// ==================== COMPONENT ====================

export function HeroFluidCyborg({ cyborgSrc, containerRef, photoContainerRef, className = "" }: HeroFluidCyborgProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    // ==================== WEBGL FLUID + CYBORG MASKING ====================
    useEffect(() => {
        if (!isReady) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const isMobileDevice = window.innerWidth < 768;
        const config = {
            SIM_RESOLUTION: isMobileDevice ? 64 : 128,
            DYE_RESOLUTION: isMobileDevice ? 512 : 1024,
            DENSITY_DISSIPATION: 3.5,
            VELOCITY_DISSIPATION: 2,
            PRESSURE: 0.1,
            PRESSURE_ITERATIONS: isMobileDevice ? 10 : 20,
            CURL: 3,
            SPLAT_RADIUS: 0.2,
            SPLAT_FORCE: 6000,
            SHADING: !isMobileDevice,
            COLOR_UPDATE_SPEED: 10,
            TRANSPARENT: true,
            BACK_COLOR: { r: 0, g: 0, b: 0 },
        };

        // ---------- Pointer ----------
        function pointerPrototype(): Pointer {
            return {
                id: -1, texcoordX: 0, texcoordY: 0,
                prevTexcoordX: 0, prevTexcoordY: 0,
                deltaX: 0, deltaY: 0,
                down: false, moved: false,
                color: { r: 0, g: 0, b: 0 },
            };
        }

        const pointers: Pointer[] = [pointerPrototype()];

        // ---------- WebGL Context ----------
        const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
        let gl = canvas.getContext("webgl2", params) as WebGL2RenderingContext | null;
        if (!gl) gl = (canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params)) as WebGL2RenderingContext | null;
        if (!gl) return;

        const isWebGL2 = "drawBuffers" in gl;
        let supportLinearFiltering = false;
        let halfFloat: any = null;

        if (isWebGL2) {
            gl.getExtension("EXT_color_buffer_float");
            supportLinearFiltering = !!gl.getExtension("OES_texture_float_linear");
        } else {
            halfFloat = gl.getExtension("OES_texture_half_float");
            supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
        }

        gl.clearColor(0, 0, 0, 0);

        const halfFloatTexType = isWebGL2
            ? (gl as WebGL2RenderingContext).HALF_FLOAT
            : (halfFloat && halfFloat.HALF_FLOAT_OES) || 0;

        if (!supportLinearFiltering) {
            config.DYE_RESOLUTION = 256;
            config.SHADING = false;
        }

        // ---------- Format Support ----------
        function supportRenderTextureFormat(internalFormat: number, format: number, type: number) {
            const texture = gl!.createTexture();
            if (!texture) return false;
            gl!.bindTexture(gl!.TEXTURE_2D, texture);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
            gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
            const fbo = gl!.createFramebuffer();
            if (!fbo) return false;
            gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
            gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
            return gl!.checkFramebufferStatus(gl!.FRAMEBUFFER) === gl!.FRAMEBUFFER_COMPLETE;
        }

        function getSupportedFormat(internalFormat: number, format: number, type: number): { internalFormat: number; format: number } | null {
            if (!supportRenderTextureFormat(internalFormat, format, type)) {
                if (isWebGL2) {
                    const gl2 = gl as WebGL2RenderingContext;
                    switch (internalFormat) {
                        case gl2.R16F: return getSupportedFormat(gl2.RG16F, gl2.RG, type);
                        case gl2.RG16F: return getSupportedFormat(gl2.RGBA16F, gl2.RGBA, type);
                        default: return null;
                    }
                }
                return null;
            }
            return { internalFormat, format };
        }

        let formatRGBA: any, formatRG: any, formatR: any;
        if (isWebGL2) {
            const gl2 = gl as WebGL2RenderingContext;
            formatRGBA = getSupportedFormat(gl2.RGBA16F, gl2.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl2.RG16F, gl2.RG, halfFloatTexType);
            formatR = getSupportedFormat(gl2.R16F, gl2.RED, halfFloatTexType);
        } else {
            formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
            formatRG = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
            formatR = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
        }

        if (!formatRGBA || !formatRG || !formatR) return;

        // ---------- Shader Helpers ----------
        function hashCode(s: string) {
            let hash = 0;
            for (let i = 0; i < s.length; i++) { hash = (hash << 5) - hash + s.charCodeAt(i); hash |= 0; }
            return hash;
        }

        function addKeywords(source: string, keywords: string[] | null) {
            if (!keywords) return source;
            return keywords.map(k => `#define ${k}\n`).join("") + source;
        }

        function compileShader(type: number, source: string, keywords: string[] | null = null) {
            const shader = gl!.createShader(type);
            if (!shader) return null;
            gl!.shaderSource(shader, addKeywords(source, keywords));
            gl!.compileShader(shader);
            return shader;
        }

        function createProgram(vs: WebGLShader | null, fs: WebGLShader | null) {
            if (!vs || !fs) return null;
            const p = gl!.createProgram();
            if (!p) return null;
            gl!.attachShader(p, vs); gl!.attachShader(p, fs); gl!.linkProgram(p);
            return p;
        }

        function getUniforms(program: WebGLProgram) {
            const u: Record<string, WebGLUniformLocation | null> = {};
            const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS);
            for (let i = 0; i < count; i++) {
                const info = gl!.getActiveUniform(program, i);
                if (info) u[info.name] = gl!.getUniformLocation(program, info.name);
            }
            return u;
        }

        class Program {
            program: WebGLProgram | null;
            uniforms: Record<string, WebGLUniformLocation | null>;
            constructor(vs: WebGLShader | null, fs: WebGLShader | null) {
                this.program = createProgram(vs, fs);
                this.uniforms = this.program ? getUniforms(this.program) : {};
            }
            bind() { if (this.program) gl!.useProgram(this.program); }
        }

        class Material {
            vertexShader: WebGLShader | null;
            fragmentShaderSource: string;
            programs: Record<number, WebGLProgram | null> = {};
            activeProgram: WebGLProgram | null = null;
            uniforms: Record<string, WebGLUniformLocation | null> = {};
            constructor(vs: WebGLShader | null, fss: string) { this.vertexShader = vs; this.fragmentShaderSource = fss; }
            setKeywords(keywords: string[]) {
                let hash = 0;
                for (const kw of keywords) hash += hashCode(kw);
                let p = this.programs[hash];
                if (!p) { p = createProgram(this.vertexShader, compileShader(gl!.FRAGMENT_SHADER, this.fragmentShaderSource, keywords)); this.programs[hash] = p; }
                if (p === this.activeProgram) return;
                if (p) this.uniforms = getUniforms(p);
                this.activeProgram = p;
            }
            bind() { if (this.activeProgram) gl!.useProgram(this.activeProgram); }
        }

        // ---------- Shaders ----------
        const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
            precision highp float;
            attribute vec2 aPosition;
            varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
            uniform vec2 texelSize;
            void main () {
                vUv = aPosition * 0.5 + 0.5;
                vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0);
                vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y);
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }
        `);

        const copyShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float; precision mediump sampler2D;
            varying highp vec2 vUv; uniform sampler2D uTexture;
            void main () { gl_FragColor = texture2D(uTexture, vUv); }
        `);

        const clearShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float; precision mediump sampler2D;
            varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
            void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
        `);

        const splatShader = compileShader(gl.FRAGMENT_SHADER, `
            precision highp float; precision highp sampler2D;
            varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio;
            uniform vec3 color; uniform vec2 point; uniform float radius;
            void main () {
                vec2 p = vUv - point.xy; p.x *= aspectRatio;
                vec3 splat = exp(-dot(p, p) / radius) * color;
                vec3 base = texture2D(uTarget, vUv).xyz;
                gl_FragColor = vec4(base + splat, 1.0);
            }
        `);

        const advectionShader = compileShader(gl.FRAGMENT_SHADER, `
            precision highp float; precision highp sampler2D;
            varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource;
            uniform vec2 texelSize; uniform vec2 dyeTexelSize; uniform float dt; uniform float dissipation;
            vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
                vec2 st = uv / tsize - 0.5; vec2 iuv = floor(st); vec2 fuv = fract(st);
                vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
                vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
                vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
                vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
                return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
            }
            void main () {
                #ifdef MANUAL_FILTERING
                    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                    vec4 result = bilerp(uSource, coord, dyeTexelSize);
                #else
                    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                    vec4 result = texture2D(uSource, coord);
                #endif
                float decay = 1.0 + dissipation * dt;
                gl_FragColor = result / decay;
            }
        `, supportLinearFiltering ? null : ["MANUAL_FILTERING"]);

        const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float; precision mediump sampler2D;
            varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x;
                float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
                vec2 C = texture2D(uVelocity, vUv).xy;
                if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
                if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
                float div = 0.5 * (R - L + T - B);
                gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
            }
        `);

        const curlShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float; precision mediump sampler2D;
            varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
            uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y;
                float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x;
                float vorticity = R - L - T + B;
                gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
            }
        `);

        const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `
            precision highp float; precision highp sampler2D;
            varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
            uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
            void main () {
                float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x;
                float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x;
                float C = texture2D(uCurl, vUv).x;
                vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                force /= length(force) + 0.0001; force *= curl * C; force.y *= -1.0;
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                velocity += force * dt; velocity = min(max(velocity, -1000.0), 1000.0);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        `);

        const pressureShaderF = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float; precision mediump sampler2D;
            varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
            uniform sampler2D uPressure; uniform sampler2D uDivergence;
            void main () {
                float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
                float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
                float divergence = texture2D(uDivergence, vUv).x;
                float pressure = (L + R + B + T - divergence) * 0.25;
                gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
            }
        `);

        const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `
            precision mediump float; precision mediump sampler2D;
            varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB;
            uniform sampler2D uPressure; uniform sampler2D uVelocity;
            void main () {
                float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x;
                float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x;
                vec2 velocity = texture2D(uVelocity, vUv).xy;
                velocity.xy -= vec2(R - L, T - B);
                gl_FragColor = vec4(velocity, 0.0, 1.0);
            }
        `);

        // ---------- CYBORG DISPLAY SHADER (the magic) ----------
        // This shader uses fluid dye luminance as a mask to reveal the cyborg image.
        // The canvas covers the full viewport but the cyborg only appears in the photo region.
        // uPhotoRect defines the photo container's position in UV space (left, bottom, width, height).
        // Within that region, object-contain object-bottom is applied using uCyborgAspect/uPhotoAspect.
        const displayCyborgShaderSource = `
            precision highp float; precision highp sampler2D;
            varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
            uniform sampler2D uTexture;
            uniform sampler2D uCyborg;
            uniform vec2 texelSize;
            uniform float uCyborgReady;
            uniform float uCyborgAspect;
            uniform float uPhotoAspect;
            uniform vec4 uPhotoRect; // x=left, y=bottom, z=width, w=height in UV space

            void main () {
                vec3 dye = texture2D(uTexture, vUv).rgb;

                #ifdef SHADING
                    vec3 lc = texture2D(uTexture, vL).rgb; vec3 rc = texture2D(uTexture, vR).rgb;
                    vec3 tc = texture2D(uTexture, vT).rgb; vec3 bc = texture2D(uTexture, vB).rgb;
                    float dx = length(rc) - length(lc); float dy = length(tc) - length(bc);
                    vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                    float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0);
                    dye *= diffuse;
                #endif

                // Compute mask from fluid dye brightness
                float mask = max(dye.r, max(dye.g, dye.b));
                mask = smoothstep(0.0, 0.08, mask); // soft edge threshold

                if (uCyborgReady < 0.5) {
                    // Cyborg not loaded — show fluid dye
                    float a = max(dye.r, max(dye.g, dye.b));
                    gl_FragColor = vec4(dye, a);
                    return;
                }

                // Map full-canvas UV to the photo sub-region
                vec2 flipped = vec2(vUv.x, 1.0 - vUv.y); // flip Y for screen space

                // Check if this pixel is inside the photo region
                vec2 photoUv = (flipped - uPhotoRect.xy) / uPhotoRect.zw;

                if (photoUv.x < 0.0 || photoUv.x > 1.0 || photoUv.y < 0.0 || photoUv.y > 1.0) {
                    // Outside photo region — show fluid dye only
                    float a = mask * 0.6;
                    gl_FragColor = vec4(dye * mask, a);
                    return;
                }

                // Inside photo region — apply object-cover with center-bottom anchor
                vec2 cyborgUv = photoUv;

                if (uCyborgAspect > uPhotoAspect) {
                    // Image wider than container → fit by height (cover), center horizontally
                    float scale = uCyborgAspect / uPhotoAspect;
                    cyborgUv.x = (cyborgUv.x - 0.5) / scale + 0.5;
                } else {
                    // Image taller than container → fit by width (cover), anchor bottom
                    float scale = uPhotoAspect / uCyborgAspect;
                    cyborgUv.y = cyborgUv.y / scale - (1.0 / scale - 1.0);
                }

                // Outside the image bounds after object-contain → show fluid dye
                if (cyborgUv.x < 0.0 || cyborgUv.x > 1.0 || cyborgUv.y < 0.0 || cyborgUv.y > 1.0) {
                    float a = mask * 0.6;
                    gl_FragColor = vec4(dye * mask, a);
                    return;
                }

                vec4 cyborg = texture2D(uCyborg, cyborgUv);
                gl_FragColor = vec4(cyborg.rgb * mask, mask);
            }
        `;

        // ---------- Blit (fullscreen quad) ----------
        const buffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
        const elemBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        function blit(target: FBO | null, doClear = false) {
            if (!target) { gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight); gl!.bindFramebuffer(gl!.FRAMEBUFFER, null); }
            else { gl!.viewport(0, 0, target.width, target.height); gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo); }
            if (doClear) { gl!.clearColor(0, 0, 0, 0); gl!.clear(gl!.COLOR_BUFFER_BIT); }
            gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0);
        }

        // ---------- Programs ----------
        const copyProgram = new Program(baseVertexShader, copyShader);
        const clearProgram = new Program(baseVertexShader, clearShader);
        const splatProgram = new Program(baseVertexShader, splatShader);
        const advectionProgram = new Program(baseVertexShader, advectionShader);
        const divergenceProgram = new Program(baseVertexShader, divergenceShader);
        const curlProgram = new Program(baseVertexShader, curlShader);
        const vorticityProgram = new Program(baseVertexShader, vorticityShader);
        const pressureProgram = new Program(baseVertexShader, pressureShaderF);
        const gradientSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
        const displayCyborgMaterial = new Material(baseVertexShader, displayCyborgShaderSource);

        // ---------- Load Cyborg Image as WebGL Texture ----------
        let cyborgTexture: WebGLTexture | null = null;
        let cyborgReady = false;
        let cyborgNatW = 1;
        let cyborgNatH = 1;

        const cyborgImage = new window.Image();
        cyborgImage.crossOrigin = "anonymous";
        cyborgImage.onload = () => {
            if (!gl) return;
            cyborgNatW = cyborgImage.naturalWidth;
            cyborgNatH = cyborgImage.naturalHeight;
            cyborgTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, cyborgTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cyborgImage);
            cyborgReady = true;
        };
        cyborgImage.src = cyborgSrc;

        // ---------- FBO Creation ----------
        function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
            gl!.activeTexture(gl!.TEXTURE0);
            const texture = gl!.createTexture()!;
            gl!.bindTexture(gl!.TEXTURE_2D, texture);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
            gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
            gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
            const fbo = gl!.createFramebuffer()!;
            gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
            gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
            gl!.viewport(0, 0, w, h); gl!.clear(gl!.COLOR_BUFFER_BIT);
            return {
                texture, fbo, width: w, height: h,
                texelSizeX: 1 / w, texelSizeY: 1 / h,
                attach(id: number) { gl!.activeTexture(gl!.TEXTURE0 + id); gl!.bindTexture(gl!.TEXTURE_2D, texture); return id; }
            };
        }

        function createDoubleFBO(w: number, h: number, iF: number, f: number, t: number, p: number): DoubleFBO {
            const fbo1 = createFBO(w, h, iF, f, t, p), fbo2 = createFBO(w, h, iF, f, t, p);
            return { width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY, read: fbo1, write: fbo2, swap() { const tmp = this.read; this.read = this.write; this.write = tmp; } };
        }

        function resizeFBO(target: FBO, w: number, h: number, iF: number, f: number, t: number, p: number) {
            const newFBO = createFBO(w, h, iF, f, t, p);
            copyProgram.bind();
            if (copyProgram.uniforms.uTexture) gl!.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
            blit(newFBO, false);
            return newFBO;
        }

        function resizeDoubleFBO(target: DoubleFBO, w: number, h: number, iF: number, f: number, t: number, p: number) {
            if (target.width === w && target.height === h) return target;
            target.read = resizeFBO(target.read, w, h, iF, f, t, p);
            target.write = createFBO(w, h, iF, f, t, p);
            target.width = w; target.height = h; target.texelSizeX = 1 / w; target.texelSizeY = 1 / h;
            return target;
        }

        // ---------- Resolution helpers ----------
        function getResolution(res: number) {
            const w = gl!.drawingBufferWidth, h = gl!.drawingBufferHeight;
            const ar = w / h; const aspect = ar < 1 ? 1 / ar : ar;
            const min = Math.round(res), max = Math.round(res * aspect);
            return w > h ? { width: max, height: min } : { width: min, height: max };
        }

        function scaleByPixelRatio(input: number) {
            const dpr = Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1 : 2);
            return Math.floor(input * dpr);
        }

        // ---------- Init FBOs ----------
        const filtering = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
        let dye: DoubleFBO, velocity: DoubleFBO, divergenceFBO: FBO, curlFBO: FBO, pressureFBO: DoubleFBO;

        function initFramebuffers() {
            const simRes = getResolution(config.SIM_RESOLUTION);
            const dyeRes = getResolution(config.DYE_RESOLUTION);
            gl!.disable(gl!.BLEND);

            if (!dye) dye = createDoubleFBO(dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, halfFloatTexType, filtering);
            else dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, formatRGBA.internalFormat, formatRGBA.format, halfFloatTexType, filtering);

            if (!velocity) velocity = createDoubleFBO(simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, halfFloatTexType, filtering);
            else velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, formatRG.internalFormat, formatRG.format, halfFloatTexType, filtering);

            divergenceFBO = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl!.NEAREST);
            curlFBO = createFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl!.NEAREST);
            pressureFBO = createDoubleFBO(simRes.width, simRes.height, formatR.internalFormat, formatR.format, halfFloatTexType, gl!.NEAREST);
        }

        function updateKeywords() {
            const kw: string[] = [];
            if (config.SHADING) kw.push("SHADING");
            displayCyborgMaterial.setKeywords(kw);
        }

        updateKeywords();
        initFramebuffers();

        // ---------- Simulation Loop ----------
        let lastUpdateTime = Date.now();
        let colorUpdateTimer = 0;
        let animationId = 0;
        let isInView = true;
        const TARGET_FPS = isMobileDevice ? 24 : 30;
        const FRAME_BUDGET_MS = 1000 / TARGET_FPS;
        let lastFrameTime = 0;

        function updateFrame() {
            if (!isInView) return;

            const now = performance.now();
            const elapsed = now - lastFrameTime;
            if (elapsed < FRAME_BUDGET_MS) {
                animationId = requestAnimationFrame(updateFrame);
                return;
            }
            lastFrameTime = now - (elapsed % FRAME_BUDGET_MS);

            const dt = calcDeltaTime();
            if (resizeCanvas()) initFramebuffers();
            updateColors(dt);
            applyInputs();
            step(dt);
            render();
            animationId = requestAnimationFrame(updateFrame);
        }

        function calcDeltaTime() {
            const now = Date.now();
            let dt = (now - lastUpdateTime) / 1000;
            dt = Math.min(dt, 0.016666);
            lastUpdateTime = now;
            return dt;
        }

        function resizeCanvas() {
            const w = scaleByPixelRatio(canvas!.clientWidth), h = scaleByPixelRatio(canvas!.clientHeight);
            if (canvas!.width !== w || canvas!.height !== h) { canvas!.width = w; canvas!.height = h; return true; }
            return false;
        }

        function updateColors(dt: number) {
            colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
            if (colorUpdateTimer >= 1) { colorUpdateTimer = ((colorUpdateTimer - 0) % 1) + 0; pointers.forEach(p => { p.color = generateColor(); }); }
        }

        function applyInputs() { for (const p of pointers) { if (p.moved) { p.moved = false; splatPointer(p); } } }

        function step(dt: number) {
            gl!.disable(gl!.BLEND);

            curlProgram.bind();
            if (curlProgram.uniforms.texelSize) gl!.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            if (curlProgram.uniforms.uVelocity) gl!.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
            blit(curlFBO);

            vorticityProgram.bind();
            if (vorticityProgram.uniforms.texelSize) gl!.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            if (vorticityProgram.uniforms.uVelocity) gl!.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
            if (vorticityProgram.uniforms.uCurl) gl!.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
            if (vorticityProgram.uniforms.curl) gl!.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
            if (vorticityProgram.uniforms.dt) gl!.uniform1f(vorticityProgram.uniforms.dt, dt);
            blit(velocity.write); velocity.swap();

            divergenceProgram.bind();
            if (divergenceProgram.uniforms.texelSize) gl!.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            if (divergenceProgram.uniforms.uVelocity) gl!.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
            blit(divergenceFBO);

            clearProgram.bind();
            if (clearProgram.uniforms.uTexture) gl!.uniform1i(clearProgram.uniforms.uTexture, pressureFBO.read.attach(0));
            if (clearProgram.uniforms.value) gl!.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
            blit(pressureFBO.write); pressureFBO.swap();

            pressureProgram.bind();
            if (pressureProgram.uniforms.texelSize) gl!.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            if (pressureProgram.uniforms.uDivergence) gl!.uniform1i(pressureProgram.uniforms.uDivergence, divergenceFBO.attach(0));
            for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
                if (pressureProgram.uniforms.uPressure) gl!.uniform1i(pressureProgram.uniforms.uPressure, pressureFBO.read.attach(1));
                blit(pressureFBO.write); pressureFBO.swap();
            }

            gradientSubtractProgram.bind();
            if (gradientSubtractProgram.uniforms.texelSize) gl!.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            if (gradientSubtractProgram.uniforms.uPressure) gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressureFBO.read.attach(0));
            if (gradientSubtractProgram.uniforms.uVelocity) gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
            blit(velocity.write); velocity.swap();

            advectionProgram.bind();
            if (advectionProgram.uniforms.texelSize) gl!.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            if (!supportLinearFiltering && advectionProgram.uniforms.dyeTexelSize) gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
            const velId = velocity.read.attach(0);
            if (advectionProgram.uniforms.uVelocity) gl!.uniform1i(advectionProgram.uniforms.uVelocity, velId);
            if (advectionProgram.uniforms.uSource) gl!.uniform1i(advectionProgram.uniforms.uSource, velId);
            if (advectionProgram.uniforms.dt) gl!.uniform1f(advectionProgram.uniforms.dt, dt);
            if (advectionProgram.uniforms.dissipation) gl!.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
            blit(velocity.write); velocity.swap();

            if (!supportLinearFiltering && advectionProgram.uniforms.dyeTexelSize) gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
            if (advectionProgram.uniforms.uVelocity) gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
            if (advectionProgram.uniforms.uSource) gl!.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
            if (advectionProgram.uniforms.dissipation) gl!.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
            blit(dye.write); dye.swap();
        }

        function render() {
            gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
            gl!.enable(gl!.BLEND);

            displayCyborgMaterial.bind();

            if (config.SHADING && displayCyborgMaterial.uniforms.texelSize) {
                gl!.uniform2f(displayCyborgMaterial.uniforms.texelSize, 1 / gl!.drawingBufferWidth, 1 / gl!.drawingBufferHeight);
            }

            // Bind fluid dye texture
            if (displayCyborgMaterial.uniforms.uTexture) {
                gl!.uniform1i(displayCyborgMaterial.uniforms.uTexture, dye.read.attach(0));
            }

            // Bind cyborg image texture
            if (cyborgReady && cyborgTexture && displayCyborgMaterial.uniforms.uCyborg) {
                gl!.activeTexture(gl!.TEXTURE1);
                gl!.bindTexture(gl!.TEXTURE_2D, cyborgTexture);
                gl!.uniform1i(displayCyborgMaterial.uniforms.uCyborg, 1);
            }

            // Tell shader whether cyborg is ready
            if (displayCyborgMaterial.uniforms.uCyborgReady) {
                gl!.uniform1f(displayCyborgMaterial.uniforms.uCyborgReady, cyborgReady ? 1.0 : 0.0);
            }

            // Pass cyborg image aspect ratio
            if (displayCyborgMaterial.uniforms.uCyborgAspect && cyborgReady) {
                gl!.uniform1f(displayCyborgMaterial.uniforms.uCyborgAspect, cyborgNatW / cyborgNatH);
            }

            // Compute photo container rect in UV space relative to the canvas (full viewport)
            if (displayCyborgMaterial.uniforms.uPhotoRect && photoContainerRef.current && canvas) {
                const canvasRect = canvas.getBoundingClientRect();
                const photoRect = photoContainerRef.current.getBoundingClientRect();

                // Convert photo rect to normalized UV coordinates (0-1) relative to canvas
                // In screen space: left, top, width, height
                // In UV space (flipped Y): left = same, bottom = (canvasH - photoBottom) / canvasH
                const uvLeft = (photoRect.left - canvasRect.left) / canvasRect.width;
                const uvBottom = (canvasRect.bottom - photoRect.bottom) / canvasRect.height;
                const uvWidth = photoRect.width / canvasRect.width;
                const uvHeight = photoRect.height / canvasRect.height;

                gl!.uniform4f(displayCyborgMaterial.uniforms.uPhotoRect, uvLeft, uvBottom, uvWidth, uvHeight);

                // Photo container aspect ratio for object-contain computation
                if (displayCyborgMaterial.uniforms.uPhotoAspect) {
                    gl!.uniform1f(displayCyborgMaterial.uniforms.uPhotoAspect, photoRect.width / photoRect.height);
                }
            }

            blit(null, true);
        }

        // ---------- Interaction ----------
        function splatPointer(pointer: Pointer) {
            const dx = pointer.deltaX * config.SPLAT_FORCE, dy = pointer.deltaY * config.SPLAT_FORCE;
            splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
        }

        function clickSplat(pointer: Pointer) {
            const color = generateColor();
            color.r *= 10; color.g *= 10; color.b *= 10;
            splat(pointer.texcoordX, pointer.texcoordY, 10 * (Math.random() - 0.5), 30 * (Math.random() - 0.5), color);
        }

        function splat(x: number, y: number, dx: number, dy: number, color: ColorRGB) {
            splatProgram.bind();
            if (splatProgram.uniforms.uTarget) gl!.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
            if (splatProgram.uniforms.aspectRatio) gl!.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height);
            if (splatProgram.uniforms.point) gl!.uniform2f(splatProgram.uniforms.point, x, y);
            if (splatProgram.uniforms.color) gl!.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
            if (splatProgram.uniforms.radius) gl!.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
            blit(velocity.write); velocity.swap();
            if (splatProgram.uniforms.uTarget) gl!.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
            if (splatProgram.uniforms.color) gl!.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
            blit(dye.write); dye.swap();
        }

        function correctRadius(radius: number) { const ar = canvas!.width / canvas!.height; if (ar > 1) radius *= ar; return radius; }

        function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
            pointer.id = id; pointer.down = true; pointer.moved = false;
            pointer.texcoordX = posX / canvas!.width; pointer.texcoordY = 1 - posY / canvas!.height;
            pointer.prevTexcoordX = pointer.texcoordX; pointer.prevTexcoordY = pointer.texcoordY;
            pointer.deltaX = 0; pointer.deltaY = 0; pointer.color = generateColor();
        }

        function updatePointerMoveData(pointer: Pointer, posX: number, posY: number, color: ColorRGB) {
            pointer.prevTexcoordX = pointer.texcoordX; pointer.prevTexcoordY = pointer.texcoordY;
            pointer.texcoordX = posX / canvas!.width; pointer.texcoordY = 1 - posY / canvas!.height;
            const ar = canvas!.width / canvas!.height;
            pointer.deltaX = (pointer.texcoordX - pointer.prevTexcoordX) * (ar < 1 ? ar : 1);
            pointer.deltaY = (pointer.texcoordY - pointer.prevTexcoordY) * (ar > 1 ? 1 / ar : 1);
            pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
            pointer.color = color;
        }

        function generateColor(): ColorRGB {
            const c = HSVtoRGB(Math.random(), 1, 1);
            c.r *= 0.15; c.g *= 0.15; c.b *= 0.15;
            return c;
        }

        function HSVtoRGB(h: number, s: number, v: number): ColorRGB {
            let r = 0, g = 0, b = 0;
            const i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v; g = t; b = p; break; case 1: r = q; g = v; b = p; break;
                case 2: r = p; g = v; b = t; break; case 3: r = p; g = q; b = v; break;
                case 4: r = t; g = p; b = v; break; case 5: r = v; g = p; b = q; break;
            }
            return { r, g, b };
        }

        // ---------- Event Listeners (hero-local coordinates) ----------
        let started = false;

        // Get canvas position relative to viewport
        function getCanvasOffset() {
            const rect = canvas!.getBoundingClientRect();
            return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
        }

        function isInsideCanvas(clientX: number, clientY: number) {
            const { left, top, width, height } = getCanvasOffset();
            return clientX >= left && clientX <= left + width && clientY >= top && clientY <= top + height;
        }

        function clientToCanvas(clientX: number, clientY: number) {
            const { left, top } = getCanvasOffset();
            return {
                x: scaleByPixelRatio(clientX - left),
                y: scaleByPixelRatio(clientY - top)
            };
        }

        function handleFirstMove(e: MouseEvent) {
            if (!isInsideCanvas(e.clientX, e.clientY)) return;
            started = true;
            const pointer = pointers[0];
            const pos = clientToCanvas(e.clientX, e.clientY);
            updatePointerMoveData(pointer, pos.x, pos.y, generateColor());
            updateFrame();
            window.removeEventListener("mousemove", handleFirstMove);
        }
        window.addEventListener("mousemove", handleFirstMove);

        const onMouseDown = (e: MouseEvent) => {
            if (!isInsideCanvas(e.clientX, e.clientY)) return;
            const pointer = pointers[0];
            const pos = clientToCanvas(e.clientX, e.clientY);
            updatePointerDownData(pointer, -1, pos.x, pos.y);
            clickSplat(pointer);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!started) return;
            if (!isInsideCanvas(e.clientX, e.clientY)) return;
            const pointer = pointers[0];
            const pos = clientToCanvas(e.clientX, e.clientY);
            updatePointerMoveData(pointer, pos.x, pos.y, pointer.color);
        };

        const onTouchStart = (e: TouchEvent) => {
            const touches = e.targetTouches;
            for (let i = 0; i < touches.length; i++) {
                if (!isInsideCanvas(touches[i].clientX, touches[i].clientY)) continue;
                const pointer = pointers[0];
                const pos = clientToCanvas(touches[i].clientX, touches[i].clientY);
                updatePointerDownData(pointer, touches[i].identifier, pos.x, pos.y);
            }
            if (!started) { started = true; updateFrame(); }
        };

        const onTouchMove = (e: TouchEvent) => {
            const touches = e.targetTouches;
            for (let i = 0; i < touches.length; i++) {
                if (!isInsideCanvas(touches[i].clientX, touches[i].clientY)) continue;
                const pointer = pointers[0];
                const pos = clientToCanvas(touches[i].clientX, touches[i].clientY);
                updatePointerMoveData(pointer, pos.x, pos.y, pointer.color);
            }
        };

        const onTouchEnd = () => { pointers[0].down = false; };

        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("touchstart", onTouchStart, false);
        window.addEventListener("touchmove", onTouchMove, false);
        window.addEventListener("touchend", onTouchEnd);

        // ---------- IntersectionObserver: pause when hero is out of view ----------
        const observer = new IntersectionObserver(
            ([entry]) => {
                const wasInView = isInView;
                isInView = entry.isIntersecting;
                if (isInView && !wasInView && started) {
                    lastUpdateTime = Date.now();
                    updateFrame();
                }
            },
            { threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);

        // ---------- Cleanup ----------
        return () => {
            cancelAnimationFrame(animationId);
            isInView = false;
            window.removeEventListener("mousemove", handleFirstMove);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
            observer.disconnect();
        };
    }, [isReady, cyborgSrc, containerRef, photoContainerRef]);

    if (!isReady) return null;

    return (
        <canvas
            ref={canvasRef}
            className={`block w-full h-full ${className}`}
            style={{ background: "transparent" }}
        />
    );
}
