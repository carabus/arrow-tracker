import React from "react";
import "./target-icon.css";

export default function TargetIcon(props) {
  return (
    <div className="target-icon">
      <div className={props.targetType} />
    </div>
  );
}
