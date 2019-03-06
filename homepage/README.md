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

## BCTech Storyboarding

* Hello. Are you enjoying BC Tech?
    - **Yes.** Awesome. We're glad to hear that.
    - **No.** That's unfortunate. Have a free heart, on us.
* **NOTE about the story sequence:** Optional, implement last.
* Would you like to hear a story?
    - **Yes.** _Begin story sequence_ 
    - **No.** Are you sure? We'll skip the story, if you want.
        + **Yes.** _Skip story, go straight to action sequence_
        + **No.** _Go to action sequence_
* **Story sequence.** Once upon a time, there was a business...
* Add some choose your own adventure type stuff
* **END STORY SEQUENCE**
* We are Countable. We build tomorrow's internet, today.
* Would you like to explore the future with us?
    - **Yes.** Awesome. _Begin action sequence._
    - **No.** Well, too bad. You're coming with us anyway.
* **Action sequence.** _Box disappears._ Let's expand our horizons a bit.
* Nod your head if you like lines. Shake your head if you like dots.
    - **Yes.** Spawn in line terrain.
    - **No.** Spawn in particle terrain.
* Sweet. Let's jazz things up. _Add position and color animation._
* Is this jazzy enough for you?
    - **Yes.** _Continue with sequence_
    - **No.** _Add some more animation._ What about now?
        + **Yes.** _Continue with sequence_
        + **No.** _Add some more animation._ What about now?
            * **Yes.** _Continue with sequence_
            * **No.** _Add some more animation._ What about now?
                - **Yes.** _Continue with sequence_
                - **No.** _Add some more animation._
                    + Hmm. That's a bit far, don't you think? _Decrease animation._
* Alright. Now, it's time to explore the future!
* _Spawn sphere._ This is it. This is the future.
* _Time passes._ What are you still here for? That's it. That's the future, right here.
* Just kidding. This is only the beginning. Together, we'll make it something great.
* Do you like spheres?
    - **Yes.** Sure thing.
    - **No.** That's alright. Maybe boxes are more your style. _Turn sphere into box_
* Let's change things up. _Add some chaos to the shape's geometry._
* Is that enough?
    - **Yes.** Sure thing. _Continue with sequence._
    - **No.** _Add some more chaos._ What about now?
        + **Yes.** Sure thing. _Continue with sequence._
        + **No.** _Add some more chaos._ _Continue with sequence._
* Let's give it some color. Shake your head
    - **Head shake.**
    - **Head nod.**
* Let's make it do something.
* Time to fill the sky.
* You can explore as much as you want. (Try nodding your head!)
    * You can shake your head when you are done.
    * **Head nod.** Cause the selected action to occur.
    * **Head shake.** Are you sure you're done?
        - **Yes.** _Complete sequence._
        - **No.** _Go back._
* Here's some stuff we've worked on. Shake your head to browse. Nod your head to exit.
    - **Head nod.** If you'd like more information on what we do, talk to one of our members at the booth. _Exit portfolio_
    - **Head shake.** _Flip between images_
* _Fill the sky with BC Tech motif._ We hope you enjoy the rest of BCTech.
* _Terminate sequence._


## Old Ideas
Purely static: One chamber with 3-6 directions to look at. Each direction has a sort of "main event". There's other things floating around in the space, too.

Experiential: Static, then move through a tunnel in hyperspace, then static again.