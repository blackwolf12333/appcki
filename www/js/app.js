var apiUrl = "http://localhost:4000";

var appcki = angular.module('appcki', [
    'ngStorage',
    'ngRoute'
]);


appcki.config(['$routeProvider','$httpProvider',
  function($routeProvider, $httpProvider) {

    $routeProvider
      .when('/login', {
        templateUrl: 'partials/login-details.html',
        controller: 'loginPageController'
      })
      .otherwise({
        redirectTo: '/login'
      });

      /*
          $routeProvider.
          when('/', {
              templateUrl: 'partials/home.html',
              controller: 'HomeCtrl'
          }).
          when('/signin', {
              templateUrl: 'partials/signin.html',
              controller: 'HomeCtrl'
          }).
          when('/me', {
              templateUrl: 'partials/me.html',
              controller: 'HomeCtrl'
          }).
          otherwise({
              redirectTo: '/'
          });
      */

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                return $q.reject(response);
            }
        };
    }]);

  }]);


appcki.value('apiUrl', 'http://localhost:3000');


