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


# Entity abstraction

```
class Entity {
    init() {

    }
    loop() {

    }
    kill() {

    }
    constructor() {
    }
}
```