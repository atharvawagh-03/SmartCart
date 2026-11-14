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

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x3b82f6, 3.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x60a5fa, 2.0);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xffffff, 4.0, 15);
    rimLight.position.set(0, 4, 3);
    scene.add(rimLight);

    // ── 3D Sculptural SmartCart Centerpiece ──
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Core Cart Basket Geometry (Precision wireframe & translucent shell)
    const cartGroup = new THREE.Group();
    rootGroup.add(cartGroup);

    // Outer wire basket
    const basketGeo = new THREE.BoxGeometry(2.4, 1.8, 1.8);
    const wireGeo = new THREE.WireframeGeometry(basketGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.85,
      linewidth: 1.5,
    });
    const wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
    cartGroup.add(wireframeMesh);

    // Inner translucent faceted crystal core
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x1d4ed8,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    cartGroup.add(coreMesh);

    // Sculptural Wheels / Orbiting nodes
    const wheelGeo = new THREE.TorusGeometry(0.3, 0.08, 16, 32);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2,
    });

    const wheelPositions = [
      [-1.1, -1.2, 0.9],
      [1.1, -1.2, 0.9],
      [-1.1, -1.2, -0.9],
      [1.1, -1.2, -0.9],
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(...pos);
      wheel.rotation.y = Math.PI / 2;
      cartGroup.add(wheel);
    });

    // Sculptural Handle
    const handleCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-1.2, 1.1, -0.9),
      new THREE.Vector3(-1.6, 1.3, -0.5),
      new THREE.Vector3(-1.6, 1.3, 0.5),
      new THREE.Vector3(-1.2, 1.1, 0.9)
    );
    const handleGeo = new THREE.TubeGeometry(handleCurve, 20, 0.06, 8, false);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      metalness: 0.8,
      roughness: 0.2,
    });
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    cartGroup.add(handleMesh);

    // Orbital Gyro Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      metalness: 0.9,
      roughness: 0.3,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    rootGroup.add(ring1);

    // Orbital Gyro Ring 2
    const ring2Geo = new THREE.TorusGeometry(2.6, 0.015, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.8,
      roughness: 0.4,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    rootGroup.add(ring2);

    // Precision Floating Particles
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── Mouse Interactivity & Smoothing ──
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
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
        targetX += deltaX * 0.01;
        targetY += deltaY * 0.01;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      } else {
        mouseX = x * 0.4;
        mouseY = y * 0.3;
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

    // ── Render Loop ──
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera / group rotation with dampening
      if (!isDragging) {
        targetX += 0.005; // Gentle constant float rotation
      }

      rootGroup.rotation.y += (targetX + mouseX - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetY - mouseY - rootGroup.rotation.x) * 0.05;

      // Subtle breathing float on cart
      cartGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Orbit the gyro rings
      ring1.rotation.z += 0.008;
      ring2.rotation.x -= 0.006;
      coreMesh.rotation.y += 0.015;

      // Ambient particle slow drift
      particles.rotation.y = elapsedTime * 0.02;

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

      // Dispose resources
      wireGeo.dispose();
      basketGeo.dispose();
      wireMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      wheelGeo.dispose();
      wheelMat.dispose();
      handleGeo.dispose();
      handleMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center select-none">
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate 3D centerpiece"
      />
      
      {/* 3D Interaction Badge */}
      <div className="absolute bottom-3 right-3 pointer-events-none">
        <span className={`text-[10px] font-mono px-2 py-1 rounded-md border transition-colors ${
          isInteracting
            ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
            : 'bg-black/40 text-white/40 border-white/10 backdrop-blur-xs'
        }`}>
          {isInteracting ? 'ACTIVE ROTATION' : 'DRAG TO ROTATE 360°'}
        </span>
      </div>
    </div>
  );
};

export default Hero3DVisual;
