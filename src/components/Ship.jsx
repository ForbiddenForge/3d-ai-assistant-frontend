import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function Ship(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/ship.glb')
  const { actions, mixer } = useAnimations(animations, group)
  
  useEffect(() => {
    if (actions && actions["Background Rotate"]) {
      const action = actions["Background Rotate"]
      action.reset()
        .fadeIn(mixer._actions.length === 0 ? 0 : 0.5)
        .play();
      action.timeScale = 5;
    }
  }, [actions, mixer]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.751}>
          <group name="Sci-Fi_Hangerfbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="Background"
                  rotation={[-Math.PI / 2, 0, -1.658]}
                  scale={[2953.785, 2983.622, 596.724]}>
                  <mesh
                    name="Background_Backdrop_0"
                    castShadow
                    receiveShadow
                    geometry={nodes.Background_Backdrop_0.geometry}
                    material={materials.Backdrop}
                  />
                </group>
                <group
                  name="Illumination"
                  position={[0, 255.315, 0]}
                  rotation={[1.902, 0, Math.PI]}
                  scale={100}>
                  <group name="Object_15" rotation={[Math.PI / 2, 0, 0]}>
                    <group name="Object_16" />
                  </group>
                </group>
                <group name="Sci-Fi_Hanger" rotation={[-Math.PI / 2, 0, -Math.PI]} scale={100}>
                  <mesh
                    name="Sci-Fi_Hanger_Chrome_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Sci-Fi_Hanger_Chrome_0'].geometry}
                    material={materials.Chrome}
                  />
                  <mesh
                    name="Sci-Fi_Hanger_Doors_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Sci-Fi_Hanger_Doors_0'].geometry}
                    material={materials.Doors}
                  />
                  <mesh
                    name="Sci-Fi_Hanger_Floor_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Sci-Fi_Hanger_Floor_0'].geometry}
                    material={materials.Floor}
                  />
                  <mesh
                    name="Sci-Fi_Hanger_LightGlassCover_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Sci-Fi_Hanger_LightGlassCover_0'].geometry}
                    material={materials.LightGlassCover}
                  />
                  <mesh
                    name="Sci-Fi_Hanger_Lights_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Sci-Fi_Hanger_Lights_0'].geometry}
                    material={materials.Lights}
                  />
                  <mesh
                    name="Sci-Fi_Hanger_Walls_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Sci-Fi_Hanger_Walls_0'].geometry}
                    material={materials.Walls}
                  />
                  <mesh
                    name="Sci-Fi_Hanger_Window_0"
                    castShadow
                    receiveShadow
                    geometry={nodes['Sci-Fi_Hanger_Window_0'].geometry}
                    material={materials.Window}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/ship.glb')
