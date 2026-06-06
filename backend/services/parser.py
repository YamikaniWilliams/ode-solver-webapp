import math

def build_function(expression):

    allowed = {
        "sin": math.sin,
        "cos": math.cos,
        "tan": math.tan,
        "exp": math.exp,
        "sqrt": math.sqrt,
        "pi": math.pi
    }

    def f(x, state):

        scope = {
            "x": x,
            "y": state[0]
        }

        for i in range(1, len(state)):
            scope[f"y{i}"] = state[i]

        scope.update(allowed)

        return eval(
            expression,
            {"__builtins__": None},
            scope
        )

    return f