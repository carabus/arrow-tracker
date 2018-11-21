import React from "react";
import { connect } from "react-redux";
import "./session.css";

import Target from "./target/target";
import Arrow from "./arrow";

import { Link } from "react-router-dom";

export class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { arrows: [] };
    this.createArrow = this.createArrow.bind(this);
  }

  createArrow(arrow) {
    console.log("create arrow");
    const newArrow = { coordinates: arrow.point, score: arrow.score };
    this.setState({ arrows: [...this.state.arrows, newArrow] });
  }

  removeLastArrow() {
    this.setState({
      arrows: [...this.state.arrows.slice(0, this.state.arrows.length - 1)]
    });
  }

  render() {
    const arrows = this.state.arrows.map((arrow, index) => (
      <Arrow arrow={arrow} key={index} />
    ));
    return (
      <div className="session">
        <section>
          <div className="sub-section target-wrapper">
            <Target arrows={this.state.arrows} createArrow={this.createArrow} />
          </div>
          <div className="card-body flat-top">
            <div className="sub-section">{arrows}</div>
            <div className="sub-section">
              <button
                className="button-secondary button-miss"
                type="button"
                onClick={() =>
                  this.createArrow({
                    point: { x: -1, y: -1 },
                    score: 0
                  })
                }
              >
                Miss
              </button>
              <button
                className="button-secondary button-undo"
                type="button"
                onClick={() => this.removeLastArrow()}
              >
                Undo
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
