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
      var accuracy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

      var remainingDestinations = [].concat(_toConsumableArray(destinations));
      var distances = this.mapDistances(point, remainingDestinations);
      // TODO: solve edge case for situations where there is a tie for the shortest distance

      var shortestDistances = [].concat(_toConsumableArray(distances)).sort(function (a, b) {
        return a - b;
      }).splice(0, Math.max(5, distances.length));

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

      var currentPoint1 = void 0;
      var currentPoint2 = void 0;
      var firstHalf = [startingPoint]; // route begins with starting point as the first stop
      var secondHalf = [];
      var remainingDestinations = destinations;
      for (var i = 0; i < stopsToMake; i += 2) {
        var startingPoint1 = currentPoint1 ? currentPoint1 : startingPoint;
        var startingPoint2 = currentPoint2 ? currentPoint2 : startingPoint;

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

      var handleMarkerHover = function handleMarkerHover(e) {
        var activeElements = document.getElementsByClassName('marker--active');
        console.log(activeElements);
        if (activeElements && activeElements.length > 0) {
          for (var i = 0; i < activeElements.length; i++) {
            activeElements[i].classList.remove('marker--active');
          }
        }
        e.target.classList.add('marker--active');
      };

      var handleMarkerLeave = function handleMarkerLeave(e) {
        e.target.classList.remove('marker--active');
      };

      var tourMarkers = this.points.map(function (point, i) {
        var x = point.x,
            y = point.y;


        var marker = document.createElement('div');
        if (i === 0) {
          marker.classList.add('home', 'marker--active');
        }

        marker.classList.add('marker');
        marker.style.left = x + padding - minX + 'px';
        marker.style.top = y + padding - minY + 'px';
        markerContainer.appendChild(marker);
        marker.addEventListener('mouseover', handleMarkerHover);
        marker.addEventListener('mouseleave', handleMarkerLeave);

        var label = document.createElement('div');
        label.classList.add('label');
        var stopNumber = _this.route.indexOf(point);
        label.innerHTML = (i === 0 ? 'Home' : 'Stop ' + stopNumber) + ' - (' + x + ', ' + y + ')';
        marker.appendChild(label);

        var markerContent = document.createElement('div');
        markerContent.classList.add('marker-content');
        marker.appendChild(markerContent);

        var circle = document.createElement('div');
        circle.classList.add('circle');
        markerContent.appendChild(circle);

        var column = document.createElement('div');
        column.classList.add('column');
        markerContent.appendChild(column);
      });

      var totalAnimationDuration = 0;
      var totalDistance = 0;
      var tourLines = this.route.map(function (point, i) {
        if (i < _this.route.length - 1) {
          var point2 = _this.route[i + 1];
          var line = document.createElement('div');
          line.classList.add('line');
          line.style.width = '5px';

          var distanceX = Math.pow(point.x - point2.x, 2);
          var distanceY = Math.pow(point.y - point2.y, 2);
          var height = Math.sqrt(distanceX + distanceY);

          totalDistance += height;

          var angleRadians = Math.atan2(point2.y - point.y, point2.x - point.x);
          var angleDeg = Math.atan2(point2.y - point.y, point2.x - point.x) * 180 / Math.PI + 90;

          line.style.height = height + 'px';
          line.style.left = point.x + padding - minX + 5 + 'px';
          line.style.top = point.y + padding - minY - height + 5 + 'px';
          line.style.transform = 'rotate(' + angleDeg + 'deg)';

          var lineContent = document.createElement('div');
          lineContent.classList.add('line-content');
          line.appendChild(lineContent);

          var lineAnimation = document.createElement('div');
          lineAnimation.classList.add('line-animation');
          lineContent.appendChild(lineAnimation);

          var duration = height / 500;
          lineAnimation.style.animationDuration = duration + 's';
          lineAnimation.style.animationDelay = totalAnimationDuration + 's';
          totalAnimationDuration += duration;

          lineContainer.appendChild(line);

          var labelContainer = document.createElement('div');
          labelContainer.classList.add('label-container');
          line.appendChild(labelContainer);

          if (angleDeg > 180 && angleDeg < 270 || angleDeg < 0 && angleDeg > -90) {
            labelContainer.classList.add('flip-text');
          }

          var label = document.createElement('div');
          label.classList.add('label');
          label.innerHTML = '' + Math.floor(height);
          label.style.animationDelay = totalAnimationDuration - duration / 1.5 + 's';
          labelContainer.appendChild(label);
        }
      });

      var distanceEl = document.createElement('h1');
      distanceEl.innerHTML = 'Total Distance: ' + Math.floor(totalDistance);
      document.body.appendChild(distanceEl);
    }
  }]);

  return TourMapper;
}();
