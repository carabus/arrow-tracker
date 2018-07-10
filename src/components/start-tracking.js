import React from "react";
import { Link } from "react-router-dom";

export default function StartTracking(props) {
  return (
    <section>
      <Link to={`/new/session`}>
        <button type="button">+ Start tracking</button>
      </Link>
    </section>
  );
}
