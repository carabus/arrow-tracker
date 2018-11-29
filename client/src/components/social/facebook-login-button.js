import React, { Component } from "react";
import { socialLogin } from "../../actions/auth";
import "./facebook-login-button.css";

export default class FacebookLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
  }
  /**
   * Check login status and call login api is user is not logged in
   */
  facebookLogin = () => {
    if (!window.FB) return;

    window.FB.getLoginStatus(response => {
      if (response.status === "connected") {
        this.facebookLoginHandler(response);
      } else {
        window.FB.login(this.facebookLoginHandler, { scope: "public_profile" });
      }
    });
  };

  /**
   * Handle login response
   */
  facebookLoginHandler = response => {
    if (response.status === "connected") {
      window.FB.api("/me", userData => {
        let result = {
          ...response,
          user: userData
        };
        this.setState({ error: "" });
        this.props.dispatch(socialLogin(userData.id, userData.name));
      });
    } else {
      this.setState({ error: "Unable to login with Facebook" });
    }
  };

  render() {
    return (
      <div>
        <button
          className="facebook-login"
          type="button"
          onClick={this.facebookLogin}
        >
          Log in with facebook
        </button>
        <div className="facebook-error">{this.state.error}</div>
      </div>
    );
  }
}
