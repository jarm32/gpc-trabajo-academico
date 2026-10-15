var renderer;
var scene;
var reloj = new THREE.Clock();

var camera1p;
var camera3p;
var cameraOrbital;
var controls3p;
var controlsDebug;
var distanciaCamara3p = 10;
var margenCamara = 0.8;
var velocidadRecuperacionCamara = 5;
var pausado = false;
var terceraPersona = true;
var juegoIniciado = false;
var numeroMuertes = 0;
var tiempoPartida = 0;
var tiempoFinalizado = false;
var tiempoEscape = 0;
var victoriaMostrada = false;

var estructura; // Todo lo que bloquea la cámara para que lo tenga el Raycaster
var raycasterCamara = new THREE.Raycaster();

var obstaculosAlien = []; // Todo lo que bloquea al alien para hacer colisiones
var raycasterAlien = new THREE.Raycaster();
var margenAlien = 0.8;
var superficiesElevadas = [];
var raycasterSuelo = new THREE.Raycaster();

// Laboratorio
var anchoLab = 50;
var largoLab = 30;
var altoLab = 12;
var grosorBox = 0.5;
var anchoPuerta = 7;
var altoPuerta = 9;

var anchoPartePuerta = anchoPuerta / 2;
var posicionInicialPuerta = anchoPuerta / 4;
var posicionFinalPuerta = (anchoPuerta + anchoPartePuerta) / 2;
var velocidadAperturaPuerta = 7;
var distanciaActivacionPalanca = 4;
var velocidadInclinacionPalanca = 1.5;
var anguloMaximoPalanca = Math.PI / 4;

// Pasillo
var anchoPasillo = 15;
var largoPasillo = 60;
var altoPasillo = altoLab - 2;

var alturaInferiorVentana = 1.5;
var altoVentana = 4;
var numeroVentanas = 3;
var grosorPilar = 1;

var pasillo;
var lasers = [];
var rieles = [];
var velocidadLaser = 8;
var intervaloLaser = 2;
var tiempoLaser = 0;
var siguienteLaser = 0;

// Escaleras
var anchoEscaleras = 12;
var inicioX = anchoPasillo / 2;
var finalX = -42;
var inicioZ = -largoLab / 2 - largoPasillo;
var centroZ = inicioZ - anchoEscaleras / 2;

var alturaElevacion = 4;
var numeroEscalones = 10;
var inicioEscalera = -12;
var finalEscalera = -28;

// Sala de control
var anchoSalaControl = 50;
var largoTramo1 = 70;
var largoTramo2 = 30;
var altoSalaControl = 10;
var alturaSalaControl = alturaElevacion;

var inicioSalaX = finalX;
var finalSalaX = inicioSalaX - largoTramo1;

// Hangar
var anchoHangar = 30;
var largoHangar = 28;
var altoHangar = 10;
var alturaHangar = alturaSalaControl;

var centroHangarX = finalSalaX + anchoSalaControl / 2;
var inicioHangarZ = inicioZ + largoTramo2;
var centroHangarZ = inicioHangarZ + largoHangar / 2;

var nave;
var alturaBaseNave;
var tiempoFlotacionNave = 0;
var cameraNave;
var escapando = false;
var faseDespegue = 0;
var velocidadAscensoNave = 4;
var velocidadAvanceNave = 30;
var distanciaActivacionNave = 7;
var focoNave;

// Modelos
var alien;
var modeloAlien
var alturaAlien = 0;
var alturaSueloAlien = 0;
var rotacionModeloAlien = 0;
var distanciaOrientacionCamara1p = 10;
var mixerAlien;
var animacionesAlien = {};
var animacionActual = "";

var lampara;
var soportesLamparasPasillo = [];
var soportesLamparasEscaleras = [];
var soportesLamparasSalaControl = [];
var soportesLamparasHangar = [];

var palanca; // Lab
var palancaActivada = false;
var flechaPalanca;
var tiempoFlechaPalanca = 0;

var puertaIzquierda;
var puertaDerecha;

var palancaSalaControl;
var palancaSalaControlActivada = false;

var puertaHangarIzquierda;
var puertaHangarDerecha;
var astronautas = [];
var distanciaVisionAstronautas = 20;
var anguloVisionAstronautas = Math.PI * 100 / 180;
var raycasterAstronautas = new THREE.Raycaster();

var texturaParedes;
var texturaExterior
var texturaParedesInterior;;

// Movimiento
var teclas = {
    adelante: false,
    atras: false,
    izquierda: false,
    derecha: false
};

var velocidad = 10;
var velocidadSalto = 15;
var gravedad = 25;
var alturaMaximaEscalon = 0.55;
var velocidadVertical = 0;
var enSuelo = true;


init();
render();


function init(){
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('container').appendChild(renderer.domElement);

    scene = new THREE.Scene();

    // Fondo
    const loaderFondo = new THREE.TextureLoader();
    const texturaFondo = loaderFondo.load("images/skybox-space-galaxy.png");
    texturaFondo.mapping = THREE.EquirectangularReflectionMapping; // Panorámica
    scene.background = texturaFondo;

    // Cámara 1p
    var aspectRatio = window.innerWidth / window.innerHeight;
    camera1p = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

    // Cámara 3p
    camera3p = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera3p.position.set(0, 5, 10);

    controls3p = new THREE.OrbitControls(camera3p, renderer.domElement);
    controls3p.enablePan = false; // sin paneo en 3p
    controls3p.enableZoom = false; // sin zoom en 3p
    controls3p.minPolarAngle = Math.PI / 3;
    controls3p.maxPolarAngle = Math.PI / 2;
    controls3p.minDistance = 2;
    controls3p.maxDistance = 20;

    // Cámara debug
    cameraOrbital = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    cameraOrbital.position.set(0, 15, 25);
    cameraOrbital.lookAt(0, 0, 0);

    controlsDebug = new THREE.OrbitControls(cameraOrbital, renderer.domElement);
    controlsDebug.enabled = false;

    // Cámara de la nave
    cameraNave = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

    loadScene();

    // Pantalla de inicio
    document.getElementById("botonIniciar").addEventListener("click", function() {
        numeroMuertes = 0;
        document.getElementById("contadorMuertes").textContent = "Muertes: 0";

        tiempoPartida = 0;
        tiempoFinalizado = false;
        document.getElementById("contadorTiempo").textContent = "Tiempo: 00:00";

        juegoIniciado = true;
        document.getElementById("pantallaInicio").style.display = "none";
    });
    
    document.addEventListener('keydown', (event) => {
        if (!juegoIniciado) return;
        switch (event.code) {
            // Movimiento
            case 'ArrowUp':
            case 'KeyW':
                if (!pausado) teclas.adelante = true;
                event.preventDefault();
                break;

            case 'ArrowDown':
            case 'KeyS':
                if (!pausado) teclas.atras = true;
                event.preventDefault();
                break;

            case 'ArrowLeft':
            case 'KeyA':
                if (!pausado) teclas.izquierda = true;
                event.preventDefault();
                break;

            case 'ArrowRight':
            case 'KeyD':
                if (!pausado) teclas.derecha = true;
                event.preventDefault();
                break;

            // Salto
            case 'Space':
            event.preventDefault();
            if (!event.repeat && enSuelo) {
                velocidadVertical = velocidadSalto;
                enSuelo = false;
                reproducirAnimacion("Jump");
            }
            break;

            // Alternar primera y tercera persona
            case 'KeyC':
                event.preventDefault();
                if (!event.repeat && !escapando) {
                    alternar1p3p();

                    if (modeloAlien) {
                        modeloAlien.visible = terceraPersona;
                    }
                }
                break;

            // Pausa el juego y alterna la cámara a debug
            case 'KeyP':
                if (!event.repeat && !escapando)
                    cambiarCamara();
                break;

            // Interactuar palanca
            
            // Interactuar con las palancas
            case 'KeyE':
                if (!event.repeat && alien) {

                    // Palanca del laboratorio
                    if (palanca && !palancaActivada) {
                        let posicionPalanca = new THREE.Vector3();
                        palanca.getWorldPosition(posicionPalanca);

                        let distancia = Math.sqrt(
                            Math.pow(alien.position.x - posicionPalanca.x, 2) +
                            Math.pow(alien.position.z - posicionPalanca.z, 2)
                        );

                        if (distancia < distanciaActivacionPalanca) {
                            palancaActivada = true;
                            flechaPalanca.visible = false;
                            reproducirAnimacion("Weapon");
                        }
                    }

                    // Palanca de la sala de control
                    if (palancaSalaControl && !palancaSalaControlActivada) {
                        let posicionPalancaSala = new THREE.Vector3();
                        palancaSalaControl.getWorldPosition(posicionPalancaSala);

                        let distanciaSala = Math.sqrt(
                            Math.pow(alien.position.x - posicionPalancaSala.x, 2) +
                            Math.pow(alien.position.z - posicionPalancaSala.z, 2)
                        );

                        if (distanciaSala < distanciaActivacionPalanca) {
                            palancaSalaControlActivada = true;
                            reproducirAnimacion("Weapon");
                        }
                    }

                    // Interactuar con la nave
                    if (nave && !escapando && !pausado) {
                        let distanciaNave = Math.sqrt(
                            Math.pow(alien.position.x - nave.position.x, 2) +
                            Math.pow(alien.position.z - nave.position.z, 2)
                        );

                        if (distanciaNave < distanciaActivacionNave) {
                            escapando = true;
                            faseDespegue = 1;
                            tiempoFinalizado = true;
                            focoNave.visible = true;
                            modeloAlien.visible = false;

                            teclas.adelante = false;
                            teclas.atras = false;
                            teclas.izquierda = false;
                            teclas.derecha = false;

                            controls3p.enabled = false;
                        }
                    }
                }
                break;
        }
    });

    
    document.addEventListener('keyup', (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                teclas.adelante = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                teclas.atras = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                teclas.izquierda = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                teclas.derecha = false;
                break;
        }
    });

    window.addEventListener('blur', () => {
        teclas.adelante = false;
        teclas.atras = false;
        teclas.izquierda = false;
        teclas.derecha = false;
    });

    
    // Adaptar el renderizador y las cámaras al tamaño de ventana
    window.addEventListener('resize', function() {
        let ancho = window.innerWidth;
        let alto = window.innerHeight;
        let aspecto = ancho / alto;

        renderer.setSize(ancho, alto);

        camera1p.aspect = aspecto;
        camera1p.updateProjectionMatrix();

        camera3p.aspect = aspecto;
        camera3p.updateProjectionMatrix();

        cameraOrbital.aspect = aspecto;
        cameraOrbital.updateProjectionMatrix();

        cameraNave.aspect = aspecto;
        cameraNave.updateProjectionMatrix();
    });

}

function registrarMesa(objeto, reducirAltura = false) {
    // Las partes de la mesa producen sombra
    objeto.traverse(function(pieza) {
        if (pieza.isMesh) {
            pieza.castShadow = true;
        }
    });

    objeto.updateMatrixWorld(true);
    let caja = new THREE.Box3().setFromObject(objeto);
    let dimensiones = new THREE.Vector3();
    let centro = new THREE.Vector3();
    caja.getSize(dimensiones);
    caja.getCenter(centro);

    // Crear la caja invisible de colisión
    if (reducirAltura) {
        dimensiones.y = 2.5;
        centro.y = caja.min.y + dimensiones.y / 2;
    }

    let geometria = new THREE.BoxGeometry(dimensiones.x, dimensiones.y, dimensiones.z);
    let material = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide});
    let cajaColision = new THREE.Mesh(geometria, material);
    cajaColision.position.copy(centro);

    scene.add(cajaColision);

    // Bloquea el movimiento horizontal y permite aterrizar encima
    obstaculosAlien.push(cajaColision);
    superficiesElevadas.push(cajaColision);
}

function crearLaboratorio() {
    // Laboratorio inicial
    let laboratorio = new THREE.Object3D();
    // let materialLaboratorio = new THREE.MeshStandardMaterial({color: 0x607080, side: THREE.DoubleSide});
    

    // Suelo
    let materialSueloInterior = new THREE.MeshPhongMaterial({color: 0x526575, specular: 0x888888, shininess: 40});

    let texturaSueloExterior = texturaExterior.clone();
    texturaSueloExterior.wrapS = THREE.RepeatWrapping;
    texturaSueloExterior.wrapT = THREE.RepeatWrapping;
    texturaSueloExterior.repeat.set((anchoLab + grosorBox) / 4, (largoLab + grosorBox) / 4);
    texturaSueloExterior.needsUpdate = true;
    let materialSueloExterior = new THREE.MeshStandardMaterial({map: texturaSueloExterior});

    let texturaLateralX = texturaExterior.clone();
    texturaLateralX.wrapS = THREE.RepeatWrapping;
    texturaLateralX.wrapT = THREE.RepeatWrapping;
    texturaLateralX.repeat.set((largoLab + grosorBox) / 4, grosorBox / 4);
    texturaLateralX.needsUpdate = true;
    let materialLateralX = new THREE.MeshStandardMaterial({map: texturaLateralX});

    let texturaLateralZ = texturaExterior.clone();
    texturaLateralZ.wrapS = THREE.RepeatWrapping;
    texturaLateralZ.wrapT = THREE.RepeatWrapping;
    texturaLateralZ.repeat.set((anchoLab + grosorBox) / 4, grosorBox / 4);
    texturaLateralZ.needsUpdate = true;
    let materialLateralZ = new THREE.MeshStandardMaterial({map: texturaLateralZ});

    let materialesSuelo = [
        materialLateralX, // +X
        materialLateralX, // -X
        materialSueloInterior, // +Y
        materialSueloExterior, // -Y
        materialLateralZ, // +Z
        materialLateralZ // -Z
    ];

    let geometriaSuelo = new THREE.BoxGeometry(anchoLab + grosorBox, grosorBox, largoLab + grosorBox);
    let suelo = new THREE.Mesh(geometriaSuelo, materialesSuelo);
    suelo.position.y = -grosorBox / 2;

    estructura.add(suelo);
    superficiesElevadas.push(suelo);
   
    
    // Techo
    let texturaTechoExterior = texturaExterior.clone();
    texturaTechoExterior.wrapS = THREE.RepeatWrapping;
    texturaTechoExterior.wrapT = THREE.RepeatWrapping;
    texturaTechoExterior.repeat.set((anchoLab + grosorBox) / 4, (largoLab + grosorBox) / 4);
    texturaTechoExterior.needsUpdate = true;
    let materialTechoExterior = new THREE.MeshStandardMaterial({map: texturaTechoExterior});

    let texturaTechoInterior = texturaParedes.clone();
    texturaTechoInterior.wrapS = THREE.MirroredRepeatWrapping;
    texturaTechoInterior.wrapT = THREE.MirroredRepeatWrapping;
    texturaTechoInterior.repeat.set(anchoLab / 4, largoLab / 4);
    texturaTechoInterior.needsUpdate = true;
    let materialTechoInterior = new THREE.MeshStandardMaterial({map: texturaTechoInterior});

    let texturaTechoLateralX = texturaExterior.clone();
    texturaTechoLateralX.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralX.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralX.repeat.set((largoLab + grosorBox) / 4, grosorBox / 4);
    texturaTechoLateralX.needsUpdate = true;
    let materialTechoLateralX = new THREE.MeshStandardMaterial({map: texturaTechoLateralX});

    let texturaTechoLateralZ = texturaExterior.clone();
    texturaTechoLateralZ.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralZ.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralZ.repeat.set((anchoLab + grosorBox) / 4, grosorBox / 4);
    texturaTechoLateralZ.needsUpdate = true;
    let materialTechoLateralZ = new THREE.MeshStandardMaterial({map: texturaTechoLateralZ});

    let materialesTecho = [
        materialTechoLateralX, // +X
        materialTechoLateralX, // -X
        materialTechoExterior, // +Y
        materialTechoInterior, // -Y
        materialTechoLateralZ, // +Z
        materialTechoLateralZ // -Z
    ];

    let geometriaTecho = new THREE.BoxGeometry(anchoLab + grosorBox, grosorBox, largoLab + grosorBox);
    let techo = new THREE.Mesh(geometriaTecho, materialesTecho);
    techo.position.y = altoLab + grosorBox / 2;
    
    estructura.add(techo);


    // Paredes
    let texturaLateralesInterior = texturaParedesInterior.clone();
    texturaLateralesInterior.wrapS = THREE.RepeatWrapping;
    texturaLateralesInterior.wrapT = THREE.RepeatWrapping;
    texturaLateralesInterior.repeat.set((largoLab - grosorBox) / 10, altoLab / 4);
    texturaLateralesInterior.needsUpdate = true;
    let materialLaterales = new THREE.MeshStandardMaterial({map: texturaLateralesInterior});

    let texturaTraseraInterior = texturaParedesInterior.clone();
    texturaTraseraInterior.wrapS = THREE.RepeatWrapping;
    texturaTraseraInterior.wrapT = THREE.RepeatWrapping;
    texturaTraseraInterior.repeat.set((anchoLab + grosorBox) / 10, altoLab / 4);
    texturaTraseraInterior.needsUpdate = true;
    let materialTrasera = new THREE.MeshStandardMaterial({map: texturaTraseraInterior});

    let texturaLateralesExterior = texturaExterior.clone();
    texturaLateralesExterior.wrapS = THREE.RepeatWrapping;
    texturaLateralesExterior.wrapT = THREE.RepeatWrapping;
    texturaLateralesExterior.repeat.set((largoLab - grosorBox) / 4, altoLab / 4);
    texturaLateralesExterior.needsUpdate = true;
    let materialLateralesExterior = new THREE.MeshStandardMaterial({map: texturaLateralesExterior});

    let texturaTraseraExterior = texturaExterior.clone();
    texturaTraseraExterior.wrapS = THREE.RepeatWrapping;
    texturaTraseraExterior.wrapT = THREE.RepeatWrapping;
    texturaTraseraExterior.repeat.set((anchoLab + grosorBox) / 4, altoLab / 4);
    texturaTraseraExterior.needsUpdate = true;
    let materialTraseraExterior = new THREE.MeshStandardMaterial({map: texturaTraseraExterior});

    let texturaCantos = texturaExterior.clone();
    texturaCantos.wrapS = THREE.RepeatWrapping;
    texturaCantos.wrapT = THREE.RepeatWrapping;
    texturaCantos.repeat.set(grosorBox / 4, altoLab / 4);
    texturaCantos.needsUpdate = true;
    let materialCantos = new THREE.MeshStandardMaterial({map: texturaCantos});

    let texturaCantosHorizontales = texturaExterior.clone();
    texturaCantosHorizontales.wrapS = THREE.RepeatWrapping;
    texturaCantosHorizontales.wrapT = THREE.RepeatWrapping;
    texturaCantosHorizontales.repeat.set((largoLab - grosorBox) / 4, grosorBox / 4);
    texturaCantosHorizontales.needsUpdate = true;
    let materialCantosHorizontales = new THREE.MeshStandardMaterial({map: texturaCantosHorizontales});

    let texturaCantosTrasera = texturaExterior.clone();
    texturaCantosTrasera.wrapS = THREE.RepeatWrapping;
    texturaCantosTrasera.wrapT = THREE.RepeatWrapping;
    texturaCantosTrasera.repeat.set((anchoLab + grosorBox) / 4, grosorBox / 4);
    texturaCantosTrasera.needsUpdate = true;
    let materialCantosTrasera = new THREE.MeshStandardMaterial({map: texturaCantosTrasera});

    for (let i = 0; i < 3; i++) {
        let geometriaParedPlana;
        let pared;
        let materialesPared;
        let materialCaraPositivaX;
        let materialCaraNegativaX;

        if (i < 2) { // Laterales
            geometriaParedPlana = new THREE.BoxGeometry(grosorBox, altoLab, largoLab - grosorBox);
            if (i === 0) { // Pared izquierda interior en +X
                    materialCaraPositivaX = materialLaterales;
                    materialCaraNegativaX = materialLateralesExterior;
                }
                else { // Pared derecha interior en -X
                    materialCaraPositivaX = materialLateralesExterior;
                    materialCaraNegativaX = materialLaterales;
                };

            materialesPared = [
                materialCaraPositivaX, // +X
                materialCaraNegativaX, // -X
                materialCantosHorizontales, // +Y
                materialCantosHorizontales, // -Y
                materialCantos, // +Z
                materialCantos // -Z
                ];
        }
        else { // Trasera
            geometriaParedPlana = new THREE.BoxGeometry(anchoLab + grosorBox, altoLab, grosorBox);
            materialesPared = [
                materialCantos, // +X
                materialCantos, // -X
                materialCantosTrasera, // +Y
                materialCantosTrasera, // -Y
                materialTraseraExterior, // +Z
                materialTrasera // -Z
            ];
        }

        pared = new THREE.Mesh(geometriaParedPlana, materialesPared);

        if (i === 0) {
            pared.position.set(-anchoLab / 2, altoLab / 2, 0);
        }
        else if (i === 1) {
            pared.position.set(anchoLab / 2, altoLab / 2, 0);
        }
        else {
            pared.position.set(0, altoLab / 2, largoLab / 2);
        }

        estructura.add(pared);
        obstaculosAlien.push(pared);
    }


    // Pared puerta
    let anchoLateralPuerta = (anchoLab + grosorBox - anchoPuerta) / 2;

    let texturaLateralesPuertaExterior = texturaExterior.clone();
    texturaLateralesPuertaExterior.wrapS = THREE.RepeatWrapping;
    texturaLateralesPuertaExterior.wrapT = THREE.RepeatWrapping;
    texturaLateralesPuertaExterior.repeat.set(anchoLateralPuerta / 4, altoLab / 4);
    texturaLateralesPuertaExterior.needsUpdate = true;
    let materialLateralesPuertaExterior = new THREE.MeshStandardMaterial({map: texturaLateralesPuertaExterior});

    let texturaSuperiorPuertaExterior = texturaExterior.clone();
    texturaSuperiorPuertaExterior.wrapS = THREE.RepeatWrapping;
    texturaSuperiorPuertaExterior.wrapT = THREE.RepeatWrapping;
    texturaSuperiorPuertaExterior.repeat.set(anchoPuerta / 4, (altoLab - altoPuerta) / 4);
    texturaSuperiorPuertaExterior.needsUpdate = true;
    let materialSuperiorPuertaExterior = new THREE.MeshStandardMaterial({map: texturaSuperiorPuertaExterior});

    let texturaLateralesPuerta = texturaParedesInterior.clone();
    texturaLateralesPuerta.wrapS = THREE.RepeatWrapping;
    texturaLateralesPuerta.wrapT = THREE.RepeatWrapping;
    texturaLateralesPuerta.repeat.set(anchoLateralPuerta / 10, altoLab / 4);
    texturaLateralesPuerta.needsUpdate = true;
    let materialLateralesPuerta = new THREE.MeshStandardMaterial({map: texturaLateralesPuerta});

    let texturaSuperiorPuerta = texturaParedesInterior.clone();
    texturaSuperiorPuerta.wrapS = THREE.RepeatWrapping;
    texturaSuperiorPuerta.wrapT = THREE.RepeatWrapping;
    texturaSuperiorPuerta.repeat.set(anchoPuerta / 10, (altoLab - altoPuerta) / 4);
    texturaSuperiorPuerta.needsUpdate = true;
    let materialSuperiorPuerta = new THREE.MeshStandardMaterial({map: texturaSuperiorPuerta});

    let texturaCantosPuerta = texturaExterior.clone();
    texturaCantosPuerta.wrapS = THREE.RepeatWrapping;
    texturaCantosPuerta.wrapT = THREE.RepeatWrapping;
    texturaCantosPuerta.repeat.set(grosorBox / 4, altoLab / 4);
    texturaCantosPuerta.needsUpdate = true;
    let materialCantosPuerta = new THREE.MeshStandardMaterial({map: texturaCantosPuerta});

    let texturaCantosLaterales = texturaExterior.clone();
    texturaCantosLaterales.wrapS = THREE.RepeatWrapping;
    texturaCantosLaterales.wrapT = THREE.RepeatWrapping;
    texturaCantosLaterales.repeat.set(anchoLateralPuerta / 4, grosorBox / 4);
    texturaCantosLaterales.needsUpdate = true;
    let materialCantosLaterales = new THREE.MeshStandardMaterial({map: texturaCantosLaterales});

    for (let i = 0; i < 2; i++) {
        let geometriaLateralPuerta = new THREE.BoxGeometry(anchoLateralPuerta, altoLab, grosorBox);

        let materialesLateralPuerta = [
            materialCantosPuerta, // +X
            materialCantosPuerta, // -X
            materialCantosLaterales, // +Y
            materialCantosLaterales, // -Y
            materialLateralesPuerta, // +Z interior
            materialLateralesPuertaExterior  // -Z exterior
        ];

        let pared = new THREE.Mesh(geometriaLateralPuerta, materialesLateralPuerta);

        if (i === 0) {
            pared.position.set(-anchoPuerta / 2 - anchoLateralPuerta / 2, altoLab / 2, -largoLab / 2);
        }
        else {
            pared.position.set(anchoPuerta / 2 + anchoLateralPuerta / 2, altoLab / 2, -largoLab / 2);
        }

        estructura.add(pared);
        obstaculosAlien.push(pared);
    }

    let altoBloqueSuperior = altoLab - altoPuerta;

    let texturaCantoSuperior = texturaExterior.clone();
    texturaCantoSuperior.wrapS = THREE.RepeatWrapping;
    texturaCantoSuperior.wrapT = THREE.RepeatWrapping;
    texturaCantoSuperior.repeat.set(anchoPuerta / 4, grosorBox / 4);
    texturaCantoSuperior.needsUpdate = true;
    let materialCantoSuperior = new THREE.MeshStandardMaterial({map: texturaCantoSuperior});

    let texturaCantoExtremos = texturaExterior.clone();
    texturaCantoExtremos.wrapS = THREE.RepeatWrapping;
    texturaCantoExtremos.wrapT = THREE.RepeatWrapping;
    texturaCantoExtremos.repeat.set(grosorBox / 4, altoBloqueSuperior / 4);
    texturaCantoExtremos.needsUpdate = true;
    let materialCantoExtremos = new THREE.MeshStandardMaterial({map: texturaCantoExtremos});

    let materialesParedSuperior = [
        materialCantoExtremos, // +X
        materialCantoExtremos, // -X
        materialCantoSuperior, // +Y
        materialCantoSuperior, // -Y
        materialSuperiorPuerta, // +Z (interior)
        materialSuperiorPuertaExterior  // -Z (exterior)
    ];

    let geometriaParedPuerta = new THREE.BoxGeometry(anchoPuerta, altoBloqueSuperior, grosorBox);
    let paredSuperior = new THREE.Mesh(geometriaParedPuerta, materialesParedSuperior);
    paredSuperior.position.set(0, altoPuerta + altoBloqueSuperior / 2, -largoLab / 2);

    estructura.add(paredSuperior);
    obstaculosAlien.push(paredSuperior);


    // Revestimiento de la entrada al pasillo
    let anchoRevestimientoLateral = (anchoPasillo - anchoPuerta) / 2;
    let posicionRevestimiento = -largoLab / 2 - grosorBox / 2 - 0.01;

    let texturaRevestimientoSuperior = texturaParedesInterior.clone();
    texturaRevestimientoSuperior.wrapS = THREE.RepeatWrapping;
    texturaRevestimientoSuperior.wrapT = THREE.RepeatWrapping;
    texturaRevestimientoSuperior.repeat.set(anchoPuerta / 10, (altoPasillo - altoPuerta) / 4);
    texturaRevestimientoSuperior.needsUpdate = true;
    let materialRevestimientoSuperior = new THREE.MeshStandardMaterial({map: texturaRevestimientoSuperior, side: THREE.DoubleSide});

    let texturaRevestimientoLateral = texturaParedesInterior.clone();
    texturaRevestimientoLateral.wrapS = THREE.RepeatWrapping;
    texturaRevestimientoLateral.wrapT = THREE.RepeatWrapping;
    texturaRevestimientoLateral.repeat.set(anchoRevestimientoLateral / 10, altoPasillo / 4);
    texturaRevestimientoLateral.needsUpdate = true;
    let materialRevestimientoLateral = new THREE.MeshStandardMaterial({map: texturaRevestimientoLateral, side: THREE.DoubleSide});

    let geometriaRevestimientoSuperior = new THREE.PlaneGeometry(anchoPuerta, altoPasillo - altoPuerta);
    let revestimientoSuperior = new THREE.Mesh(geometriaRevestimientoSuperior, materialRevestimientoSuperior);
    revestimientoSuperior.position.set(0, altoPuerta + (altoPasillo - altoPuerta) / 2, posicionRevestimiento);
    estructura.add(revestimientoSuperior);

    let geometriaRevestimientoIzquierdo = new THREE.PlaneGeometry(anchoRevestimientoLateral, altoPasillo);
    let revestimientoIzquierdo = new THREE.Mesh(geometriaRevestimientoIzquierdo, materialRevestimientoLateral);
    revestimientoIzquierdo.position.set(-anchoPuerta / 2 - anchoRevestimientoLateral / 2, altoPasillo / 2, posicionRevestimiento - 0.01);
    estructura.add(revestimientoIzquierdo);

    let geometriaRevestimientoDerecho = new THREE.PlaneGeometry(anchoRevestimientoLateral, altoPasillo);
    let revestimientoDerecho = new THREE.Mesh(geometriaRevestimientoDerecho, materialRevestimientoLateral);
    revestimientoDerecho.position.set(anchoPuerta / 2 + anchoRevestimientoLateral / 2, altoPasillo / 2, posicionRevestimiento - 0.01);
    estructura.add(revestimientoDerecho);


    // Puerta    
    let materialPuerta = new THREE.MeshPhongMaterial({color: 0x8c8c8c, specular: 0x444444, shininess: 50, side: THREE.DoubleSide}); // Puerta automática del laboratorio
    let geometriaPuerta = new THREE.BoxGeometry(anchoPartePuerta, altoPuerta, grosorBox);
    puertaIzquierda = new THREE.Mesh(geometriaPuerta, materialPuerta);
    puertaDerecha = new THREE.Mesh(geometriaPuerta, materialPuerta);

    puertaIzquierda.position.set(-posicionInicialPuerta, altoPuerta / 2, (-largoLab/2) - grosorBox);
    puertaDerecha.position.set(posicionInicialPuerta, altoPuerta / 2, (-largoLab/2) - grosorBox);

    estructura.add(puertaIzquierda);
    estructura.add(puertaDerecha);

    obstaculosAlien.push(puertaIzquierda);
    obstaculosAlien.push(puertaDerecha);
    
    // Lámpara
    lampara = new THREE.Object3D();
    const loaderLampara = new THREE.GLTFLoader();
    loaderLampara.load("models/Lab Lamp by Ali12 - MCI86OzvdG.glb", function(gltf) {
        let modeloLampara = gltf.scene;
        modeloLampara.scale.set(1.5, 1.5, 1.5); // Escala
        modeloLampara.updateMatrixWorld(true);

        let caja = new THREE.Box3().setFromObject(modeloLampara);
        modeloLampara.position.set(-(caja.min.x + caja.max.x) / 2, -caja.max.y, -(caja.min.z + caja.max.z) / 2);
        lampara.add(modeloLampara);
        
        // Lámparas del laboratorio
        const posicionesLamparasLab = [[-12, -6], [12, -6], [-12, 6], [12, 6]];
        for (let i = 0; i < posicionesLamparasLab.length; i++) {
            let x = posicionesLamparasLab[i][0];
            let z = posicionesLamparasLab[i][1];

            // Copia del modelo
            let copiaLampara = lampara.clone();
            copiaLampara.position.set(x, altoLab, z);
            laboratorio.add(copiaLampara);

            // Luz puntual por lámpara
            let foco = new THREE.PointLight(0xffffff, 1, 20);
            foco.position.set(x, altoLab - 2.5, z);
            laboratorio.add(foco);

            if (i === 0 || i === 3) {
                foco.castShadow = true;
                foco.shadow.mapSize.set(512, 512);
                foco.shadow.camera.near = 0.5;
                foco.shadow.camera.far = 20;
            }
        }

        // Añadir el modelo a las lámparas del pasillo
        for (let i = 0; i < soportesLamparasPasillo.length; i++) {
            let copiaLampara = lampara.clone();
            copiaLampara.rotation.y = Math.PI / 2;
            soportesLamparasPasillo[i].add(copiaLampara);
        }

        // Añadir el modelo a las lámparas de las escaleras
        for (let i = 0; i < soportesLamparasEscaleras.length; i++) {
            let copiaLampara = lampara.clone();
            soportesLamparasEscaleras[i].add(copiaLampara);
        }

        // Añadir el modelo a las lámparas de la sala de control
        for (let i = 0; i < soportesLamparasSalaControl.length; i++) {
            let copiaLampara = lampara.clone();
            soportesLamparasSalaControl[i].add(copiaLampara);
        }

        // Añadir el modelo a las lámparas del hangar
        for (let i = 0; i < soportesLamparasHangar.length; i++) {
            let copiaLampara = lampara.clone();
            if (i === 0 || i === 1) {
                copiaLampara.rotation.y = Math.PI / 2;
            }
            soportesLamparasHangar[i].add(copiaLampara);
        }
    },
    undefined,
    function(error) {
        console.error("Error al cargar la lámpara:", error);
    });
    
    // Escritorios
    const loaderDesk = new THREE.GLTFLoader();
    loaderDesk.load("models/Lab Desk by Colonel Cthulu - 6KxaD6I6I48.glb", function(gltf) {
        let desk = new THREE.Object3D();
        let modeloDesk = gltf.scene;
        modeloDesk.rotation.x = -0.06; // El modelo viene mal rotado
        modeloDesk.rotation.z = 0.03;

        let caja = new THREE.Box3().setFromObject(modeloDesk);
        let altura = caja.max.y - caja.min.y;
        let escala = 2.5 / altura;

        modeloDesk.scale.set(escala, escala, escala); // Escala
        modeloDesk.updateMatrixWorld(true);

        caja.setFromObject(modeloDesk);
        modeloDesk.position.set(-(caja.min.x + caja.max.x) / 2, -caja.min.y, -(caja.min.z + caja.max.z) / 2); // Centrar el modelo y apoyarlo en el suelo
        desk.add(modeloDesk);

        // Cuatro escritorios del laboratorio
        const posicionesDesk = [[-9, -11, 0], [13, -8, 0], [20, 2, -Math.PI / 2], [-16, 11, Math.PI]];
        for (let i = 0; i < posicionesDesk.length; i++) {
            let copiaDesk = desk.clone();
            copiaDesk.position.set(posicionesDesk[i][0], -0.05, posicionesDesk[i][1]);
            copiaDesk.rotation.y = posicionesDesk[i][2];
            laboratorio.add(copiaDesk);
            registrarMesa(copiaDesk);
        }

    },
    undefined,
    function(error) {
        console.error("Error al cargar Lab Desk:", error);
    });
    
    // Mesa para la palanca
    const loaderTablePalanca = new THREE.GLTFLoader();
    loaderTablePalanca.load("models/Lab Table by Ali12 - NyeiCAto3N.glb", function(gltf) {
        let mesaPalanca = new THREE.Object3D();
        let modeloTable = gltf.scene;

        // Ajustar la escala
        let caja = new THREE.Box3().setFromObject(modeloTable);
        let altura = caja.max.y - caja.min.y;
        let escala = 2.5 / altura;

        modeloTable.scale.set(escala, escala, escala);
        modeloTable.updateMatrixWorld(true);

        // Centrar el modelo y apoyarlo en el suelo
        caja.setFromObject(modeloTable);
        modeloTable.position.set(
            -(caja.min.x + caja.max.x) / 2,
            -caja.min.y,
            -(caja.min.z + caja.max.z) / 2
        );

        mesaPalanca.position.set(-19, 0, -6);
        mesaPalanca.add(modeloTable);
        laboratorio.add(mesaPalanca);
        registrarMesa(mesaPalanca);

        // Palanca sobre la mesa en el laboratorio
        let materialMetal = new THREE.MeshStandardMaterial({color: 0x9b9b9b, metalness: 0.5, roughness: 0.15});
        let materialRojo = new THREE.MeshStandardMaterial({color: 0xcc2222, roughness: 1});

        let geometriaBasePalanca = new THREE.BoxGeometry(0.8, 0.15, 0.8)
        let basePalanca = new THREE.Mesh(geometriaBasePalanca, materialMetal);
        basePalanca.position.set(0, 2.575, 0);
        mesaPalanca.add(basePalanca);

        palanca = new THREE.Object3D();
        palanca.name = "PalancaInteractiva";
        palanca.position.set(0, 2.65, 0);

        let geometriaPaloPalanca = new THREE.CylinderGeometry(0.07, 0.07, 0.8, 16)
        let paloPalanca = new THREE.Mesh(geometriaPaloPalanca, materialMetal);
        paloPalanca.position.y = 0.4;
        palanca.add(paloPalanca);

        let geometriaBolaPalanca = new THREE.SphereGeometry(0.18, 16, 16)
        let bolaPalanca = new THREE.Mesh(geometriaBolaPalanca, materialRojo);
        bolaPalanca.position.y = 0.85;
        palanca.add(bolaPalanca);

        mesaPalanca.add(palanca);

        // Flecha de tutorial
        flechaPalanca = new THREE.Object3D();

        let materialFlecha = new THREE.MeshBasicMaterial({color: 0xfff000});
        let geometriaPunta = new THREE.ConeGeometry(0.45, 0.7, 8);
        let punta = new THREE.Mesh(geometriaPunta, materialFlecha);
        punta.rotation.z = Math.PI;
        flechaPalanca.add(punta);

        let geometriaCuerpo = new THREE.CylinderGeometry(0.17, 0.17, 0.65, 8);
        let cuerpo = new THREE.Mesh(geometriaCuerpo, materialFlecha);
        cuerpo.position.y = 0.65;
        flechaPalanca.add(cuerpo);

        flechaPalanca.position.set(0, 4.5, 0);
        mesaPalanca.add(flechaPalanca);

        palanca.traverse(function(pieza) {
            if (pieza.isMesh) {
                pieza.castShadow = true;
            }
        });

        // Mesa con palanca de la sala de control
        mesaPalanca.remove(flechaPalanca);
        let mesaPalancaSala = mesaPalanca.clone();
        mesaPalanca.add(flechaPalanca);
        mesaPalancaSala.position.set(finalSalaX + anchoSalaControl - 5, alturaSalaControl, inicioZ + largoTramo2 / 2 + 8);
        mesaPalancaSala.rotation.y = Math.PI;
        palancaSalaControl = mesaPalancaSala.getObjectByName("PalancaInteractiva");

        scene.add(mesaPalancaSala);
        registrarMesa(mesaPalancaSala, true);

    },
    undefined,
    function(error) {
        console.error("Error al cargar Lab Table:", error);
    });

    
    // Urna alien
    let urna = new THREE.Object3D();
    urna.scale.y = 1.2;

    let materialUrna = new THREE.MeshPhongMaterial({color: 0x777f89, specular: 0xcccccc, shininess: 100});
    let geometriaBase = new THREE.CylinderGeometry(2, 2.2, 1.2, 16);
    let base = new THREE.Mesh(geometriaBase, materialUrna);
    base.position.y = 0.6;
    urna.add(base);
    
    let geometriaSuperior = new THREE.CylinderGeometry(2.2, 2, 1.2, 16);
    let superior = new THREE.Mesh(geometriaSuperior, materialUrna);
    superior.position.y = 5.7;
    urna.add(superior);

    let materialUrnaOscuro = new THREE.MeshPhongMaterial({color: 0x303840, specular: 0x888888, shininess: 70});
    let geometriaAroInferior = new THREE.CylinderGeometry(1.8, 1.8, 0.25, 16);
    let aroInferior = new THREE.Mesh(geometriaAroInferior, materialUrnaOscuro);
    aroInferior.position.y = 1.3;
    urna.add(aroInferior);

    let geometriaAroSuperior = new THREE.CylinderGeometry(1.8, 1.8, 0.25, 16);
    let aroSuperior = new THREE.Mesh(geometriaAroSuperior, materialUrnaOscuro);
    aroSuperior.position.y = 5;
    urna.add(aroSuperior);

    let materialMedio = new THREE.MeshPhongMaterial({color: 0x00dd33, specular: 0xaaffbb, shininess: 120, transparent: true, opacity: 0.8});
    let geometriaMedio = new THREE.CylinderGeometry(1.55, 1.55, 3.5, 24);
    let medio = new THREE.Mesh(geometriaMedio, materialMedio);
    medio.position.y = 3.15;
    urna.add(medio);

    for (let i = 0; i < 2; i++) {
        let x;

        if (i === 0) {
            x = -1;
        }
        else {
            x = 1;
        }

        let geometriaTuboVertical = new THREE.CylinderGeometry(0.18, 0.18, 3, 12);
        let tuboVertical = new THREE.Mesh(geometriaTuboVertical, materialUrnaOscuro);
        tuboVertical.position.set(x, 4, 1.8);
        urna.add(tuboVertical);

        let largoTubo = largoLab / 2 - 12 - 1.8 - grosorBox / 2;
        let geometriaTuboHorizontal = new THREE.CylinderGeometry(0.12, 0.12, largoTubo, 12);
        let tuboHorizontal = new THREE.Mesh(geometriaTuboHorizontal, materialUrnaOscuro);
        tuboHorizontal.rotation.x = Math.PI / 2;
        tuboHorizontal.position.set(x, 5, 1.8 + largoTubo / 2);
        urna.add(tuboHorizontal);
    }

    urna.position.set(0, 0, 12);
    urna.traverse(function(pieza) {
        if (pieza.isMesh) {
            pieza.castShadow = true;
        }
    });
    laboratorio.add(urna);

    let geometriaColisionUrna = new THREE.CylinderGeometry(2.2, 2.2, 6.3, 16);
    let materialColisionUrna = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide});
    let colisionUrna = new THREE.Mesh(geometriaColisionUrna, materialColisionUrna);
    colisionUrna.position.set(0, 3.78, 12);
    colisionUrna.scale.y = 1.2;
    laboratorio.add(colisionUrna);
    obstaculosAlien.push(colisionUrna);


    scene.add(laboratorio);
}

function crearPasillo() {
    // Posición del pasillo, conectado a la salida del laboratorio
    const inicioPasillo = -largoLab / 2;
    const centroPasillo = inicioPasillo - largoPasillo / 2;
    const finalPasillo = inicioPasillo - largoPasillo;

    pasillo = new THREE.Object3D();
    // let materialPasillo = new THREE.MeshStandardMaterial({color: 0x526879, side: THREE.DoubleSide});

    
    // Suelo
    let materialSueloInterior = new THREE.MeshPhongMaterial({color: 0x526575, specular: 0x888888, shininess: 40});

    let texturaSueloExterior = texturaExterior.clone();
    texturaSueloExterior.wrapS = THREE.RepeatWrapping;
    texturaSueloExterior.wrapT = THREE.RepeatWrapping;
    texturaSueloExterior.repeat.set(anchoPasillo / 4, largoPasillo / 4);
    texturaSueloExterior.needsUpdate = true;
    let materialSueloExterior = new THREE.MeshStandardMaterial({map: texturaSueloExterior});

    let texturaLateralX = texturaExterior.clone();
    texturaLateralX.wrapS = THREE.RepeatWrapping;
    texturaLateralX.wrapT = THREE.RepeatWrapping;
    texturaLateralX.repeat.set(largoPasillo / 4, grosorBox / 4);
    texturaLateralX.needsUpdate = true;
    let materialLateralX = new THREE.MeshStandardMaterial({map: texturaLateralX});

    let texturaLateralZ = texturaExterior.clone();
    texturaLateralZ.wrapS = THREE.RepeatWrapping;
    texturaLateralZ.wrapT = THREE.RepeatWrapping;
    texturaLateralZ.repeat.set(anchoPasillo / 4, grosorBox / 4);
    texturaLateralZ.needsUpdate = true;
    let materialLateralZ = new THREE.MeshStandardMaterial({map: texturaLateralZ});

    let materialesSuelo = [
        materialLateralX, // +X
        materialLateralX, // -X
        materialSueloInterior, // +Y
        materialSueloExterior, // -Y
        materialLateralZ, // +Z
        materialLateralZ // -Z
    ];

    let geometriaSuelo = new THREE.BoxGeometry(anchoPasillo, grosorBox, largoPasillo);
    let suelo = new THREE.Mesh(geometriaSuelo, materialesSuelo);
    suelo.position.set(0, -grosorBox / 2, centroPasillo);

    estructura.add(suelo);
    superficiesElevadas.push(suelo);


    // Techo
    let texturaTechoExterior = texturaExterior.clone();
    texturaTechoExterior.wrapS = THREE.RepeatWrapping;
    texturaTechoExterior.wrapT = THREE.RepeatWrapping;
    texturaTechoExterior.repeat.set(anchoPasillo / 4, largoPasillo / 4);
    texturaTechoExterior.needsUpdate = true;
    let materialTechoExterior = new THREE.MeshStandardMaterial({map: texturaTechoExterior});

    let texturaTechoInterior = texturaParedes.clone();
    texturaTechoInterior.wrapS = THREE.MirroredRepeatWrapping;
    texturaTechoInterior.wrapT = THREE.MirroredRepeatWrapping;
    texturaTechoInterior.repeat.set(anchoPasillo / 4, largoPasillo / 4);
    texturaTechoInterior.needsUpdate = true;
    let materialTechoInterior = new THREE.MeshStandardMaterial({map: texturaTechoInterior});

    let texturaTechoLateralX = texturaExterior.clone();
    texturaTechoLateralX.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralX.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralX.repeat.set(largoPasillo / 4, grosorBox / 4);
    texturaTechoLateralX.needsUpdate = true;
    let materialTechoLateralX = new THREE.MeshStandardMaterial({map: texturaTechoLateralX});

    let texturaTechoLateralZ = texturaExterior.clone();
    texturaTechoLateralZ.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralZ.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralZ.repeat.set(anchoPasillo / 4, grosorBox / 4);
    texturaTechoLateralZ.needsUpdate = true;
    let materialTechoLateralZ = new THREE.MeshStandardMaterial({map: texturaTechoLateralZ});

    let materialesTecho = [
        materialTechoLateralX, // +X
        materialTechoLateralX, // -X
        materialTechoExterior, // +Y
        materialTechoInterior, // -Y
        materialTechoLateralZ, // +Z
        materialTechoLateralZ // -Z
    ];

    let geometriaTecho = new THREE.BoxGeometry(anchoPasillo, grosorBox, largoPasillo);
    let techo = new THREE.Mesh(geometriaTecho, materialesTecho);
    techo.position.set(0, altoPasillo + grosorBox / 2, centroPasillo);

    estructura.add(techo);

    
    // Paredes laterales con ventanas
    let materialVidrio = new THREE.MeshPhongMaterial({color: 0x8bd8ed, transparent: true, opacity: 0.18, shininess: 100, side: THREE.DoubleSide, depthWrite: false});
    let materialPilares = new THREE.MeshPhongMaterial({color: 0x526575, specular: 0x888888, shininess: 60});
    let alturaSuperiorVentana = altoPasillo - alturaInferiorVentana - altoVentana;

    let texturaInferiorExterior = texturaExterior.clone();
    texturaInferiorExterior.wrapS = THREE.RepeatWrapping;
    texturaInferiorExterior.wrapT = THREE.RepeatWrapping;
    texturaInferiorExterior.repeat.set(largoPasillo / 4, alturaInferiorVentana / 4);
    texturaInferiorExterior.needsUpdate = true;
    let materialInferiorExterior = new THREE.MeshStandardMaterial({map: texturaInferiorExterior});

    let texturaInferiorInterior = texturaParedesInterior.clone();
    texturaInferiorInterior.wrapS = THREE.RepeatWrapping;
    texturaInferiorInterior.wrapT = THREE.RepeatWrapping;
    texturaInferiorInterior.repeat.set(largoPasillo / 10, alturaInferiorVentana / 4);
    texturaInferiorInterior.needsUpdate = true;
    let materialInferiorInterior = new THREE.MeshStandardMaterial({map: texturaInferiorInterior});

    let texturaSuperiorExterior = texturaExterior.clone();
    texturaSuperiorExterior.wrapS = THREE.RepeatWrapping;
    texturaSuperiorExterior.wrapT = THREE.RepeatWrapping;
    texturaSuperiorExterior.repeat.set(largoPasillo / 4, alturaSuperiorVentana / 4);
    texturaSuperiorExterior.needsUpdate = true;
    let materialSuperiorExterior = new THREE.MeshStandardMaterial({map: texturaSuperiorExterior});

    let texturaSuperiorInterior = texturaParedesInterior.clone();
    texturaSuperiorInterior.wrapS = THREE.RepeatWrapping;
    texturaSuperiorInterior.wrapT = THREE.RepeatWrapping;
    texturaSuperiorInterior.repeat.set(largoPasillo / 10, alturaSuperiorVentana / 4);
    texturaSuperiorInterior.needsUpdate = true;
    let materialSuperiorInterior = new THREE.MeshStandardMaterial({map: texturaSuperiorInterior});

    let texturaCantosInferiores = texturaExterior.clone();
    texturaCantosInferiores.wrapS = THREE.RepeatWrapping;
    texturaCantosInferiores.wrapT = THREE.RepeatWrapping;
    texturaCantosInferiores.repeat.set(grosorBox / 4, alturaInferiorVentana / 4);
    texturaCantosInferiores.needsUpdate = true;
    let materialCantosInferiores = new THREE.MeshStandardMaterial({map: texturaCantosInferiores});

    let texturaCantosSuperiores = texturaExterior.clone();
    texturaCantosSuperiores.wrapS = THREE.RepeatWrapping;
    texturaCantosSuperiores.wrapT = THREE.RepeatWrapping;
    texturaCantosSuperiores.repeat.set(grosorBox / 4, alturaSuperiorVentana / 4);
    texturaCantosSuperiores.needsUpdate = true;
    let materialCantosSuperiores = new THREE.MeshStandardMaterial({map: texturaCantosSuperiores});

    let texturaCantosHorizontales = texturaExterior.clone();
    texturaCantosHorizontales.wrapS = THREE.RepeatWrapping;
    texturaCantosHorizontales.wrapT = THREE.RepeatWrapping;
    texturaCantosHorizontales.repeat.set(largoPasillo / 4, grosorBox / 4);
    texturaCantosHorizontales.needsUpdate = true;
    let materialCantosHorizontales = new THREE.MeshStandardMaterial({map: texturaCantosHorizontales});

    for (let i = 0; i < 2; i++) {
        let x;
        let materialCaraPositivaXInferior;
        let materialCaraNegativaXInferior;
        let materialCaraPositivaXSuperior;
        let materialCaraNegativaXSuperior;

        if (i === 0) {// Pared izquierda interior en +X
            x = -anchoPasillo / 2;

            materialCaraPositivaXInferior = materialInferiorInterior;
            materialCaraNegativaXInferior = materialInferiorExterior;
            materialCaraPositivaXSuperior = materialSuperiorInterior;
            materialCaraNegativaXSuperior = materialSuperiorExterior;
        }
        else {// Pared derecha interior en -X
            x = anchoPasillo / 2;

            materialCaraPositivaXInferior = materialInferiorExterior;
            materialCaraNegativaXInferior = materialInferiorInterior;
            materialCaraPositivaXSuperior = materialSuperiorExterior;
            materialCaraNegativaXSuperior = materialSuperiorInterior;
        }

        let materialesInferior = [
            materialCaraPositivaXInferior, // +X
            materialCaraNegativaXInferior, // -X
            materialCantosHorizontales, // +Y
            materialCantosHorizontales, // -Y
            materialCantosInferiores, // +Z
            materialCantosInferiores // -Z
        ];

        let geometriaInferior = new THREE.BoxGeometry(grosorBox, alturaInferiorVentana, largoPasillo);
        let paredInferior = new THREE.Mesh(geometriaInferior, materialesInferior);
        paredInferior.position.set(x, alturaInferiorVentana / 2, centroPasillo);

        estructura.add(paredInferior);
        obstaculosAlien.push(paredInferior);

        let materialesSuperior = [
            materialCaraPositivaXSuperior, // +X
            materialCaraNegativaXSuperior, // -X
            materialCantosHorizontales, // +Y
            materialCantosHorizontales, // -Y
            materialCantosSuperiores, // +Z
            materialCantosSuperiores // -Z
        ];

        let geometriaSuperior = new THREE.BoxGeometry(grosorBox, alturaSuperiorVentana, largoPasillo);
        let paredSuperior = new THREE.Mesh(geometriaSuperior, materialesSuperior);
        paredSuperior.position.set(x, alturaInferiorVentana + altoVentana + alturaSuperiorVentana / 2, centroPasillo);

        estructura.add(paredSuperior);
        obstaculosAlien.push(paredSuperior);

        // Pilares
        for (let j = 0; j <= numeroVentanas; j++) {
            let geometriaPilar = new THREE.BoxGeometry(grosorBox, altoVentana, grosorPilar);
            let pilar = new THREE.Mesh(geometriaPilar, materialPilares);

            pilar.position.set(x, alturaInferiorVentana + altoVentana / 2, inicioPasillo - grosorPilar / 2 - j * (largoPasillo - grosorPilar) / numeroVentanas);

            estructura.add(pilar);
            obstaculosAlien.push(pilar);
        }

        // Vidrio
        let separacionPilares = (largoPasillo - grosorPilar) / numeroVentanas;

        for (let j = 0; j < numeroVentanas; j++) {
            let centroHueco = inicioPasillo - grosorPilar / 2 - (j + 0.5) * separacionPilares;
            let anchoVidrio = separacionPilares - grosorPilar - 0.1;

            let geometriaVidrio = new THREE.BoxGeometry(0.05, altoVentana - 0.1, anchoVidrio);
            let vidrio = new THREE.Mesh(geometriaVidrio, materialVidrio);
            vidrio.position.set(x, alturaInferiorVentana + altoVentana / 2, centroHueco);

            estructura.add(vidrio);
            obstaculosAlien.push(vidrio);
        }
    }


    // Pared final con hueco para la puerta
    const anchoPuertaPasillo = anchoPuerta;
    const altoPuertaPasillo = altoPuerta;
    let anchoLateral = (anchoPasillo - anchoPuertaPasillo) / 2;
    let altoParedFinal = altoPasillo + alturaElevacion;
    let altoSuperior = altoParedFinal - altoPuertaPasillo;

    let texturaFinalInterior = texturaParedesInterior.clone();
    texturaFinalInterior.wrapS = THREE.RepeatWrapping;
    texturaFinalInterior.wrapT = THREE.RepeatWrapping;
    texturaFinalInterior.repeat.set(anchoLateral / 10, altoParedFinal / 4);
    texturaFinalInterior.needsUpdate = true;
    let materialFinalInterior = new THREE.MeshStandardMaterial({map: texturaFinalInterior});

    let texturaFinalExterior = texturaExterior.clone();
    texturaFinalExterior.wrapS = THREE.RepeatWrapping;
    texturaFinalExterior.wrapT = THREE.RepeatWrapping;
    texturaFinalExterior.repeat.set(anchoLateral / 4, altoParedFinal / 4);
    texturaFinalExterior.needsUpdate = true;
    let materialFinalExterior = new THREE.MeshStandardMaterial({map: texturaFinalExterior});

    let texturaCantosLaterales = texturaExterior.clone();
    texturaCantosLaterales.wrapS = THREE.RepeatWrapping;
    texturaCantosLaterales.wrapT = THREE.RepeatWrapping;
    texturaCantosLaterales.repeat.set(grosorBox / 4, altoParedFinal / 4);
    texturaCantosLaterales.needsUpdate = true;
    let materialCantosLaterales = new THREE.MeshStandardMaterial({map: texturaCantosLaterales});

    let texturaCantosHoriz = texturaExterior.clone();
    texturaCantosHoriz.wrapS = THREE.RepeatWrapping;
    texturaCantosHoriz.wrapT = THREE.RepeatWrapping;
    texturaCantosHoriz.repeat.set(anchoLateral / 4, grosorBox / 4);
    texturaCantosHoriz.needsUpdate = true;
    let materialCantosHoriz = new THREE.MeshStandardMaterial({map: texturaCantosHoriz});

    let materialesLateral = [
        materialCantosLaterales, // +X
        materialCantosLaterales, // -X
        materialCantosHoriz, // +Y
        materialCantosHoriz, // -Y
        materialFinalExterior, // +Z pasillo
        materialFinalInterior // -Z escaleras
    ];

    for (let i = 0; i < 2; i++) {
        let x = anchoPuertaPasillo / 2 + anchoLateral / 2;

        if (i === 0) {
            x = -x;
        }

        let geometriaParedPuerta = new THREE.BoxGeometry(anchoLateral, altoParedFinal, grosorBox);
        let paredLateral = new THREE.Mesh(geometriaParedPuerta, materialesLateral);

        paredLateral.position.set(x, altoParedFinal / 2, finalPasillo);

        estructura.add(paredLateral);
        obstaculosAlien.push(paredLateral);
    }

    let texturaSupInterior = texturaParedesInterior.clone();
    texturaSupInterior.wrapS = THREE.RepeatWrapping;
    texturaSupInterior.wrapT = THREE.RepeatWrapping;
    texturaSupInterior.repeat.set(anchoPuertaPasillo / 10, altoSuperior / 4);
    texturaSupInterior.needsUpdate = true;
    let materialSupInterior = new THREE.MeshStandardMaterial({map: texturaSupInterior});

    let texturaSupExterior = texturaExterior.clone();
    texturaSupExterior.wrapS = THREE.RepeatWrapping;
    texturaSupExterior.wrapT = THREE.RepeatWrapping;
    texturaSupExterior.repeat.set(anchoPuertaPasillo / 4, altoSuperior / 4);
    texturaSupExterior.needsUpdate = true;
    let materialSupExterior = new THREE.MeshStandardMaterial({map: texturaSupExterior});

    let texturaCantosSuperior = texturaExterior.clone();
    texturaCantosSuperior.wrapS = THREE.RepeatWrapping;
    texturaCantosSuperior.wrapT = THREE.RepeatWrapping;
    texturaCantosSuperior.repeat.set(grosorBox / 4, altoSuperior / 4);
    texturaCantosSuperior.needsUpdate = true;
    let materialCantosSuperior = new THREE.MeshStandardMaterial({map: texturaCantosSuperior});

    let texturaCantosSuperiorHorizontal = texturaExterior.clone();
    texturaCantosSuperiorHorizontal.wrapS = THREE.RepeatWrapping;
    texturaCantosSuperiorHorizontal.wrapT = THREE.RepeatWrapping;
    texturaCantosSuperiorHorizontal.repeat.set(anchoPuertaPasillo / 4, grosorBox / 4);
    texturaCantosSuperiorHorizontal.needsUpdate = true;
    let materialCantosSuperiorHorizontal = new THREE.MeshStandardMaterial({map: texturaCantosSuperiorHorizontal});

    let materialesSuperior = [
        materialCantosSuperior, // +X
        materialCantosSuperior, // -X
        materialCantosSuperiorHorizontal, // +Y
        materialCantosSuperiorHorizontal, // -Y
        materialSupExterior, // +Z pasillo
        materialSupInterior // -Z escaleras
    ];

    let geometriaSuperiorPuerta = new THREE.BoxGeometry(anchoPuertaPasillo, altoSuperior, grosorBox);
    let paredSuperiorPuerta = new THREE.Mesh(geometriaSuperiorPuerta, materialesSuperior);

    paredSuperiorPuerta.position.set(0, altoPuertaPasillo + altoSuperior / 2, finalPasillo);

    estructura.add(paredSuperiorPuerta);
    obstaculosAlien.push(paredSuperiorPuerta);


    // Lámparas del pasillo
    for (let j = 1; j <= 2; j++) {
        let z = inicioPasillo - grosorPilar / 2 - j * (largoPasillo - grosorPilar) / numeroVentanas;

        let soporteLampara = new THREE.Object3D();
        soporteLampara.position.set(0, altoPasillo, z);
        pasillo.add(soporteLampara);
        soportesLamparasPasillo.push(soporteLampara);

        let foco = new THREE.PointLight(0xffffff, 1, 15);
        foco.position.set(0, altoPasillo - 2.5, z);
        pasillo.add(foco);
        if (j === 1) {
            foco.castShadow = true;
            foco.shadow.mapSize.set(512, 512);
            foco.shadow.camera.near = 0.5;
            foco.shadow.camera.far = 15;
            foco.shadow.bias = -0.001;
        }
    }


    // Rieles
    let materialRiel = new THREE.MeshStandardMaterial({color: 0xb5b5b5, metalness: 0.8, roughness: 0.3});
    let largoRiel = largoPasillo - 12;
    let centroRiel = -largoLab / 2 - largoPasillo / 2;
    let alturaRielInferior = alturaInferiorVentana - 0.5;
    let alturaRielSuperior = alturaInferiorVentana + altoVentana + 0.5;

    for (let i = 0; i < 2; i++) {
        let x = anchoPasillo / 2 - 0.3;
        if (i === 0) {
            x = -x;
        }

        let geometriaRielInf = new THREE.BoxGeometry(0.2, 0.2, largoRiel)
        let rielInferior = new THREE.Mesh(geometriaRielInf, materialRiel);
        rielInferior.position.set(x, alturaRielInferior, centroRiel);
        pasillo.add(rielInferior);

        let geometriaRielSup = new THREE.BoxGeometry(0.2, 0.2, largoRiel)
        let rielSuperior = new THREE.Mesh(geometriaRielSup, materialRiel);
        rielSuperior.position.set(x, alturaRielSuperior, centroRiel);
        pasillo.add(rielSuperior);
    }

    
    // Láseres
    let materialEmisor = new THREE.MeshStandardMaterial({color: 0x111111, metalness: 0.5, roughness: 0.4});
    let materialLaser = new THREE.MeshBasicMaterial({color: 0xff0000});
    let materialBrillo = new THREE.MeshBasicMaterial({color: 0xff3333, transparent: true, opacity: 0.2, depthWrite: false});
    let ordenLaseres = [1, 3, 2, 2, 3, 1, 3, 2, 3];

    let finalRiel = centroRiel - largoRiel / 2;

    for (let i = 0; i < ordenLaseres.length; i++) {
        let tipo = ordenLaseres[i];
        let laser = new THREE.Object3D();
        let alturaIzquierda;
        let alturaDerecha;

        if (tipo === 1) {
            alturaIzquierda = alturaRielSuperior;
            alturaDerecha = alturaRielInferior;
        }
        else if (tipo === 2) {
            alturaIzquierda = alturaRielInferior;
            alturaDerecha = alturaRielSuperior;
        }
        else {
            alturaIzquierda = alturaRielInferior;
            alturaDerecha = alturaRielInferior;
        }

        let puntoA = new THREE.Vector3(-anchoPasillo / 2 + 0.3, alturaIzquierda, 0);
        let puntoB = new THREE.Vector3(anchoPasillo / 2 - 0.3, alturaDerecha, 0);
        
        let geometriaEmisor = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        let emisorA = new THREE.Mesh(geometriaEmisor, materialEmisor);
        emisorA.position.copy(puntoA);
        laser.add(emisorA);
        let emisorB = new THREE.Mesh(geometriaEmisor, materialEmisor);
        emisorB.position.copy(puntoB);
        laser.add(emisorB);

        let direccionLaser = new THREE.Vector3().subVectors(puntoB, puntoA);
        let longitudLaser = direccionLaser.length();
        let centroLaser = new THREE.Vector3().addVectors(puntoA, puntoB).multiplyScalar(0.5);

        let geometriaLaser = new THREE.CylinderGeometry(0.06, 0.06, longitudLaser, 12);
        let haz = new THREE.Mesh(geometriaLaser, materialLaser);
        haz.position.copy(centroLaser);
        haz.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direccionLaser.normalize());
        laser.add(haz);

        let geometriaBrillo = new THREE.CylinderGeometry(0.16, 0.16, longitudLaser, 12);
        let brillo = new THREE.Mesh(geometriaBrillo, materialBrillo);
        brillo.position.copy(haz.position);
        brillo.quaternion.copy(haz.quaternion);
        laser.add(brillo);

        laser.position.z = finalRiel;
        laser.visible = false;

        pasillo.add(laser);

        lasers.push({objeto: laser, activo: false});
    }
    tiempoLaser = intervaloLaser;
    scene.add(pasillo);
}

function crearEscaleras() {
    let largoSueloInicial = inicioX - finalEscalera;
    let largoSueloFinal = finalEscalera - finalX;
    let largoPasilloX = inicioX - finalX;
    let limiteEntrada = -anchoPasillo / 2;
    let largoParedInterior = limiteEntrada - finalX;
    // let materialPasilloP = new THREE.MeshStandardMaterial({color: 0x526879, side: THREE.DoubleSide});


    // Suelo inicial
    let materialSueloInterior = new THREE.MeshPhongMaterial({color: 0x526575, specular: 0x888888, shininess: 40});

    let texturaSueloExterior = texturaExterior.clone();
    texturaSueloExterior.wrapS = THREE.RepeatWrapping;
    texturaSueloExterior.wrapT = THREE.RepeatWrapping;
    texturaSueloExterior.repeat.set(largoSueloInicial / 4, anchoEscaleras / 4);
    texturaSueloExterior.needsUpdate = true;
    let materialSueloExterior = new THREE.MeshStandardMaterial({map: texturaSueloExterior});

    let texturaLateralX = texturaExterior.clone();
    texturaLateralX.wrapS = THREE.RepeatWrapping;
    texturaLateralX.wrapT = THREE.RepeatWrapping;
    texturaLateralX.repeat.set(anchoEscaleras / 4, grosorBox / 4);
    texturaLateralX.needsUpdate = true;
    let materialLateralX = new THREE.MeshStandardMaterial({map: texturaLateralX});

    let texturaLateralZ = texturaExterior.clone();
    texturaLateralZ.wrapS = THREE.RepeatWrapping;
    texturaLateralZ.wrapT = THREE.RepeatWrapping;
    texturaLateralZ.repeat.set(largoSueloInicial / 4, grosorBox / 4);
    texturaLateralZ.needsUpdate = true;
    let materialLateralZ = new THREE.MeshStandardMaterial({map: texturaLateralZ});

    let materialesSueloInicial = [
        materialLateralX, // +X
        materialLateralX, // -X
        materialSueloInterior, // +Y
        materialSueloExterior, // -Y
        materialLateralZ, // +Z
        materialLateralZ // -Z
    ];

    let geometriaSueloInicial = new THREE.BoxGeometry(largoSueloInicial, grosorBox, anchoEscaleras);
    let sueloInicial = new THREE.Mesh(geometriaSueloInicial, materialesSueloInicial);
    sueloInicial.position.set((inicioX + finalEscalera) / 2, -grosorBox / 2, centroZ);

    estructura.add(sueloInicial);
    superficiesElevadas.push(sueloInicial);


    //Escalones
    let largoEscalon = (inicioEscalera - finalEscalera) / numeroEscalones;
    for (let i = 0; i < numeroEscalones; i++) {
        let alturaEscalon = (i + 1) * alturaElevacion / numeroEscalones;

        let texturaInferiorEscalon = texturaExterior.clone();
        texturaInferiorEscalon.wrapS = THREE.RepeatWrapping;
        texturaInferiorEscalon.wrapT = THREE.RepeatWrapping;
        texturaInferiorEscalon.repeat.set(largoEscalon / 4, anchoEscaleras / 4);
        texturaInferiorEscalon.needsUpdate = true;
        let materialInferiorEscalon = new THREE.MeshStandardMaterial({map: texturaInferiorEscalon});

        let texturaLateralXEscalon = texturaExterior.clone();
        texturaLateralXEscalon.wrapS = THREE.RepeatWrapping;
        texturaLateralXEscalon.wrapT = THREE.RepeatWrapping;
        texturaLateralXEscalon.repeat.set(anchoEscaleras / 4, alturaEscalon / 4);
        texturaLateralXEscalon.needsUpdate = true;
        let materialLateralXEscalon = new THREE.MeshStandardMaterial({map: texturaLateralXEscalon});

        let texturaLateralZEscalon = texturaExterior.clone();
        texturaLateralZEscalon.wrapS = THREE.RepeatWrapping;
        texturaLateralZEscalon.wrapT = THREE.RepeatWrapping;
        texturaLateralZEscalon.repeat.set(largoEscalon / 4, alturaEscalon / 4);
        texturaLateralZEscalon.needsUpdate = true;
        let materialLateralZEscalon = new THREE.MeshStandardMaterial({map: texturaLateralZEscalon});

        let materialesEscalon = [
            materialSueloInterior, // +X
            materialLateralXEscalon, // -X
            materialSueloInterior, // +Y
            materialInferiorEscalon, // -Y
            materialLateralZEscalon, // +Z
            materialLateralZEscalon // -Z
        ];

        let geometriaEscalon = new THREE.BoxGeometry(largoEscalon, alturaEscalon, anchoEscaleras);
        let escalon = new THREE.Mesh(geometriaEscalon, materialesEscalon);

        escalon.position.set(inicioEscalera - (i + 0.5) * largoEscalon, alturaEscalon / 2, centroZ);

        estructura.add(escalon);
        superficiesElevadas.push(escalon);
    }
    

    // Suelo final
    let alturaSueloFinal = alturaElevacion + grosorBox;

    let texturaFrontalSueloFinal = texturaExterior.clone();
    texturaFrontalSueloFinal.wrapS = THREE.RepeatWrapping;
    texturaFrontalSueloFinal.wrapT = THREE.RepeatWrapping;
    texturaFrontalSueloFinal.repeat.set(anchoEscaleras / 2, alturaSueloFinal / 2);
    texturaFrontalSueloFinal.needsUpdate = true;
    let materialFrontalSueloFinal = new THREE.MeshStandardMaterial({map: texturaFrontalSueloFinal});

    let texturaInferiorSueloFinal = texturaExterior.clone();
    texturaInferiorSueloFinal.wrapS = THREE.RepeatWrapping;
    texturaInferiorSueloFinal.wrapT = THREE.RepeatWrapping;
    texturaInferiorSueloFinal.repeat.set(largoSueloFinal / 2, anchoEscaleras / 2);
    texturaInferiorSueloFinal.needsUpdate = true;
    let materialInferiorSueloFinal = new THREE.MeshStandardMaterial({map: texturaInferiorSueloFinal});

    let texturaLateralSueloFinal = texturaExterior.clone();
    texturaLateralSueloFinal.wrapS = THREE.RepeatWrapping;
    texturaLateralSueloFinal.wrapT = THREE.RepeatWrapping;
    texturaLateralSueloFinal.repeat.set(largoSueloFinal / 2, alturaSueloFinal / 2);
    texturaLateralSueloFinal.needsUpdate = true;
    let materialLateralSueloFinal = new THREE.MeshStandardMaterial({map: texturaLateralSueloFinal});

    let materialesSueloFinal = [
        materialFrontalSueloFinal, // +X
        materialFrontalSueloFinal, // -X
        materialSueloInterior, // +Y
        materialInferiorSueloFinal, // -Y
        materialLateralSueloFinal, // +Z
        materialLateralSueloFinal // -Z
    ];

    let geometriaSueloFinal = new THREE.BoxGeometry(largoSueloFinal, alturaSueloFinal, anchoEscaleras);

    let sueloFinal = new THREE.Mesh(geometriaSueloFinal, materialesSueloFinal);
    sueloFinal.position.set((finalEscalera + finalX) / 2, (alturaElevacion - grosorBox) / 2, centroZ);

    estructura.add(sueloFinal);
    superficiesElevadas.push(sueloFinal);

    
    // Paredes exterior
    let texturaParedExteriorExterior = texturaExterior.clone();
    texturaParedExteriorExterior.wrapS = THREE.RepeatWrapping;
    texturaParedExteriorExterior.wrapT = THREE.RepeatWrapping;
    texturaParedExteriorExterior.repeat.set(largoPasilloX / 4, (altoPasillo + alturaElevacion) / 4);
    texturaParedExteriorExterior.needsUpdate = true;
    let materialParedExteriorExterior = new THREE.MeshStandardMaterial({map: texturaParedExteriorExterior});

    let texturaParedExteriorInterior = texturaParedesInterior.clone();
    texturaParedExteriorInterior.wrapS = THREE.RepeatWrapping;
    texturaParedExteriorInterior.wrapT = THREE.RepeatWrapping;
    texturaParedExteriorInterior.repeat.set(largoPasilloX / 10, (altoPasillo + alturaElevacion) / 4);
    texturaParedExteriorInterior.needsUpdate = true;
    let materialParedExteriorInterior = new THREE.MeshStandardMaterial({map: texturaParedExteriorInterior});

    let texturaCantosVerticales = texturaExterior.clone();
    texturaCantosVerticales.wrapS = THREE.RepeatWrapping;
    texturaCantosVerticales.wrapT = THREE.RepeatWrapping;
    texturaCantosVerticales.repeat.set(grosorBox / 4, (altoPasillo + alturaElevacion) / 4);
    texturaCantosVerticales.needsUpdate = true;
    let materialCantosVerticales = new THREE.MeshStandardMaterial({map: texturaCantosVerticales});

    let texturaCantosHorizontales = texturaExterior.clone();
    texturaCantosHorizontales.wrapS = THREE.RepeatWrapping;
    texturaCantosHorizontales.wrapT = THREE.RepeatWrapping;
    texturaCantosHorizontales.repeat.set(largoPasilloX / 4, grosorBox / 4);
    texturaCantosHorizontales.needsUpdate = true;
    let materialCantosHorizontales = new THREE.MeshStandardMaterial({map: texturaCantosHorizontales});

    let materialesParedExterior = [
        materialCantosVerticales, // +X
        materialCantosVerticales, // -X
        materialCantosHorizontales, // +Y
        materialCantosHorizontales, // -Y
        materialParedExteriorInterior, // +Z interior
        materialParedExteriorExterior // -Z exterior
    ];

    let geometriaParedExterior = new THREE.BoxGeometry(largoPasilloX, altoPasillo + alturaElevacion, grosorBox);
    let paredExterior = new THREE.Mesh(geometriaParedExterior, materialesParedExterior);

    paredExterior.position.set((inicioX + finalX) / 2, (altoPasillo + alturaElevacion) / 2, inicioZ - anchoEscaleras);

    estructura.add(paredExterior);
    obstaculosAlien.push(paredExterior);


    // Pared interior
    let texturaParedInteriorExterior = texturaExterior.clone();
    texturaParedInteriorExterior.wrapS = THREE.RepeatWrapping;
    texturaParedInteriorExterior.wrapT = THREE.RepeatWrapping;
    texturaParedInteriorExterior.repeat.set(largoParedInterior / 4, (altoPasillo + alturaElevacion) / 4);
    texturaParedInteriorExterior.needsUpdate = true;
    let materialParedInteriorExterior = new THREE.MeshStandardMaterial({map: texturaParedInteriorExterior});

    let texturaParedInteriorInterior = texturaParedesInterior.clone();
    texturaParedInteriorInterior.wrapS = THREE.RepeatWrapping;
    texturaParedInteriorInterior.wrapT = THREE.RepeatWrapping;
    texturaParedInteriorInterior.repeat.set(largoParedInterior / 10, (altoPasillo + alturaElevacion) / 4);
    texturaParedInteriorInterior.needsUpdate = true;
    let materialParedInteriorInterior = new THREE.MeshStandardMaterial({map: texturaParedInteriorInterior});

    let texturaCantosVerticalesInterior = texturaExterior.clone();
    texturaCantosVerticalesInterior.wrapS = THREE.RepeatWrapping;
    texturaCantosVerticalesInterior.wrapT = THREE.RepeatWrapping;
    texturaCantosVerticalesInterior.repeat.set(grosorBox / 4, (altoPasillo + alturaElevacion) / 4);
    texturaCantosVerticalesInterior.needsUpdate = true;
    let materialCantosVerticalesInterior = new THREE.MeshStandardMaterial({map: texturaCantosVerticalesInterior});

    let texturaCantosHorizontalesInterior = texturaExterior.clone();
    texturaCantosHorizontalesInterior.wrapS = THREE.RepeatWrapping;
    texturaCantosHorizontalesInterior.wrapT = THREE.RepeatWrapping;
    texturaCantosHorizontalesInterior.repeat.set(largoParedInterior / 4, grosorBox / 4);
    texturaCantosHorizontalesInterior.needsUpdate = true;
    let materialCantosHorizontalesInterior = new THREE.MeshStandardMaterial({map: texturaCantosHorizontalesInterior});

    let materialesParedInterior = [
        materialCantosVerticalesInterior, // +X
        materialCantosVerticalesInterior, // -X
        materialCantosHorizontalesInterior, // +Y
        materialCantosHorizontalesInterior, // -Y
        materialParedInteriorExterior, // +Z exterior
        materialParedInteriorInterior // -Z interior
    ];

    let geometriaParedInterior = new THREE.BoxGeometry(largoParedInterior, altoPasillo + alturaElevacion, grosorBox);
    let paredInterior = new THREE.Mesh(geometriaParedInterior, materialesParedInterior);

    paredInterior.position.set((finalX + limiteEntrada) / 2, (altoPasillo + alturaElevacion) / 2, inicioZ);

    estructura.add(paredInterior);
    obstaculosAlien.push(paredInterior);


    // Pared derecha
    let texturaParedDerechaExterior = texturaExterior.clone();
    texturaParedDerechaExterior.wrapS = THREE.RepeatWrapping;
    texturaParedDerechaExterior.wrapT = THREE.RepeatWrapping;
    texturaParedDerechaExterior.repeat.set(anchoEscaleras / 4, (altoPasillo + alturaElevacion) / 4);
    texturaParedDerechaExterior.needsUpdate = true;
    let materialParedDerechaExterior = new THREE.MeshStandardMaterial({map: texturaParedDerechaExterior});

    let texturaParedDerechaInterior = texturaParedesInterior.clone();
    texturaParedDerechaInterior.wrapS = THREE.RepeatWrapping;
    texturaParedDerechaInterior.wrapT = THREE.RepeatWrapping;
    texturaParedDerechaInterior.repeat.set(anchoEscaleras / 10, (altoPasillo + alturaElevacion) / 4);
    texturaParedDerechaInterior.needsUpdate = true;
    let materialParedDerechaInterior = new THREE.MeshStandardMaterial({map: texturaParedDerechaInterior});

    let texturaCantosHorizontalesDerecha = texturaExterior.clone();
    texturaCantosHorizontalesDerecha.wrapS = THREE.RepeatWrapping;
    texturaCantosHorizontalesDerecha.wrapT = THREE.RepeatWrapping;
    texturaCantosHorizontalesDerecha.repeat.set(grosorBox / 4, anchoEscaleras / 4);
    texturaCantosHorizontalesDerecha.needsUpdate = true;
    let materialCantosHorizontalesDerecha = new THREE.MeshStandardMaterial({map: texturaCantosHorizontalesDerecha});

    let texturaCantosVerticalesDerecha = texturaExterior.clone();
    texturaCantosVerticalesDerecha.wrapS = THREE.RepeatWrapping;
    texturaCantosVerticalesDerecha.wrapT = THREE.RepeatWrapping;
    texturaCantosVerticalesDerecha.repeat.set(grosorBox / 4, (altoPasillo + alturaElevacion) / 4);
    texturaCantosVerticalesDerecha.needsUpdate = true;
    let materialCantosVerticalesDerecha = new THREE.MeshStandardMaterial({map: texturaCantosVerticalesDerecha});

    let materialesParedDerecha = [
        materialParedDerechaExterior, // +X exterior
        materialParedDerechaInterior, // -X interior
        materialCantosHorizontalesDerecha, // +Y
        materialCantosHorizontalesDerecha, // -Y
        materialCantosVerticalesDerecha, // +Z
        materialCantosVerticalesDerecha // -Z
    ];

    let geometriaParedDerecha = new THREE.BoxGeometry(grosorBox, altoPasillo + alturaElevacion, anchoEscaleras);
    let paredDerecha = new THREE.Mesh(geometriaParedDerecha, materialesParedDerecha);

    paredDerecha.position.set(inicioX, (altoPasillo + alturaElevacion) / 2, centroZ);

    estructura.add(paredDerecha);
    obstaculosAlien.push(paredDerecha);


    // Techo
    let texturaTechoExterior = texturaExterior.clone();
    texturaTechoExterior.wrapS = THREE.RepeatWrapping;
    texturaTechoExterior.wrapT = THREE.RepeatWrapping;
    texturaTechoExterior.repeat.set(largoPasilloX / 4, anchoEscaleras / 4);
    texturaTechoExterior.needsUpdate = true;
    let materialTechoExterior = new THREE.MeshStandardMaterial({map: texturaTechoExterior});

    let texturaTechoInterior = texturaParedes.clone();
    texturaTechoInterior.wrapS = THREE.MirroredRepeatWrapping;
    texturaTechoInterior.wrapT = THREE.MirroredRepeatWrapping;
    texturaTechoInterior.repeat.set(largoPasilloX / 4, anchoEscaleras / 4);
    texturaTechoInterior.needsUpdate = true;
    let materialTechoInterior = new THREE.MeshStandardMaterial({map: texturaTechoInterior});

    let texturaTechoLateralX = texturaExterior.clone();
    texturaTechoLateralX.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralX.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralX.repeat.set(anchoEscaleras / 4, grosorBox / 4);
    texturaTechoLateralX.needsUpdate = true;
    let materialTechoLateralX = new THREE.MeshStandardMaterial({map: texturaTechoLateralX});

    let texturaTechoLateralZ = texturaExterior.clone();
    texturaTechoLateralZ.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralZ.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralZ.repeat.set(largoPasilloX / 4, grosorBox / 4);
    texturaTechoLateralZ.needsUpdate = true;
    let materialTechoLateralZ = new THREE.MeshStandardMaterial({map: texturaTechoLateralZ});

    let materialesTecho = [
        materialTechoLateralX, // +X
        materialTechoLateralX, // -X
        materialTechoExterior, // +Y
        materialTechoInterior, // -Y
        materialTechoLateralZ, // +Z
        materialTechoLateralZ // -Z
    ];

    let geometriaTecho = new THREE.BoxGeometry(largoPasilloX, grosorBox, anchoEscaleras);
    let techo = new THREE.Mesh(geometriaTecho, materialesTecho);

    techo.position.set((inicioX + finalX) / 2, altoPasillo + alturaElevacion + grosorBox / 2, centroZ);

    estructura.add(techo);

    
    // Lámparas de las escaleras
    let posicionesLamparasEscaleras = [(inicioX + inicioEscalera) / 2, (finalEscalera + finalX) / 2];

    for (let i = 0; i < posicionesLamparasEscaleras.length; i++) {
        let x = posicionesLamparasEscaleras[i];

        let soporteLampara = new THREE.Object3D();
        soporteLampara.position.set(x, altoPasillo + alturaElevacion, centroZ);

        scene.add(soporteLampara);
        soportesLamparasEscaleras.push(soporteLampara);

        let foco = new THREE.PointLight(0xffffff, 1, 20);
        foco.position.set(x, altoPasillo + alturaElevacion - 2.5, centroZ);
        scene.add(foco);

        if (i === 0) {
            foco.castShadow = true;
            foco.shadow.mapSize.set(512, 512);
            foco.shadow.camera.near = 0.5;
            foco.shadow.camera.far = 20;
            foco.shadow.bias = -0.001;
        }
    }

}


function crearSalaControl() {
    const anchoPuertaPasillo = anchoPuerta;
    const altoPuertaPasillo = altoPuerta;
    const finalPasillo = inicioZ;

    // Primer tramo suelo
    let texturaSueloInterior = texturaExterior.clone();
    texturaSueloInterior.wrapS = THREE.RepeatWrapping;
    texturaSueloInterior.wrapT = THREE.RepeatWrapping;
    texturaSueloInterior.repeat.set(largoTramo1 / 4, anchoEscaleras / 4);
    texturaSueloInterior.needsUpdate = true;

    let materialSueloInterior = new THREE.MeshPhongMaterial({color: 0x526575, specular: 0x888888, shininess: 40});

    let texturaSueloExterior = texturaExterior.clone();
    texturaSueloExterior.wrapS = THREE.RepeatWrapping;
    texturaSueloExterior.wrapT = THREE.RepeatWrapping;
    texturaSueloExterior.repeat.set(largoTramo1 / 4, anchoEscaleras / 4);
    texturaSueloExterior.needsUpdate = true;

    let materialSueloExterior = new THREE.MeshStandardMaterial({map: texturaSueloExterior});

    let texturaLateralX = texturaExterior.clone();
    texturaLateralX.wrapS = THREE.RepeatWrapping;
    texturaLateralX.wrapT = THREE.RepeatWrapping;
    texturaLateralX.repeat.set(anchoEscaleras / 4, grosorBox / 4);
    texturaLateralX.needsUpdate = true;

    let materialLateralX = new THREE.MeshStandardMaterial({map: texturaLateralX});

    let texturaLateralZ = texturaExterior.clone();
    texturaLateralZ.wrapS = THREE.RepeatWrapping;
    texturaLateralZ.wrapT = THREE.RepeatWrapping;
    texturaLateralZ.repeat.set(largoTramo1 / 4, grosorBox / 4);
    texturaLateralZ.needsUpdate = true;

    let materialLateralZ = new THREE.MeshStandardMaterial({
        map: texturaLateralZ
    });

    let materialesSuelo = [
        materialLateralX, // +X
        materialLateralX, // -X
        materialSueloInterior, // +Y
        materialSueloExterior, // -Y
        materialLateralZ, // +Z
        materialLateralZ // -Z
    ];

    let geometriaSuelo = new THREE.BoxGeometry(largoTramo1, grosorBox, anchoEscaleras);
    let suelo = new THREE.Mesh(geometriaSuelo, materialesSuelo);

    suelo.position.set((inicioSalaX + finalSalaX) / 2, alturaSalaControl - grosorBox / 2, centroZ);

    estructura.add(suelo);
    superficiesElevadas.push(suelo);

    // Segundo tramo suelo
    let inicioTramo2Z = inicioZ;
    let finalTramo2Z = inicioTramo2Z + largoTramo2;
    let centroTramo2X = finalSalaX + anchoSalaControl / 2;
    let centroTramo2Z = (inicioTramo2Z + finalTramo2Z) / 2;

    let texturaSueloExterior2 = texturaExterior.clone();
    texturaSueloExterior2.wrapS = THREE.RepeatWrapping;
    texturaSueloExterior2.wrapT = THREE.RepeatWrapping;
    texturaSueloExterior2.repeat.set(anchoSalaControl / 4, largoTramo2 / 4);
    texturaSueloExterior2.needsUpdate = true;
    let materialSueloExterior2 = new THREE.MeshStandardMaterial({map: texturaSueloExterior2});

    let texturaLateralX2 = texturaExterior.clone();
    texturaLateralX2.wrapS = THREE.RepeatWrapping;
    texturaLateralX2.wrapT = THREE.RepeatWrapping;
    texturaLateralX2.repeat.set(largoTramo2 / 4, grosorBox / 4);
    texturaLateralX2.needsUpdate = true;
    let materialLateralX2 = new THREE.MeshStandardMaterial({map: texturaLateralX2});

    let texturaLateralZ2 = texturaExterior.clone();
    texturaLateralZ2.wrapS = THREE.RepeatWrapping;
    texturaLateralZ2.wrapT = THREE.RepeatWrapping;
    texturaLateralZ2.repeat.set(anchoSalaControl / 4, grosorBox / 4);
    texturaLateralZ2.needsUpdate = true;
    let materialLateralZ2 = new THREE.MeshStandardMaterial({map: texturaLateralZ2});

    let materialesSuelo2 = [
        materialLateralX2, // +X
        materialLateralX2, // -X
        materialSueloInterior, // +Y
        materialSueloExterior2, // -Y
        materialLateralZ2, // +Z
        materialLateralZ2 // -Z
    ];

    let geometriaSuelo2 = new THREE.BoxGeometry(anchoSalaControl, grosorBox, largoTramo2);
    let suelo2 = new THREE.Mesh(geometriaSuelo2, materialesSuelo2);

    suelo2.position.set(centroTramo2X, alturaSalaControl - grosorBox / 2, centroTramo2Z);

    estructura.add(suelo2);
    superficiesElevadas.push(suelo2);

    
    // Paredes de la sala de control completas
    let limiteInteriorX = finalSalaX + anchoSalaControl;
    let largoParedInteriorSala = inicioSalaX - limiteInteriorX;
    let centroParedInteriorSala = (limiteInteriorX + inicioSalaX) / 2;
    let centroAlturaPared = alturaSalaControl + altoSalaControl / 2;

    function materialParedSala(texturaBase, ancho, alto, escalaHorizontal) { // Material con textura adapatada (prueba)
        let textura = texturaBase.clone();
        textura.wrapS = THREE.RepeatWrapping;
        textura.wrapT = THREE.RepeatWrapping;
        textura.repeat.set(ancho / escalaHorizontal, alto / 4);
        textura.needsUpdate = true;
        return new THREE.MeshStandardMaterial({map: textura});
    }

    function crearParedSalaX(longitud, x, z, interiorPositivoZ) { // Pared hacia X
        let interior = materialParedSala(texturaParedesInterior, longitud, altoSalaControl, 10);
        let exterior = materialParedSala(texturaExterior, longitud, altoSalaControl, 4);
        let cantoVertical = materialParedSala(texturaExterior, grosorBox, altoSalaControl, 4);
        let cantoHorizontal = materialParedSala(texturaExterior, longitud, grosorBox, 4);

        let materialCaraPositivaZ;
        let materialCaraNegativaZ;

        if (interiorPositivoZ) { // Interior en +Z
            materialCaraPositivaZ = interior;
            materialCaraNegativaZ = exterior;
        }
        else { // Interior en -Z
            materialCaraPositivaZ = exterior;
            materialCaraNegativaZ = interior;
        }

        let materiales = [
            cantoVertical, // +X
            cantoVertical, // -X
            cantoHorizontal, // +Y
            cantoHorizontal, // -Y
            materialCaraPositivaZ, // +Z
            materialCaraNegativaZ // -Z
        ];

        let geometria = new THREE.BoxGeometry(longitud, altoSalaControl, grosorBox);
        let pared = new THREE.Mesh(geometria, materiales);
        pared.position.set(x, centroAlturaPared, z);

        estructura.add(pared);
        obstaculosAlien.push(pared);
    }

    // Pared fondo izquierda
    let materialCaraPositivaX = materialParedSala(texturaParedesInterior, largoTramo2, altoSalaControl, 10);
    let materialCaraNegativaX = materialParedSala(texturaExterior, largoTramo2, altoSalaControl, 4);
    let cantoVertical = materialParedSala(texturaExterior, grosorBox, altoSalaControl, 4);
    let cantoHorizontal = materialParedSala(texturaExterior, grosorBox, largoTramo2, 4);

    let materiales = [
        materialCaraPositivaX, // +X
        materialCaraNegativaX, // -X
        cantoHorizontal, // +Y
        cantoHorizontal, // -Y
        cantoVertical, // +Z
        cantoVertical // -Z
    ];

    let geometria = new THREE.BoxGeometry(grosorBox, altoSalaControl, largoTramo2);
    let pared = new THREE.Mesh(geometria, materiales);
    pared.position.set(finalSalaX, centroAlturaPared, centroTramo2Z);

    estructura.add(pared);
    obstaculosAlien.push(pared);

    crearParedSalaX(largoTramo1, (inicioSalaX + finalSalaX) / 2, inicioZ - anchoEscaleras, true); // Pared sigue der
    crearParedSalaX(largoParedInteriorSala, centroParedInteriorSala, inicioZ, false); // Pared sigue izq

    // Pared con ventana fondo
    let posicionVentanaX = finalSalaX + anchoSalaControl - grosorBox / 2;
    let largoParedVentanaSala = largoTramo2 + grosorBox;
    let largoVentanaSala = largoTramo2 - 8;
    let altoVentanaSala = 4;
    let alturaInferiorVentanaSala = 2;
    let alturaSuperiorVentanaSala = altoSalaControl - alturaInferiorVentanaSala - altoVentanaSala;
    let centroVentanaZ = centroTramo2Z + 0.25 - grosorBox / 2;

    let materialInferiorInterior = materialParedSala(texturaParedesInterior, largoParedVentanaSala, alturaInferiorVentanaSala, 10);
    let materialInferiorExterior = materialParedSala(texturaExterior, largoParedVentanaSala, alturaInferiorVentanaSala, 4);
    let materialCantoInferior = materialParedSala(texturaExterior, grosorBox, alturaInferiorVentanaSala, 4);
    let materialCantoHorizontalInferior = materialParedSala(texturaExterior, grosorBox, largoParedVentanaSala, 4);
    let materialEsquinaInferior = materialParedSala(texturaParedesInterior, grosorBox, alturaInferiorVentanaSala, 10);

    let materialesInferior = [
        materialInferiorExterior, // +X exterior
        materialInferiorInterior, // -X interior
        materialCantoHorizontalInferior, // +Y
        materialCantoHorizontalInferior, // -Y
        materialCantoInferior, // +Z
        materialEsquinaInferior  // -Z
    ];

    let paredInferior = new THREE.Mesh(new THREE.BoxGeometry(grosorBox, alturaInferiorVentanaSala, largoParedVentanaSala), materialesInferior);
    paredInferior.position.set(posicionVentanaX, alturaSalaControl + alturaInferiorVentanaSala / 2, centroVentanaZ);

    estructura.add(paredInferior);
    obstaculosAlien.push(paredInferior);

    let materialSuperiorInterior = materialParedSala(texturaParedesInterior, largoParedVentanaSala, alturaSuperiorVentanaSala, 10);
    let materialSuperiorExterior = materialParedSala(texturaExterior, largoParedVentanaSala, alturaSuperiorVentanaSala, 4);
    let materialCantoSuperior = materialParedSala(texturaExterior, grosorBox, alturaSuperiorVentanaSala, 4);
    let materialCantoHorizontalSuperior = materialParedSala(texturaExterior, grosorBox, largoParedVentanaSala, 4);
    let materialEsquinaSuperior = materialParedSala(texturaParedesInterior, grosorBox, alturaSuperiorVentanaSala, 10);

    let materialesSuperior = [
        materialSuperiorExterior, // +X exterior
        materialSuperiorInterior, // -X interior
        materialCantoHorizontalSuperior, // +Y
        materialCantoHorizontalSuperior, // -Y
        materialCantoSuperior, // +Z
        materialEsquinaSuperior // -Z
    ];

    let paredSuperior = new THREE.Mesh(new THREE.BoxGeometry(grosorBox, alturaSuperiorVentanaSala, largoParedVentanaSala), materialesSuperior);
    paredSuperior.position.set(posicionVentanaX, alturaSalaControl + alturaInferiorVentanaSala + altoVentanaSala + alturaSuperiorVentanaSala / 2, centroVentanaZ);

    estructura.add(paredSuperior);
    obstaculosAlien.push(paredSuperior);

    
    // Revestimiento de la entrada a las escaleras
    let anchoRevestimientoLateral = (anchoPasillo - anchoPuertaPasillo) / 2;
    let posicionRevestimiento = finalPasillo + grosorBox / 2 + 0.01;

    let texturaRevestimientoSuperior = texturaParedesInterior.clone();
    texturaRevestimientoSuperior.wrapS = THREE.RepeatWrapping;
    texturaRevestimientoSuperior.wrapT = THREE.RepeatWrapping;
    texturaRevestimientoSuperior.repeat.set(anchoPuertaPasillo / 10, (altoPasillo - altoPuertaPasillo) / 4);
    texturaRevestimientoSuperior.needsUpdate = true;
    let materialRevestimientoSuperior = new THREE.MeshStandardMaterial({map: texturaRevestimientoSuperior, side: THREE.DoubleSide});

    let texturaRevestimientoLateral = texturaParedesInterior.clone();
    texturaRevestimientoLateral.wrapS = THREE.RepeatWrapping;
    texturaRevestimientoLateral.wrapT = THREE.RepeatWrapping;
    texturaRevestimientoLateral.repeat.set(anchoRevestimientoLateral / 10, altoPasillo / 4);
    texturaRevestimientoLateral.needsUpdate = true;
    let materialRevestimientoLateral = new THREE.MeshStandardMaterial({map: texturaRevestimientoLateral, side: THREE.DoubleSide});

    let geometriaRevestimientoSuperior = new THREE.PlaneGeometry(anchoPuertaPasillo, altoPasillo - altoPuertaPasillo);
    let revestimientoSuperior = new THREE.Mesh(geometriaRevestimientoSuperior, materialRevestimientoSuperior);
    revestimientoSuperior.position.set(0, altoPuertaPasillo + (altoPasillo - altoPuertaPasillo) / 2, posicionRevestimiento);
    estructura.add(revestimientoSuperior);

    let geometriaRevestimientoIzquierdo = new THREE.PlaneGeometry(anchoRevestimientoLateral, altoPasillo);
    let revestimientoIzquierdo = new THREE.Mesh(geometriaRevestimientoIzquierdo, materialRevestimientoLateral);
    revestimientoIzquierdo.position.set(-anchoPuertaPasillo / 2 - anchoRevestimientoLateral / 2, altoPasillo / 2, posicionRevestimiento + 0.01);
    estructura.add(revestimientoIzquierdo);

    let geometriaRevestimientoDerecho = new THREE.PlaneGeometry(anchoRevestimientoLateral, altoPasillo);
    let revestimientoDerecho = new THREE.Mesh(geometriaRevestimientoDerecho, materialRevestimientoLateral);
    revestimientoDerecho.position.set(anchoPuertaPasillo / 2 + anchoRevestimientoLateral / 2, altoPasillo / 2, posicionRevestimiento + 0.01);
    estructura.add(revestimientoDerecho);


    // Pilares
    let materialPilarVentana = new THREE.MeshPhongMaterial({color: 0x526575, specular: 0x888888, shininess: 60});
    let largoPilarVentana = (largoParedVentanaSala - largoVentanaSala) / 2;
    let inicioParedVentanaZ = centroVentanaZ - largoParedVentanaSala / 2;
    let finalParedVentanaZ = centroVentanaZ + largoParedVentanaSala / 2;

    for (let i = 0; i < 2; i++) {
        let z;

        if (i === 0) {
            z = inicioParedVentanaZ + largoPilarVentana / 2;
        }
        else {
            z = finalParedVentanaZ - largoPilarVentana / 2;
        }

        let pilarVentana = new THREE.Mesh(
            new THREE.BoxGeometry(grosorBox, altoVentanaSala, largoPilarVentana),
            materialPilarVentana
        );

        pilarVentana.position.set(posicionVentanaX, alturaSalaControl + alturaInferiorVentanaSala + altoVentanaSala / 2, z);

        estructura.add(pilarVentana);
        obstaculosAlien.push(pilarVentana);
    }


    // Cristal
    let materialCristalSala = new THREE.MeshPhongMaterial({color: 0x8bd8ed, transparent: true, opacity: 0.18, shininess: 100, side: THREE.DoubleSide, depthWrite: false});
    let cristalSala = new THREE.Mesh(new THREE.BoxGeometry(0.05, altoVentanaSala - 0.1, largoVentanaSala - 0.1), materialCristalSala);
    cristalSala.position.set(posicionVentanaX, alturaSalaControl + alturaInferiorVentanaSala + altoVentanaSala / 2, centroVentanaZ);

    estructura.add(cristalSala);
    obstaculosAlien.push(cristalSala);


    // Pared con ventana del primer tramo
    let posicionVentana2X = finalSalaX;
    let largoVentanaSala2 = anchoEscaleras - 4;
    let altoVentanaSala2 = 4;
    let alturaInferiorVentanaSala2 = 2;
    let alturaSuperiorVentanaSala2 = altoSalaControl - alturaInferiorVentanaSala2 - altoVentanaSala2;
    let centroVentana2Z = centroZ;

    let materialInferiorInterior2 = materialParedSala(texturaParedesInterior, anchoEscaleras, alturaInferiorVentanaSala2, 10);
    let materialInferiorExterior2 = materialParedSala(texturaExterior, anchoEscaleras, alturaInferiorVentanaSala2, 4);
    let materialCantoInferior2 = materialParedSala(texturaExterior, grosorBox, alturaInferiorVentanaSala2, 4);
    let materialCantoHorizontalInferior2 = materialParedSala(texturaExterior, grosorBox, anchoEscaleras, 4);

    let materialesInferior2 = [
        materialInferiorInterior2, // +X interior
        materialInferiorExterior2, // -X exterior
        materialCantoHorizontalInferior2, // +Y
        materialCantoHorizontalInferior2, // -Y
        materialCantoInferior2, // +Z
        materialCantoInferior2 // -Z
    ];

    let paredInferior2 = new THREE.Mesh(new THREE.BoxGeometry(grosorBox, alturaInferiorVentanaSala2, anchoEscaleras), materialesInferior2);
    paredInferior2.position.set(posicionVentana2X, alturaSalaControl + alturaInferiorVentanaSala2 / 2, centroVentana2Z);

    estructura.add(paredInferior2);
    obstaculosAlien.push(paredInferior2);

    let materialSuperiorInterior2 = materialParedSala(texturaParedesInterior, anchoEscaleras, alturaSuperiorVentanaSala2, 10);
    let materialSuperiorExterior2 = materialParedSala(texturaExterior, anchoEscaleras, alturaSuperiorVentanaSala2, 4);
    let materialCantoSuperior2 = materialParedSala(texturaExterior, grosorBox, alturaSuperiorVentanaSala2, 4);
    let materialCantoHorizontalSuperior2 = materialParedSala(texturaExterior, grosorBox, anchoEscaleras, 4);

    let materialesSuperior2 = [
        materialSuperiorInterior2, // +X interior
        materialSuperiorExterior2, // -X exterior
        materialCantoHorizontalSuperior2, // +Y
        materialCantoHorizontalSuperior2, // -Y
        materialCantoSuperior2, // +Z
        materialCantoSuperior2 // -Z
    ];

    let paredSuperior2 = new THREE.Mesh(new THREE.BoxGeometry(grosorBox, alturaSuperiorVentanaSala2, anchoEscaleras), materialesSuperior2);
    paredSuperior2.position.set(posicionVentana2X, alturaSalaControl + alturaInferiorVentanaSala2 + altoVentanaSala2 + alturaSuperiorVentanaSala2 / 2, centroVentana2Z);

    estructura.add(paredSuperior2);
    obstaculosAlien.push(paredSuperior2);

    let largoPilarVentana2 = (anchoEscaleras - largoVentanaSala2) / 2;
    for (let i = 0; i < 2; i++) {
        let z;

        if (i === 0) {
            z = inicioZ - largoPilarVentana2 / 2;
        }
        else {
            z = inicioZ - anchoEscaleras + largoPilarVentana2 / 2;
        }

        let pilarVentana2 = new THREE.Mesh(
            new THREE.BoxGeometry(grosorBox, altoVentanaSala2, largoPilarVentana2),
            materialPilarVentana
        );

        pilarVentana2.position.set(
            posicionVentana2X,
            alturaSalaControl + alturaInferiorVentanaSala2 + altoVentanaSala2 / 2,
            z
        );

        estructura.add(pilarVentana2);
        obstaculosAlien.push(pilarVentana2);
    }

    // Cristal
    let cristalSala2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, altoVentanaSala2 - 0.1, largoVentanaSala2 - 0.1), materialCristalSala);
    cristalSala2.position.set(posicionVentana2X, alturaSalaControl + alturaInferiorVentanaSala2 + altoVentanaSala2 / 2, centroVentana2Z);

    estructura.add(cristalSala2);
    obstaculosAlien.push(cristalSala2);

    
    // Pared de salida hacia el hangar
    let anchoLateralSalida = (anchoSalaControl - anchoPuerta) / 2;
    let altoSuperiorSalida = altoSalaControl - altoPuerta;
    let posicionSalidaZ = finalTramo2Z;

    for (let i = 0; i < 2; i++) {
        let x;

        if (i === 0) {
            x = finalSalaX + anchoLateralSalida / 2;
        }
        else {
            x = finalSalaX + anchoSalaControl - anchoLateralSalida / 2;
        }

        let interior = materialParedSala(texturaParedesInterior, anchoLateralSalida, altoSalaControl, 10);
        let exterior = materialParedSala(texturaExterior, anchoLateralSalida, altoSalaControl, 4);
        let cantoVertical = materialParedSala(texturaExterior, grosorBox, altoSalaControl, 4);
        let cantoHorizontal = materialParedSala(texturaExterior, anchoLateralSalida, grosorBox, 4);

        let materialesSalidaLateral = [
            cantoVertical, // +X
            cantoVertical, // -X
            cantoHorizontal, // +Y
            cantoHorizontal, // -Y
            exterior, // +Z hacia el hangar
            interior // -Z hacia la sala de control
        ];

        let geometria = new THREE.BoxGeometry(anchoLateralSalida, altoSalaControl, grosorBox);
        let pared = new THREE.Mesh(geometria, materialesSalidaLateral);
        pared.position.set(x, alturaSalaControl + altoSalaControl / 2, posicionSalidaZ);

        estructura.add(pared);
        obstaculosAlien.push(pared);
    }

    let interiorSuperior = materialParedSala(texturaParedesInterior, anchoPuerta, altoSuperiorSalida, 10);
    let exteriorSuperior = materialParedSala(texturaExterior, anchoPuerta, altoSuperiorSalida, 4);
    let cantoVerticalSuperior = materialParedSala(texturaExterior, grosorBox, altoSuperiorSalida, 4);
    let cantoHorizontalSuperior = materialParedSala(texturaExterior, anchoPuerta, grosorBox, 4);

    let materialesSalidaSuperior = [
        cantoVerticalSuperior, // +X
        cantoVerticalSuperior, // -X
        cantoHorizontalSuperior, // +Y
        cantoHorizontalSuperior, // -Y
        exteriorSuperior, // +Z hacia el hangar
        interiorSuperior // -Z hacia la sala de control
    ];

    let geometriaSuperiorSalida = new THREE.BoxGeometry(anchoPuerta, altoSuperiorSalida, grosorBox);
    let paredSuperiorSalida = new THREE.Mesh(geometriaSuperiorSalida, materialesSalidaSuperior);

    paredSuperiorSalida.position.set(finalSalaX + anchoSalaControl / 2, alturaSalaControl + altoPuerta + altoSuperiorSalida / 2, posicionSalidaZ);

    estructura.add(paredSuperiorSalida);
    obstaculosAlien.push(paredSuperiorSalida);

    // Lámparas sala de control
    let posicionesLamparasSalaControl = [[-71.5, -52.5], [-96, -49], [-92, -73], [-62, -81.5]];

    for (let i = 0; i < posicionesLamparasSalaControl.length; i++) {
        let x = posicionesLamparasSalaControl[i][0];
        let z = posicionesLamparasSalaControl[i][1];
        let soporteLampara = new THREE.Object3D();
        soporteLampara.position.set(x, alturaSalaControl + altoSalaControl, z);

        scene.add(soporteLampara);
        soportesLamparasSalaControl.push(soporteLampara);

        let foco = new THREE.PointLight(0xffffff, 1, 20);
        foco.position.set(x, alturaSalaControl + altoSalaControl - 2.5, z);

        scene.add(foco);

        if (i === 0) {
            foco.castShadow = true;
            foco.shadow.mapSize.set(512, 512);
            foco.shadow.camera.near = 0.5;
            foco.shadow.camera.far = 20;
            foco.shadow.bias = -0.001;
        }
    }


    // Techo de la sala de control
    let alturaTechoSala = alturaSalaControl + altoSalaControl;

    let texturaTechoInterior = texturaParedes.clone();
    texturaTechoInterior.wrapS = THREE.MirroredRepeatWrapping;
    texturaTechoInterior.wrapT = THREE.MirroredRepeatWrapping;
    texturaTechoInterior.repeat.set(largoTramo1 / 4, anchoEscaleras / 4);
    texturaTechoInterior.needsUpdate = true;
    let materialTechoInterior = new THREE.MeshStandardMaterial({map: texturaTechoInterior});

    let texturaTechoExterior = texturaExterior.clone();
    texturaTechoExterior.wrapS = THREE.RepeatWrapping;
    texturaTechoExterior.wrapT = THREE.RepeatWrapping;
    texturaTechoExterior.repeat.set(largoTramo1 / 4, anchoEscaleras / 4);
    texturaTechoExterior.needsUpdate = true;
    let materialTechoExterior = new THREE.MeshStandardMaterial({map: texturaTechoExterior});

    let texturaTechoLateralX = texturaExterior.clone();
    texturaTechoLateralX.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralX.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralX.repeat.set(anchoEscaleras / 4, grosorBox / 4);
    texturaTechoLateralX.needsUpdate = true;
    let materialTechoLateralX = new THREE.MeshStandardMaterial({map: texturaTechoLateralX});

    let texturaTechoLateralZ = texturaExterior.clone();
    texturaTechoLateralZ.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralZ.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralZ.repeat.set(largoTramo1 / 4, grosorBox / 4);
    texturaTechoLateralZ.needsUpdate = true;
    let materialTechoLateralZ = new THREE.MeshStandardMaterial({map: texturaTechoLateralZ});

    let materialesTecho1 = [
        materialTechoLateralX, // +X
        materialTechoLateralX, // -X
        materialTechoExterior, // +Y
        materialTechoInterior, // -Y
        materialTechoLateralZ, // +Z
        materialTechoLateralZ // -Z
    ];

    let techo1 = new THREE.Mesh(new THREE.BoxGeometry(largoTramo1, grosorBox, anchoEscaleras), materialesTecho1);
    techo1.position.set((inicioSalaX + finalSalaX) / 2, alturaTechoSala + grosorBox / 2, centroZ);

    estructura.add(techo1);
    obstaculosAlien.push(techo1);

    let texturaTechoInterior2 = texturaParedes.clone();
    texturaTechoInterior2.wrapS = THREE.MirroredRepeatWrapping;
    texturaTechoInterior2.wrapT = THREE.MirroredRepeatWrapping;
    texturaTechoInterior2.repeat.set(anchoSalaControl / 4, largoTramo2 / 4);
    texturaTechoInterior2.needsUpdate = true;
    let materialTechoInterior2 = new THREE.MeshStandardMaterial({map: texturaTechoInterior2});

    let texturaTechoExterior2 = texturaExterior.clone();
    texturaTechoExterior2.wrapS = THREE.RepeatWrapping;
    texturaTechoExterior2.wrapT = THREE.RepeatWrapping;
    texturaTechoExterior2.repeat.set(anchoSalaControl / 4, largoTramo2 / 4);
    texturaTechoExterior2.needsUpdate = true;
    let materialTechoExterior2 = new THREE.MeshStandardMaterial({map: texturaTechoExterior2});

    let texturaTechoLateralX2 = texturaExterior.clone();
    texturaTechoLateralX2.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralX2.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralX2.repeat.set(largoTramo2 / 4, grosorBox / 4);
    texturaTechoLateralX2.needsUpdate = true;
    let materialTechoLateralX2 = new THREE.MeshStandardMaterial({map: texturaTechoLateralX2});

    let texturaTechoLateralZ2 = texturaExterior.clone();
    texturaTechoLateralZ2.wrapS = THREE.RepeatWrapping;
    texturaTechoLateralZ2.wrapT = THREE.RepeatWrapping;
    texturaTechoLateralZ2.repeat.set(anchoSalaControl / 4, grosorBox / 4);
    texturaTechoLateralZ2.needsUpdate = true;
    let materialTechoLateralZ2 = new THREE.MeshStandardMaterial({map: texturaTechoLateralZ2});

    let materialesTecho2 = [
        materialTechoLateralX2, // +X
        materialTechoLateralX2, // -X
        materialTechoExterior2, // +Y
        materialTechoInterior2, // -Y
        materialTechoLateralZ2, // +Z
        materialTechoLateralZ2 // -Z
    ];

    let techo2 = new THREE.Mesh(new THREE.BoxGeometry(anchoSalaControl, grosorBox, largoTramo2), materialesTecho2);
    techo2.position.set(centroTramo2X, alturaTechoSala + grosorBox / 2, centroTramo2Z);

    estructura.add(techo2);
    obstaculosAlien.push(techo2);
    
    // Puerta
    let materialPuertaHangar = new THREE.MeshPhongMaterial({color: 0x8c8c8c, specular: 0x444444, shininess: 50, side: THREE.DoubleSide});
    let geometriaPuertaHangar = new THREE.BoxGeometry(anchoPartePuerta, altoPuerta, grosorBox);
    puertaHangarIzquierda = new THREE.Mesh(geometriaPuertaHangar, materialPuertaHangar);
    puertaHangarDerecha = new THREE.Mesh(geometriaPuertaHangar, materialPuertaHangar);

    let centroSalidaX = finalSalaX + anchoSalaControl / 2;
    puertaHangarIzquierda.position.set(centroSalidaX - posicionInicialPuerta, alturaSalaControl + altoPuerta / 2, posicionSalidaZ + grosorBox);
    puertaHangarDerecha.position.set(centroSalidaX + posicionInicialPuerta, alturaSalaControl + altoPuerta / 2, posicionSalidaZ + grosorBox);

    estructura.add(puertaHangarIzquierda);
    estructura.add(puertaHangarDerecha);

    obstaculosAlien.push(puertaHangarIzquierda);
    obstaculosAlien.push(puertaHangarDerecha);


    // Cajas metálicas de la sala de control
    let texturaCajas = texturaParedes.clone();
    texturaCajas.wrapS = THREE.RepeatWrapping;
    texturaCajas.wrapT = THREE.RepeatWrapping;
    texturaCajas.repeat.set(1, 1);
    texturaCajas.needsUpdate = true;
    let materialCajas = new THREE.MeshStandardMaterial({map: texturaCajas, color: 0xff8164, metalness: 0.3, roughness: 0.7, emissive: 0x303840, emissiveIntensity: 0.4});

    
    let datosCajas = [
        // x, z, ancho x, largo z, altura
        [-98, -53, 26, 5, 8], // Superior horizontal
        [-75, -64, 6, 12, 8], // Superior vertical
        [-75, -73, 20, 4, 8], // Central izquierda del dibujo
        [-104, -73, 14, 4, 8], // Central derecha del dibujo
        [-94, -83, 10, 5, 8] // Inferior
    ];

    for (let i = 0; i < datosCajas.length; i++) {
        let datos = datosCajas[i];
        let geometriaCaja = new THREE.BoxGeometry(datos[2], datos[4], datos[3]);
        let caja = new THREE.Mesh(geometriaCaja, materialCajas);
        caja.castShadow = true;
        caja.receiveShadow = true;

        caja.position.set(datos[0], alturaSalaControl + datos[4] / 2, datos[1]);

        estructura.add(caja);
        obstaculosAlien.push(caja);
    }

}


function crearHangar() {
    let hangar = new THREE.Object3D();
    
    // Revestimiento de la pared de entrada al hangar
    let anchoLateralEntrada = (anchoHangar - anchoPuerta) / 2;
    let altoSuperiorEntrada = altoSalaControl - altoPuerta;
    let posicionRevestimientoZ = inicioHangarZ + grosorBox / 2 + 0.01;

    // Laterales
    let texturaRevestimientoLateral = texturaParedesInterior.clone();
    texturaRevestimientoLateral.wrapS = THREE.RepeatWrapping;
    texturaRevestimientoLateral.wrapT = THREE.RepeatWrapping;
    texturaRevestimientoLateral.repeat.set(anchoLateralEntrada / 10, altoSalaControl / 4);
    texturaRevestimientoLateral.needsUpdate = true;
    let materialRevestimientoLateral = new THREE.MeshStandardMaterial({map: texturaRevestimientoLateral});

    for (let i = 0; i < 2; i++) { 
        let x;

        if (i === 0) {
            x = centroHangarX - anchoPuerta / 2 - anchoLateralEntrada / 2;
        }
        else {
            x = centroHangarX + anchoPuerta / 2 + anchoLateralEntrada / 2;
        }

        let geometriaRevestimientoLateral = new THREE.PlaneGeometry(anchoLateralEntrada, altoSalaControl)
        let revestimientoLateral = new THREE.Mesh(geometriaRevestimientoLateral, materialRevestimientoLateral);
        revestimientoLateral.position.set(x, alturaHangar + altoSalaControl / 2, posicionRevestimientoZ);

        hangar.add(revestimientoLateral);
    }

    // Textura del bloque superior
    let texturaRevestimientoSuperior = texturaParedesInterior.clone();
    texturaRevestimientoSuperior.wrapS = THREE.RepeatWrapping;
    texturaRevestimientoSuperior.wrapT = THREE.RepeatWrapping;
    texturaRevestimientoSuperior.repeat.set(anchoPuerta / 10, altoSuperiorEntrada / 4);
    texturaRevestimientoSuperior.needsUpdate = true;
    let materialRevestimientoSuperior = new THREE.MeshStandardMaterial({map: texturaRevestimientoSuperior});

    let geometriaRevestimientoSuperior = new THREE.PlaneGeometry(anchoPuerta, altoSuperiorEntrada)
    let revestimientoSuperior = new THREE.Mesh(geometriaRevestimientoSuperior, materialRevestimientoSuperior);
    revestimientoSuperior.position.set(centroHangarX, alturaHangar + altoPuerta + altoSuperiorEntrada / 2, posicionRevestimientoZ);

    hangar.add(revestimientoSuperior);


    // Suelo
    let materialSueloInterior = new THREE.MeshPhongMaterial({color: 0x526575, specular: 0x888888, shininess: 40});

    let texturaSueloExterior = texturaExterior.clone();
    texturaSueloExterior.wrapS = THREE.RepeatWrapping;
    texturaSueloExterior.wrapT = THREE.RepeatWrapping;
    texturaSueloExterior.repeat.set(anchoHangar / 4, largoHangar / 4);
    texturaSueloExterior.needsUpdate = true;
    let materialSueloExterior = new THREE.MeshStandardMaterial({map: texturaSueloExterior});

    let texturaLateralX = texturaExterior.clone();
    texturaLateralX.wrapS = THREE.RepeatWrapping;
    texturaLateralX.wrapT = THREE.RepeatWrapping;
    texturaLateralX.repeat.set(largoHangar / 4, grosorBox / 4);
    texturaLateralX.needsUpdate = true;
    let materialLateralX = new THREE.MeshStandardMaterial({map: texturaLateralX});

    let texturaLateralZ = texturaExterior.clone();
    texturaLateralZ.wrapS = THREE.RepeatWrapping;
    texturaLateralZ.wrapT = THREE.RepeatWrapping;
    texturaLateralZ.repeat.set(anchoHangar / 4, grosorBox / 4);
    texturaLateralZ.needsUpdate = true;
    let materialLateralZ = new THREE.MeshStandardMaterial({map: texturaLateralZ});

    let materialesSuelo = [
        materialLateralX, // +X
        materialLateralX, // -X
        materialSueloInterior, // +Y
        materialSueloExterior, // -Y
        materialLateralZ, // +Z
        materialLateralZ // -Z
    ];

    let geometriaSuelo = new THREE.BoxGeometry(anchoHangar, grosorBox, largoHangar);
    let suelo = new THREE.Mesh(geometriaSuelo, materialesSuelo);
    suelo.position.set(centroHangarX, alturaHangar - grosorBox / 2, centroHangarZ);

    hangar.add(suelo);
    superficiesElevadas.push(suelo);


    // Paredes laterales
    let texturaLateralInterior = texturaParedesInterior.clone();
    texturaLateralInterior.wrapS = THREE.RepeatWrapping;
    texturaLateralInterior.wrapT = THREE.RepeatWrapping;
    texturaLateralInterior.repeat.set(largoHangar / 10, altoHangar / 4);
    texturaLateralInterior.needsUpdate = true;
    let materialLateralInterior = new THREE.MeshStandardMaterial({map: texturaLateralInterior});

    let texturaLateralExterior = texturaExterior.clone();
    texturaLateralExterior.wrapS = THREE.RepeatWrapping;
    texturaLateralExterior.wrapT = THREE.RepeatWrapping;
    texturaLateralExterior.repeat.set(largoHangar / 4, altoHangar / 4);
    texturaLateralExterior.needsUpdate = true;
    let materialLateralExterior = new THREE.MeshStandardMaterial({map: texturaLateralExterior});

    let texturaCantoHorizontal = texturaExterior.clone();
    texturaCantoHorizontal.wrapS = THREE.RepeatWrapping;
    texturaCantoHorizontal.wrapT = THREE.RepeatWrapping;
    texturaCantoHorizontal.repeat.set(grosorBox / 4, largoHangar / 4);
    texturaCantoHorizontal.needsUpdate = true;
    let materialCantoHorizontal = new THREE.MeshStandardMaterial({map: texturaCantoHorizontal});

    let texturaCantoVertical = texturaExterior.clone();
    texturaCantoVertical.wrapS = THREE.RepeatWrapping;
    texturaCantoVertical.wrapT = THREE.RepeatWrapping;
    texturaCantoVertical.repeat.set(grosorBox / 4, altoHangar / 4);
    texturaCantoVertical.needsUpdate = true;
    let materialCantoVertical = new THREE.MeshStandardMaterial({map: texturaCantoVertical});

    for (let i = 0; i < 2; i++) {
        let x;
        let materialCaraPositivaX;
        let materialCaraNegativaX;

        if (i === 0) {
            // Pared izquierda interior hacia +X
            x = centroHangarX - anchoHangar / 2;
            materialCaraPositivaX = materialLateralInterior;
            materialCaraNegativaX = materialLateralExterior;
        }
        else {
            // Pared derecha interior hacia -X
            x = centroHangarX + anchoHangar / 2;
            materialCaraPositivaX = materialLateralExterior;
            materialCaraNegativaX = materialLateralInterior;
        }

        let materialesParedLateral = [
            materialCaraPositivaX, // +X
            materialCaraNegativaX, // -X
            materialCantoHorizontal, // +Y
            materialCantoHorizontal, // -Y
            materialCantoVertical, // +Z
            materialCantoVertical // -Z
        ];

        let geometriaPared = new THREE.BoxGeometry(grosorBox, altoHangar, largoHangar);
        let pared = new THREE.Mesh(geometriaPared, materialesParedLateral);
        pared.position.set(x, alturaHangar + altoHangar / 2, centroHangarZ);

        hangar.add(pared);
        obstaculosAlien.push(pared);
    }


    // Pared del fondo
    let texturaFondoInterior = texturaParedesInterior.clone();
    texturaFondoInterior.wrapS = THREE.RepeatWrapping;
    texturaFondoInterior.wrapT = THREE.RepeatWrapping;
    texturaFondoInterior.repeat.set(anchoHangar / 10, altoHangar / 4);
    texturaFondoInterior.needsUpdate = true;
    let materialFondoInterior = new THREE.MeshStandardMaterial({map: texturaFondoInterior});

    let texturaFondoExterior = texturaExterior.clone();
    texturaFondoExterior.wrapS = THREE.RepeatWrapping;
    texturaFondoExterior.wrapT = THREE.RepeatWrapping;
    texturaFondoExterior.repeat.set(anchoHangar / 4, altoHangar / 4);
    texturaFondoExterior.needsUpdate = true;
    let materialFondoExterior = new THREE.MeshStandardMaterial({map: texturaFondoExterior});

    let texturaCantoHorizontalFondo = texturaExterior.clone();
    texturaCantoHorizontalFondo.wrapS = THREE.RepeatWrapping;
    texturaCantoHorizontalFondo.wrapT = THREE.RepeatWrapping;
    texturaCantoHorizontalFondo.repeat.set(anchoHangar / 4, grosorBox / 4);
    texturaCantoHorizontalFondo.needsUpdate = true;
    let materialCantoHorizontalFondo = new THREE.MeshStandardMaterial({map: texturaCantoHorizontalFondo});

    let texturaCantoVerticalFondo = texturaExterior.clone();
    texturaCantoVerticalFondo.wrapS = THREE.RepeatWrapping;
    texturaCantoVerticalFondo.wrapT = THREE.RepeatWrapping;
    texturaCantoVerticalFondo.repeat.set(grosorBox / 4, altoHangar / 4);
    texturaCantoVerticalFondo.needsUpdate = true;
    let materialCantoVerticalFondo = new THREE.MeshStandardMaterial({map: texturaCantoVerticalFondo});

    let materialesParedFondo = [
        materialCantoVerticalFondo, // +X
        materialCantoVerticalFondo, // -X
        materialCantoHorizontalFondo, // +Y
        materialCantoHorizontalFondo, // -Y
        materialFondoExterior, // +Z
        materialFondoInterior // -Z
    ];

    let geometriaParedFondo = new THREE.BoxGeometry(anchoHangar, altoHangar, grosorBox);
    let paredFondo = new THREE.Mesh(geometriaParedFondo, materialesParedFondo);
    paredFondo.position.set(centroHangarX, alturaHangar + altoHangar / 2, inicioHangarZ + largoHangar);

    hangar.add(paredFondo);
    obstaculosAlien.push(paredFondo);
    

    // Techo del hangar con apertura central
    let anchoApertura = 12;
    let largoApertura = 14;
    let alturaTecho = alturaHangar + altoHangar;

    let anchoLateral = (anchoHangar - anchoApertura) / 2;
    let largoExtremo = (largoHangar - largoApertura) / 2;

    let texturaInteriorLateral = texturaParedes.clone();
    texturaInteriorLateral.wrapS = THREE.MirroredRepeatWrapping;
    texturaInteriorLateral.wrapT = THREE.MirroredRepeatWrapping;
    texturaInteriorLateral.repeat.set(anchoLateral / 4, largoHangar / 4);
    texturaInteriorLateral.needsUpdate = true;
    let materialInteriorLateral = new THREE.MeshStandardMaterial({map: texturaInteriorLateral});

    let texturaExteriorLateral = texturaExterior.clone();
    texturaExteriorLateral.wrapS = THREE.RepeatWrapping;
    texturaExteriorLateral.wrapT = THREE.RepeatWrapping;
    texturaExteriorLateral.repeat.set(anchoLateral / 4, largoHangar / 4);
    texturaExteriorLateral.needsUpdate = true;
    let materialExteriorLateral = new THREE.MeshStandardMaterial({map: texturaExteriorLateral});

    let texturaCantoXLateral = texturaExterior.clone();
    texturaCantoXLateral.wrapS = THREE.RepeatWrapping;
    texturaCantoXLateral.wrapT = THREE.RepeatWrapping;
    texturaCantoXLateral.repeat.set(largoHangar / 4, grosorBox / 4);
    texturaCantoXLateral.needsUpdate = true;
    let materialCantoXLateral = new THREE.MeshStandardMaterial({map: texturaCantoXLateral});

    let texturaCantoZLateral = texturaExterior.clone();
    texturaCantoZLateral.wrapS = THREE.RepeatWrapping;
    texturaCantoZLateral.wrapT = THREE.RepeatWrapping;
    texturaCantoZLateral.repeat.set(anchoLateral / 4, grosorBox / 4);
    texturaCantoZLateral.needsUpdate = true;
    let materialCantoZLateral = new THREE.MeshStandardMaterial({map: texturaCantoZLateral});

    let materialesTechoLateral = [
        materialCantoXLateral, // +X
        materialCantoXLateral, // -X
        materialExteriorLateral, // +Y
        materialInteriorLateral, // -Y
        materialCantoZLateral, // +Z
        materialCantoZLateral // -Z
    ];

    for (let i = 0; i < 2; i++) {
        let x;

        if (i === 0) {
            x = centroHangarX - anchoApertura / 2 - anchoLateral / 2;
        }
        else {
            x = centroHangarX + anchoApertura / 2 + anchoLateral / 2;
        }

        let geometriaTechoLateral = new THREE.BoxGeometry(anchoLateral, grosorBox, largoHangar);
        let texturaAlineadaLateral = texturaInteriorLateral.clone();

        if (i === 0) {
            texturaAlineadaLateral.offset.set(0, 0);
        }
        else {
            texturaAlineadaLateral.offset.set((anchoLateral + anchoApertura) / 4, 0);
        }
        texturaAlineadaLateral.needsUpdate = true;

        let materialesLateral = materialesTechoLateral.slice();
        materialesLateral[3] = new THREE.MeshStandardMaterial({map: texturaAlineadaLateral});
        let techoLateral = new THREE.Mesh(geometriaTechoLateral, materialesLateral);

        techoLateral.position.set(x, alturaTecho + grosorBox / 2, centroHangarZ);
        hangar.add(techoLateral);
    }

    let texturaInteriorExtremo = texturaParedes.clone();
    texturaInteriorExtremo.wrapS = THREE.MirroredRepeatWrapping;
    texturaInteriorExtremo.wrapT = THREE.MirroredRepeatWrapping;
    texturaInteriorExtremo.repeat.set(anchoApertura / 4, largoExtremo / 4);
    texturaInteriorExtremo.needsUpdate = true;
    let materialInteriorExtremo = new THREE.MeshStandardMaterial({map: texturaInteriorExtremo});

    let texturaExteriorExtremo = texturaExterior.clone();
    texturaExteriorExtremo.wrapS = THREE.RepeatWrapping;
    texturaExteriorExtremo.wrapT = THREE.RepeatWrapping;
    texturaExteriorExtremo.repeat.set(anchoApertura / 4, largoExtremo / 4);
    texturaExteriorExtremo.needsUpdate = true;
    let materialExteriorExtremo = new THREE.MeshStandardMaterial({map: texturaExteriorExtremo});

    let texturaCantoXExtremo = texturaExterior.clone();
    texturaCantoXExtremo.wrapS = THREE.RepeatWrapping;
    texturaCantoXExtremo.wrapT = THREE.RepeatWrapping;
    texturaCantoXExtremo.repeat.set(largoExtremo / 4, grosorBox / 4);
    texturaCantoXExtremo.needsUpdate = true;
    let materialCantoXExtremo = new THREE.MeshStandardMaterial({map: texturaCantoXExtremo});

    let texturaCantoZExtremo = texturaExterior.clone();
    texturaCantoZExtremo.wrapS = THREE.RepeatWrapping;
    texturaCantoZExtremo.wrapT = THREE.RepeatWrapping;
    texturaCantoZExtremo.repeat.set(anchoApertura / 4, grosorBox / 4);
    texturaCantoZExtremo.needsUpdate = true;
    let materialCantoZExtremo = new THREE.MeshStandardMaterial({map: texturaCantoZExtremo});

    let materialesTechoExtremo = [
        materialCantoXExtremo, // +X
        materialCantoXExtremo, // -X
        materialExteriorExtremo, // +Y
        materialInteriorExtremo, // -Y
        materialCantoZExtremo, // +Z
        materialCantoZExtremo // -Z
    ];

    for (let i = 0; i < 2; i++) {
        let z;

        if (i === 0) {
            z = centroHangarZ - largoApertura / 2 - largoExtremo / 2;
        }
        else {
            z = centroHangarZ + largoApertura / 2 + largoExtremo / 2;
        }

        let geometriaTechoExtremo = new THREE.BoxGeometry(anchoApertura, grosorBox, largoExtremo);
        let texturaAlineadaExtremo = texturaInteriorExtremo.clone();

        if (i === 0) {
            texturaAlineadaExtremo.offset.set(anchoLateral / 4, 0);
        }
        else {
            texturaAlineadaExtremo.offset.set(anchoLateral / 4, (largoExtremo + largoApertura) / 4);
        }
        texturaAlineadaExtremo.needsUpdate = true;
        
        let materialesExtremo = materialesTechoExtremo.slice();
        materialesExtremo[3] = new THREE.MeshStandardMaterial({map: texturaAlineadaExtremo});
        let techoExtremo = new THREE.Mesh(geometriaTechoExtremo, materialesExtremo);

        techoExtremo.position.set(centroHangarX, alturaTecho + grosorBox / 2, z);
        hangar.add(techoExtremo);
    }

    // Lámparas
    let posicionesLamparasHangar = [
        [centroHangarX, centroHangarZ - 10],
        [centroHangarX, centroHangarZ + 10],
        [centroHangarX - 11, centroHangarZ],
        [centroHangarX + 11, centroHangarZ]
    ];

    for (let i = 0; i < posicionesLamparasHangar.length; i++) {
        let x = posicionesLamparasHangar[i][0];
        let z = posicionesLamparasHangar[i][1];
        let soporteLampara = new THREE.Object3D();
        soporteLampara.position.set(x, alturaHangar + altoHangar, z);

        hangar.add(soporteLampara);
        soportesLamparasHangar.push(soporteLampara);

        let foco = new THREE.PointLight(0xffffff, 1, 15);
        foco.position.set(x, alturaHangar + altoHangar - 2.5, z);

        if (i === 0) {
            foco.castShadow = true;
            foco.shadow.mapSize.set(512, 512);
            foco.shadow.camera.near = 0.5;
            foco.shadow.camera.far = 15;
            foco.shadow.bias = -0.001;
        }

        hangar.add(foco);
    }

    
    // Nave espacial construida con geometrías
    nave = new THREE.Object3D();

    let materialMetal = new THREE.MeshStandardMaterial({color: 0x879eaf, metalness: 0.6, roughness: 0.35});
    let geometriametal = new THREE.CylinderGeometry(1.3, 1.3, 6, 8);
    let metal = new THREE.Mesh(geometriametal, materialMetal);
    metal.rotation.x = Math.PI / 2;
    metal.position.set(0, 1.5, 0);

    nave.add(metal);

    let geometriaMorro = new THREE.ConeGeometry(1.3, 2.5, 8);
    let morro = new THREE.Mesh(geometriaMorro, materialMetal);
    morro.rotation.x = Math.PI / 2;
    morro.position.set(0, 1.5, 4.25);

    nave.add(morro);

    let materialCabina = new THREE.MeshPhongMaterial({color: 0x163f65, specular: 0x88ccff, shininess: 100});
    let geometriaCabina = new THREE.SphereGeometry(1, 16, 12);
    let cabina = new THREE.Mesh(geometriaCabina, materialCabina);
    cabina.scale.set(0.9, 0.55, 1.6);
    cabina.position.set(0, 2.45, 0.8);

    nave.add(cabina);

    let materialAlas = new THREE.MeshStandardMaterial({color: 0x607d94, metalness: 0.5, roughness: 0.4, side: THREE.DoubleSide});
    for (let i = 0; i < 2; i++) {
        let lado;
        if (i === 0) {
            lado = -1;
        }
        else {
            lado = 1;
        }
        let verticesAlas = new Float32Array([
            // Cara superior
            lado * 1.0, 1.4, -1.3,   // 0 raíz trasera
            lado * 1.0, 1.4,  5.8,   // 1 raíz delantera
            lado * 4.5, 1.2, -0.6,   // 2 punta delantera
            lado * 4.5, 1.2, -1.8,   // 3 punta trasera

            // Cara inferior
            lado * 1.0, 1.0, -1.3,   // 4 raíz trasera
            lado * 1.0, 1.0,  5.8,   // 5 raíz delantera
            lado * 4.5, 0.9, -0.6,   // 6 punta delantera
            lado * 4.5, 0.9, -1.8    // 7 punta trasera
        ]);

        let indicesAlas = [
            // Cara superior
            0, 1, 2,
            0, 2, 3,

            // Cara inferior
            4, 6, 5,
            4, 7, 6,

            // Canto delantero
            1, 5, 6,
            1, 6, 2,

            // Canto trasero
            0, 3, 7,
            0, 7, 4,

            // Extremo exterior
            3, 2, 6,
            3, 6, 7,

            // Unión con el cuerpo
            0, 4, 5,
            0, 5, 1
        ];

        let geometriaAla = new THREE.BufferGeometry();
        geometriaAla.setAttribute('position', new THREE.BufferAttribute(verticesAlas, 3));
        geometriaAla.setIndex(indicesAlas);
        geometriaAla.computeVertexNormals();

        let ala = new THREE.Mesh(geometriaAla, materialAlas);
        nave.add(ala);
    }
    alturaBaseNave = alturaHangar + 1.5;
    nave.position.set(centroHangarX, alturaBaseNave, centroHangarZ);

    let materialMotor = new THREE.MeshStandardMaterial({color: 0x3d4855, metalness: 0.7, roughness: 0.35});
    let materialEscape = new THREE.MeshStandardMaterial({color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 1.5, metalness: 0.2, roughness: 0.4});
    for (let i = 0; i < 2; i++) {
        let x;

        if (i === 0) {
            x = -0.85;
        }
        else {
            x = 0.85;
        }

        let geometriaMotor = new THREE.CylinderGeometry(0.45, 0.45, 1.5, 16);
        let motor = new THREE.Mesh(geometriaMotor, materialMotor);
        motor.rotation.x = Math.PI / 2;
        motor.position.set(x, 1.4, -3);

        nave.add(motor);

        let geometriaEscape = new THREE.CircleGeometry(0.38, 16);
        let escape = new THREE.Mesh(geometriaEscape, materialEscape);
        escape.rotation.y = Math.PI;
        escape.position.set(x, 1.4, -3.76);

        nave.add(escape);
    }


    // Colisión de la nave
    nave.updateMatrixWorld(true);

    let cajaColision = new THREE.Box3().setFromObject(nave);
    let dimensionesColision = new THREE.Vector3();
    let centroColision = new THREE.Vector3();
    cajaColision.expandByScalar(0.5);
    cajaColision.getSize(dimensionesColision);
    cajaColision.getCenter(centroColision);

    let materialColision = new THREE.MeshBasicMaterial({transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide});
    let geometriaColision = new THREE.BoxGeometry(dimensionesColision.x, dimensionesColision.y + 0.8, dimensionesColision.z);
    let hitboxNave = new THREE.Mesh(geometriaColision, materialColision);
    hitboxNave.position.copy(centroColision);

    scene.add(hitboxNave);
    obstaculosAlien.push(hitboxNave);
    
    // Foco que ilumina la nave
    focoNave = new THREE.SpotLight(0xffffff, 8, 8, Math.PI / 4, 0.5, 1);
    focoNave.position.set(0, 8, -2);
    focoNave.target.position.set(0, 1, 0);
    focoNave.visible = false;

    nave.add(focoNave);
    nave.add(focoNave.target);

    nave.traverse(function(objeto) {
        if (objeto.isMesh) {
            objeto.castShadow = true; // Sombras
        }
    });
    scene.add(nave);
    
    estructura.add(hangar);
}


function crearAstronautas() {
    let loaderAstronautas = new THREE.GLTFLoader();
    let datosAstronautas = [
        {
            archivo: "models/Astronaut by Quaternius - 0D54W8yfrA.glb",
            x: -87,
            z: -84,
            rotacion: 0
        },
        {
            archivo: "models/Astronaut by Quaternius - zbtPq4dOJL.glb",
            x: -93,
            z: -64,
            rotacion: 0
        }
    ];

    for (let i = 0; i < datosAstronautas.length; i++) {
        let datos = datosAstronautas[i];

        loaderAstronautas.load(datos.archivo,
            function(gltf) {
                // Modelos
                let astronauta = new THREE.Object3D();
                let modelo = gltf.scene;

                // Los astronautas proyectan sombras
                modelo.traverse(function(pieza) {
                    if (pieza.isMesh) {
                        pieza.castShadow = true;
                    }
                });

                let caja = new THREE.Box3().setFromObject(modelo);
                let altura = caja.max.y - caja.min.y;
                let escala = 3 / altura;
                
                modelo.updateMatrixWorld(true);
                modelo.scale.multiplyScalar(escala);
                modelo.updateMatrixWorld(true);
                
                caja.setFromObject(modelo);

                modelo.position.x -= (caja.min.x + caja.max.x) / 2;
                modelo.position.y -= caja.min.y;
                modelo.position.z -= (caja.min.z + caja.max.z) / 2;

                astronauta.add(modelo);

                astronauta.position.set(datos.x, alturaSalaControl, datos.z);
                astronauta.rotation.y = datos.rotacion;

                scene.add(astronauta);
                
                // Animaciones
                let mixer = new THREE.AnimationMixer(modelo);
                let animaciones = {};

                console.log("Astronauta " + (i + 1) + " cargado");
                console.log("Animaciones disponibles:");

                for (let j = 0; j < gltf.animations.length; j++) {
                    let clip = gltf.animations[j];
                    animaciones[clip.name] = mixer.clipAction(clip);
                    console.log(" - " + clip.name);
                }

                let puntoA;
                let puntoB;

                if (i === 0) { // Rana
                    puntoA = new THREE.Vector3(-70, alturaSalaControl, -85);
                    puntoB = new THREE.Vector3(-70, alturaSalaControl, -76);
                }
                else { // Flamenco
                    puntoA = new THREE.Vector3(-110, alturaSalaControl, -64);
                    puntoB = new THREE.Vector3(-80, alturaSalaControl, -64);
                }

                astronauta.position.copy(puntoA);
                astronautas[i] = {
                    objeto: astronauta,
                    modelo: modelo,
                    mixer: mixer,
                    animaciones: animaciones,
                    posicionInicial: puntoA.clone(),
                    rotacionInicial: datos.rotacion,
                    puntoA: puntoA,
                    puntoB: puntoB,
                    objetivo: puntoB.clone(),
                    velocidadPatrulla: 4,
                    velocidadPersecucion: 7,
                    estado: "patrulla"
                };

                let accionWalk = null;
                for (let nombre in animaciones) {
                    if (nombre.split("|").pop().toLowerCase() === "walk") {
                        accionWalk = animaciones[nombre];
                        break;
                    }
                }

                if (accionWalk) {
                    accionWalk.play();
                }
            },
            undefined,
            function(error) {
                console.error(
                    "Error al cargar astronauta " + (i + 1),
                    error
                );
            }
        );
    }
}


function loadScene() {
    estructura = new THREE.Object3D(); // Elementos que obstaculizan la cámara
    scene.add(estructura);

    // Texturas
    texturaParedes = new THREE.TextureLoader().load("images/metal_04.jpg");
    texturaExterior = new THREE.TextureLoader().load("images/Scifi_Hex_Wall_Albedo.jpg");
    texturaParedesInterior = new THREE.TextureLoader().load("images/corrugated_iron_ao_4k.jpg");
    texturaParedes.encoding = THREE.sRGBEncoding;
    texturaExterior.encoding = THREE.sRGBEncoding;
    texturaParedesInterior.encoding = THREE.sRGBEncoding;
    // Wrap y repeat se especifican en cada caso
    
    crearPasillo();
    crearLaboratorio();
    crearEscaleras();
    crearSalaControl();
    crearHangar();
    crearAstronautas();

    // Reciben zonas
    for (let i = 0; i < superficiesElevadas.length; i++) {
        let objeto = superficiesElevadas[i];
        if (objeto.material && objeto.material.opacity !== 0) {
            objeto.receiveShadow = true;
        }
    }

    // Alien
    const loaderAlien = new THREE.GLTFLoader();
    loaderAlien.load("models/alien.glb",
        function (gltf) {
            // Posición del alien
            alien = new THREE.Object3D();
            modeloAlien = gltf.scene;

            // El alien proyecta sombras
            modeloAlien.traverse(function(pieza) {
                if (pieza.isMesh) {
                    pieza.castShadow = true;
                }
            });

            modeloAlien.rotation.y = rotacionModeloAlien;
            alien.add(modeloAlien);

            alien.position.set(0, 0, 0);
            alien.rotation.y = Math.PI;
            alien.updateMatrixWorld(true);
            const caja = new THREE.Box3().setFromObject(alien);
            modeloAlien.position.y -= caja.min.y;

            scene.add(alien);

            // Dimensiones alien
            alturaAlien = caja.max.y - caja.min.y;
            alturaSueloAlien = alien.position.y;            

            // Cámara 1p
            const alturaOjos = alturaAlien * 0.9;
            camera1p.position.set(0, alturaOjos, 0.65);
            camera1p.lookAt(0, alturaOjos, distanciaOrientacionCamara1p);
            
            alien.add(camera1p);

            // Cámara 3p
            camera3p.position.set(0, alturaAlien + 2, distanciaCamara3p);
            controls3p.target.set(alien.position.x, alturaAlien * 0.7, alien.position.z);
            controls3p.update();

            // Cámara debug
            controlsDebug.target.set(0, alturaAlien / 2, 0);
            controlsDebug.update();
            
            // Animaciones
            mixerAlien = new THREE.AnimationMixer(modeloAlien);

            for (let i = 0; i < gltf.animations.length; i++) {
                let clip = gltf.animations[i];
                let nombre = clip.name.split("|").pop();
                animacionesAlien[nombre] = mixerAlien.clipAction(clip);
            }
            
            // Animación inicial
            animacionesAlien["Idle"].play();
            animacionActual = "Idle";

            // Detectar cuándo termina una animación
            mixerAlien.addEventListener("finished", function(event) {
                if (event.action === animacionesAlien["Jump"] && !enSuelo) {
                    reproducirAnimacion("Jump_Idle");
                }

                if (event.action === animacionesAlien["Weapon"]) {
                    reproducirAnimacion("Idle");
                }
            });
        },
        undefined,
        function (error) {
            console.error("Error al cargar el alien:", error);
        }
    );

    // Iluminación general
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(luzAmbiental);
}


function cambiarCamara() {
    pausado = !pausado;
    controlsDebug.enabled = pausado; // Controles de debug en pausado

    controls3p.enabled = !pausado && terceraPersona; // Controles de 3p en movimiento y si está activada, sino los de 1p

    if (pausado) {
        teclas.adelante = false;
        teclas.atras = false;
        teclas.izquierda = false;
        teclas.derecha = false;
    }
}

function alternar1p3p() {
    if (pausado) return;

    terceraPersona = !terceraPersona;
    controls3p.enabled = terceraPersona;
}

function actualizarLaseres(delta) {
    let inicioRiel = -largoLab / 2 - 6;
    let finalRiel = -largoLab / 2 - largoPasillo + 6;

    for (let i = 0; i < lasers.length; i++) {
        if (lasers[i].activo) {
            let laser = lasers[i].objeto;
            laser.position.z += velocidadLaser * delta;

            // Comprobar si el láser toca al alien
            if (alien) {
                let distanciaZ = Math.abs(alien.position.z - laser.position.z);
                let distanciaX = Math.abs(alien.position.x - laser.position.x);

                // El haz atraviesa el pasillo de lado a lado
                if (distanciaZ < 0.8 + velocidadLaser * delta &&
                    distanciaX < anchoPasillo / 2) {

                    // Comprobar altura del alien respecto al haz
                    let inicioHaz = new THREE.Vector3(-anchoPasillo / 2 + 0.3, laser.children[0].position.y, laser.position.z);
                    let finalHaz = new THREE.Vector3(anchoPasillo / 2 - 0.3, laser.children[1].position.y, laser.position.z);
                    let direccionHaz = new THREE.Vector3().subVectors(finalHaz, inicioHaz);
                    let posicionRelativa = new THREE.Vector3().subVectors(alien.position, inicioHaz);
                    let t = THREE.MathUtils.clamp(posicionRelativa.dot(direccionHaz) / direccionHaz.lengthSq(), 0, 1);
                    let puntoHaz = inicioHaz.addScaledVector(direccionHaz, t);

                    // Comprobar si el haz cruza la altura del cuerpo
                    if (puntoHaz.y >= alien.position.y - 0.3 && puntoHaz.y <= alien.position.y + alturaAlien + 0.3) {
                        // Muerte
                        numeroMuertes++;
                        document.getElementById("contadorMuertes").textContent = "Muertes: " + numeroMuertes;
                        
                        alien.position.set(0, 0, 0);
                        alien.rotation.y = Math.PI;
                        velocidadVertical = 0;
                        enSuelo = true;
                    }
                }
            }

            if (laser.position.z >= inicioRiel) {
                lasers[i].activo = false;
                laser.visible = false;
                laser.position.z = finalRiel;
            }
        }
    }

    tiempoLaser += delta; // Controlar el tiempo entre salidas

    if (tiempoLaser >= intervaloLaser) {
        tiempoLaser -= intervaloLaser;

        if (!lasers[siguienteLaser].activo) {
            lasers[siguienteLaser].activo = true;
            lasers[siguienteLaser].objeto.position.z = finalRiel;
            lasers[siguienteLaser].objeto.visible = true;

            siguienteLaser++;

            if (siguienteLaser >= lasers.length) {
                siguienteLaser = 0;
            }
        }
    }
}

function reproducirAnimacion(nombre) {
    if (!mixerAlien || !animacionesAlien[nombre]) return;
    if (animacionActual === nombre) return;

    let nueva = animacionesAlien[nombre];

    if (animacionActual !== "") { // Esperar para la nueva animación
        animacionesAlien[animacionActual].fadeOut(0.15);
    }

    nueva.reset();
    nueva.setEffectiveWeight(1);
    
    // Las animaciones de inicio y fin se ejecutan una vez
    if (nombre === "Jump" || nombre === "Weapon") {
        nueva.setLoop(THREE.LoopOnce, 1);
        nueva.clampWhenFinished = true;
    }
    else {
        nueva.setLoop(THREE.LoopRepeat, Infinity);
        nueva.clampWhenFinished = false;
    }

    nueva.fadeIn(0.15);
    nueva.play();

    animacionActual = nombre;
}

function moverConColisiones(direccion, distancia) {
    if (distancia <= 0) return;
    direccion.normalize();

    // Lanzar un rayo desde el alien hacia delante
    let origenRayo = alien.position.clone();
    origenRayo.y += Math.min(alturaAlien / 2, 1);
    estructura.updateMatrixWorld(true);
    raycasterAlien.set(origenRayo, direccion);
    raycasterAlien.near = 0;
    raycasterAlien.far = distancia + margenAlien;

    // Avanzar si no hay pared
    let impactos = raycasterAlien.intersectObjects(obstaculosAlien, false);
    if (impactos.length === 0) {
        alien.position.addScaledVector(direccion, distancia);
    }
}


function actualizarAlturaAlien(delta) {
    let origenRayo = alien.position.clone();
    origenRayo.y += alturaMaximaEscalon;

    // Buscar las superficies de debajo
    raycasterSuelo.set(origenRayo, new THREE.Vector3(0, -1, 0));
    raycasterSuelo.far = 30;

    let impactos = raycasterSuelo.intersectObjects(superficiesElevadas, false);
    let alturaSuelo = null;

    // Ignorar superficies demasiado altas para subir como si fuera un escalón
    for (let i = 0; i < impactos.length; i++) {
        if (impactos[i].point.y <= alien.position.y + alturaMaximaEscalon) {
            alturaSuelo = impactos[i].point.y;
            break;
        }
    }

    if (enSuelo) {
        // Subir o bajar pequeños escalones
        if (alturaSuelo !== null &&
            Math.abs(alturaSuelo - alien.position.y) <= alturaMaximaEscalon) {

            alien.position.y = alturaSuelo;
            velocidadVertical = 0;
        }
        // Caída
        else {
            enSuelo = false;
            velocidadVertical = 0;
        }
    }

    // Aplicar la gravedad
    if (!enSuelo) {
        let alturaAnterior = alien.position.y;
        velocidadVertical -= gravedad * delta;
        alien.position.y += velocidadVertical * delta;

        // Detectar posibles suelos
        if (velocidadVertical <= 0) {
            let origenCaida = alien.position.clone();
            origenCaida.y = alturaAnterior + 0.05;
            raycasterSuelo.set(origenCaida, new THREE.Vector3(0, -1, 0));
            raycasterSuelo.far = 30;

            let impactosCaida = raycasterSuelo.intersectObjects(superficiesElevadas, false);
            for (let i = 0; i < impactosCaida.length; i++) {
                let alturaImpacto = impactosCaida[i].point.y;

                // El alien ha cruzado esta superficie mientras caía
                if (alturaAnterior + 0.05 >= alturaImpacto && alien.position.y <= alturaImpacto) {
                    alien.position.y = alturaImpacto;
                    velocidadVertical = 0;
                    enSuelo = true;
                    break;
                }
            }
        }
    }
}

function moverAlien(delta) {
    if (!alien) return;

    if (terceraPersona){
        // Dirección horizontal de la cámara
        const adelante = new THREE.Vector3();
        if (terceraPersona) {
            camera3p.getWorldDirection(adelante);
        }
        else {
            camera1p.getWorldDirection(adelante);
        }
        adelante.y = 0;
        adelante.normalize();

        // Dirección perpendicular (derecha)
        const derecha = new THREE.Vector3(-adelante.z, 0, adelante.x);

        
        // Movimiento solicitado
        const movimiento = new THREE.Vector3();

        if (teclas.adelante)
            movimiento.add(adelante);
        if (teclas.atras)
            movimiento.sub(adelante);
        if (teclas.derecha)
            movimiento.add(derecha);
        if (teclas.izquierda)
            movimiento.sub(derecha);
        if (movimiento.lengthSq() > 0) {
            movimiento.normalize(); // Evitar movimiento más rápido en diagonal
            moverConColisiones(movimiento, velocidad * delta);
            alien.rotation.y = Math.atan2(movimiento.x, movimiento.z);
        }
    }

    else{ //Primera persona
        const velocidadGiro = 2;
        if (teclas.izquierda)
            alien.rotation.y += velocidadGiro * delta;
        if (teclas.derecha)
            alien.rotation.y -= velocidadGiro * delta;

        // Avanzar o retroceder según la orientación de la cámara
        const adelante = new THREE.Vector3();
        camera1p.getWorldDirection(adelante);
        adelante.y = 0;
        adelante.normalize();
        if (teclas.adelante)
            moverConColisiones(adelante.clone(), velocidad * delta);
        if (teclas.atras)
            moverConColisiones(adelante.clone().negate(), velocidad * delta);
    }

    // Salto y gravedad
    actualizarAlturaAlien(delta);
}


function astronautaVeAlien(astronauta) {
    if (!alien) {
        return false;
    }

    // Ojos del astronauta
    let origen = astronauta.objeto.position.clone();
    origen.y += 2.5;

    // Posición del cuerpo del alien
    let destino = alien.position.clone();
    destino.y += alturaAlien * 0.65;
    let direccionAlien = new THREE.Vector3().subVectors(destino, origen);
    let distancia = direccionAlien.length();
    if (distancia > distanciaVisionAstronautas) {
        return false;
    }

    // No perseguir al alien más allá de la entrada a las escaleras
    if (alien && alien.position.x > inicioSalaX) {
        if (astronauta.estado === "persecucion") {
            astronauta.estado = "regreso";
            cambiarAnimacionAstronauta(astronauta, "Walk");
        }
    }

    // Cono de visión solo durante la patrulla
    if (astronauta.estado === "patrulla") {
        let direccionHorizontalAlien = direccionAlien.clone();
        direccionHorizontalAlien.y = 0;
        direccionHorizontalAlien.normalize();

        let direccionFrontalPatrulla = new THREE.Vector3().subVectors(astronauta.objetivo, astronauta.objeto.position);
        direccionFrontalPatrulla.y = 0;
        direccionFrontalPatrulla.normalize();
        let productoEscalar = direccionFrontalPatrulla.dot(direccionHorizontalAlien);
        let limiteCono = Math.cos(anguloVisionAstronautas / 2);

        if (productoEscalar < limiteCono) {
            return false;
        }
    }

    // Raycaster para comprobar obstáculos
    raycasterAstronautas.set(origen, direccionAlien.normalize());
    raycasterAstronautas.near = 0.05;
    raycasterAstronautas.far = distancia;
    estructura.updateMatrixWorld(true);
    let impactos = raycasterAstronautas.intersectObject(estructura, true);

    if (impactos.length > 0 && impactos[0].distance < distancia - 0.05) {
        return false;
    }

    return true;
}


function cambiarAnimacionAstronauta(astronauta, nombreAnimacion) {
    for (let nombre in astronauta.animaciones) {
        let animacion = nombre.split("|").pop().toLowerCase();

        if (animacion === nombreAnimacion.toLowerCase()) {
            astronauta.animaciones[nombre].reset();
            astronauta.animaciones[nombre].fadeIn(0.2);
            astronauta.animaciones[nombre].play();
        }
        else if (animacion === "walk" || animacion === "run") {
            astronauta.animaciones[nombre].fadeOut(0.2);
        }
    }
}



function actualizarDeteccionAstronautas() {
    for (let i = 0; i < astronautas.length; i++) {
        let astronauta = astronautas[i];

        if (!astronauta) {
            continue;
        }

        if (astronauta.estado === "patrulla") {
            if (astronautaVeAlien(astronauta)) {
                astronauta.estado = "persecucion";
                cambiarAnimacionAstronauta(astronauta, "Run");
            }
        }
        else if (astronauta.estado === "persecucion") {
            if (!astronautaVeAlien(astronauta)) {
                astronauta.estado = "regreso";
                cambiarAnimacionAstronauta(astronauta, "Walk");
            }
        }
    }
}


function actualizarPatrullas(delta) {
    for (let i = 0; i < astronautas.length; i++) {
        let astronauta = astronautas[i];

        if (!astronauta) {
            continue;
        }

        let posicion = astronauta.objeto.position;
        let destino;
        let velocidad;

        // Elegir destino y velocidad según el estado
        if (astronauta.estado === "patrulla") {
            destino = astronauta.objetivo;
            velocidad = astronauta.velocidadPatrulla;
        }
        else if (astronauta.estado === "persecucion") {
            destino = alien.position;
            velocidad = astronauta.velocidadPersecucion;
        }
        else {
            destino = astronauta.puntoA;
            velocidad = astronauta.velocidadPatrulla;
        }

        // Dirección horizontal hacia el destino
        let direccion = new THREE.Vector3().subVectors(destino, posicion);
        direccion.y = 0;
        let distancia = direccion.length();

        // Llegada al destino
        if (distancia < 0.1) {
            if (astronauta.estado === "patrulla") {
                if (astronauta.objetivo.distanceTo(astronauta.puntoB) < 0.1) {
                    astronauta.objetivo.copy(astronauta.puntoA);
                }
                else {
                    astronauta.objetivo.copy(astronauta.puntoB);
                }
            }
            else if (astronauta.estado === "regreso") {
                posicion.copy(astronauta.puntoA);
                astronauta.objetivo.copy(astronauta.puntoB);
                astronauta.estado = "patrulla";
            }
            continue;
        }

        // Girar hacia donde se mueve
        direccion.normalize();
        astronauta.objeto.rotation.y = Math.atan2(direccion.x, direccion.z) + astronauta.rotacionInicial;
        let desplazamiento = Math.min(velocidad * delta, distancia);
        let puedeAvanzar = true;

        // Comprobar colisiones al perseguir y regresar
        if (astronauta.estado !== "patrulla") {
            let origenRayo = posicion.clone();
            origenRayo.y += 1.5;
            let raycasterMovimiento = new THREE.Raycaster(origenRayo, direccion, 0, desplazamiento + 0.6);
            let impactos = raycasterMovimiento.intersectObjects(obstaculosAlien, false);
            if (impactos.length > 0) {
                puedeAvanzar = false;
            }
        }

        if (puedeAvanzar) {
            posicion.addScaledVector(direccion, desplazamiento);
        }

        if (alien) {
            let distanciaHorizontal = Math.sqrt(Math.pow(posicion.x - alien.position.x, 2) + Math.pow(posicion.z - alien.position.z, 2));
            let diferenciaAltura = Math.abs(posicion.y - alien.position.y);
            
            // Toca al alien
            if (distanciaHorizontal < 1.5 && diferenciaAltura < 2.5) {
                // Devolver al alien al laboratorio
                numeroMuertes++;
                document.getElementById("contadorMuertes").textContent = "Muertes: " + numeroMuertes;

                alien.position.set(0, 0, 0);
                alien.rotation.y = Math.PI;                
                velocidadVertical = 0;
                enSuelo = true;

                // Regresar a la patrulla
                astronauta.estado = "regreso";
                cambiarAnimacionAstronauta(astronauta, "Walk");
            }
        }
    }
}


function render() {
    requestAnimationFrame(render);

    const deltaReal = reloj.getDelta();
    const delta = Math.min(deltaReal, 0.05);

    // Cronómetro
    if (juegoIniciado && !pausado && !tiempoFinalizado) {
        tiempoPartida += deltaReal;
        
        let minutos = Math.floor(tiempoPartida / 60);
        let segundos = Math.floor(tiempoPartida % 60);
        let textoMinutos = String(minutos).padStart(2, "0");
        let textoSegundos = String(segundos).padStart(2, "0");

        document.getElementById("contadorTiempo").textContent = "Tiempo: " + textoMinutos + ":" + textoSegundos;
    }

    if (!juegoIniciado) {
        renderer.render(scene, camera3p);
        return;
    }

    if (victoriaMostrada) {
        renderer.render(scene, cameraNave);
        return;
    }

    if (escapando) {
        if (faseDespegue === 1) { // Ascenso vertical
            let alturaObjetivo = alturaHangar + altoHangar + 8;
            nave.position.y = Math.min(nave.position.y + velocidadAscensoNave * delta, alturaObjetivo);
            if (nave.position.y >= alturaObjetivo) {
                faseDespegue = 2;
            }
        }
        else if (faseDespegue === 2) { // Avance en línea recta
            nave.position.z += velocidadAvanceNave * delta;
            tiempoEscape += delta;
            
            if (tiempoEscape >= 4 && !victoriaMostrada) {
                victoriaMostrada = true;

                let minutos = Math.floor(tiempoPartida / 60);
                let segundos = Math.floor(tiempoPartida % 60);
                let textoMinutos = String(minutos).padStart(2, "0");
                let textoSegundos = String(segundos).padStart(2, "0");

                document.getElementById("muertesFinales").textContent = "Muertes: " + numeroMuertes;
                document.getElementById("tiempoFinal").textContent = "Tiempo: " + textoMinutos + ":" + textoSegundos;
                document.getElementById("pantallaVictoria").style.display = "flex";
            }
        }

        // Cámara fija
        cameraNave.position.set(nave.position.x, nave.position.y + 7, nave.position.z - 8);
        cameraNave.lookAt(nave.position.x, nave.position.y + 1.5, nave.position.z + 3);
        renderer.render(scene, cameraNave);
    }

    else if (pausado) {
        controlsDebug.update();
        renderer.render(scene, cameraOrbital);
    }

    else {
        // Movimiento
        moverAlien(delta);
        actualizarLaseres(delta);
        actualizarDeteccionAstronautas();
        actualizarPatrullas(delta);

        // Flotación de la nave
        if (nave) {
            tiempoFlotacionNave += delta;
            nave.position.y = alturaBaseNave + Math.sin(tiempoFlotacionNave * 2) * 0.35;
        }

        // Animaciones del alien
        if (mixerAlien) {
            mixerAlien.update(delta);
        }

        // Animaciones de los astronautas
        for (let i = 0; i < astronautas.length; i++) {
            if (astronautas[i] && astronautas[i].mixer) {
                astronautas[i].mixer.update(delta);
            }
        }
        
        if (alien && mixerAlien && enSuelo && animacionActual !== "Weapon") {
            let moviendose = teclas.adelante || teclas.atras;
            if (terceraPersona) {
                moviendose = moviendose || teclas.izquierda || teclas.derecha;
            }

            if (moviendose) {
                reproducirAnimacion("Run");
            }
            else {
                reproducirAnimacion("Idle");
            }
        }

        
        // Palanca y puerta
        if (flechaPalanca && !palancaActivada) {
            tiempoFlechaPalanca += delta;
            flechaPalanca.position.y = 4.5 + Math.sin(tiempoFlechaPalanca * 3) * 0.35;
        }
        if (palancaActivada && palanca && puertaIzquierda && puertaDerecha) {
            palanca.rotation.z = Math.max(palanca.rotation.z - velocidadInclinacionPalanca * delta, -anguloMaximoPalanca);
            puertaIzquierda.position.x = Math.max(puertaIzquierda.position.x - velocidadAperturaPuerta * delta, -posicionFinalPuerta);
            puertaDerecha.position.x = Math.min(puertaDerecha.position.x + velocidadAperturaPuerta * delta, posicionFinalPuerta);
        }

        
        // Palanca y puerta de salida al hangar
        if (palancaSalaControlActivada && palancaSalaControl && puertaHangarIzquierda && puertaHangarDerecha) {
            palancaSalaControl.rotation.z = Math.max(palancaSalaControl.rotation.z - velocidadInclinacionPalanca * delta, -anguloMaximoPalanca);

            let centroSalidaX = finalSalaX + anchoSalaControl / 2;
            puertaHangarIzquierda.position.x = Math.max(puertaHangarIzquierda.position.x - velocidadAperturaPuerta * delta, centroSalidaX - posicionFinalPuerta);
            puertaHangarDerecha.position.x = Math.min(puertaHangarDerecha.position.x + velocidadAperturaPuerta * delta, centroSalidaX + posicionFinalPuerta);
        }

        // Seguimiento del alien en tercera persona
        if (alien && terceraPersona) {
            const nuevoCentro = new THREE.Vector3(alien.position.x, alien.position.y - alturaSueloAlien + alturaAlien * 0.7, alien.position.z);
            const desplazamiento = new THREE.Vector3();
            desplazamiento.subVectors(nuevoCentro, controls3p.target);

            camera3p.position.add(desplazamiento);
            controls3p.target.copy(nuevoCentro);
            controls3p.update();

            // Buscar obstáculos entre el personaje y la posición ideal de la cámara.
            const direccionCamara = new THREE.Vector3().subVectors(camera3p.position, controls3p.target).normalize();
            const posicionDeseadaCamara = controls3p.target.clone().addScaledVector(direccionCamara, distanciaCamara3p);

            estructura.updateMatrixWorld(true);
            raycasterCamara.set(controls3p.target, direccionCamara);
            raycasterCamara.near = 0;
            raycasterCamara.far = distanciaCamara3p;

            const obstaculos = raycasterCamara.intersectObject(estructura, true);
            if (obstaculos.length > 0) { // Reviso si me choco con el objeto + cercano
                const distanciaSegura = Math.max(0, obstaculos[0].distance - margenCamara);
                camera3p.position.copy(controls3p.target).addScaledVector(direccionCamara, distanciaSegura);
            } else { // Si no, vuelvo a posición inicial
                const recuperacion = 1 - Math.exp(-velocidadRecuperacionCamara * delta);
                camera3p.position.lerp(posicionDeseadaCamara, recuperacion);
            }
        }

        // Cámara activa
        if (terceraPersona) {
            renderer.render(scene, camera3p);
        }
        else {
            renderer.render(scene, camera1p);
        }
    }
}