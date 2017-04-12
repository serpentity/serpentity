# Serpentity

Serpentity is a simple entity framework inspired by [Ash][ash].

Usage:

    const Serpentity = require('serpentity');

## Instantiating an engine

    const engine = new Serpentity();

Add entities or systems, systems are added with a priority (the smaller
the number, the earlier it will be called):

    engine.addEntity(entityFactory());
    engine.addSystem(new GameSystem(), priority);

Update all systems:

    engine.update(dt);

Remove entities or systems:

    engine.removeEntity(entityReference);
    engine.removeSystem(systemReference);

## Creating Entities

Entities are the basic object of Serpentity, and they do nothing.

    const entity = new Serpentity.Entity();

All the behavior is added through components

## Creating Components

Components define data that we can add to an entity. This data will
eventually be consumed by "Systems"

    const PositionComponent = class PositionComponent extends Serpentity.Component {
      constructor(config) {

        this.x = 0;
        this.y = 0;

        super(config);
      }
    };

You can add components to entities by using the add method:

    entity.addComponent(new PositionComponent());


Systems can refer to entities by requesting nodes.

## Working with Nodes

Nodes are sets of components that you define, so your system can require
entities that always follow the API defined in the node.

    const MovementNode = class MovementNode extends Serpentity.Node;
    MovementNode.position = PositionComponent;
    MovementNode.motion = MotionComponent;

You can then request an array of all the nodes representing entities
that comply with that API

    engine.getNodes(MovementNode);

## Creating Systems

Systems are called on every update, and they use components through nodes.

    const TestSystem = class TestSystem extends Serpentity.System {
      added(engine){

        this.nodeList = engine.getNodes(MovementNode);
      }

      removed(engine){

        this.nodeList = undefined;
      }

      update(dt){

        for (const node of this.nodeList) {
          console.log(`Current position is: ${node.position.x},${node.position.y}`);
        }
      }
    };

## That's it

Just run `engine.update(dt)` in your game loop :D

![Travis CI Build Status][travis-ci-badge]

[ash]: http://www.ashframework.org/
[travis-ci-badge]: https://travis-ci.org/serpentity/serpentity.svg?branch=master
