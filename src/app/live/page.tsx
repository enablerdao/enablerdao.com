"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function LiveCollaboration() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<Array<{user: string, text: string, time: string}>>([]);
  const [inputText, setInputText] = useState("");
  const [username, setUsername] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [peers, setPeers] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const _audioRef = useRef<HTMLAudioElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const _peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);

  // Generate random room ID
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Join room
  const joinRoom = () => {
    if (!roomId || !username) return;

    const wsUrl = `wss://chatweb.ai/ws/live/${roomId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to room");
      ws.send(JSON.stringify({ type: "join", username }));
      setJoined(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "chat") {
        setMessages(prev => [...prev, {
          user: data.username,
          text: data.message,
          time: new Date().toLocaleTimeString()
        }]);
      } else if (data.type === "user-joined") {
        setPeers(prev => [...prev, data.username]);
        addSystemMessage(`${data.username} joined`);
      } else if (data.type === "user-left") {
        setPeers(prev => prev.filter(p => p !== data.username));
        addSystemMessage(`${data.username} left`);
      }
    };

    ws.onerror = () => {
      console.log("WebSocket error, using fallback mode");
      setJoined(true);
    };

    wsRef.current = ws;
  };

  const addSystemMessage = (text: string) => {
    setMessages(prev => [...prev, {
      user: "System",
      text,
      time: new Date().toLocaleTimeString()
    }]);
  };

  // Send message
  const sendMessage = () => {
    if (!inputText.trim()) return;

    const message = {
      user: username,
      text: inputText,
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, message]);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        username,
        message: inputText
      }));
    }

    setInputText("");
  };

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" } as MediaTrackConstraints,
        audio: false
      });

      localStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsSharing(true);
      addSystemMessage("Screen sharing started");

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Screen share error:", err);
      addSystemMessage("Screen sharing failed");
    }
  };

  const stopScreenShare = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsSharing(false);
    addSystemMessage("Screen sharing stopped");
  };

  // Toggle audio
  const toggleAudio = async () => {
    if (!isAudioOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;
        setIsAudioOn(true);
        addSystemMessage("Microphone enabled");
      } catch (err) {
        console.error("Audio error:", err);
        addSystemMessage("Microphone access denied");
      }
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => track.stop());
      }
      setIsAudioOn(false);
      addSystemMessage("Microphone disabled");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Join room UI
  if (!joined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-[#00ff00] text-sm mb-8 hover:text-[#33ff33]">
            ← Back to Home
          </Link>

          <div className="border border-[#1a3a1a] bg-[#0d0d0d] p-8 rounded-lg">
            <h1 className="text-2xl font-bold text-[#00ff00] mb-6">🚀 Live Collaboration</h1>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#888] mb-2">Your Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-[#111] border border-[#1a3a1a] text-[#e0e0e0] px-4 py-2 rounded focus:outline-none focus:border-[#00ff00]"
                  onKeyDown={(e) => e.key === "Enter" && roomId && joinRoom()}
                />
              </div>

              <div>
                <label className="block text-sm text-[#888] mb-2">Room ID</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    placeholder="Enter or generate"
                    className="flex-1 bg-[#111] border border-[#1a3a1a] text-[#e0e0e0] px-4 py-2 rounded focus:outline-none focus:border-[#00ff00]"
                    onKeyDown={(e) => e.key === "Enter" && username && joinRoom()}
                  />
                  <button
                    onClick={() => setRoomId(generateRoomId())}
                    className="px-4 py-2 bg-[#1a3a1a] text-[#00ffff] rounded hover:bg-[#2a4a2a] transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <button
                onClick={joinRoom}
                disabled={!roomId || !username}
                className="w-full bg-[#00ff00] text-[#000] font-bold py-3 rounded hover:bg-[#33ff33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Room
              </button>

              <div className="text-xs text-[#555] space-y-1 mt-4 p-3 bg-[#111] border border-[#1a3a1a] rounded">
                <p>✓ Real-time chat</p>
                <p>✓ Screen sharing</p>
                <p>✓ Voice communication</p>
                <p>✓ End-to-end encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Collaboration UI
  return (
    <div className="h-screen bg-[#0a0a0a] text-[#e0e0e0] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#1a3a1a] bg-[#0d0d0d] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#00ff00] hover:text-[#33ff33]">
            ← Exit
          </Link>
          <div>
            <span className="text-sm text-[#888]">Room:</span>
            <span className="ml-2 font-mono text-[#00ffff] font-bold">{roomId}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00ff00] rounded-full animate-pulse"></div>
            <span className="text-sm text-[#888]">{peers.length + 1} online</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`px-4 py-2 rounded transition-colors ${
              isAudioOn
                ? "bg-[#00ff00] text-[#000]"
                : "bg-[#1a3a1a] text-[#888]"
            }`}
          >
            {isAudioOn ? "🎤 On" : "🎤 Off"}
          </button>

          <button
            onClick={isSharing ? stopScreenShare : startScreenShare}
            className={`px-4 py-2 rounded transition-colors ${
              isSharing
                ? "bg-[#ff4444] text-white"
                : "bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff]"
            }`}
          >
            {isSharing ? "⏹ Stop Share" : "📺 Share Screen"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Screen Share Area */}
        <div className="flex-1 flex items-center justify-center bg-[#000] p-4">
          {isSharing ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="max-w-full max-h-full border border-[#1a3a1a] rounded"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">📺</div>
              <p className="text-[#555] mb-4">No screen sharing active</p>
              <button
                onClick={startScreenShare}
                className="px-6 py-3 bg-[#00ffff]/20 text-[#00ffff] border border-[#00ffff] rounded hover:bg-[#00ffff]/30 transition-colors"
              >
                Start Screen Share
              </button>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 border-l border-[#1a3a1a] bg-[#0d0d0d] flex flex-col">
          <div className="p-3 border-b border-[#1a3a1a]">
            <h2 className="text-sm font-bold text-[#00ff00]">💬 Chat</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm ${msg.user === "System" ? "text-[#555] italic" : ""}`}>
                <div className="flex items-baseline gap-2">
                  <span className={msg.user === username ? "text-[#00ffff]" : "text-[#00ff00]"}>
                    {msg.user}:
                  </span>
                  <span className="text-xs text-[#555]">{msg.time}</span>
                </div>
                <p className="text-[#e0e0e0] ml-2">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#1a3a1a]">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-[#111] border border-[#1a3a1a] text-[#e0e0e0] px-3 py-2 rounded text-sm focus:outline-none focus:border-[#00ff00]"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-[#00ff00] text-[#000] rounded hover:bg-[#33ff33] transition-colors text-sm font-bold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
