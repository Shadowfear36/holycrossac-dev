"use client";

/**
 * The parish's red-and-gold Jerusalem cross in real-time 3D (plain WebGL, no libraries, ~10 KB).
 * - Turns slowly on its own; drag (or swipe sideways) to spin it, with inertia
 * - Tilts gently toward the pointer
 * - Warm embers drift upward like candle sparks
 * - Respects "reduce motion" (no auto-spin, still embers); pauses when off-screen
 * - Falls back to the flat emblem if WebGL isn't available
 * - First-visit intro: when <html> has the "intro" class (set by an inline script in
 *   layout.tsx), the cross starts alone in the middle of the screen, spins up, then
 *   glides to its place; partway through it removes "intro" so the rest of the page
 *   fades in (CSS: "Intro" in globals.css).
 *
 * Geometry and colors match the emblem in src/components/CrossMark.tsx (red enamel, gold rim).
 */

import { useEffect, useRef, useState } from "react";
import CrossMark, { CROSS_RECTS } from "./CrossMark";

/** Interleaved [x,y,z, nx,ny,nz, material] triangles. material 0 = gold, 1 = red enamel. */
function buildCross(): Float32Array {
  const out: number[] = [];
  const quad = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];
  const box = (c: number[], half: number[], mat: number) => {
    for (let axis = 0; axis < 3; axis++) {
      for (const s of [-1, 1]) {
        const others = [0, 1, 2].filter((a) => a !== axis);
        const corner = (q: number[]) => {
          const p = [0, 0, 0];
          p[axis] = s;
          p[others[0]] = q[0];
          p[others[1]] = q[1];
          return p.map((v, i) => c[i] + v * half[i]);
        };
        const n = [0, 0, 0];
        n[axis] = s;
        for (const i of [0, 1, 2, 0, 2, 3]) out.push(...corner(quad[i]), ...n, mat);
      }
    }
  };
  CROSS_RECTS.forEach(([x, y, w, h], i) => {
    const d = i < 6 ? 3 : 2.2; // main cross thicker than the four small crosses
    const c = [(x + w / 2 - 20) / 20, -(y + h / 2 - 20) / 20, 0];
    // gold body (slightly larger, like the rim on the emblem)
    box(c, [(w + 1.1) / 40, (h + 1.1) / 40, d / 40], 0);
    // red enamel inlay, standing a hair proud of the gold on front and back
    box(c, [w / 40, h / 40, (d + 0.4) / 40], 1);
  });
  return new Float32Array(out);
}

// ---- tiny column-major mat4 helpers ----
type M4 = Float32Array;
const mul = (a: M4, b: M4): M4 => {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
};
const perspective = (fovy: number, aspect: number, n: number, f: number): M4 => {
  const t = 1 / Math.tan(fovy / 2);
  return new Float32Array([t / aspect, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, (2 * f * n) / (n - f), 0]);
};
const translate = (x: number, y: number, z: number): M4 => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
const rotX = (a: number): M4 => {
  const c = Math.cos(a), s = Math.sin(a);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
};
/** On phones/tablets the cross rests this far below the top of the banner (the lettering starts below it; see page.tsx). */
const MOBILE_TOP_PX = 52;
const scale = (k: number): M4 => new Float32Array([k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, 0, 0, 0, 1]);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const endIntro = () => document.documentElement.classList.remove("intro");
const rotY = (a: number): M4 => {
  const c = Math.cos(a), s = Math.sin(a);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
};

const CROSS_VS = `
attribute vec3 aP; attribute vec3 aN; attribute float aM;
uniform mat4 uModel; uniform mat4 uVP;
varying vec3 vN; varying vec3 vW; varying float vM;
void main(){
  vM = aM;
  vec4 w = uModel * vec4(aP, 1.0);
  vW = w.xyz;
  vN = (uModel * vec4(aN, 0.0)).xyz;
  gl_Position = uVP * w;
}`;

// Polished gold rim + glossy red enamel: warm key light (candle), cool fill, fake studio reflections + fresnel
const CROSS_FS = `
precision mediump float;
varying vec3 vN; varying vec3 vW; varying float vM;
uniform vec3 uCam; uniform float uFlicker;
void main(){
  vec3 N = normalize(vN);
  vec3 V = normalize(uCam - vW);
  vec3 L1 = normalize(vec3(0.55, 0.75, 0.9));
  vec3 L2 = normalize(vec3(-0.9, -0.25, 0.45));
  float d1 = max(dot(N, L1), 0.0);
  float d2 = max(dot(N, L2), 0.0);
  vec3 R = reflect(-V, N);
  float band = smoothstep(-0.25, 0.85, R.y);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  float head = max(dot(N, V), 0.0); // soft light from the viewer's side
  vec3 col;
  if (vM < 0.5) {
    // gold: metal, so color comes mostly from reflections
    vec3 gold = vec3(1.0, 0.80, 0.42);
    vec3 env = mix(vec3(0.10, 0.06, 0.03), vec3(1.0, 0.92, 0.70), band);
    env += vec3(1.0, 0.95, 0.8) * pow(max(R.x * 0.5 + 0.5, 0.0), 10.0) * 0.8;
    float s1 = pow(max(dot(N, normalize(L1 + V)), 0.0), 80.0);
    col = gold * (0.12 + 0.4 * d1 * uFlicker + 0.25 * head) + gold * env * 0.7;
    col += vec3(1.0, 0.95, 0.82) * s1 * 1.2 * uFlicker + gold * fres * 0.5;
  } else {
    // red enamel: glossy coat over deep red
    vec3 red = vec3(0.80, 0.07, 0.10);
    float s1 = pow(max(dot(N, normalize(L1 + V)), 0.0), 120.0);
    float s2 = pow(max(dot(N, normalize(L2 + V)), 0.0), 40.0);
    vec3 env = mix(vec3(0.02), vec3(1.0, 0.9, 0.8), smoothstep(0.55, 0.95, band));
    col = red * (0.30 + 0.7 * d1 * uFlicker + 0.2 * d2 + 0.55 * head);
    col += env * (0.08 + 0.35 * fres);
    col += vec3(1.0, 0.96, 0.9) * s1 * 0.9 * uFlicker + vec3(1.0, 0.8, 0.7) * s2 * 0.15;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

const EMBER_VS = `
attribute vec4 aSeed; attribute float aPhase;
uniform mat4 uVP; uniform float uT; uniform float uDpr; uniform vec3 uCenter; uniform float uCamZ;
varying float vA; varying vec3 vC;
void main(){
  float y = mod(aSeed.y + uT * aSeed.w + 1.7, 3.4) - 1.7;
  float x = aSeed.x + sin(uT * 0.6 + aPhase * 6.283) * 0.12;
  vec3 p = uCenter + vec3(x, y, aSeed.z);
  gl_Position = uVP * vec4(p, 1.0);
  float life = clamp(1.0 - abs(y) / 1.7, 0.0, 1.0);
  vA = life * (0.55 + 0.45 * sin(uT * 3.0 + aPhase * 40.0));
  vC = mix(vec3(1.0, 0.78, 0.4), vec3(1.0, 0.45, 0.22), aPhase);
  gl_PointSize = (1.5 + 4.0 * fract(aPhase * 7.0)) * uDpr * (4.5 / (uCamZ - p.z));
}`;

const EMBER_FS = `
precision mediump float;
varying float vA; varying vec3 vC;
void main(){
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, r) * vA;
  gl_FragColor = vec4(vC * a, a);
}`;

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const make = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, make(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, make(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

export default function HeroCross3D({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", { antialias: true, premultipliedAlpha: true, alpha: true });
    if (!gl) {
      endIntro();
      requestAnimationFrame(() => setFallback(true)); // async: outside the effect body
      return;
    }

    let crossProg: WebGLProgram, emberProg: WebGLProgram;
    try {
      crossProg = program(gl, CROSS_VS, CROSS_FS);
      emberProg = program(gl, EMBER_VS, EMBER_FS);
    } catch {
      endIntro();
      requestAnimationFrame(() => setFallback(true)); // async: outside the effect body
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Buffers
    const crossData = buildCross();
    const crossBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, crossBuf);
    gl.bufferData(gl.ARRAY_BUFFER, crossData, gl.STATIC_DRAW);
    const crossCount = crossData.length / 7;

    const EMBERS = 140;
    const emberData = new Float32Array(EMBERS * 5);
    for (let i = 0; i < EMBERS; i++) {
      emberData.set(
        [
          (Math.random() - 0.5) * 3.2, // x spread
          Math.random() * 3.4 - 1.7, // start height
          Math.random() * 1.8 - 1.1, // depth
          0.05 + Math.random() * 0.18, // rise speed
          Math.random(), // phase
        ],
        i * 5,
      );
    }
    const emberBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, emberBuf);
    gl.bufferData(gl.ARRAY_BUFFER, emberData, gl.STATIC_DRAW);

    const loc = {
      cP: gl.getAttribLocation(crossProg, "aP"),
      cN: gl.getAttribLocation(crossProg, "aN"),
      cM: gl.getAttribLocation(crossProg, "aM"),
      cModel: gl.getUniformLocation(crossProg, "uModel"),
      cVP: gl.getUniformLocation(crossProg, "uVP"),
      cCam: gl.getUniformLocation(crossProg, "uCam"),
      cFlicker: gl.getUniformLocation(crossProg, "uFlicker"),
      eSeed: gl.getAttribLocation(emberProg, "aSeed"),
      ePhase: gl.getAttribLocation(emberProg, "aPhase"),
      eVP: gl.getUniformLocation(emberProg, "uVP"),
      eT: gl.getUniformLocation(emberProg, "uT"),
      eDpr: gl.getUniformLocation(emberProg, "uDpr"),
      eCenter: gl.getUniformLocation(emberProg, "uCenter"),
      eCamZ: gl.getUniformLocation(emberProg, "uCamZ"),
    };

    // Sizing
    let dpr = 1, aspect = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      aspect = w / Math.max(h, 1);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Interaction state
    let rotYv = 0.6, vel = 0, tiltX = 0, tiltY = 0, targetTX = 0, targetTY = 0;

    // Intro timeline (seconds): 0–0.9 spin up in the centre, 0.9–2.1 glide into place.
    // Timed by the real clock (not frame count), so slow devices still finish on time.
    let introStart = -1, introDone = true, revealed = true;
    if (document.documentElement.classList.contains("intro")) {
      introDone = false;
      revealed = false;
      rotYv = -0.4;
      vel = 6; // a quick turn that settles as it arrives
    }
    let dragging = false, lastX = 0, lastT = 0;
    const AUTO = reduce ? 0 : 0.28;

    const onMove = (e: PointerEvent) => {
      targetTX = (e.clientY / window.innerHeight - 0.5) * 0.45;
      targetTY = (e.clientX / window.innerWidth - 0.5) * 0.35;
      if (dragging) {
        const now = performance.now();
        const dx = e.clientX - lastX;
        rotYv += dx * 0.009;
        vel = (dx * 0.009) / Math.max((now - lastT) / 1000, 0.008);
        lastX = e.clientX;
        lastT = now;
      }
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastT = performance.now();
      vel = 0;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
      setTouched(true);
    };
    const onUp = () => {
      dragging = false;
      canvas.style.cursor = "grab";
      vel = Math.max(-8, Math.min(8, vel));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);

    // Only animate while visible
    let visible = true, raf = 0, last = performance.now(), t = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    gl.enable(gl.DEPTH_TEST);

    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduce) t += dt;

      if (!dragging) {
        rotYv += (AUTO + vel) * dt;
        vel *= Math.pow(0.04, dt); // inertia decays back to the gentle auto-spin
      }
      tiltX += (targetTX - tiltX) * Math.min(dt * 3, 1);
      tiltY += (targetTY - tiltY) * Math.min(dt * 3, 1);

      // Camera: keep the cross ~60% of the height; on narrow screens back off so it fits
      const fov = (35 * Math.PI) / 180;
      const tanH = Math.tan(fov / 2);
      const camZ = Math.max(4.2, 1.1 / aspect / tanH);
      const halfH = camZ * tanH;
      const halfW = halfH * aspect;

      // Resting place: right of the lettering on desktop; on phones/tablets, smaller and
      // ABOVE the lettering so the text never sits on top of the moving cross.
      let restX = 0, restY = 0, restSize = 1;
      if (canvas.clientWidth >= 1024 && aspect > 1.25) {
        restX = halfW * 0.44;
      } else {
        const pxPerWorld = canvas.clientHeight / (2 * halfH);
        const radiusPx = Math.min(canvas.clientWidth >= 640 ? 125 : 100, canvas.clientWidth * 0.26); // half the cross's height on screen
        restSize = Math.min(1, radiusPx / (0.85 * pxPerWorld));
        restY = halfH - (MOBILE_TOP_PX + radiusPx) / pxPerWorld; // its top sits MOBILE_TOP_PX below the banner top
      }

      // Intro: centred and larger at first, then glides to its resting place
      let place = 1, size = restSize;
      if (!introDone) {
        if (introStart < 0) introStart = now;
        const introT = (now - introStart) / 1000;
        const a = Math.min(introT / 0.9, 1);
        const b = Math.min(Math.max((introT - 0.9) / 1.2, 0), 1);
        place = easeInOutCubic(b);
        const grow = 0.55 + 0.7 * easeOutCubic(a); // 0.55 -> 1.25
        size = grow + (restSize - grow) * place;
        if (!revealed && introT > 1.35) {
          revealed = true;
          endIntro(); // header, lettering and page fade in while the cross is still moving
        }
        if (b >= 1) introDone = true;
      }
      const offsetX = restX * place;
      const offsetY = restY * place;
      const center: [number, number, number] = [offsetX, offsetY, 0];

      const P = perspective(fov, aspect, 0.1, 50);
      const V = translate(0, 0, -camZ);
      const VP = mul(P, V);
      const bob = reduce ? 0 : Math.sin(t * 0.9) * 0.04;
      const model = mul(translate(offsetX, offsetY + bob, 0), mul(scale(size), mul(rotY(rotYv + tiltY), rotX(tiltX))));
      const flicker = reduce ? 1 : 0.92 + 0.05 * Math.sin(t * 7.3) + 0.03 * Math.sin(t * 13.1);

      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);

      // Cross
      gl!.useProgram(crossProg);
      gl!.disable(gl!.BLEND);
      gl!.depthMask(true);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, crossBuf);
      gl!.enableVertexAttribArray(loc.cP);
      gl!.vertexAttribPointer(loc.cP, 3, gl!.FLOAT, false, 28, 0);
      gl!.enableVertexAttribArray(loc.cN);
      gl!.vertexAttribPointer(loc.cN, 3, gl!.FLOAT, false, 28, 12);
      gl!.enableVertexAttribArray(loc.cM);
      gl!.vertexAttribPointer(loc.cM, 1, gl!.FLOAT, false, 28, 24);
      gl!.uniformMatrix4fv(loc.cModel, false, model);
      gl!.uniformMatrix4fv(loc.cVP, false, VP);
      gl!.uniform3f(loc.cCam, 0, 0, camZ);
      gl!.uniform1f(loc.cFlicker, flicker);
      gl!.drawArrays(gl!.TRIANGLES, 0, crossCount);
      gl!.disableVertexAttribArray(loc.cP);
      gl!.disableVertexAttribArray(loc.cN);
      gl!.disableVertexAttribArray(loc.cM);

      // Embers (additive, behind/around the cross)
      gl!.useProgram(emberProg);
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.ONE, gl!.ONE);
      gl!.depthMask(false);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, emberBuf);
      gl!.enableVertexAttribArray(loc.eSeed);
      gl!.vertexAttribPointer(loc.eSeed, 4, gl!.FLOAT, false, 20, 0);
      gl!.enableVertexAttribArray(loc.ePhase);
      gl!.vertexAttribPointer(loc.ePhase, 1, gl!.FLOAT, false, 20, 16);
      gl!.uniformMatrix4fv(loc.eVP, false, VP);
      gl!.uniform1f(loc.eT, t);
      gl!.uniform1f(loc.eDpr, dpr);
      gl!.uniform3f(loc.eCenter, ...center);
      gl!.uniform1f(loc.eCamZ, camZ);
      gl!.drawArrays(gl!.POINTS, 0, EMBERS);
      gl!.disableVertexAttribArray(loc.eSeed);
      gl!.disableVertexAttribArray(loc.ePhase);

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      // Don't end the intro here: React dev mode mounts effects twice. If the component
      // truly goes away mid-intro, the CSS fail-safe in globals.css reveals the page.
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      gl.deleteBuffer(crossBuf);
      gl.deleteBuffer(emberBuf);
      gl.deleteProgram(crossProg);
      gl.deleteProgram(emberProg);
    };
  }, []);

  if (fallback) {
    return (
      <div className={`flex items-center justify-center lg:justify-end lg:pr-[12%] ${className}`} aria-hidden>
        <CrossMark className="h-[55%] w-auto drop-shadow-[0_0_40px_rgba(216,192,138,0.35)]" />
      </div>
    );
  }

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab"
        style={{ touchAction: "pan-y" }}
        role="img"
        aria-label="The red and gold Jerusalem cross, emblem of Holy Cross Anglican Church, turning slowly"
      />
      <p
        className={`intro-hide intro-d4 pointer-events-none absolute bottom-4 right-6 hidden font-display text-sm italic text-gold-light/70 transition-opacity duration-700 lg:block ${touched ? "opacity-0" : "opacity-100"}`}
      >
        Drag to turn the cross
      </p>
    </div>
  );
}
