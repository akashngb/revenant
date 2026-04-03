"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }

  vec2 rotate(vec2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c) * p;
  }

  vec3 palette(float lightness, float heat) {
    vec3 shadow = vec3(0.07, 0.045, 0.03);
    vec3 clay = vec3(0.29, 0.15, 0.08);
    vec3 copper = vec3(0.60, 0.31, 0.14);
    vec3 sand = vec3(0.92, 0.84, 0.72);

    vec3 ramp = mix(shadow, clay, smoothstep(0.08, 0.38, lightness));
    ramp = mix(ramp, copper, smoothstep(0.24, 0.74, lightness + heat * 0.18));
    ramp = mix(ramp, sand, smoothstep(0.76, 1.02, lightness + heat * 0.1));
    return ramp;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    vec2 pixelGrid = vec2(uResolution.x / 2.5, uResolution.y / 2.5);
    vec2 snappedUv = (floor(vUv * pixelGrid) + 0.5) / pixelGrid;
    vec2 p = (snappedUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float arch = smoothstep(-1.45, 1.05, p.x + p.y * 0.72);
    float warp = sin((p.y * 10.5) + arch * 7.0 - uTime * 0.3) * 0.05;
    float ribs = sin((p.x + p.y * 0.58 + warp) * 40.0 - uTime * 0.55);
    float ribMask = pow(1.0 - abs(ribs), 5.5);

    float broadBands = 0.5 + 0.5 * sin((p.x + p.y * 0.28) * 8.0 + uTime * 0.08);
    float surface = ribMask * mix(0.45, 1.0, broadBands) * arch;

    float heat = 0.5 + 0.5 * sin((p.y * 3.8) + (p.x * 2.4) + uTime * 0.22);
    vec3 color = palette(surface, heat);

    float grain = hash(floor(vUv * pixelGrid) + floor(uTime * 10.0));
    color *= 0.92 + grain * 0.12;

    vec2 cell = fract(vUv * pixelGrid);
    float gridLine = max(step(0.97, cell.x), step(0.97, cell.y));
    color *= 1.0 - gridLine * 0.18;

    float scanline = 0.95 + 0.05 * sin(vUv.y * uResolution.y * 1.18 - uTime * 6.5);
    color *= scanline;

    float vignette = 1.0 - smoothstep(0.72, 1.28, length(uv * vec2(0.9, 1.0)));
    color *= 0.62 + vignette * 0.38;

    float alpha = clamp(surface * 1.4, 0.0, 0.88);
    gl_FragColor = vec4(color, alpha);
  }
`;

function HeroField() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock, size }) => {
    const material = materialRef.current;

    if (!material) {
      return;
    }

    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        transparent
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
        }}
        vertexShader={vertexShader}
      />
    </mesh>
  );
}

export function OmniateHeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas
        className="h-full w-full"
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        orthographic
      >
        <HeroField />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_44%,rgba(18,13,9,0)_0%,rgba(18,13,9,0.16)_28%,rgba(18,13,9,0.68)_74%,rgba(18,13,9,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,9,7,0.78)_0%,rgba(12,9,7,0.16)_24%,rgba(12,9,7,0)_46%,rgba(12,9,7,0.22)_74%,rgba(12,9,7,0.62)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_58%,rgba(229,171,98,0.1),transparent_24%),radial-gradient(circle_at_84%_34%,rgba(160,96,48,0.08),transparent_28%)] mix-blend-screen" />
    </div>
  );
}

