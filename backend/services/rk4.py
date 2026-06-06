def rk4_step(F, x, u, h):

    k1 = F(x, u)

    k2 = F(
        x + h/2,
        [u[i] + h*k1[i]/2
         for i in range(len(u))]
    )

    k3 = F(
        x + h/2,
        [u[i] + h*k2[i]/2
         for i in range(len(u))]
    )

    k4 = F(
        x + h,
        [u[i] + h*k3[i]
         for i in range(len(u))]
    )

    return [

        u[i] + h/6 * (
            k1[i]
            + 2*k2[i]
            + 2*k3[i]
            + k4[i]
        )

        for i in range(len(u))

    ]