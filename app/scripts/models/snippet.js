/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var SnippetModel = Backbone.Model.extend({
        //The API endpoint used for saving and retrieving snippets
        urlRoot: '/api/snippet',
        //defaults
        defaults: {
            title: '',
            code: '',
            saved: false
        },
        //validations
        validate: function(attrs, options) {
            //validate() is called before save(), so this would be a good place to check whether
            //any changes have been made to the model since it was fetched
            if(attrs.snapshot !== void 0 && attrs.snapshot !== null) {
                if(attrs.title === attrs.snapshot.title && attrs.code === attrs.snapshot.code) {
                    return 'ENOCHANGE';
                }
            }
            if(attrs.code.trim() === '') {
                return 'EBLANK';
            }
        }
    });

    return SnippetModel;
});
