import React, {
  useState,
  useEffect
} from "react";
import "./SolverPage.css";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Plot from "react-plotly.js";
import * as XLSX from "xlsx";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

function SolverPage() {
  const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";
  const [order, setOrder] = useState(1);

  const [equation, setEquation] = useState("");
  const [showFunctionsHelp, setShowFunctionsHelp] = useState(false);
  const [equationFocused, setEquationFocused] = useState(false);

  const [x0, setX0] = useState("");
  const [xf, setXf] = useState("");
  const [stepSize, setStepSize] = useState("");

  const [method, setMethod] = useState("");

  const [initialConditions, setInitialConditions] = useState([
  "1",
  ]);

  const [solution, setSolution] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] =
    useState("Computing.");

  useEffect(() => {

    if (!loading) return;

    let dots = 1;

    const interval = setInterval(() => {

      dots++;

      if (dots > 3) {
        dots = 1;
      }

      setLoadingText(
        "Computing" + ".".repeat(dots)
      );

    }, 500);

    return () => clearInterval(interval);

  }, [loading]);


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

      setSolution(null);

      setLoading(true);

      const response = await fetch(
       `${API_URL}/api/solve`,
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
   
  function formatEquationPreview(expr) {

  let formatted = expr;

  formatted = formatted
    .replace(/pi/g, "\\pi")
    .replace(/sin\(/g, "\\sin(")
    .replace(/cos\(/g, "\\cos(")
    .replace(/tan\(/g, "\\tan(")
    .replace(/log\(/g, "\\log(");

  formatted = formatted.replace(
    /sqrt\(([^()]*)\)/g,
    "\\sqrt{$1}"
  );

  while (formatted.includes("exp(")) {

    const start = formatted.indexOf("exp(");

    let depth = 0;

    let end = -1;

    for (
      let i = start + 4;
      i < formatted.length;
      i++
    ) {

      if (formatted[i] === "(") {
        depth++;
      }

      else if (formatted[i] === ")") {

        if (depth === 0) {

          end = i;

          break;

        }

        depth--;

      }

    }

    if (end === -1) {
      break;
    }

    const inside = formatted.slice(
      start + 4,
      end
    );

    formatted =
      formatted.slice(0, start)
      +
      `e^{${inside}}`
      +
      formatted.slice(end + 1);

  }

  return formatted;

}

const previewEquation =
  formatEquationPreview(
    equation
  );

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

      
      <nav className="navbar">

        <Link to="/" className="logo-section">
          <div className="logo-box">
            ODE
          </div>

          <h2 className="logo-text">
            Solver
          </h2>
        </Link>

      


      </nav>

  
      <div className="solver-header">

        <h1>ODE Numerical Engine</h1>

        <p>
          Configure system parameters, initial value conditions,
          and numerical options to simulate and analyze higher-order
          ordinary differential equations.
        </p>

      </div>

      
      <div className="panels-container">

        
        <div className="left-panel">

          <div className="panel-top">
            <div>
              <h3>System Parameters</h3>

              <p>
                Differential Equation:&nbsp;
                <InlineMath math={"y^{(n)} = f(x,y,y',y'',\\ldots,y^{(n-1)})"} />
              </p>
            </div>
          </div>

          <div className="panel-content">

            
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

            
            <div className="input-group full-width">

              <label>
                Function ({" "}
                <InlineMath
                  math={"f(x,y,y',y'',\\ldots,y^{(n-1)})"}
                />):
              </label>

              <input
                type="text"
                placeholder="y'' + y' - x"
                value={equation}
                onChange={(e) =>
                  setEquation(e.target.value)
                }
                onFocus={() =>
                  setEquationFocused(true)
                }
                onBlur={() =>
                  setEquationFocused(false)
                }
              />

              <button
                type="button"
                className="functions-help-btn"
                onClick={() =>
                  setShowFunctionsHelp(
                    !showFunctionsHelp
                  )
                }
              >
                {showFunctionsHelp
                  ? "▼ Hide Supported Functions"
                  : "▶ Show Supported Functions"}
              </button>
              {showFunctionsHelp && (

                <div className="functions-help">

                  <table>

                    <thead>
                      <tr>
                        <th>Function</th>
                        <th>Enter As</th>
                      </tr>
                    </thead>

                    <tbody>

                      <tr>
                        <td>Sine</td>
                        <td>sin(x)</td>
                      </tr>

                      <tr>
                        <td>Cosine</td>
                        <td>cos(x)</td>
                      </tr>

                      <tr>
                        <td>Tangent</td>
                        <td>tan(x)</td>
                      </tr>

                      <tr>
                        <td>Square Root</td>
                        <td>sqrt(x)</td>
                      </tr>

                      <tr>
                        <td>Exponential</td>
                        <td>exp(x)</td>
                      </tr>

                      <tr>
                        <td>Natural Log</td>
                        <td>log(x)</td>
                      </tr>

                      <tr>
                        <td>Pi</td>
                        <td>pi</td>
                      </tr>

                    </tbody>

                  </table>

                </div>

              )}


              {
                equationFocused && equation && (

                  <div className="equation-preview">

                    <InlineMath
                      math={`y${"'".repeat(order)}=${previewEquation}`}
                    />

                  </div>

                )
              }

            </div>

            
            <div className="row">

              <div className="input-group">

                <label>
                  Initial x:
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
                  Final x:
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

          
            <div className="input-group full-width">

              <label>
                Initial Conditions:
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

           
            <div className="input-group">

              <label>
                Step Size (h):
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

            
            <div className="input-group">

              <select
                className="method-select"
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

    
        <div className="right-panel">

          <div className="solution-header">

            <div>

              <h3>
                Solution
              </h3>

              <p>
                {loading
                  ? "Computing..."
                  : solution
                    ? "Solution Computed"
                    : "No solution computed yet"}
              </p>

            </div>

            {solution && (

              <button
                className="download-btn"
                onClick={downloadExcel}
              >
                Download
              </button>

            )}

          </div>

          <div className="solution-content">

            
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
                              mode: "lines",
                              name: "Euler"
                            },

                            {
                              x: solution.x,
                              y: solution.heun,
                              type: "scatter",
                              mode: "lines",
                              name: "Heun"
                            },

                            {
                              x: solution.x,
                              y: solution.rk4,
                              type: "scatter",
                              mode: "lines",
                              name: "RK4"
                            }

                          ]

                        : [

                            {
                              x: solution.x,
                              y: solution.y,
                              type: "scatter",
                              mode: "lines",
                              name: method
                            }

                          ]
                    }
                    layout={{
                      autosize: true,

                      title: {
                        text: `${method} Numerical Solution`,
                        x: 0.5,
                        xanchor: "center",
                        font: {
                          size: window.innerWidth < 768 ? 16 : 22,
                          family: "Poppins"
                        }
                      },

                      paper_bgcolor: "white",
                      plot_bgcolor: "white",

                      margin: {
                        l: window.innerWidth < 768 ? 50 : 70,
                        r: window.innerWidth < 768 ? 15 : 30,
                        t: window.innerWidth < 768 ? 45 : 60,
                        b: window.innerWidth < 768 ? 55 : 70
                      },

                      xaxis: {
                        title: {
                          text: "x",
                          font: {
                            size: window.innerWidth < 768 ? 13 : 16
                          }
                        },

                        tickfont: {
                          size: window.innerWidth < 768 ? 11 : 14
                        },

                        showgrid: true,
                        zeroline: false,
                        showline: true,
                        linewidth: 2,
                        mirror: true
                      },

                      yaxis: {
                        title: {
                          text: "y(x)",
                          font: {
                            size: window.innerWidth < 768 ? 13 : 16
                          }
                        },

                        tickfont: {
                          size: window.innerWidth < 768 ? 11 : 14
                        },

                        showgrid: true,
                        zeroline: false,
                        showline: true,
                        linewidth: 2,
                        mirror: true
                      },

                      legend: {
                        orientation: "h",
                        x: 0.5,
                        xanchor: "center",
                        y: -0.18,
                        font: {
                          size: window.innerWidth < 768 ? 11 : 13
                        }
                      }
                    }}
                    style={{
                      width: "100%",
                      height: window.innerWidth < 768
                        ? "300px"
                        : "460px"
                    }}
                    useResizeHandler={true}
                    config={{
                      responsive: true,
                      displaylogo: false,

                      modeBarButtonsToRemove: [
                        "lasso2d",
                        "select2d",
                        "zoomIn2d",
                        "zoomOut2d",
                        "toggleSpikelines",
                        "hoverCompareCartesian",
                        "hoverClosestCartesian"
                      ],

                      displayModeBar: true
                    }}
                  />

                </>

              ) : (

                <p>Graph Will Display Here</p>

              )}

            </div>

            
            <div
              className="table-placeholder"
              style={{
                overflowY: "visible",
                maxHeight: "none"
              }}
            >

              {loading ? (
                <div className="loading-placeholder">
                  {loadingText}
                </div>
              )  : solution && solution.x ? (

              <div className="table-container">
                <table className="solution-table">

                  <thead>

                    {solution && solution.euler ? (

                      <tr>

                        <th>
                          X Value
                        </th>

                        <th>
                          Euler Y
                        </th>

                        <th>
                          Heun Y
                        </th>

                        <th>
                          RK4 Y
                        </th>

                      </tr>

                    ) : (

                      <tr>

                        <th>
                          X Value
                        </th>

                        <th>
                          Y Value
                        </th>

                      </tr>

                    )}

                  </thead>

                  <tbody>

                    {solution.euler ? (

                      solution.x.map((xValue, index) => (

                        <tr key={index}>

                          <td>
                            {Number(xValue).toFixed(4)}
                          </td>

                          <td>
                            {Number(solution.euler[index]).toFixed(6)}
                          </td>

                          <td>
                            {Number(solution.heun[index]).toFixed(6)}
                          </td>

                          <td>
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
                </div>

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