import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Hero3DVisual = () => {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(2.8, 2.2, 5.8);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    // ── Studio Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key studio light (cool daylight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(6, 8, 5);
    scene.add(keyLight);

    // Fill light (cobalt tint to reflect brand identity)
    const fillLight = new THREE.DirectionalLight(0x3b82f6, 2.2);
    fillLight.position.set(-6, 3, -2);
    scene.add(fillLight);

    // Rim light from rear-top
    const rimLight = new THREE.PointLight(0x93c5fd, 3.5, 20);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // ── Ground Contact Shadow Plane ──
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 60);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.8, 3.8);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.35;
    scene.add(shadowMesh);

    // ── Materials ──
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.18,
    });

    const wireMat = new THREE.MeshStandardMaterial({
      color: 0xa1a1aa,
      metalness: 0.9,
      roughness: 0.25,
    });

    const brandBlueMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.3,
      roughness: 0.25,
    });

    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.1,
      roughness: 0.85,
    });

    const packageKraftMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.7,
      metalness: 0.05,
    });

    const packageTapeMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.4,
      metalness: 0.2,
    });

    const gadgetMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.9,
      roughness: 0.15,
    });

    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
    });

    // ── Main Cart Assembly Group ──
    const cartRoot = new THREE.Group();
    scene.add(cartRoot);

    // 1. BASKET PERIMETER TOP RIM
    const topRimGeo = new THREE.BoxGeometry(2.1, 0.05, 1.5);
    const topRimWire = new THREE.WireframeGeometry(topRimGeo);
    const topRim = new THREE.LineSegments(
      topRimWire,
      new THREE.LineBasicMaterial({ color: 0x60a5fa, linewidth: 2 })
    );
    topRim.position.set(0, 0.8, 0);
    cartRoot.add(topRim);

    // Solid top tube rail
    const rimPoints = [
      new THREE.Vector3(-1.05, 0.8, -0.75),
      new THREE.Vector3(1.05, 0.8, -0.75),
      new THREE.Vector3(1.05, 0.8, 0.75),
      new THREE.Vector3(-1.05, 0.8, 0.75),
      new THREE.Vector3(-1.05, 0.8, -0.75),
    ];
    const rimCurve = new THREE.CatmullRomCurve3(rimPoints, true);
    const rimTubeGeo = new THREE.TubeGeometry(rimCurve, 32, 0.03, 8, true);
    const rimTube = new THREE.Mesh(rimTubeGeo, chromeMat);
    cartRoot.add(rimTube);

    // 2. BASKET BOTTOM FLOOR
    const floorPoints = [
      new THREE.Vector3(-0.9, -0.2, -0.65),
      new THREE.Vector3(0.9, -0.2, -0.65),
      new THREE.Vector3(0.9, -0.2, 0.65),
      new THREE.Vector3(-0.9, -0.2, 0.65),
      new THREE.Vector3(-0.9, -0.2, -0.65),
    ];
    const floorCurve = new THREE.CatmullRomCurve3(floorPoints, true);
    const floorTubeGeo = new THREE.TubeGeometry(floorCurve, 32, 0.025, 8, true);
    const floorTube = new THREE.Mesh(floorTubeGeo, chromeMat);
    cartRoot.add(floorTube);

    // 3. VERTICAL BASKET WIRE RIBS
    const wireCylGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.0, 6);
    
    // Front & Back wall wire ribs
    for (let x = -0.95; x <= 0.95; x += 0.18) {
      // Front wire
      const wireF = new THREE.Mesh(wireCylGeo, wireMat);
      wireF.position.set(x, 0.3, 0.7);
      cartRoot.add(wireF);

      // Back wire
      const wireB = new THREE.Mesh(wireCylGeo, wireMat);
      wireB.position.set(x, 0.3, -0.7);
      cartRoot.add(wireB);
    }

    // Side wall wire ribs
    const sideWireGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.0, 6);
    for (let z = -0.65; z <= 0.65; z += 0.18) {
      const wireL = new THREE.Mesh(sideWireGeo, wireMat);
      wireL.position.set(-0.98, 0.3, z);
      cartRoot.add(wireL);

      const wireR = new THREE.Mesh(sideWireGeo, wireMat);
      wireR.position.set(0.98, 0.3, z);
      cartRoot.add(wireR);
    }

    // Horizontal wire rungs running around the basket
    const levels = [0.05, 0.3, 0.55];
    levels.forEach((lvl) => {
      const rungPoints = [
        new THREE.Vector3(-0.98, lvl, -0.7),
        new THREE.Vector3(0.98, lvl, -0.7),
        new THREE.Vector3(0.98, lvl, 0.7),
        new THREE.Vector3(-0.98, lvl, 0.7),
        new THREE.Vector3(-0.98, lvl, -0.7),
      ];
      const rungCurve = new THREE.CatmullRomCurve3(rungPoints, true);
      const rungGeo = new THREE.TubeGeometry(rungCurve, 32, 0.012, 6, true);
      const rung = new THREE.Mesh(rungGeo, wireMat);
      cartRoot.add(rung);
    });

    // 4. ERGONOMIC PUSH HANDLE
    const handleStrutL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8),
      chromeMat
    );
    handleStrutL.position.set(-1.05, 1.0, -0.55);
    handleStrutL.rotation.z = 0.35;
    cartRoot.add(handleStrutL);

    const handleStrutR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.6, 8),
      chromeMat
    );
    handleStrutR.position.set(-1.05, 1.0, 0.55);
    handleStrutR.rotation.z = 0.35;
    cartRoot.add(handleStrutR);

    // Crossbar handle with blue grip
    const handleBar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 1.4, 16),
      brandBlueMat
    );
    handleBar.position.set(-1.22, 1.25, 0);
    handleBar.rotation.x = Math.PI / 2;
    cartRoot.add(handleBar);

    // 5. LOWER CHASSIS & WHEEL BASE
    const legL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8),
      chromeMat
    );
    legL.position.set(0.7, -0.7, 0.6);
    legL.rotation.z = 0.15;
    cartRoot.add(legL);

    const legR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8),
      chromeMat
    );
    legR.position.set(0.7, -0.7, -0.6);
    legR.rotation.z = 0.15;
    cartRoot.add(legR);

    const legBackL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8),
      chromeMat
    );
    legBackL.position.set(-0.7, -0.7, 0.6);
    legBackL.rotation.z = -0.15;
    cartRoot.add(legBackL);

    const legBackR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8),
      chromeMat
    );
    legBackR.position.set(-0.7, -0.7, -0.6);
    legBackR.rotation.z = -0.15;
    cartRoot.add(legBackR);

    // Lower Tray Rack
    const bottomRack = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.02, 1.1),
      chromeMat
    );
    bottomRack.position.set(0, -1.05, 0);
    cartRoot.add(bottomRack);

    // 6. FOUR CASTER WHEELS
    const wheelPositions = [
      [0.85, -1.2, 0.6],
      [0.85, -1.2, -0.6],
      [-0.85, -1.2, 0.6],
      [-0.85, -1.2, -0.6],
    ];

    const wheelMeshes = [];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      // Caster fork bracket
      const fork = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.15, 8),
        chromeMat
      );
      fork.position.set(0, 0.1, 0);
      wheelGroup.add(fork);

      // Tire (rubber rim)
      const tire = new THREE.Mesh(
        new THREE.TorusGeometry(0.12, 0.04, 12, 24),
        rubberMat
      );
      tire.rotation.y = Math.PI / 2;
      wheelGroup.add(tire);

      // Center chrome hub
      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12),
        chromeMat
      );
      hub.rotation.z = Math.PI / 2;
      wheelGroup.add(hub);

      cartRoot.add(wheelGroup);
      wheelMeshes.push(tire);
    });

    // 7. REAL SHOPPING ITEMS SITTING INSIDE THE CART

    // Item A: E-Commerce Delivery Parcel Box with Brand Tape
    const parcelGroup = new THREE.Group();
    parcelGroup.position.set(-0.25, 0.35, 0.1);
    parcelGroup.rotation.set(0.1, 0.3, -0.15);

    const parcelBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.65, 0.65),
      packageKraftMat
    );
    parcelGroup.add(parcelBox);

    const tapeH = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 0.12, 0.66),
      packageTapeMat
    );
    parcelGroup.add(tapeH);

    const tapeV = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.66, 0.66),
      packageTapeMat
    );
    parcelGroup.add(tapeV);

    cartRoot.add(parcelGroup);

    // Item B: Sleek Flagship Smartphone with Glowing Bezel
    const phoneGroup = new THREE.Group();
    phoneGroup.position.set(0.4, 0.45, -0.15);
    phoneGroup.rotation.set(-0.25, 0.5, 0.2);

    const phoneBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.85, 0.05),
      gadgetMat
    );
    phoneGroup.add(phoneBody);

    const phoneScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.38, 0.78),
      screenMat
    );
    phoneScreen.position.z = 0.026;
    phoneGroup.add(phoneScreen);

    // Camera module bump on rear
    const cameraBump = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.15, 0.02),
      gadgetMat
    );
    cameraBump.position.set(-0.1, 0.3, -0.035);
    phoneGroup.add(cameraBump);

    cartRoot.add(phoneGroup);

    // Item C: Over-Ear Audio Headphones Box
    const audioBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.5, 0.45),
      new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.5,
        roughness: 0.3,
      })
    );
    audioBox.position.set(0.2, 0.15, 0.25);
    audioBox.rotation.set(0.05, -0.4, 0.1);
    cartRoot.add(audioBox);

    // 8. FLOATING KINETIC SMART BADGE (Interactive Verified Tag)
    const badgeGroup = new THREE.Group();
    badgeGroup.position.set(1.2, 0.9, 0.6);

    const badgeRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.25, 0.025, 12, 32),
      new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.8,
        roughness: 0.2,
      })
    );
    badgeGroup.add(badgeRing);

    const badgeGem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.14, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0x60a5fa,
        emissive: 0x2563eb,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.1,
      })
    );
    badgeGroup.add(badgeGem);
    cartRoot.add(badgeGroup);

    // ── Mouse & Touch Drag Interaction ──
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0.45; // Default aesthetic 3/4 front angle
    let targetY = 0.15;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        targetX += deltaX * 0.008;
        targetY += deltaY * 0.008;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      } else {
        mouseX = x * 0.25;
        mouseY = y * 0.15;
      }
    };

    const handlePointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // ── Resize Observer ──
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // ── Animation Loop ──
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation when not dragging
      if (!isDragging) {
        targetX += 0.0025;
      }

      // Smooth damping interpolation
      cartRoot.rotation.y += (targetX + mouseX - cartRoot.rotation.y) * 0.05;
      cartRoot.rotation.x += (targetY - mouseY - cartRoot.rotation.x) * 0.05;

      // Realistic suspension floating motion
      const floatY = Math.sin(elapsedTime * 1.8) * 0.06;
      cartRoot.position.y = floatY;
      shadowMesh.scale.setScalar(1 + floatY * 0.8);

      // Floating verified smart tag spinning and bobbing
      badgeGroup.position.y = 0.9 + Math.sin(elapsedTime * 2.5) * 0.08;
      badgeRing.rotation.y = elapsedTime * 1.5;
      badgeGem.rotation.x = elapsedTime * 2.0;

      // Subtle wheel idle micro-rotation
      wheelMeshes.forEach((tire, idx) => {
        tire.rotation.x = elapsedTime * (0.8 + idx * 0.1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries & materials
      topRimGeo.dispose();
      topRimWire.dispose();
      rimTubeGeo.dispose();
      floorTubeGeo.dispose();
      wireCylGeo.dispose();
      sideWireGeo.dispose();
      shadowGeo.dispose();
      shadowTexture.dispose();
      parcelBox.geometry.dispose();
      phoneBody.geometry.dispose();
      phoneScreen.geometry.dispose();
      audioBox.geometry.dispose();
      badgeRing.geometry.dispose();
      badgeGem.geometry.dispose();

      chromeMat.dispose();
      wireMat.dispose();
      brandBlueMat.dispose();
      rubberMat.dispose();
      packageKraftMat.dispose();
      packageTapeMat.dispose();
      gadgetMat.dispose();
      screenMat.dispose();
      shadowMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center select-none">
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate the SmartCart 3D model 360°"
      />
      
      {/* 3D Model Spec Badges */}
      <div className="absolute top-3 right-3 pointer-events-none hidden sm:flex items-center gap-2">
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/70 dark:bg-black/40 text-blue-600 dark:text-blue-400 border border-blue-500/20 backdrop-blur-xs">
          SMARTCART · LOADED
        </span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none">
        <span className={`text-[10px] font-mono px-2 py-1 rounded-md border transition-colors ${
          isInteracting
            ? 'bg-blue-600/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
            : 'bg-white/80 dark:bg-black/50 text-slate-700 dark:text-white/50 border-slate-200 dark:border-white/10 backdrop-blur-xs'
        }`}>
          {isInteracting ? 'ROTATING MODEL' : 'DRAG TO ROTATE 360°'}
        </span>
      </div>
    </div>
  );
};

export default Hero3DVisual;
