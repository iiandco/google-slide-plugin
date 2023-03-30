import React, { useEffect, useState } from "react";
import { GoogleSlidesApi } from "./GoogleSlideAPI";

interface SelectedElement {
  text: string;
  type: string;
}

const Sidebar: React.FC = () => {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);

  useEffect(() => {
    const fetchSelectedElement = async (presentationId: string) => {
      try {
        const api = await GoogleSlidesApi.getInstance();
        const element = await api.getSelectedElement(presentationId);
        setSelectedElement(element);
      } catch (error) {
        console.error("Error fetching selected element:", error);
      }
    };

    // Замените 'your-presentation-id' на ID вашей презентации
    fetchSelectedElement("your-presentation-id");
  }, []);

  return (
    <div>
  {selectedElement ? (
    <div>
      <h3>Selected Element</h3>
      <p>
        <strong>Type:</strong> {selectedElement.type}
      </p>
      <p>
        <strong>Text:</strong> {selectedElement.text}
      </p>
    </div>
  ) : (
    <p>No element selected</p>
  )}
</div>
);
};

export default Sidebar;