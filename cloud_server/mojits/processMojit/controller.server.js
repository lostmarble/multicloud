/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('processMojit', function(Y, NAME) {

/**
 * The processMojit module.
 *
 * @module processMojit
 */

    /**
     * Constructor for the Controller class.
     *
     * @class Controller
     * @constructor
     */
    Y.namespace('mojito.controllers')[NAME] = {

        /**
         * Method corresponding to the 'index' action.
         *
         * @param ac {Object} The ActionContext that provides access
         *        to the Mojito API.
         */
        index: function(ac) {
			ac.done();
        },
		contactus: function(ac){
			ac.done();}
    };

}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'processMojitModelFoo']});
