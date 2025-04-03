const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaño de cada celda en píxeles
const cellSize = 30;

// Mapa del laberinto: 1 = pared, 0 = camino
const maze = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1],
  [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
  [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Creamos una matriz de puntos: true si la celda tiene un punto para comer
let points = [];
for (let row = 0; row < maze.length; row++) {
  points[row] = [];
  for (let col = 0; col < maze[row].length; col++) {
    points[row][col] = maze[row][col] === 0;
  }
}

// Puntaje inicial
let score = 0;

// Posición inicial del jugador (coordenadas de celda)
let player = {
  x: 1,
  y: 1
};

// Dirección en la que mira Pacman (por defecto hacia la derecha)
let lastDirection = { dx: 1, dy: 0 };

// Enemigos: se han añadido más enemigos con sus posiciones y colores
let enemies = [
  { x: 9,  y: 7,  color: "red" },
  { x: 10, y: 7,  color: "pink" },
  { x: 8,  y: 8,  color: "cyan" },
  { x: 12, y: 3,  color: "orange" },
  { x: 3,  y: 10, color: "green" },
  { x: 15, y: 12, color: "purple" }
];

// Balas disparadas por Pacman
let bullets = [];

// Dibuja el laberinto (paredes y caminos)
function drawMaze() {
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 1) {
        ctx.fillStyle = "blue";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
}

// Dibuja los puntos en las celdas donde aún no han sido comidos
function drawPoints() {
  for (let row = 0; row < points.length; row++) {
    for (let col = 0; col < points[row].length; col++) {
      if (points[row][col]) {
        ctx.beginPath();
        ctx.arc(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
      }
    }
  }
}

// Dibuja a Pacman como un círculo amarillo con "boca" abierta
function drawPlayer() {
  const centerX = player.x * cellSize + cellSize / 2;
  const centerY = player.y * cellSize + cellSize / 2;
  const radius = cellSize / 2 - 2;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0.25 * Math.PI, 1.75 * Math.PI, false);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

// Dibuja a los enemigos como círculos de su color
function drawEnemies() {
  enemies.forEach(enemy => {
    const centerX = enemy.x * cellSize + cellSize / 2;
    const centerY = enemy.y * cellSize + cellSize / 2;
    const radius = cellSize / 2 - 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = enemy.color;
    ctx.fill();
  });
}

// Dibuja las balas como pequeñas bolas amarillas
function drawBullets() {
  bullets.forEach(bullet => {
    ctx.beginPath();
    ctx.arc(bullet.x * cellSize + cellSize / 2, bullet.y * cellSize + cellSize / 2, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
  });
}

// Dibuja el puntaje en la parte superior izquierda
function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText("Puntaje: " + score, 10, 20);
}

// Redibuja todo el escenario
function draw() {
  drawMaze();
  drawPoints();
  drawPlayer();
  drawEnemies();
  drawBullets();
  drawScore();
}

// Comprueba si la celda (x, y) es transitable
function isWalkable(x, y) {
  if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) {
    return false;
  }
  return maze[y][x] === 0;
}

// Comprueba colisiones: puntos, enemigos y balas
function checkCollisions() {
  // Comer punto
  if (points[player.y][player.x]) {
    points[player.y][player.x] = false;
    score += 10;
  }
  
  // Colisión de Pacman con enemigos (si no han sido eliminados por bala)
  enemies = enemies.filter(enemy => {
    if (enemy.x === player.x && enemy.y === player.y) {
      console.log("¡Enemigo comido por Pacman!");
      return false;
    }
    return true;
  });
}

// Función para disparar una bala en la dirección actual de Pacman
function shootBullet() {
  // La bala parte de la posición actual del jugador
  bullets.push({
    x: player.x,
    y: player.y,
    dx: lastDirection.dx,
    dy: lastDirection.dy
  });
}

// Actualiza la posición de las balas
function updateBullets() {
  // Se recorre el array de balas
  bullets = bullets.filter(bullet => {
    // Actualiza la posición de la bala
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
    
    // Comprueba si la bala está fuera de límites o ha chocado con una pared
    if (!isWalkable(bullet.x, bullet.y)) {
      return false;
    }
    
    // Comprueba colisión de la bala con enemigos
    for (let i = 0; i < enemies.length; i++) {
      if (enemies[i].x === bullet.x && enemies[i].y === bullet.y) {
        console.log("¡Enemigo impactado por bala!");
        // Elimina al enemigo impactado
        enemies.splice(i, 1);
        return false; // Elimina la bala
      }
    }
    
    return true;
  });
  draw();
}

// Movimiento aleatorio de los enemigos
function moveEnemies() {
  enemies.forEach(enemy => {
    const directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 }
    ];
    directions.sort(() => Math.random() - 0.5);
    for (let dir of directions) {
      const newX = enemy.x + dir.dx;
      const newY = enemy.y + dir.dy;
      if (isWalkable(newX, newY)) {
        enemy.x = newX;
        enemy.y = newY;
        break;
      }
    }
  });
  // Tras mover a los enemigos, comprueba colisiones
  checkCollisions();
  draw();
}

// Intervalo para mover a los enemigos cada 500ms
setInterval(moveEnemies, 500);

// Intervalo para actualizar las balas cada 100ms
setInterval(updateBullets, 100);

// Manejador de teclas: movimiento y disparo
document.addEventListener("keydown", (event) => {
  let newX = player.x;
  let newY = player.y;
  
  // Movimiento con flechas y actualización de la dirección
  if (event.key === "ArrowUp") {
    newY--;
    lastDirection = { dx: 0, dy: -1 };
  }
  if (event.key === "ArrowDown") {
    newY++;
    lastDirection = { dx: 0, dy: 1 };
  }
  if (event.key === "ArrowLeft") {
    newX--;
    lastDirection = { dx: -1, dy: 0 };
  }
  if (event.key === "ArrowRight") {
    newX++;
    lastDirection = { dx: 1, dy: 0 };
  }
  
  // Disparo con la barra espaciadora
  if (event.code === "Space") {
    shootBullet();
  }
  
  // Mueve al jugador si la celda es transitable
  if (isWalkable(newX, newY)) {
    player.x = newX;
    player.y = newY;
    checkCollisions();
    draw();
  }
});

// Dibuja la escena inicial
draw();
