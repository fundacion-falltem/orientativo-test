'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('testForm');
  const resultEl = document.getElementById('resultado');
  const juegos = {
    memoria: {
      nombre: "Parejas de Memoria",
      url: "https://fundacion-falltem.github.io/juego-memoria/"
    },
    calculo: {
      nombre: "Cálculo Amable",
      url: "https://fundacion-falltem.github.io/juego-calculo/"
    },
    razonamiento: {
      nombre: "Secuencia de Colores",
      url: "https://fundacion-falltem.github.io/juego-secuencias/"
    },
    lenguaje: {
      nombre: "Completa la Palabra",
      url: "https://fundacion-falltem.github.io/Completa-palabra/"
    },
    intruso: {
      nombre: "¿Cuál es el Intruso?",
      url: "https://fundacion-falltem.github.io/juego-intruso/"
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // puntajes
    const scores = { memoria: 0, calculo: 0, razonamiento: 0, lenguaje: 0 };

    const getValue = (name) => {
      const el = form.querySelector(`input[name="${name}"]:checked`);
      return el ? parseInt(el.value, 10) : 0;
    };

    scores.memoria += getValue("q1");
    scores.calculo += getValue("q2");
    scores.razonamiento += getValue("q3");
    scores.lenguaje += getValue("q4");

    // encontrar el máximo
    const maxScore = Math.max(...Object.values(scores));
    let keys = Object.keys(scores).filter(k => scores[k] === maxScore);

    // elegir al azar si hay empate
    const elegido = keys[Math.floor(Math.random() * keys.length)];
    const juego = juegos[elegido];

    // render resultado
    resultEl.innerHTML = `
      <p>En base a tus respuestas, te recomendamos jugar:</p>
      <h2>${juego.nombre}</h2>
      <a href="${juego.url}" target="_blank" class="btn">Ir al juego</a>
      <p><a href="https://fundacion-falltem.github.io/">O ver todos los juegos</a></p>
    `;
    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: 'smooth' });
  });
});
