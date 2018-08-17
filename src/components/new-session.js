import React from "react";
import { connect } from "react-redux";
import requiresLogin from "./requires-login";
import { SimpleSessionDetailsForm } from "./simple-session-details-form";
import FormattedDate from "./formatted-date";

export function NewSession(props) {
  const currentDate = new Date();
  return (
    <main role="main">
      <header>
        <h1 className="small">New Training Session</h1>
        <p>
          Started on <FormattedDate date={currentDate} />
        </p>
      </header>
      <SimpleSessionDetailsForm
        startDate={currentDate}
        dispatch={props.dispatch}
        history={props.history}
        trainingFactors={props.trainingFactors}
        isLoading={props.isLoading}
      />
    </main>
  );
}

const mapStateToProps = state => {
  return {
    trainingFactors: state.profileReducer.trainingFactors,
    isLoading: state.archeryTrackerReducer.isLoading
  };
};

export default requiresLogin()(connect(mapStateToProps)(NewSession));
