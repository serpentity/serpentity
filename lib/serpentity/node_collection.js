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

      let node = new this.type({});
      let types = this.type.types;

      node.entity = entity;

      for (let typeName in types) {
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
  remove (entity) {
    let found = -1;

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
    let found = false;

    for (let node of this.nodes) {
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
