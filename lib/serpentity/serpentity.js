require("neon");

/*
Serpentity is a simple entity framework inspired by Ash.

Usage:

    require('serpentity');

## Instantiating an engine

    var engine = Serpentity();

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

    var entity = new Serpentity.Entity();

All the behavior is added through components

## Creating Components

Components define data that we can add to an entity. This data will
eventually be consumed by "Systems"

    Class("PositionComponent").inherits(Serpentity.Component)({
        prototype : {
            x : 0,
            y : 0
        }
    });

You can add components to entities by using the add method:

    entity.add(new PositionComponent());


Systems can refer to entities by requesting nodes.

## Working with Nodes

Nodes are sets of components that you define, so your system can require
entities that always follow the API defined in the node.

    Class("MovementNode").inherits(Serpentity.Node)({
        types : {
            position : PositionComponent,
            motion : MotionComponent
        }
    });

You can then request an array of all the nodes representing entities
that comply with that API

    engine.getNodes(MovementNode);

## Creating Systems

Systems are called on every update, and they use components through nodes.

    Class("TestSystem").inherits(Serpentity.System)({
        prototype : {
            added : function added(engine){
                this.nodeList = engine.getNodes(MovementNode);
            },
            removed : function removed(engine){
                this.nodeList = undefined;
            }
            update : function update(dt){
                this.nodeList.forEach(function (node) {
                    console.log("Current position is: " + node.position.x + "," + node.position.y);
                });
            }
        }
    });

## That's it

Just run `engine.update(dt)` in your game loop :D

*/
Class("Serpentity")({
    prototype : {
        systems : null,
        nodeCollections : null,
        entities : null,

        init : function init(config) {
            var property;

            config = config || {};

            this.systems = [];
            this.entities = [];
            this.nodeCollections = {};

            for (property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }
        },

        /*
         * Adds a system to the engine, so its update method will be called
         * with the others. Triggers added hook.
         *
         * returns true if added succesfully, false if already added
         */
        addSystem : function addSystem(system, priority) {
            var lastIndex, found;

            if (this.systems.indexOf(system) >= 0) {
                return false;
            }

            system.priority = priority;

            found = false;
            lastIndex = 0;

            this.systems.some(function findPriority(existingSystem, i) {
                lastIndex = i;
                if (existingSystem.priority >= system.priority) {
                    found = true;
                    return true;
                }
            });

            if (!found) {
              lastIndex += 1
            }

            this.systems.splice(lastIndex, 0, system);
            system.added(this);
            return true;
        },

        /*
         * Removes a system from the engine, so its update method will no
         * longer will be called. Triggers the removed hook.
         *
         * returns true if removed succesfully, false if already added
         */
        removeSystem : function removeSystem(system) {
            var position;

            position = this.systems.indexOf(system);
            if (position >= 0) {
              this.systems[position].removed(this);
              this.systems.splice(position, 1);
              return true;
            }

            return false;
        },

        /*
         * Adds an entity to the engine, adds to existing node collections
         *
         * returns true if added, false if already there
         */
        addEntity : function addEntity(entity) {
            var property;

            if (this.entities.indexOf(entity) >= 0) {
                return false;
            }
            this.entities.push(entity);

            for (property in this.nodeCollections) {
                if (this.nodeCollections.hasOwnProperty(property)) {
                    this.nodeCollections[property].add(entity);
                }
            }
            return true;
        },

        /*
         * Removes entity from system, removing from all node collections
         *
         * returns true if removed, false if not present
         */
        removeEntity : function removeEntity(entity) {
            var position;

            position = this.entities.indexOf(entity);
            if (position >= 0) {
                for (property in this.nodeCollections) {
                    if (this.nodeCollections.hasOwnProperty(property)) {
                        this.nodeCollections[property].remove(entity);
                    }
                }

                this.entities.splice(position, 1);
                return true;
            }

            return false;
        },

        /*
         * Given a Node Class, retrieves a list of all the nodes for each
         * applicable entity.
         */
         getNodes : function getNodes(nodeType) {
            var nodeCollection;

            if (this.nodeCollections.hasOwnProperty(nodeType)) {
                return this.nodeCollections[nodeType].nodes;
            }

            nodeCollection = new Serpentity.NodeCollection({
                type : nodeType,
            });
            this.nodeCollections[nodeType] = nodeCollection;

            this.entities.forEach(function (entity) {
                nodeCollection.add(entity);
            });

            return nodeCollection.nodes;
         },

         /*
         * Calls update for every loaded system.
         */
         update : function update(dt) {
            this.systems.forEach(function (system) {
                system.update(dt);
            });
         }
    }
});

require("./component.js");
require("./entity.js");
require("./node.js");
require("./node_collection.js");
require("./system.js");
