'use strict';

/*
Serpentity is a simple entity framework inspired by Ash.

Usage:

    let Serpentity = require('serpentity');

## Instantiating an engine

    let engine = Serpentity();

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

    let entity = new Serpentity.Entity();

All the behavior is added through components

## Creating Components

Components define data that we can add to an entity. This data will
eventually be consumed by "Systems"

    let PositionComponent = class PositionComponent extends Serpentity.Component {
      constructor (config) {
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

    let MovementNode = class MovementNode extends Serpentity.Node;
    MovementNode.position = PositionComponent;
    MovementNode.motion = MotionComponent;

You can then request an array of all the nodes representing entities
that comply with that API

    engine.getNodes(MovementNode);

## Creating Systems

Systems are called on every update, and they use components through nodes.

    let TestSystem = class TestSystem extends Serpentity.System {
      added (engine){
        this.nodeList = engine.getNodes(MovementNode);
      },
      removed (engine){
        this.nodeList = undefined;
      }
      update (dt){
        let node;
        for (node of this.nodeList) {
          console.log(`Current position is: ${node.position.x},${node.position.y}`);
        }
      }
    };

## That's it

Just run `engine.update(dt)` in your game loop :D

*/
let Serpentity = class Serpentity {

  constructor (config) {
    this.systems = [];
    this.entities = [];
    this._nodeCollections = [];
    this._nodeCollectionKeys = [];

    Object.assign(this, config || {});
  }

  /*
   * Adds a system to the engine, so its update method will be called
   * with the others. Triggers added hook.
   *
   * returns true if added succesfully, false if already added
   */
  addSystem (system, priority) {
    let lastIndex, found;

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
      lastIndex += 1;
    }

    this.systems.splice(lastIndex, 0, system);
    system.added(this);
    return true;
  }

  /*
   * Removes a system from the engine, so its update method will no
   * longer will be called. Triggers the removed hook.
   *
   * returns true if removed succesfully, false if already added
   */
  removeSystem (system) {
    let position;

    position = this.systems.indexOf(system);
    if (position >= 0) {
      this.systems[position].removed(this);
      this.systems.splice(position, 1);
      return true;
    }

    return false;
  }

  /*
   * Adds an entity to the engine, adds to existing node collections
   *
   * returns true if added, false if already there
   */
  addEntity (entity) {
    if (this.entities.indexOf(entity) >= 0) {
      return false;
    }
    this.entities.push(entity);

    this._nodeCollections.forEach(function (collection) {
      collection.add(entity);
    });

    return true;
  }

  /*
   * Removes entity from system, removing from all node collections
   *
   * returns true if removed, false if not present
   */
  removeEntity (entity) {
    let position;

    position = this.entities.indexOf(entity);
    if (position >= 0) {
      this._nodeCollections.forEach(function (collection) {
        collection.remove(entity);
      });

      this.entities.splice(position, 1);
      return true;
    }

    return false;
  }

  /*
   * Given a Node Class, retrieves a list of all the nodes for each
   * applicable entity.
   */
  getNodes (nodeType) {
    let position, nodeCollection;

    position = this._nodeCollectionKeys.indexOf(nodeType);

    if (position >= 0) {
      return this._nodeCollections[position].nodes;
    }

    nodeCollection = new Serpentity.NodeCollection({
      type : nodeType
    });

    this._nodeCollectionKeys.push(nodeType);
    this._nodeCollections.push(nodeCollection);

    this.entities.forEach(function (entity) {
      nodeCollection.add(entity);
    });

    return nodeCollection.nodes;
  }

  /*
   * Calls update for every loaded system.
   */
  update (dt) {
    this.systems.forEach(function (system) {
      system.update(dt);
    });
  }
};

// Add namespaced objects.
if (typeof module !== 'undefined' && this.module !== module) {
  Serpentity.Component = require('./serpentity/component.js');
  Serpentity.Entity = require('./serpentity/entity.js');
  Serpentity.Node = require('./serpentity/node.js');
  Serpentity.NodeCollection = require('./serpentity/node_collection.js');
  Serpentity.System = require('./serpentity/system.js');

  module.exports = Serpentity;
} else {
  window.Serpentity = Serpentity;
}

'use strict';

/* global Serpentity */

/*
 * The entity gives the entity framework its name. It exists only
 * to hold components.
 */

let Entity = class Entity {
  constructor (config) {
    this._componentKeys = [];
    this._components = [];

    Object.assign(this, config || {});
  }

  /*
   * Adds a component to the entity.
   *
   * returns true if added, false if already present
   */
  addComponent (component) {
    if (this._componentKeys.indexOf(component.constructor) >= 0) {
      return false;
    }
    this._componentKeys.push(component.constructor);
    this._components.push(component);
    return true;
  }

  /*
   * returns true if component is included, false otherwise
   */
  hasComponent (componentClass) {
    if (this._componentKeys.indexOf(componentClass) >= 0) {
      return true;
    }
    return false;
  }

  /*
   * returns the component associated with that key
   */
  getComponent (componentClass) {
    let position;
    position = this._componentKeys.indexOf(componentClass);
    if (position >= 0) {
      return this._components[position];
    }
  }
};

if (typeof module !== 'undefined' && this.module !== module) {
  module.exports = Entity;
} else {
  Serpentity.Entity = Entity;
}

'use strict';

/* global Serpentity */

/*
 * A node describes a set of components in order to describe entities
 * that include them.
 */
let Node = class Node {

  /*
   * Returns true if the given entity matches the defined protocol,
   * false otherwise
   */
  static matches (entity) {
    let property, types;

    types = this.types;

    for (property in types) {
      if (types.hasOwnProperty(property)) {
        let matched, type;

        matched = false;
        type = types[property];
        if (entity.hasComponent(type)) {
          matched = true;
        }
        if (!matched) {
          return false;
        }
      }
    }

    return true;
  }

  constructor (config) {
    this.types = {};

    Object.assign(this, config || {});
  }
};

if (typeof module !== 'undefined' && this.module !== module) {
  module.exports = Node;
} else {
  Serpentity.Node = Node;
}

'use strict';

/* global Serpentity */

/*
 * Node Collections contain nodes, in order to keep the lists of nodes
 * that belong to each type.
 *
 * It has a type which is the class name of the node, and an array of
 * instances of that class.
 */

let NodeCollection = class NodeCollection {

  constructor (config) {
    this.nodes = [];
    this.type = null;

    Object.assign(this, config || {});
  }

  /*
   * Creates a node for an entity if it matches, and adds it to the
   * node list.
   *
   * Returns true if added, false otherwise.
   */
  add (entity) {

    if (this.type.matches(entity) && !this._entityExists(entity)) {
      let node, types, property;

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
  }

  /*
   * Removes an entity by removing its related node from the list of nodes
   *
   * returns true if it was removed, false otherwise.
   */
  remove (entity) {
    let found;

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
  }

  /*
   * Checks whether we already have nodes for this entity.
   */
  _entityExists (entity) {
    let found, node;

    found = false;
    for (node of this.nodes) {
      if (node.entity === entity) {
        found = true;
      }
    }

    return found;
  }
};

if (typeof module !== 'undefined' && this.module !== module) {
  module.exports = NodeCollection;
} else {
  Serpentity.NodeCollection = NodeCollection;
}

'use strict';

/* global Serpentity */

/*
 * Components store data. Nothing to say here really, just
 * inherit and add a prototype, or don't even inherit, see?
 * It's just an empty class, so what I'm trying to say is your
 * components can be any class whatsoever.
 */

let Component = class Component {
  constructor (config) {
    Object.assign(this, config || {});
  }
};

if (typeof module !== 'undefined' && this.module !== module) {
  module.exports = Component;
} else {
  Serpentity.Component = Component;
}

'use strict';

/* global Serpentity */

/*
 * Systems contain most of the logic, and work with nodes in order to
 * act and change their values.
 *
 * You usually want to inherit from this class and override the
 * three methods. They are shown here to document the interface.
 */

let System = class System {

  /*
   * This will be run when the system is added to the engine
   */
  added () {
    // Override with added(engine)
    // Receives an instance of the serpentity engine
  }

  /*
   * This will be run when the system is removed from the engine
   */
  removed () {
    // Override with removed(engine)
    // Receives an instance of the serpentity engine
  }

  /*
   * This will run every time the engine's update method is called
   */
  update () {
    // Override with update(dt)
    // Receives a delta of the time
  }
};

if (typeof module !== 'undefined' && this.module !== module) {
  module.exports = System;
} else {
  Serpentity.System = System;
}
