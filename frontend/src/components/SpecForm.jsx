import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function SpecForm({ specs, setSpecs, onGenerate, isGenerating, isReady }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpecs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <SlidersHorizontal size={24} color="var(--accent)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Model Specifications</h2>
      </div>

      <div className="form-section" style={{ padding: 0 }}>
        
        <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
          {/* Gender Dropdown */}
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select name="gender" value={specs.gender} onChange={handleChange} className="form-select">
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>

          {/* Height Slider */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Height</span>
              <span style={{ color: 'var(--accent)' }}>{specs.height} cm</span>
            </label>
            <input
              type="range"
              name="height"
              min="150"
              max="200"
              value={specs.height}
              onChange={handleChange}
              className="form-range"
            />
          </div>

          {/* Age Dropdown */}
          <div className="form-group">
            <label className="form-label">Age Group</label>
            <select name="age" value={specs.age} onChange={handleChange} className="form-select">
              <option value="Child/Teen (2-17)">Child/Teen (2-17)</option>
              <option value="Young Adult (18-25)">Young Adult (18-25)</option>
              <option value="Adult (26-35)">Adult (26-35)</option>
              <option value="Middle Aged (36-50)">Middle Aged (36-50)</option>
              <option value="Senior (50+)">Senior (50+)</option>
            </select>
          </div>

          {/* Skin Tone */}
          <div className="form-group">
            <label className="form-label">Skin Tone</label>
            <select name="skinTone" value={specs.skinTone} onChange={handleChange} className="form-select">
              <option value="Fair">Fair</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Olive">Olive</option>
              <option value="Brown">Brown</option>
              <option value="Dark">Dark</option>
            </select>
          </div>

          {/* Regionality */}
          <div className="form-group">
            <label className="form-label">Regionality</label>
            <select name="regionality" value={specs.regionality} onChange={handleChange} className="form-select">
              <option value="Caucasian">Caucasian</option>
              <option value="East Asian">East Asian</option>
              <option value="South Asian">South Asian</option>
              <option value="African">African</option>
              <option value="Hispanic">Hispanic</option>
              <option value="Middle Eastern">Middle Eastern</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Body Type */}
          <div className="form-group">
            <label className="form-label">Body Type</label>
            <select name="bodyType" value={specs.bodyType} onChange={handleChange} className="form-select">
              <option value="Slim">Slim</option>
              <option value="Average">Average</option>
              <option value="Athletic">Athletic</option>
              <option value="Plus Size">Plus Size</option>
            </select>
          </div>

          {/* Hair Color */}
          <div className="form-group">
            <label className="form-label">Hair Color</label>
            <select name="hairColor" value={specs.hairColor} onChange={handleChange} className="form-select">
              <option value="Black">Black</option>
              <option value="Brown">Brown</option>
              <option value="Blonde">Blonde</option>
              <option value="Red">Red</option>
              <option value="Gray">Gray</option>
              <option value="Bald">Bald</option>
            </select>
          </div>

          {/* Facial Hair */}
          <div className="form-group">
            <label className="form-label">Facial Hair</label>
            <select name="facialHair" value={specs.facialHair} onChange={handleChange} className="form-select">
              <option value="None">None</option>
              <option value="Stubble">Stubble</option>
              <option value="Beard">Beard</option>
              <option value="Mustache">Mustache</option>
              <option value="Goatee">Goatee</option>
            </select>
          </div>

          {/* Glasses */}
          <div className="form-group">
            <label className="form-label">Glasses</label>
            <select name="glasses" value={specs.glasses} onChange={handleChange} className="form-select">
              <option value="None">None</option>
              <option value="Regular Glasses">Regular Glasses</option>
              <option value="Sunglasses">Sunglasses</option>
            </select>
          </div>

          {/* Accessories */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Accessories</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
              {['Earrings', 'Necklace', 'Watch', 'Hat', 'Bracelets', 'Rings', 'Handbag'].map(acc => (
                <label key={acc} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={specs.accessories.includes(acc)} 
                    onChange={(e) => {
                       const newAccs = e.target.checked 
                         ? [...specs.accessories, acc] 
                         : specs.accessories.filter(a => a !== acc);
                       setSpecs(prev => ({ ...prev, accessories: newAccs }));
                    }}
                    style={{ accentColor: 'var(--accent)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  {acc}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Shot Type */}
        <div className="form-group" style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
          <label className="form-label">Shot Type</label>
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { value: 'Full Length', label: 'Full Length', icon: '🧍' },
              { value: '3/4 Body',    label: '3/4 Body',    icon: '🕴️' },
              { value: 'Half Body',   label: 'Half Body',   icon: '👤' },
              { value: 'Close-Up',    label: 'Close-Up',    icon: '🔍' },
            ].map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSpecs(prev => ({ ...prev, shotType: value }))}
                style={{
                  flex: '1 1 calc(50% - 0.6rem)',
                  padding: '0.6rem 0.5rem',
                  borderRadius: '10px',
                  border: specs.shotType === value
                    ? '2px solid var(--accent)'
                    : '2px solid rgba(255,255,255,0.1)',
                  background: specs.shotType === value
                    ? 'rgba(99,102,241,0.2)'
                    : 'rgba(255,255,255,0.04)',
                  color: specs.shotType === value ? 'var(--accent)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: specs.shotType === value ? 600 : 400,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <button 
          className="btn" 
          onClick={onGenerate}
          disabled={!isReady || isGenerating}
          style={{ marginTop: '1.5rem' }}
        >
          {isGenerating ? 'Generating...' : 'Generate Model'}
        </button>

      </div>
    </div>
  );
}
