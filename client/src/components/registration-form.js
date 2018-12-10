import React from 'react';
import { Field, reduxForm, focus } from 'redux-form';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { registerUser } from '../actions/users';
import { login, clearAuthError } from '../actions/auth';
import Input from './input';
import { required, nonEmpty, matches, length, isTrimmed } from '../validators';
import './login-form.css';
import FacebookLogin from './social/facebook-login-button';
import { HeaderBar } from './header-bar';
import { LandingHeader } from './landing-header';

const passwordLength = length({ min: 4, max: 72 });
const matchesPassword = matches('password');

export class RegistrationForm extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.dispatch(clearAuthError());
  }
  onSubmit(values) {
    const { username, password, name } = values;
    const user = { username, password, name };
    return this.props
      .dispatch(registerUser(user))
      .then(() => this.props.dispatch(login(username, password)));
  }

  render() {
    if (this.props.loggedIn) {
      return <Redirect to="/dashboard" />;
    }
    let error;

    if (this.props.error) {
      error = (
        <div className="form-error" aria-live="polite">
          There was an error.
        </div>
      );
    }

    return (
      <div className="landing-page">
        <header style={{ minHeight: '850px' }}>
          <HeaderBar />
          <LandingHeader>
            <div className="login-form">
              <div className="single-form-container">
                <div className="card">
                  <div className="card-body">
                    <h2>
                      <i className="fas fa-pen" /> Sign up
                    </h2>
                    <form
                      className="login-form"
                      onSubmit={this.props.handleSubmit(values =>
                        this.onSubmit(values)
                      )}
                    >
                      {error}
                      <div className="form-section">
                        <label htmlFor="firstName">Name</label>
                        <Field component={Input} type="text" name="name" />
                      </div>
                      <div className="form-section">
                        <label htmlFor="username">Username</label>
                        <Field
                          component={Input}
                          type="text"
                          name="username"
                          validate={[required, nonEmpty, isTrimmed]}
                        />
                      </div>
                      <div className="form-section">
                        <label htmlFor="password">Password</label>
                        <Field
                          component={Input}
                          type="password"
                          name="password"
                          validate={[required, passwordLength, isTrimmed]}
                        />
                      </div>
                      <div className="form-section">
                        <label htmlFor="passwordConfirm">
                          Confirm password
                        </label>
                        <Field
                          component={Input}
                          type="password"
                          name="passwordConfirm"
                          validate={[required, nonEmpty, matchesPassword]}
                        />
                      </div>
                      <div className="sub-section centered-text">
                        <button
                          className="button-primary"
                          type="submit"
                          disabled={
                            this.props.pristine || this.props.submitting
                          }
                        >
                          Sign Up
                        </button>
                      </div>
                    </form>
                    <div className="sub-section">
                      <FacebookLogin dispatch={this.props.dispatch} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </LandingHeader>
        </header>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null,
  error: state.auth.error
});

export default reduxForm({
  form: 'registration',
  onSubmitFail: (errors, dispatch) =>
    dispatch(focus('registration', Object.keys(errors)[0]))
})(connect(mapStateToProps)(RegistrationForm));
