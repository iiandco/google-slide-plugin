import React, { useState, useEffect } from "react";
import { getGoogleSlideAPI } from "./GoogleSlideAPI";

interface SidebarProps {
  accessToken: string;
  presentationId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ accessToken, presentationId }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [elementIndex, setElementIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<{ text: string; type: string } | null>(null);

  useEffect(() => {
    async function getSelectedElement() {
      const slideAPI = await getGoogleSlideAPI(accessToken);
      const presentation = await slideAPI.get({ presentationId });

      if (presentation.data && presentation.data.slides) {
        const slide = presentation.data.slides[slideIndex];
        const element = slide.pageElements && slide.pageElements[elementIndex];

        if (element && element.shape && element.shape.text && element.shape.text.textElements) {
          setSelectedElement({
            text: element.shape.text.textElements
              .map((textElement) => textElement.textRun?.content)
              .filter((content) => content)
              .join(""),
            type: element.elementType || "",
          });
        } else {
          setSelectedElement(null);
        }
      }
    }

    getSelectedElement();
  }, [accessToken, presentationId, slideIndex, elementIndex]);

  return (
    <div>
      <label>
        Индекс слайда:
        <input
          type="number"
          value={slideIndex}
          onChange={(e) => setSlideIndex(parseInt(e.target.value, 10))}
        />
      </label>
      <br />
      <label>
        Индекс элемента:
        <input
          type="number"
          value={elementIndex}
          onChange={(e) => setElementIndex(parseInt(e.target.value, 10))}
        />
      </label>
      <br />
      {selectedElement ? (
        <>
          <h2>Выбранный элемент</h2>
          <p>Тип: {selectedElement.type}</p>
          <p>Текст: {selectedElement.text}</p>
        </>
      ) : (
        <p>Нет выбранного элемента</p>
      )}
    </div>
  );
};
