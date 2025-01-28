import React, { useEffect } from "react";
import * as mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

export default function Map({ center, zoom }) {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      center,
      zoom,
    });

    const customMarker = document.createElement("div");
    customMarker.className = "marker";
    customMarker.style.backgroundImage = "url('images/Map-pin.svg')";

    new mapboxgl.Marker(customMarker).setLngLat([-9.1393, 38.7223]).addTo(map);

    return () => map.remove();
  }, [center, zoom]);

  return <div id="map"></div>;
}
