class Tweet extends Backbone.Model
	idAttribute: 'from_user_id'

class TweetsCollection extends Backbone.Collection
	model: Tweet
	url: ->
		return 'https://search.twitter.com/search.json?callback=?&q=' + @query

	initialize: ->
		@query = 'backbonejs'
		@fetch()

	parse : ( result ) ->
		return result.results

class AppView extends Backbone.View
	el: '#twitter-app'
	initialize: ->
		
		_.bindAll @
		@collection = Tweets
		@tweet_list = $ '#tweets-list'
		@search_field = $ '#search-field'
		@user_div = $ '#user-details'
		
		@listenTo @collection,'add', @addTweet
		@listenTo @collection,'reset', @clearTweets
		

	events:->
		'click #init-search' : 'initSearch'
	
	clearTweets: ->
		@tweet_list.html('')

	addTweet: ( tweet )->
		view = new TweetView { model: tweet }
		@tweet_list.append view.render().el 
	initSearch: -> 		
		Tweets.reset()
		Tweets.query = @search_field.val()
		Tweets.fetch()

	showUser: ( user_id ) ->
		user_model = @collection.get user_id
		console.log user_id, user_model
		view = new UserView { model: user_model }
		@.user_div.append view.render().el 

	hideUser: ( user_id ) ->
		@.user_div.html('')

	

class TweetView extends Backbone.View
	template: _.template $('#tweets-template').html()
	
	render: ->
		$(@.el).append @.template @.model.toJSON()
		@ #return this


class UserView extends Backbone.View
	template: _.template $('#user-template').html()
	events: ->
		'click .close': 'hideMe'

	render:->
		$(@.el).append @.template @.model.toJSON() 
		@
	hideMe: ->
		MainView.hideUser()

class AppRouter extends Backbone.Router
	routes:
		'user/:id':	'userDetails'
	userDetails: ( id ) ->
		MainView.showUser( id );


Tweets = new TweetsCollection;
MainView = new AppView

TwitterRouter = new AppRouter;
Backbone.history.start();
