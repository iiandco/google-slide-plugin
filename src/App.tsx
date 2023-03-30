// src/App.tsx

import React, { useEffect, useState } from 'react';
import './App.css';
import SelectedElement from './SelectedElement';

function App() {
  const [selectedText, setSelectedText] = useState('');
  const [elementType, setElementType] = useState('');

  useEffect(() => {
    async function init() {
      await loadGoogleSlidesAPI();
      setupSelectionListener();
    }
    init();
  }, []);

  async function loadGoogleSlidesAPI() {
    await new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          resolve(null);
        });
      };
      document.body.appendChild(script);
    });
    // Use your own API key and client ID here
    await window.gapi.client.init({
      apiKey: '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',
      clientId: '802627914353-ssgj5hvgnjr66k7dg7a2ps8eluflbiu5.apps.googleusercontent.com',
      discoveryDocs: ['https://slides.googleapis.com/$discovery/rest?version=v1'],
      scope: 'https://docs.google.com/presentation/d/1poKmU7zdFbOBREjUPSYxueicpQGzn2EmIEnFuiRzaD0/edit#slide=id.gc6f59039d_0_0'
    });
  }
  
  function setupSelectionListener() {
  // Listen for selection change events in Google Slides
  document.addEventListener('selectionchange', async () => {
  const selection = document.getSelection();
  if (selection && selection.toString().length > 0) {
  setSelectedText(selection.toString());
  
 
      // Get the selected element type
      const selectedElement = (selection.anchorNode as HTMLElement).closest(
        'g[data-elementtype]'
      );
      if (selectedElement) {
        setElementType(selectedElement.getAttribute('data-elementtype') || '');
      } else {
        setElementType('');
      }
    } else {
      setSelectedText('');
      setElementType('');
    }
  });
  }
  
  return (
  <div className="App">
  <header className="App-header">
  <SelectedElement selectedText={selectedText} elementType={elementType} />
  </header>
  </div>
  );
  }
  
  export default App;