"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// TODO: add testing framework

var points40 = [{ "x": 116, "y": 404 }, { "x": 161, "y": 617 }, { "x": 16, "y": 97 }, { "x": 430, "y": 536 }, { "x": 601, "y": 504 }, { "x": 425, "y": 461 }, { "x": 114, "y": 544 }, { "x": 127, "y": 118 }, { "x": 163, "y": 357 }, { "x": 704, "y": 104 }, { "x": 864, "y": 125 }, { "x": 847, "y": 523 }, { "x": 742, "y": 170 }, { "x": 204, "y": 601 }, { "x": 421, "y": 377 }, { "x": 808, "y": 49 }, { "x": 860, "y": 466 }, { "x": 844, "y": 294 }, { "x": 147, "y": 213 }, { "x": 550, "y": 124 }, { "x": 238, "y": 313 }, { "x": 57, "y": 572 }, { "x": 664, "y": 190 }, { "x": 612, "y": 644 }, { "x": 456, "y": 154 }, { "x": 120, "y": 477 }, { "x": 542, "y": 313 }, { "x": 620, "y": 29 }, { "x": 245, "y": 246 }, { "x": 611, "y": 578 }, { "x": 627, "y": 373 }, { "x": 534, "y": 286 }, { "x": 577, "y": 545 }, { "x": 539, "y": 340 }, { "x": 794, "y": 328 }, { "x": 855, "y": 139 }, { "x": 700, "y": 47 }, { "x": 275, "y": 593 }, { "x": 130, "y": 196 }, { "x": 863, "y": 35 }];

// get the distance from the starting point for each destination
var mapDistances = function mapDistances(point, destinations) {
  return destinations.map(function (destination) {
    var distanceX = Math.pow(point.x - destination.x, 2);
    var distanceY = Math.pow(point.y - destination.y, 2);
    return Math.sqrt(distanceX + distanceY);
  });
};

// finds the shortest distance between a point and it's potential destinations
var findShortestDestination = function findShortestDestination(point, destinations) {
  var remainingDestinations = [].concat(_toConsumableArray(destinations));
  var distances = mapDistances(point, remainingDestinations);
  // TODO: solve edge case for situations where there is a tie for the shortest distance
  var shortestDistance = Math.min.apply(Math, _toConsumableArray(distances));
  var shortestDestinationIndex = distances.indexOf(shortestDistance);
  var shortestDestination = remainingDestinations.splice(shortestDestinationIndex, 1)[0];

  return { shortestDestination: shortestDestination, remainingDestinations: remainingDestinations };
};

// finds and orders the shortest paths to each successive point
var createOptimalRouteFrom = function createOptimalRouteFrom(_ref) {
  var startingPoint = _ref.startingPoint,
      destinations = _ref.destinations,
      _ref$stops = _ref.stops,
      stops = _ref$stops === undefined ? [] : _ref$stops;

  // get the shortest distance from the starting point
  var finalStops = [].concat(_toConsumableArray(stops));
  var routeBuilder = function routeBuilder(_ref2) {
    var startingPoint = _ref2.startingPoint,
        destinations = _ref2.destinations;

    var _findShortestDestinat = findShortestDestination(startingPoint, destinations),
        shortestDestination = _findShortestDestinat.shortestDestination,
        remainingDestinations = _findShortestDestinat.remainingDestinations;

    // add the currentPoint to the list of stops


    finalStops.push(shortestDestination);

    // if there are no more destinations, we end the loop
    // TODO: add condition to escape the function if we get caught in some death loop
    if (!remainingDestinations || remainingDestinations.length === 0) {
      return finalStops;
    } else {
      return routeBuilder({
        startingPoint: shortestDestination,
        destinations: remainingDestinations
      });
    }
  };

  return routeBuilder({ startingPoint: startingPoint, destinations: destinations });
};

var startingPoint = points40[0];
var destinations = [].concat(points40).splice(1, points40.length - 1);
var stops = createOptimalRouteFrom({ startingPoint: startingPoint, destinations: destinations, stops: [startingPoint] });
stops.push(startingPoint);

console.log(stops);
