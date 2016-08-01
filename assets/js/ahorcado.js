var txtLetra, hombre, palabra, espacio, lengthRespuesta;
var postes = ["assets/images/poste.png", "assets/images/poste1.png", "assets/images/poste2.png", "assets/images/poste3.png", "assets/images/poste4.png", "assets/images/poste5.png"];
var palabras = ["OTORRINOLARINGOLOGIA",
                "ESTERNOCLEIDOMASTOIDEO",
                "PEYORATIVO",
                "MISANTROPIA",
                "HIPOFISIS",
                "HIPOTALAMO",
                "VENTRICULO",
                "ESCLEROSIS",
                "NECROSIS",
                "ISQUEMIA",
                "FILANTROPIA",
                "EPILEPSIA",
                "PATO",
                "PERRO",
                "CASA",
                "PSICOLOGIA",
                "MANGO",
                "KIWI",
                "PATILLA"]

var Imagen = function (context, imgUrl, x, y, w, h) {
    this.contexto = context;
    this.imagenURL = imgUrl;
    this.imagenOK = false;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Imagen.prototype.bind = function (confirmar) {
    this.imagen = new Image();
    this.imagen.src = this.imagenURL;
    this.imagen.onload = confirmar;
}

Imagen.prototype.dibujar = function () {
    if (this.imagenOK) {
        this.contexto.drawImage(this.imagen, this.x, this.y, this.w, this.h);
    }
    else {
        console.log("Aun no ha cargado la imagen");
    }
}

var Ahorcado = function (context, gameOverUrl, fondoUrl, posteUrl, poste1Url, poste2Url, poste3Url, poste4Url, poste5Url) {
    this.contexto = context;
    this.maximo = 5;
    this.intentos = 0;
    this.vivo = true;
    this.gameOver = new Imagen(context, gameOverUrl, 0, 0, 700, 622);
    this.fondo = new Imagen(context, fondoUrl, 0, 0, 700, 622);
    this.poste = new Imagen(context, posteUrl, 200, 141, 300, 340);
    this.poste1 = new Imagen(context, poste1Url, 200, 141, 300, 340);
    this.poste2 = new Imagen(context, poste2Url, 200, 141, 300, 340);
    this.poste3 = new Imagen(context, poste3Url, 200, 141, 300, 340);
    this.poste4 = new Imagen(context, poste4Url, 200, 141, 300, 340);
    this.poste5 = new Imagen(context, poste5Url, 200, 141, 300, 340);
    this.lstFunctionsConfirmar = [];
}

Ahorcado.prototype.bindFondo = function () {
    //Dibujando el fondo
    this.fondo.bind(this.lstFunctionsConfirmar[0]);
}

Ahorcado.prototype.bind = function () {

    //Dibujando el poste
    if (this.intentos == 0) {
        this.poste.bind(this.lstFunctionsConfirmar[1]);
    }
    else if (this.intentos == 1) {
        // intentos = 1 --> rostro
        this.poste1.bind(this.lstFunctionsConfirmar[2]);
    }
    else if (this.intentos == 2) {
        // intentos = 2 --> torso
        this.poste2.bind(this.lstFunctionsConfirmar[3]);
    }
    else if (this.intentos == 3) {
        // intentos = 3 --> brazos
        this.poste3.bind(this.lstFunctionsConfirmar[4]);
    }
    else if (this.intentos == 4) {
        // intentos = 4 --> piernas
        this.poste4.bind(this.lstFunctionsConfirmar[5]);
    }
    else if (this.intentos >= 5) {
        // intentos = 5 --> ojos muertos
        this.poste5.bind(this.lstFunctionsConfirmar[6]);
    }
}

Ahorcado.prototype.trazar = function () {
    this.intentos++;
    if (this.intentos >= this.maximo) {
        this.vivo = false;
        alert("¡Estás muerto!");
    }
    this.bind();
}

function main() {

    var canvas = document.getElementById("cnvCanvas");
    var btnPlay = document.getElementById("btnPlay");
    txtLetra = document.getElementById("txtLetra");
    lengthRespuesta = 0;

    canvas.width = 700;
    canvas.height = 622;

    hombre = new Ahorcado(canvas.getContext("2d"), "assets/images/game-over.png", "assets/images/fondo.png", postes[0], postes[1], postes[2], postes[3], postes[4], postes[5]);

    var confirmarGameOver = function () { hombre.gameOver.imagenOK = true; hombre.gameOver.dibujar(); };
    var confirmarFondo = function () { hombre.fondo.imagenOK = true; hombre.fondo.dibujar(); hombre.bind(); };
    var confirmarPoste = function () { hombre.poste.imagenOK = true; hombre.poste.dibujar(); };
    var confirmarPoste1 = function () { hombre.poste1.imagenOK = true; hombre.poste1.dibujar(); };
    var confirmarPoste2 = function () { hombre.poste2.imagenOK = true; hombre.poste2.dibujar(); };
    var confirmarPoste3 = function () { hombre.poste3.imagenOK = true; hombre.poste3.dibujar(); };
    var confirmarPoste4 = function () { hombre.poste4.imagenOK = true; hombre.poste4.dibujar(); };
    var confirmarPoste5 = function () { hombre.poste5.imagenOK = true; hombre.poste5.dibujar(); };

    hombre.lstFunctionsConfirmar = [confirmarFondo, confirmarPoste, confirmarPoste1, confirmarPoste2, confirmarPoste3, confirmarPoste4, confirmarPoste5, confirmarGameOver];

    btnPlay.addEventListener("click", agregarLetra);

    palabra = palabras[Math.floor(Math.random() * 20)];

    espacio = new Array(palabra.length);

    mostrarPista(espacio);

    hombre.bindFondo();
}

function agregarLetra() {
    var letra = txtLetra.value;
    txtLetra.value = "";
    mostrarPalabra(palabra, hombre, letra);
}

function mostrarPalabra(palabra, ahorcado, letra) {
    var encontrado = false;
    var p;
    letra = letra.toUpperCase();
    for (p in palabra) {
        if (letra == palabra[p]) {
            lengthRespuesta++;
            espacio[p] = letra;
            encontrado = true;
        }
    }
    mostrarPista(espacio);

    // Si NO lo encontré
    if (!encontrado) {
        ahorcado.trazar();
    }

    if (!ahorcado.vivo) {
        mostrarPista(palabra);
        setTimeout(function () {
            hombre.gameOver.bind(hombre.lstFunctionsConfirmar[7])
            setTimeout(function () { main(); }, 7500);
        }, 1000);
    }
    else if (lengthRespuesta == palabra.length) {
        alert("Haz Ganado!!!!");
        main();
    }
}

function mostrarPista(espacio) {
    var lblPista = document.getElementById("lblPista");
    var texto = "";
    var i;
    var largo = espacio.length;

    for (i = 0; i < largo; i++) {
        if (espacio[i] != undefined) {
            texto = texto + espacio[i] + " ";
        }
        else {
            texto += "_ ";
        }
    }
    lblPista.innerText = texto;
}