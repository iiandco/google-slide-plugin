// src/components/Plugin.js
import React, { useState, useEffect } from "react";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

const Plugin = ({ accessToken }) => {
  const [presentationId, setPresentationId] = useState("");
  const [slides, setSlides] = useState([]);

  const slidesApi = React.useMemo(() => {
    if (!accessToken) return null;

    const auth = new GoogleAuth();
    auth.setCredentials({ access_token: accessToken });
    return google.slides({ version: "v1", auth });
  }, [accessToken]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await slidesApi.presentations.get({
          presentationId,
        });

        setSlides(response.data.slides);
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };

    if (accessToken && presentationId) {
      fetchSlides();
    }
  }, [accessToken, presentationId, slidesApi]);

  const addSlide = async () => {
    try {
      await slidesApi.presentations.batchUpdate({
        presentationId,
        resource: {
          requests: [
            {
              createSlide: {
                objectId: `slide-${Date.now()}`,
                insertSlideIndex: slides.length,
              },
            },
          ],
        },
      });

      // Обновляем список слайдов после добавления нового
      fetchSlides();
    } catch (error) {
      console.error("Error adding slide:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Presentation ID"
        value={presentationId}
        onChange={(e) => setPresentationId(e.target.value)}
      />
      <button onClick={addSlide}>Add Slide</button>
      <ul>
        {slides.map((slide, index) => (
          <li key={slide.objectId}>{`Slide ${index + 1}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default Plugin;
