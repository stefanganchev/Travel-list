const MAPBOX_API = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export async function getCoordinates(locationName) {
  const response = await fetch(
    `${MAPBOX_API}/${encodeURIComponent(locationName)}.json?access_token=${
      process.env.REACT_APP_MAPBOX_TOKEN
    }`
  );
  const data = await response.json();

  if (data.features && data.features.length > 0) {
    return data.features[0].center; // Returns [longitude, latitude]
  }

  throw new Error("Location not found");
}
