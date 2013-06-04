// ADD SEARCH CAPABILITIES


var app = app ||  {}

app.Tweet = Backbone.Model.extend({});

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
		//listen to application events
		this.listenTo( app.Tweets, 'reset', this.clearTweets );	
		this.listenTo( app.Tweets, 'add', this.addTweet );		

	},
	events:{//user ( DOM ) events
		'click #init-search' : 'initSearch'
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

app.Tweets = new app.TweetsCollection;
new app.AppView;// generate the appview, not the partial