# ODE Solver

A web-based application for solving **Ordinary Differential Equations (ODEs)** using numerical methods. The application supports first-, second-, third-, and fourth-order ordinary differential equations and provides accurate numerical approximations, graphical visualization, solution tables, and Excel export.

---

## Live Demo

**Application:**  
https://ode-solver-frontend.onrender.com

**Backend API:**  
https://ode-solver-webapp.onrender.com

---

## Features

- Solve first-, second-, third-, and fourth-order ordinary differential equations.
- Supports the following numerical methods:
  - Euler Method
  - Improved Euler (Heun) Method
  - Fourth-Order Runge-Kutta (RK4)
  - Compare All Methods
- Interactive solution graphs.
- Numerical solution tables.
- Export computed solutions to Microsoft Excel (.xlsx).
- Mathematical equation preview using LaTeX.
- Built-in guide for supported mathematical functions.
- Responsive design for desktop, tablet, and mobile devices.
- Professional input validation and user-friendly error messages.

---

## Supported Mathematical Functions

The solver accepts the following mathematical functions and constants:

| Function | Example |
|----------|---------|
| Sine | `sin(x)` |
| Cosine | `cos(x)` |
| Tangent | `tan(x)` |
| Exponential | `exp(x)` |
| Natural Logarithm | `log(x)` |
| Square Root | `sqrt(x)` |
| Absolute Value | `abs(x)` |
| Pi | `pi` |

---

## Technologies Used

### Frontend

- React.js
- React Router
- Plotly.js
- KaTeX
- XLSX
- CSS3

### Backend

- Node.js
- Express.js
- Python
- SymPy

---

## Numerical Methods

The application implements the following numerical techniques:

- Euler Method
- Improved Euler (Heun) Method
- Fourth-Order Runge-Kutta (RK4)

These methods allow users to compare numerical approximations and evaluate the accuracy of different solution techniques.

---

## Installation

### Clone the repository

```bash
git clone https://github.com/YamikaniWilliams/ode-solver-webapp.git
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
pip install -r requirements.txt
npm start
```

---

## How to Use

1. Select the order of the differential equation.
2. Enter the right-hand side function
   `f(x, y, y′, y″, …, y⁽ⁿ⁻¹⁾)`.
3. Enter the initial conditions.
4. Specify the initial value of **x**, the final value of **x**, and the step size.
5. Choose a numerical method.
6. Click **Compute Solution**.
7. View the graph and numerical solution table.
8. Download the computed solution as an Excel file if required.

---

## Project Structure

```
ode-solver/
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── parser.py
│   ├── solver.py
│   ├── server.js
│   ├── requirements.txt
│   └── package.json
│
├── LICENSE
└── README.md
```

---

## Future Improvements

Planned enhancements include:

- Support for higher-order differential equations.
- Systems of ordinary differential equations.
- Adaptive step-size numerical methods.
- Analytical (exact) solution support.
- Error analysis and convergence comparison.
- PDF report generation.
- Additional visualization options.
- Dark mode.

---

## Author

**Yamikani Williams**

Email: **odesolverapp@gmail.com**

GitHub: **https://github.com/YamikaniWilliams**

---

## License

This project is licensed under the **MIT License**. See the LICENSE file for details.
