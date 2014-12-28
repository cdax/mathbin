/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        jquery: {
            exports: '$'
        },
        bootstrapDropdown: {
            deps: [
                'jquery'
            ],
            exports: '$.fn.dropdown'
        },
        bootstrapCollapse: {
            deps: [
                'jquery'
            ],
            exports: '$.fn.collapse'
        },
        bootstrapModal: {
            deps: [
                'jquery'
            ],
            exports: '$.fn.modal'
        },
        mathjax: {
            exports: 'MathJax'
        }
    },
    paths: {
        text: '../bower_components/requirejs-text/text',
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrapDropdown: '../bower_components/bootstrap/js/dropdown',
        bootstrapCollapse: '../bower_components/bootstrap/js/collapse',
        bootstrapModal: '../bower_components/bootstrap/js/modal',
        mathjax: '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML,Safe'
    }
});

require([
    'app',
    'bootstrapDropdown',
    'bootstrapCollapse',
    'bootstrapModal'
], function (App) {
    
    App.initialize();
});
