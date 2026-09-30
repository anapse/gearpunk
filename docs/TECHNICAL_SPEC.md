# GEAR RUSH — TECHNICAL SPEC

## Logical viewport
VIEW_WIDTH = 480
VIEW_HEIGHT = 800

## Main loop
INPUT -> UPDATE -> COLLISION -> CAMERA -> LAVA -> EFFECTS -> SCORE -> RENDER

## Player entity
Position, velocity, state, facing, collider, grab state.

## Gear entity
x, y, radius, rotation, rotationSpeed, direction, type, explosive state, fuse timer.

## Collision layers
- player
- gear
- grab zone
- collectible
- lava
- explosion hazard

## Input abstraction
One common action API:
requestJump(direction)
Where direction is LEFT, UP or RIGHT.
Touch and mouse both translate to this API.

## Persistence
localStorage keys should be namespaced:
gearpunk.bestScore
gearpunk.bestHeight
Potential future versioned key:
gearpunk.saveVersion

## Testing
Unit-test:
- swipe classification
- jump direction
- gravity
- collision
- grab
- climb transition
- hearts
- explosive fuse timing
- score
- localStorage
- procedural reachability

## Build
npm run build must pass.
npm run lint must pass when configured.
