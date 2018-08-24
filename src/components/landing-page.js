import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { HeaderBar } from "./header-bar";
import "./landing-page.css";

export function LandingPage(props) {
  window.scrollTo(0, 0);
  // If we are logged in redirect straight to the user's dashboard
  if (props.loggedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div class="landing-page">
      <header>
        <HeaderBar />
        <div className="view">
          <div className="mask">
            <div className="container">
              <h1>Archery Tracker</h1>
              <p>
                Record your archery training scores and see how you rate against
                other users
              </p>
              <div>
                <a href="#explore">
                  <button type="button">Explore</button>
                </a>
                <Link to="/register">
                  <button type="button">Sign up</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main role="main">
        <h2 id="explore">Explore Archery Tracker</h2>
        <div className="container">
          <div className="row">
            <div className="column-60">
              <div className="box-shadow">
                <img
                  width="100%"
                  height="100%"
                  src="http://lorempixel.com/400/200/nature/3"
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
                Ever had a feeling that your archery is better on Sunday then on
                Monday? Or that those fancy arrows don't really make a
                difference? Archery Tracker helps quantify how external factors
                affect your training.
              </p>
            </div>
            <div className="column-60">
              <div className="box-shadow">
                <img
                  width="100%"
                  height="100%"
                  src="http://lorempixel.com/400/200/nature/2"
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="column-60">
              <div className="box-shadow">
                <img
                  width="100%"
                  height="100%"
                  src="http://lorempixel.com/400/200/nature/2"
                />
              </div>
            </div>
            <div className="column-40">
              <h3>Compete</h3>
              <hr />
              <p>
                Archery Tracker adds a social element to you training by
                calculating your rank percentile across the whole user base,
                taking users training distances into account.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>Photo by Andreas Overland</p>
      </footer>
    </div>
  );
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null
});

export default connect(mapStateToProps)(LandingPage);
