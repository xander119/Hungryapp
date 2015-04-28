/**
 * 
 */
var control = angular.module('app.controllers', [ 'ngCookies' ]);


//Update restaurant details, Menus and Locations in restaurantDetails Controller
//jackson infinite loop ERROR in restful service




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
		var addressId ;
		var order;
		var orders=[];
		var custId = $cookieStore.get('loggedInUser').id;
		var associateId;
		var temploc = [];
		console.log(items);
		console.log('customer id :' + custId);
		$scope.cusAddresses.forEach(function(data){
			if(data.check){
				addressId = data.id;
				console.log('address id :' + addressId);
			}
		})
		
		items.forEach(function(item){

			itemId = item.getId();
			var locationId= item.getData();
			
			console.log(itemId);
			console.log('location id :' + locationId);
			var index,duplicate;
			for(index = 0;index<temploc.length;index++){
				if(locationId == temploc[index]){
					duplicate = true;
					//update order in orders
					orders.forEach(function(order){
						if (order.locationId == locationId){
							order.totalPrice = order.totalPrice +( item.getQuantity() * item.getPrice());
							order.orderItems.push({id:itemId,quantity:item.getQuantity()});
						}
					})
					break;
				}
			}
			if(!duplicate){
				var order = {
						locationId : locationId,
						totalPrice : item.getQuantity() * item.getPrice(),
						orderItems : [{quantity:item.getQuantity(),item:{id:itemId}}]
				};
				temploc.push(locationId);
				//add to orders
				orders.push(order);
			}
		})
		console.log(orders);
		//customer, billing address , items, restaurant location;
		orders.forEach(function(order){
			var associateId = order.locationId+'-'+custId +'-'+addressId;
			order.paymentType = $scope.selectedType.type;
			
			delete order.locationId;
			console.log(order);
			OrderService.createOrder({associateId:associateId},order,function(data){
			});
		})
		ngCart.empty();
		$location.path('/placeOrder')
	};

}]);


control.controller('editeReviewModelC',['$scope','$cookieStore','$element','close','review','MemberService', function($scope,$cookieStore,$element, close,review,MenuService){
	$scope.review=review;
	console.log(review);
	$scope.max = 5;
	 $scope.hoveringOver = function(value) {
		    $scope.overStar = value;
		    $scope.percent = 100 * (value / $scope.max);
		  };
	$scope.save=function(){
		$element.modal('hide');
		close({review: $scope.review}, 500);
	};
	$scope.close=function(result){
		close(result, 500); 
	}
}]);
control.controller('editeLocationModelC',['$scope','$cookieStore','$element','close','MemberService','location', function($scope,$cookieStore,$element, close,MenuService,location){
	$scope.tempLoc = location;
	console.log(location)
	var map = $scope.map;
	var geocoder = new google.maps.Geocoder();
	var codeLatLng = function(){

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
	window.setTimeout(function(){
		google.maps.event.trigger(map, 'resize');
		map.panTo(map.markers.restPosition.getPosition());
		codeLatLng();
	},700);

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
	}
	$scope.updateMarker = function(){
		codeLatLng();
	}
	$scope.save=function(){
		$element.modal('hide');
		var lat = $scope.map.markers.restPosition.getPosition().lat();
		var lng = $scope.map.markers.restPosition.getPosition().lng();
		$scope.tempLoc.lantitude = lat;
		$scope.tempLoc.longitude = lng;
		close({location: $scope.tempLoc}, 500);
	};
	$scope.close=function(result){
		close(result, 500); 
	};
	
}]);


control.controller('restDetailsCtrl',['$scope','$cookieStore','ModalService','MemberService','RestaurantServices','MenuService', function($scope,$cookieStore,ModalService,MemberService,RestaurantServices,MenuService){



	
	$scope.max = 5;
	$scope.reviews = [];
	$scope.loggedInUser = $cookieStore.get('loggedInUser')
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
		//getCustomer by reviews 
	}
	console.log($scope.currentRest);
	//Update menu, location details open hour
	$scope.deleteAMenu= function(menu){
		var index=$scope.currentRest.menus.indexOf(menu);
		console.log(menu)
		MenuService.deleteMenu({menuId:menu.id},function(data){
			console.log(data);
			console.log('deleted');
		},function(data){
			console.log('fail')
		})
		$scope.currentRest.menus.splice(index,1);   
	};
	
	$scope.addAMenu= function(){
		$scope.currentRest.menus.push({name : '',
			note : '',
			items : [
			         {name:'',description:'',price:''}
			         ]
		});
	};
	$scope.addMenuItem = function(menu){
		console.log(menu)
		var index=$scope.currentRest.menus.indexOf(menu);
		$scope.currentRest.menus[index].items.push({name:'',description:'',price:''});
		console.log(menu)
	};
	$scope.deleteMenuItem= function(menu,item){
		var index=menu.items.indexOf(item);
		console.log(item)
		MenuService.deleteMenuItem({itemId:item.id},function(data){
			console.log(data);
			console.log('Item deleted ');
		},function(data){
			console.log('fail')
		})
		menu.items.splice(index,1); 
	};
	$scope.saveMenu = function(menu){
		//update menu
		var temp = [];
		menu.items.forEach(function(data){
			if(data.description != '' && data.name !='' && data.price != 0 ){
				temp.push(data);
			}
		});
		delete menu.itms;
		menu.items = temp;
		console.log(menu);
			MenuService.updateMenu({
				restId : $scope.currentRest.id,
			}, menu, function(data) {
				console.log('Menu saved.' + data.name);
			}, function(data) {
				alert(data);
				console.log(data);
			});
	};
	$scope.submitReview = function(review){
		var d = new Date();
		
		var date = d.getDate();
		var month = d.getMonth();
		month++;
		var year = d.getFullYear();
		var hour = d.getHours() ;
		var min = d.getMinutes() ;
		review.createDate = hour + ':'+min+' '+date+'/'+month+'/'+year;
		review.username = $scope.loggedInUser.username;
		//$scope.currentRest.locations[0].reviews.push(review);
		
		MemberService.saveReview({custId : $scope.loggedInUser.id, locationId : $scope.currentRest.locations[0].id},review,function(data) {
			console.log('Review saved.' + data.name);
		}, function(data) {
			alert(data);
			console.log(data);
		});
	};
	$scope.saveLocation= function(location){
		console.log(location);
		RestaurantServices.updateRestaurantlocation({id: $scope.currentRest.id},location,function(data){
			console.log(data);
		}, function(data) {
			alert("fail");
			console.log(data);
		});
	}
	$scope.configLocation = function(location){
		ModalService.showModal({
			templateUrl: 'partials/editLocationModal.html',
			controller: "editeLocationModelC",
			inputs : {
				location : location
			}
		}).then(function(modal) {
			modal.element.modal();
			modal.close.then(function(result) {
				console.log(result);
				var location;
				if(result != 'Cancel'){
					location = result.location;	
					//save location
					$scope.saveLocation(location);
				}
			},function(result){
				//modal error
				console.log(result);
			});
		})
	}
	$scope.deleteLocation = function(location){
		RestaurantServices.deleteLocation({id:location.id},function(data){
			console.log('success');
		},function(data){
			console.log(data);
		})
	}
	
	$scope.edit = function(review) {
		ModalService.showModal({
			templateUrl: 'partials/editeReviewModal.html',
			controller: "editeReviewModelC",
			inputs : {
				review : review
			}
		}).then(function(modal) {
			modal.element.modal();
			modal.close.then(function(result) {
				console.log(result);
				var review;
				if(result != 'Cancel'){
					review = result.review;	 
					MemberService.saveReview({custId : $scope.loggedInUser.id, locationId : $scope.currentRest.locations[0].id},review,function(data) {
						console.log('Review saved.' + data.name);
					}, function(data) {
						alert(data);
						console.log(data);
					});
				}
			},function(result){
				console.log(result);
			});
		})
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
				['$scope','$location',
						'RestaurantServices',
						'AdminService',
						'$cookieStore',
						'MenuService','ModalService',
						function($scope,$location,
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
					console.log('Menu created.' + data.name);
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
		$location.path('/home');
	};
		
	
	$scope.activeRest = function(){
		//$scope.restaurant={};
		 RestaurantServices.getRest({id:$scope.restaurant.id},function (result){
			 $scope.restaurant = result;
			 $scope.restaurant.status = 'active';
				console.log($scope.restaurant);
				//check requirement : 
				MenuService.getMenusByRestId({id : $scope.restaurant.id},function(data){
					console.log(data)
					console.log("getting menus ")
					if(data!=null){
						RestaurantServices.getRestLocations({id:$scope.restaurant.id},function(data){
							console.log(data)
							console.log("getting restaurant locations. ")
							if(data!=null){
								RestaurantServices.updateRestaurantById({id:$scope.restaurant.id},$scope.restaurant);
							}else{alert('You have not meet the requirement yet. Please provide more information.');};
						},function(data){
							alert('fail to get locations.')
						});
					}else{return false}
				},function(data){
					alert('fail to get menus.')
				});
		 });
		
		
		
		$location.path('/home');
	};

} ]);





control.controller('forgotPasswordCtrl', [ '$scope', '$location',
                                           '$window', function($scope, $location, $window) {

} ]);
control.controller('storeOwnerContoller', [ '$scope', '$location',
                                            '$window', function($scope, $location, $window) {

} ]);
control.controller('managerRegisterCtrl', [ '$scope', '$location','$cookieStore',
                                            '$window', 'AdminService', 'DataService','AuthService','Base64',
                                            function($scope, $location,$cookieStore, $window, AdminService, DataService,AuthService,Base64) {
	var login = function(credential, password) {
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
			console.log(loggedInUser);
			credential = '';
			$location.path('/Hungryapp');
		},function(err){
			$scope.status = err.data.result;
			console.log(err);
		});
	}
	$scope.registerNewManager = function(Manager) {
		
		delete Manager.confirmPassword;
		$scope.registeredManager = AdminService.register(Manager,function(data){
			login(Manager.name, Manager.password);
		});
		
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
		console.log(RestaurantId);
		RestaurantServices.deleteRestaurantById({id:RestaurantId},function(data){
			console.log(data);
			
		},function(data){
			console.log(data);
		})
		$window.location.reload();
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
			 };
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
		var temp = $scope.address.county.area ;
		delete $scope.address.county;
		$scope.address.county = temp;
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
control.controller ('pOCtrl', [ '$scope', '$location', '$window','$interval','ngCart','$cookieStore',
                                           'OrderService', function($scope, $location, $window,$interval,ngCart,$cookieStore, OrderService) {
	var custId = $cookieStore.get('loggedInUser').id;
	var paymentType ; 
	var checkStatus = window.setInterval(function(){
		OrderService.pendingOrders({id:custId},function(data){
			console.log(data);
			if (data == null) {
				window.clearInterval(checkStatus);
				console.log(paymentType);
				alert('Your order has been send.');
				$location.path('/home');
			}else{
				paymentType = data.paymentType;
			}
		});
	},10000,60);
	
} ]);



