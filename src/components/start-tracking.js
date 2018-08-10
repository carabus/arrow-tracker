import React from "react";
import { Link } from "react-router-dom";

export default function StartTracking(props) {
  return (
    <section>
      <Link to={`/new/session`}>
        <button className="button-primary" type="button">
          + Start recording
        </button>
      </Link>
    </section>
  );
}
