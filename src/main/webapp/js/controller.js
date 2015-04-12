/**
 * 
 */
var control = angular.module('app.controllers', [ 'ngCookies' ]);

control.controller('restListCtrl',['$scope','$location','DataService','RestaurantServices',function($scope,$location,DataService,RestaurantServices){
	$scope.restaurantList = DataService.RestaurantNearMe;
	DataService.isHome = false;
	console.log($scope.restaurantList);
	$scope.toDetails= function(rest){
		DataService.restaurant = rest;
		console.log(DataService.restaurant);
		$location.path('/restaurantDetails');
	};
}]);

control.controller('shoppingCartCtrl',['$scope','DataService',function($scope,DataService){
	
}]);

control.controller('restDetailsCtrl',['$scope','DataService','',function($scope,DataService){
	$scope.currentRest = DataService.restaurant;
	$scope.isCus = !DataService.isAdminR;
}]);
control.controller('restaurantCreateCtrl', [ '$scope','$modal','$timeout','$http','RestaurantServices','AdminService','DataService','MenuServices', function($scope,$modal,$timeout,$http,RestaurantServices,AdminService,DataService,MenuServices) {
	$scope.progress = 25;
	$scope.openHour = {};
	$scope.menus = [{name : '',
    				note : '',
    				items : [
    				         {name:'',description:'',price:''}
    				         ]
    }];
	$scope.tempLoc =[];
	$scope.restaurantLoc =[];
	var   geocoder = new google.maps.Geocoder();
	$scope.locateAddr = function(){
		var address = $scope.tempLoc.address;
		geocoder.geocode( { 'address': address}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK) {
		        $scope.map.setCenter(results[0].geometry.location);
		        $scope.map.panTo(results[0].geometry.location);
		        $scope.map.setZoom(13);
		        $scope.map.markers.restPosition.setPosition(results[0].geometry.location);
		      } else {
		        alert('Geocode was not successful for the following reason: ' + status);
		      }
		    });
	};
	
	 //start map 
	$scope.$watch('progress==50', function () {
		var map = $scope.map;
        window.setTimeout(function(){
        	google.maps.event.trigger(map, 'resize');
           },100);

		});
	
	$scope.updateMarker = function(){
		console.log($scope.map);
	};
	$scope.saveAddress = function(){
		
		console.log($scope.map);
		var lat = $scope.map.markers.restPosition.getPosition().lat();
		var lng = $scope.map.markers.restPosition.getPosition().lng();
		$scope.restaurantLoc.push({email:$scope.tempLoc.email, telephone : $scope.tempLoc.telephone,latitude: lat,longitude:lng,address:$scope.tempLoc.address});
		$scope.tempLoc = ''; 
		$scope.restaurantContactForm.$setPristine();
		console.log($scope.restaurantLoc);
		
	};
	$scope.deleteAddr = function(restLoc){
		 var index=$scope.restaurantLoc.indexOf(restLoc);
	      $scope.restaurantLoc.splice(index,1);     
	};
	
	$scope.addMenuForm = function(){
	      $scope.menus.push(
			                {name : '',
			                	note : '',
			                	items : [
			                	         {name:'',description:'',price:''}
			                	         ]
			                });
	      console.log($scope.menus);
	    };
	    $scope.addMenuItem = function(menu){
	      menu.items.push({name:'',description:'',price:''});
	    };
	    
	    
	$scope.deleteMenuItem = function(menu){
	};
	$scope.previous = function() {
		$scope.progress = $scope.progress - 25;
	};
	
	$scope.next = function() {
		
		if($scope.progress==25){
			console.log($scope.openHours);
			if($scope.openHours.monday==true){
				$scope.openHour.monday= new Date($scope.openHours.mondayStart).toTimeString().substring(0,5) + '~' + new Date($scope.openHours.mondayEnd).toTimeString().substring(0,5) ;
			}
			if($scope.openHours.tuesday==true){
				$scope.openHour.tuesday = new Date($scope.openHours.tuesdayStart).toTimeString().substring(0,5) + '~' +  new Date($scope.openHours.tuesdayEnd).toTimeString().substring(0,5);
			}
			if($scope.openHours.wednesday==true){
				$scope.openHour.wednesday = new Date($scope.openHours.wednesdayStart).toTimeString().substring(0,5) + '~' +  new Date($scope.openHours.wednesdayEnd).toTimeString().substring(0,5);
			}
			if($scope.openHours.thursday==true){
				$scope.openHour.thursday = new Date($scope.openHours.thursdayStart).toTimeString().substring(0,5) + '~' +  new Date($scope.openHours.thursdayEnd).toTimeString().substring(0,5);
			}
			if($scope.openHours.friday==true){
				$scope.openHour.friday = new Date($scope.openHours.fridayStart).toTimeString().substring(0,5) + '~' +  new Date($scope.openHours.fridayEnd).toTimeString().substring(0,5);
			}
			if($scope.openHours.saturday==true){
				$scope.openHour.saturday = new Date($scope.openHours.saturdayStart).toTimeString().substring(0,5) + '~' +  new Date($scope.openHours.saturdayEnd).toTimeString().substring(0,5);
			}
			if($scope.openHours.sunday==true){
				$scope.openHour.sunday = new Date($scope.openHours.sundayStart).toTimeString().substring(0,5) + '~' +  new Date($scope.openHours.sundayEnd).toTimeString().substring(0,5);
			}
		//add openhours and deliveryhours to restaurant details
			$scope.res.openHour = $scope.openHour;
			$scope.res.deliveryHour = new Date($scope.deliveryTime.start).toTimeString().substring(0,5) + '~' + new Date($scope.deliveryTime.end).toTimeString().substring(0,5);
			console.log($scope.res);
			

		}else if($scope.progress==50){
			$scope.res.locations = $scope.restaurantLoc;
			console.log($scope.res);
			
		}
		else if ($scope.progress==75){
			//add menu or items 
			$scope.res.menus = $scope.menus;
			console.log($scope.menus);
		}
		//persist to restaurant
		$scope.progress = $scope.progress + 25;
		console.log($scope.res);
	};
	
	$scope.finish = function(){
		//$scope.res.generalManager =  AdminService.getManager({ id : DataService.adminid });
		console.log($scope.res.generalManager); 
		//AdminService.getManager({ id : DataService.adminid })

		RestaurantServices.newRest($scope.res);
	};
	
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
//			$scope.checkUsername = function(data){
//				
//			};
//			$scope.checkEmail = function(data){
//				
//			};
//			$scope.checkMobile = function(data){
//				
//			};
			$scope.updateUser = function(aUser){
				$scope.updatedUser = MemberService.updateUser(aUser);
				$scope.currentUser = $scope.updatedUser;
			};
			
			$scope.historyOrders = MemberService.getHistoryOrders({ id  : DataService.userid });
			
			$scope.currentUser = MemberService.getUser({ id : DataService.userid });
			$scope.$watch("currentUser", function(newValue, oldValue) {
			      if(newValue!=oldValue){
			          $scope.enabled = true;
			          }
			      if(newValue ==  oldValue){
			          $scope.enabled = false;
			      }
			  },true);
			console.log($scope.historyOrders);
		} ]);
control.controller(
			'HomeCtrl',
			[
					'$scope',
					'$location',
					'$window',
					'$cookieStore',
					'$timeout',
					'$compile',
					'DataService',
					'RestaurantServices',
					function($scope, $location, $window, $cookieStore,
							$timeout, $compile, DataService,
							RestaurantServices) {
	var currentlat;
	var currentlng;
	var directionsService = new google.maps.DirectionsService();
	DataService.isHome = true;
	$scope.isHome = DataService.isHome;
	$scope.locations = [ {
							latitude : '53.335575',
							longitude : '-6.29167919218753'
						}, {
							latitude : '53.335575',
							longitude : '36.87652269296882'
						} ];
	$scope.RestaurantNearMe = [];
	$scope.allLocation  = RestaurantServices.allLocations();
	console.log($scope.allLocation);
	$scope.display = function() {
		console.log($scope.map);
		console.log( "latitude :" +currentlat + " longitude :" + currentlng);
	};
	
	$scope.getRList = function(){
		currentlat = $scope.myMarker.getPosition().lat();
		currentlng = $scope.myMarker.getPosition().lng();
		var end;
		var currentLoc = new google.maps.LatLng(currentlat, currentlng);
//		console.log($scope.allLocation);
		console.log(currentLoc);
		
		$scope.radius = 3;
		var radius = $scope.radius;
		$scope.allLocation.forEach(function(restaurant){
			//get locations of this restaurant
			$scope.locations = restaurant.locations;
			//for each restaurant cal distance and put it into near restaurant if in radius of 3km
			$scope.locations.forEach(function(location){
				end = new google.maps.LatLng(location.latitude, location.longitude);
				 var distance;
				 console.log(end + "end");
				    var request = {
				        origin: currentLoc,
				        destination: end,
				        travelMode: google.maps.DirectionsTravelMode.DRIVING
				    };

				    directionsService.route(request, function(response, status) {
				        if (status == google.maps.DirectionsStatus.OK) {
				             distance = response.routes[0].legs[0].distance.value / 1000;
				             console.log(distance+'km');
				             if(distance< radius){
									if(distance!=0){
										if($scope.RestaurantNearMe.indexOf(restaurant) == -1){
											$scope.RestaurantNearMe.push(restaurant);
										}
										
										console.log($scope.RestaurantNearMe);
									}
								};
				        }
				    });
			});
			 
			
		});
		
	};
	$scope.viewList = function(){
		DataService.RestaurantNearMe = $scope.RestaurantNearMe;
		$location.path('/restaurantList');
		console.log($scope.RestaurantNearMe);
		console.log(DataService.RestaurantNearMe);
	};
	$scope.showMe = function(position){
		$scope.markLat = position.coords.latitude;
		$scope.markLng = position.coords.longitude;
		$scope.currlatlng = new google.maps.LatLng($scope.markLat, $scope.markLng);
		console.log($scope.currlatlng);
		var contentString = '<div><span>I am here.</span><br> <button class="btn btn-link" ng-click="viewList()" >Near me</button> </div> ';
		var compiled = $compile(contentString)($scope);
		$scope.myMarker = new google.maps.Marker(
				{
					map: $scope.map,
					position: $scope.currlatlng , 
					animation : google.maps.Animation.DROP,
				    draggable:true
				}					
				);
		var Infowindow = new google.maps.InfoWindow({content : compiled[0]});
		Infowindow.open($scope.map,$scope.myMarker);

		google.maps.event.addListener($scope.myMarker, 'click', function() {
				Infowindow.open($scope.map,$scope.myMarker);
		  });
		
		google.maps.event.addListener($scope.myMarker, 'dragend', function() {
			$scope.getRList();
			});
		$scope.getRList();
	};

	 $scope.showError = function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    $scope.error = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.error = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    $scope.error = "The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    $scope.error = "An unknown error occurred.";
                    break;
            }
            $scope.$apply();
        };
       
	$scope.getCurrLoc = function(){
		if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.showMe,$scope.showError);
        }
        else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
	} ;
	$scope.getCurrLoc();
	$scope.backToMe = function(){
		$scope.map.panTo($scope.currlatlng);
		$scope.map.setZoom(13);
		$scope.myMarker.setPosition($scope.currlatlng);
		$scope.getRList();
	};
	
	
	

} ]);
control.controller('IndexController', [ '$scope', '$location', '$window',
		'$cookieStore', 'DataService',
		function($scope, $location, $window, $cookieStore, DataService) {
		$scope.isHome = DataService.isHome;
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
					joinedDate : new Date().toDateString()
				};
				
			 MemberService.register($scope.c);
				console.log("Successful Registered");
				$location.path('/Hungryapp');
			};
		} ]);