'use client'; // Esto marca el componente como un componente de cliente

import React from 'react';

export default function RetryButton() {
  return (
    <button 
      onClick={() => window.location.reload()} 
      className="btn btn-primary"
    >
      Intentar de nuevo
    </button>
  );
} 