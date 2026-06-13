// App.js
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Link } from "react-router-dom";
import graphImg from "../assets/graph.png";
import eulerImg from "../assets/euler.png";
import improvedImg from "../assets/improved.png";
import rk4Img from "../assets/RK4.png";

function Home() {
  const navigate = useNavigate();
  const graphs = [
    {
      image: graphImg,
      title: "Method Comparison"
    },

    {
      image: eulerImg,
      title: "Euler Method"
    },

    {
      image: improvedImg,
      title: "Improved Euler Method"
    },

    {
      image: rk4Img,
      title: "Runge-Kutta (RK4)"
    }
  ];
  const [currentGraph, setCurrentGraph] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrentGraph((prev) =>
        prev === graphs.length - 1 ? 0 : prev + 1
      );

    }, 3000);

    return () => clearInterval(interval);

  }, [paused, graphs.length]);

  return (
    <div className="app">
      

      <nav className="navbar">
        <Link to="/" className="logo-section">
        <div className="logo-box">
          ODE
        </div>

        <h2 className="logo-text">
          Solver
        </h2>

        </Link>

      </nav>


      <section className="hero">


        <div className="hero-left">

          <h1 className="hero-title">
            The n<sup>th</sup> Order
            <br />
            <span>Numerical</span>
            <br />
            <span>ODE Solver</span>
          </h1>

          <p className="hero-description">
            A numerical framework for solving n<sup>th</sup> order Ordinary
            Differential Equations using Euler Improved
            Euler and Runge-Kutta Methods.
          </p>

          <button
            className="launch-btn"
            onClick={() => navigate("/solver")}
            >
            Launch Solver
          </button>

        </div>


        <div className="hero-right">

          <div
  className="graph-wrapper"
  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
>


  <div className="graph-title">

    {graphs[currentGraph].title}

  </div>


  <img
    src={graphs[currentGraph].image}
    alt="ODE Graph"
    className="graph-image"
  />

</div>

        </div>

      </section>
      
      <Footer />

    </div>
  );
}

export default Home;