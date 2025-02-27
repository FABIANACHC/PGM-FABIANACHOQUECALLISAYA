from vpython import *
import asyncio
import numpy as np

scene = canvas(title="Combinación de Conceptos en VPython", width=800, height=600)
scene.background = color.white

def crear_conos(posicion, n):
    conos = []
    for i in range(n):
        # Asignamos un tamaño y altura decreciente para los conos
        radio = 1.0 * (1 - 0.1 * i)  # Disminuir el radio
        altura = 2.0 * (1 - 0.1 * i)  # Disminuir la altura
        cono = cone(pos=posicion, radius=radio, color=color.yellow, axis=vector(0, altura, 0))
        conos.append(cono)
        posicion += vector(1.5 * radio, 0, 0)  
    return conos

conos = crear_conos(vector(-2, 0, 0), 5)  # Ahora llamamos la nueva función

def crear_torre_cilindros(base_pos, base_radio, base_altura, niveles, separacion):
    for i in range(niveles):
        radio = base_radio * (0.8 ** i)
        altura = base_altura * (0.9 ** i)
        cylinder(pos=base_pos + vector(0, i * (altura + separacion), 0), radius=radio, axis=vector(0, altura, 0), color=color.green)

crear_torre_cilindros(vector(6, 0, 0), 0.2, 2, 5, 0.3)

cilindro_movible = cylinder(pos=vector(6.2, 0, 0), radius=0.2, axis=vector(0, 2, 0), color=color.blue)

async def mover_conos(conos):
    centro = vector(0, 0, 0) 
    angulo = np.linspace(0, 2 * np.pi, 100)
    for t in range(100):
        for i, cono in enumerate(conos):
            x = centro.x + 2 * np.cos(angulo[t] + i * np.pi / 2)
            z = centro.z + 2 * np.sin(angulo[t] + i * np.pi / 2)
            cono.pos = vector(x, 0, z)
        await asyncio.sleep(0.05)
    for i, cono in enumerate(conos):
        cono.pos = vector(-2 + i * 1.5, 0, 0)

async def mover_cilindro():
    while True:
        for dx in np.linspace(-0.3, 0.3, 20):
            cilindro_movible.pos.x = 6.2 + dx
            await asyncio.sleep(0.05)
        for dx in np.linspace(0.3, -0.3, 20):
            cilindro_movible.pos.x = 6.2 + dx
            await asyncio.sleep(0.05)

async def main():
    task1 = asyncio.create_task(mover_conos(conos))
    task2 = asyncio.create_task(mover_cilindro())
    await asyncio.gather(task1, task2)

asyncio.run(main())
