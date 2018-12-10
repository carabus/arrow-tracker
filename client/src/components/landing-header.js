import React from 'react';
import { Link } from 'react-router-dom';

export const LandingContent = () => (
  <div style={{ textAlign: 'left' }}>
    <div className="sub-section">
      <h1>Arrow Tracker</h1>
    </div>
    <div className="sub-section">
      <p>
        Record your archery training scores and see how you rate against other
        users
      </p>
    </div>
    <div className="sub-section">
      <a href="#explore">
        <button type="button" className="landing-page-button">
          Explore
        </button>
      </a>
      <Link to="/register">
        <button type="button" className="landing-page-button">
          Sign up
        </button>
      </Link>
    </div>
  </div>
);

export const LandingHeader = ({ children }) => (
  <div className="view">
    <div className="mask">
      <div className="container">
        <div className="row">
          <div className="column-50">{children}</div>
        </div>
      </div>
    </div>
  </div>
);
