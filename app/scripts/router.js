define([
    'jquery',
    'underscore',
    'backbone',
    'models/snippet',
    'views/snippet',
    'views/about'
], function($, _, Backbone, SnippetModel, SnippetView, AboutView) {
    
    var AppRouter = Backbone.Router.extend({
        
        routes: {
            '': 'rand',
            'new': 'new',
            'edit/:slug': 'edit',
            'about': 'about',
            ':shortCode': 'show'
        },
        
        rand: function() {
            var snippet = new SnippetModel({
                id: ''
            }),
                snippetView = new SnippetView({model: snippet});
            $('.view-random').append(snippetView.$el);
            var self = this;
            snippet.fetch({ 
                success: function(model, response, options) {
                    self.navigate(snippet.get('shortCode'), {trigger: true});
                },
                silent: true
            });
        },
        
        show: function(shortCode) {
            console.log(shortCode);
            var snippet = new SnippetModel({
                id: shortCode
            }), 
                snippetView = new SnippetView({model: snippet});
            $('.view-snippet').append(snippetView.$el);
            var self = this;
            snippet.fetch({ 
                success: function(model, response, options) {
                    snippet.id = null;
                    snippet.set('snapshot', {
                        title: snippet.get('title'),
                        code: snippet.get('code')
                    });
                    self.switchTo(snippetView);
                    snippetView.updateResult();
                },
                silent: true
            });
            
            snippet.on('saved', function(model) {
                self.navigate(snippet.get('shortCode'), {trigger: true});
            });
        },
        
        new: function() {
            //Create and render an empty snippet
            var snippet = new SnippetModel, 
                snippetView = new SnippetView({model: snippet});
            $('.view-new').append(this.switchTo(snippetView).$el);
            //The CodeMirror won't display properly if initialized before it's appended to the DOM, so it needs to be refreshed
            snippetView.refreshCodeMirror();
            var self = this;
            snippet.on('saved', function(model) {
                self.navigate(model.get('shortCode'), {trigger: true});
            });
        },
       
        edit: function(slug) {
            
        },
       
        about: function() {
            var aboutView = new AboutView();
            $('.view-about').append(this.switchTo(aboutView).$el);
        },
            
        //Renders a view after removing the previously rendered view
        //Also updates the nav
        switchTo: function(view) {
            if(this.currentView) {
                this.currentView.remove();
            }
            view.render();
            this.currentView = view;
            return view;
        }
    });

    var initialize = function(){
        var router = new AppRouter;
        Backbone.history.start();
    };
    
    return {
        initialize: initialize
    };
});