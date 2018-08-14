import React from "react";
import { Link } from "react-router-dom";

export default function NavigationTrail(props) {
  if (!props.sessionId) {
    return (
      <div>
        <Link to={`/dashboard`}>Dashboard</Link>
      </div>
    );
  }
  return (
    <div>
      <Link to={`/dashboard`}>Dashboard</Link>
      {" -> "}
      <Link to={`/session/${props.sessionId}`}>Back to Training Session</Link>
    </div>
  );
}
