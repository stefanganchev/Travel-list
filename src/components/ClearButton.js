import React from "react";

export default function ClearButton({ handleClear }) {
  return (
    <button className="clear-button" onClick={handleClear}>
      Clear all <img src="images/X-small.svg" alt="Clear List" />
    </button>
  );
}
