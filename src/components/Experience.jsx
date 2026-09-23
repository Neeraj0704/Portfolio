import { Environment, OrbitControls, Html } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Send, MessageCircle, X } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { decodeSpeechEnvelope } from "../lib/lip-sync";

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
  const speechPlaybackRef = useRef(null);
  const requestControllerRef = useRef(null);
  const inputModeRef = useRef(inputMode);
  const isMobile = useMediaQuery({ maxWidth: 1023 });

  const stopResponseAudio = useCallback(() => {
    speechPlaybackRef.current = null;
    const audio = currentAudioRef.current;
    currentAudioRef.current = null;
    if (audio) {
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      URL.revokeObjectURL(audio.src);
    }
  }, []);

  useEffect(() => {
    inputModeRef.current = inputMode;
  }, [inputMode]);

  useEffect(() => () => {
    requestControllerRef.current?.abort();
    recognitionRef.current?.abort();
    clearTimeout(speechTimeoutRef.current);
    stopResponseAudio();
  }, [stopResponseAudio]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const timer = setTimeout(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }, 500);
    return () => clearTimeout(timer);
  }, [messages, chatStarted]);

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
    if (!input.trim() || requestControllerRef.current) return;
    const controller = new AbortController();
    let timedOut = false;
    let receivedReply = false;
    const requestTimer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 40_000);
    requestControllerRef.current = controller;
    setIsTyping(true);
    stopResponseAudio();
    setTriggerTalking(false);
    setIsPlaying(false);

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
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(response.status === 503
        ? "The AI service is busy right now. Please try again shortly."
        : "Sorry, I couldn't get a response. Please try again.");

      const data = await response.json();
      clearTimeout(requestTimer);
      if (controller.signal.aborted) return;
      receivedReply = true;
      const replyText = data.text || "Sorry, I couldn't get a response.";

      setMessages((prev) => [
        ...prev.filter((msg) => msg !== waitMessage),
        { type: "ai", text: replyText },
      ]);

      if (data.audioBase64) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
          { type: data.audioMimeType || "audio/mpeg" }
        );
        let envelope = null;
        try {
          envelope = await decodeSpeechEnvelope(await audioBlob.arrayBuffer());
        } catch (error) {
          console.warn("Could not analyze speech audio:", error);
        }
        if (controller.signal.aborted) return;
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        speechPlaybackRef.current = { audio, envelope };

        audio.onended = () => {
          stopResponseAudio();
          setTriggerTalking(false);
          setIsPlaying(false);

          if (inputModeRef.current === "voice") {
            if (speechTimeoutRef.current)
              clearTimeout(speechTimeoutRef.current);
            speechTimeoutRef.current = setTimeout(() => {
              if (inputModeRef.current === "voice") startVoiceRecognition();
            }, 500);
          }
        };
        audio.onerror = () => {
          stopResponseAudio();
          setTriggerTalking(false);
          setIsPlaying(false);
        };
        await audio.play();
        if (controller.signal.aborted) return;
        setTriggerTalking(true);
        setIsPlaying(true);
      } else {
        setTriggerTalking(false);
        setIsPlaying(false);
      }
    } catch (err) {
      if (controller.signal.aborted && !timedOut) return;
      stopResponseAudio();
      console.error("Backend error:", err);
      if (!receivedReply) setMessages((prev) => [
        ...prev.filter((msg) => msg !== waitMessage),
        {
          type: "ai",
          text: timedOut
            ? "The response took too long. Please try again shortly."
            : err.message || "Sorry, I couldn't get a response. Please try again.",
        },
      ]);
      setTriggerTalking(false);
      setIsPlaying(false);
    } finally {
      clearTimeout(requestTimer);
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
        setIsTyping(false);
      }
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
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    inputModeRef.current = "text";
    setIsTyping(false);
    setChatStarted(false);
    setMessages([]);
    setInputMode("text");
    setTextInput("");
    setShowPrompts(true);
    setShowVoiceSuggestions(true);
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    stopResponseAudio();
    setTriggerTalking(false);
    setIsPlaying(false);
  };

  return (
    <>
      {!chatStarted && (
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      )}

        <Avatar
          position={isMobile ? [0, 0, 4] : [0.95, -2.5, 4]}
          scale={isMobile ? 1.5 : 2}
          triggerTalking={triggerTalking}
          triggerSalute={triggerSalute}
          isTyping={isTyping}
          speechPlaybackRef={speechPlaybackRef}
        />

      {/* 🚀 Use lighter environment for faster loading */}
      <Environment preset="sunset" />

      <Html
        fullscreen
        transform={false}
        occlude={false}
        zIndexRange={[10, 0]}
        className="chat-panel-html"
        style={{ pointerEvents: "none" }}
      >
        <div className="absolute inset-x-0 bottom-0 pointer-events-auto lg:inset-x-auto lg:left-0 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2">
        <AnimatePresence>
          {!chatStarted ? (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="glass-morphism p-4 text-center w-full max-w-sm h-64 lg:w-72 lg:h-80 mx-auto">
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
              className="glass-morphism p-2 sm:p-4 text-center w-full max-w-sm h-[300px] lg:w-80 lg:h-[400px] mx-auto flex flex-col"
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
                  aria-label="Close chat"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 sm:w-5 h-4 sm:h-5" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={chatContainerRef}
                className="min-h-0 flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 sm:space-y-3 text-xs sm:text-sm"
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
              {/* Input Area */}
<div className="p-1 sm:p-4 border-t border-gray-700 flex flex-col space-y-2 sm:space-y-3">
  {/* Initial Prompts */}
  {showPrompts && inputMode === "text" && (
    <div className="flex flex-col items-center space-y-1 text-xs sm:text-sm text-gray-300">
      <span>💡 Suggested things to type:</span>
      <span>"Share Neeraj's experience"</span>
      <span>"Tell me about Neeraj's projects"</span>
      <span>"What are Neeraj's skills?"</span>
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
                      className="min-w-0 flex-1 bg-gray-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded border border-gray-600 focus:border-primary focus:outline-none text-xs sm:text-sm"
                      disabled={isPlaying || isTyping}
                    />
                    <button
                      type="submit"
                      aria-label="Send message"
                      disabled={!textInput.trim() || isPlaying || isTyping}
                      className="bg-primary hover:bg-primary/80 disabled:bg-gray-600 text-white p-1 sm:p-2 rounded transition-colors"
                    >
                      <Send className="w-3 sm:w-4 h-3 sm:h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <button
                      onClick={startVoiceRecognition}
                      aria-label="Start voice input"
                      disabled={listening || isPlaying || isTyping}
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
        </div>
      </Html>
    </>
  );
};
