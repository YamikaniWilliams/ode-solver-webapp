import React, { useState } from "react";
import "./SolverPage.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Plot from "react-plotly.js";
import * as XLSX from "xlsx";

function SolverPage() {
  const [order, setOrder] = useState(1);

  const [equation, setEquation] = useState("");

  const [x0, setX0] = useState("");
  const [xf, setXf] = useState("");
  const [stepSize, setStepSize] = useState("");

  const [method, setMethod] = useState("");

  const [initialConditions, setInitialConditions] = useState([
  "1",
]);

  const [solution, setSolution] = useState(null);

  const [loading, setLoading] = useState(false);

  const solveODE = async () => {

    if (!equation) {
      alert("Please enter the equation");
      return;
    }

    if (x0 === "") {
      alert("Please enter Initial x (x₀).");
      return;
    }

    if (xf === "") {
      alert("Please enter Final x (xf).");
      return;
    }

    if (stepSize === "") {
      alert("Please enter Step Size (h).");
      return;
    }

    if (Number(xf) <= Number(x0)) {
      alert("Final x must be greater than Initial x");
      return;
    }

    if (!method) {
      alert("Please select a numerical method");
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

      if (!response.ok) {

        const errorData =
          await response.json();

        throw new Error(
          errorData.error
        );

      }

      const data =
        await response.json();

      setSolution(data);
    } catch (error) {

        console.error("FULL ERROR:", error);

        alert(error.message);

        setSolution(null);

      }
     finally {
      setLoading(false);
    }
  };
    const downloadExcel = () => {

    if (!solution || !solution.x) {

      alert("No solution available to download.");

      return;

    }

    const rows = [];

    if (
      solution.euler &&
      solution.heun &&
      solution.rk4
    ) {

      solution.x.forEach((xValue, index) => {

        rows.push({
          ODE: equation,
          "X Value": xValue,
          "Solution (Euler)": solution.euler[index],
          "Solution (Heun)": solution.heun[index],
          "Solution (RK4)": solution.rk4[index]
        });

      });

    } else {

      solution.x.forEach((xValue, index) => {

        rows.push({
          ODE: equation,
          "X Value": xValue,
          [`Solution (${method})`]: solution.y[index]
        });

      });

    }

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "ODE Solution"
    );

    XLSX.writeFile(
      workbook,
      "ODE_Solution.xlsx"
    );

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
                  placeholder="0"
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
                  placeholder="1"
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
                placeholder="0.1"
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

                <option value="ALL">
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

                  setOrder(1);

                  setEquation("");

                  setMethod("");

                  setX0("");

                  setXf("");

                  setStepSize("");

                  setInitialConditions([""]);

                  setSolution(null);

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

            <button
              className="download-btn"
              onClick={downloadExcel}
            >
              Download
            </button>

          </div>

          <div className="solution-content">

            {/* GRAPH */}
            <div className="graph-placeholder">

              {solution && solution.x ? (

                <>

                  <Plot
                    data={
                      solution.euler

                        ? [

                            {
                              x: solution.x,
                              y: solution.euler,
                              type: "scatter",
                              mode: "lines+markers",
                              name: "Euler"
                            },

                            {
                              x: solution.x,
                              y: solution.heun,
                              type: "scatter",
                              mode: "lines+markers",
                              name: "Heun"
                            },

                            {
                              x: solution.x,
                              y: solution.rk4,
                              type: "scatter",
                              mode: "lines+markers",
                              name: "RK4"
                            }

                          ]

                        : [

                            {
                              x: solution.x,
                              y: solution.y,
                              type: "scatter",
                              mode: "lines+markers",
                              name: method
                            }

                          ]
                    }
                    layout={{
                      title: {
                        text: `${method} Solution of y${"'".repeat(order)} = ${equation}`
                      },

                      margin: {
                        l: 80,
                        r: 40,
                        t: 60,
                        b: 80
                      },

                      xaxis: {
                        title: {
                          text: "Independent Variable (x)"
                        },
                        showgrid: true,
                        showline: true,
                        linewidth: 2,
                        mirror: true
                      },

                      yaxis: {
                        title: {
                          text: "Solution y(x)"
                        },
                        showgrid: true,
                        showline: true,
                        linewidth: 2,
                        mirror: true
                      },

                      legend: {
                        orientation: "v"
                      }
                    }}
                    style={{
                      width: "100%",
                      height: "450px"
                    }}
                    useResizeHandler={true}
                  />

                </>

              ) : (

                <p>Graph Will Display Here</p>

              )}

            </div>

            {/* RESULTS */}
            <div
              className="table-placeholder"
              style={{
                overflowY: "visible",
                maxHeight: "none"
              }}
            >

              {loading ? (

                <p>Computing...</p>

              ) : solution && solution.x ? (

                <table
                  style={{
                    width: "100%",
                    textAlign: "center",
                    borderCollapse: "collapse"
                  }}
                >

                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "#f5f5f5",
                      zIndex: 5
                    }}
                  >

                    {solution && solution.euler ? (

                      <tr>

                        <th
                          style={{
                            borderBottom: "2px solid #ccc",
                            padding: "10px",
                            textAlign: "center"
                          }}
                        >
                          X Value
                        </th>

                        <th
                          style={{
                            borderBottom: "2px solid #ccc",
                            padding: "10px",
                            textAlign: "center"
                          }}
                        >
                          Euler Y
                        </th>

                        <th
                          style={{
                            borderBottom: "2px solid #ccc",
                            padding: "10px",
                            textAlign: "center"
                          }}
                        >
                          Heun Y
                        </th>

                        <th
                          style={{
                            borderBottom: "2px solid #ccc",
                            padding: "10px",
                            textAlign: "center"
                          }}
                        >
                          RK4 Y
                        </th>

                      </tr>

                    ) : (

                      <tr>

                        <th
                          style={{
                            borderBottom: "2px solid #ccc",
                            padding: "10px"
                          }}
                        >
                          X Value
                        </th>

                        <th
                          style={{
                            borderBottom: "2px solid #ccc",
                            padding: "10px"
                          }}
                        >
                          Y Value
                        </th>

                      </tr>

                    )}

                  </thead>

                  <tbody>

                    {solution.euler ? (

                      solution.x.map((xValue, index) => (

                        <tr key={index}>

                          <td
                            style={{
                              textAlign: "center",
                              padding: "8px"
                            }}
                          >
                            {Number(xValue).toFixed(4)}
                          </td>

                          <td
                            style={{
                              textAlign: "center",
                              padding: "8px"
                            }}
                          >
                            {Number(solution.euler[index]).toFixed(6)}
                          </td>

                          <td
                            style={{
                              textAlign: "center",
                              padding: "8px"
                            }}
                          >
                            {Number(solution.heun[index]).toFixed(6)}
                          </td>

                          <td
                            style={{
                              textAlign: "center",
                              padding: "8px"
                            }}
                          >
                            {Number(solution.rk4[index]).toFixed(6)}
                          </td>

                        </tr>

                      ))

                    ) : (

                      solution.x.map((xValue, index) => (

                        <tr key={index}>

                          <td
                            style={{
                              textAlign: "center",
                              padding: "8px"
                            }}
                          >
                            {Number(xValue).toFixed(4)}
                          </td>

                          <td
                            style={{
                              textAlign: "center",
                              padding: "8px"
                            }}
                          >
                            {Number(solution.y[index]).toFixed(6)}
                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              ) : (

                <p
                  style={{
                    color: "#9aa0aa",
                    fontSize: "20px",
                    textAlign: "center"
                  }}
                >
                  No solution computed yet.
                </p>

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