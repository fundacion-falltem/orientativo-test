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
    // Silenciar cualquier error de red, no afecta la UX del usuario
  }
}

// Helpers globales para usar desde los onclick del HTML
function logClickIrAlJuego(juegoKey) {
  trackEvent('click_ir_al_juego', juegoKey);
}

function logClickVerTodos(juegoKey) {
  trackEvent('click_ver_todos', juegoKey);
}

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

    // 🔍 Log: cada vez que el test genera una recomendación
    trackEvent('recomendacion', elegido);

    // render resultado (versión linda con Tailwind)
    resultEl.innerHTML = `
      <div class="mt-4 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-5 sm:px-6 sm:py-6 shadow-sm">
        <p class="text-sm sm:text-base text-slate-700 mb-1">
          En base a tus respuestas, te recomendamos jugar:
        </p>

        <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
          ${juego.nombre}
        </h2>

        <p class="text-xs sm:text-sm text-slate-500 mb-4">
          Podés empezar ahora mismo o ver otros juegos disponibles.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="${juego.url}"
             target="_blank"
             onclick="logClickIrAlJuego('${elegido}')"
             class="inline-flex items-center justify-center rounded-full
                    bg-lime-500 hover:bg-lime-600 text-slate-900 font-extrabold
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
