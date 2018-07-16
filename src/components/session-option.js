import React from "react";
import "./session-option.css";

export default function SessionOption(props) {
  return (
    <div className="session-option">
      <label htmlFor={`sessionOption${props.option.id}`}>
        <input
          type="checkbox"
          id={`sessionOption${props.option.id}`}
          value={props.option.id}
          name="sessionOption"
          onChange={event => props.cb(event)}
        />

        {props.option.name}
      </label>
    </div>
  );
}
