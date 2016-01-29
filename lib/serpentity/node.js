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
