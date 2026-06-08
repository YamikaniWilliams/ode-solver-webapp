import sys
import json

from parser import build_function

from euler import euler_step
from heun import heun_step
from rk4 import rk4_step

try:

    # -----------------------------
    # Read JSON from Node.js
    # -----------------------------

    payload = json.loads(
        sys.stdin.read()
    )

    order = int(payload["order"])

    equation = payload["equation"].strip()

    if payload["x0"] == "":
        raise Exception(
            "Please enter Initial x (x₀)."
        )

    if payload["xf"] == "":
        raise Exception(
            "Please enter Final x (xf)."
        )

    if payload["stepSize"] == "":
        raise Exception(
            "Please enter Step Size (h)."
        )

    if payload["method"] == "":
        raise Exception(
            "Please select a numerical method."
        )

    x0 = float(payload["x0"])

    xf = float(payload["xf"])

    h = float(payload["stepSize"])

    method = payload["method"]

    # -----------------------------
# Validate Initial Conditions
# -----------------------------

    for i, value in enumerate(
        payload["initialConditions"]
    ):

        if str(value).strip() == "":

            if i == 0:

                raise Exception(
                    "Please enter y(0)."
                )

            else:

                derivative = "'" * i

                raise Exception(
                    f"Please enter y{derivative}(0)."
                )

    initial_conditions = [
        float(v)
        for v in payload["initialConditions"]
    ]

    # -----------------------------
    # Detect highest derivative
    # -----------------------------

    highest_derivative = 0

    if "y''''" in equation:
        highest_derivative = 4

    elif "y'''" in equation:
        highest_derivative = 3

    elif "y''" in equation:
        highest_derivative = 2

    elif "y'" in equation:
        highest_derivative = 1

    if highest_derivative > order:

        derivative_name = (
            "y" + ("'" * highest_derivative)
        )

        raise Exception(
            f"You selected Order = {order}, "
            f"but the equation contains "
            f"{derivative_name}. "
            f"Increase the order to at least "
            f"{highest_derivative}."
        )

    # -----------------------------
    # Build RHS Function
    # -----------------------------

    rhs = build_function(
        equation
    )

    # -----------------------------
    # Convert nth-order ODE
    # into first-order system
    # -----------------------------

    def F(x, u):

        result = []

        for i in range(order - 1):

            result.append(
                u[i + 1]
            )

        result.append(
            rhs(x, u)
        )

        return result

    # ==================================================
    # ALL METHODS MODE
    # ==================================================

    if method == "ALL":

        def solve_with(step_function):

            u = (
                initial_conditions.copy()
            )

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

        u = (
            initial_conditions.copy()
        )

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

except Exception as e:

    print(
        str(e),
        file=sys.stderr
    )

    sys.exit(1)