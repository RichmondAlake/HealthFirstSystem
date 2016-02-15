
/**
 * Created by Richmond on 04/02/2016.
 */
var myApp = angular.module('TestController', ['ngRoute']);

myApp.controller('SearchController', function($scope, $http){
    $scope.search = function(){
        alert("Searching for patients");
    }
});