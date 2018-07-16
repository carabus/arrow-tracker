import React from "react";
import { connect } from "react-redux";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export function Stats(props) {
  const progressChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={props.profile.progressChart}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="session" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
  return (
    <section>
      <h2>My Stats</h2>
      <p>My rank is {props.profile.rank}/100</p>
      <p>
        <a className="help" href="#" target="_self">
          How it's calculated?
        </a>
      </p>
      <section>
        <h3>Progress Chart</h3>
        {progressChart}
      </section>
    </section>
  );
}

const mapStateToProps = state => {
  return {
    profile: state.profileReducer.profile
  };
};
export default connect(mapStateToProps)(Stats);
