'use strict';

/*
 * Systems contain most of the logic, and work with nodes in order to
 * act and change their values.
 *
 * You usually want to inherit from this class and override the
 * three methods. They are shown here to document the interface.
 */

const System = class System {

  /*
   * This will be run when the system is added to the engine
   */
  added() {
    // Override with added(engine)
    // Receives an instance of the serpentity engine
  }

  /*
   * This will be run when the system is removed from the engine
   */
  removed() {
    // Override with removed(engine)
    // Receives an instance of the serpentity engine
  }

  /*
   * This will run every time the engine's update method is called
   */
  update() {
    // Override with update(dt)
    // Receives a delta of the time
  }
};

module.exports = System;
