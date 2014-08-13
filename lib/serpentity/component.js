/*
 * Components store data. Nothing to say here really, just
 * inherit and add a prototype, or don't even inherit, see?
 * It's just an empty class, so what I'm trying to say is your
 * components can be any class whatsoever.
 */
Class(Serpentity, "Component")({
    prototype : {
        init : function init(config) {
            var property;

            config = config || {};

            for (property in config) {
                if (config.hasOwnProperty(property)) {
                    this[property] = config[property];
                }
            }
        }
    }
});
