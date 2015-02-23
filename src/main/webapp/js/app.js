'use strict';
(function() {

	var Hungryapp = angular.module('Hungryapp', [ 'app.routeConfig',
			'app.service', 'app.controllers', 'app.directives', "xeditable","ui.bootstrap" ]);
	var control = angular.module('app.controllers', [ 'ngCookies' ]);
	var route = angular.module('app.routeConfig', [ 'ngRoute' ]);
	var services = angular.module('app.service', [ 'ngResource' ]);
	var directives = angular.module('app.directives', []);
	Hungryapp.run(function(editableOptions) {
		editableOptions.theme = 'bs2';
	});
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
			},
			adminAuth : {
				url : '/Hungryapp/rest/Login/admin-:credential/:password',
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
			},
			getUser : {
				url : '/Hungryapp/rest/members/myInfo/:id',
				method : 'GET',
				params : {
					id : '@id'
				}
			},
			updateUser : {
				url : '/Hungryapp/rest/members/updateInfo',
				method : 'PUT'
			},
			getHistoryOrders : {
				url : '/Hungryapp/rest/members/orders/:id',
				method : 'GET',
				params : {
					id : '@id'
				}
			}

		});
	});
	services.factory('MenuService',function($resource){
		return $resource('/Hungryapp/rest/admin',null,{
			
		});
	});
	services.factory('AdminService',function($resource){
		return $resource('/Hungryapp/rest/admin',null,{
			register : {
				url : '/Hungryapp/rest/admin/registerAsOwner',
				method : 'POST'
			},
			getRestaurantOwn : {
				url : 'Hungryapp/rest/admin/myRestaurant/:id',
				method : 'GET',
				params : {
					id : '@id'
				}
			},
			getManager : {
				url : 'Hungryapp/rest/admin/:id',
				method : 'GET',
				params : {
					id : '@id'
				}
			}
			
		});
	});
	services.factory('DataService', function() {
		var loggedInUser = {
				userid : "",
				adminid : "",
				isAdminR : false,
				isAuth : false
		};

		return loggedInUser;

	});
	control.controller('restaurantCreateCtrl', [ '$scope','$filter', function($scope,$filter) {
		$scope.progress = 25;
		$scope.res = {};
		$scope.openHour={};
		$scope.deliTime={};
		$scope.saveOpenTime = function(openHours){
			
			$scope.openHour={
				monday : new Date(openHours.mondayStart).toTimeString().substring(0,5) + '~' + new Date(openHours.mondayEnd).toTimeString().substring(0,5),
				tuesday : new Date(openHours.tuesdayStart).toTimeString().substring(0,5) + '~' +  new Date(openHours.tuesdayEnd).toTimeString().substring(0,5),
				wednesday : new Date(openHours.wednesdayStart).toTimeString().substring(0,5) + '~' +  new Date(openHours.wednesdayEnd).toTimeString().substring(0,5),
				thursday : new Date(openHours.thursdayStart).toTimeString().substring(0,5) + '~' +  new Date(openHours.thursdayEnd).toTimeString().substring(0,5),
				friday : new Date(openHours.fridayStart).toTimeString().substring(0,5) + '~' +  new Date(openHours.fridayEnd).toTimeString().substring(0,5),
				saturday : new Date(openHours.saturdayStart).toTimeString().substring(0,5) + '~' +  new Date(openHours.saturdayEnd).toTimeString().substring(0,5),
				sunday : new Date(openHours.sundayStart).toTimeString().substring(0,5) + '~' +  new Date(openHours.sundayEnd).toTimeString().substring(0,5)
			};
			console.log($scope.openHour);
		};
		$scope.saveDeliTime = function(delitime){
			$scope.deliTime={
					deliveryHour : delitime.start + '~' + delitime.end,
					deliveryNote : delitime.note
			};
			console.log(delitime);
			console.log($scope.deliTime);
		};
		
		
		
		$scope.next = function() {
			$scope.progress = $scope.progress + 25;
		};
		$scope.showOHModal = false;
		$scope.toggleOHModal = function() {
			$scope.showOHModal = !$scope.showOHModal;
		};
		
		$scope.showDHModal = false;
		$scope.toggleDHModal = function() {
			$scope.showDHModal = !$scope.showDHModal;
		};
	} ]);
	
	control.controller('restaurantDetailsCtrl', ['$scope', function($scope) {

	} ]);
	control.controller('forgotPasswordCtrl', [ '$scope', '$location',
			'$window', function($scope, $location, $window) {

			} ]);
	control.controller('storeOwnerContoller', [ '$scope', '$location',
			'$window', function($scope, $location, $window) {

			} ]);
	control.controller('managerRegisterCtrl', [ '$scope', '$location',
			'$window', 'AdminService', 'DataService',
			function($scope, $location, $window, AdminService, DataService) {
			
				$scope.registerNewManager = function(Manager) {
					delete Manager.confirmPassword;
					$scope.registeredManager = AdminService.register(Manager);
					$location.path('/Hungryapp');
				};

			} ]);
	

		control.controller('managerLoginCtrl', [ '$scope', '$location', '$window','$cookieStore','AuthService','DataService',
			function($scope, $location, $window,$cookieStore,AuthService,DataService) {
			$scope.loadadminId = function (id){
				$scope.adminid = id;
				DataService.adminid = $scope.adminid;
				DataService.isAdminR = true;
				DataService.isAuth = true;
			};
				$scope.login = function(credential, password) {
					
					$scope.status = AuthService.adminAuth({
						credential : credential,
						password : password
					}, function(data) {
						if (data.result === "success") {
							$scope.loadadminId(data.id);
							$cookieStore.put(data.id + "admin", data.name);
							console.log(DataService.adminid);
							credential = '';
							$location.path('/Hungryapp');
						} else {

						}
					});
					console.log(status.name);
				};

			} ]);
	control.controller('managerDetailsCtrl', [ '$scope', '$location',
			'$window','AdminService','DataService', function($scope, $location, $window,AdminService,DataService) {
				this.tab = 1;
				$scope.currentManager = {};
				$scope.onClickTab = function(tab) {
					this.tab = tab;
				};

				$scope.isActiveTab = function(checkTab) {
					return this.tab == checkTab;
				};
				$scope.editRestaurant = function(RestaurantId) {
					$location.path('/Hungryapp/restaurant');
				};
				
				$scope.updateAdmin = function(aAdmin){
					$scope.updatedAdmin = AdminService.updateAdmin(aAdmin);
					$scope.currentManager = $scope.updatedAdmin;
				};
				
				$scope.restaurantOwn = AdminService.getRestaurantOwn({ id  : DataService.adminid });
				$scope.currentManager = AdminService.getManager({ id : DataService.adminid });
				console.log($scope.restaurantOwn);

			} ]);
	control.controller('HomeController', [ '$scope', '$location', '$window',
			'$cookieStore', function($scope, $location, $window, $cookieStore) {

			} ]);
	control.controller('userdetailsCtrl', [ '$scope', 'DataService',
			'MemberService', function($scope, DataService, MemberService) {
				this.tab = 1;
				$scope.currentUser = {};
				$scope.onClickTab = function(tab) {
					this.tab = tab;
				};

				$scope.isActiveTab = function(checkTab) {
					return this.tab == checkTab;
				};
				$scope.checkUsername = function(data){
					
				};
				$scope.checkEmail = function(data){
					
				};
				$scope.checkMobile = function(data){
					
				};
				$scope.updateUser = function(aUser){
					$scope.updatedUser = MemberService.updateUser(aUser);
					$scope.currentUser = $scope.updatedUser;
				};
				
				$scope.historyOrders = MemberService.getHistoryOrders({ id  : DataService.userid });
				
				$scope.currentUser = MemberService.getUser({ id : DataService.userid });
				console.log($scope.historyOrders);
			} ]);

	control.controller('IndexController', [ '$scope', '$location', '$window',
			'$cookieStore', 'DataService',
			function($scope, $location, $window, $cookieStore, DataService) {
				$scope.isAdmin = function(){
					return DataService.isAdminR;
					};
				$scope.notLoggedIn = function() {
					$scope.name = $cookieStore.get(DataService.adminid+"admin");
					$scope.username = $cookieStore.get(DataService.userid);
					return !DataService.isAuth;
				};
				$scope.Logout = function() {
					if($scope.isAdmin()){
						$cookieStore.remove(DataService.adminid+"admin");
						DataService.adminid = "";
					}else{					
						$cookieStore.remove(DataService.userid);
						DataService.userid = "";
					}
					DataService.isAuth = false;
					$location.path('/Hungryapp');
				};

			} ]);
	control.controller('LoginController', [
			'$scope',
			'$location',
			'$window',
			'$cookieStore',
			'DataService',
			'AuthService',
			function($scope, $location, $window, $cookieStore, DataService,
					AuthService) {
				
				$scope.loadUserId = function (id){
					$scope.userid = id;
					DataService.userid = $scope.userid;
					DataService.isAuth = true;
					console.log(DataService.userid);
				};
				$scope.login = function(credential, password) {

					$scope.status = AuthService.auth({
						credential : credential,
						password : password
					}, function(data) {
						if (data.result === "success") {
							$scope.loadUserId(data.userid);
							console.log(DataService.userid);
							
							$cookieStore.put(data.userid, data.username);
							console.log($cookieStore.get(DataService.userid));
							credential = '';
							$location.path('/Hungryapp');
						} else {

						}
					});
					console.log(status.username);
				};
				
			} ]);
	control.controller('SignUpController', [ '$scope', '$location', '$window',
			'MemberService',
			function($scope, $location, $window, MemberService) {

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
					MemberService.register($scope.c);
					console.log("Successful Registered");
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
	directives.directive('openHourModal', function () {
	    return {
	      template: '<div class="modal fade">' + 
	          '<div class="modal-dialog">' + 
	            '<div class="modal-content">' + 
	              '<div class="modal-header">' + 
	                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
	                '<h4 class="modal-title">{{ title }}</h4>' + 
	              '</div>' + 
	              '<div class="modal-body" ng-transclude></div>' + 
	            '</div>' + 
	          '</div>' + 
	        '</div>',
	      restrict: 'E',
	      transclude: true,
	      replace:true,
	      scope:true,
	      link: function postLink(scope, element, attrs) {
	        scope.title = attrs.title;

	        scope.$watch(attrs.visible, function(value){
	          if(value == true)
	            $(element).modal('show');
	          else
	            $(element).modal('hide');
	        });

	        $(element).on('shown.bs.modal', function(){
	          scope.$apply(function(){
	            scope.$parent[attrs.visible] = true;
	          });
	        });

	        $(element).on('hidden.bs.modal', function(){
	          scope.$apply(function(){
	            scope.$parent[attrs.visible] = false;
	          });
	        });
	      }
	    };
	});
	directives.directive('deliveryHourModal', function () {
	    return {
	      template: '<div class="modal fade">' + 
	          '<div class="modal-dialog">' + 
	            '<div class="modal-content">' + 
	              '<div class="modal-header">' + 
	                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
	                '<h4 class="modal-title">{{ title }}</h4>' + 
	              '</div>' + 
	              '<div class="modal-body" ng-transclude></div>' + 
	            '</div>' + 
	          '</div>' + 
	        '</div>',
	      restrict: 'E',
	      transclude: true,
	      replace:true,
	      scope:true,
	      link: function postLink(scope, element, attrs) {
	        scope.title = attrs.title;

	        scope.$watch(attrs.visible, function(value){
	          if(value == true)
	            $(element).modal('show');
	          else
	            $(element).modal('hide');
	        });

	        $(element).on('shown.bs.modal', function(){
	          scope.$apply(function(){
	            scope.$parent[attrs.visible] = true;
	          });
	        });

	        $(element).on('hidden.bs.modal', function(){
	          scope.$apply(function(){
	            scope.$parent[attrs.visible] = false;
	          });
	        });
	      }
	    };
	});
	directives.directive('toggleCheckbox', function($timeout) {

        /**
         * Directive
         */
        return {
            restrict: 'A',
            transclude: true,
            replace: false,
            require: 'ngModel',
            link: function ($scope, $element, $attr, ngModel) {

                // update model from Element
                var updateModelFromElement = function() {
                    // If modified
                    var checked = $element.prop('checked');
                    if (checked != ngModel.$viewValue) {
                        // Update ngModel
                        ngModel.$setViewValue(checked);
                        $scope.$apply();
                    }
                };
                // Update input from Model
                var updateElementFromModel = function(newValue) {
                    $element.trigger('change');
                };

                // Observe: Element changes affect Model
                $element.on('change', function() {
                    updateModelFromElement();
                });

                $scope.$watch(function() {
                  return ngModel.$viewValue;
                }, function(newValue) { 
                  updateElementFromModel(newValue);
                }, true);

                // Initialise BootstrapToggle
                $element.bootstrapToggle();
            }
        };
    });
	
})();