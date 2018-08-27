import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import RegistrationForm from "./registration-form";
import appIcon from "../images/app-icon.svg";
import "./login-form.css";

export function RegistrationPage(props) {
  // If we are logged in (which happens automatically when registration
  // is successful) redirect to the user's dashboard
  if (props.loggedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <div className="login-form">
      <main role="main">
        <div className="single-form-container">
          <div className="card">
            <div className="card-header">
              <Link to="/">
                <img className="logo" src={appIcon} alt="Archery Tracker App" />
              </Link>
            </div>
            <div className="card-body">
              <h2>
                <i className="fas fa-pen" /> Sign Up
              </h2>
              <RegistrationForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null
});

export default connect(mapStateToProps)(RegistrationPage);
