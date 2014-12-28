/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!../templates/components/editor.ejs',
    '../../../bower_components/codemirror/lib/codemirror',
    '../../../bower_components/codemirror/mode/stex/stex'
], function ($, _, Backbone, editorTemplate, CodeMirror) {
    'use strict';

    var EditorView = Backbone.View.extend({
        
        template: _.template(editorTemplate),
        
        initialize: function(options) {
            this.pristine = true;
            this.hold = '';
        },
        
        events: {
            'click .button-run': 'run',
            'click .button-clear': 'clear',
            'click .button-undo-clear': 'undoClear'
        },
        
        render: function() {
            this.$el.html(this.template(this.model.attributes));
            if(this.pristine) {
                //Initialize the codemirror
                this.cm = CodeMirror.fromTextArea(document.getElementById('code-area'), {
                    value: this.model.get('code'),
                    lineNumbers: true,
                    mode: 'stex',
                    autofocus: true,
                    scrollbarStyle: 'null'
                });
                this.cm.setValue(this.model.get('code'));
                this.pristine = false;
            }
            return this;
        },
        
        run: function(event) {
            this.model.set('code', this.cm.getValue());
        },
        
        clear: function(event) {
            this.hold = this.cm.getValue();
            if(this.hold !== "") {
                var $buttonClear = this.$el.find('.button-clear');
                this.cm.setValue("");
                $buttonClear.html('<i class="fa fa-undo"></i>&nbsp;UNDO');
                $buttonClear.removeClass('button-clear');
                $buttonClear.addClass('button-undo-clear');
                this.cm.focus();
            }
        },
        
        undoClear: function(event) {
            console.log(this.hold);
            if(this.hold) {
                this.cm.setValue(this.hold);
            }
            var $buttonUndoClear = this.$el.find('.button-undo-clear');
            $buttonUndoClear.html('<i class="fa fa-times"></i>&nbsp;CLEAR');
            $buttonUndoClear.removeClass('button-undo-clear');
            $buttonUndoClear.addClass('button-clear');
            this.cm.focus();
        }
    });

    return EditorView;
});
