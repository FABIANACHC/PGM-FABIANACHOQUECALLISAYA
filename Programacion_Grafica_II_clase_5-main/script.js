const escena = new THREE.Scene();
const camara = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderizar = new THREE.WebGLRenderer();
renderizar.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderizar.domElement);

const llama = new THREE.Group();
const material = new THREE.MeshBasicMaterial({ color: 0xD9C29C });

const cuerpoGeom = new THREE.BoxGeometry(4.5, 3, 1.2);
const cuerpo = new THREE.Mesh(cuerpoGeom, material);
cuerpo.position.set(0, 2, 0);
llama.add(cuerpo);

const cuelloGeom = new THREE.BoxGeometry(1, 2.5, 1);
const cuello = new THREE.Mesh(cuelloGeom, material);
cuello.position.set(-1.5, 4.5, 0.3);
llama.add(cuello);

const cabezaGeom = new THREE.BoxGeometry(1.2, 1.2, 1);
const cabeza = new THREE.Mesh(cabezaGeom, material);
cabeza.position.set(-1.5, 6, 0.6);
llama.add(cabeza);

const hocicoGeom = new THREE.BoxGeometry(0.7, 0.6, 0.7);
const hocicoMat = new THREE.MeshBasicMaterial({ color: 0xB89B78 });
const hocico = new THREE.Mesh(hocicoGeom, hocicoMat);
hocico.position.set(-1.5, 5.8, 1);
llama.add(hocico);

const orejaGeom = new THREE.BoxGeometry(0.3, 0.5, 0.3);
const oreja1 = new THREE.Mesh(orejaGeom, material);
const oreja2 = new THREE.Mesh(orejaGeom, material);
oreja1.position.set(-1.8, 6.6, 0.5);
oreja2.position.set(-1.2, 6.6, 0.5);
llama.add(oreja1);
llama.add(oreja2);

const pataGeom = new THREE.BoxGeometry(0.5, 2, 0.5);
const pata1 = new THREE.Mesh(pataGeom, material);
const pata2 = new THREE.Mesh(pataGeom, material);
const pata3 = new THREE.Mesh(pataGeom, material);
const pata4 = new THREE.Mesh(pataGeom, material);
pata1.position.set(-1.8, 1, 0.5);
pata2.position.set(1.8, 1, 0.5);
pata3.position.set(-1.8, 1, -0.5);
pata4.position.set(1.8, 1, -0.5);
llama.add(pata1);
llama.add(pata2);
llama.add(pata3);
llama.add(pata4);

const colaGeom = new THREE.BoxGeometry(0.4, 0.8, 0.4);
const cola = new THREE.Mesh(colaGeom, material);
cola.position.set(2, 2.5, -0.9);
llama.add(cola);

escena.add(llama);

camara.position.z = 6;
camara.position.y = 2;

const translateX = document.getElementById('translateX');
const rotateY = document.getElementById('rotateY');
const scale = document.getElementById('scale');

function animate() {
  requestAnimationFrame(animate);
  llama.position.x = parseFloat(translateX.value);
  llama.rotation.y = THREE.MathUtils.degToRad(parseFloat(rotateY.value));
  llama.scale.set(scale.value, scale.value, scale.value);
  renderizar.render(escena, camara);
}

animate();

window.addEventListener('resize', () => {
    camara.aspect = window.innerWidth / window.innerHeight;
    camara.updateProjectionMatrix();
    renderizar.setSize(window.innerWidth, window.innerHeight);
});
