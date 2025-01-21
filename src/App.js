import React, { useState, useEffect } from "react";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
mapboxgl.accessToken =
  "pk.eyJ1Ijoic2dhbmNoZXYiLCJhIjoiY202NWdmbjVuMWFnZDJrbjI5OHFjMmpjayJ9.6EWSvMW8Wgn6ohfU8p9Y7Q";

export default function App() {
  const location = "Lisbon";
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
    console.log(newItem);
    setItem([newItem, ...items]);
    console.log(items);
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

  // Mapbox GL initialization
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      center: [-9.1393, 38.7223], // Lisbon coordinates
      zoom: 12,
    });

    // create a HTML element for custom marker

    const customMarker = document.createElement("div");
    customMarker.className = "marker";
    customMarker.style.backgroundImage =
      "https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png";

    // Add marker for Lisbon center
    new mapboxgl.Marker(customMarker).setLngLat([-9.1393, 38.7223]).addTo(map);

    // Cleanup on component unmount
    return () => map.remove();
  }, []);

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
                <SortControl />
                <ClearListButton action={handleClearList} />
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
          <div id="map"></div>
          <LocationInfo />
        </div>
      </div>
    </>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src="images/Logo.svg" alt="Travel Planner Logo" className="logo" />
        <span className="brand">Travel Planner</span>
      </div>
      <div className="nav-right">
        <a href="/about" className="nav-link">
          About
        </a>
        <a href="/blog" className="nav-link">
          Blog
        </a>
        <a href="/sign-in" className="nav-button-link">
          Sign in
        </a>
        <a href="register" className="nav-button">
          Register
        </a>
      </div>
    </nav>
  );
}

function AddItem({ action, placeholder }) {
  // state to keep track of the input value
  const [inputValue, setInputValue] = useState("");

  // function that runs when the user types in the input
  function handleChange(event) {
    setInputValue(event.target.value);
  }

  // function that runs when the user clicks the "Add" button
  function handleAddClick() {
    action(inputValue);
    setInputValue("");
  }

  // function that runs when the user presses enter
  function handleSubmit(event) {
    if (event.key === "Enter") {
      action(inputValue);
      setInputValue("");
    }
  }

  return (
    <div className="add-item-container">
      <input
        type="text"
        className="add-item-input"
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleSubmit}
        value={inputValue}
      />
      <button className="add-button" onClick={handleAddClick}>
        <img src="images/Plus.svg" alt="Add Item" />
        <span>Add</span>
      </button>
    </div>
  );
}

function SortControl() {
  return (
    <div className="sort-control">
      <div className="select-field">
        <select className="custom-select">
          <option value="date">Date Added</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
        </select>
        <div className="select-icon">
          <img src="images/Chevron-down.svg" alt="Select" />
        </div>
      </div>
    </div>
  );
}

function ClearListButton({ action }) {
  return (
    <button className="clear-button" onClick={action}>
      Clear List <img src="images/X-small.svg" alt="Clear List" />
    </button>
  );
}

function ListItem({ item, checkAction, deleteAction }) {
  return (
    <div className={item.completed ? "list-item completed" : "list-item"}>
      <div className="item-checkbox">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => checkAction(item)}
        />
        <h3>{item.title}</h3>
      </div>
      <p className="item-description">{item.subtitle}</p>
      {!item.completed && (
        <button className="delete-item" onClick={() => deleteAction(item)}>
          <img src="images/X.svg" alt="Delete" />
        </button>
      )}
    </div>
  );
}

function LocationInfo() {
  return (
    <div className="location-info">
      <h2>Lisbon:</h2>
      <h3>A City of Light, History, and Soul</h3>
      <p>
        Perched on the edge of the Atlantic, Lisbon is a city that hums with the
        rhythm of discovery and whispers the stories of centuries past. Known as
        the "City of Seven Hills," its cobbled streets wind upward to reveal
        breathtaking panoramas of terracotta rooftops, the glittering Tagus
        River, and the vast horizon beyond—a reminder of Portugal's Age of
        Exploration.
      </p>
    </div>
  );
}
