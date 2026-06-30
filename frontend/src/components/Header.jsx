import React from 'react';
import { Sparkles, User, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Sparkles size={28} color="#a78bfa" />
        GarmentAI
      </div>
    </header>
  );
}
