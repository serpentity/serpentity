/*
 * The entity gives the entity framework its name. It exists only
 * to hold components.
 */
Class(Serpentity, "Entity")({
    prototype : {
        _components : null,
        _componentKeys : null,

        init : function init(config) {
            var property;

            this._componentKeys = [];
            this._components = [];

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
        addComponent : function addComponent(component) {
            if (this._componentKeys.indexOf(component.constructor) >= 0) {
                return false;
            }
            this._componentKeys.push(component.constructor);
            this._components.push(component);
            return true;
        },

        /*
         * returns true if component is included, false otherwise
         */
        hasComponent : function hasComponent(componentClass) {
            if (this._componentKeys.indexOf(componentClass) >= 0) {
                return true;
            }
            return false;
        },

        /*
         * returns the component associated with that key
         */
         getComponent : function getComponent(componentClass) {
            var position;
            position = this._componentKeys.indexOf(componentClass);
            if (position >= 0) {
                return this._components[position];
            }
         }
    }
});
