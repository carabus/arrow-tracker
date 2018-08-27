import React from "react";
import { connect } from "react-redux";
import requiresLogin from "./requires-login";
import { SimpleSessionDetailsForm } from "./simple-session-details-form";
import FormattedDate from "./formatted-date";
import HeaderBar from "./header-bar";
import "./session.css";

export function NewSession(props) {
  const currentDate = new Date();
  return (
    <div className="session">
      <HeaderBar />
      <main role="main">
        <section className="card">
          <div className="card-header">
            <div className="flex-header">
              <header>
                <h1 className="small">New Training Session</h1>
              </header>
            </div>
            <p className="centered-text">
              Started on <FormattedDate date={currentDate} />
            </p>
          </div>
          <div className="card-body">
            <SimpleSessionDetailsForm
              startDate={currentDate}
              dispatch={props.dispatch}
              history={props.history}
              trainingFactors={props.trainingFactors}
              isLoading={props.isLoading}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    trainingFactors: state.profileReducer.trainingFactors,
    isLoading: state.archeryTrackerReducer.isLoading
  };
};

export default requiresLogin()(connect(mapStateToProps)(NewSession));
