var Tweet = Backbone.Model.extend({});

var TweetsCollection = Backbone.Collection.extend({
	model: Tweet,
	url:function(){
		return 'http://search.twitter.com/search.json?q=backbonejs';
	}
});