/*
 * Systems contain most of the logic, and work with nodes in order to
 * act and change their values.
 *
 * You usually want to inherit from this class and override the
 * three methods.
 */
Class(Serpentity, "System")({
    prototype : {

        /*
         * This will be run when the system is added to the engine
         */
        added : function added(engine) {
          // Override
        },

        /*
         * This will be run when the system is removed from the engine
         */
        removed : function removed(engine) {
          // Override
        },

        /*
         * This will run every time the engine's update method is called
         */
        update : function update(dt) {
          // Override
        }
    }
});
