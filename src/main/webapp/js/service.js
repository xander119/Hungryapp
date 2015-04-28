/**
 * 
 */
	var services = angular.module('app.service', [ 'ngResource' ]);

services.factory('AuthService', function($resource) { 

		return $resource('/Hungryapp/rest/Login/:credential', null, {
			auth : {
				method : 'POST',
				params : {
					credential : '@credential'
				}
			},
			adminAuth : {
				url : 'rest/Login/admin-:credential',
				method : 'POST',
				params : {
					credential : '@credential'
				}
			},
			isAuthenticated : {
				url : '/Hungryapp/rest/Login/:credential',
				method : 'GET',
				params : {
					credential : '@credential'
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
				},
				isArray : true
			},
			getUserByEmail : {
				url : 'rest/members/email/:email',
				method : 'GET',
				params : {
					id : '@email'
				}
			},
			createAddress : {
				url : 'rest/members/createAddress/:id',
				method : 'POST',
				params : {
					id : '@id'
				}

			},
			deleteAddress : {
				url : 'rest/members/deleteAddress/:id',
				method : 'DELETE',
				params : {
					id : '@id'
				}
			},
			saveReview : {
				url : 'rest/members/saveReview/:custId/:locationId',
				method : 'POST',
				params : {
					custId : '@custId',
					locationId : '@locationId'
				}
			},
			deleteReview : {
				url : 'rest/members/deleteReview/:id',
				method : 'DELETE',
				params : {
					id : '@id'
				}
			}

		});
	});
	services.factory('MenuService',function($resource){
		return $resource('/Hungryapp/rest/menus',null,{
			createMenu : {
				url : 'rest/menus/createMenu/:restId',
				method : 'POST',
				params : {
					restId : '@restId'
				}
			},
			getMenusByRestId : {
				url : 'rest/menus/restaurant/:id',
				method : 'GET',
				params : {
					id : '@id'
				},
				isArray : true
			},
			updateMenu : {
				url : 'rest/menus/updateMenu/:restId',
				method : 'PUT',
				params : {
					restId : '@restId'
				}
			},
			deleteMenu : {
				url : 'rest/menus/delete/:menuId',
				method : 'DELETE',
				params : {
					menuId : '@menuId'
				}
			},
			deleteMenuItem : {
				url : 'rest/menus/deleteItem/:itemId',
				method : 'DELETE',
				params : {
					itemId : '@itemId'
				}
			}
		});
	});
	services.factory('OrderService',function($resource){
		return $resource('/Hungryapp/rest/order',null,{
			createOrder : {
				url : 'rest/order/createOrder/:associateId',
				method : 'POST',
				params : {
					associateId : '@associateId'
				}
				
			},
			pendingOrders : {
				url : 'rest/order/pendingOrders/:id',
				method : 'GET',
				params : {
					id : '@id'
				},
				isArray : true
			},
			updateOrder : {
				url : 'rest/order/update/:id',
				method : 'POST',
				params : {
					id : '@id'
				}
			}
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
				},
				isArray : true
				
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
				url : 'rest/restaurants/createRestaurant/:managerid',
				method : 'POST',
				params : {
					managerid : '@managerid'
				}
			},
			createLocations : {
				url : 'rest/restaurants/createRestaurantLocation/:id',
				method : 'POST',
				params : {
					id : '@id'
				}
			},
			deleteLocation : {
				url : 'rest/restaurants/deleteLocation/:id',
				method : 'DELETE',
				params : {
					id : '@id'
				}
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
			},
			getRestaurantByLocaId : {
				url : 'rest/restaurants/location/:id',
				method : 'GET',
				params : {
					id : '@id'
				},
				isArray : true
			},
			updateRestaurantById : {
				url : 'rest/restaurants/updateRestaurant',
				method : 'PUT'
			},
			deleteRestaurantById : {
				url : 'rest/restaurants/delete/:id',
				method : 'DELETE',
				params : {
					id : '@id'
				}
			},
			updateRestaurantlocation : {
				url : 'rest/restaurants/updateRestaurantlocation/:id',
				method : 'PUT',
				params : {
					id : '@id'
				}
			},
			getRestaurantByItemId : {
				url : 'rest/restaurants/item/:id',
				method : 'GET',
				params : {
					id : '@id'
				}
			},
			getRestLocations: {
				url : 'rest/restaurants/:id/locations',
				method : 'GET',
				params : {
					id : '@id'
				},
				isArray : true
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
				isHome : false,
				location : {},
				fbUser : {},
				basicAuth : ''
				
		};

		return loggedInUser;

	});
	
	services.factory('myInterceptor', ['$q','$cookieStore', function ($q,$cookieStore) {
	    return {
	        request : function (config) {
	            config.headers['Authorization'] = 'Basic ' + $cookieStore.get('basicAuth');
	            console.log(config);
	            return config;
	        },
	        response : function (response) {
	            if (response.status === 403 || response.status === 401) {
	            	$location.path('/login');
	            }
	            return response || $q.when(response);
	        }
	    };
	}]);
	services.factory('counties', function(){
		return { getCounties : function(){
			 var counties = [ { area : 'Dublin 1', id : 1 }, { area : 'Dublin 2', id : 2 }, {
				area : 'Dublin 4',
				id : 4
			}, {
				area : 'Dublin 5',
				id : 5
			}, {
				area : 'Dublin 6',
				id : 6
			}, {
				area : 'Dublin 7',
				id : 7
			}, {
				area : 'Dublin 8',
				id : 8
			}, {
				area : 'Dublin 9',
				id : 9
			}, {
				area : 'Dublin 10',
				id : 10
			}, {
				area : 'Dublin 11',
				id : 11
			}, {
				area : 'Dublin 12',
				id : 12
			}, {
				area : 'Dublin 13',
				id : 13
			}, {
				area : 'Dublin 14',
				id : 14
			}, {
				area : 'Dublin 15',
				id : 15
			}, {
				area : 'Dublin 16',
				id : 16
			}, {
				area : 'Dublin 17',
				id : 17
			}, {
				area : 'Dublin 18',
				id : 18
			}, {
				area : 'Dublin 19',
				id : 19
			}, {
				area : 'Dublin 20',
				id : 20
			}, {
				area : 'Dublin 21',
				id : 21
			}, {
				area : 'Dublin 22',
				id : 22
			}, {
				area : 'Dublin 23',
				id : 23
			}, {
				area : 'Dublin 24',
				id : 24
			}, {
				area : 'Dublin city Center',
				id : 25
			}];
			 return counties;
		}}
	})
	
	//reference http://stackoverflow.com/questions/17959563/how-do-i-get-basic-auth-working-in-angularjs
	services.factory('Base64', function() {
	    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
return {
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },

    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
    }
};
});
	
	
	
	
	
	
	
	
	