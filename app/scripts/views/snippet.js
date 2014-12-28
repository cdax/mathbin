/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'mathjax',
    'text!../templates/snippet.ejs',
    '../../bower_components/codemirror/lib/codemirror',
    '../../bower_components/codemirror/mode/stex/stex'
], function ($, _, Backbone, MathJax, snippetTemplate, CodeMirror) {
    'use strict';

    var SnippetView = Backbone.View.extend({
        
        template: _.template(snippetTemplate),
        
        className: "row",
        
        initialize: function(options) {
            this.hold = '';         //backs up CodeMirror input when a user hits the CLEAR button
            //Re-render the view whenever the model changes
            this.renderCount = 0;
            var self = this;
            this.initCodeMirror = _.once(function() {
                console.log('Initializing');
                self.cm = CodeMirror.fromTextArea(self.$el.find('.code-area')[0], {
                    value: self.model.get('code'),
                    lineNumbers: true,
                    mode: 'stex',
                    autofocus: true,
                    lineWrapping: true
                });
                self.cm.setValue(self.model.get('code'));
            });
            this.refreshCodeMirror = function() {
                this.cm.refresh();
                this.cm.focus();
            };
            
            var self = this;  
            this.model.on('invalid', function(model, error) {
                //If there were no changes to the model since the last fetch,
                //tell the user the snippet's already saved
                if(error === 'ENOCHANGE') {
                    console.log('invalid');
                    self.$el.find('.modal.saved').modal('show');
                    //Hide the modal after a second.
                    setTimeout(function() {
                        self.$el.find('.modal.saved').modal('hide');
                    }, 1000);
                }
            });
            this.model.on('request', function() {
                self.$el.find('.modal.saving').modal('show');
            });
            this.model.on('saved', function() {
                self.$el.find('.modal.saving').modal('hide');
                self.$el.find('.modal.saved').modal('show');
                //Hide the modal after a second.
                setTimeout(function() {
                    self.$el.find('.modal.saved').modal('hide');
                }, 1000);
            });
            this.model.on('error', function() {
                self.$el.find('.modal.saving').modal('hide');
                self.$el.find('.modal.error').modal('show');
                //Hide the modal after a second.
                setTimeout(function() {
                    self.$el.find('.modal.error').modal('hide');
                }, 2000);
            });
        },
        
        events: {
            'click .button-run': 'updateResult',
            'click .button-clear': 'clear',
            'click .button-undo-clear': 'undoClear',
            'click .button-save': 'save'
        },
        
        render: function() {
            //Update the reference to the ElementJax
            console.log(this.model.attributes);
            this.$el.html(this.template(this.model.attributes));
            this.$el.find('input.title').val(this.model.get('title'));
            this.initCodeMirror();
            return this;
        },
        
        //Updates the result's ElementJax
        updateResult: function() {
            this.model.set('code', this.cm.getValue(), {silent: true});
            this.$math = this.$el.find('.math');
            if(MathJax.Hub.getAllJax(this.$math[0]).length > 0) {
                console.log('if');
                //If the ElementJax has already been typeset, just update it
                MathJax.Hub.Queue(['Text', MathJax.Hub.getAllJax(this.$math[0])[0], this.model.get('code')]);
            } else {
                console.log('else');
                this.$math.children('.mathjax').text(this.model.get('code'));
                //Otherwise, typeset the ElementJax
                MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.$math[0]]);
                //TODO: Is this Update really necessary?
                //MathJax.Hub.Queue(['Text', MathJax.Hub.getAllJax(this.$math)[0], this.model.get('code')]);
            }
        },
        
        clear: function(event) {
            //Get un-saved code from the CodeMirror
            this.hold = this.cm.getValue();
            //If the CodeMirror was empty, do nothing
            if(this.hold !== '') {
                //If the CodeMirror was not empty, reset the model and set the CLEAR/UNDO button to UNDO
                this.model.set('code', '', {silent: true});
                this.cm.setValue('');
                var $buttonClear = this.$el.find('.button-clear');
                $buttonClear
                    .html('<i class="fa fa-undo"></i>&nbsp;UNDO CLEAR')
                    .removeClass('button-clear')
                    .addClass('button-undo-clear');
            }
            //Return focus to the CodeMirror
            this.cm.focus();
        },
        
        undoClear: function(event) {
            //If a value was previously saved, restore it to the model
            if(this.hold) {
                this.model.set('code', this.hold, {silent: true});
                this.cm.setValue(this.hold);
            }
            //Set the CLEAR/UNDO button to CLEAR
            var $buttonUndoClear = this.$el.find('.button-undo-clear');
            $buttonUndoClear
                .html('<i class="fa fa-times"></i>&nbsp;CLEAR')
                .removeClass('button-undo-clear')
                .addClass('button-clear');
            //Return focus to the CodeMirror
            this.cm.focus();
        },
        
        save: function() {
            this.model.set('title', this.$el.find('input.title').val(), {silent: true});
            this.model.set('code', this.cm.getValue());
            this.model.save({}, {
                success: function(model) {
                    model.trigger('saved', model);
                }
            });
        }
    });

    return SnippetView;
});
