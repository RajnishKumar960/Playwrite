"use client"

import { Canvas } from "@react-three/fiber"
import { ShaderPlane, EnergyRing } from "@/components/ui/background-paper-shaders"
import { useRef } from "react"
import * as THREE from "three"

export function DashboardBackground() {
    return (
        <div className="fixed inset-0 z-[-1] bg-black">
            <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.5} />
                {/* Main background shader */}
                <ShaderPlane position={[0, 0, 0]} color1="#000000" color2="#ff3b3b" />

                {/* Floating energy rings for depth */}
                <EnergyRing radius={2} position={[-1, -1, -1]} />
                <EnergyRing radius={1.5} position={[1.5, 1, -0.5]} />
            </Canvas>

            {/* Overlay gradient for UI readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/80 pointer-events-none" />
        </div>
    )
}
