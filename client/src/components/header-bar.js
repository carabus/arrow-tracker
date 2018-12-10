import React from 'react';
import { connect } from 'react-redux';
import { clearAuth } from '../actions/auth';
import { reset } from '../actions';
import { clearAuthToken } from '../local-storage';
import { Link } from 'react-router-dom';
import appIcon from '../images/app-icon.svg';
import './header-bar.css';

export class HeaderBar extends React.Component {
  logOut(e) {
    this.props.dispatch(clearAuth());
    this.props.dispatch(reset());
    clearAuthToken();
  }

  render() {
    // Only render the log out button if we are logged in
    let menuButton;
    if (this.props.loggedIn) {
      menuButton = (
        <a href="" className="logout" onClick={e => this.logOut(e)}>
          Log out
        </a>
      );
    } else {
      menuButton = (
        <span>
          <Link to="/login">Log in</Link>
          <span style={{ padding: '0 7px', color: '#888' }}>or</span>
          <span style={{ padding: '7px', border: 'white solid 1px' }}>
            <Link to="/register">Sign up</Link>
          </span>
        </span>
      );
    }

    // Build breadcrumb navigation depending on what was passed to the component
    let navigation = null;
    if (this.props.sessionId) {
      navigation = <li>Session</li>;
    }
    if (this.props.sessionId && this.props.endId) {
      navigation = (
        <div>
          <Link to={`/session/${this.props.sessionId}`}>
            <li>Session</li>
          </Link>
          <li>End</li>
        </div>
      );
    }

    return (
      <nav>
        <div className="container">
          <div className="sub-container">
            <div className="logo">
              <Link to={this.props.loggedIn ? '/dashboard' : '/'}>
                <img
                  width="50px"
                  height="50px"
                  src={appIcon}
                  alt="Arrow Tracker App"
                />
              </Link>
            </div>
            <div className="breadcrumb">
              <ul>{navigation}</ul>
            </div>
          </div>
          <div className="menu">
            <ul>
              <li>{menuButton}</li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null
});

export default connect(mapStateToProps)(HeaderBar);
