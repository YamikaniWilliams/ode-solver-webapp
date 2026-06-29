import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {

  return (

    <footer className="footer">

     
      <div className="footer-top">

       
        <div className="footer-brand">

          <div className="footer-logo">

            <div className="footer-logo-box">
              ODE
            </div>

            <h2>
              Solver
            </h2>

          </div>

          <p>
            An open-source numerical engine for any order
            Ordinary Differential Equations. Bridging the gap
            between computational precision and accessible web visualization.
          </p>

        </div>

        
        <div className="footer-column">

          <h4>
            Resources
          </h4>

          <Link to="/solver">
            Interactive Solver
          </Link>

          <a href="/">
            Documentation
          </a>

          <a href="/">
            Mathematical Examples
          </a>

        </div>

        
        <div className="footer-column">

          <h4>
            Contact Us
          </h4>

          <a
            href="mailto:odesolverapp@gmail.com?subject=General%20Inquiry"
            className="footer-email"
          >
            odesolverapp@gmail.com
          </a>

        </div>

        
        <div className="footer-column">

          <h4>
            Project Metadata
          </h4>

          <Link to="/license">
            License & Copyright
          </Link>

          <a
            href="mailto:odesolverapp@gmail.com?subject=Bug%20Report&body=Please%20describe%20the%20bug%20you%20encountered.%0A%0ADevice:%20%0ABrowser:%20%0ASteps%20to%20reproduce:%20%0A%0AExpected%20behavior:%20%0AActual%20behavior:%20"
            className="footer-link"
          >
            Report a Bug
          </a>

        </div>

      </div>

      
      <div className="footer-line"></div>

      
      <div className="footer-bottom">

        <p>
          © 2026 ODESolver.org
        </p>

        <p>
          Accessible, precise and academically grounded
        </p>

      </div>

    </footer>

  );
}

export default Footer;