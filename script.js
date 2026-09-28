// script.js - Juego "Basta" accesible con voz (versión matemáticas)

let isPlaying = false;
let timer;
let timeLeft = 10;

let selectedVoice = null;

// =======================
// 1. Definir categorías
// =======================
const categorias = {
    matemático: { 
        palabras: [
            "Gauss", "Pitágoras", "Euler", "Newton", "Descartes",
            "Euclides", "Arquímedes", "Pascal", "Fermat", "Hilbert",
            "Cantor", "Cauchy", "Riemann", "Lagrange", "Leibniz"
        ], 
        articulo: "un" 
    },

    matemática: { 
        palabras: [
            "Hipatía", "Sophie Germain", "Emmy Noether", "Mary Cartwright", "Ada Lovelace",
            "Florence Nightingale", "Julia Robinson", "Maryam Mirzakhani", "Ingrid Daubechies", "Karen Uhlenbeck",
            "Grace Hopper", "Olga Taussky-Todd", "Christine Ladd-Franklin", "Mina Rees", "Marjorie Rice"
        ], 
        articulo: "una" 
    },

    polígono: { 
        palabras: [
            "Triángulo", "Cuadrado", "Rectángulo", "Pentágono", "Hexágono",
            "Heptágono", "Octágono", "Nonágono", "Decágono", "Dodecágono",
            "Trapecio", "Rombo", "Romboide", "Paralelogramo", "Isósceles"
        ], 
        articulo: "un" 
    },

    operación: { 
        palabras: [
            "Suma", "Resta", "Multiplicación", "División",
            "Potenciación", "Radicación", "Logaritmación", "Factorización", "Derivación",
            "Integración"
        ], 
        articulo: "una" 
    },

    unidad: { 
        palabras: [
            "Metro", "Litro", "Segundo", "Gramo", "Kelvin",
            "Mol", "Amperio", "Hertz", "Newton", "Joule",
            "Watt", "Pascal", "Coulomb", "Volt", "Ohm"
        ], 
        articulo: "una" 
    },

    concepto: { 
        palabras: [
            "Variable", "Polinomio", "Ecuación", "Factor", "Fracción",
            "Exponente", "Raíz", "Matriz", "Determinante", "Límite",
            "Derivada", "Integral", "Vector", "Escalar", "Conjunto"
        ], 
        articulo: "un" 
    },

    función: { 
        palabras: [
            "Lineal", "Cuadrática", "Exponencial", "Logarítmica", "Trigonométrica",
            "Racional", "Irracional", "Polinómica", "Afín", "Inyectiva",
            "Sobreyectiva", "Biyectiva", "Periódica", "Constante", "Identidad"
        ], 
        articulo: "una" 
    }
};


// =======================
// 2. Voz: cargar Sabina
// =======================
speechSynthesis.onvoiceschanged = () => {
    let voices = speechSynthesis.getVoices();
    selectedVoice = voices.find(v => v.name === "Microsoft Sabina - Spanish (Mexico)");
};

// =======================
// 3. Función de voz
// =======================
function speakText(text, callback) {
    console.log("Leyendo:", text);
    speechSynthesis.cancel();

    let fixedText = text.replace(/\bY\b/g, "ye");
    let utterance = new SpeechSynthesisUtterance(fixedText);
    utterance.lang = "es-MX";
    utterance.rate = 1;    // Velocidad (1 = normal)
    utterance.pitch = 1;   // Tono (1 = normal)
    utterance.volume = 1;  // Volumen (1 = máximo)

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.onend = callback;
    speechSynthesis.speak(utterance);
}

// =======================
// 4. Construir instrucción
// =======================
function generarInstruccion() {
    // Elegir categoría
    let keys = Object.keys(categorias);
    let categoriaElegida = keys[Math.floor(Math.random() * keys.length)];
    let { palabras, articulo } = categorias[categoriaElegida];

    // Elegir palabra de la lista
    let palabra = palabras[Math.floor(Math.random() * palabras.length)];

    // Elegir modo: 0 = empieza con, 1 = contiene
    let modo = Math.floor(Math.random() * 2);

    // Elegir letra
    let letra;
    if (modo === 0) {
        letra = palabra[0].toUpperCase();
    } else {
        let letras = palabra.toUpperCase().split("");
        letra = letras[Math.floor(Math.random() * letras.length)];
    }

    // Texto de instrucción
    let instruccion;
    if (modo === 0) {
        instruccion = `Menciona ${articulo} ${categoriaElegida} que empiece con ${letra}`;
    } else {
        instruccion = `Menciona ${articulo} ${categoriaElegida} que contenga la letra ${letra}`;
    }

    return { instruccion, letra };
}


// =======================
// 5. Iniciar juego
// =======================
function startGame() {
    clearInterval(timer);
    isPlaying = true;
    timeLeft = 10;

    let { instruccion, letra } = generarInstruccion();

    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("instruction").innerHTML = `Instrucción: ${instruccion}`;

    // Leer la instrucción y luego arrancar temporizador
    speakText(instruccion, startTimer);
}

// =======================
// 6. Temporizador
// =======================
function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            document.getElementById("timer").textContent = timeLeft;
            speechSynthesis.cancel();
            speakText(timeLeft.toString());
            timeLeft--;
        } else {
            clearInterval(timer);
            isPlaying = false;
            setTimeout(() => {
                speakText("¡Tiempo agotado!");
            }, 500);
        }
    }, 1000);
}

// =======================
// 7. Pausa y reanudar
// =======================
function pauseGame() {
    clearInterval(timer);
    speakText("Pausa de jueces");
    isPlaying = false;
}

function resumeGame() {
    speakText("Cuenta atrás reanudada", startTimer);
}

// =======================
// 8. Atajos de teclado
// =======================
document.addEventListener("keydown", (event) => {
    let key = event.key.toUpperCase();
    if (key === "ENTER") {
        startGame();
    } else if (key === "F") {
        pauseGame();
    } else if (key === "J") {
        resumeGame();
    }
});
