"use client";

import Particles from "@/components/magicui/Backgrounds/Particles/Particles";

export default function BackgroundLightRays() {
	return (
		<div className='fixed inset-0 -z-10'>
			<Particles
				className='w-full h-full'
				particleCount={150}
				particleSpread={12}
				speed={0.2}
				particleColors={["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"]}
				moveParticlesOnHover={true}
				particleHoverFactor={1}
				alphaParticles={true}
				particleBaseSize={200}
				sizeRandomness={1.5}
				cameraDistance={20}
				disableRotation={false}
			/>
		</div>
	);
}
