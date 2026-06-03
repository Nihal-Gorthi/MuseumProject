import * as THREE from "three";

export function createBenches(scene) {
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x4a2f1b, // rich dark walnut wood
    roughness: 0.35,
    metalness: 0.05,
  });

  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x1f1f1f, // high-end charcoal leather
    roughness: 0.4,
    metalness: 0.1,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x2e2e2e, // burnished dark steel legs
    roughness: 0.3,
    metalness: 0.8,
  });

  function buildBench(x, z, ry) {
    const group = new THREE.Group();
    group.position.set(x, -3, z); // Floor level is at y = -3
    group.rotation.y = ry;

    // 1. Seating Cushion (leather box with rounded feel)
    const cushion = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.45, 1.8),
      cushionMat
    );
    cushion.position.set(0, 0.8, 0);
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    group.add(cushion);

    // 2. Bench Support Base (walnut wood plate)
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(4.9, 0.08, 1.9),
      woodMat
    );
    base.position.set(0, 0.55, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // 3. Four Burnished Steel Legs
    const legH = 0.55;
    const legW = 0.12;
    const legXOffset = 2.1;
    const legZOffset = 0.7;

    const legPositions = [
      [-legXOffset, legH / 2, -legZOffset],
      [legXOffset, legH / 2, -legZOffset],
      [-legXOffset, legH / 2, legZOffset],
      [legXOffset, legH / 2, legZOffset]
    ];

    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(legW, legH, legW),
        steelMat
      );
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      leg.receiveShadow = true;
      group.add(leg);
    });

    // 4. Horizontal bracing steel bar (connecting the legs underneath)
    const brace = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.04, 0.04),
      steelMat
    );
    brace.position.set(0, 0.15, 0);
    brace.castShadow = true;
    group.add(brace);

    scene.add(group);
  }

  // Place two central benches spaced along the room's main axis
  buildBench(0, 5, 0);
  buildBench(0, -5, 0);
}
