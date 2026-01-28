import { useState, useEffect, useRef } from 'react';

export const useInterviewSocket = (url: string = 'ws://localhost:9091/dashboard') => {
    const [transcripts, setTranscripts] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Connected to Interview Socket");
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'transcription') {
                    setTranscripts(prev => [...prev, data.text]);
                }
            } catch (err) {
                console.error("Error parsing message", err);
            }
        };

        socket.onclose = () => {
            console.log("Disconnected from Interview Socket");
            setIsConnected(false);
        };

        return () => {
            socket.close();
        };
    }, [url]);

    return { transcripts, isConnected };
};
