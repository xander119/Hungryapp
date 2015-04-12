

	var Hungryapp = angular.module('Hungryapp', [ 'xeditable','app.routeConfig',
			'app.service', 'app.controllers', 'app.directives', 'ui.bootstrap','ngMap','ngCart']);
	
	var route = angular.module('app.routeConfig', [ 'ngRoute' ]);
	Hungryapp.run(function(editableOptions) {
		  editableOptions.theme = 'bs3';
	});
	route.config([ '$routeProvider', function($routeProvider) {
		$routeProvider.when('/login', {
			templateUrl : 'partials/UserLogin.html',
			controller : 'LoginController'
		}).when('/signup', {
			templateUrl : 'partials/UserSignUp.html',
			controller : 'SignUpController'
		}).when('/joinus', {
			templateUrl : 'partials/JoinUsHome.html',
			controller : 'storeOwnerContoller'
		}).when('/userDetails', {
			templateUrl : 'partials/UserDetails.html',
			controller : 'userdetailsCtrl'
		}).when('/aboutus', {
			templateUrl : 'partials/AboutUs.html'
		}).when('/managerEntry', {
			templateUrl : 'partials/ManagerLogin.html',
			controller : 'managerLoginCtrl'
		}).when('/managersignup', {
			templateUrl : 'partials/ManagerRegister.html',
			controller : 'managerRegisterCtrl'
		}).when('/managerDetails', {
			templateUrl : 'partials/ManagerDetails.html',
			controller : 'managerDetailsCtrl'
		}).when('/forgotPwd', {
			templateUrl : 'partials/ForgotPassword.html',
			controller : 'forgotPasswordCtrl'
		}).when('/newRestaurant',{
			templateUrl : 'partials/RestaurantCreate.html',
			controller : 'restaurantCreateCtrl'
		}).when('/restaurantList',{
			templateUrl : 'partials/RestaurantList.html',
			controller : 'restListCtrl'
		}).when('/restaurantDetails',{
			templateUrl : 'partials/RestaurantDetails.html',
			controller : 'restDetailsCtrl'
		}).when('/', {
			templateUrl : 'partials/HomePage.html',
			controller : 'HomeCtrl'
		}).when('/myCart', {
			templateUrl : 'partials/ShoppingCart.html',
			controller : 'shoppingCartCtrl'
		}).otherwise({
			redirectTo : '/'
		});
	} ]);
	
	

	
