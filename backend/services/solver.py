import sys
import json
import traceback

from parser import build_function

from euler import euler_step
from heun import heun_step
from rk4 import rk4_step

try:

    # -----------------------------
    # Read JSON from Node.js
    # -----------------------------

    raw_input = sys.stdin.read()

    payload = json.loads(raw_input)

    order = int(payload["order"])

    equation = payload["equation"]

    x0 = float(payload["x0"])

    xf = float(payload["xf"])

    h = float(payload["stepSize"])

    method = payload["method"]

    initial_conditions = [
        float(v)
        for v in payload["initialConditions"]
    ]

    # -----------------------------
    # Validation
    # -----------------------------

    if len(initial_conditions) != order:
        raise Exception(
            f"Expected {order} initial conditions but received {len(initial_conditions)}"
        )

    # -----------------------------
    # Build RHS Function
    # -----------------------------

    rhs = build_function(equation)

    # -----------------------------
    # Convert nth-order ODE
    # to first-order system
    # -----------------------------

    def F(x, u):

        result = []

        for i in range(order - 1):
            result.append(u[i + 1])

        result.append(
            rhs(x, u)
        )

        return result

    # ==================================================
    # ALL METHODS MODE
    # ==================================================

    if method == "ALL":

        def solve_with(step_function):

            u = initial_conditions.copy()

            y_values = []

            x = x0

            while x <= xf + 1e-12:

                y_values.append(
                    round(u[0], 10)
                )

                u = step_function(
                    F,
                    x,
                    u,
                    h
                )

                x += h

            return y_values

        euler_solution = solve_with(
            euler_step
        )

        heun_solution = solve_with(
            heun_step
        )

        rk4_solution = solve_with(
            rk4_step
        )

        x_values = []

        x = x0

        while x <= xf + 1e-12:

            x_values.append(
                round(x, 10)
            )

            x += h

        print(
            json.dumps(
                {
                    "x": x_values,
                    "euler": euler_solution,
                    "heun": heun_solution,
                    "rk4": rk4_solution
                }
            )
        )

    # ==================================================
    # SINGLE METHOD MODE
    # ==================================================

    else:

        u = initial_conditions.copy()

        x_values = []
        y_values = []

        x = x0

        while x <= xf + 1e-12:

            x_values.append(
                round(x, 10)
            )

            y_values.append(
                round(u[0], 10)
            )

            if method == "Euler":

                u = euler_step(
                    F,
                    x,
                    u,
                    h
                )

            elif method == "Heun":

                u = heun_step(
                    F,
                    x,
                    u,
                    h
                )

            elif method == "RK4":

                u = rk4_step(
                    F,
                    x,
                    u,
                    h
                )

            else:

                raise Exception(
                    f"Unknown method: {method}"
                )

            x += h

        print(
            json.dumps(
                {
                    "x": x_values,
                    "y": y_values
                }
            )
        )

except Exception:

    print(
        traceback.format_exc(),
        file=sys.stderr
    )

    sys.exit(1)