var app = app ||  {}

app.Tweet = Backbone.Model.extend({});

app.TweetsCollection = Backbone.Collection.extend({
	model: app.Tweet,
	url:function(){
		return 'https://search.twitter.com/search.json?callback=?&q=backbonejs';
	},
	initialize: function(){
		this.fetch();
	}
})

app.TweetView = Backbone.View.extend({
	el: '#tweets-list',
	initialize:function(){
		this.listenTo( app.Tweets, 'add', this.render );		
	},
	render: function( tweets ){
		console.log( 'tweets => ',  tweets );
		return this
	}
})

app.Tweets = new app.TweetsCollection;
new app.TweetView();