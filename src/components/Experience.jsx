import { Environment, OrbitControls, Html } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, MessageCircle, X } from "lucide-react";
import { useMediaQuery } from "react-responsive";

export const Experience = () => {
  const [chatStarted, setChatStarted] = useState(false);
  const [triggerTalking, setTriggerTalking] = useState(false);
  const [triggerSalute, setTriggerSalute] = useState(false);
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [inputMode, setInputMode] = useState("text"); // "text" or "voice"
  const [textInput, setTextInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [showVoiceSuggestions, setShowVoiceSuggestions] = useState(true);
  const recognitionRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const chatContainerRef = useRef(null);
  const currentAudioRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 500);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;
      setListening(false);

      // hide voice suggestions only after first input
      if (showVoiceSuggestions) setShowVoiceSuggestions(false);

      await handleUserInput(transcript);
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    return recognition;
  };

  const handleUserInput = async (input) => {
    if (!input.trim()) return;

    // hide text prompts only after first input
    if (inputMode === "text" && showPrompts) setShowPrompts(false);

    setMessages((prev) => [...prev, { type: "user", text: input }]);

    const waitMessage = { type: "ai", text: "Thinking..." };
    setMessages((prev) => [...prev, waitMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      const replyText = data.text || "Sorry, I couldn't get a response.";

      setMessages((prev) => [
        ...prev.filter((msg) => msg !== waitMessage),
        { type: "ai", text: replyText },
      ]);

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        URL.revokeObjectURL(currentAudioRef.current.src);
        currentAudioRef.current = null;
      }

      if (data.audioBase64) {
        setTriggerTalking(true);
        setIsPlaying(true);

        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
          { type: "audio/wav" }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;

        audio.play();
        audio.onended = () => {
          setTriggerTalking(false);
          setIsPlaying(false);

          if (inputMode === "voice" && !listening) {
            if (speechTimeoutRef.current)
              clearTimeout(speechTimeoutRef.current);
            speechTimeoutRef.current = setTimeout(() => {
              startVoiceRecognition();
            }, 500);
          }
        };
      } else {
        setTriggerTalking(false);
        setIsPlaying(false);
      }
    } catch (err) {
      console.error("Backend error:", err);
      setMessages((prev) => [
        ...prev.filter((msg) => msg !== waitMessage),
        {
          type: "ai",
          text: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setTriggerTalking(false);
      setIsPlaying(false);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserInput(textInput);
      setTextInput("");
    }
  };

  const startVoiceRecognition = () => {
    if (!recognitionRef.current) recognitionRef.current = initRecognition();
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const handleChatClick = () => {
    setChatStarted(true);
  };

  const handleBackClick = () => {
    setChatStarted(false);
    setMessages([]);
    setInputMode("text");
    setTextInput("");
    setShowPrompts(true);
    setShowVoiceSuggestions(true);
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setTriggerTalking(false);
    setIsPlaying(false);
  };

  return (
    <>
      {!chatStarted && (
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      )}

      <Avatar
        position={[1, -3, 5]}
        scale={2}
        triggerTalking={triggerTalking}
        triggerSalute={triggerSalute}
        isTyping={isTyping}
      />

      <Environment preset="sunset" />

      <Html
        position={[-5, 0, 0]}
        transform={false}
        occlude={false}
        style={{
          position: "fixed",
          top: "50%",
          left: "20px",
          transform: "translateY(-50%)",
          zIndex: 10,
          pointerEvents: "auto",
        }}
      >
        <AnimatePresence>
          {!chatStarted ? (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="glass-morphism p-4 text-center w-64 h-64 sm:w-80 sm:h-80 mx-auto">
                <MessageCircle className="w-10 sm:w-12 h-10 sm:h-12 text-primary mx-auto mb-2 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white">
                  Chat with Neeraj's AI
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-4">
                  Ask me about Neeraj's experience, projects, and skills!
                </p>
                <button
                  onClick={handleChatClick}
                  className="bg-primary hover:bg-primary/80 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm"
                >
                  Let's Talk
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-morphism p-2 sm:p-4 text-center w-64 h-64 sm:w-96 sm:h-[400px] mx-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-2 sm:p-4 border-b border-gray-700">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs sm:text-base font-medium">
                    Neeraj's AI Avatar
                  </span>
                </div>
                <button
                  onClick={handleBackClick}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 sm:space-y-3 text-xs sm:text-sm"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-1 sm:p-3 rounded-lg text-xs sm:text-sm ${
                        message.type === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-1 sm:p-4 border-t border-gray-700 flex flex-col space-y-2 sm:space-y-3">
                {/* Initial Prompts */}
                {showPrompts && inputMode === "text" && (
                  <div className="flex flex-col items-center space-y-2">
                    <button
                      onClick={() => handleUserInput("Share Neeraj's experience")}
                      className="px-3 py-1 bg-gray-700 hover:bg-primary text-white text-xs sm:text-sm rounded-full transition-colors"
                    >
                      Share Neeraj's experience
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUserInput("Tell me about Neeraj's projects")}
                        className="px-2 py-1 bg-gray-700 hover:bg-primary text-white text-xs sm:text-sm rounded-full transition-colors"
                      >
                        Tell me about Neeraj's projects
                      </button>
                      <button
                        onClick={() => handleUserInput("What are Neeraj's skills?")}
                        className="px-2 py-1 bg-gray-700 hover:bg-primary text-white text-xs sm:text-sm rounded-full transition-colors"
                      >
                        What are Neeraj's skills?
                      </button>
                    </div>
                  </div>
                )}

                {/* Voice Suggestions */}
                {showVoiceSuggestions && inputMode === "voice" && (
                  <div className="flex flex-col items-center space-y-1 text-xs sm:text-sm text-gray-300">
                    <span>💡 Suggested things to say:</span>
                    <span>"Can you tell about his education?"</span>
                  </div>
                )}

                {/* Mode Toggle */}
                <div className="flex space-x-1 sm:space-x-2">
                  <button
                    onClick={() => {
                      setInputMode("text");
                      if (recognitionRef.current)
                        recognitionRef.current.stop();
                      setListening(false);
                    }}
                    className={`flex-1 py-1 px-2 sm:py-2 sm:px-3 rounded text-xs sm:text-sm transition-colors ${
                      inputMode === "text"
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => {
                      setInputMode("voice");
                    }}
                    className={`flex-1 py-1 px-2 sm:py-2 sm:px-3 rounded text-xs sm:text-sm transition-colors ${
                      inputMode === "voice"
                        ? "bg-primary text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Voice
                  </button>
                </div>

                {/* Input Controls */}
                {inputMode === "text" ? (
                  <form
                    onSubmit={handleTextSubmit}
                    className="flex space-x-1 sm:space-x-2"
                  >
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-gray-600 focus:border-primary focus:outline-none text-xs sm:text-sm"
                      disabled={isPlaying}
                    />
                    <button
                      type="submit"
                      disabled={!textInput.trim() || isPlaying}
                      className="bg-primary hover:bg-primary/80 disabled:bg-gray-600 text-white p-1 sm:p-2 rounded transition-colors"
                    >
                      <Send className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <button
                      onClick={startVoiceRecognition}
                      disabled={listening || isPlaying}
                      className={`p-2 sm:p-3 rounded-full transition-colors ${
                        listening
                          ? "bg-red-500 animate-pulse"
                          : "bg-primary hover:bg-primary/80"
                      } disabled:bg-gray-600 text-white`}
                    >
                      {listening ? (
                        <MicOff className="w-4 sm:w-5 h-4 sm:h-5" />
                      ) : (
                        <Mic className="w-4 sm:w-5 h-4 sm:h-5" />
                      )}
                    </button>
                    <span className="text-xs sm:text-sm text-gray-300">
                      {listening
                        ? "Listening..."
                        : isPlaying
                        ? "Playing response..."
                        : "Click to speak"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Html>
    </>
  );
};
