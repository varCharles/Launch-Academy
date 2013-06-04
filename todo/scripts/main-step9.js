// ROUTER
//set up a router to track the hash value of the URL



//global app var
var app = {}
app.ENTER_KEY = 13;
//Create a bare bone model
app.ToDo =  Backbone.Model.extend({
	toggle: function () {//Toggle the `completed` state of this todo item.
			this.save({
				completed: !this.get('completed')
			});
		}

})

//Create collection that is links the model to the 'storage' 
app.ToDoCollection =  Backbone.Collection.extend({
	model: app.ToDo,
	localStorage: new Backbone.LocalStorage('new-todos-backbone')
});

app.AppView = Backbone.View.extend({
	el: '#todoapp',
	initialize: function(){
		this.$input = this.$('#new-todo'); //alias to the input field

		this.listenTo(app.Todos, 'add', this.addOne);//add is a backbone event that is triggered when a new model is added to the collection
		
		app.Todos.fetch();// retrieve models from storage

	},

	events:{
		'keypress #new-todo': 'createOnEnter'
	},
	createOnEnter: function(e){
		//e is the event object passed by keypress event
		//e.which is the keycode of the key pressed
		if( e.which !== app.ENTER_KEY || !this.$input.val().trim() ){
			//if it's not the return key (13) or the the input is blank, bail
			return
		}
		app.Todos.create({
			title: this.$input.val().trim(),
			completed: false
		});
		this.$input.val(''); //clear the input field. 

	},

	addOne: function (todo) {
		var view = new app.TodoView({ model: todo });//create a partial view 
		$('#todo-list').append(view.render().el);//add partial view to the list
	}

})

app.TodoView = Backbone.View.extend({//partial view, uses underscore template
	tagName:'li',
	template: _.template( $('#item-template').html() ),
	events:{
		'click .destroy': 'clear',
		'dblclick label': 'edit',
		'keypress .edit': 'updateOnEnter',
		'keypress .edit': 'updateOnEnter',
		'click .toggle':  'toggleComplete'
	},	
	initialize: function(){
		//events
		this.listenTo( this.model, 'destroy', this.remove );//update view on delete
		this.listenTo( this.model, 'change', this.render);//update todo value when model changes

	},
	render: function(){
		this.$el.html( this.template( this.model.toJSON() ) );
		//alias
		this.$input = this.$('.edit')//added to the render, as it does not 'exist' in the DOM until then
		return this;
	},
	clear: function(){// removes item from collection/local storage
		this.model.destroy();
	},
	edit:function(){
		this.$el.addClass('editing');
		this.$input.focus();
	},
	updateOnEnter: function(e){
		if( e.which === app.ENTER_KEY ){
			var new_title = this.$input.val();

			if( new_title ){
				this.model.save( {title: new_title} );
			}else{
				this.clear();
			}
		this.$el.removeClass( 'editing' )

		}
		

	},
	toggleComplete: function(){
		this.model.toggle();
	}

})

app.Router = Backbone.Router.extend({
	routes:{
		'':'all',
		'active':'active',
		'completed': 'completed'
	},
	all: function(){
		console.log('all')
	},
	active: function(){
		console.log('active')
	},
	completed: function(){
		console.log('completed')
	}


})


//instantiate the collection
app.Todos = new app.ToDoCollection;
new app.AppView();
//ROUTER
app.TodoRouter = new app.Router();
Backbone.history.start();

