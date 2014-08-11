/*
 * The entity gives the entity framework its name. It exists only
 * to hold components.
 */
Class(Serpentity, "Entity")({
    prototype : {
        addedComponents : null,

        init : function init(config) {
            var property;

            this.components = {};

            for (property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }
        },

        /*
         * Adds a component to the entity.
         *
         * returns true if added, false if already present
         */
        add : function add(component) {
            if (this.components.hasOwnProperty(component.constructor)) {
                return false;
            }
            this.components[component.constructor] = component;
            return true;
        },

        /*
         * returns true if component is included, false otherwise
         */
        hasComponent : function hasComponent(componentClass) {
            if (this.components.hasOwnProperty(componentClass)) {
                return true;
            }
            return false;
        }
    }
});
