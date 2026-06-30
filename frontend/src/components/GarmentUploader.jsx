import React, { useCallback, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';

export default function GarmentUploader({ image, setImage }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsHovered(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result);
        reader.readAsDataURL(file);
      }
    },
    [setImage]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>Garment Photo</h2>
      
      {!image ? (
        <label
          className={`uploader ${isHovered ? 'hovered' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <UploadCloud size={48} color="var(--accent)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Drag & drop your garment
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            or click to browse from your computer
          </p>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <img src={image} alt="Garment" className="uploaded-image" />
          <button
            onClick={() => setImage(null)}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'rgba(0,0,0,0.6)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(4px)'
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
