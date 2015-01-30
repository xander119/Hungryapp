'use strict';

var Hungryapp = angular.module('Hungryapp', [ 'ng.routeConfig', 'ng.service',
		'ng.controllers' ]);
var control = angular.module('ng.controllers', []);
var route = angular.module('ng.routeConfig', [ 'ngRoute' ]);
var services = angular.module('ng.service', [ 'ngResource' ]);

route.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'partials/Login.html',
		controller : 'LoginController'
	}).when('/', {
		templateUrl : 'partials/Home.html',
	}).when('/signup', {
		templateUrl : 'partials/SignUp.html',
	}).otherwise({
		redirectTo : '/'
	});
} ]);
control.controller('LoginController', [ '$scope', 'AuthService','$location','$window',
		function($scope, AuthService, $location,$window) {
			$scope.login = function(credential, password) {

				$scope.status = AuthService.get({credential: credential, password: password});
				if( $scope.status.result=="success"){
					$location.path('/Hungryapp/#/');
				}else{
					
				}
			};
			

		} ]);

services.factory('AuthService', function($resource) {
	return $resource('/Hungryapp/rest/Login/:credential/:password', {}, {
		get: {method: 'GET', params: {credential1 : '@credential', password1: '@password'},isArray : false}
		
	});
});