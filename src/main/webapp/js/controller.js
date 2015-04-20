/**
 * 
 */
var control = angular.module('app.controllers', [ 'ngCookies' ]);

control.controller('restListCtrl',['$scope','$location','DataService','RestaurantServices',function($scope,$location,DataService,RestaurantServices){
	var locationidList = DataService.RestaurantNearMe;
	$scope.restaurantList = [];
	console.log(locationidList);
	locationidList.forEach(function(locationid){
		//	if($scope.restaurantList.indexOf(locationid) == -1){
				$scope.restaurantList.push( RestaurantServices.getRestaurantByLocaId({id : locationid}));
				$scope.restaurantList.push(locationid);
			//}
					
	});
	
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

control.controller('restDetailsCtrl',['$scope','DataService', function($scope,DataService){
	$scope.currentRest = DataService.restaurant;
	$scope.isCus = function() {
		console.log(!DataService.isAdminR);
		return !DataService.isAdminR;
	};
	$scope.review = {};

    this.addReview = function(){
      $scope.currentRest.reviews.push($scope.review);
      $scope.review = {};
    };
}]);
control.controller('restaurantCreateCtrl', [ '$scope','$modal','$timeout','$http', 'RestaurantServices','AdminService','$cookieStore','MenuServices', function($scope,$modal,$timeout,$http, RestaurantServices,AdminService,$cookieStore,MenuServices) {
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
		$scope.generalManager ; 
		AdminService.getManager({ id :  $cookieStore.get('loggedInUser').id },function(data){
			$scope.generalManager.id = data.id;
			console.log(data); 
		});
		$scope.res.generalManager.id =  $scope.generalManager.id;
		console.log($scope.generalManager); 
		//AdminService.getManager({ id : DataService.adminid })

		RestaurantServices.newRest($scope.res);
	};
	
	$scope.activeRest = function(){
		$scope.res.status = "active";
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


	control.controller('managerLoginCtrl', [ '$scope', '$location', '$cookieStore','$cookieStore','AuthService','Base64',
		function($scope, $location, $cookieStore,$cookieStore,AuthService,Base64) {
		
			$scope.login = function(credential, password) {
				var basAuth =  Base64.encode(credential+':'+password);
				 AuthService.adminAuth({
					credential : credential
				},password, function(data) {
					if (data != null) {
						var loggedInUser = {
								username : data.name,
								id : data.id,
								role : 'admin'
						}
						$cookieStore.put('loggedInUser', loggedInUser);
						$cookieStore.put('basicAuth', basAuth);
						console.log(basAuth);
						credential = '';
						$location.path('/Hungryapp');
					} else {
						
					}
				});
			};

		} ]);
	
control.controller('managerDetailsCtrl', [ '$scope', '$location', '$cookieStore',
		'$window','AdminService','DataService', function($scope, $location,$cookieStore, $window,AdminService,DataService) {
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
			
			$scope.restaurantOwn = AdminService.getRestaurantOwn({ id  :  $cookieStore.get('loggedInUser').id  });
			$scope.currentManager = AdminService.getManager({ id :  $cookieStore.get('loggedInUser').id  });
			
			console.log("local Storage : " +  $cookieStore.get('loggedInUser'));
			console.log($scope.restaurantOwn);

		} ]);

control.controller('userdetailsCtrl', [ '$scope','Base64', 'DataService', '$cookieStore',
		'MemberService', function($scope,Base64, DataService,$cookieStore, MemberService) {
			this.tab = 1;
			//$scope.currentUser = {};
			$scope.enabled = false;
			$scope.$watch("currentUser", function() {
		          $scope.enabled = true;
		          console.log('called');
		  },true);
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
				//update authentication when user profile has changed
				$scope.enabled= true;
				var basic = $cookieStore.get('basicAuth');
				var decoded = Base64.decode(basic).split(":");
				
				$cookieStore.remove('basicAuth');
				var encoded = Base64.encode($scope.currentUser.username + ':' + decoded[1]);
				$cookieStore.put('basicAuth',encoded);
				
				$scope.currentUser = MemberService.updateUser(aUser);
			};
			
			$scope.historyOrders = MemberService.getHistoryOrders({ id  :  $cookieStore.get('loggedInUser').id });
			
			$scope.currentUser = MemberService.getUser({ id :  $cookieStore.get('loggedInUser').id });
			
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
										if($scope.RestaurantNearMe.indexOf(location) == -1){
											console.log(location);
											$scope.RestaurantNearMe.push(location.id);
//											$scope.RestaurantNearMe.restaurant.distance = distance;
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
//		DataService.location = $scope.
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
		'$cookieStore',  'DataService','AuthService',
		function($scope, $location, $window, $cookieStore, DataService,AuthService) {
		$scope.isHome = DataService.isHome;
		
		$scope.isCus = function() {
			if($cookieStore.get('loggedInUser') != null){
				return $cookieStore.get('loggedInUser').role == 'customer';
				}
		};
			
			$scope.isAdmin = function(){
				if($cookieStore.get('loggedInUser') != null){
					return $cookieStore.get('loggedInUser').role == 'admin';
					}
				};
			$scope.notLoggedIn = function() {
				
				if($cookieStore.get('loggedInUser') != null){
					$scope.name =  $cookieStore.get('loggedInUser').username;
					console.log($cookieStore.get('basicAuth'));
				}
				return $cookieStore.get('basicAuth') == null;
			};
			
			$scope.Logout = function() {
				$cookieStore.remove('loggedInUser');
				$cookieStore.remove('basicAuth');
				$location.path('Hungryapp');
			};
			$scope.viewProfile= function(){
				var userRole = $cookieStore.get('loggedInUser').role;
				if(userRole == 'customer'){
					
					$location.path('/userDetails');
				}else{
					$location.path('/managerDetails');
				}
				
			};

		} ]);
control.controller('LoginController', [
		'$scope',
		'$location',
		'$window',
		'$cookieStore',
		'$facebook', 
		'MemberService',
		'AuthService','Base64',
		function($scope, $location, $window, $cookieStore,$facebook, MemberService,
				AuthService,Base64) {
			
//			$scope.facebookLogin = function() {
//				console.log('login clicked');				
//			    $facebook.login().then(function(response) {
//			    	console.log(response);
//			    	if(response.status=='connected'){
//			    		//check DB 
//			    		var result = checkDB();
//			    		//DataService.isAuth = true;
//			    		
//			    		
//			    		if(result){
//			    			console.log('logged in.');
//			    			$location.path('/Hungryapp');
//			    		}else{
//			    			$location.path('/fbUserReg');
//			    		}
//			    		
//			    		
//			    	}
//			    });
				
//			  };
//			function checkDB(){
//				var result = false;
//				$facebook.api("/me").then( 
//				      function(response) {
					    	//LOCAL STORAGE
//				    	  MemberService.getUserByEmail({email : response.email}, function(data){
//				    		  if (data.result === "success") {
//				    			  var loggedInUser = {
//											username : data.username,
//											id : data.userid,
//											role : 'customer'
//									}
//									$cookieStore.put('loggedInUser', loggedInUser);
//									$cookieStore.put('basicAuth', basAuth);
//									result = true;
//								}
//				    	  });
//				    	  console.log('User Detail recived.');
//				    	  console.log(response);
//				      },
//				      function(err) {
//				    	  console.log("Please log in");
//				      });
//				return result;
//				};
			$scope.login = function(credential, password) {
				var basAuth = Base64.encode(credential+':'+password);
				AuthService.auth({credential : credential},password, function(data) {
					if (data.result === "success") {
						var loggedInUser = {
								username : data.username,
								id : data.userid,
								role : 'customer'
						}
						$cookieStore.put('loggedInUser', loggedInUser);
						$cookieStore.put('basicAuth', basAuth);
						credential = '';
						$location.path('/Hungryapp');
					}else{
						$scope.status = data;
					}
				});
				//console.log($scope.status.customer.userName);
				
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
				$location.path('/login');
			};
		} ]);

control.controller('fbUserRegisterCtrl', [ '$scope', '$location', '$window','$facebook',
		'MemberService', function($scope, $location, $window,$facebook, MemberService) {
			$scope.user = {};
			$scope.registerNewUser = function() {
				 
				 $facebook.api("/me").then( 
					      function(response) {
					    	  $scope.user = {
					    			  firstname : response.first_name,
					    			  surname : response.last_name,
					    			  email : response.email,
					    	  }
					    	  console.log('User Detail recived.');
					    	  console.log(response);
					      },
					      function(err) {
					    	  console.log("Please log in");
					      });
				$scope.c = {
					surname : $scope.user.surname,
					username : $scope.user.username,
					firstname : $scope.user.firstname,
					email : $scope.user.email,
					password : $scope.user.password,
					joinedDate : new Date().toDateString()
				};
				
			 MemberService.register($scope.c);
				console.log("Successful Registered");
				$location.path('/login');
			};
		} ]);




