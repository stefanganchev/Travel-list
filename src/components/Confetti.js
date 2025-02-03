import { React, useEffect } from "react";

export default function Confetti() {
  class Confetti {
    constructor() {
      this.container = null;
      this.confettiColors = [
        "#ff0000",
        "#00ff00",
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#00ffff",
      ];
      this.confettiCount = 300;
      this.confettis = [];
    }

    createContainer() {
      // Remove any existing container
      const existingContainer = document.querySelector(".confetti-container");
      if (existingContainer) {
        existingContainer.remove();
      }

      this.container = document.createElement("div");
      this.container.className = "confetti-container";
      document.body.appendChild(this.container);
    }

    createConfetti() {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.backgroundColor =
        this.confettiColors[
          Math.floor(Math.random() * this.confettiColors.length)
        ];

      // Start from bottom center
      const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
      const startY = window.innerHeight + 10;

      return {
        element: confetti,
        x: startX,
        y: startY,
        speed: 5 + Math.random() * 3, // Reduced from 15 + Math.random() * 5
        angle: -Math.PI / 2 + (Math.random() - 0.5) * 1, // Upward angle with spread
        spin: (Math.random() - 0.5) * 0.2,
        opacity: 1,
      };
    }

    animate() {
      this.confettis = this.confettis.filter((confetti) => {
        // Update position
        confetti.speed *= 0.999; // Changed from 0.99 - higher number = slower decay
        confetti.y -= Math.cos(confetti.angle) * confetti.speed;
        confetti.x += Math.sin(confetti.angle) * confetti.speed;
        confetti.angle += confetti.spin;

        // Update opacity
        confetti.opacity = Math.max(0, confetti.opacity - 0.005);

        // Update DOM element
        confetti.element.style.transform = `translate(${confetti.x}px, ${
          confetti.y
        }px) rotate(${(confetti.angle * 180) / Math.PI}deg)`;
        confetti.element.style.opacity = confetti.opacity;

        // Remove if out of view or fully transparent
        if (confetti.opacity <= 0 || confetti.y < -100) {
          confetti.element.remove();
          return false;
        }
        return true;
      });

      if (this.confettis.length > 0) {
        requestAnimationFrame(() => this.animate());
      } else {
        this.container.remove();
      }
    }

    start() {
      this.createContainer();

      // Create confetti pieces
      for (let i = 0; i < this.confettiCount; i++) {
        const confetti = this.createConfetti();
        this.container.appendChild(confetti.element);
        this.confettis.push(confetti);
      }

      // Start animation
      this.animate();
    }
  }

  const confetti = new Confetti();

  useEffect(() => {
    confetti.start();
  }, []);

  return <div className="confetti-container"></div>;
}
