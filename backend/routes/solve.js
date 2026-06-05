const express = require("express");
const router = express.Router();

const { spawn } = require("child_process");

router.post("/", (req, res) => {
  const equation = req.body.equation;

  const python = spawn("python", [
    "./services/solver.py",
    equation
  ]);

  let result = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.on("close", () => {
    res.json({
      solution: result.trim(),
    });
  });
});

module.exports = router;