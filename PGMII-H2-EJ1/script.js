// Escena, cámara y renderizador
const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderizador = new THREE.WebGLRenderer();
renderizador.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizador.domElement);

// Cargar textura
const loader = new THREE.TextureLoader();
const textura = loader.load('tierra.jpg'); // Asegúrate de que la imagen está en el mismo directorio


const geometry = new THREE.SphereGeometry(15, 32, 16);
const material = new THREE.MeshBasicMaterial({ map: textura });
const esfera = new THREE.Mesh(geometry, material);
escena.add(esfera);

// Posicionar la cámara
camara.position.z = 50; 

// Animación
function animacion() {
    requestAnimationFrame(animacion);
    esfera.rotation.x += 0.01;
    esfera.rotation.y += 0.01;
    renderizador.render(escena, camara);
}

animacion();

// Ajustar el tamaño de la ventana al cambiar su tamaño
window.addEventListener('resize', () => {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderizador.setSize(window.innerWidth, window.innerHeight);
});
