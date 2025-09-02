# Changelog — orientativo-test

Todas las notas de cambios del proyecto.

## [v1.0.0] — 2025-09-01
### Agregado
- Primera versión pública del **Test orientativo**.
- Formulario con 4 preguntas (Nunca / A veces / Siempre) mapeadas a áreas cognitivas:
  - q1: Memoria
  - q2: Cálculo
  - q3: Razonamiento
  - q4: Lenguaje
- Lógica de recomendación en `test.js`: suma de puntajes por área (0/1/2). En caso de empate o sin respuestas, elige un juego al azar.
- Interfaz responsive y accesible (botones grandes, foco visible, skip link, texto ≥16px).
- Enlaces directos a los juegos de FALLTEM y a la página con todos los juegos.
- CSP estricta (sin inline JS/CSS) y sin dependencias externas.
- Licencia MIT y README con instrucciones.

