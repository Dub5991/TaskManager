import React from 'react';
import { Button } from 'react-bootstrap';
import { BsUpload } from 'react-icons/bs';

interface Props {
  value?: string;
  onChange: (url: string) => void;
}

const MediaUploader: React.FC<Props> = ({ value, onChange }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) onChange(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Button as="label" variant="outline-primary" className="me-2">
        <BsUpload className="me-1" /> Upload
        <input
          type="file"
          accept="image/*,audio/*"
          style={{ display: 'none' }}
          onChange={handleFile}
        />
      </Button>
      {value && (
        <Button variant="outline-danger" size="sm" onClick={() => onChange('')}>
          Remove
        </Button>
      )}
    </div>
  );
};

export default MediaUploader;