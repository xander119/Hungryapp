'use strict';

var Hungryapp = angular.module('Hungryapp', [ 'app.routeConfig', 'app.service',
		'app.controllers', 'app.directives' ]);
var control = angular.module('app.controllers', []);
var route = angular.module('app.routeConfig', [ 'ngRoute' ]);
var services = angular.module('app.service', [ 'ngResource' ]);
var directives = angular.module('app.directives', []);

route.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl : 'partials/UserLogin.html',
		controller : 'LoginController'
	}).when('/', {
		templateUrl : 'partials/Home.html',
		contoller : 'HomeController'
	}).when('/signup', {
		templateUrl : 'partials/UserSignUp.html',
		controller : 'SignUpController'
	}).when('/joinus', {
		templateUrl : 'partials/JoinUsHome.html',
		controller : 'storeOwnerContoller'
	}).when('/aboutus', {
		templateUrl : 'partials/AboutUs.html'
	}).otherwise({
		redirectTo : '/'
	});
} ]);
services.factory('AuthService', function($resource) {
	return $resource('/Hungryapp/rest/Login/:credential/:password', null, {
		auth : {
			method : 'GET',
			params : {
				credential : '@credential',
				password : '@password'
			}
		}

	});
});
services.factory('MemberService', function($resource) {
	return $resource('/Hungryapp/rest/members', null, {
		register : {
			url : '/Hungryapp/rest/members/register',
			method : 'POST'
		}

	});
});

control.controller('storeOwnerContoller', [ '$scope', '$location', '$window',
		function($scope, $location, $window) {

		} ]);
control.controller('HomeController', [ '$scope', '$location', '$window',
		function($scope, $location, $window) {

		} ]);
control.controller('LoginController', [ '$scope', '$location', '$window',
		'AuthService', function($scope, $location, $window, AuthService) {
			$scope.login = function(credential, password) {

				$scope.status = AuthService.auth({
					credential : credential,
					password : password
				}, function(status) {
					if (status.result === "success") {
						$location.path('/Hungryapp');
					} else {

					}
				});

			};

		} ]);
control.controller('SignUpController', [ '$scope', '$location', '$window',
		'MemberService', function($scope, $location, $window, MemberService) {

			$scope.registerNewUser = function(Customer) {
				delete Customer.confirmPassword;
				$scope.c = {
					surname : Customer.surname,
					username : Customer.username,
					firstname : Customer.firstname,
					email : Customer.email,
					password : Customer.password,
					joinedDate : new Date().toDateString(),
				};
				console.log(Customer);
				console.log($scope.c);
				MemberService.register(Customer);
				console.log("saved");
				$location.path('/Hungryapp');
			};
		} ]);

directives.directive('passwordCheck', [ function() {
	return {
		require : 'ngModel',
		link : function(scope, element, attributes, controll) {
			var password = '#' + attributes.passwordCheck;
			element.add(password).on('keyup', function() {
				scope.$apply(function() {
					var value = element.val() === $(password).val();
					controll.$setValidity('passwordMatch', value);
				});
			});
		}
	};

} ]);