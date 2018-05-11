'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: add testing framework

var TourMapper = function () {
  function TourMapper(points) {
    _classCallCheck(this, TourMapper);

    this.setRoute(points);
  }

  _createClass(TourMapper, [{
    key: 'setRoute',
    value: function setRoute(points) {
      var startingPoint = points[0];
      var destinations = [].concat(_toConsumableArray(points)).splice(1, points.length - 1);
      var stops = this.createOptimalRouteFrom({ startingPoint: startingPoint, destinations: destinations });
      stops.push(startingPoint);
      this.points = points;
      this.route = stops;
    }
  }, {
    key: 'getRoute',
    value: function getRoute() {
      return this.route;
    }

    // maps all potential distances from the starting point

  }, {
    key: 'mapDistances',
    value: function mapDistances(point, destinations) {
      return destinations.map(function (destination) {
        var distanceX = Math.pow(point.x - destination.x, 2);
        var distanceY = Math.pow(point.y - destination.y, 2);
        return Math.sqrt(distanceX + distanceY);
      });
    }

    // finds the shortest distance between a point and it's potential destinations

  }, {
    key: 'findShortestDestination',
    value: function findShortestDestination(point, destinations) {
      var remainingDestinations = [].concat(_toConsumableArray(destinations));
      var distances = this.mapDistances(point, remainingDestinations);
      // TODO: solve edge case for situations where there is a tie for the shortest distance
      var shortestDistance = Math.min.apply(Math, _toConsumableArray(distances));
      var shortestDestinationIndex = distances.indexOf(shortestDistance);
      var shortestDestination = remainingDestinations.splice(shortestDestinationIndex, 1)[0];

      return { shortestDestination: shortestDestination, remainingDestinations: remainingDestinations };
    }

    // finds and orders the shortest paths to each successive point

  }, {
    key: 'createOptimalRouteFrom',
    value: function createOptimalRouteFrom(_ref) {
      var startingPoint = _ref.startingPoint,
          destinations = _ref.destinations,
          stops = _ref.stops;

      var stopsToMake = stops || destinations.length; // how many stops are we accumulating in our route
      var route = [startingPoint]; // route to be returned by function; route begins with starting point as the first stop

      var currentPoint1 = void 0;
      var currentPoint2 = void 0;
      var firstHalf = [];
      var secondHalf = [];
      var remainingDestinations = destinations;
      for (var i = 0; i < stopsToMake; i += 2) {
        var startingPoint1 = currentPoint1 ? currentPoint1 : startingPoint;
        var startingPoint2 = currentPoint2 ? currentPoint2 : startingPoint;
        console.log('startingPoint1', startingPoint1);
        console.log('startingPoint1', startingPoint2);
        if (remainingDestinations && remainingDestinations.length > 0) {
          var route1 = this.findShortestDestination(startingPoint1, remainingDestinations);
          currentPoint1 = route1.shortestDestination;
          firstHalf.push(currentPoint1);
          remainingDestinations = route1.remainingDestinations;
        }

        if (remainingDestinations && remainingDestinations.length > 0) {
          var route2 = this.findShortestDestination(startingPoint2, remainingDestinations);
          currentPoint2 = route2.shortestDestination;
          secondHalf.push(currentPoint2);
          remainingDestinations = route2.remainingDestinations;
        }
      }

      return [].concat(firstHalf, _toConsumableArray(secondHalf.reverse()));
    }
  }, {
    key: 'createMap',
    value: function createMap() {
      var _this = this;

      //Create a Pixi Application
      var xCoords = this.points.map(function (point) {
        return point.x;
      });
      var minX = Math.min.apply(Math, _toConsumableArray(xCoords));
      var relXCoords = this.points.map(function (point) {
        return point.x - minX;
      });
      var maxX = Math.max.apply(Math, _toConsumableArray(relXCoords));

      var yCoords = this.points.map(function (point) {
        return point.y;
      });
      var minY = Math.min.apply(Math, _toConsumableArray(yCoords));
      var relYCoords = this.points.map(function (point) {
        return point.y - minY;
      });
      var maxY = Math.max.apply(Math, _toConsumableArray(relYCoords));

      var padding = 100;
      var markerContainer = document.getElementById('markers');
      var lineContainer = document.getElementById('lines');
      var canvasWidth = padding * 2 + maxX + 'px';
      var canvasHeight = padding * 2 + maxY + 'px';
      markerContainer.style.width = canvasWidth;
      markerContainer.style.height = canvasHeight;
      lineContainer.style.width = canvasWidth;
      lineContainer.style.height = canvasHeight;

      var tourMarkers = this.points.map(function (point, i) {
        var x = point.x,
            y = point.y;


        var marker = document.createElement('div');
        if (i === 0) {
          marker.classList.add('home');
        }
        marker.classList.add('marker');
        marker.style.left = x + padding - minX + 'px';
        marker.style.top = y + padding - minY + 'px';
        markerContainer.appendChild(marker);

        var label = document.createElement('div');
        label.classList.add('label');
        label.innerHTML = x + ', ' + y;
        label.style.left = x + padding - minX + 5 + 'px';
        label.style.top = y + padding - minY - 20 + 'px';
        markerContainer.appendChild(label);
      });

      var totalAnimationDuration = 0;
      var totalDistance = 0;
      var tourLines = this.route.map(function (point, i) {
        if (i < _this.route.length - 1) {
          var point2 = _this.route[i + 1];
          console.log(point, point2);
          var line = document.createElement('div');
          line.classList.add('line');
          line.style.width = '5px';
          var distanceX = Math.pow(point.x - point2.x, 2);
          var distanceY = Math.pow(point.y - point2.y, 2);
          var height = Math.sqrt(distanceX + distanceY);

          totalDistance += height;

          line.style.height = height + 'px';
          line.style.left = point.x + padding - minX + 5 + 'px';
          line.style.top = point.y + padding - minY - height + 5 + 'px';
          var angleRadians = Math.atan2(point2.y - point.y, point2.x - point.x);
          var angleDeg = Math.atan2(point2.y - point.y, point2.x - point.x) * 180 / Math.PI + 90;
          line.style.transform = 'rotate(' + angleDeg + 'deg)';

          var lineAnimation = document.createElement('div');
          lineAnimation.classList.add('line-animation');
          line.appendChild(lineAnimation);

          var duration = height / 500;
          lineAnimation.style.animationDuration = duration + 's';
          lineAnimation.style.animationDelay = totalAnimationDuration + 's';
          totalAnimationDuration += duration;

          lineContainer.appendChild(line);
        }
      });

      var distanceEl = document.createElement('h1');
      distanceEl.innerHTML = 'Total Distance: ' + Math.floor(totalDistance);
      document.body.appendChild(distanceEl);
    }
  }]);

  return TourMapper;
}();

var points = [{ "x": 116, "y": 404 }, { "x": 161, "y": 617 }, { "x": 16, "y": 97 }, { "x": 430, "y": 536 }, { "x": 601, "y": 504 }, { "x": 425, "y": 461 }, { "x": 114, "y": 544 }, { "x": 127, "y": 118 }, { "x": 163, "y": 357 }, { "x": 704, "y": 104 }, { "x": 864, "y": 125 }, { "x": 847, "y": 523 }, { "x": 742, "y": 170 }, { "x": 204, "y": 601 }, { "x": 421, "y": 377 }, { "x": 808, "y": 49 }, { "x": 860, "y": 466 }, { "x": 844, "y": 294 }, { "x": 147, "y": 213 }, { "x": 550, "y": 124 }, { "x": 238, "y": 313 }, { "x": 57, "y": 572 }, { "x": 664, "y": 190 }, { "x": 612, "y": 644 }, { "x": 456, "y": 154 }, { "x": 120, "y": 477 }, { "x": 542, "y": 313 }, { "x": 620, "y": 29 }, { "x": 245, "y": 246 }, { "x": 611, "y": 578 }, { "x": 627, "y": 373 }, { "x": 534, "y": 286 }, { "x": 577, "y": 545 }, { "x": 539, "y": 340 }, { "x": 794, "y": 328 }, { "x": 855, "y": 139 }, { "x": 700, "y": 47 }, { "x": 275, "y": 593 }, { "x": 130, "y": 196 }, { "x": 863, "y": 35 }];

var tour = new TourMapper(points);
tour.createMap();
