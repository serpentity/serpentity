'use strict';

const Events = require('events');

/*
 * Node Collections contain nodes, in order to keep the lists of nodes
 * that belong to each type.
 *
 * It has a type which is the class name of the node, and an array of
 * instances of that class.
 */

const NodeCollection = class NodeCollection extends Events {

  constructor(config) {

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
  add(entity) {

    if (this.type.matches(entity) && !this._entityExists(entity)) {

      const node = new this.type({});
      const types = this.type.types;
      const typeNames = Object.keys(types);

      node.entity = entity;

      for (const typeName of typeNames) {
        node[typeName] = entity.getComponent(types[typeName]);
      }

      this.nodes.push(node);
      this.emit('nodeAdded', { node });

      return true;
    }

    return false;
  }

  /*
   * Removes an entity by removing its related node from the list of nodes
   *
   * returns true if it was removed, false otherwise.
   */
  remove(entity) {

    let foundIndex = -1;

    const found = this.nodes.some((node, i) => {

      if (node.entity === entity) {
        foundIndex = i;
        return true;
      }
    });

    if (found) {
      this.nodes.splice(foundIndex, 1);
      this.emit('nodeRemoved', { node });
    }

    return found;
  }

  /*
   * Checks whether we already have nodes for this entity.
   */
  _entityExists(entity) {

    let found = false;

    for (const node of this.nodes) {
      if (node.entity === entity) {
        found = true;
      }
    }

    return found;
  }
};

module.exports = NodeCollection;
