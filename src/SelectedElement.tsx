// src/SelectedElement.tsx

import React, { useEffect, useState } from 'react';

interface SelectedElementProps {
  selectedText: string;
  elementType: string;
}

const SelectedElement: React.FC<SelectedElementProps> = ({ selectedText, elementType }) => {
  return (
    <div>
      <h3>Selected Element</h3>
      <p><strong>Type:</strong> {elementType}</p>
      <p><strong>Text:</strong> {selectedText}</p>
    </div>
  );
};

export default SelectedElement;
