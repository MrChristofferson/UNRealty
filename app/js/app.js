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
      {title: 'Realtor Headlines', url: 'http://feeds.feedburner.com/RealtororgResearchHeadlines'},
      {title: 'HousingWire', url: 'http://www.housingwire.com/rss/1'},
      // {title: 'Daily Real Estate News', url: 'http://feeds.feedburner.com/dailyrealestatenews'},
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
  $scope.$on('FeedList', function(event, data) {
    $scope.feeds = data;
  });
});

// Activity 
UNRealtyApp.controller('activityCtrl', function($scope, $http){
  $scope.chartOptions1 =  {
    chart: { zoomType: 'x' },
    title: { text: 'Housing Prices' },
    xAxis: { categories: ['2009', '2010', '2011', '2012', '2013', '2014', '2015'] },
    yAxis: { title: { text: 'Price' } },
    series: [
      { name: 'Phoenix', data: [50000, 70000, 90000, 110000, 90000, 81000, 85000] }, 
      { name: 'Mesa', data: [45000, 71000, 83000, 130000, 130000, 132000, 136000] }, 
      { name: 'Gilbert', data: [60000, 32000, 55000, 150000, 90000, 60000, 130000] }, 
      { name: 'USA', data: [45000, 55000, 20000, 60000, 120000, 121000, 120000] }
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
  $http.get(propertiesURL)
    .success(function(props){
        var properties = _.filter(props, {salesAgentId: 1})
        $scope.clients = properties;
      })
}); 

UNRealtyApp.controller('clientAddCtrl', function($scope, $http, $location){
  $scope.master = {};
  $scope.activePath = null;

  $scope.add_new = function(client, AddNewForm) {
    $http.post('http://localhost:3000/properties/', client).success(function(){
      $scope.reset();
      $scope.activePath = $location.path('/clients');
    });

    $scope.reset = function() {
      $scope.client = angular.copy($scope.master);
    };
    $scope.reset();
  }
});

UNRealtyApp.controller('clientEditCtrl', function($scope, $http, $location, $routeParams){
  var id = $routeParams.id;
  $scope.activePath = null;
  $http.get('http://localhost:3000/properties/' + id).success(function(data) {
    $scope.clients = [data];
  });

  $scope.update = function(client){
    $http.put('http://localhost:3000/properties/' + id, client).success(function(data) {
      $scope.clients = [data];
      $scope.activePath = $location.path('clients');
    });
  };

  $scope.delete = function(client) {
    var deleteClient = confirm('Are you sure you want to delete?');
    if (deleteClient) {
      $http.delete('http://localhost:3000/properties/' + client.id);
      $scope.activePath = $location.path('clients');
    }
  }
});

// Events 
UNRealtyApp.controller('eventListCtrl', function($scope, $http){
  $http.get(eventsURL)
    .success(function(events){
        var events = _.filter(events, {salesAgentId: 1})
        $scope.events = events;
      })
}); 

UNRealtyApp.controller('eventAddCtrl', function($scope, $http, $location){
  $scope.master = {};
  $scope.activePath = null;

  $scope.add_new = function(event, AddNewForm) {
    $http.post('http://localhost:3000/events/', event).success(function(){
      $scope.reset();
      $scope.activePath = $location.path('/events');
    });

    $scope.reset = function() {
      $scope.event = angular.copy($scope.master);
    };
    $scope.reset();
  }
});

UNRealtyApp.controller('eventEditCtrl', function($scope, $http, $location, $routeParams){
  var id = $routeParams.id;
  $scope.activePath = null;
  $http.get('http://localhost:3000/events/' + id).success(function(data) {
    $scope.events = [data];
  });

  $scope.update = function(event){
    $http.put('http://localhost:3000/events/' + id, event).success(function(data) {
      $scope.events = data;
      $scope.activePath = $location.path('events');
    });
  };

  $scope.delete = function(event){
    var deleteEvent = confirm('Are you sure you want to delete?');
    if (deleteEvent) {
      $http.delete('http://localhost:3000/events/' + event.id);
      $scope.activePath = $location.path('events');
    }
  }
});

// Listings 
UNRealtyApp.controller('listingsCtrl', function($scope, $http, $timeout){
  $http.get(propertiesURL)
    .success(function(props){
        var properties = _.filter(props, {salesAgentId: 1})
        $scope.clients = properties;
    })
});





