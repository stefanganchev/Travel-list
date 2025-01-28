import React, { useState } from "react";
import Select from "react-select";
import Navbar from "./components/Navbar";
import AddItem from "./components/AddItem";
import ListItem from "./components/ListItem";
import LocationInfo from "./components/LocationInfo";
import Map from "./components/Map";
import "mapbox-gl/dist/mapbox-gl.css";

export default function App() {
  // location and map data
  const location = "Lisbon";
  const mapCenter = [-9.1393, 38.7223];
  const mapZoom = 12;

  // sorting options
  const sortingOptions = [
    { value: "date", label: "Date Added" },
    { value: "name", label: "Name" },
    { value: "status", label: "Status" },
  ];

  // initial default items
  const initialItems = [
    {
      id: 1,
      title: "Passport",
      subtitle: "You're travelling internationally. Passport is a requirement.",
      completed: false,
    },
    {
      id: 2,
      title: "Boarding pass",
      subtitle: "That boarding pass is your ticket to the adventure!",
      completed: false,
    },
    {
      id: 3,
      title: "Water bottle",
      subtitle: "Remember to stay hydrated!",
      completed: false,
    },
  ];

  const [items, setItem] = useState(initialItems);

  function handleAddItem(item) {
    const newItem = {
      id: Date.now(),
      title: item,
      subtitle: "Added!",
      completed: false,
    };
    setItem([newItem, ...items]);
  }

  function handleCheckItem(item) {
    // create an item with the opposite completed status
    const targetItem = items.find((i) => i.id === item.id);
    targetItem.completed = !targetItem.completed;
    targetItem.subtitle = "Completed!";

    // update the items in the list
    setItem([...items.filter((i) => i !== item.id)]);
  }

  function handleDeleteItem(item) {
    setItem(items.filter((i) => i !== item));
  }

  function handleClearList() {
    setItem([]);
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="planner-section">
          <h1 className="title">
            Let's get you ready for
            <br />
            your trip to <span className="destination">{location}!</span>
          </h1>

          <AddItem
            action={handleAddItem}
            placeholder="Add an item for your trip..."
          />

          <div className="list-controls">
            {items.length > 0 && (
              <>
                <Select options={sortingOptions} />
                <button className="clear-button" onClick={handleClearList}>
                  Clear List <img src="images/X-small.svg" alt="Clear List" />
                </button>
              </>
            )}
          </div>

          <div className="items-list">
            {items.map((item) => (
              <ListItem
                key={item.id}
                item={item}
                checkAction={handleCheckItem}
                deleteAction={handleDeleteItem}
              />
            ))}
          </div>
        </div>

        <div className="map-section">
          <Map center={mapCenter} zoom={mapZoom} />
          <LocationInfo />
        </div>
      </div>
    </>
  );
}
