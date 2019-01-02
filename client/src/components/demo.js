import React from 'react';
import './session.css';
import Target from './target/target';
import Arrow from './arrow';

export class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { arrows: [], total: 0, max: 0, accuracy: 0 };
    this.createArrow = this.createArrow.bind(this);
  }

  createArrow(arrow) {
    if (this.state.arrows.length === 5) {
      this.setState({ arrows: [], total: 0, max: 0, accuracy: 0 });
      return;
    }

    const newArrow = { coordinates: arrow.point, score: arrow.score };
    const total = this.state.total + arrow.score;
    const max = this.state.max + (this.props.targetType === 'olympic' ? 10 : 5);
    const accuracy = Math.floor((total / max) * 100);
    this.setState({
      arrows: [...this.state.arrows, newArrow],
      total,
      max,
      accuracy
    });
  }

  removeLastArrow() {
    this.setState({
      arrows: [...this.state.arrows.slice(0, this.state.arrows.length - 1)]
    });
  }

  render() {
    const arrows = this.state.arrows.map((arrow, index) => (
      <Arrow
        arrow={arrow}
        key={index}
        targetType={this.props.targetType.toLowerCase()}
      />
    ));
    return (
      <div className="session">
        <section>
          <p className="centered-text" style={{ fontSize: '16px' }}>
            Score:
          </p>
          <p className="big-test centered-text" style={{ paddingTop: '7px' }}>
            {this.state.total} / {this.state.max} ( {this.state.accuracy}% )
          </p>
          <div className="sub-section target-wrapper">
            <Target
              arrows={this.state.arrows}
              createArrow={this.createArrow}
              type={this.props.targetType}
            />
          </div>
          <div className="card-body flat-top" style={{ height: '60px' }}>
            <div className="sub-section">{arrows}</div>
          </div>
        </section>
      </div>
    );
  }
}
