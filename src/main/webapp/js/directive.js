/**
 * 
 */
	var directives = angular.module('app.directives', []);

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
	directives.directive('onlyNum', function() {
        return function(scope, element, attrs) {

            var keyCode = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110];
            element.bind("keydown", function(event) {
                if($.inArray(event.which,keyCode) == -1) {
                    scope.$apply(function(){
                        scope.$eval(attrs.onlyNum);
                        event.preventDefault();
                    });
                    event.preventDefault();
                }

            });
        };
    })
	
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