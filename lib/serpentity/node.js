/*
 * A node describes a set of components in order to describe entities
 * that include them.
 */
Class(Serpentity, "Node")({

    /*
     * Returns true if the given entity matches the defined protocol,
     * false otherwise
     */
    matches : function matches(entity) {
            var property, matched, types;

            types = this.types;

            for (property in this.types) {

                if (this.types.hasOwnProperty(property)) {
                    matched = false;

                    if (entity.hasComponent(types[property])) {
                        matched = true;
                    }

                    if (!matched) {
                        return false;
                    }
                }
            }

            return true;
    },

    prototype : {

        types : null,

        init : function (config) {
            var property;

            this.types = {};

            for (property in this.constructor) {
                if (this.constructor.hasOwnProperty(property)) {
                    this.types[property] = this.constructor[property];
                }
            }
        }
    }
});
