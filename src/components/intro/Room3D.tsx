import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import gsap from "gsap";

type Kind = "bounce" | "spin" | "wiggle" | "lamp";

const cssVar = (name: string, fallback: string) => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
};

/**
 * A tiny, playful interior-design diorama.
 * - Drag to rotate the room
 * - Tap / click any piece of furniture: it jumps, squashes and changes colour
 * - Lamp toggles its light, art frame wiggles, rug spins
 */
function Room3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* ---------- palette (pulled from the site's CSS variables) ---------- */
    const red = new THREE.Color(cssVar("--vivid-red", "#d4202b"));
    const pista = new THREE.Color(cssVar("--vivid-pista", "#a9c27a"));
    const black = new THREE.Color("#141414");
    const cream = new THREE.Color("#f3efe8");
    const palette = [red, pista, black, cream];

    /* ---------- renderer / scene / camera ---------- */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const lookTarget = new THREE.Vector3(0, 1.1, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8478, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(5, 9, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -6;
    sun.shadow.camera.right = 6;
    sun.shadow.camera.top = 6;
    sun.shadow.camera.bottom = -6;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const BASE_YAW = -Math.PI / 4;
    const room = new THREE.Group();
    room.rotation.y = BASE_YAW;
    scene.add(room);

    /* ---------- helpers ---------- */
    const pickables: THREE.Group[] = [];

    const addMesh = (
      parent: THREE.Object3D,
      geometry: THREE.BufferGeometry,
      color: THREE.Color,
      position: [number, number, number],
      opts: { tint?: boolean; cast?: boolean; receive?: boolean } = {},
    ) => {
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: color.clone(),
          roughness: 0.62,
          metalness: 0.04,
        }),
      );
      mesh.position.set(...position);
      mesh.castShadow = opts.cast ?? true;
      mesh.receiveShadow = opts.receive ?? true;
      mesh.userData.tint = !!opts.tint;
      parent.add(mesh);
      return mesh;
    };

    const rbox = (w: number, h: number, d: number, r = 0.08) =>
      new RoundedBoxGeometry(w, h, d, 4, r);

    const makePickable = (
      position: [number, number, number],
      kind: Kind,
      startIndex: number,
    ) => {
      const group = new THREE.Group();
      group.position.set(...position);
      group.userData = {
        pickable: true,
        kind,
        baseY: position[1],
        colorIndex: startIndex,
      };
      room.add(group);
      pickables.push(group);
      return group;
    };

    /* ---------- room shell ---------- */
    const wallColor = new THREE.Color("#f3efe8");
    addMesh(room, rbox(6.4, 0.3, 6.4, 0.05), new THREE.Color("#d8d0c4"), [0, -0.15, 0]);
    addMesh(room, rbox(6.4, 3.3, 0.22, 0.04), wallColor, [0, 1.5, -3.1]);
    addMesh(room, rbox(0.22, 3.3, 6.4, 0.04), new THREE.Color("#ece7de"), [-3.1, 1.5, 0]);
    // accent skirting line in brand red
    addMesh(room, new THREE.BoxGeometry(6.2, 0.06, 0.04), red, [0, 0.03, -2.98], { cast: false });
    addMesh(room, new THREE.BoxGeometry(0.04, 0.06, 6.2), red, [-2.98, 0.03, 0], { cast: false });

    /* ---------- sofa ---------- */
    const sofa = makePickable([0.2, 0, -2.2], "bounce", 0);
    addMesh(sofa, rbox(2.4, 0.5, 1.0, 0.12), red, [0, 0.25, 0], { tint: true });
    addMesh(sofa, rbox(2.4, 0.85, 0.3, 0.12), red, [0, 0.72, -0.4], { tint: true });
    addMesh(sofa, rbox(0.32, 0.72, 1.0, 0.12), red, [-1.2, 0.36, 0], { tint: true });
    addMesh(sofa, rbox(0.32, 0.72, 1.0, 0.12), red, [1.2, 0.36, 0], { tint: true });
    addMesh(sofa, rbox(0.95, 0.2, 0.75, 0.09), cream, [-0.5, 0.6, 0.05]);
    addMesh(sofa, rbox(0.95, 0.2, 0.75, 0.09), cream, [0.5, 0.6, 0.05]);

    /* ---------- rug ---------- */
    const rug = makePickable([0.2, 0, 0.6], "spin", 1);
    addMesh(rug, new THREE.CylinderGeometry(1.6, 1.6, 0.05, 56), pista, [0, 0.025, 0], { tint: true, cast: false });
    addMesh(rug, new THREE.CylinderGeometry(1.15, 1.15, 0.06, 56), cream, [0, 0.03, 0], { cast: false });
    addMesh(rug, new THREE.CylinderGeometry(0.7, 0.7, 0.07, 56), red, [0, 0.035, 0], { cast: false });

    /* ---------- coffee table ---------- */
    const table = makePickable([0.2, 0, 0.6], "bounce", 2);
    addMesh(table, new THREE.CylinderGeometry(0.58, 0.58, 0.09, 40), black, [0, 0.62, 0], { tint: true });
    addMesh(table, new THREE.CylinderGeometry(0.06, 0.06, 0.55, 20), cream, [0, 0.32, 0]);
    addMesh(table, new THREE.CylinderGeometry(0.3, 0.32, 0.05, 32), cream, [0, 0.03, 0]);
    addMesh(table, new THREE.SphereGeometry(0.14, 24, 24), red, [0.15, 0.78, 0.05], { tint: false });

    /* ---------- pouf ---------- */
    const pouf = makePickable([2.15, 0, 0.9], "bounce", 0);
    addMesh(pouf, new THREE.CylinderGeometry(0.44, 0.4, 0.5, 40), red, [0, 0.25, 0], { tint: true });
    addMesh(pouf, new THREE.TorusGeometry(0.42, 0.045, 12, 40), cream, [0, 0.5, 0], { tint: false }).rotation.x = Math.PI / 2;

    /* ---------- plant ---------- */
    const plant = makePickable([2.3, 0, -2.3], "bounce", 1);
    addMesh(plant, new THREE.CylinderGeometry(0.34, 0.26, 0.55, 32), black, [0, 0.275, 0]);
    const leaves = new THREE.Group();
    leaves.position.y = 0.55;
    plant.add(leaves);
    const leafSpots: [number, number, number, number][] = [
      [0, 0.45, 0, 0.34],
      [-0.28, 0.75, 0.05, 0.27],
      [0.26, 0.85, -0.05, 0.3],
      [0.02, 1.1, 0.1, 0.26],
      [-0.1, 0.62, 0.3, 0.22],
    ];
    leafSpots.forEach(([x, y, z, r]) =>
      addMesh(leaves, new THREE.SphereGeometry(r, 24, 24), pista, [x, y, z], { tint: true }),
    );

    /* ---------- floor lamp ---------- */
    const lamp = makePickable([-2.4, 0, -0.9], "lamp", 0);
    addMesh(lamp, new THREE.CylinderGeometry(0.3, 0.32, 0.06, 32), black, [0, 0.03, 0]);
    addMesh(lamp, new THREE.CylinderGeometry(0.03, 0.03, 1.9, 12), black, [0, 0.98, 0]);
    const shade = addMesh(
      lamp,
      new THREE.CylinderGeometry(0.22, 0.42, 0.55, 40),
      red,
      [0, 2.05, 0],
      { tint: true },
    );
    (shade.material as THREE.MeshStandardMaterial).emissive.set(0xffb86b);
    (shade.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.55;
    shade.userData.glow = true;
    const lampLight = new THREE.PointLight(0xffc27a, 14, 7, 2);
    lampLight.position.set(0, 1.95, 0);
    lamp.add(lampLight);
    lamp.userData.on = true;

    /* ---------- wall art ---------- */
    const art = makePickable([1.5, 1.8, -2.96], "wiggle", 0);
    addMesh(art, new THREE.BoxGeometry(1.35, 1.75, 0.07), black, [0, 0, 0]);
    addMesh(art, new THREE.BoxGeometry(1.13, 1.53, 0.07), cream, [0, 0, 0.015]);
    addMesh(art, new THREE.CylinderGeometry(0.36, 0.36, 0.04, 40), red, [0, 0.25, 0.06], { tint: true }).rotation.x = Math.PI / 2;
    addMesh(art, new THREE.BoxGeometry(0.66, 0.3, 0.03), pista, [0, -0.4, 0.06], { tint: true });

    /* ---------- floating playful bits ---------- */
    const floaters: { mesh: THREE.Mesh; y: number; speed: number }[] = [];
    const addFloater = (
      geo: THREE.BufferGeometry,
      color: THREE.Color,
      pos: [number, number, number],
      speed: number,
    ) => {
      const mesh = addMesh(room, geo, color, pos);
      floaters.push({ mesh, y: pos[1], speed });
    };
    addFloater(new THREE.IcosahedronGeometry(0.17, 0), red, [-1.6, 3.0, 0.8], 1.1);
    addFloater(new THREE.TorusGeometry(0.15, 0.05, 12, 28), pista, [2.2, 3.1, 0.2], 0.8);
    addFloater(new THREE.OctahedronGeometry(0.16, 0), cream, [0.4, 3.4, -0.9], 1.4);

    /* ---------- interactions ---------- */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered: THREE.Group | null = null;
    let dragging = false;
    let moved = 0;
    let startX = 0;
    let startOffset = 0;
    let yawOffset = 0;
    let yawTarget = 0;
    let px = 0;
    let py = 0;

    const pickAt = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickables, true)[0];
      if (!hit) return null;
      let node: THREE.Object3D | null = hit.object;
      while (node && !node.userData.pickable) node = node.parent;
      return (node as THREE.Group) ?? null;
    };

    const setHover = (group: THREE.Group | null) => {
      if (group === hovered) return;
      const apply = (g: THREE.Group | null, hex: number) =>
        g?.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh && !m.userData.glow) {
            (m.material as THREE.MeshStandardMaterial).emissive.setHex(hex);
          }
        });
      apply(hovered, 0x000000);
      apply(group, 0x2b2b2b);
      hovered = group;
      renderer.domElement.style.cursor = group
        ? "pointer"
        : dragging
          ? "grabbing"
          : "grab";
    };

    const play = (g: THREE.Group) => {
      const { kind, baseY } = g.userData as { kind: Kind; baseY: number };
      gsap.killTweensOf([g.position, g.scale, g.rotation]);
      g.scale.set(1, 1, 1);
      g.position.y = baseY;

      // colour cycle
      g.userData.colorIndex = (g.userData.colorIndex + 1) % palette.length;
      const next = palette[g.userData.colorIndex];
      g.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh && m.userData.tint) {
          gsap.to((m.material as THREE.MeshStandardMaterial).color, {
            r: next.r,
            g: next.g,
            b: next.b,
            duration: 0.45,
            ease: "power2.out",
          });
        }
      });

      if (kind === "spin") {
        gsap.fromTo(
          g.rotation,
          { y: 0 },
          { y: Math.PI * 2, duration: 1.2, ease: "power3.out" },
        );
      } else if (kind === "wiggle") {
        gsap.fromTo(
          g.rotation,
          { z: 0.28 },
          { z: 0, duration: 1.4, ease: "elastic.out(1, 0.25)" },
        );
      } else {
        if (kind === "lamp") {
          g.userData.on = !g.userData.on;
          const on = g.userData.on as boolean;
          gsap.to(lampLight, { intensity: on ? 14 : 0, duration: 0.35 });
          gsap.to(shade.material as THREE.MeshStandardMaterial, {
            emissiveIntensity: on ? 0.55 : 0,
            duration: 0.35,
          });
        }
        gsap
          .timeline()
          .to(g.scale, { x: 1.12, y: 0.8, z: 1.12, duration: 0.12, ease: "power2.out" })
          .to(g.scale, { x: 0.95, y: 1.12, z: 0.95, duration: 0.2, ease: "power2.out" })
          .to(g.position, { y: baseY + 0.75, duration: 0.25, ease: "power2.out" }, "<")
          .to(g.position, { y: baseY, duration: 0.6, ease: "bounce.out" })
          .to(g.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" }, "<0.1");
      }
    };

    const el = renderer.domElement;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      startX = e.clientX;
      startOffset = yawTarget;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      if (dragging) {
        const dx = e.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        yawTarget = THREE.MathUtils.clamp(startOffset + dx * 0.008, -0.75, 0.75);
      } else if (e.pointerType === "mouse") {
        setHover(pickAt(e.clientX, e.clientY));
      }
    };

    const onUp = (e: PointerEvent) => {
      const wasClick = dragging && moved < 6;
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      if (wasClick) {
        const hit = pickAt(e.clientX, e.clientY);
        if (hit) play(hit);
      }
      el.style.cursor = hovered ? "pointer" : "grab";
    };

    const onLeave = () => {
      px = 0;
      py = 0;
      setHover(null);
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);

    /* ---------- sizing ---------- */
    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const spread = THREE.MathUtils.clamp(1.25 / camera.aspect, 1, 2);
      camera.position.set(0, 6.4 * spread, 13.2 * spread);
      camera.lookAt(lookTarget);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    /* ---------- render loop (paused when off-screen) ---------- */
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(host);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();

      const idle = reduceMotion || dragging ? 0 : Math.sin(t * 0.45) * 0.1;
      room.rotation.y = THREE.MathUtils.lerp(
        room.rotation.y,
        BASE_YAW + yawTarget + idle + px * 0.06,
        0.08,
      );
      room.rotation.x = THREE.MathUtils.lerp(room.rotation.x, py * 0.04, 0.08);

      if (!reduceMotion) {
        leaves.rotation.z = Math.sin(t * 1.6) * 0.04;
        leaves.rotation.x = Math.cos(t * 1.3) * 0.03;
        floaters.forEach((f, i) => {
          f.mesh.position.y = f.y + Math.sin(t * f.speed + i) * 0.18;
          f.mesh.rotation.x += 0.012 * f.speed;
          f.mesh.rotation.y += 0.016 * f.speed;
        });
      }

      renderer.render(scene, camera);
    };
    tick();

    /* ---------- cleanup ---------- */
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      resizeObserver.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
      pickables.forEach((g) =>
        gsap.killTweensOf([g.position, g.scale, g.rotation]),
      );
      gsap.killTweensOf(lampLight);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          gsap.killTweensOf((m.material as THREE.MeshStandardMaterial).color);
          (m.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      if (el.parentNode === host) host.removeChild(el);
    };
  }, []);

  return <div ref={hostRef} className="vivid-room" aria-label="Interactive 3D room: drag to rotate, tap furniture to play" role="img" />;
}

export default Room3D;
