//global app var
var app = {}
app.ENTER_KEY = 13;

//Create a bare bone model
app.Film =  Backbone.Model.extend({})
app.Actor =  Backbone.Model.extend({})
app.FilmDetail =  Backbone.Model.extend({})
//Create collection that is links the model to the 'storage' 
app.FilmsCollection =  Backbone.Collection.extend({
	model: app.Film,
	filterText:'',
	url: function(){
		return 'https://www.googleapis.com/freebase/v1/search?query=' + this.filterText +'&filter=(all+type%3A%2Ffilm%2Ffilm)'
	},
	 parse: function( result ){
	 	return result.result
	 }
});
app.FilmCollection =  Backbone.Collection.extend({
	model: app.FilmDetail,
	baseURL: function( id ){
		return 'https://www.googleapis.com/freebase/v1/topic/m/'  + id
	},
	 parse: function( result ){
	 	//app.RESULT = result;
	 	data = {}
	 	data.imageURL = result.property['/common/topic/image'].values[0].id
	 	data.title = result.property['/type/object/name'].values[0].text
	 	data.description = result.property['/common/topic/description'].values[0].text
	 	data.actors = result.property['/film/film/starring'].values
	  	return data;

	 }
	
});

app.ActorCollection =  Backbone.Collection.extend({
	model: app.Actor,
	baseURL: function( id ){
		return 'https://www.googleapis.com/freebase/v1/topic/m/'  + id
	},
	 parse: function( result ){
	 	data = {}
	 	data.imageURL = result.property['/common/topic/image'].values[0].id
	 	data.name = result.property['/type/object/name'].values[0].text
	  	data.films = result.property['/film/actor/film'].values
	 	return data;
	 	//film/performance/film:
	 }
	
});

app.AppView = Backbone.View.extend({
	el: '#filmapp',
	initialize: function(){
		this.$input = this.$('#film-search');

		this.listenTo(app.Films, 'add', this.addFilmToList);//add is a backbone event that is triggered when a new model is added to the collection
		this.listenTo(app.Film, 'add', this.showFilmDetails);//add is a backbone event that is triggered when a new model is added to the collection
		this.listenTo(app.Actor, 'add', this.showActorDetails);

		app.Films.fetch();// retrieve models from storage

	},
	events:{
		'keypress #film-search': 'searchOnEnter'
	},
	addFilmToList: function (film) {
		var view = new app.FilmListView({ model: film });//create a partial view 
		$('#film-list').append(view.render().el);//add partial view to the list
	},
	showFilmDetails: function (film) {
		var view = new app.FilmDetailsView({ model: film });//create a partial view 
		$('#film-details').html(view.render().el);//add partial view to the list
	},
	showActorDetails: function (actor) {
		var view = new app.ActorView({ model: actor });//create a partial view 
		$('#film-details').html(view.render().el);//add partial view to the list
	},
	searchOnEnter:function(e){
		if( e.which !== app.ENTER_KEY || !this.$input.val().trim() ){
			//if it's not the return key (13) or the the input is blank, bail
			return
		}

		app.Films.filterText = this.$input.val().trim();
		$('#film-list').html('')
		app.Films.fetch();
	}

})

app.FilmListView = Backbone.View.extend({//partial view, uses underscore template
	tagName:'li',
	template: _.template( $('#film-template').html() ),
	render: function(){
		this.$el.html( this.template( this.model.toJSON() ) )
		return this;
	}
})

app.FilmDetailsView= Backbone.View.extend({//partial view, uses underscore templat
	tagName: 'div',
	template: _.template( $('#film-detail-template').html() ),
	render: function(){
		this.$el.html( this.template( this.model.toJSON() ) )
		return this;
	}
})

app.ActorView  = Backbone.View.extend({//partial view, uses underscore templat
	tagName: 'div',
	template: _.template( $('#actor-detail-template').html() ),
	render: function(){
		this.$el.html( this.template( this.model.toJSON() ) )
		return this;
	}
})

app.Router = Backbone.Router.extend({
	routes:{
		'movie/m/:id':'filmDetails',
		'actor/m/:id':'actorDetails'
	},
	filmDetails: function( id ){
		app.Film.url = app.Film.baseURL(id);
		app.Film.fetch();
	},
	actorDetails: function( id ){
		app.Actor.url = app.Actor.baseURL(id);
		app.Actor.fetch();
	}


})

//instantiate the collection
app.Films = new app.FilmsCollection;
app.Film = new app.FilmCollection;
app.Actor = new app.ActorCollection;
new app.AppView();

app.TodoRouter = new app.Router();
Backbone.history.start();
