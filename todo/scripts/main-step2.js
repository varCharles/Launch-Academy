//refactoring for fewer global vars
var app = {}

//Create a bare bone model
app.ToDo =  Backbone.Model.extend({})

//Create collection that is links the model to the 'storage' 
app.ToDoCollection =  Backbone.Collection.extend({
	model: app.ToDo,
	url: 'api/todo.json',
	initialize: function(){// backbone 'constructor'
		this.fetch();// retrieve models from storage
	}
});


//instantiate the collection
app.ToDos = new app.ToDoCollection;