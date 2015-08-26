// Requires 
var angular = require('angular');
var ngRoute = require('angular-route');
var $ = require('jquery');
var googlechart = require('angular-google-chart');
var _ = require('lodash');
var ngMap = require('ngMap');
var ngResource = require('angular-resource');

// URLs Cached
var propertiesURL = 'http://localhost:3000/properties/';
var eventsURL = 'http://localhost:3000/events/';
var agentsURL = 'http//localhost:3000/agents/';

// Router 
var UNRealtyApp = angular.module('UNRealtyApp', ['ngRoute', 'googlechart', 'ngMap', 'ngResource'])
  
  UNRealtyApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {templateUrl: 'app/views/home.html', controller: 'homeCtrl'})
    .when('/activity', {templateUrl: 'app/views/activity.html', controller: 'activityCtrl'})
    .when('/clients', {templateUrl: 'app/views/clients.html', controller: 'clientListCtrl'})
    .when('/add-client', {templateUrl: 'app/views/client-add.html', controller: 'clientAddCtrl'})
    .when('/edit-client/:id', {templateUrl: 'app/views/client-edit.html', controller: 'clientEditCtrl'})
    .when('/events', {templateUrl: 'app/views/events.html', controller: 'eventListCtrl'})
    .when('/add-event', {templateUrl: 'app/views/event-add.html', controller: 'eventAddCtrl'})
    .when('/edit-event/:id', {templateUrl: 'app/views/event-edit.html', controller: 'eventEditCtrl'})
    .when('/listings', {templateUrl: 'app/views/listings.html', controller: 'listingsCtrl'})
    .otherwise({templateUrl: 'app/views/404.html'});
}]);

// Main 
UNRealtyApp.controller('mainCtrl', function($scope){
  console.log('mainCtrl activated')
  $scope.fullName = 'Chaz Fertal';
});

// Home 
UNRealtyApp.factory('FeedLoader', function($resource){
  return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
    fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
  });
});

UNRealtyApp.service('FeedList', function($rootScope, FeedLoader){
  var feeds = [];
  this.get = function() {
    var feedSources = [
      {title: 'Daily Real Estate News', url: 'http://feeds.feedburner.com/dailyrealestatenews'},
      {title: 'Realtor Headlines', url: 'http://feeds.feedburner.com/RealtororgResearchHeadlines'},
      {title: 'HousingWire', url: 'http://www.housingwire.com/rss/1'},
    ];
    if (feeds.length === 0) {
      for (var i = 0; i < feedSources.length; i++) {
        FeedLoader.fetch({q: feedSources[i].url, num: 20}, {}, function (data) {
          var feed = data.responseData.feed;
          feeds.push(feed);
        });
      }
    }
    return feeds;
  };
});

UNRealtyApp.controller('homeCtrl', function($scope, FeedList){
  $scope.feeds = FeedList.get();
  $scope.$on('FeedList', function (event, data) {
    $scope.feeds = data;
  });
});

// Activity 
UNRealtyApp.controller('activityCtrl', function($scope, $http){
  console.log('activityCtrl activated')

  $scope.chartOptions =  {
    chart: { type: 'line' },
    title: { text: 'Fruit Consumption' },
    xAxis: { categories: ['Apples', 'Bananas', 'Oranges'] },
    yAxis: { title: { text: 'Fruit eaten' } },
    series: [
      { name: 'Jane', data: [1, 0, 4] }, 
      { name: 'John', data: [5, 7, 3] }
    ]
  };

});
UNRealtyApp.directive("highcharts", function() {
  return {
    link: function(scope, el, attrs) {
      var options = scope.$eval(attrs.highcharts);
      options.chart.renderTo = el[0];
      new Highcharts.Chart(options);
    }
  };
});

// Clients 
UNRealtyApp.controller('clientListCtrl', function($scope, $http){
  console.log('clientListCtrl activated')
  $http.get(propertiesURL)
    .success(function(props){
        var properties = _.filter(props, {salesAgentId: 1})
        console.log(properties)
        $scope.clients = properties;
      })
}); 

UNRealtyApp.controller('clientAddCtrl', function($scope, $http, $location){
  console.log('clientAddCtrl activated')
  $scope.master = {};
  $scope.activePath = null;

  $scope.add_new = function(client, AddNewForm) {
    console.log('add_new activated')
    $http.post('http://localhost:3000/properties/', client).success(function(){
      $scope.reset();
      $scope.activePath = $location.path('/clients');
    });

    $scope.reset = function() {
      console.log('reset activated')
      $scope.client = angular.copy($scope.master);
    };
    $scope.reset();
  }
});

UNRealtyApp.controller('clientEditCtrl', function($scope, $http, $location, $routeParams){
  console.log('clientEditCtrl activated')
  var id = $routeParams.id;
  $scope.activePath = null;
  $http.get('http://localhost:3000/properties/' + id).success(function(data) {
    $scope.clients = [data];
  });

  $scope.update = function(client){
    console.log('update activated')
    $http.put('http://localhost:3000/properties/' + id, client).success(function(data) {
      console.log('why do you not get here')
      $scope.clients = [data];
      $scope.activePath = $location.path('clients');
    });
  };

  $scope.delete = function(client) {
    console.log('delete activated')
    var deleteClient = confirm('Are you sure you want to delete?');
    if (deleteClient) {
      $http.delete('http://localhost:3000/properties/' + client.id);
      $scope.activePath = $location.path('clients');
    }
  }
});

// Events 
UNRealtyApp.controller('eventListCtrl', function($scope, $http){
  console.log('eventListCtrl activated')
  $http.get(eventsURL)
    .success(function(events){
        var events = _.filter(events, {salesAgentId: 1})
        console.log(events)
        $scope.events = events;
      })
}); 

UNRealtyApp.controller('eventAddCtrl', function($scope, $http, $location){
  console.log('eventAddCtrl activated')
  $scope.master = {};
  $scope.activePath = null;

  $scope.add_new = function(event, AddNewForm) {
    console.log('add_new activated')
    $http.post('http://localhost:3000/events/', event).success(function(){
      $scope.reset();
      $scope.activePath = $location.path('/events');
    });

    $scope.reset = function() {
      console.log('reset activated')
      $scope.event = angular.copy($scope.master);
    };
    $scope.reset();
  }
});

UNRealtyApp.controller('eventEditCtrl', function($scope, $http, $location, $routeParams){
  console.log('eventEditCtrl activated')
  var id = $routeParams.id;
  $scope.activePath = null;
  $http.get('http://localhost:3000/events/' + id).success(function(data) {
    $scope.events = [data];
  });

  $scope.update = function(event){
    console.log('update activated')
    $http.put('http://localhost:3000/events/' + id, event).success(function(data) {
      $scope.events = data;
      $scope.activePath = $location.path('events');
    });
  };

  $scope.delete = function(event) {
    console.log('delete activated')
    var deleteEvent = confirm('Are you sure you want to delete?');
    if (deleteEvent) {
      $http.delete('http://localhost:3000/events/' + event.id);
      $scope.activePath = $location.path('events');
    }
  }
});

// Listings 
UNRealtyApp.controller('listingsCtrl', function($scope, $http, $timeout){
  console.log('listingsCtrl activated')
  $http.get(propertiesURL)
    .success(function(props){
        var properties = _.filter(props, {salesAgentId: 1})
        $scope.clients = properties;
    })
});





