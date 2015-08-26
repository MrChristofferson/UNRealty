// Requires 
var angular = require('angular');
var ngRoute = require('angular-route');
var $ = require('jquery');
var googlechart = require('angular-google-chart');
var _ = require('lodash');
var ngMap = require('ngMap');

// URLs Cached
var propertiesURL = 'http://localhost:3000/properties/';
var eventsURL = 'http://localhost:3000/events/';
var agentsURL = 'http//localhost:3000/agents/';

// Router 
var UNRealtyApp = angular.module('UNRealtyApp', ['ngRoute', 'googlechart', 'ngMap'])
  
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

// Home 
UNRealtyApp.controller('homeCtrl', function($scope){
  console.log('homeCtrl activated')
});

// Activity 
UNRealtyApp.controller('activityCtrl', function($scope, $http){
  console.log('activityCtrl activated')

  // $http.get(propertiesURL)
  //   .success(function(props){
  //       var properties = _.filter(props, {salesAgentId: 1})
  //       console.log(properties)
  //       properties.forEach(function(prop){
  //         console.log(prop.housePrice)
  //       })
  //     })

  // All Agents 
  $scope.allAgentsStats = {
    "type": "LineChart",
    "displayed": true,
    "data": {
      "cols": [
        {
          "id": "month",
          "label": "Month",
          "type": "string",
          "p": {}
        },
        {
          "id": "laptop-id",
          "label": "Laptop",
          "type": "number",
          "p": {}
        },
        {
          "id": "desktop-id",
          "label": "Desktop",
          "type": "number",
          "p": {}
        },
        {
          "id": "server-id",
          "label": "Server",
          "type": "number",
          "p": {}
        },
        {
          "id": "cost-id",
          "label": "Shipping",
          "type": "number"
        }
      ],
      "rows": [
        {
          "c": [
            {
              "v": "January"
            },
            {
              "v": 19,
              "f": "42 items"
            },
            {
              "v": 12,
              "f": "Ony 12 items"
            },
            {
              "v": 7,
              "f": "7 servers"
            },
            {
              "v": 4
            }
          ]
        },
        {
          "c": [
            {
              "v": "February"
            },
            {
              "v": 13
            },
            {
              "v": 1,
              "f": "1 unit (Out of stock this month)"
            },
            {
              "v": 12
            },
            {
              "v": 2
            }
          ]
        },
        {
          "c": [
            {
              "v": "March"
            },
            {
              "v": 24
            },
            {
              "v": 5
            },
            {
              "v": 11
            },
            {
              "v": 6
            }
          ]
        }
      ]
    },
    "options": {
      "title": "Sales per month",
      "isStacked": "false",
      "fill": 20,
      "displayExactValues": true,
      "vAxis": {
        "title": "Sales unit",
        "gridlines": {
          "count": 10
        }
      },
      "hAxis": {
        "title": "Date"
      }
    },
    "formatters": {}
  };

  // Agent Quotas
  $scope.agentQuotasGauges = {
    "type": "Gauge",
    "data": [
      [
        "Component",
        "cost"
      ],
      [
        "Software",
        50000
      ],
      [
        "Hardware",
        59725
      ],
      [
        "Services",
        20000
      ]
    ],
    "options": {
      "displayExactValues": true,
      "width": 500,
      "height": 250,
      "is3D": true,
      "chartArea": {
        "left": 10,
        "top": 10,
        "bottom": 0,
        "height": "100%"
      }
    },
    "formatters": {
      "number": [
        {
          "columnNum": 1,
          "pattern": "$ #,##0.00"
        }
      ]
    },
    "displayed": true
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
UNRealtyApp.controller('listingsCtrl', function($scope){
  console.log('listingsCtrl activated')
    angular.extend($scope, {
      centerProperty: {
        lat: 45,
        lng: -73
      },
      zoomProperty: 8,
      markersProperty: [ {
          latitude: 45,
          longitude: -74
        }],
      clickedLatitudeProperty: null,  
      clickedLongitudeProperty: null,
    });

});





