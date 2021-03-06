////////
// This sample is published as part of the blog article at www.toptal.com/blog
// Visit www.toptal.com/blog and subscribe to our newsletter to read great posts
////////

'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
    .controller('SignupCtrl', function ($scope, $http, $log, alertService, $location, userService, signupService, apiUrl) {

      $scope.signup = function() {

        var payload = {
          email : $scope.email,
          password : $scope.password,
          phone : $scope.phone,
          name : $scope.name
        };

        signupService.signup(
          payload,
          function (res) {
            if(res.data.hasOwnProperty('success')) {
              userService.username = $scope.email;
              $location.path('/dashboard');
            }
          },
          function (res) {
            if(res.status === 400) {
              angular.forEach(res.data, function(value, key) {
                if(key === 'email' || key === 'password') {
                  alertService.add('danger', key + ' : ' + value);
                } else {
                  alertService.add('danger', value.message);
                }
              });
            }
            if(status === 500) {
              alertService.add('danger', 'Internal server error!');
            }
          }
        );
      };
    });
