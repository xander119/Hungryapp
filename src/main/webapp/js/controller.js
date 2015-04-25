/**
 * 
 */
var control = angular.module('app.controllers', [ 'ngCookies' ]);


//Update restaurant details, Menus and Locations in restaurantDetails Controller
//Working on shoppingCartCtrl at processedCheckout function () send email to location 




control.controller('restListCtrl',['$scope','$location','$cookieStore','DataService','RestaurantServices',function($scope,$location,$cookieStore,DataService,RestaurantServices){
	var locationidList = $cookieStore.get('RestaurantNearMe');
	$scope.restaurantList = [];
	locationidList.forEach(function(locationAndDist){
		 RestaurantServices.getRestaurantByLocaId({id: locationAndDist.id},function(data){
			
			data.forEach(function(restAndLoc){
				var restaurant = restAndLoc[0];
				var location = restAndLoc[1];
				 restaurant.locations =[];
				restaurant.locations.push(location);
				restaurant.distance = locationAndDist.distance;
				if($scope.restaurantList.indexOf(restaurant) == -1){
					$scope.restaurantList.push(restaurant);
				}
			})
		});});

	DataService.isHome = false;
	$scope.toDetails= function(locationId){
		if($cookieStore.get('RestDetails') !== undefined || $cookieStore.get('RestDetails') != null){
			$cookieStore.remove('RestDetails');
		}
		$cookieStore.put('RestDetails',locationId);
		$location.path('/restaurantDetails');
	};


}]);

control.controller('shoppingCartCtrl',['$scope','ngCart','$cookieStore','$location','DataService','MemberService','OrderService','counties',function($scope,ngCart,$cookieStore,$location,DataService,MemberService,OrderService,counties){
	$scope.ngCart = ngCart;
	$scope.counties = counties.getCounties();
	ngCart.setShipping(2.50);
	if($cookieStore.get('loggedInUser') !== undefined){
		 MemberService.getUser({ id :  $cookieStore.get('loggedInUser').id },function(data){
			$scope.currentUser = data;
			$scope.cusAddresses = data.addresses;
			if($scope.cusAddresses!=null){
				$scope.cusAddresses[0].checked = true;
			}
			console.log($scope.cusAddresses);
		});
		
	}
	
	
	$scope.checkOutClicked = false;
	$scope.noaddressSelected = function(){
		if($scope.cusAddresses!=null){
			var temp = [];
			$scope.cusAddresses.forEach(function(data){
				temp.push(data.check);
			})
			if(temp.indexOf(true) == -1){
				return true;
			}
			return false;
		}
	}
	$scope.muladdressSelected = function(){
		if($scope.cusAddresses!=null){
			console.log('checking')
			var temp = 0;
			$scope.cusAddresses.forEach(function(data){
				if(data.check){
					temp = temp + 1;
				}
			})
			if(temp >1){
				return true;
			}

		}
		return false;
	};
	$scope.payments = [{name:'Pay when delivered',type:'cash'},{name:'Pay online',type:'paypal'},{name:'Collection',type:'cash'}]
	$scope.checkOut= function(){
		if($scope.currentUser ==undefined){
			alert(' You are not logged in yet.')
			$location.path('/login');
		}else{
			$scope.checkOutClicked = true;
		}		
	}

	$scope.newAddressForm = function(){
		$scope.cusAddresses.push({line1:'',line2:'',line3:'',county:''})
	};
	$scope.saveAddress = function(address){
		delete address.check;
		console.log(address);
		address.county = address.county.area;
		MemberService.createAddress({id: $cookieStore.get('loggedInUser').id},address);
	};

	$scope.processedCheckout = function(){
		var items = ngCart.getItems();
		var itemId ;
		console.log(items)
		items.forEach(function(item){
			itemId = item.getId();
			console.log(itemId);
			console.log(item.getData());
//			var restaurant = getRestaurantByItemId({id:itemId});
//			var custId = $cookieStore.get('loggedInUser').id;
//			var restIdAndCustId = restaurant.id+':'+custId;
//			OrderService.createOrder({restIdAndCustId:restIdAndCustId},order);
			
		})
		var order = {
			totalPrice : ngCart.totalCost(),
			isComplete : 'false',
			orderedDate : new Date().getDate().toString(),
			orderItems : items
		};


		ngCart.empty();
		$location.path('/placeOrder')
	};

}]);

control.controller('restDetailsCtrl',['$scope','$cookieStore','RestaurantServices', function($scope,$cookieStore,RestaurantServices){
	
	
	$scope.max = 5;
	$scope.review = {};
	$scope.isAdmin = function(){
		if($cookieStore.get('loggedInUser') != null){
			return $cookieStore.get('loggedInUser').role == 'admin';
		}
		return false;
	};
	 $scope.hoveringOver = function(value) {
		    $scope.overStar = value;
		    $scope.percent = 100 * (value / $scope.max);
		  };
	
	if($scope.isAdmin()){
		$scope.currentRest = RestaurantServices.getRest({id:$cookieStore.get('RestDetails')},function(data){
			console.log(data);
		});
	}else{
		$scope.locationId = $cookieStore.get('RestDetails');
		RestaurantServices.getRestaurantByLocaId({id: $cookieStore.get('RestDetails')},function(data){
			console.log(data);
			data.forEach(function(restAndLoc){
				var restaurant = restAndLoc[0];
				var location = restAndLoc[1];
				 restaurant.locations =[];
				restaurant.locations.push(location);
				$scope.currentRest = restaurant;
			})
		});
	}
	//Update menu, location details open hour
	
	this.addReview = function(){
		$scope.currentRest.reviews.push($scope.review);
		$scope.review = {};
	};
}]);
control.controller('oHModalCtrl',['$scope','$element','close', function($scope,$element, close) {
	$scope.openHours;
	$scope.saveSettings = function(){
		
		$element.modal('hide');
		close({openHours: $scope.openHours}, 500);
	}
	 $scope.close = function(result) {
		 close(result, 500); // close, but give 500ms for bootstrap to
								// animate
	 };

	}]);
         						
control.controller('restaurantCreateCtrl',
				['$scope',
						'$modal',
						'$timeout',
						'$http',
						'RestaurantServices',
						'AdminService',
						'$cookieStore',
						'MenuService','ModalService',
						function($scope, $modal, $timeout, $http,
								RestaurantServices, AdminService, $cookieStore,
								MenuService,ModalService) {
	$scope.progress = 25;
	$scope.openHour = {};
	$scope.menus = [{name : '',
		note : '',
		items : [
		         {name:'',description:'',price:''}
		         ]
	}];
	$scope.tempLoc =[];
	$scope.restaurantLocations =[];
	var geocoder = new google.maps.Geocoder();

	$scope.locateAddr = function(){
		var address = $scope.tempLoc.address;
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				$scope.map.setCenter(results[0].geometry.location);
				$scope.map.panTo(results[0].geometry.location);
				$scope.map.setZoom(13);
				$scope.map.markers.restPosition.setPosition(results[0].geometry.location);
			} else {
				console.log('Geocode was not successful for the following reason: ' + status);
			}
		});
	};

	var codeLatLng = function () {
		var map = $scope.map;
		var lat = $scope.map.markers.restPosition.getPosition().lat();
		var lng = $scope.map.markers.restPosition.getPosition().lng();
		var latlng = new google.maps.LatLng(lat, lng);
		geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					$scope.tempLoc.address = results[1].formatted_address;
				} else {
					alert('No results found');
				}
			} else {
				console.log('Geocoder failed due to: ' + status);
			}
		});
	}
	//start map 
	$scope.$watch('progress==75', function () {
		var map = $scope.map;
		console.log(map);
		window.setTimeout(function(){
			google.maps.event.trigger(map, 'resize');
			map.panTo(map.markers.restPosition.getPosition());
			codeLatLng();
		},100);

	});

	$scope.updateMarker = function(){
		console.log($scope.map);
		codeLatLng();
	};
	$scope.configOpenHour = function() {
		ModalService.showModal({
			templateUrl: 'partials/openHourModal.html',
			controller: "oHModalCtrl"
		}).then(function(modal) {
			modal.element.modal();
			modal.close.then(function(result) {
				console.log(result);
				if(result != 'Cancel'){
					if(result.openHours.monday==true){
						$scope.openHour.monday= new Date(result.openHours.mondayStart).toTimeString().substring(0,5) + '~' + new Date(result.openHours.mondayEnd).toTimeString().substring(0,5) ;
					}
					if(result.openHours.tuesday==true){
						$scope.openHour.tuesday = new Date(result.openHours.tuesdayStart).toTimeString().substring(0,5) + '~' +  new Date(result.openHours.tuesdayEnd).toTimeString().substring(0,5);
					}
					if(result.openHours.wednesday==true){
						$scope.openHour.wednesday = new Date(result.openHours.wednesdayStart).toTimeString().substring(0,5) + '~' +  new Date(result.openHours.wednesdayEnd).toTimeString().substring(0,5);
					}
					if(result.openHours.thursday==true){
						$scope.openHour.thursday = new Date(result.openHours.thursdayStart).toTimeString().substring(0,5) + '~' +  new Date(result.openHours.thursdayEnd).toTimeString().substring(0,5);
					}
					if(result.openHours.friday==true){
						$scope.openHour.friday = new Date(result.openHours.fridayStart).toTimeString().substring(0,5) + '~' +  new Date(result.openHours.fridayEnd).toTimeString().substring(0,5);
					}
					if(result.openHours.saturday==true){
						$scope.openHour.saturday = new Date(result.openHours.saturdayStart).toTimeString().substring(0,5) + '~' +  new Date(result.openHours.saturdayEnd).toTimeString().substring(0,5);
					}
					if(result.openHours.sunday==true){
						$scope.openHour.sunday = new Date(result.openHours.sundayStart).toTimeString().substring(0,5) + '~' +  new Date(result.openHours.sundayEnd).toTimeString().substring(0,5);
					}
					console.log($scope.openHour);
				}
			});
		})
	};
	$scope.saveAddress = function(){
		console.log($scope.map);
		$scope.deliveryHour = new Date($scope.delivery.deliveryTime.start).toTimeString().substring(0,5) + '~' + new Date($scope.delivery.deliveryTime.end).toTimeString().substring(0,5);
		var lat = $scope.map.markers.restPosition.getPosition().lat();
		var lng = $scope.map.markers.restPosition.getPosition().lng();
		$scope.restaurantLocations.push({
									email : $scope.tempLoc.email,
									telephone : $scope.tempLoc.telephone,
									latitude : lat,
									longitude : lng,
									address : $scope.tempLoc.address,
									openHour : $scope.openHour,
									deliveryHour : $scope.deliveryHour,
									deliveryNote : $scope.delivery.deliveryNote
								});
		$scope.tempLoc = ''; 
		$scope.delivery = '';
		console.log($scope.restaurantLocations);

	};
	$scope.saveAllLocations = function(){
		$scope.restaurantLocations.forEach(function(location){
			RestaurantServices.createLocations({id: $scope.restaurant.id},location,function(data){
				console.log(data);
			},function(data){
				alert(data);
			});
		})
		$scope.progress = $scope.progress + 25;
	}
	
	$scope.deleteAddr = function(restLoc){
		var index=$scope.restaurantLocations.indexOf(restLoc);
		$scope.restaurantLocations.splice(index,1);     
	};
	
	$scope.saveRestaurant = function(){
		console.log($scope.res);
		
		$scope.restaurant = RestaurantServices.newRest({managerid :$cookieStore.get('loggedInUser').id },$scope.res,function(data){
			console.log(data)
		},function (data){
			alert(data);
			console.log(data);
		});
		console.log($scope.restaurant);
		$scope.progress = $scope.progress  +  25;
	}

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


	$scope.deleteMenuItem = function(menu,item){
		var index=menu.items.indexOf(item);
		menu.items.splice(index,1);   
	};
	$scope.deleteAMenu = function(menu){
		var index=$scope.menus.indexOf(menu);
		$scope.menus.splice(index,1);   
	};
	$scope.previous = function() {
		$scope.progress = $scope.progress - 25;
	};
	$scope.saveMenus = function(){
		console.log($scope.menus);
		if ($scope.menus!=null) {
			$scope.menus.forEach(function(menu) {
				MenuService.createMenu({
					restId : $scope.restaurant.id
				}, menu, function(data) {
					alert('Menu created!')
				}, function(data) {
					alert(data);
					console.log(data);
				})
			});
			$scope.progress = $scope.progress + 25;
		}
		console.log($scope.menus);
	}
	$scope.finish = function(){
		RestaurantServices.newRest({managerid :$cookieStore.get('loggedInUser').id },$scope.res,function(data){
			console.log(data)
		});
	};
		
	var requirementCheck = function(rest){
		var menus = false;
		MenuService.getMenusByRestId({id : rest.id},function(data){
			console.log(data)
			console.log("getting menus ")
			if(data!=null)
				menus =true;
		},function(data){
			alert('fail to get menus.')
		})
		var locations = false;
		RestaurantServices.getRestLocations({id:rest.id},function(data){
			console.log(data)
			console.log("getting restaurant locations. ")
			if(data!=null)
				locations =true;
		},function(data){
			alert('fail to get menus.')
		})
		if(menus == true&&locations==true){
			return true;
		}else{
			return false;
		}
		
	}
	$scope.activeRest = function(){
		$scope.restaurant = RestaurantServices.getRest({id:$scope.restaurant.id});
		$scope.restaurant.status = "active";
		console.log($scope.restaurant);
		if(requirementCheck($scope.restaurant)){
			RestaurantServices.updateRestaurantById({id:$scope.restaurant.id});
		}else{
			alert('You have not meet the requirement yet. Please provide more information.');
		}
		$location.path('/managerDetails');
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
			//success
			var loggedInUser = {
					username : data.name,
					id : data.id,
					role : 'admin'
			}
			$cookieStore.put('loggedInUser', loggedInUser);
			$cookieStore.put('basicAuth', basAuth);
			console.log(data);
			console.log(basAuth);
			console.log(loggedInUser);
			credential = '';
			$location.path('/Hungryapp');
		},function(err){
			$scope.status = err.data.result;
			console.log(err);
		});
	};

} ]);

control.controller('managerDetailsCtrl', [ '$scope', '$location', '$cookieStore',
                                           '$window','RestaurantServices','AdminService','DataService', function($scope, $location,$cookieStore, $window,RestaurantServices,AdminService,DataService) {
	this.tab = 1;
	$scope.currentManager = {};
	$scope.restaurantOwn = [];
	$scope.onClickTab = function(tab) {
		this.tab = tab;
	};

	$scope.isActiveTab = function(checkTab) {
		return this.tab == checkTab;
	};
	

	$scope.updateAdmin = function(aAdmin){
		var basic = $cookieStore.get('basicAuth');
		var decoded = Base64.decode(basic).split(":");

		$cookieStore.remove('basicAuth');
		var encoded = Base64.encode($scope.currentManager.name + ':' + decoded[1]);
		$cookieStore.put('basicAuth',encoded);

		$scope.currentManager = AdminService.updateAdmin(aAdmin);
	};

	$scope.restaurantOwn = AdminService.getRestaurantOwn({ id  :  $cookieStore.get('loggedInUser').id  },function(data){
	});
	$scope.currentManager = AdminService.getManager({ id :  $cookieStore.get('loggedInUser').id  }, function(data){
	});

	//$scope.restaurantOwn = restaurants;
	$scope.editRestaurant = function(RestaurantId){
		if($cookieStore.get('RestDetails') !== undefined || $cookieStore.get('RestDetails') != null){
			$cookieStore.remove('RestDetails');
		}
		$cookieStore.put('RestDetails',RestaurantId);
		$location.path('/restaurantDetails');
	};
	$scope.deleteRestaurant = function(RestaurantId){
		RestaurantServices.deleteRestaurantById({id:RestaurantId},function(data){
			console.log(data);
		},function(data){
			console.log(data);
		})
		$location.path('/managerDetails');
	};
	
	console.log($scope.currentManager);
	console.log($scope.restaurantOwn);

} ]);

control.controller('userdetailsCtrl', [ '$scope','Base64', 'DataService', '$cookieStore','$timeout','counties',
                                        'MemberService', function($scope,Base64, DataService,$cookieStore,$timeout,counties, MemberService) {
	$scope.counties = counties.getCounties();
	this.tab = 1;
	var initializing = true ;
	$scope.enabled = false;
	
	
	$scope.onClickTab = function(tab) {
		this.tab = tab;
	};

	$scope.isActiveTab = function(checkTab) {
		return this.tab == checkTab;
	};
//	$scope.checkUsername = function(data){

//	};
//	$scope.checkEmail = function(data){

//	};
//	$scope.checkMobile = function(data){

//	};
	var addressSaved = false;
	$scope.deleteAddressForm =function(address){
		var index=$scope.cusAddresses.indexOf(address);
		MemberService.deleteAddress({id:address.id},function(data){
			console.log('deleted')
		})
		$scope.cusAddresses.splice(index,1);  
	}

	$scope.updateUser = function(aUser){
		//update authentication when user profile has changed
		if(angular.isDefined(aUser.dateOfBrith) || aUser.dateOfBrith.toString() !=null || aUser.dateOfBrith !=null){
			var d = aUser.dateOfBrith;			
			if(aUser.dateOfBrith ==null){
				aUser.dateOfBrith= null;
			}else{
				var date = d.getDate();
				var month = d.getMonth();
				month++;
				var year = d.getFullYear();
				aUser.dateOfBrith = date + "/" + month + "/" + year;
			}
		}
		$scope.enabled = false;
		initializing= true;
		var basic = $cookieStore.get('basicAuth');
		var decoded = Base64.decode(basic).split(":");

		$cookieStore.remove('basicAuth');
		var encoded = Base64.encode($scope.currentUser.username + ':' + decoded[1]);
		$cookieStore.put('basicAuth',encoded);

		$scope.currentUser = MemberService.updateUser(aUser);
	};
	
	$scope.historyOrders = MemberService.getHistoryOrders({ id  :  $cookieStore.get('loggedInUser').id });

	$scope.currentUser = MemberService.getUser({ id :  $cookieStore.get('loggedInUser').id },function(data){
		$scope.cusAddresses = data.addresses;
		
	});
	
	console.log($scope.historyOrders);
	
	$scope.newAddressForm = function(){
		$scope.cusAddresses.push({line1:'',line2:'',line3:'',county:''});
	};
	$scope.saveAddress = function(address){
		console.log(address);
		address.county = address.county.area;
		MemberService.createAddress({id: $cookieStore.get('loggedInUser').id},address,function(data){
			addressSaved = true;
		});
		if(addressSaved){
			 MemberService.getUser({ id :  $cookieStore.get('loggedInUser').id },function(data){
					$scope.cusAddresses = data.addresses;
				});
		}
		
	};
		$scope.$watchCollection("currentUser", function() {
			if(initializing){
				$scope.enabled = false;
				$timeout(function() { initializing = false; },1000);
			}else{
				$scope.enabled = true;
			}
			
		},true);
	console.log($scope.currentUser);

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
			 var idAndDist ={};
			 var radius = 3;
			 $scope.RestaurantNearMe = [];
			 $scope.Restaurants= [];
			 $scope.allLocations  = RestaurantServices.allLocations();
			 console.log($scope.allLocations);
			
			 var calculateDist = function(end,currentLoc,location){
				 
				 var distance;
				 var request = {
						 origin: currentLoc,
						 destination: end,
						 travelMode: google.maps.DirectionsTravelMode.DRIVING
				 };
				 console.log(end + "end");
				 directionsService.route(request, function(response, status) {

					 if (status == google.maps.DirectionsStatus.OK) {
						 console.log(response);
						 var exist = false;
						 distance = response.routes[0].legs[0].distance.value / 1000;
						 if(distance>0){
							 idAndDist = { id : location.id, distance : distance};
							 console.log(distance+'km');
							 console.log(idAndDist);
							
							 if($scope.Restaurants.length == 0){
								 $scope.Restaurants.push(idAndDist);
							 }
							 $scope.Restaurants.forEach(function(data){
								 
								 if(data.id == location.id){
									 exist = true;
									 data.distance = distance;
									 console.log(data.id);
								 }
							 })
							 if(!exist){
								 $scope.Restaurants.push(idAndDist);
							 }
							console.log( $scope.Restaurants );
						 }
						 
					 }
				 });

			 }
			 $scope.getRList = function(){
				 currentlat = $scope.myMarker.getPosition().lat();
				 currentlng = $scope.myMarker.getPosition().lng();

				 var currentLoc = new google.maps.LatLng(currentlat, currentlng);
				 var  idAndDist = {};

				 //for each location cal distance and put it into near restaurant if in radius of 3km
				 $scope.allLocations.forEach(function(location){
					 var end = new google.maps.LatLng(location.latitude, location.longitude);
					 calculateDist(end,currentLoc,location);
				 });

			 };
			 var filterRest = function(){
				 if($scope.RestaurantNearMe != null || $scope.RestaurantNearMe!==undefined || $scope.RestaurantNearMe.length !=0){
					 $scope.RestaurantNearMe = [];
				 }
				 $scope.Restaurants.forEach(function(idAndDistance){
					 if(idAndDistance.distance < radius){
						 console.log('push')
						 $scope.RestaurantNearMe.push(idAndDistance);
					 } 
				 })
			 }
			 $scope.viewList = function(){
				 
				 if( $cookieStore.get('RestaurantNearMe') !== undefined || $cookieStore.get('RestaurantNearMe') != null){
					 console.log('Restaurant is defined in CookieStore');
					 $cookieStore.remove('RestaurantNearMe');
				 }
				 filterRest();
				 console.log($scope.RestaurantNearMe);
				 $cookieStore.put('RestaurantNearMe',$scope.RestaurantNearMe);
				 $location.path('/restaurantList');

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
                                        '$cookieStore',  'DataService','AuthService','ngCart',
                                        function($scope, $location, $window, $cookieStore, DataService,AuthService,ngCart) {
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
		return false;
	};
	$scope.notLoggedIn = function() {

		if($cookieStore.get('loggedInUser') != null){
			$scope.name =  $cookieStore.get('loggedInUser').username;
		}
		return $cookieStore.get('basicAuth') == null;
	};

	$scope.Logout = function() {
		$cookieStore.remove('loggedInUser');
		$cookieStore.remove('basicAuth');
		$location.path('/Hungryapp');
		var items = ngCart.getItems();
		items.forEach(function(item){
			ngCart.removeItemById(item.id);
		})
		console.log(ngCart.getItems());
		//ngCart.empty;

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
control.controller('LoginController', ['$scope','$location', '$window','$cookieStore','$facebook', 'MemberService','AuthService','Base64', function($scope, $location, $window, $cookieStore,$facebook, MemberService,
                                    		   AuthService,Base64) 
                                    		   {


//	$scope.facebookLogin = function() {
//	console.log('login clicked');				
//	$facebook.login().then(function(response) {
//	console.log(response);
//	if(response.status=='connected'){
//	//check DB 
//	var result = checkDB();
//	//DataService.isAuth = true;


//	if(result){
//	console.log('logged in.');
//	$location.path('/Hungryapp');
//	}else{
//	$location.path('/fbUserReg');
//	}


//	}
//	});

//	};
//	function checkDB(){
//	var result = false;
//	$facebook.api("/me").then( 
//	function(response) {
	//LOCAL STORAGE
//	MemberService.getUserByEmail({email : response.email}, function(data){
//	if (data.result === "success") {
//	var loggedInUser = {
//	username : data.username,
//	id : data.userid,
//	role : 'customer'
//	}
//	$cookieStore.put('loggedInUser', loggedInUser);
//	$cookieStore.put('basicAuth', basAuth);
//	result = true;
//	}
//	});
//	console.log('User Detail recived.');
//	console.log(response);
//	},
//	function(err) {
//	console.log("Please log in");
//	});
//	return result;
//	};
//	 if ($location.protocol() != 'https')
//	        $window.location.href = $location.absUrl().replace('http', 'https');
	$scope.login = function(credential, password) {
		var basAuth = Base64.encode(credential+':'+password);
		AuthService.auth({credential : credential},password, function(data) {

			var loggedInUser = {
					username : data.username,
					id : data.userid,
					role : 'customer'
			}
			$cookieStore.put('loggedInUser', loggedInUser);
			$cookieStore.put('basicAuth', basAuth);
			credential = '';
			$location.path('/Hungryapp');
		},function(err){
			$scope.status = err.data.result;
			console.log(err);
		});
		//console.log($scope.status.customer.userName);

	};
} ]);
control.controller('ModalCtrl',['$scope','$location','$element','close','counties', function($scope,$location,$element, close,counties) {
	$scope.address;
	$scope.counties = counties.getCounties();
	$scope.saveAddress = function(){
		
		$element.modal('hide');
		close({address: $scope.address}, 500);
		$location.path('/Hungryapp');
	}
	 $scope.close = function(result) {
		 close(result, 500); 
	 	$location.path('/Hungryapp');
	 };

	}]);
control.controller('SignUpController', [ '$scope', '$location', '$window','$cookieStore','Base64',
                                         'MemberService','AuthService','ModalService',
                                         function($scope, $location, $window,$cookieStore,Base64, MemberService,AuthService,ModalService) {
	$scope.test= function(){
		$location.path('/Hungryapp');
		show();
	}
	var show = function() {
		ModalService.showModal({
			templateUrl: 'partials/addressModal.html',
			controller: "ModalCtrl"
		}).then(function(modal) {
			modal.element.modal();
			
			modal.close.then(function(result) {
				console.log(result);
				var address;
				if(result != 'Cancel'){
					 address = result.address;
					 delete address.county ;
					 address.county = result.address.county.area;
					 
					 MemberService.createAddress({id: $cookieStore.get('loggedInUser').id},address);
				}
			},function(result){
				console.log(result);
			});
		})
	};
	var login = function(credential, password) {
		   var basAuth = Base64.encode(credential+':'+password);
		   console.log(basAuth);
		   AuthService.auth({credential : credential},password, function(data) {
			   var loggedInUser = {
					   username : data.username,
					   id : data.userid,
					   role : 'customer'
			   }
			   $cookieStore.put('loggedInUser', loggedInUser);
			   $cookieStore.put('basicAuth', basAuth);
			   credential = '';
		   },function(err){
			   $scope.status = err.data.result;
			   console.log(err);
		   });
	}
	$scope.registerNewUser = function(Customer) {
		delete Customer.confirmPassword;
		var c = {
				surname : Customer.surname,
				username : Customer.username,
				firstname : Customer.firstname,
				email : Customer.email,
				password : Customer.password,
				joinedDate : new Date().toDateString(),
		};

		MemberService.register(c,function(result){
			login(c.username,c.password);
			$location.path('/Hungryapp');
			show();
			console.log("Successful Registered");
		},function(result){
			console.log(result);
			alert('Fail to Resiger');
		});
		
		
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
control.controller ('pOCtrl', [ '$scope', '$location', '$window','$facebook',
                                           'MemberService', function($scope, $location, $window,$facebook, MemberService) {
	
} ]);



