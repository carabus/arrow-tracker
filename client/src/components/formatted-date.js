import React from "react";
const moment = require("moment");

export default function FormattedDate(props) {
  const date = moment(props.date).format("LLL");
  return <span>{date}</span>;
}
