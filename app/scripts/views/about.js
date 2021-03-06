/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/about.ejs'
], function ($, _, Backbone, aboutTemplate) {
    'use strict';

    var AboutView = Backbone.View.extend({
        
        template: _.template(aboutTemplate),
        
        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });

    return AboutView;
});
