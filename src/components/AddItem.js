import React, { useState } from "react";

export default function AddItem({ action, placeholder }) {
  const [inputValue, setInputValue] = useState("");

  function handleChange(event) {
    setInputValue(event.target.value);
  }

  function handleAddClick() {
    action(inputValue);
    setInputValue("");
  }

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
