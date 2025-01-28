import React from "react";

export default function ListItem({ item, checkAction, deleteAction }) {
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
