import { World, System, Component, TagComponent, Types } from "https://ecsy.io/build/ecsy.module.js";

    const angle= Math.PI * 2
    const canvas = document.querySelector("canvas");
    const canvasWidth = canvas.width = window.innerWidth;
    const canvasHeight = canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    // Velocity component
    class Velocity extends Component {}

    Velocity.schema = {
      x: { type: Types.Number },
      y: { type: Types.Number }
    };
    // Position component
    class Position extends Component {}

    Position.schema = {
      x: { type: Types.Number },
      y: { type: Types.Number }
    };
    // Size component
    class Size extends Component {}

    Size.schema = {
      value: { type: Types.Number }
    };
    
    // LiveTime component
    class LiveTime extends Component {}

    LiveTime.schema = {
      liveTime: { type: Types.Number }
    };
    
    // Shape component
    class Shape extends Component {}

    Shape.schema = {
      primitive: { type: Types.String, default: 'box' }
    };
    
    // Renderable component
    class Renderable extends TagComponent {}
    
    // MovableSystem
    class MovableSystem extends System {
        execute(delta, time) {
                this.queries.moving.results.forEach(entity => {
                const velocity = entity.getComponent(Velocity);
                const {liveTime} = entity.getMutableComponent(LiveTime);
                let position = entity.getMutableComponent(Position);
                position.x += velocity.x
                position.y += velocity.y
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    entity.removeAllComponents()
                }, liveTime);
            });
        }
    }

    MovableSystem.queries = {
        moving: {
            components: [Velocity, Position, LiveTime]
        }
    }



    class RendererSystem extends System {
        execute(delta, time) {
          
            ctx.fillStyle = "#d4d4d4";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Iterate through all the entities on the query
            this.queries.renderables.results.forEach(entity => {
              const {primitive} = entity.getComponent(Shape);
              const {value} = entity.getComponent(Size);
              const {x, y} = entity.getComponent(Position);
              if (primitive === 'box') {
                this.reateRect(x, y, value);
              } else {
                this.createСircle(x, y, value);
              }
            });
        }
        createСircle (x, y, size) {
            ctx.beginPath();
            ctx.arc(x, y, size, angle, false);
            ctx.fillStyle = "rgba(90, 90, 84, 0.4)";
            ctx.fill();
            ctx.strokeStyle='rgba(90, 90, 84, 1)';
            ctx.stroke();
        }
        reateRect (x, y, size) {
            ctx.beginPath();
            ctx.rect(x-30, y, size, size);
            ctx.strokeStyle='rgba(232, 37, 6, 1)';
            ctx.stroke();
            ctx.fillStyle = 'rgba(232, 37, 6, 0.5)';
            ctx.fill();
            
        }
    }
    RendererSystem.queries = {
        renderables: { components: [Renderable, Shape, Position] }
      }



    var world = new World();
    world
      .registerComponent(Velocity)
      .registerComponent(Position)
      .registerComponent(LiveTime)
      .registerComponent(Size)
      .registerComponent(Shape)
      .registerComponent(Renderable)
      .registerSystem(MovableSystem)
      .registerSystem(RendererSystem);


    function getRandomVelocity() {
        return {
          x: ((Math.random() < 0.5) ? -1 : 1) * (Math.floor(Math.random() * (5 - 1 + 1)) + 1), 
          y: ((Math.random() < 0.5) ? -1 : 1) * (Math.floor(Math.random() * (5 - 1 + 1)) + 1)
        };
      }
      
    function getRandomShape() {
        return {
          primitive: Math.random() >= 0.5 ? 'circle' : 'box'
        };
    }

    function getRandomSize() {
      return {
        value: Math.floor(Math.random() * (25 - 5 + 5)) + 1
      };
    }
    function getRandomTime() {
      return {
        liveTime: (Math.floor(Math.random() * (5 - 1 + 1)) + 1) * 1000
      };
    }
      
      
    canvas.onclick = (e) => {
        for (let i = 0; i < 39; i++) {
            world
            .createEntity()
            .addComponent(Velocity, getRandomVelocity())
            .addComponent(Shape, getRandomShape())
            .addComponent(Position, {x: e.offsetX, y: e.offsetY})
            .addComponent(Size, getRandomSize())
            .addComponent(LiveTime, getRandomTime())
            .addComponent(Renderable)
        }
    }
      

    function run() {
    // Compute delta and elapsed time
    var time = performance.now();
    var delta = time - lastTime;

    // Run all the systems
    world.execute(delta, time);

    lastTime = time;
    requestAnimationFrame(run);
    }

    var lastTime = performance.now();
    run();   
