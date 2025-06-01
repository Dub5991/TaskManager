// VoiceInput.tsx - Voice to Text Input Component
import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';

interface VoiceInputProps {
  onResult: (text: string) => void;
}

// Use 'any' for SpeechRecognition to avoid TS errors if types are missing
const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult }) => {
  const recognitionRef = useRef<any>(null);

  // Start voice recognition and handle result
  const handleStart = () => {
    if (!SpeechRecognition) return alert('Speech recognition not supported');
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognitionRef.current.start();
  };

  return (
    <Form.Group>
      <Button variant="outline-secondary" onClick={handleStart}>
        🎤 Voice Input
      </Button>
    </Form.Group>
  );
};

export default VoiceInput;