import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./LicensePage.css";

function LicensePage() {
  return (
    <div className="license-page">

      {/* Header */}

      <nav className="navbar">

        <Link className="logo-section" to="/">

            <div className="logo-box">
            ODE
            </div>

            <span className="logo-text">
            Solver
            </span>

        </Link>

        <div className="nav-links">

            <Link to="/solver">
            Interactive Solver
            </Link>

        </div>

        </nav>

      {/* Content */}

      <div className="license-container">

        <h1>License & Copyright</h1>

        <p className="license-version">
          ODE Solver Version 1.0.0
        </p>

        <div className="license-card">

          <h2>Copyright</h2>

          <p>
            <strong>Copyright © 2026 Yamikani Williams.</strong>
          </p>

          <p>
            <strong>All Rights Reserved.</strong>
          </p>

          <hr />

          <h2>Software License</h2>

          <p>
            This software, including its source code,
            algorithms, user interface, documentation,
            graphics, and all associated materials,
            is the intellectual property of
            <strong> Yamikani Williams</strong>.
          </p>

          <p>
            No part of this software may be copied,
            reproduced, modified, distributed,
            published, sublicensed, transmitted,
            or sold without the prior written
            permission of the author.
          </p>

          <p>
            Unauthorized use, reproduction,
            reverse engineering, modification,
            or redistribution of this software
            is strictly prohibited and may
            violate applicable copyright laws.
          </p>

          <hr />

          <h2>Permission Requests</h2>

          <p>
            Requests to use, reproduce,
            modify, or distribute this
            software should be directed to:
          </p>

          <p>

            <strong>Email</strong>

            <br />

            <a href="mailto:odesolverapp@gmail.com">
              odesolverapp@gmail.com
            </a>

          </p>

          <hr />

          <h2>About the Project</h2>

          <p>
            ODE Solver is a web-based academic
            application developed to provide an
            accessible platform for solving
            ordinary differential equations
            using numerical methods including
            Euler, Improved Euler (Heun),
            and Fourth-Order Runge-Kutta (RK4).
          </p>

        </div>

        <Link className="back-home" to="/">
          ← Back to Home
        </Link>

      </div>

      <Footer />

    </div>
  );
}

export default LicensePage;