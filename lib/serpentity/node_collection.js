/*
 * Node Collections contain nodes, in order to keep the lists of nodes
 * that belong to each type.
 *
 * It has a type which is the class name of the node, and an array of
 * instances of that class.
 */
Class(Serpentity, "NodeCollection")({
    prototype : {
        type : null,
        nodes : null,

        init : function init(config) {
            var property;

            config = config || {};

            this.nodes = [];

            for (property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }
        },

        /*
         * Creates a node for an entity if it matches, and adds it to the
         * node list.
         *
         * Returns true if added, false otherwise.
         */
        add : function add(entity) {
            var node, types, property;

            if (this.type.matches(entity) && !this._entityExists(entity)) {
                node = new this.type({});

                node.entity = entity;

                types = this.type.types;

                for (property in types) {
                  if (types.hasOwnProperty(property)) {
                      node[property] = entity.getComponent(types[property]);
                  }
                }

                this.nodes.push(node);

                return true;
            }

            return false;
        },

        /*
         * Removes an entity by removing its related node from the list of nodes
         *
         * returns true if it was removed, false otherwise.
         */
        remove : function (entity) {
            var found;
            found = -1;
            this.nodes.forEach(function (node, i) {
                if (node.entity === entity) {
                    found = i;
                }
            });

            if (found >= 0) {
                this.nodes.splice(found, 1);
                return true;
            }

            return false;
        },

        /*
         * Checks whether we already have nodes for this entity.
         */
        _entityExists : function entityExists(entity) {
            var found;
            found = false;
            this.nodes.forEach(function (node) {
                if (node.entity === entity) {
                    found = true;
                }
            });

            return found;
        }
    }
});
