import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import MainHeader from "./main-header";

export function LandingPage(props) {
  window.scrollTo(0, 0);
  // If we are logged in redirect straight to the user's dashboard
  if (props.loggedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <main role="main">
      <MainHeader />
      <section>
        <p>Nock.. Draw.. Loose!</p>
        <p className="max-width">
          Record your archery training scores and see how you rate against other
          app users.
        </p>
        <div className="sub-section">
          <Link to="/register">
            <button className="button-primary">Sign Up Now</button>
          </Link>
        </div>
        <p>
          or <Link to="/login">Log in</Link>
        </p>
      </section>
      <section>
        <header>
          <h2>Track your archery training scores easily on your phone</h2>
        </header>
        <p>
          [<em>placeholder for video of entering scores</em>]
        </p>
      </section>
      <section>
        <header>
          <h2>
            Gain useful insights into you training through interactive charts.
          </h2>
        </header>
        <p>
          [<em>placeholder for video of compare charts</em>]
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>
      <section>
        <header>
          <h2>Find out how you rate against other app users</h2>
        </header>
        <p>
          [<em>placeholder for image related to ratings</em>]
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>
    </main>
  );
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null
});

export default connect(mapStateToProps)(LandingPage);
