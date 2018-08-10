import React from "react";
import { Link } from "react-router-dom";
import ArcheryImage from "../images/archery.png";

export default function HeaderBar(props) {
  const image = <img src={ArcheryImage} />;
  return (
    <div className="header-bar">
      <nav role="navigation">
        {image}
        <Link to={`/dashboard`}>Home</Link>
      </nav>
    </div>
  );
}
