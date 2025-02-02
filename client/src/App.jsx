// Create react app component to display NBack component from components folder
import React, { useState } from 'react';
import NBackGame from './components/NBack';
export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NBackGame />
    </div>
  );
}