var app = app || {}

app.Tweet = Backbone.Model.extend({});

app.TweetsCollection = Backbone.Collection.extend({
	model: app.Tweet,
	url:function(){
		//callback=? forces jsonp (p = padding) for x-domain calls 
		return 'https://search.twitter.com/search.json?callback=?&q=backbonejs';
	},
	initialize:function(){
		this.fetch();
	}
})

app.Tweets = new app.TweetsCollection;