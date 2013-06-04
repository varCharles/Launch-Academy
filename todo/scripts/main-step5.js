//ADD NEW ITEMS TO THE TODO LIST

//global app var
var app = {}
app.ENTER_KEY = 13;
//Create a bare bone model
app.ToDo =  Backbone.Model.extend({})

//Create collection that is links the model to the 'storage' 
app.ToDoCollection =  Backbone.Collection.extend({
	model: app.ToDo,
	url: 'api/todo.json'
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
	render: function(){
		this.$el.html( this.template( this.model.toJSON() ) )
		return this;
	}


})



//instantiate the collection
app.Todos = new app.ToDoCollection;
new app.AppView();
