from sympy import symbols
from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application
)

def build_function(expression):

    # -----------------------------------
    # Convert derivative notation
    # -----------------------------------

    expression = expression.replace("y''''", "y4")
    expression = expression.replace("y'''", "y3")
    expression = expression.replace("y''", "y2")
    expression = expression.replace("y'", "y1")

    # -----------------------------------
    # Convert powers
    # -----------------------------------

    expression = expression.replace("^", "**")

    # -----------------------------------
    # Define symbols
    # -----------------------------------

    x = symbols("x")

    y = symbols("y")
    y1 = symbols("y1")
    y2 = symbols("y2")
    y3 = symbols("y3")
    y4 = symbols("y4")

    transformations = (
        standard_transformations
        + (
            implicit_multiplication_application,
        )
    )

    try:

        expr = parse_expr(
            expression,
            transformations=transformations,
            local_dict={
                "x": x,
                "y": y,
                "y1": y1,
                "y2": y2,
                "y3": y3,
                "y4": y4
            }
        )

    except Exception:

        raise Exception(
            f"Invalid mathematical expression: '{expression}'"
        )

    # -----------------------------------
    # Numerical evaluator
    # -----------------------------------

    def f(x_value, state):

        substitutions = {
            x: x_value,
            y: state[0]
        }

        if len(state) > 1:
            substitutions[y1] = state[1]

        if len(state) > 2:
            substitutions[y2] = state[2]

        if len(state) > 3:
            substitutions[y3] = state[3]

        if len(state) > 4:
            substitutions[y4] = state[4]

        try:

            value = expr.evalf(
                subs=substitutions
            )

            return float(value)

        except Exception:

            raise Exception(
                "Unable to evaluate the equation. "
                "Check that the selected ODE order matches the derivatives used in the equation."
            )

    return f