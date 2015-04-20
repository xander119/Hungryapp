

	var Hungryapp = angular.module('Hungryapp', [ 'xeditable','app.routeConfig',
			'app.service', 'app.controllers', 'app.directives', 'ui.bootstrap','ngMap','ngCart','ngFacebook']);
	
	var route = angular.module('app.routeConfig', [ 'ngRoute' ]);
	Hungryapp.run(function(editableOptions,$rootScope) {
		  editableOptions.theme = 'bs3';
		// Load the facebook SDK asynchronously
		  (function(){
		     // If we've already installed the SDK, we're done
		     if (document.getElementById('facebook-jssdk')) {return;}

		     // Get the first script element, which we'll use to find the parent node
		     var firstScriptElement = document.getElementsByTagName('script')[0];

		     // Create a new script element and set its id
		     var facebookJS = document.createElement('script'); 
		     facebookJS.id = 'facebook-jssdk';

		     // Set the new script's source to the source of the Facebook JS SDK
		     facebookJS.src = '//connect.facebook.net/en_US/all.js';

		     // Insert the Facebook JS SDK into the DOM
		     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
		   }());
	});
	Hungryapp.config(function($facebookProvider,$httpProvider){
		$facebookProvider.setAppId('1003791322978682');
		 $httpProvider.interceptors.push('myInterceptor');
	})

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
		}).when('/fbUserReg', {
			templateUrl : 'partials/fbUserRegister.html',
			controller : 'fbUserRegisterCtrl'
		}).otherwise({
			redirectTo : '/'
		});
	} ]);
	
	

	
