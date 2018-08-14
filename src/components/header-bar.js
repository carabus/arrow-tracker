import React from "react";
import { Link } from "react-router-dom";

export default function HeaderBar(props) {
  return (
    <div className="header-bar">
      <nav role="navigation">{props.content}</nav>
    </div>
  );
}
