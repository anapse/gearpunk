# GEAR RUSH — GAME DESIGN MASTER

## Identidad
- Juego: GEAR RUSH
- Subtítulo de portada: (Comercial Jarros)
- Homenaje: (En honor a Violenti)
- Género: platformer vertical 2D de supervivencia y precisión.
- Tecnología: React + Vite + Canvas.
- Inspiración de experiencia: claridad y lectura inmediata de un juego casual tipo Flappy Bird; NO copiar assets, personajes ni código de terceros.

## Formato
- Resolución lógica: 480x800.
- Móvil: ocupa el ancho disponible en orientación vertical.
- PC: viewport vertical centrado, sin estirar el juego horizontalmente.
- Sin aviso obligatorio de girar el teléfono.
- Control principal: táctil/swipe y mouse gesture.
- Teclado solo opcional para debug.

## Jugabilidad
El jugador SOLO decide la dirección del salto:
1. arriba-izquierda
2. arriba
3. arriba-derecha

No existe joystick, caminar manual, ni botones permanentes.

El personaje salta automáticamente al iniciar el gesto. La trayectoria se resuelve con física, gravedad y una pequeña tolerancia de agarre para evitar injusticias.

## Input
Medir startX/startY/endX/endY y deltaX/deltaY.
Clasificar el gesto en tres sectores:
- ↖ arriba-izquierda
- ↑ arriba
- ↗ arriba-derecha
Aceptar una distancia mínima y usar tolerancia angular.
Mouse debe comportarse igual que touch.

## Personaje
Pequeño punk/metalero pixel art:
- pelo negro con mechón rojo
- ropa rock/metal
- chaqueta con tachuelas
- pantalón oscuro
- botas pesadas
- accesorios metálicos
Silueta muy legible.

Estados mínimos:
IDLE, CROUCH, JUMPING, FALLING, GRABBING, HANGING, CLIMBING, LANDING, DAMAGED, DEAD, VICTORY.

## Salto y gravedad
La gravedad es constante en el aire.
Variables configurables:
gravity, jumpVelocityY, jumpVelocityX, terminalVelocity, grabDistance, climbDuration, landingTolerance.
No cambiar la física fundamental entre pantallas; aumentar la dificultad con geometría, velocidad y peligros.

## Agarre y subida
Cuando el personaje alcanza el borde válido de un engranaje:
1. detectar grab zone;
2. frenar la caída;
3. colocar ambas manos en el borde;
4. pequeña pausa/animación de esfuerzo;
5. subir automáticamente;
6. quedar encima del engranaje.
Debe sentirse parecido a un agarre de plataforma clásico, pero con arte y animación originales.

## Engranajes
Un banco de sprites coherente reutilizable y escalable:
- normal horario ↻
- normal antihorario ↺
- grande
- pequeño
- rápido
- estático
- eléctrico
- explosivo

Cada engranaje móvil tiene direction y rotationSpeed.
La flecha de rotación debe estar integrada o claramente visible sobre el engranaje.
La rotación debe afectar visualmente la plataforma y puede transmitir un pequeño movimiento al personaje mientras está encima.

## Engranajes explosivos
- Color distintivo.
- Dinamita/mecha visibles.
- Al aterrizar: fuse = 5 s.
- Animar mecha y chispas durante la cuenta.
- Al 0: explosión, partículas, destrucción del engranaje y caída del jugador si estaba encima.
- La explosión quita 0.5 corazón.
- Debe ser claramente avisada visualmente.

## Coleccionables
Principal: rayo de energía ⚡.
- +25 puntos.
- Destello + partículas al recoger.
Bonificaciones:
- estrella +100
- diamante +50
- corazón +0.5 corazón si no está lleno
- imán: atrae rayos durante un tiempo corto
- reloj: ralentiza temporalmente determinados peligros
El sistema debe ser modular.

## Puntuación
- Cada salto/aterrizaje exitoso: +10.
- Rayo: +25.
- Bonus según valor.
- La puntuación de partida empieza siempre en 0.
- El mejor resultado se guarda en localStorage.
- Guardar al menos bestScore y bestHeight.

## Vida
- 3 corazones = 6 medios corazones.
- Cada caída = -0.5 corazón.
- Al perder los seis medios corazones: GAME OVER.
- Después de una caída con vida restante, reiniciar desde un punto seguro cercano, no necesariamente desde el inicio.

## Lava
- Ocupa aproximadamente el 10% inferior de la pantalla visible.
- Movimiento animado.
- La lava asciende junto con el progreso.
- La cámara sigue al personaje mientras sube.
- El jugador debe sentirse presionado a continuar ascendiendo.
- Caer en lava = daño/caída y, si corresponde, GAME OVER al llegar a 0 vida.

## Cámara
Cámara vertical suave.
Cuando el personaje alcanza una zona superior de la viewport, mover el mundo hacia arriba.
Generar/cargar nuevos engranajes arriba y retirar de memoria los segmentos muy lejanos cuando sea apropiado.
Mantener al personaje en una zona visible y cómoda.

## Demo de 5 pantallas
- Pantalla 1: ~30 saltos, tutorial natural, engranajes grandes y lentos.
- Pantalla 2: ~40 saltos, más movimiento y separación.
- Pantalla 3: ~50 saltos, más pequeños, rápidos y explosivos.
- Pantalla 4: ~50 saltos, combinaciones exigentes.
- Pantalla 5: desafío final combinando mecánicas.
Estas cifras representan la cantidad aproximada de secuencias/oportunidades de ascenso del segmento.

## Generación procedural
Debe existir un generador controlado por dificultad.
Regla absoluta: NUNCA generar un salto imposible.
Antes de aceptar un engranaje validar:
- distancia horizontal
- distancia vertical
- velocidad de salto
- altura máxima
- radio útil del engranaje
- zona de agarre
- tiempo de vuelo
Si no es alcanzable, descartar y regenerar.

## HUD
HUD superior grande y legible:
- corazones
- PUNTAJE
- ALTURA
- opcional: MEJOR PUNTAJE
No utilizar texto diminuto.
Debe ser legible en móvil.

## Menú
Portada con:
GEAR RUSH
(Comercial Jarros)
(En honor a Violenti)
Botones:
- JUGAR
- CÓMO JUGAR
- MAYOR PUNTAJE

Fondo de fábrica animado sutilmente:
cadenas, engranajes, tuberías, humo, vapor, hornos, luces y maquinaria.

## Game Over
Mostrar:
- GAME OVER
- PUNTAJE
- ALTURA
- MAYOR PUNTAJE
Botones:
- JUGAR DE NUEVO
- MENÚ
Si hubo récord:
- NUEVO RÉCORD

## Persistencia
Usar localStorage.
Nueva partida:
score=0, hearts=3, height=0.
El récord NO se reinicia al comenzar una partida.
Persistir entre recargas mientras el navegador mantenga el almacenamiento.

## Pixel art
Todo debe compartir:
- escala de píxel consistente
- contornos consistentes
- iluminación consistente
- paleta coherente
- misma perspectiva
- mismo nivel de detalle

No mezclar estilos de IA diferentes.

## Rendimiento
Usar requestAnimationFrame.
No usar React state para cada frame.
Separar render loop y UI.
Evitar miles de nodos DOM.
Mantener partículas y entidades bajo control.

## Estados globales
MENU
HOW_TO_PLAY
HIGH_SCORE
PLAYING
PAUSED
GAME_OVER
VICTORY

## Orden de implementación
1. proyecto y viewport
2. player temporal
3. gravedad
4. salto en tres direcciones
5. engranajes temporales
6. colisiones
7. agarre
8. subida
9. cámara
10. lava
11. vidas
12. score
13. generación
14. menú
15. game over
16. localStorage
17. explosivos
18. coleccionables
19. bonificaciones
20. sprites definitivos
21. partículas
22. sonido
23. pruebas
24. optimización

## Criterio de éxito del demo
Debe:
- iniciar desde menú;
- permitir los tres gestos;
- mover al personaje con física;
- hacer que los engranajes giren;
- permitir agarre y subida;
- desplazar la cámara;
- mantener lava;
- descontar medio corazón por caída;
- sumar puntos;
- recoger rayos/bonus;
- manejar explosivos de 5 s;
- mostrar Game Over;
- persistir récord;
- funcionar en móvil y PC;
- completar build sin errores.
