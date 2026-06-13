import re

from sympy import (
    symbols,
    lambdify
)

from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application
)


def build_function(expression):

    expression = expression.replace(
        "y''''",
        "y4"
    )

    expression = expression.replace(
        "y'''",
        "y3"
    )

    expression = expression.replace(
        "y''",
        "y2"
    )

    expression = expression.replace(
        "y'",
        "y1"
    )



    expression = expression.replace(
        "^",
        "**"
    )



    expression = re.sub(
        r'([a-zA-Z0-9])(?=(sin|cos|tan|exp|log|sqrt)\()',
        r'\1*',
        expression
    )



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

    

        numeric_function = lambdify(
            (
                x,
                y,
                y1,
                y2,
                y3,
                y4
            ),
            expr,
            "math"
        )

    except Exception:

        raise Exception(
            f"Invalid mathematical expression: '{expression}'"
        )


    def f(x_value, state):

        try:

            return float(
                numeric_function(
                    x_value,
                    state[0] if len(state) > 0 else 0,
                    state[1] if len(state) > 1 else 0,
                    state[2] if len(state) > 2 else 0,
                    state[3] if len(state) > 3 else 0,
                    state[4] if len(state) > 4 else 0
                )
            )

        except Exception:

            raise Exception(
                "Unable to evaluate the equation. "
                "Check that the selected ODE order matches the derivatives used in the equation."
            )

    return f