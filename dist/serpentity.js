(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Serpentity"] = factory();
	else
		root["Serpentity"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Components store data. Nothing to say here really, just
 * inherit and add a prototype, or don't even inherit, see?
 * It's just an empty class, so what I'm trying to say is your
 * components can be any class whatsoever.
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function Component(config) {
  _classCallCheck(this, Component);

  Object.assign(this, config);
};

module.exports = Component;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

    Object.assign(this, config);
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

module.exports = Entity;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

      var typeNames = Object.keys(this.types);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = typeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var typeName = _step.value;


          var type = this.types[typeName];
          var matched = false;

          if (entity.hasComponent(type)) {
            matched = true;
          }

          if (!matched) {
            return false;
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

      return true;
    }
  }]);

  function Node(config) {
    _classCallCheck(this, Node);

    this.types = {};

    Object.assign(this, config);
  }

  return Node;
}();

module.exports = Node;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

    Object.assign(this, config);
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
        var typeNames = Object.keys(types);

        node.entity = entity;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = typeNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var typeName = _step.value;

            node[typeName] = entity.getComponent(types[typeName]);
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

      var foundIndex = -1;

      var found = this.nodes.some(function (node, i) {

        if (node.entity === entity) {
          foundIndex = i;
          return true;
        }
      });

      if (found) {
        this.nodes.splice(foundIndex, 1);
      }

      return found;
    }

    /*
     * Checks whether we already have nodes for this entity.
     */

  }, {
    key: '_entityExists',
    value: function _entityExists(entity) {

      var found = false;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var node = _step2.value;

          if (node.entity === entity) {
            found = true;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return found;
    }
  }]);

  return NodeCollection;
}();

module.exports = NodeCollection;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

module.exports = System;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
Serpentity is a simple entity framework inspired by Ash.

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

    Object.assign(this, config);
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

      if (this.systems.indexOf(system) >= 0) {
        return false;
      }

      system.priority = priority;

      var lastIndex = 0;

      var found = this.systems.some(function (existingSystem, i) {

        lastIndex = i;
        if (existingSystem.priority >= system.priority) {
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

      var position = this.systems.indexOf(system);
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

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._nodeCollections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var collection = _step.value;

          collection.add(entity);
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

      var position = this.entities.indexOf(entity);
      if (position >= 0) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this._nodeCollections[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var collection = _step2.value;

            collection.remove(entity);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

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

      var position = this._nodeCollectionKeys.indexOf(nodeType);

      if (position >= 0) {
        return this._nodeCollections[position].nodes;
      }

      var nodeCollection = new Serpentity.NodeCollection({
        type: nodeType
      });

      this._nodeCollectionKeys.push(nodeType);
      this._nodeCollections.push(nodeCollection);

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.entities[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var entity = _step3.value;

          nodeCollection.add(entity);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return nodeCollection.nodes;
    }

    /*
     * Calls update for every loaded system.
     */

  }, {
    key: 'update',
    value: function update(dt) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {

        for (var _iterator4 = this.systems[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var system = _step4.value;

          system.update(dt);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
  }]);

  return Serpentity;
}();

// Add namespaced objects.
Serpentity.Component = __webpack_require__(0);
Serpentity.Entity = __webpack_require__(1);
Serpentity.Node = __webpack_require__(2);
Serpentity.NodeCollection = __webpack_require__(3);
Serpentity.System = __webpack_require__(4);

module.exports = Serpentity;

/***/ })
/******/ ]);
});