(function () {

  var appReference  = angular.module('WeatherApp');

  var googleApiKey = 'yourKey';
  var forecastIOKey = 'yourkey';

  var SearchService = function ($q, $http, $resource) {

    var onGeoLocation = function(response) {
      return response.data.results[0];
    };

    var onWeatherData = function (response) {
      return response.data.currently;
    };

    var onError = function (error) {
      console.log('Error:', error);
    };

    var getWeather = function(results) {
      var weatherInfo = {};

      //set address from googleapis
      weatherInfo.address = results.formatted_address;

      var latitude = results.geometry.location.lat;
      var longitude = results.geometry.location.lng;

      // https://api.forecast.io/forecast/APIKEY/LATITUDE,LONGITUDE
      var url = 'https://api.forecast.io/forecast/' +
      forecastIOKey + '/' + latitude + ',' + longitude + '?callback=JSON_CALLBACK';

      var weatherResource = $resource(url, {
        callback: 'JSON_CALLBACK',
      }, {
        get: {
          method: 'JSONP'
        }
      });

      return $http.jsonp(url)
      .then(onWeatherData, onError)
      .then(function (currently) {
        weatherInfo.currently = currently;
        return weatherInfo;
      });
    }

    var getLocation = function (location) {
      var url = 'https://maps.googleapis.com/maps/api/geocode/json?key=' +
      googleApiKey + '&address=' + location;

      return $http.get(url)
      .then(onGeoLocation, onError).then(getWeather, onError);
    };

    return {
      getLocation: getLocation
    };
  }

  // Create a Service to comunicate with the webs
  appReference.factory('SearchService', SearchService);
}());
