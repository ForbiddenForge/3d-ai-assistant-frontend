import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { Perf } from "r3f-perf";
import { useState, useRef } from "react";

function App() {
  const [messagePlaying, setMessagePlaying] = useState(false);
  const audioRef = useRef(new Audio());

  return (
    <>
      <Loader />
      <Leva hidden/>
      <UI messagePlaying={messagePlaying} setMessagePlaying={setMessagePlaying} audioRef={audioRef} />
      <Canvas shadows camera={{ position: [0, 0.5, 1], fov: 30 }}>
        {/* <Perf  /> */}
        <Experience messagePlaying={messagePlaying} setMessagePlaying={setMessagePlaying} audioRef={audioRef}/>
      </Canvas>
    </>
  );
}

export default App;
