angular.module('appcki.user')
    .factory('UserService', ['$http', '$localStorage','apiUrl', function($http, $localStorage, apiUrl){
        'use strict';

        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined' && token !==null) {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        function getUserFullName()
        {
            var user = getUserFromToken();
            var name = "%s ".sprintf(user.firstname);
            if(user.middlename)
            {
                name += "%s ".sprintf(user.middlename);
            }
            name += "%s".sprintf(user.lastname);

            return name;
        }

        function getUserFirstName()
        {
            var user = getUserFromToken();
            return user.firstname;
        }

        function getUserLastName()
        {
            var user = getUserFromToken;
            var name;
            if(user.middlename)
            {
                name = "%s %s".sprintf(user.middlename, user.lastname);
            } else {
                name = user.lastname;
            }

            return name;
        }


        var currentUser = getUserFromToken();

        return {
            getUserFromToken: getUserFromToken,
            fullname: getUserFullName,
            firstname : getUserFirstName,
            lastname : getUserLastName,
            signin: function(data, success, error) {
                $http({
                        url: apiUrl + 'login',
                        method: "GET",
                        params: data
                     }).then(
                        function(data, status, headers, config){
                            var token = headers("X-AUTH-TOKEN");
                            console.log("token = ["+token+"]");
                            $localStorage.token = token;
                            success(data);
                        },
                        error
                     )
            },
            me: function(success, error) {
                $http.get(apiUrl + '/user/current').then(
                success,
                error
                );
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            }
        };
    }
]);