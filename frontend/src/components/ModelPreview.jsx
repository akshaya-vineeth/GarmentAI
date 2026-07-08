import React from 'react';
import { Camera } from 'lucide-react';

export default function ModelPreview({ isGenerating, resultImage, generatedPrompt }) {
  return (
    <div className="glass-panel preview-area" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--panel-border)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>AI Model Preview</h2>
      </div>
      
      <div className="preview-container" style={{ flex: 1, overflowY: 'auto' }}>
        {isGenerating ? (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p style={{ color: 'var(--text-muted)' }}>Generating your custom model...</p>
          </div>
        ) : resultImage ? (
          <img src={resultImage} alt="Generated AI Model" className="generated-model" />
        ) : (
          <div className="empty-preview">
            <Camera size={64} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              No Model Generated
            </h3>
            <p style={{ maxWidth: '300px' }}>
              Upload a garment and configure your specifications to generate a custom AI model.
            </p>
          </div>
        )}
      </div>


    </div>
  );
}
