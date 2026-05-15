<template>
  <canvas ref="canvasRef" class="lightning-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';

interface LightningProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
}

const props = withDefaults(defineProps<LightningProps>(), {
  hue: 230,
  xOffset: 0,
  speed: 1,
  intensity: 1,
  size: 1
});

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef');
let animationId = 0;
let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;
let startTime = 0;
let resizeObserver: ResizeObserver | null = null;
let isInitialized = false;

const vertexShaderSource = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uHue;
uniform float uXOffset;
uniform float uSpeed;
uniform float uIntensity;
uniform float uSize;

#define OCTAVE_COUNT 6

vec3 hsv2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float hash11(float p) {
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

mat2 rotate2d(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 fp = fract(p);
    float a = hash12(ip);
    float b = hash12(ip + vec2(1.0, 0.0));
    float c = hash12(ip + vec2(0.0, 1.0));
    float d = hash12(ip + vec2(1.0, 1.0));
    vec2 t = smoothstep(0.0, 1.0, fp);
    return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < OCTAVE_COUNT; ++i) {
        value += amplitude * noise(p);
        p *= rotate2d(0.45);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv = 2.0 * uv - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    uv.x += uXOffset;

    uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;

    float dist = max(abs(uv.x), 0.001);
    vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
    float noiseVal = mix(0.05, 0.15, hash11(iTime * uSpeed));
    vec3 col = baseColor * (noiseVal / dist) * uIntensity;
    col = pow(col, vec3(1.0));
    gl_FragColor = vec4(col, 1.0);
}
`;

const compileShader = (source: string, type: number): WebGLShader | null => {
  if (!gl) return null;
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

const initWebGL = (canvas: HTMLCanvasElement) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let rect = canvas.getBoundingClientRect();

  // Fallback to window size if canvas has no dimensions yet
  if (rect.width === 0 || rect.height === 0) {
    rect = { width: window.innerWidth, height: window.innerHeight, top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight, x: 0, y: 0, toJSON: () => ({}) };
  }

  const width = Math.max(Math.floor(rect.width * dpr), 1);
  const height = Math.max(Math.floor(rect.height * dpr), 1);

  canvas.width = width;
  canvas.height = height;

  gl = canvas.getContext('webgl', { alpha: false, antialias: false }) || canvas.getContext('experimental-webgl', { alpha: false, antialias: false }) as WebGLRenderingContext | null;
  if (!gl) {
    console.error('WebGL not supported');
    return false;
  }

  gl.viewport(0, 0, width, height);

  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) return false;

  program = gl.createProgram();
  if (!program) return false;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    return false;
  }
  gl.useProgram(program);

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  startTime = performance.now();
  return true;
};

const render = () => {
  if (!gl || !program || !canvasRef.value) return;

  const canvas = canvasRef.value;
  gl.viewport(0, 0, canvas.width, canvas.height);

  const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
  const iTimeLocation = gl.getUniformLocation(program, 'iTime');
  const uHueLocation = gl.getUniformLocation(program, 'uHue');
  const uXOffsetLocation = gl.getUniformLocation(program, 'uXOffset');
  const uSpeedLocation = gl.getUniformLocation(program, 'uSpeed');
  const uIntensityLocation = gl.getUniformLocation(program, 'uIntensity');
  const uSizeLocation = gl.getUniformLocation(program, 'uSize');

  gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
  gl.uniform1f(iTimeLocation, (performance.now() - startTime) / 1000.0);
  gl.uniform1f(uHueLocation, props.hue);
  gl.uniform1f(uXOffsetLocation, props.xOffset);
  gl.uniform1f(uSpeedLocation, props.speed);
  gl.uniform1f(uIntensityLocation, props.intensity);
  gl.uniform1f(uSizeLocation, props.size);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  animationId = requestAnimationFrame(render);
};

const init = () => {
  if (isInitialized) return;
  const canvas = canvasRef.value;
  if (!canvas) return;

  if (initWebGL(canvas)) {
    isInitialized = true;
    render();
  }
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  // Immediate attempt
  init();

  // Observe for size changes
  resizeObserver = new ResizeObserver(() => {
    if (!isInitialized) {
      init();
    } else if (gl && program && canvasRef.value) {
      const c = canvasRef.value;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = c.getBoundingClientRect();
      const w = Math.max(Math.floor(rect.width * dpr), 1);
      const h = Math.max(Math.floor(rect.height * dpr), 1);
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
        gl.viewport(0, 0, w, h);
      }
    }
  });
  resizeObserver.observe(canvas);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  gl = null;
  program = null;
  isInitialized = false;
});
</script>

<style scoped>
.lightning-canvas {
  width: 100%;
  height: 100%;
  display: block;
  min-width: 100px;
  min-height: 100px;
  background: #ff0000;
}
</style>
