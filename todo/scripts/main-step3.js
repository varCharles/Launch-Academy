//refactoring for fewer global vars
var app = {}

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
		this.listenTo(app.Todos, 'add', this.addOne);
		app.Todos.fetch();// retrieve models from storage

	},
	addOne: function (todo) {
		$('#todo-list').append('<li>' + todo.get('title') + '</li>');
	}

})



//instantiate the collection
app.Todos = new app.ToDoCollection;
new app.AppView();
