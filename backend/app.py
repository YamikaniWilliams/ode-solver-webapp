from flask import Flask, request, jsonify
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)

# =============================
# SAFE FUNCTION PARSER
# =============================
def evaluate_function(expr, x, y):
    allowed = {
        "x": x,
        "y": y,
        "sin": math.sin,
        "cos": math.cos,
        "exp": math.exp,
        "log": math.log,
        "sqrt": math.sqrt
    }
    return eval(expr, {"__builtins__": {}}, allowed)


# =============================
# METHODS
# =============================
def euler(f, x0, y0, h, n):
    x, y = x0, y0
    xs, ys = [], []

    for _ in range(n):
        xs.append(x)
        ys.append(y)
        y += h * f(x, y)
        x += h

    return xs, ys


def heun(f, x0, y0, h, n):
    x, y = x0, y0
    xs, ys = [], []

    for _ in range(n):
        xs.append(x)
        ys.append(y)

        k1 = f(x, y)
        k2 = f(x + h, y + h * k1)

        y += (h / 2) * (k1 + k2)
        x += h

    return xs, ys


def rk4(f, x0, y0, h, n):
    x, y = x0, y0
    xs, ys = [], []

    for _ in range(n):
        xs.append(x)
        ys.append(y)

        k1 = f(x, y)
        k2 = f(x + h/2, y + h*k1/2)
        k3 = f(x + h/2, y + h*k2/2)
        k4 = f(x + h, y + h*k3)

        y += (h/6)*(k1 + 2*k2 + 2*k3 + k4)
        x += h

    return xs, ys


# =============================
# API
# =============================
@app.route("/solve", methods=["POST"])
def solve():
    data = request.json

    expr = data["function"]
    x0 = float(data["x0"])
    y0 = float(data["y0"])
    h = float(data["h"])
    x_final = float(data["x_final"])
    method = data["method"]

    n = int((x_final - x0) / h)

    f = lambda x, y: evaluate_function(expr, x, y)

    if method == "all":
        ex, ey = euler(f, x0, y0, h, n)
        hx, hy = heun(f, x0, y0, h, n)
        rx, ry = rk4(f, x0, y0, h, n)

        return jsonify({
            "euler": {"x": ex, "y": ey},
            "heun": {"x": hx, "y": hy},
            "rk4": {"x": rx, "y": ry}
        })

    if method == "euler":
        xs, ys = euler(f, x0, y0, h, n)
    elif method == "heun":
        xs, ys = heun(f, x0, y0, h, n)
    else:
        xs, ys = rk4(f, x0, y0, h, n)

    return jsonify({"x": xs, "y": ys})


if __name__ == "__main__":
    app.run(debug=True)