"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Button } from "@/components/ui/button";


const ThreeBackground: React.FC = () => {
    // Add a pause button
    const mountRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = React.useState(false);
    useEffect(() => {
        if (!mountRef.current) return;

        const currentMount = mountRef.current;

        // create a scene, that will hold all our elements such as objects, cameras and lights.
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add point light
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        let fontModel = new THREE.Object3D() as THREE.Object3D<THREE.Object3DEventMap> ;

        // Load 3D model
        const fbxLoader = new FBXLoader();
        fbxLoader.load(
            '/models/PCB.fbx',
            (object: THREE.Object3D<THREE.Object3DEventMap>) => {
                object.position.set(0, 2, 0);
                object.scale.set(0.03, 0.03, 0.03);
                object.rotation.x = -Math.PI / 2; // 绕X轴旋转90度
                fontModel = object;
                scene.add(object);
            },
            (xhr: { loaded: number; total: number; }) => {
                // Model is loading
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                // Error happened
                console.error('An error happened', error);
            }
        );

        let catModel = new THREE.Object3D() as THREE.Object3D<THREE.Object3DEventMap> ;

        // Load GLT 3D model
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            '/models/smaller_cat.glb',
            (gltf) => {
                const object = gltf.scene;
                object.position.set(0, -3, 0);
                object.scale.set(5, 5, 5);
                catModel = object;
                scene.add(object);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% Cat loaded');
            },
            (error) => {
                console.error('An error happened', error);
            }
        );

        // Add animation
        const animate = () => {
            if (isPaused) return;
            requestAnimationFrame(animate);
            const time = Date.now() * 0.001;
            const delta = 0.5;
            if (time % 4 < 2) {
                fontModel.rotation.z += delta;
                catModel.rotation.y += delta;
            } else {
                fontModel.rotation.z = 0;
                catModel.rotation.y = 0;
            }
            renderer.render(scene, camera);
        };
        animate();

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
        };
    }, [isPaused]);

    useEffect(() => {
        
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
            }}
        >
            <Button
                variant="outline"
                size="lg"
                className="absolute top-6 right-6 z-50 bg-white/90 text-black shadow-lg hover:bg-white hover:scale-105 transition-all border border-gray-300 px-6 py-3 rounded-full"
                onClick={() => setIsPaused(!isPaused)}
            >
                {isPaused ? '▶ Resume Animation' : '⏸ Pause Animation'}
            </Button>



        </div>
    );
};

export default ThreeBackground;
