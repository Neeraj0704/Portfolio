import React, { useRef, useEffect, useState } from "react";
import { useGLTF, useFBX, useAnimations } from "@react-three/drei";
import { useGraph } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

function AvatarComponent(props) {
  const { scene } = useGLTF("/68994a8568086dd7c6759d42.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  // Load animations
  const { animations: idleAnimation } = useFBX("Animations/Idle (1).fbx");
  const { animations: greetAnimation } = useFBX("Animations/Standing Greeting.fbx");
  const { animations: talkAnimation } = useFBX("Animations/Talking_newest.fbx");
  const { animations: saluteAnimation } = useFBX("Animations/Salute.fbx");
  const { animations: headnodAnimation } = useFBX("Animations/Head Nod Yes.fbx");

  // Name animations
  idleAnimation[0].name = "Idle";
  greetAnimation[0].name = "Greet";
  talkAnimation[0].name = "Talk";
  saluteAnimation[0].name = "Salute";
  headnodAnimation[0].name = "Headnod";

  const group = useRef();
  const { actions } = useAnimations(
    [idleAnimation[0], greetAnimation[0], talkAnimation[0], saluteAnimation[0], headnodAnimation[0]],
    group
  );

  // Ensure Idle loops
  useEffect(() => {
    actions["Idle"].setLoop(THREE.LoopRepeat, Infinity);
  }, [actions]);

  const currentAction = useRef(); // Tracks currently playing action

  // Animation handler
  useEffect(() => {
    let nextAnim = "Idle";
    if (props.triggerSalute) nextAnim = "Salute";
    else if (props.triggerGreeting) nextAnim = "Greet";
    else if (props.triggerTalking) nextAnim = "Talk";

    if (currentAction.current !== actions[nextAnim]) {
      if (currentAction.current) {
        currentAction.current.fadeOut(0.2);
      }
      currentAction.current = actions[nextAnim];
      currentAction.current.reset().fadeIn(0.2).play();
    }
  }, [props.triggerGreeting, props.triggerTalking, props.triggerSalute, actions]);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="Wolf3D_Avatar"
        geometry={nodes.Wolf3D_Avatar.geometry}
        material={materials.Wolf3D_Avatar}
        skeleton={nodes.Wolf3D_Avatar.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Avatar.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Avatar.morphTargetInfluences}
      />
    </group>
  );
}

// Memoize to prevent unnecessary re-renders
export const Avatar = React.memo(
  AvatarComponent,
  (prev, next) =>
    prev.triggerGreeting === next.triggerGreeting &&
    prev.triggerTalking === next.triggerTalking &&
    prev.triggerSalute === next.triggerSalute
);

useGLTF.preload("/68994a8568086dd7c6759d42.glb");
