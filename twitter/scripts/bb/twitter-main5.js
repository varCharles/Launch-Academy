//USE AND UNDERSCORE TEMPLATE

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
	template: _.template( $('#tweets-template').html() ),
	initialize : function(){
		this.listenTo( app.Tweets, 'add', this.render );		
	},
	render: function( tweet ){
		$(this.el).append( this.template( tweet.toJSON()  ));

	}
})

app.Tweets = new app.TweetsCollection;
new app.TweetView;