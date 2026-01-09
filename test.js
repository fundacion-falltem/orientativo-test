'use strict';

/**
 * Envío de eventos a Cloudflare Web Analytics usando "pageviews virtuales".
 * No se envían datos personales; solo una URL ficticia con parámetros.
 */
function trackEvent(eventType, juegoKey) {
  if (!window.fetch) return;

  const base = 'https://fundacion-falltem.github.io/orientativo-test/';
  const url = `${base}?event=${encodeURIComponent(eventType)}&juego=${encodeURIComponent(juegoKey)}`;

  try {
    fetch(url, {
      mode: 'no-cors',
      keepalive: true
    });
  } catch (e) {
    // silencioso
  }
}

function logClickIrJuego(juegoKey) {
  trackEvent('click_ir_juego', juegoKey);
}

function logClickVerTodos(juegoKey) {
  trackEvent('click_ver_todos', juegoKey);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('test-form');
  const resultEl = document.getElementById('resultado');

  if (!form || !resultEl) return;

  // =========================
  // Juegos recomendados
  // =========================
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
      nombre: "Sudoku",
      url: "https://fundacion-falltem.github.io/Juego-Sudoku/"
    },

    lenguaje: {
      nombre: "Completa la Palabra",
      url: "https://fundacion-falltem.github.io/Completa-palabra/"
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // =========================
    // Puntajes
    // =========================
    const scores = {
      memoria: 0,
      calculo: 0,
      razonamiento: 0,
      lenguaje: 0
    };

    const getValue = (name) => {
      const el = form.querySelector(`input[name="${name}"]:checked`);
      return el ? parseInt(el.value, 10) : 0;
    };

    scores.memoria += getValue("q1");
    scores.calculo += getValue("q2");
    scores.razonamiento += getValue("q3");
    scores.lenguaje += getValue("q4");

    // =========================
    // Elegir recomendación
    // =========================
    const maxScore = Math.max(...Object.values(scores));
    const keys = Object.keys(scores).filter(k => scores[k] === maxScore);

    // empate → azar (está bien para un test orientativo)
    const elegido = keys[Math.floor(Math.random() * keys.length)];
    const juego = juegos[elegido];

    // analytics
    trackEvent('recomendacion', elegido);

    // =========================
    // Render resultado
    // =========================
    resultEl.innerHTML = `
      <div class="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center max-w-xl mx-auto">
        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-800 mb-3">
          Recomendación orientativa
        </h2>

        <p class="text-slate-600 mb-6">
          Según tus respuestas, este ejercicio puede resultarte adecuado:
        </p>

        <h3 class="text-2xl sm:text-3xl font-black text-blue-700 mb-6">
          ${juego.nombre}
        </h3>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="${juego.url}"
             target="_blank"
             onclick="logClickIrJuego('${elegido}')"
             class="inline-flex items-center justify-center rounded-full
                    bg-blue-600 hover:bg-blue-700 text-white font-semibold
                    text-sm sm:text-base py-2.5 px-6 shadow-md transition">
            Ir al juego
          </a>

          <a href="https://falltem.org/juegos/#games-cards"
             target="_blank"
             onclick="logClickVerTodos('${elegido}')"
             class="inline-flex items-center justify-center rounded-full
                    border border-slate-300 bg-white hover:bg-slate-50
                    text-slate-700 font-semibold text-sm sm:text-base py-2.5 px-6 transition">
            Ver todos los juegos
          </a>
        </div>
      </div>
    `;

    resultEl.hidden = false;
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
