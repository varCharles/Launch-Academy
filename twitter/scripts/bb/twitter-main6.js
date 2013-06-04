//CREATE A SECOND VIEW FOR APP
// HAVE APP VIEW ACT AS PARENT TO SUB VIEW

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

app.AppView = Backbone.View.extend({
	el: '#twitter-app',
	initialize : function(){
		//set up some alias to common elements
		this.tweet_list = $( '#tweets-list' )

		//listen to application events
		this.listenTo( app.Tweets, 'add', this.addTweet );		
	},
	addTweet: function( tweet ){// create a partial view and add it to the tweet list
		var view = new app.TweetView({ model: tweet });//create a partial view 
		this.tweet_list.append( view.render().el );
	}


})


app.TweetView = Backbone.View.extend({
	//tagName: 'div',
	//className: 'tweet',
	template: _.template( $('#tweets-template').html() ),
	
	render: function( ){
		//console.log( this.model )
		$(this.el).append( this.template( this.model.toJSON()  ));
		return this;
	}
})

app.Tweets = new app.TweetsCollection;
new app.AppView;// generate the appview, not the partial