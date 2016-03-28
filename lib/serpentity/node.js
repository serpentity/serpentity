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
    let types = this.types;

    for (let typeName in types) {
      if (types.hasOwnProperty(typeName)) {

        let matched = false;
        let type = types[typeName];

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
