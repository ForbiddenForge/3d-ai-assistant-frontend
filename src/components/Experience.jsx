import {
  CameraControls,
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat.jsx";
import { Ship } from "./Ship.jsx";
import { Avatar } from "./Avatar.jsx";
import { useMediaQuery } from 'react-responsive';


export const Experience = ({ messagePlaying, setMessagePlaying, audioRef, ...props }) => {
  const cameraControls = useRef();
  const { cameraZoomed } = useChat();
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    cameraControls.current.setLookAt(0, 2, 5, 0, 1, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed) {
      cameraControls.current.setLookAt(0, 1.8, 2.5, 0, 1.5, 0, true);
    } else {
      cameraControls.current.setLookAt(0, 1.2, 5, 0, 1, 0, true);
    }
  }, [cameraZoomed]);

  return (
    <>
      <directionalLight position={[0, 10, 0]} intensity={1} />
      <OrbitControls />
      <CameraControls
        ref={cameraControls}
        maxDistance={5}
        minAzimuthAngle={-Math.PI / 2} // -90 degrees in radians
        maxAzimuthAngle={Math.PI / 2} // 90 degrees in radians
        minPolarAngle={Math.PI / 3} // 60 degrees up in radians
        maxPolarAngle={Math.PI / 1.5} // 60 degrees down in radians
      />

      <Environment preset="sunset" />
      <Suspense fallback={null}>
        <Avatar position-y={isMobile ? 0.21 : 0.2} messagePlaying={messagePlaying} setMessagePlaying={setMessagePlaying} audioRef={audioRef} />
      </Suspense>
      <Ship scale={[0.5, 0.5, 2]} position={[0, 1.8, 15]} />
      <ContactShadows opacity={0.7} />
    </>
  );
};
