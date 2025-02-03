import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import Navbar from "./components/Navbar";
import AddItem from "./components/AddItem";
import ListItem from "./components/ListItem";
import ClearButton from "./components/ClearButton";
import LocationInfo from "./components/LocationInfo";
import Map from "./components/Map";
import Confetti from "./components/Confetti";
import "mapbox-gl/dist/mapbox-gl.css";
import { callOpenAI } from "./services/openAiService";
import { getCoordinates } from "./services/mapboxService";
import { capitalize } from "./utils";

export default function App() {
  const mounted = useRef(false);

  // location and map data
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [mapCenter, setMapCenter] = useState([-122.4194, 37.7749]); // San Francisco coordinates
  const mapZoom = 12;

  const [items, setItem] = useState([]);
  const [itemDescription, setItemDescription] = useState("...");

  const allItemsCompleted =
    items.length > 0 && items.every((item) => item.completed);

  // sorting options
  const sortingOptions = [
    { value: "date", label: "Date Added" },
    { value: "name", label: "Name" },
    { value: "completed", label: "Completed" },
    { value: "unfinished", label: "Unfinished" },
    { value: "all", label: "All" },
  ];

  // Loading states
  const [isItemsLoading, setIsItemsLoading] = useState(true);

  // Get the suggested items from OpenAI
  const getSuggestedItems = async () => {
    try {
      const response = await callOpenAI(
        `List the top 3 travel items an American needs for a trip to ${location}. Be specific but brief. For each item, provide a short (8-10 words) description. Don't number the items and use this format: "Item title : Item description"`
      );
      const itemsFromResponse = response
        .split("\n")
        .filter((item) => item.trim().length > 0)
        .map((item) => item.trim());

      setItem((prevItems) => [
        ...prevItems,
        ...itemsFromResponse.map((item) => {
          const [title, description] = item.split(":");
          return {
            id: crypto.randomUUID(),
            title: title.trim(),
            subtitle: description.trim(),
            completed: false,
            timestamp: new Date().toISOString().slice(0, 10),
          };
        }),
      ]);
    } catch (error) {
      console.error("Error fetching suggested items:", error);
      // TODO: UI feedback for error
    } finally {
      setIsItemsLoading(false);
    }
  };

  // Get the suggested items from OpenAI
  const getItemDescription = async (item) => {
    try {
      const response = await callOpenAI(
        `Provide a short (8-10 words) description for ${item} as a travel item for ${location}.`
      );
      return response;
    } catch (error) {
      console.error("Error fetching item description:", error);
      // TODO: UI feedback for error
    } finally {
      setIsItemsLoading(false);
    }
  };

  async function updateMapCenter() {
    try {
      const coordinates = await getCoordinates(location);
      setMapCenter(coordinates);
    } catch (error) {
      console.error("Error getting coordinates:", error);
    }
  }

  // Load suggested items on component mount, i.e., page load
  useEffect(() => {
    if (!mounted.current && location) {
      mounted.current = true;
      getSuggestedItems();
      updateMapCenter();
    }
  }, [location]);

  // This version waits for the api call to complete before updating the state and mounting the component
  // async function handleAddItem(item) {
  //   const description = await getItemDescription(item);
  //   const newItem = {
  //     id: crypto.randomUUID(),
  //     title: item,
  //     subtitle: description,
  //     completed: false,
  //     timestamp: new Date().toISOString().slice(0, 10),
  //   };
  //   setItem([newItem, ...items]);
  // }

  function handleAddItem(item) {
    const newItem = {
      id: crypto.randomUUID(),
      title: item,
      subtitle: "...",
      completed: false,
      timestamp: new Date().toISOString().slice(0, 10),
    };
    setItem([newItem, ...items]);
    getItemDescription(item).then((description) => {
      console.log(newItem);
      setItem([
        {
          ...newItem,
          subtitle: description,
        },
        ...items.filter((i) => i !== newItem.id),
      ]);
    });
  }

  function handleCheckItem(item) {
    // create an item with the opposite completed status
    const targetItem = items.find((i) => i.id === item.id);
    targetItem.completed = !targetItem.completed;
    // targetItem.subtitle = "Completed!";

    // update the items in the list
    setItem([...items.filter((i) => i !== item.id)]);
  }

  function handleDeleteItem(item) {
    setItem(items.filter((i) => i !== item));
  }

  function handleClearList() {
    setItem([]);
  }

  const handleSelectChange = (selectedOption) => {
    // sort the items
    switch (selectedOption.value) {
      case "date":
        // timestamp sort.
        setItem(
          [...items].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        );
        break;
      case "name":
        setItem([...items].sort((a, b) => a.title.localeCompare(b.title)));
        break;
      case "completed":
        setItem([...items].filter((i) => i.completed));
        break;
      case "unfinished":
        setItem([...items].filter((i) => !i.completed));
        break;
      case "all":
        setItem([...items]);
        break;
      default:
        // No sorting
        break;
    }
  };

  function handleLocationChange(event) {
    setLocationInput(event.target.value);
  }

  function handleLocationClick() {
    const formattedLocation = capitalize(locationInput);
    setLocation(formattedLocation);
    setLocationInput("");
  }

  function handleLocationSubmit(event) {
    if (event.key === "Enter") {
      const formattedLocation = capitalize(locationInput);
      setLocation(formattedLocation);
      setLocationInput("");
    }
  }

  return (
    <>
      <Navbar />
      {location ? (
        // List of items page
        <div className="container">
          <div className="planner-section">
            {allItemsCompleted ? (
              <>
                <Confetti />
                <h1 className="title">
                  Nice job!
                  <br />
                  <span className="destination">{location}</span> is awaiting
                  you!
                </h1>
              </>
            ) : (
              <>
                <h1 className="title">
                  Let's get you ready for
                  <br />
                  your trip to <span className="destination">{location}!</span>
                </h1>
                <AddItem
                  action={handleAddItem}
                  placeholder="Add an item for your trip..."
                />
              </>
            )}

            <div className="list-controls">
              {items.length > 0 && !allItemsCompleted && (
                <>
                  <Select
                    options={sortingOptions}
                    onChange={handleSelectChange}
                    className="sort-control"
                    placeholder="Sort by..."
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        border: "none",
                        boxShadow: "none",
                        borderRadius: "6px",
                        paddingLeft: "4px",
                        paddingRight: "4px",
                        height: "40px",
                        fontSize: "14px",
                        color: "#1e1e1e",
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }),
                      indicatorSeparator: () => ({
                        display: "none",
                      }),
                    }}
                  />
                  <ClearButton handleClear={handleClearList} />
                </>
              )}
            </div>

            <div className="items-list">
              {isItemsLoading ? (
                // Skeleton loading animation
                <div className="skeleton-content items-skeleton-content">
                  <div className="skeleton-line-short pulse item-select-skeleton"></div>
                  <div className="skeleton-line-full pulse item-skeleton"></div>
                  <div className="skeleton-line-full pulse item-skeleton"></div>
                  <div className="skeleton-line-full pulse item-skeleton"></div>
                </div>
              ) : (
                items.map((item) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    checkAction={handleCheckItem}
                    deleteAction={handleDeleteItem}
                  />
                ))
              )}
            </div>
          </div>
          <div className="map-section">
            <Map center={mapCenter} zoom={mapZoom} />
            <LocationInfo location={location} />
          </div>
        </div>
      ) : (
        // Landing page
        <main className="landing-page">
          <h1 className="title">Where are you going?</h1>
          <p className="subtitle">
            Let us help you select some important items for your trip.
          </p>

          <div className="search-container">
            <input
              type="text"
              className="add-item-input"
              placeholder="Search for your destination..."
              onChange={handleLocationChange}
              onKeyDown={handleLocationSubmit}
              value={locationInput}
            />
            <button className="add-button" onClick={handleLocationClick}>
              <span>Let's go</span>
            </button>
          </div>
        </main>
      )}
    </>
  );
}
