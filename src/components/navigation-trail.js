import React from "react";
import { Link } from "react-router-dom";

export default function NavigationTrail(props) {
  return (
    <section>
      <Link to={`/dashboard`}>Home</Link>
      {" -> "}
      <Link to={`/session/${props.sessionId}`}>Back to Session</Link>
    </section>
  );
}
