import { Environment, OrbitControls, Html } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useState } from "react";

export const Experience = () => {
  const [showPanel, setShowPanel] = useState(true);

  const handleChatClick = () => {
    setShowPanel(false);
    // This is where you'll add your chat functionality later
  };

  return (
    <>
      <OrbitControls />
      <Avatar position={[1, -3, 5]} scale={2} />
      
      {showPanel && (
        <Html
          position={[-3, 1, 0]}
          transform
          occlude
          style={{
            pointerEvents: 'auto',
            userSelect: 'none'
          }}
        >
          <div className="bg-black/80 backdrop-blur-md border border-blue-500/20 rounded-md p-1.5 max-w-48 shadow-2xl">
            <div className="text-white text-xs mb-2 leading-relaxed">
              <span className="text-blue-400 font-semibold">Hi, I'm Neeraj's AI clone.</span>
              <br />
              Feel free to explore the site or just chat with me about my work and projects.
            </div>
            <button
              onClick={handleChatClick}
              className="w-full h-10 flex items-center justify-center 
             bg-gradient-to-r from-blue-500 to-purple-600 
             hover:from-blue-600 hover:to-purple-700 
             text-white font-medium rounded-md 
             transition-all duration-300 transform hover:scale-105 text-xs"
            >
              Let's Chat! 🚀
            </button>
          </div>
        </Html>
      )}
      
      <Environment preset="sunset" />
    </>
  );
};