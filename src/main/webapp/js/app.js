

	var Hungryapp = angular.module('Hungryapp', [ 'xeditable','app.routeConfig',
			'app.service', 'app.controllers', 'app.directives', 'ui.bootstrap','ngMap','ngCart','ngFacebook','angularModalService','ngFileUpload']);
	
	var route = angular.module('app.routeConfig', [ 'ngRoute' ]);
	Hungryapp.run(function(editableOptions,$rootScope,$location,$cookieStore) {
		  editableOptions.theme = 'bs3';
		  

		  $rootScope.$on("$locationChangeStart", function(event, next, current) {
			  var restrictedRoute = function(route) {
				  if (route == 'http://localhost:8080/Hungryapp/#/userDetails') {
					  return true;
				  }
				  if (route == 'http://localhost:8080/Hungryapp/#/managerDetails') {
					  return true;
				  }
				  if (route == 'http://localhost:8080/Hungryapp/#/newRestaurant') {
					  return true;
				  }
				  // if(route == 'http://localhost:8080/Hungryapp/#/'){
				  // return true;
				  // }
				  // if(route == 'http://localhost:8080/Hungryapp/#/'){
				  // return true;
				  // }
				  // if(route == 'http://localhost:8080/Hungryapp/#/'){
				  // return true;
				  // }
			  }
			  
		      if ( $cookieStore.get('loggedInUser') == null || $cookieStore.get('loggedInUser')  == undefined) {
		        // no logged user, we should be going to #login
		    	  console.log(next);
		        if (!restrictedRoute(next)) {
		          // already going to #login, no redirect needed
		        } else {
		          // not going to #login, we should redirect now
		        	alert('You have to login to Access.')
		          $location.path( "/login" );
		        }
		      }else{
		    	  if(next == 'http://localhost:8080/Hungryapp/#/managerEntry'){
		    		  alert('You have to log out to proceed')
			          $location.path( "/" );
		    	  }
		    	  if(next == 'http://localhost:8080/Hungryapp/#/signup'){
		    		  alert('You have to log out to proceed')
			          $location.path( "/" );
		    	  }
		    	  if(next == 'http://localhost:8080/Hungryapp/#/managersignup'){
		    		  alert('You have to log out to proceed')
			          $location.path( "/" );
		    	  }
		    	  if(next == 'http://localhost:8080/Hungryapp/#/login'){
		    		  alert('You have to log out to proceed')
			          $location.path( "/" );
		    	  }
		    	  
		      }      
		    });
//		// Load the facebook SDK asynchronously
//		  (function(){
//		     // If we've already installed the SDK, we're done
//		     if (document.getElementById('facebook-jssdk')) {return;}
//
//		     // Get the first script element, which we'll use to find the parent node
//		     var firstScriptElement = document.getElementsByTagName('script')[0];
//
//		     // Create a new script element and set its id
//		     var facebookJS = document.createElement('script'); 
//		     facebookJS.id = 'facebook-jssdk';
//
//		     // Set the new script's source to the source of the Facebook JS SDK
//		     facebookJS.src = '//connect.facebook.net/en_US/all.js';
//
//		     // Insert the Facebook JS SDK into the DOM
//		     firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
//		   }());
	});
	
	
	Hungryapp.filter('decorate', [ function() {

		  function decorateFilter(input) {
		    return '--' + input ;
		  }
		  decorateFilter.$stateful = true;

		  return decorateFilter;
		}]);
	
	Hungryapp.config(function($facebookProvider,$httpProvider,$compileProvider,$sceProvider){
		$facebookProvider.setAppId('1003791322978682');
		
//		 var oldWhiteList = $compileProvider.imgSrcSanitizationWhitelist();
		 var currentImgSrcSanitizationWhitelist = $compileProvider.imgSrcSanitizationWhitelist();
	        var newImgSrcSanitizationWhiteList = currentImgSrcSanitizationWhitelist.toString().slice(0,-1)
	        + '|chrome-extension:'
	        +currentImgSrcSanitizationWhitelist.toString().slice(-1);

	        console.log("Changing imgSrcSanitizationWhiteList from "+currentImgSrcSanitizationWhitelist+" to "+newImgSrcSanitizationWhiteList);
//	        $compileProvider.imgSrcSanitizationWhitelist(newImgSrcSanitizationWhiteList);
	})

	route.config([ '$routeProvider','$httpProvider','$compileProvider','$sceProvider', function($routeProvider,$httpProvider,$compileProvider,$sceProvider) {
		 $httpProvider.interceptors.push('myInterceptor');
		 $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|file):\/\/\/\C:\/JBOSS\/jboss-as-7\.1\.1\.Final\/standalone\/deployments\/RestLogo\/[a-z]*[A-Z]*\.[a-z]*/);
		 $compileProvider.imgSrcSanitizationWhitelist(/(https?|ftp|mailto|chrome-extension|file):/);
//		 $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image\//);
		// $sceProvider.enabled(false);
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
			controller : 'managerLoginCtrl',
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
		}).when('/newBranch',{
			templateUrl : 'partials/RestLocationCreate.html',
			controller : 'BranchCreateCtrl'
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
		}).when('/placeOrder',{
			templateUrl : 'partials/processingOrder.html',
			controller : 'pOCtrl'
		}).otherwise({
			redirectTo : '/'
		});
	} ]);
	
	

	
