import { useGLTF, useFBX } from "@react-three/drei";
import { useEffect, useState } from "react";

// 🚀 Optimized preloading - prioritize critical assets
export function preloadAvatarAssets() {
  // Preload GLB model first (most important)
  useGLTF.preload("/68994a8568086dd7c6759d42.glb");
  
  // Preload critical Idle animation first
  useFBX.preload("Animations/Idle (1).fbx");
  
  // Preload other animations with slight delay to prioritize initial render
  setTimeout(() => {
    useFBX.preload("Animations/Talking_newest.fbx"); // Most used
    useFBX.preload("Animations/Standing Greeting.fbx");
    useFBX.preload("Animations/Salute.fbx");
    useFBX.preload("Animations/Head Nod Yes.fbx");
  }, 100); // Small delay to let Idle load first
}

// Hook to check if assets are loaded
export function useAvatarAssetsReady() {
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    // Preload assets
    preloadAvatarAssets();
    
    // Give a small delay to allow preloading to start
    const timer = setTimeout(() => {
      setReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return ready;
}

