# Countable Homepage

I'm going to model the world as a series of entities moving around an origin point.
```
entity: {
    origin
    init()
    loop()
    kill()
}
```

This allows us to manage memory by modeling the whole thing as essentially an expanded starfield. So instead of moving the user through a giant box, we make things travel towards the user. When the entity enters the loading zone, we run `init()`. Then `loop()` every frame. After it exits the loading zone, we `kill()`.


## Entity abstraction

```
class Entity {
    var state; // alive, dormant, or dead
    init() { }
    loop() { }
    kill() { }
    constructor() { }
}
```

## Entity lifecycle
```
/* inside the script file */
init() {
    // 
    entities.push(new Entity());
}
loop() {
    for(entity in entities) {
        if(/* entity alive */) {
            if(/* entity just left bounding box */) {
                entity.kill();
            } else {
                entity.loop();
            }
        } else if { /* entity dormant */
            if(/* entity about to enter bounding box */) {
                entity.init();
            }
        } else { /* therefore entity killed already */
            /* do nothing */
        }
    }
}

```

## Storyboarding
Purely static: One chamber with 3-6 directions to look at. Each direction has a sort of "main event". There's other things floating around in the space, too.

Experiential: Static, then move through a tunnel in hyperspace, then static again.