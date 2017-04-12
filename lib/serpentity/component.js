'use strict';

/*
 * Components store data. Nothing to say here really, just
 * inherit and add a prototype, or don't even inherit, see?
 * It's just an empty class, so what I'm trying to say is your
 * components can be any class whatsoever.
 */

const Component = class Component {
  constructor(config) {

    Object.assign(this, config);
  }
};

module.exports = Component;
