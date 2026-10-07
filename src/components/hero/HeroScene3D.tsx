import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import gsap from "gsap";

const cssVar = (name: string, fallback: string) => {
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
};

type Piece = {
  mesh: THREE.Mesh;
  pos: THREE.Vector3;
  rot: THREE.Euler;
  delay: number;
};

/**
 * Raw interior materials (tiles, timber, fabric, brass, paint) rain down
 * from the top of the hero and assemble into a lounge corner.
 * Click the finished scene to watch it rebuild.
 */
function HeroScene3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* ---------- palette ---------- */
    const red = new THREE.Color(cssVar("--vivid-red", "#d4202b"));
    const pista = new THREE.Color(cssVar("--vivid-pista", "#97bf4d"));
    const black = new THREE.Color("#161616");
    const cream = new THREE.Color("#f3efe8");
    const wood = new THREE.Color("#a8764a");
    const plywood = new THREE.Color("#d9b183");
    const brass = new THREE.Color("#c9a24b");

    /* ---------- renderer / scene ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x9a9486, 1.15));
    const sun = new THREE.DirectionalLight(0xffffff, 2.6);
    sun.position.set(4, 10, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -5;
    sun.shadow.camera.right = 5;
    sun.shadow.camera.top = 5;
    sun.shadow.camera.bottom = -5;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    // invisible ground that only catches shadows (falling pieces get shadows)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.16 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const room = new THREE.Group();
    scene.add(room);

    /* ---------- piece factory ---------- */
    const pieces: Piece[] = [];
    let clock = 0;

    const mat = (c: THREE.Color, rough = 0.6) =>
      new THREE.MeshStandardMaterial({
        color: c.clone(),
        roughness: rough,
        metalness: c === brass ? 0.65 : 0.04,
      });

    const add = (
      geo: THREE.BufferGeometry,
      color: THREE.Color,
      pos: [number, number, number],
      rot: [number, number, number] = [0, 0, 0],
      gap = 0.07,
      rough = 0.6,
    ) => {
      const mesh = new THREE.Mesh(geo, mat(color, rough));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.visible = false;
      room.add(mesh);
      pieces.push({
        mesh,
        pos: new THREE.Vector3(...pos),
        rot: new THREE.Euler(...rot),
        delay: clock,
      });
      clock += gap;
      return mesh;
    };
    const pause = (s = 0.25) => {
      clock += s;
    };
    const rbox = (w: number, h: number, d: number, r = 0.06) =>
      new RoundedBoxGeometry(w, h, d, 4, r);
    const cyl = (rt: number, rb: number, h: number, seg = 32) =>
      new THREE.CylinderGeometry(rt, rb, h, seg);

    const cy = 0.12; // top of the tile floor

    /* 1 — floor tiles (checker) */
    for (let i = 0; i < 9; i++) {
      const gx = (i % 3) - 1;
      const gz = Math.floor(i / 3) - 1;
      add(
        rbox(0.98, 0.12, 0.98, 0.02),
        (gx + gz) % 2 === 0 ? cream : black,
        [gx * 1.02, 0.06, gz * 1.02],
        [0, 0, 0],
        0.06,
        0.35,
      );
    }
    pause();

    /* 2 — timber legs */
    const P = (x: number, y: number, z: number): [number, number, number] => [
      x,
      cy + y,
      z - 0.1,
    ];
    (
      [
        [-0.42, 0.36],
        [0.42, 0.36],
        [-0.42, -0.36],
        [0.42, -0.36],
      ] as const
    ).forEach(([x, z]) =>
      add(cyl(0.045, 0.065, 0.46, 20), wood, P(x, 0.23, z)),
    );
    pause(0.15);

    /* 3 — plywood seat & back, then upholstery */
    add(rbox(1.0, 0.07, 0.92, 0.02), plywood, P(0, 0.5, 0), [0, 0, 0], 0.2);
    add(
      rbox(1.0, 0.78, 0.06, 0.02),
      plywood,
      P(0, 1.0, -0.44),
      [-0.2, 0, 0],
      0.2,
    );
    add(rbox(0.96, 0.2, 0.86, 0.09), red, P(0, 0.64, 0.02), [0, 0, 0], 0.2);
    add(
      rbox(0.92, 0.58, 0.16, 0.08),
      cream,
      P(0, 1.0, -0.33),
      [-0.2, 0, 0],
      0.2,
    );
    add(
      rbox(0.34, 0.34, 0.12, 0.05),
      pista,
      P(-0.28, 0.9, -0.2),
      [-0.25, 0.35, 0.25],
      0.1,
    );
    pause(0.1);

    /* 4 — arms */
    ([-0.52, 0.52] as const).forEach((x) => {
      add(rbox(0.07, 0.36, 0.07, 0.02), wood, P(x, 0.71, 0.3), [0, 0, 0], 0.05);
      add(rbox(0.11, 0.06, 0.8, 0.02), wood, P(x, 0.92, 0), [0, 0, 0], 0.1);
    });
    pause();

    /* 5 — side table with a paint can */
    const tx = 1.05;
    const tz = 0.35;
    add(
      cyl(0.4, 0.4, 0.06, 40),
      black,
      [tx, cy + 0.62, tz],
      [0, 0, 0],
      0.1,
      0.4,
    );
    [90, 210, 330].forEach((a) => {
      const r = (a * Math.PI) / 180;
      add(
        cyl(0.02, 0.02, 0.6, 12),
        brass,
        [tx + Math.cos(r) * 0.22, cy + 0.3, tz + Math.sin(r) * 0.22],
        [0, 0, 0],
        0.05,
        0.3,
      );
    });
    add(cyl(0.12, 0.12, 0.22, 28), cream, [tx, cy + 0.76, tz], [0, 0, 0], 0.08);
    add(cyl(0.123, 0.123, 0.08, 28), red, [tx, cy + 0.76, tz], [0, 0, 0], 0.08);
    add(
      cyl(0.128, 0.128, 0.03, 28),
      pista,
      [tx, cy + 0.885, tz],
      [0, 0, 0],
      0.1,
    );
    pause();

    /* 6 — floor lamp */
    const lx = -1.05;
    const lz = -0.6;
    add(cyl(0.3, 0.32, 0.05, 36), black, [lx, cy + 0.025, lz], [0, 0, 0], 0.1);
    add(
      cyl(0.025, 0.025, 1.7, 14),
      brass,
      [lx, cy + 0.9, lz],
      [0, 0, 0],
      0.1,
      0.3,
    );
    const shade = add(
      cyl(0.2, 0.4, 0.5, 40),
      red,
      [lx, cy + 1.85, lz],
      [0, 0, 0],
      0.1,
    );
    const shadeMat = shade.material as THREE.MeshStandardMaterial;
    shadeMat.emissive.set(0xffb86b);
    shadeMat.emissiveIntensity = 0;
    const lampLight = new THREE.PointLight(0xffc27a, 0, 7, 2);
    lampLight.position.set(lx, cy + 1.8, lz);
    room.add(lampLight);
    pause();

    /* 7 — plant */
    const px0 = 1.1;
    const pz0 = -0.95;
    add(cyl(0.3, 0.23, 0.5, 32), black, [px0, cy + 0.25, pz0], [0, 0, 0], 0.1);
    (
      [
        [0, 0.8, 0, 0.3],
        [-0.2, 1.05, 0.05, 0.24],
        [0.2, 1.1, -0.04, 0.26],
        [0.02, 1.35, 0.06, 0.2],
      ] as const
    ).forEach(([x, y, z, r]) =>
      add(
        new THREE.SphereGeometry(r, 24, 24),
        pista,
        [px0 + x, cy + y, pz0 + z],
        [0, 0, 0],
        0.07,
      ),
    );
    pause(0.1);

    /* 8 — roll of fabric left over */
    add(
      cyl(0.08, 0.08, 0.74, 16),
      cream,
      [-0.7, cy + 0.17, 1.0],
      [0, 0.4, Math.PI / 2],
      0.08,
    );
    add(
      cyl(0.17, 0.17, 0.62, 32),
      pista,
      [-0.7, cy + 0.17, 1.0],
      [0, 0.4, Math.PI / 2],
      0.1,
    );

    const lastDelay = clock;
    const totalTime = lastDelay + 1.4;

    /* ---------- build / rebuild ---------- */
    let busy = false;
    let built = false;
    let buildDone: gsap.core.Tween | null = null;

    const settle = () => {
      pieces.forEach((p) => {
        p.mesh.visible = true;
        p.mesh.position.copy(p.pos);
        p.mesh.rotation.copy(p.rot);
      });
      lampLight.intensity = 9;
      shadeMat.emissiveIntensity = 0.55;
      built = true;
      busy = false;
    };

    const build = () => {
      busy = true;
      built = false;
      lampLight.intensity = 0;
      shadeMat.emissiveIntensity = 0;
      pieces.forEach((p) => {
        gsap.killTweensOf([p.mesh.position, p.mesh.rotation]);
        p.mesh.visible = false;
        const sx = p.pos.x + (Math.random() - 0.5) * 1.2;
        const sz = p.pos.z + (Math.random() - 0.5) * 0.8;
        const sy = p.pos.y + 10 + Math.random() * 3;
        const d = p.delay + 0.2;
        gsap.fromTo(
          p.mesh.position,
          { x: sx, y: sy, z: sz },
          {
            y: p.pos.y,
            duration: 1.05,
            delay: d,
            ease: "bounce.out",
            immediateRender: false,
            onStart: () => {
              p.mesh.visible = true;
            },
          },
        );
        gsap.to(p.mesh.position, {
          x: p.pos.x,
          z: p.pos.z,
          duration: 0.75,
          delay: d,
          ease: "power2.out",
        });
        gsap.fromTo(
          p.mesh.rotation,
          {
            x: p.rot.x + (Math.random() - 0.5) * 5,
            y: p.rot.y + (Math.random() - 0.5) * 5,
            z: p.rot.z + (Math.random() - 0.5) * 5,
          },
          {
            x: p.rot.x,
            y: p.rot.y,
            z: p.rot.z,
            duration: 0.85,
            delay: d,
            ease: "power3.out",
            immediateRender: false,
          },
        );
      });
      gsap.to(lampLight, {
        intensity: 9,
        duration: 0.8,
        delay: totalTime - 0.3,
      });
      gsap.to(shadeMat, {
        emissiveIntensity: 0.55,
        duration: 0.8,
        delay: totalTime - 0.3,
      });
      buildDone = gsap.delayedCall(totalTime, () => {
        built = true;
        busy = false;
      });
    };

    const rebuild = () => {
      if (busy) return;
      busy = true;
      built = false;
      gsap.to(lampLight, { intensity: 0, duration: 0.3 });
      gsap.to(shadeMat, { emissiveIntensity: 0, duration: 0.3 });
      pieces.forEach((p, i) =>
        gsap.to(p.mesh.position, {
          y: p.pos.y + 11,
          duration: 0.55,
          delay: i * 0.01,
          ease: "power2.in",
        }),
      );
      buildDone = gsap.delayedCall(0.6 + pieces.length * 0.01, build);
    };

    if (reduceMotion) settle();
    else build();

    /* ---------- interaction ---------- */
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const el = renderer.domElement;
    let tx0 = 0;
    let ty0 = 0;
    let yawGoal = 0;
    let pitchGoal = 0;

    const hit = (cx: number, cy2: number) => {
      const r = el.getBoundingClientRect();
      ndc.set(
        ((cx - r.left) / r.width) * 2 - 1,
        -((cy2 - r.top) / r.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObjects(room.children, false).length > 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      yawGoal = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
      pitchGoal = ((e.clientY - r.top) / r.height - 0.5) * 0.06;
      el.style.cursor =
        built && hit(e.clientX, e.clientY) ? "pointer" : "default";
    };
    const onDown = (e: PointerEvent) => {
      tx0 = e.clientX;
      ty0 = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      if (
        Math.hypot(e.clientX - tx0, e.clientY - ty0) < 6 &&
        built &&
        hit(e.clientX, e.clientY)
      ) {
        if (reduceMotion) return;
        rebuild();
      }
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);

    /* ---------- sizing: object sits right of the text (desktop) or below it (mobile) ---------- */
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      const stacked = w <= 900;
      const spread = stacked ? THREE.MathUtils.clamp(1.0 / aspect, 1, 2.1) : 1;
      camera.aspect = aspect;
      camera.position.set(0, 4.3 * spread, 10.6 * spread);
      camera.lookAt(0, 0.95, 0);
      camera.setViewOffset(
        w,
        h,
        stacked ? 0 : -w * 0.235,
        stacked ? -h * 0.2 : -h * 0.07,
        w,
        h,
      );
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    /* ---------- loop ---------- */
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);

    const timer = new THREE.Timer();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = timer.getElapsed();
      const idleYaw = reduceMotion ? 0 : Math.sin(t * 0.5) * 0.07;
      room.rotation.y = THREE.MathUtils.lerp(
        room.rotation.y,
        -0.5 + yawGoal + idleYaw,
        0.06,
      );
      room.rotation.x = THREE.MathUtils.lerp(room.rotation.x, pitchGoal, 0.06);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      buildDone?.kill();
      pieces.forEach((p) =>
        gsap.killTweensOf([p.mesh.position, p.mesh.rotation]),
      );
      gsap.killTweensOf([lampLight, shadeMat]);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          (m.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      if (el.parentNode === host) host.removeChild(el);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="vivid-hero__scene"
      role="img"
      aria-label="Interior materials dropping in and assembling into a lounge corner. Click to rebuild."
    />
  );
}

export default HeroScene3D;
