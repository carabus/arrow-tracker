import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { HeaderBar } from "./header-bar";
import "./landing-page.css";
import recordImg from "../images/record.gif";
import analyzeImg from "../images/analyze.png";
import competeImg from "../images/compete.png";
import { login } from "../actions/auth";
import { DEMO_USERNAME, DEMO_PASSWORD } from "../config";

export class LandingPage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  demoLogin(e) {
    e.preventDefault();
    return this.props.dispatch(login(DEMO_USERNAME, DEMO_PASSWORD));
  }

  render() {
    // If we are logged in redirect straight to the user's dashboard
    if (this.props.loggedIn) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div className="landing-page">
        <header>
          <HeaderBar />
          <div className="view">
            <div className="mask">
              <div className="container">
                <h1>Arrow Tracker</h1>
                <p>
                  Record your archery training scores and see how you rate
                  against other users
                </p>
                <div>
                  <a href="#explore">
                    <button type="button">Explore</button>
                  </a>
                  <Link to="/register">
                    <button type="button">Sign up</button>
                  </Link>
                </div>
                <p>
                  Click{" "}
                  <a href="" className="demo" onClick={e => this.demoLogin(e)}>
                    here
                  </a>{" "}
                  for a demo
                </p>
              </div>
            </div>
          </div>
        </header>
        <main role="main">
          <h2 id="explore">Explore Arrow Tracker</h2>
          <div className="container">
            <div className="row">
              <div className="column-60">
                <div className="box-shadow">
                  <img
                    alt="Video showing scores entering in Arrow Tracker"
                    width="100%"
                    src={recordImg}
                  />
                </div>
              </div>
              <div className="column-40">
                <h3>Record</h3>
                <hr />
                <p>
                  Record your archery training scores easily on your phone and
                  access them anywhere.
                </p>
              </div>
            </div>

            <div className="row">
              <div className="column-40">
                <h3>Analyze</h3>
                <hr />
                <p>
                  Ever had a feeling that your archery is better on Sunday than
                  on Monday? Or that those fancy arrows don't really make a
                  difference? Arrow Tracker helps quantify how external factors
                  affect your training.
                </p>
              </div>
              <div className="column-60">
                <div className="box-shadow">
                  <img
                    alt="Screenshot of a chart used to compare archery training sessions with different training factors"
                    width="100%"
                    src={analyzeImg}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="column-60">
                <div className="box-shadow">
                  <img
                    alt="Screenshot of user Dashboard showing user's rating and scores chart"
                    width="100%"
                    src={competeImg}
                  />
                </div>
              </div>
              <div className="column-40">
                <h3>Compete</h3>
                <hr />
                <p>
                  Arrow Tracker adds a social element to your training by
                  calculating your rank percentile across the whole user base,
                  taking users' training distances into account.
                </p>
              </div>
            </div>
          </div>
        </main>
        <footer>
          <div class="container">
            <div class="menu">
              <ul>
                <li>
                  <a href="/terms.html">Terms of Service</a>
                </li>
                <li>
                  <a href="/privacy-policy.html">Privacy</a>
                </li>
                <li>
                  <p>© Svetlana Raeva 2018</p>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null
});

export default connect(mapStateToProps)(LandingPage);
