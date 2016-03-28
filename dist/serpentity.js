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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Serpentity = function () {
  function Serpentity(config) {
    _classCallCheck(this, Serpentity);

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


  _createClass(Serpentity, [{
    key: 'addSystem',
    value: function addSystem(system, priority) {
      var lastIndex = void 0,
          found = void 0;

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

  }, {
    key: 'removeSystem',
    value: function removeSystem(system) {
      var position = void 0;

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

  }, {
    key: 'addEntity',
    value: function addEntity(entity) {
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

  }, {
    key: 'removeEntity',
    value: function removeEntity(entity) {
      var position = void 0;

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

  }, {
    key: 'getNodes',
    value: function getNodes(nodeType) {
      var position = void 0,
          nodeCollection = void 0;

      position = this._nodeCollectionKeys.indexOf(nodeType);

      if (position >= 0) {
        return this._nodeCollections[position].nodes;
      }

      nodeCollection = new Serpentity.NodeCollection({
        type: nodeType
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

  }, {
    key: 'update',
    value: function update(dt) {
      this.systems.forEach(function (system) {
        system.update(dt);
      });
    }
  }]);

  return Serpentity;
}();

// Add namespaced objects.
if (typeof module !== 'undefined' && undefined.module !== module) {
  Serpentity.Component = require('./serpentity/component.js');
  Serpentity.Entity = require('./serpentity/entity.js');
  Serpentity.Node = require('./serpentity/node.js');
  Serpentity.NodeCollection = require('./serpentity/node_collection.js');
  Serpentity.System = require('./serpentity/system.js');

  module.exports = Serpentity;
}
'use strict';

/* global Serpentity */

/*
 * The entity gives the entity framework its name. It exists only
 * to hold components.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entity = function () {
  function Entity(config) {
    _classCallCheck(this, Entity);

    this._componentKeys = [];
    this._components = [];

    Object.assign(this, config || {});
  }

  /*
   * Adds a component to the entity.
   *
   * returns true if added, false if already present
   */


  _createClass(Entity, [{
    key: 'addComponent',
    value: function addComponent(component) {
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

  }, {
    key: 'hasComponent',
    value: function hasComponent(componentClass) {
      if (this._componentKeys.indexOf(componentClass) >= 0) {
        return true;
      }
      return false;
    }

    /*
     * returns the component associated with that key
     */

  }, {
    key: 'getComponent',
    value: function getComponent(componentClass) {
      var position = this._componentKeys.indexOf(componentClass);
      if (position >= 0) {
        return this._components[position];
      }
    }
  }]);

  return Entity;
}();

if (typeof module !== 'undefined' && undefined.module !== module) {
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
  _createClass(Node, null, [{
    key: 'matches',


    /*
     * Returns true if the given entity matches the defined protocol,
     * false otherwise
     */
    value: function matches(entity) {
      var types = this.types;

      for (var typeName in types) {
        if (types.hasOwnProperty(typeName)) {

          var matched = false;
          var type = types[typeName];

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
  }]);

  function Node(config) {
    _classCallCheck(this, Node);

    this.types = {};

    Object.assign(this, config || {});
  }

  return Node;
}();

if (typeof module !== 'undefined' && undefined.module !== module) {
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NodeCollection = function () {
  function NodeCollection(config) {
    _classCallCheck(this, NodeCollection);

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


  _createClass(NodeCollection, [{
    key: 'add',
    value: function add(entity) {

      if (this.type.matches(entity) && !this._entityExists(entity)) {

        var node = new this.type({});
        var types = this.type.types;

        node.entity = entity;

        for (var typeName in types) {
          if (types.hasOwnProperty(typeName)) {
            node[typeName] = entity.getComponent(types[typeName]);
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

  }, {
    key: 'remove',
    value: function remove(entity) {
      var found = -1;

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

  }, {
    key: '_entityExists',
    value: function _entityExists(entity) {
      var found = false;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;

          if (node.entity === entity) {
            found = true;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return found;
    }
  }]);

  return NodeCollection;
}();

if (typeof module !== 'undefined' && undefined.module !== module) {
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function Component(config) {
  _classCallCheck(this, Component);

  Object.assign(this, config || {});
};

if (typeof module !== 'undefined' && undefined.module !== module) {
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var System = function () {
  function System() {
    _classCallCheck(this, System);
  }

  _createClass(System, [{
    key: 'added',


    /*
     * This will be run when the system is added to the engine
     */
    value: function added() {}
    // Override with added(engine)
    // Receives an instance of the serpentity engine


    /*
     * This will be run when the system is removed from the engine
     */

  }, {
    key: 'removed',
    value: function removed() {}
    // Override with removed(engine)
    // Receives an instance of the serpentity engine


    /*
     * This will run every time the engine's update method is called
     */

  }, {
    key: 'update',
    value: function update() {
      // Override with update(dt)
      // Receives a delta of the time
    }
  }]);

  return System;
}();

if (typeof module !== 'undefined' && undefined.module !== module) {
  module.exports = System;
} else {
  Serpentity.System = System;
}