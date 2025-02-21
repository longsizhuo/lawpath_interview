"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const ThreeBackground: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

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

        const models: THREE.Object3D[] = [];

        // Load 3D model
        const fbxLoader = new FBXLoader();
        fbxLoader.load(
            '/models/PCB.fbx',
            (object: THREE.Object3D<THREE.Object3DEventMap>) => {
                object.position.set(0, -3, 0);
                object.scale.set(0.03, 0.03, 0.03);
                object.rotation.x = -Math.PI / 2; // 绕X轴旋转90度
                models.push(object);
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

        // 加载GLB模型
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            '/models/smaller_cat.glb',
            (gltf) => {
                const object = gltf.scene;
                object.position.set(0, 2, 0);
                object.scale.set(0.05, 0.05, 0.05);
                object.rotation.x = -Math.PI / 2;
                models.push(object);
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
            requestAnimationFrame(animate);
            const time = Date.now() * 0.001;
            models.forEach((model) => {
                if (time % 4 < 2) {
                    model.rotation.z += 0.01;
                } else {
                    model.rotation.z = 0;
                }
            });
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
        />
    );
};

export default ThreeBackground;
