import React from "react";
import "./arrow.css";

export default function Arrow(props) {
  return (
    <div className={`score ${colorMapping[props.arrow.score]}`}>
      {props.arrow.score}
    </div>
  );
}

const colorMapping = {
  0: "black",
  1: "white",
  2: "white",
  3: "black",
  4: "black",
  5: "blue",
  6: "blue",
  7: "red",
  8: "red",
  9: "yellow",
  10: "yellow"
};
