if (typeof require !== "undefined") {
    require("neon");
}

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

    entity.addComponent(new PositionComponent());


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
        entities : null,
        _nodeCollections : null,
        _nodeCollectionKeys : null,

        init : function init(config) {
            var property;

            config = config || {};

            this.systems = [];
            this.entities = [];
            this._nodeCollections = [];
            this._nodeCollectionKeys = [];

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
            if (this.entities.indexOf(entity) >= 0) {
                return false;
            }
            this.entities.push(entity);

            this._nodeCollections.forEach(function (collection) {
                collection.add(entity);
            });

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
                this._nodeCollections.forEach(function (collection) {
                    collection.remove(entity);
                });

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
            var position, nodeCollection;

            position = this._nodeCollectionKeys.indexOf(nodeType);

            if (position >= 0) {
                return this._nodeCollections[position].nodes;
            }

            nodeCollection = new Serpentity.NodeCollection({
                type : nodeType,
            });

            this._nodeCollectionKeys.push(nodeType);
            this._nodeCollections.push(nodeCollection);

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

if (typeof require !== "undefined") {
    require("./component.js");
    require("./entity.js");
    require("./node.js");
    require("./node_collection.js");
    require("./system.js");
}

/*
 * The entity gives the entity framework its name. It exists only
 * to hold components.
 */
Class(Serpentity, "Entity")({
    prototype : {
        _components : null,
        _componentKeys : null,

        init : function init(config) {
            var property;

            this._componentKeys = [];
            this._components = [];

            for (property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }
        },

        /*
         * Adds a component to the entity.
         *
         * returns true if added, false if already present
         */
        addComponent : function addComponent(component) {
            if (this._componentKeys.indexOf(component.constructor) >= 0) {
                return false;
            }
            this._componentKeys.push(component.constructor);
            this._components.push(component);
            return true;
        },

        /*
         * returns true if component is included, false otherwise
         */
        hasComponent : function hasComponent(componentClass) {
            if (this._componentKeys.indexOf(componentClass) >= 0) {
                return true;
            }
            return false;
        },

        /*
         * returns the component associated with that key
         */
         getComponent : function getComponent(componentClass) {
            var position;
            position = this._componentKeys.indexOf(componentClass);
            if (position >= 0) {
                return this._components[position];
            }
         }
    }
});

/*
 * A node describes a set of components in order to describe entities
 * that include them.
 */
Class(Serpentity, "Node")({

    /*
     * Returns true if the given entity matches the defined protocol,
     * false otherwise
     */
    matches : function matches(entity) {
            var property, matched, types;

            types = this.types;

            for (property in this.types) {

                if (this.types.hasOwnProperty(property)) {
                    matched = false;

                    if (entity.hasComponent(types[property])) {
                        matched = true;
                    }

                    if (!matched) {
                        return false;
                    }
                }
            }

            return true;
    },

    prototype : {

        types : null,

        init : function (config) {
            var property;

            this.types = {};

            for (property in this.constructor) {
                if (this.constructor.hasOwnProperty(property)) {
                    this.types[property] = this.constructor[property];
                }
            }
        }
    }
});

/*
 * Node Collections contain nodes, in order to keep the lists of nodes
 * that belong to each type.
 *
 * It has a type which is the class name of the node, and an array of
 * instances of that class.
 */
Class(Serpentity, "NodeCollection")({
    prototype : {
        type : null,
        nodes : null,

        init : function init(config) {
            var property;

            config = config || {};

            this.nodes = [];

            for (property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }
        },

        /*
         * Creates a node for an entity if it matches, and adds it to the
         * node list.
         *
         * Returns true if added, false otherwise.
         */
        add : function add(entity) {
            var node, types, property;

            if (this.type.matches(entity) && !this._entityExists(entity)) {
                node = new this.type({});

                node.entity = entity;

                types = this.type.types;

                for (property in types) {
                  if (types.hasOwnProperty(property)) {
                      node[property] = entity.getComponent(types[property]);
                  }
                }

                this.nodes.push(node);

                return true;
            }

            return false;
        },

        /*
         * Removes an entity by removing its related node from the list of nodes
         *
         * returns true if it was removed, false otherwise.
         */
        remove : function (entity) {
            var found;
            found = -1;
            this.nodes.forEach(function (node, i) {
                if (node.entity === entity) {
                    found = i;
                }
            });

            if (found >= 0) {
                this.nodes.splice(found, 1);
                return true;
            }

            return false;
        },

        /*
         * Checks whether we already have nodes for this entity.
         */
        _entityExists : function entityExists(entity) {
            var found;
            found = false;
            this.nodes.forEach(function (node) {
                if (node.entity === entity) {
                    found = true;
                }
            });

            return found;
        }
    }
});

/*
 * Components store data. Nothing to say here really, just
 * inherit and add a prototype, or don't even inherit, see?
 * It's just an empty class, so what I'm trying to say is your
 * components can be any class whatsoever.
 */
Class(Serpentity, "Component")({
    prototype : {
        init : function init(config) {
            var property;

            config = config || {};

            for (property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }
        }
    }
});

/*
 * Systems contain most of the logic, and work with nodes in order to
 * act and change their values.
 *
 * You usually want to inherit from this class and override the
 * three methods.
 */
Class(Serpentity, "System")({
    prototype : {

        /*
         * This will be run when the system is added to the engine
         */
        added : function added(engine) {
          // Override
        },

        /*
         * This will be run when the system is removed from the engine
         */
        removed : function removed(engine) {
          // Override
        },

        /*
         * This will run every time the engine's update method is called
         */
        update : function update(dt) {
          // Override
        }
    }
});
