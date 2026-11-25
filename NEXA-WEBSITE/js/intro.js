
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// =====================================
// NEXA — 3D INFINITY INTRODUCTION
// =====================================

const intro = document.getElementById("nexa-intro");
const canvas = document.getElementById("intro-canvas");
const skipButton = document.getElementById("skip-intro");

if (intro && canvas && skipButton) {

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#102D50");

    // Camera
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Infinity curve
    const points = [];

    for (let i = 0; i <= 400; i++) {

        const t = (i / 400) * Math.PI * 2;

        const denominator = 1 + Math.sin(t) * Math.sin(t);

        const x = 2.2 * Math.cos(t) / denominator;
        const y = 2.2 * Math.sin(t) * Math.cos(t) / denominator;
        const z = 0.25 * Math.sin(t * 2);

        points.push(new THREE.Vector3(x, y, z));
    }

    const infinityCurve = new THREE.CatmullRomCurve3(
        points,
        true
    );

    // 3D tube geometry
    const infinityGeometry = new THREE.TubeGeometry(
        infinityCurve,
        400,
        0.105,
        16,
        true
    );

    // Metallic burgundy material
    const infinityMaterial = new THREE.MeshPhysicalMaterial({
        color: "#800020",
        metalness: 0.85,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        emissive: "#390010",
        emissiveIntensity: 0.7
    });

    const infinity = new THREE.Mesh(
        infinityGeometry,
        infinityMaterial
    );

    scene.add(infinity);
    infinity.scale.setScalar(0.65);

    // Lighting
    const ambientLight = new THREE.AmbientLight(
        "#FFFFFF",
        1.2
    );

    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(
        "#62C9FF",
        35,
        20
    );

    blueLight.position.set(-3, 3, 4);
    scene.add(blueLight);

    const burgundyLight = new THREE.PointLight(
        "#B51F42",
        30,
        20
    );

    burgundyLight.position.set(3, -2, 3);
    scene.add(burgundyLight);

    const whiteLight = new THREE.PointLight(
        "#FFFFFF",
        20,
        15
    );

    whiteLight.position.set(0, 4, -2);
    scene.add(whiteLight);

    // Animation
    const clock = new THREE.Clock();

    function animate() {

        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        infinity.rotation.y = Math.sin(elapsed * 0.5) * 0.35;
        infinity.rotation.x = Math.cos(elapsed * 0.4) * 0.18;
        infinity.rotation.z = elapsed * 0.12;

        renderer.render(scene, camera);
    }

    animate();

    // Responsive resizing
    window.addEventListener("resize", () => {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );
    });

    // Intro controls
    function closeIntro() {

        intro.classList.add("intro-hidden");

        sessionStorage.setItem("nexaIntroSeen", "true");

        setTimeout(() => {
            intro.style.display = "none";
        }, 1000);
    }

    skipButton.addEventListener("click", closeIntro);

    if (sessionStorage.getItem("nexaIntroSeen") === "true") {

        intro.style.display = "none";

    } else {

        setTimeout(closeIntro, 5000);

    }
}
