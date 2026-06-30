import React, { useState } from 'react';
import Header from './components/Header';
import GarmentUploader from './components/GarmentUploader';
import SpecForm from './components/SpecForm';
import ModelPreview from './components/ModelPreview';

function App() {
  const [image, setImage] = useState(null);
  const [specs, setSpecs] = useState({
    gender: 'Female',
    height: 170,
    age: 'Young Adult (18-25)',
    skinTone: 'Medium',
    regionality: 'Mixed',
    bodyType: 'Average',
    glasses: 'None',
    accessories: [],
    hairColor: 'Black',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResultImage(null);
    setGeneratedPrompt('');
    
    try {
      // Send the specs and the garment image to the FastAPI backend
      const formData = new FormData();
      formData.append('specs', JSON.stringify(specs));
      
      // Convert base64 image to Blob
      if (image) {
        const arr = image.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const fileBlob = new Blob([u8arr], { type: mime });
        formData.append('garment', fileBlob, 'garment.png');
      }

      const response = await fetch('https://garmentai.onrender.com/generate-prompt', {
        method: 'POST',
        // Note: Do not set Content-Type manually with FormData so the browser can attach the boundary
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // The backend returns an image file, so we read it as a Blob
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setResultImage(imageUrl);
      
      // Extract the prompt from our custom header
      const promptHeader = response.headers.get("X-Generated-Prompt");
      if (promptHeader) {
        const decodedPrompt = decodeURIComponent(promptHeader);
        console.log("Mistral Generated Prompt:", decodedPrompt);
        setGeneratedPrompt(decodedPrompt);
      }
      
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      alert("Error connecting to backend. Make sure the FastAPI server is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        {/* Left Sidebar for Inputs */}
        <div className="sidebar">
          <GarmentUploader image={image} setImage={setImage} />
          <SpecForm 
            specs={specs} 
            setSpecs={setSpecs} 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating}
            isReady={!!image} 
          />
        </div>

        {/* Right Area for Preview */}
        <ModelPreview 
          isGenerating={isGenerating} 
          resultImage={resultImage} 
          generatedPrompt={generatedPrompt}
        />
      </main>
    </div>
  );
}

export default App;
