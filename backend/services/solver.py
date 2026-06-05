import sys
from sympy import *
from sympy.solvers.ode import dsolve

x = symbols('x')
y = Function('y')

equation = sys.argv[1]

if equation == "y'' - y":
    ode = Eq(y(x).diff(x,2) - y(x), 0)

    solution = dsolve(ode)

    print(solution)

else:
    print("Equation not recognised")