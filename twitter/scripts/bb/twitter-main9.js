// MAKE THE ROUTER DO SOMETHING


var app = app ||  {}

app.Tweet = Backbone.Model.extend({
	idAttribute: 'from_user_id'
});

app.TweetsCollection = Backbone.Collection.extend({
	model: app.Tweet,
	query: '',
	url : function(){
		return 'https://search.twitter.com/search.json?callback=?&q=' + this.query;
	},
	initialize : function(){//constructor
		this.query = 'backbonejs';
		this.fetch();
	},
	parse : function( result ){//upon success
		//twitter stores the tweets in a property called results
		return result.results
	
	}
})

app.AppView = Backbone.View.extend({
	el: '#twitter-app',
	initialize : function(){
		//set up some alias to common elements
		this.tweet_list = $( '#tweets-list' );
		this.search_field = $( '#search-field');
		this.user_div = $( '#user-details');
		//listen to application events
		this.listenTo( app.Tweets, 'reset', this.clearTweets );	
		this.listenTo( app.Tweets, 'add', this.addTweet );		

	},
	events:{//user ( DOM ) events
		'click #init-search' : 'initSearch',
	},
	clearTweets: function(){//
		this.tweet_list.html('');
	},

	addTweet: function( tweet ){// create a partial view and add it to the tweet list
		var view = new app.TweetView({ model: tweet });//create a partial view 
		this.tweet_list.append( view.render().el );
	},
	initSearch: function(){
		app.Tweets.reset();
		app.Tweets.query = this.search_field.val();
		app.Tweets.fetch();
	},
	showUser: function( user_id ){
		var user_model = app.Tweets.get( user_id );
		var view = new app.UserView({ model: user_model });//create a partial view 
		this.user_div.append( view.render().el );

	},
	hideUser: function( user_id ){
		this.user_div.html('')

	}

})


app.TweetView = Backbone.View.extend({
	//tagName: 'div',
	//className: 'tweet',
	template: _.template( $('#tweets-template').html() ),
	
	render: function( ){
		$(this.el).append( this.template( this.model.toJSON()  ));
		return this;
	}
})

app.UserView = Backbone.View.extend({
	//tagName: 'div',
	//className: 'tweet',
	template: _.template( $('#user-template').html() ),
	events:{
		'click .close': 'hideMe'
	},
	
	render: function( ){
		$(this.el).append( this.template( this.model.toJSON()  ));
		return this;
	},

	hideMe:function(){
		app.MainView.hideUser();
	}
})



app.Router = Backbone.Router.extend({
	routes:{
		'user/:id':'userDetails',

	},
	userDetails: function( id ){
		app.MainView.showUser( id );
	}


})

app.Tweets = new app.TweetsCollection;
app.MainView = new app.AppView;// generate the appview, not the partial

app.TodoRouter = new app.Router();
Backbone.history.start();

