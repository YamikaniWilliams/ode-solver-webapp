import React from "react";
import "./Footer.css";

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

          <a href="/">
            Interactive Solver
          </a>

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

          <a href="/">
            odesolverapp@gmail.com
          </a>

        </div>

        
        <div className="footer-column">

          <h4>
            Project Metadata
          </h4>

          <a href="/">
            MIT License
          </a>

          <a href="/">
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