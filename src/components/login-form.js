import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm, focus } from "redux-form";
import { Link, Redirect } from "react-router-dom";
import MainHeader from "./main-header";
import Input from "./input";
import { login } from "../actions/auth";
import { required, nonEmpty } from "../validators";
import "./login-form.css";

export class LoginForm extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  onSubmit(values) {
    return this.props.dispatch(login(values.username, values.password));
  }

  render() {
    if (this.props.loggedIn) {
      return <Redirect to="/dashboard" />;
    }
    let error;
    if (this.props.error) {
      error = (
        <div className="form-error" aria-live="polite">
          {this.props.error}
        </div>
      );
    }
    return (
      <main>
        <MainHeader />
        <section>
          <form
            className="login-form"
            onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}
          >
            <h2>Log in</h2>
            {error}
            <label htmlFor="username">Username</label>
            <Field
              component={Input}
              type="text"
              name="username"
              id="username"
              validate={[required, nonEmpty]}
            />
            <label htmlFor="password">Password</label>
            <Field
              component={Input}
              type="password"
              name="password"
              id="password"
              validate={[required, nonEmpty]}
            />
            <div className="sub-section">
              <button
                className="button-primary"
                disabled={this.props.pristine || this.props.submitting}
              >
                Log in
              </button>
              <Link to="/">
                <button type="button">Cancel</button>
              </Link>
            </div>
          </form>
        </section>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null
});

export default reduxForm({
  form: "login",
  onSubmitFail: (errors, dispatch) => dispatch(focus("login", "username"))
})(connect(mapStateToProps)(LoginForm));
