'use strict';

/*
 * A node describes a set of components in order to describe entities
 * that include them.
 */
const Node = class Node {

  /*
   * Returns true if the given entity matches the defined protocol,
   * false otherwise
   */
  static matches(entity) {

    const typeNames = Object.keys(this.types);

    for (const typeName of typeNames) {

      const type = this.types[typeName];
      let matched = false;

      if (entity.hasComponent(type)) {
        matched = true;
      }

      if (!matched) {
        return false;
      }
    }

    return true;
  }

  constructor(config) {

    this.types = {};

    Object.assign(this, config);
  }
};

module.exports = Node;
