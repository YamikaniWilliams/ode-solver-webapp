import React, { useState } from "react";
import "./SolverPage.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function SolverPage() {

  const [equation, setEquation] = useState("");
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);


  const solveODE = async () => {

  if (!equation) {
    alert("Please enter an equation");
    return;
  }

  try {

    setLoading(true);

    const response = await fetch(
      "http://localhost:5000/api/solve",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equation: equation,
        }),
      }
    );

    const data = await response.json();

    setSolution(data.solution);

  } catch (error) {

    console.error(error);

    setSolution("Error solving equation");

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="solver-page">

      {/* NAVBAR */}
      <nav className="navbar">

        <Link to="/" className="logo-section">

        <div className="logo-box">
          ODE
        </div>

        <h2 className="logo-text">
          Solver
        </h2>

        </Link>

        <div className="nav-links">
          <a href="/">Examples</a>
          <a href="/">Documentation</a>
          <a href="/">Contact Us</a>
        </div>

        <div className="theme-toggle">
          🌙
        </div>

      </nav>

      {/* HEADER */}
      <div className="solver-header">

        <h1>ODE Numerical Engine</h1>

        <p>
          Configure system parameters, initial value conditions,
          and numerical options to simulate and analyze higher-order
          ordinary differential equations.
        </p>

      </div>

      {/* MAIN PANELS */}
      <div className="panels-container">

        {/* LEFT PANEL */}
        <div className="left-panel">

          {/* PANEL TOP */}
          <div className="panel-top">
            <div>
              <h3>System Parameters</h3>
              <p>
                Differential Equation: y(n) = f(x, y, y', ...)
              </p>
            </div>
          </div>

          {/* PANEL CONTENT */}
          <div className="panel-content">

            {/* EQUATION */}
            <div className="input-group full-width">
              <label>Equation:</label>
              <input
                type="text"
                placeholder="y'' - y"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
              />
            </div>

            {/* ROW 1 */}
            <div className="row">

              <div className="input-group">
                <label>Initial x (x₀):</label>
                <input
                  type="text"
                  placeholder="1"
                />
              </div>

              <div className="input-group">
                <label>Final x (xf):</label>
                <input
                  type="text"
                  placeholder="2.5"
                />
              </div>

            </div>

            {/* ROW 2 */}
            <div className="row">

              <div className="input-group">
                <label>Initial y (y₀):</label>
                <input
                  type="text"
                  placeholder="1"
                />
              </div>

              <div className="input-group">
                <label>Step Size (h):</label>
                <input
                  type="text"
                  placeholder="0.5"
                />
              </div>

            </div>

            {/* METHOD SELECT */}
            <div className="input-group">

              <select>

                <option>
                  Select Method
                </option>

                <option>
                  Euler Method
                </option>

                <option>
                  Improved Euler
                </option>

                <option>
                  Runge-Kutta (RK4)
                </option>

                <option>
                  All Methods
                </option>

              </select>

            </div>

            {/* BUTTONS */}
            <div className="button-row">

              <button
                className="compute-btn"
                onClick={solveODE}
                >
                Compute Solution
              </button>

              <button
                className="clear-btn"
                onClick={() => {
                  setEquation("");
                  setSolution("");
                }}
                >
                Clear
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          {/* SOLUTION HEADER */}
          <div className="solution-header">

            <div>
              <h3>Solution</h3>
              <p>Solution Computed</p>
            </div>

            <button className="download-btn">
              Download
            </button>

          </div>

          {/* SOLUTION CONTENT */}
          <div className="solution-content">

            {/* GRAPH AREA */}
            <div className="graph-placeholder">

              Graph Will Display Here

            </div>

            {/* TABLE AREA */}
            <div className="table-placeholder">

               {loading ? (
                <p>Computing...</p>
              ) : (
                <pre>{solution}</pre>
               )}

            </div>

          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
}

export default SolverPage;