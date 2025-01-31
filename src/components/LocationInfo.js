import React, { useState, useEffect, useRef } from "react";
import { callOpenAI } from "../services/openAiService";

export default function LocationInfo({ location }) {
  const [locationSubtitle, setLocationSubtitle] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [isSubtitleLoading, setIsSubtitleLoading] = useState(false);
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const mounted = useRef(false);

  // Call to fetch subtitle data
  const fetchLocationSubtitleData = async () => {
    setIsSubtitleLoading(true);
    try {
      const subtitle = await callOpenAI(
        `Describe the city of ${location} in less than 28 characters. Use only text.`
      );
      setLocationSubtitle(subtitle);
    } catch (error) {
      console.error("Error fetching location subtitle:", error);
      // TODO: UI feedback for error
    } finally {
      setIsSubtitleLoading(false);
    }
  };

  // Call to fetch description data
  const fetchLocationData = async () => {
    setIsDescriptionLoading(true);
    try {
      const description = await callOpenAI(
        `Single paragraph (~60 words) travel summary for ${location}`
      );
      setLocationInfo(description);
    } catch (error) {
      console.error("Error fetching location description:", error);
      // TODO: UI feedback for error
    } finally {
      setIsDescriptionLoading(false);
    }
  };

  // Load location data on component mount
  useEffect(() => {
    // Checks to see if the component has already been mounted
    if (!mounted.current) {
      mounted.current = true;
      fetchLocationSubtitleData();
      fetchLocationData();
    }
  }, []);

  return (
    <div className="location-info">
      <h2>{location}</h2>
      <h3>
        {isSubtitleLoading ? (
          // Skeleton loading animation
          <div className="skeleton-line-full pulse location-info-subtitle"></div>
        ) : (
          <span>{locationSubtitle}</span>
        )}
      </h3>
      {isDescriptionLoading ? (
        <div className="skeleton-content info-skeleton-content">
          <div className="skeleton-line-full pulse location-info-description"></div>
          <div className="skeleton-line-full pulse location-info-description"></div>
          <div className="skeleton-line-full pulse location-info-description"></div>
          <div className="skeleton-line-full pulse location-info-description"></div>
          <div className="skeleton-line-full pulse location-info-description"></div>
          <div className="skeleton-line-full pulse location-info-description"></div>
          <div className="skeleton-line-full pulse location-info-description"></div>
          <div className="skeleton-line-full pulse location-info-description"></div>
          <div className="skeleton-line-short pulse location-info-description"></div>
        </div>
      ) : (
        <p>{locationInfo}</p>
      )}
    </div>
  );
}
