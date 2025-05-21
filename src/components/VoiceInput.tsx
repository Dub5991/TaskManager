import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';

interface VoiceInputProps {
  onResult: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult }) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const handleStart = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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