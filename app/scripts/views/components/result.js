/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'mathjax',
    'text!../templates/components/result.ejs'
], function ($, _, Backbone, MathJax, resultTemplate) {
    'use strict';

    var ResultView = Backbone.View.extend({
        
        template: _.template(resultTemplate),
        
        initialize: function() {
            this.model.on('change', this.render, this);
            //Render the result panel here, and only update the result in this.render() -- more efficient
            this.$el.html(this.template(this.model.attributes));
        },
        
        render: function() {
            if(MathJax.Hub.getAllJax('math').length > 0) {
                MathJax.Hub.Queue(['Text', MathJax.Hub.getAllJax('math')[0], this.model.get('code')]);
            } else {
                MathJax.Hub.Queue(['Typeset', MathJax.Hub, $('#math')[0]]);
                MathJax.Hub.Queue(['Update', MathJax.Hub]);
            }
            return this;
        }
    });

    return ResultView;
});
