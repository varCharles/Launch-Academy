//Create a bare bone model
var ToDo =  Backbone.Model.extend({})

//Create collection that is links the model to the 'storage' 
var ToDoCollection =  Backbone.Collection.extend({
	model: ToDo,
	url: 'api/todo.json',
	initialize: function(){// backbone 'constructor'
		this.fetch();// retrieve models from storage
	}
});


//instantiate the collection
var todos = new ToDoCollection;

