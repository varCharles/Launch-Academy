//ADD PARSE FUNCTION TO COLLECTION
//ADD BASIC TEMPLATE IN THE RENDER

var app = app ||  {}

app.Tweet = Backbone.Model.extend({});

app.TweetsCollection = Backbone.Collection.extend({
	model: app.Tweet,
	url : function(){
		return 'https://search.twitter.com/search.json?callback=?&q=backbonejs';
	},
	initialize : function(){//constructor
		this.fetch();
	},
	parse : function( result ){//upon success
		//twitter stores the tweets in a property called results
		return result.results
	}
})

app.TweetView = Backbone.View.extend({
	el: '#tweets-list',
	initialize : function(){
		this.listenTo( app.Tweets, 'add', this.render );		
	},
	render: function( tweet ){
		$(this.el).append( '<div>' + tweet.get( 'text' ) + '</div>');
	}


})

app.Tweets = new app.TweetsCollection;
new app.TweetView;