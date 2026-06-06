const express = require("express");
const router = express.Router();

const { spawn } = require("child_process");

router.post("/", (req, res) => {

  const python = spawn(
    "python",
    ["./services/solver.py"]
  );

  let result = "";
  let error = "";

  python.stdin.write(
    JSON.stringify(req.body)
  );

  python.stdin.end();

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.stderr.on("data", (data) => {
    error += data.toString();
  });

  python.on("close", () => {

    if (error) {

      return res.status(500).json({
        error
      });

    }

    try {

      res.json(
        JSON.parse(result)
      );

    } catch {

      res.status(500).json({
        error: "Invalid response from Python"
      });

    }

  });

});

module.exports = router;