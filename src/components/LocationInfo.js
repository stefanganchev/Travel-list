import React, { useState, useEffect, useRef } from "react";

export default function LocationInfo() {
  const OPEN_AI_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const [locationInfo, setLocationInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const mounted = useRef(false);

  // Calls the OpenAI API to fetch location data
  async function fetchLocationData() {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPEN_AI_KEY,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            store: true,
            response_format: {
              type: "text",
            },
            temperature: 1,
            max_completion_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            messages: [
              {
                role: "system",
                content: [
                  {
                    type: "text",
                    text: "You are a helpful travel assistant. Your tone is excited and poetic.",
                  },
                ],
              },
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Single paragraph (~60 words) travel summary for Lisbon",
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      setLocationInfo(data.choices[0].message.content);
      console.log(data.choices[0].message.content);
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Load location data on component mount
  useEffect(() => {
    // Checks to see if the component has already been mounted
    if (!mounted.current) {
      mounted.current = true;
      fetchLocationData();
    }
  }, []);

  return (
    <div className="location-info">
      <h2>Lisbon:</h2>
      <h3>A City of Light, History, and Soul</h3>
      {isLoading ? <p>Loading...</p> : <p>{locationInfo}</p>}
    </div>
  );
}
