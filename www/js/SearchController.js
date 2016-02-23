(function () {

  var appReference  = angular.module('WeatherApp');

  var SearchController = function ($scope, SearchService) {
    $scope.search =  function (query) {
      SearchService.getLocation(query)
      .then(function (result) {
        $scope.weather = result;
      });
    }

    $scope.change = function (change) {
      $scope.query = change;
    }
  };

  appReference.controller('SearchController', SearchController);

}());
