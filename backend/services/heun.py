def heun_step(F, x, u, h):

    k1 = F(x, u)

    predictor = [

        u[i] + h * k1[i]

        for i in range(len(u))

    ]

    k2 = F(
        x + h,
        predictor
    )

    return [

        u[i] + h/2 * (
            k1[i] + k2[i]
        )

        for i in range(len(u))

    ]