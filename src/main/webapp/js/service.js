/**
 * 
 */
	var services = angular.module('app.service', [ 'ngResource' ]);

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
				url : 'rest/Login/admin-:credential/:password',
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
				url : 'rest/members/register',
				method : 'POST'
			},
			getUser : {
				url : 'rest/members/myInfo/:id',
				method : 'GET',
				params : {
					id : '@id'
				}
			},
			updateUser : {
				url : 'rest/members/updateInfo',
				method : 'PUT'
			},
			getHistoryOrders : {
				url : 'rest/members/orders/:id',
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
		return $resource('rest/admin',null,{
			register : {
				url : 'rest/admin/registerAsOwner',
				method : 'POST'
			},
			getRestaurantOwn : {
				url : 'rest/admin/myRestaurant/:id',
				method : 'GET',
				params : {
					id : '@id'
				}
			},
			getManager : {
				url : 'rest/admin/:id',
				method : 'GET',
				params : {
					id : '@id'
				}
			}
			
		});
	});
	services.factory('RestaurantServices',function($resource){
		return $resource('rest/restaurants/',null,{
			newRest : {
				url : 'rest/restaurants/createRestaurant',
				method : 'POST'
			},
			allLocations : {
				url : 'rest/restaurants/allrestaurant/locations',
				method : 'GET',
				isArray : true
			},
			getRest : {
				url : 'rest/restaurants/:id',
				method : 'GET',
				params : {
					id : '@id'
				}
			}
		});
	});
	services.factory('MenuServices',function($resource){
		return $resource('/Hungryapp/rest/menus',null,{
			newMenu : {
				url : 'rest/menus/createMenu',
				method : 'POST'
			}
			
		});
	});
	services.factory('DataService', function() {
		var loggedInUser = {
				userid : "",
				adminid : "",
				isAdminR : false,
				isAuth : false,
				restaurant : {},
				RestaurantNearMe: [],
				isHome : false
				
		};

		return loggedInUser;

	});