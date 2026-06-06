import React, { useState } from "react";
import "./SolverPage.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function SolverPage() {
  const [order, setOrder] = useState(2);

  const [equation, setEquation] = useState("");

  const [x0, setX0] = useState(0);

  const [xf, setXf] = useState(10);

  const [stepSize, setStepSize] = useState(0.1);

  const [method, setMethod] = useState("");

  const [initialConditions, setInitialConditions] = useState([
    "",
    "",
  ]);

  const [solution, setSolution] = useState("");

  const [loading, setLoading] = useState(false);

  const solveODE = async () => {
    if (!equation) {
      alert("Please enter the equation");
      return;
    }

    if (!method) {
      alert("Please select a numerical method");
      return;
    }

    if (Number(xf) <= Number(x0)) {
      alert("Final x must be greater than Initial x");
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
            order,
            equation,
            x0,
            xf,
            stepSize,
            initialConditions,
            method,
          }),
        }
      );

      const data = await response.json();

      setSolution(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);

      setSolution("Error connecting to backend");
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

          <div className="panel-top">
            <div>
              <h3>System Parameters</h3>

              <p>
                Differential Equation: y(n) = f(x, y, y', ...)
              </p>
            </div>
          </div>

          <div className="panel-content">

            {/* ORDER */}
            <div className="input-group">

              <label>Order (n):</label>

              <input
                type="number"
                min="1"
                value={order}
                onChange={(e) => {
                  const n = parseInt(e.target.value) || 1;

                  setOrder(n);

                  setInitialConditions(
                    Array(n).fill("")
                  );
                }}
              />

            </div>

            {/* EQUATION */}
            <div className="input-group full-width">

              <label>
                Highest Derivative Function
              </label>

              <input
                type="text"
                placeholder="-y"
                value={equation}
                onChange={(e) =>
                  setEquation(e.target.value)
                }
              />

            </div>

            {/* ROW 1 */}
            <div className="row">

              <div className="input-group">

                <label>
                  Initial x (x₀)
                </label>

                <input
                  type="number"
                  value={x0}
                  onChange={(e) =>
                    setX0(e.target.value)
                  }
                />

              </div>

              <div className="input-group">

                <label>
                  Final x (xf)
                </label>

                <input
                  type="number"
                  value={xf}
                  onChange={(e) =>
                    setXf(e.target.value)
                  }
                />

              </div>

            </div>

            {/* INITIAL CONDITIONS */}
            <div className="input-group full-width">

              <label>
                Initial Conditions
              </label>

              {initialConditions.map(
                (value, index) => (

                  <input
                    key={index}
                    type="number"
                    value={value}
                    placeholder={
                      index === 0
                        ? "y(0)"
                        : `y${"'".repeat(index)}(0)`
                    }
                    onChange={(e) => {
                      const updated = [
                        ...initialConditions,
                      ];

                      updated[index] =
                        e.target.value;

                      setInitialConditions(
                        updated
                      );
                    }}
                    style={{
                      marginBottom: "10px",
                    }}
                  />

                )
              )}

            </div>

            {/* STEP SIZE */}
            <div className="input-group">

              <label>
                Step Size (h)
              </label>

              <input
                type="number"
                step="0.01"
                value={stepSize}
                onChange={(e) =>
                  setStepSize(e.target.value)
                }
              />

            </div>

            {/* METHOD */}
            <div className="input-group">

              <select
                value={method}
                onChange={(e) =>
                  setMethod(e.target.value)
                }
              >

                <option value="" disabled>
                  Select Method
                </option>

                <option value="Euler">
                  Euler Method
                </option>

                <option value="Heun">
                  Improved Euler (Heun)
                </option>

                <option value="RK4">
                  Runge-Kutta 4 (RK4)
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

                  setMethod("");

                  setX0(0);
                  setXf(10);
                  setStepSize(0.1);

                  setInitialConditions(
                    Array(order).fill("")
                  );

                }}
              >
                Clear
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          <div className="solution-header">

            <div>

              <h3>
                Solution
              </h3>

              <p>
                Solution Computed
              </p>

            </div>

            <button className="download-btn">
              Download
            </button>

          </div>

          <div className="solution-content">

            {/* GRAPH */}
            <div className="graph-placeholder">

              Graph Will Display Here

            </div>

            {/* RESULTS */}
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