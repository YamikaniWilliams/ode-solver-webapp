def euler_step(F, x, u, h):

    return [

        u[i] + h * F(x, u)[i]

        for i in range(len(u))

    ]