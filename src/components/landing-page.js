import React from "react";

export default function Dashboard(props) {
  return (
    <main role="main">
      <header role="banner">
        <h1>Archery Tracker</h1>
      </header>
      <section>
        <header>
          <h3>Track your archery training scores easily on your phone</h3>
        </header>
        <p>
          [<em>placeholder for video of entering scores</em>]
        </p>
      </section>
      <section>
        <header>
          <h3>
            Gain useful insights into you training through interactive charts.
          </h3>
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
          <h3>Find out how you rate against other app users</h3>
        </header>
        <p>
          [<em>placeholder for image related to ratings/ competition</em>]
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
          <h3>Start Now</h3>
        </header>
        <form className="signup-form">
          <div>
            <label htmlFor="first-name">First name</label>
            <input
              placeholder="First Name"
              type="text"
              name="first-name"
              id="first-name"
            />
          </div>
          <div>
            <label htmlFor="last-name">Last name</label>
            <input
              type="text"
              name="last-name"
              id="last-name"
              placeholder="Last Name"
            />
          </div>
          <div>
            <label htmlFor="username">Email</label>
            <input type="text" name="username" id="username" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </section>
    </main>
  );
}
