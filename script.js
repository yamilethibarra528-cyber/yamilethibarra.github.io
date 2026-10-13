
"use strict";

const categories = [
  "Categoría 1. Personajes de la Revolución Mexicana",
  "Categoría 2. Vida y acontecimientos revolucionarios"
];

const questions = [
  {
    category: 0,
    question: "Menciona un personaje importante de la Revolución Mexicana.",
    generalization: "Generalización: reconocer que diferentes personajes formaron parte de un mismo proceso histórico.",
    answers: [
      { text: "Emiliano Zapata", points: 30, aliases: ["zapata", "emiliano"] },
      { text: "Francisco Villa", points: 25, aliases: ["pancho villa", "villa", "francisco villa"] },
      { text: "Francisco I. Madero", points: 20, aliases: ["madero", "francisco madero"] },
      { text: "Porfirio Díaz", points: 12, aliases: ["porfirio diaz", "diaz"] },
      { text: "Venustiano Carranza", points: 8, aliases: ["carranza"] },
      { text: "Pascual Orozco", points: 5, aliases: ["orozco"] }
    ]
  },
  {
    category: 0,
    question: "Menciona algo que varios revolucionarios tenían en común.",
    generalization: "Generalización: identificar características compartidas sin suponer que todos tenían los mismos ideales.",
    answers: [
      { text: "Participaron en la Revolución Mexicana", points: 30, aliases: ["participaron en la revolucion", "participaron en la revolucion mexicana"] },
      { text: "Buscaban cambios políticos o sociales", points: 25, aliases: ["cambios politicos", "cambios sociales"] },
      { text: "Formaron parte de movimientos armados", points: 18, aliases: ["movimientos armados"] },
      { text: "Tuvieron seguidores", points: 12, aliases: ["seguidores", "tenian seguidores"] },
      { text: "Influyeron en la historia de México", points: 10, aliases: ["influyeron en la historia", "influyeron en la historia de mexico"] },
      { text: "Tuvieron participación política o militar", points: 5, aliases: ["participacion politica", "participacion militar"] }
    ]
  },
  {
    category: 0,
    question: "Menciona una característica que podían compartir los líderes revolucionarios.",
    generalization: "Generalización: reconocer semejanzas entre personas que desempeñaron funciones distintas.",
    answers: [
      { text: "Contaban con seguidores", points: 28, aliases: ["seguidores", "tenian seguidores"] },
      { text: "Tenían objetivos políticos o sociales", points: 24, aliases: ["objetivos politicos", "objetivos sociales"] },
      { text: "Participaban en decisiones del movimiento", points: 18, aliases: ["tomaban decisiones", "participaban en decisiones"] },
      { text: "Organizaban grupos", points: 12, aliases: ["organizar grupos"] },
      { text: "Tenían influencia en ciertas regiones", points: 10, aliases: ["influencia regional", "influencia en regiones"] },
      { text: "Buscaban modificar alguna situación del país", points: 8, aliases: ["cambiar la situacion del pais", "modificar la situacion del pais"] }
    ]
  },
  {
    category: 1,
    question: "Menciona algo que se utilizaba para trasladarse durante la Revolución Mexicana.",
    generalization: "Generalización: identificar distintos ejemplos que cumplen una función semejante.",
    answers: [
      { text: "Tren", points: 30, aliases: ["ferrocarril"] },
      { text: "Caballo", points: 25, aliases: ["caballos"] },
      { text: "A pie", points: 18, aliases: ["caminando", "pie"] },
      { text: "Carreta", points: 12, aliases: ["carretas"] },
      { text: "Burro o mula", points: 10, aliases: ["burro", "mula", "mulas"] },
      { text: "Automóvil", points: 5, aliases: ["auto", "automovil", "carro"] }
    ]
  },
  {
    category: 1,
    question: "Menciona algo que los revolucionarios podían necesitar durante sus recorridos.",
    generalization: "Generalización: reconocer necesidades comunes en distintas situaciones históricas.",
    answers: [
      { text: "Agua", points: 25, aliases: ["agua potable"] },
      { text: "Alimentos", points: 25, aliases: ["comida"] },
      { text: "Caballos o medios de transporte", points: 18, aliases: ["caballos", "transporte", "medios de transporte"] },
      { text: "Ropa y cobijas", points: 12, aliases: ["ropa", "cobijas", "mantas"] },
      { text: "Herramientas y suministros", points: 10, aliases: ["herramientas", "suministros"] },
      { text: "Medicinas y material de curación", points: 10, aliases: ["medicinas", "medicamentos", "material de curacion"] }
    ]
  },
  {
    category: 1,
    question: "Menciona una razón por la que distintos grupos participaron en la Revolución Mexicana.",
    generalization: "Generalización: identificar motivos compartidos, reconociendo que no todos los grupos tenían las mismas demandas.",
    answers: [
      { text: "Oponerse a la reelección de Porfirio Díaz", points: 25, aliases: ["reeleccion de diaz", "oponerse a porfirio diaz", "no a la reeleccion"] },
      { text: "Buscar mejores condiciones de vida", points: 22, aliases: ["mejores condiciones de vida"] },
      { text: "Reclamar tierras", points: 20, aliases: ["tierra", "reparto de tierras"] },
      { text: "Exigir derechos laborales", points: 13, aliases: ["derechos laborales"] },
      { text: "Buscar cambios políticos", points: 12, aliases: ["cambios politicos"] },
      { text: "Reclamar justicia social", points: 8, aliases: ["justicia social"] }
    ]
  }
];

// Estado de la partida

let currentQuestion = 0;
let totalScore = 0;
let roundScore = 0;
let mistakes = 0;
let revealed = new Set();
let phase = "welcome";
let finished = false;
let transitionTimer = null;

const $ = id => document.getElementById(id);

// Normaliza mayúsculas, acentos y signos de puntuación.

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Mostrar la pantalla elegida.

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  $(id).classList.add("active");
}

// Iniciar una partida nueva.

function startGame() {
  clearTimeout(transitionTimer);

  currentQuestion = 0;
  totalScore = 0;
  roundScore = 0;
  mistakes = 0;
  revealed = new Set();
  finished = false;

  showCategory(0);
}

// Presentar una categoría durante cinco segundos.

function showCategory(categoryIndex) {
  clearTimeout(transitionTimer);
  phase = "category";

  $("categoryTitle").textContent = categories[categoryIndex];

  showScreen("categoryScreen");

  const oldBar = $("countdownBar");
  const newBar = oldBar.cloneNode(false);

  oldBar.replaceWith(newBar);
  newBar.id = "countdownBar";

  // Iniciar animación visual de cinco segundos.
  void newBar.offsetWidth;
  newBar.classList.add("running");

  transitionTimer = setTimeout(() => {
    showQuestion();
  }, 5000);
}

// Presentar la pregunta actual.

function showQuestion() {
  clearTimeout(transitionTimer);
  phase = "game";

  const q = questions[currentQuestion];

  showScreen("gameScreen");

  $("categoryBadge").textContent = categories[q.category];
  $("progress").textContent =
    `Pregunta ${currentQuestion + 1} de ${questions.length}`;

  $("question").textContent = q.question;
  $("generalization").textContent = q.generalization;
  $("message").textContent = "¡Escribe tu respuesta!";
  $("answerInput").value = "";

  renderBoard();

  $("answerInput").focus();
}

// Dibujar las seis respuestas.

function renderBoard() {
  const q = questions[currentQuestion];

  $("board").replaceChildren();

  q.answers.forEach((answer, index) => {
    const card = document.createElement("div");

    card.className = "answer-card " +
      (revealed.has(index) ? "revealed" : "hidden-answer");

    const number = document.createElement("span");
    number.className = "number";
    number.textContent = index + 1;

    const text = document.createElement("span");
    text.className = "answer-text";
    text.textContent = answer.text;

    const points = document.createElement("span");
    points.className = "points";
    points.textContent = answer.points;

    card.append(number, text, points);
    $("board").append(card);
  });

  $("roundScore").textContent = roundScore;
  $("totalScore").textContent = totalScore;

  $("strikes").textContent =
    "✕ ".repeat(mistakes) + "○ ".repeat(3 - mistakes);

  $("submitBtn").disabled = finished;
  $("answerInput").disabled = finished;
  $("revealBtn").disabled = finished;
  $("showAllBtn").disabled = finished;
}

// Revisar la respuesta escrita.

function checkAnswer(event) {
  event.preventDefault();

  if (finished || phase !== "game") return;

  const input = normalize($("answerInput").value);

  if (!input) {
    $("message").textContent = "Escribe una respuesta primero.";
    return;
  }

  const q = questions[currentQuestion];

  const matchIndex = q.answers.findIndex((answer, index) => {
    if (revealed.has(index)) return false;

    const options = [
      answer.text,
      ...(answer.aliases || [])
    ].map(normalize);

    return options.includes(input);
  });

  if (matchIndex >= 0) {
    const answer = q.answers[matchIndex];

    revealed.add(matchIndex);
    roundScore += answer.points;
    totalScore += answer.points;

    $("message").textContent =
      `¡CORRECTO! ${answer.text}: ${answer.points} puntos. 🎉`;

    if (revealed.size === q.answers.length) {
      $("message").textContent += " ¡Todas las respuestas acertadas!";
    }
  } else {
    mistakes = Math.min(3, mistakes + 1);

    $("message").textContent = mistakes === 3
      ? "¡Tres errores! Puedes revelar respuestas o continuar."
      : "❌ Esa respuesta no está en el tablero. ¡Intenta otra!";
  }

  $("answerInput").value = "";
  renderBoard();

  if (!finished) $("answerInput").focus();
}

// Revelar la siguiente respuesta sin sumar puntos.

function revealOne() {
  if (finished || phase !== "game") return;

  const q = questions[currentQuestion];

  const index = q.answers.findIndex((_, i) => !revealed.has(i));

  if (index === -1) {
    $("message").textContent = "¡Todas las respuestas están reveladas!";
    return;
  }

  revealed.add(index);

  $("message").textContent =
    `Respuesta revelada: ${q.answers[index].text}. No se sumaron puntos.`;

  renderBoard();
}

// Revelar todas las respuestas sin regalar puntos.

function revealAll() {
  if (finished || phase !== "game") return;

  const q = questions[currentQuestion];

  revealed = new Set(q.answers.map((_, index) => index));

  $("message").textContent =
    "Todas las respuestas están visibles. Solo cuentan los aciertos.";

  renderBoard();
}

// Pasar a la pregunta siguiente.

function nextQuestion() {
  if (finished || phase !== "game") return;

  if (currentQuestion === 2) {
    // Terminó la categoría 1: presentar la categoría 2.
    currentQuestion = 3;
    roundScore = 0;
    mistakes = 0;
    revealed = new Set();

    showCategory(1);
    return;
  }

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    roundScore = 0;
    mistakes = 0;
    revealed = new Set();

    showQuestion();
  } else {
    finishGame();
  }
}

// Pantalla con el resultado final.

function finishGame() {
  clearTimeout(transitionTimer);

  phase = "final";
  finished = true;

  $("finalScore").textContent = totalScore;
  $("finalMessage").textContent =
    "¡Gracias por participar y demostrar tus conocimientos de historia!";

  showScreen("finalScreen");
}

// Regresar al inicio.

function resetGame() {
  clearTimeout(transitionTimer);

  currentQuestion = 0;
  totalScore = 0;
  roundScore = 0;
  mistakes = 0;
  revealed = new Set();
  phase = "welcome";
  finished = false;

  showScreen("welcomeScreen");
}

// Conectar todos los botones.

$("startBtn").addEventListener("click", startGame);
$("answerForm").addEventListener("submit", checkAnswer);
$("revealBtn").addEventListener("click", revealOne);
$("showAllBtn").addEventListener("click", revealAll);
$("nextBtn").addEventListener("click", nextQuestion);
$("resetBtn").addEventListener("click", resetGame);
$("playAgainBtn").addEventListener("click", resetGame);

// Mostrar la bienvenida al abrir la página.

showScreen("welcomeScreen");
