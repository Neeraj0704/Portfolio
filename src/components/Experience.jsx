import { Environment, OrbitControls, Html } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Experience = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [triggerGreeting, setTriggerGreeting] = useState(false);

  const handleChatClick = () => {
    setChatStarted(true);
    setTriggerGreeting(true); // Trigger greeting animation
    // Reset the trigger after a short delay so it can be triggered again
    setTimeout(() => setTriggerGreeting(false), 100);
  };

  return (
    <>
      <OrbitControls />
      <Avatar position={[1, -3, 5]} scale={2} triggerGreeting={triggerGreeting} />

      <Html
        position={[-2.75, 1, 0]}
        transform
        occlude
        style={{
          pointerEvents: "auto",
          userSelect: "none",
        }}
      >
        <motion.div
          layout
          initial={{ opacity: 0, y: 10, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-black/80 backdrop-blur-md border border-blue-500/20 rounded-md p-2 max-w-48 shadow-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!chatStarted ? (
              <motion.div
                key="intro"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="text-white text-xs mb-2 leading-relaxed">
                    <span className="text-blue-400 font-semibold">
                      Hi, I'm Neeraj's AI clone.
                    </span>
                    <br />
                    Feel free to explore the site or talk with me about Neeraj's work and projects.
                  </div>
                  <button
                    onClick={handleChatClick}
                    className="w-full h-10 flex items-center justify-center 
                      bg-gradient-to-r from-blue-500 to-purple-600 
                      hover:from-blue-600 hover:to-purple-700 
                      text-white font-medium rounded-md 
                      transition-all duration-300 transform hover:scale-105 text-xs"
                  >
                    Let's Talk! 🚀
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="greeting"
                layout
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.68, -0.55, 0.27, 1.55] }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold"
                    >
                      AI
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="text-white text-xs bg-gradient-to-br from-blue-600/70 to-purple-700/70 p-2 rounded-lg shadow-md"
                    >
                      Hey there! 👋 Great to see you.
                      <br />
                      What would you like to know about me?
                      Feel free to ask me anything about my work!
                    </motion.div>
                  </div>
                  <button
                    onClick={() => setChatStarted(false)}
                    className="w-full text-xs text-blue-400 hover:underline"
                  >
                    ⬅ Back
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Html>

      <Environment preset="sunset" />
    </>
  );
};
