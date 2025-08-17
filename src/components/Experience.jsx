import { Environment, OrbitControls, Html } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Experience = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [triggerGreeting, setTriggerGreeting] = useState(false);
  const [messages, setMessages] = useState([]); // Array of { type: 'user' | 'ai', text: string }
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onstart = () => setListening(true);
    recognition.onspeechstart = () => {};
    recognition.onspeechend = () => {};

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setListening(false);

      // Add user message immediately
      setMessages((prev) => [...prev, { type: "user", text: transcript }]);
      scrollToBottom();

      // Add placeholder for AI response
      const waitMessage = { type: "ai", text: "Please wait a moment..." };
      setMessages((prev) => [...prev, waitMessage]);
      scrollToBottom();

      try {
        const res = await fetch("http://localhost:3000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: transcript }),
        });

        if (!res.ok) throw new Error(`Backend returned ${res.status}`);
        const data = await res.json();

        // Update the placeholder message with real response
        setMessages((prev) =>
          prev.map((msg) =>
            msg === waitMessage ? { type: "ai", text: data.text } : msg
          )
        );
        scrollToBottom();

        // Delay speech recognition restart by 1.5s
        if (data.audioBase64) {
          const audioBlob = new Blob(
            [Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
            { type: "audio/wav" }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
          audio.onended = () => {
            speechTimeoutRef.current = setTimeout(() => {
              recognition.start();
              setListening(true);
            }, 1500);
          };
        } else {
          speechTimeoutRef.current = setTimeout(() => {
            recognition.start();
            setListening(true);
          }, 1500);
        }
      } catch (err) {
        console.error("Backend error:", err);
        // Remove placeholder if error
        setMessages((prev) => prev.filter((msg) => msg !== waitMessage));
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => {
      // Stop recognition completely; will restart manually
      setListening(false);
    };

    return recognition;
  };

  const handleChatClick = () => {
    setChatStarted(true);
    setTriggerGreeting(true);
    setTimeout(() => setTriggerGreeting(false), 100);

    if (!recognitionRef.current) recognitionRef.current = initRecognition();
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const handleBackClick = () => {
    setChatStarted(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
  };

  return (
    <>
      <OrbitControls />
      <Avatar position={[1, -3, 5]} scale={2} triggerGreeting={triggerGreeting} />

      <Html
        position={[-2.75, 1, 0]}
        transform
        occlude
        style={{ pointerEvents: "auto", userSelect: "none" }}
      >
        <motion.div
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-black/80 backdrop-blur-md border border-blue-500/20 rounded-md p-2 max-w-48 shadow-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!chatStarted ? (
              <motion.div key="intro" layout>
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
            ) : (
              <motion.div key="chatting" layout className="flex flex-col gap-2 max-h-64 overflow-y-auto" ref={chatContainerRef}>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`text-xs p-2 rounded-lg shadow-md ${
                      msg.type === "user"
                        ? "bg-blue-600/70 text-white self-end"
                        : "bg-purple-700/70 text-white self-start"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}

                {listening && (
                  <div className="flex items-center gap-2 text-red-400 text-xs font-semibold">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    Listening...
                  </div>
                )}

                <button
                  onClick={handleBackClick}
                  className="w-20 h-5 flex items-center justify-center 
                    bg-gradient-to-r from-blue-500 to-purple-600 
                    hover:from-blue-600 hover:to-purple-700 
                    text-white font-medium rounded-md 
                    transition-all duration-300 transform hover:scale-105 text-xs"
                >
                  ⬅ Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Html>

      <Environment preset="sunset" />
    </>
  );
};
