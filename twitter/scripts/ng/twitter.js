( function(){
	'use strict';

	var twitter = angular.module('twitter', []);
	twitter.query = 'backbonejs';
	twitter.controller('MainCtrl', function( $scope, Tweets){
		$scope.getTweets = function(  ){
			twitter.query = $scope.query;
			twitter.getTweets()
		}

		
		twitter.getTweets = function( ){
			Tweets.getTweets().success( function( data){
			 	$scope.tweets = data.results
			 })//Tweets.getTweets

		}
	
		twitter.getTweets();

	});//twitter controler

	twitter.service('Tweets', function( $http ){
		this.getTweets = function(){
			return $http.jsonp('https://search.twitter.com/search.json?callback=?JSON_CALLBACK&q=' + twitter.query );
			//JSON_CALLBACK CONSTANT wraps resonse in approriate tags
		}
	})//service

	


})();