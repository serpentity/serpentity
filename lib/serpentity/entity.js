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
    let position = this._componentKeys.indexOf(componentClass);
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
