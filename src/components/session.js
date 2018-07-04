import React from "react";
import { connect } from "react-redux";

export class Session extends React.Component {
  render() {
    console.log(this.props);

    const optionsList = this.props.session.additionalOptions.map(option => (
      <li key={option.optionName}>{option.optionName}</li>
    ));
    return (
      <main role="main">
        <header role="banner">
          <h1>Training session</h1>
          <p>Started on {this.props.session.startDate}</p>
        </header>
        <section>
          <dl>
            <dt>Distance</dt>
            <dd>{this.props.session.distance}</dd>
            <dt>Additional options</dt>
            <dd>
              <ul>{optionsList}</ul>
            </dd>
          </dl>
          <button>Edit</button>
          <button>Delete</button>
        </section>
      </main>
    );
  }
}

const mapStateToProps = (state, props) => ({
  session: state.sessions[props.match.params.sessionId]
});

export default connect(mapStateToProps)(Session);
