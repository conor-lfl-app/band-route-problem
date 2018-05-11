// TODO: add testing framework

class TourMapper {
  constructor (points) {
    this.setRoute(points)
  }

  setRoute (points) {
    const startingPoint = points[0]
    const destinations = [...points].splice(1, points.length - 1)
    const stops = this.createOptimalRouteFrom({startingPoint, destinations})
    stops.push(startingPoint)
    this.points = points
    this.route = stops
  }

  getRoute () {
    return this.route
  }

  // maps all potential distances from the starting point
  mapDistances (point, destinations) {
    return destinations.map( destination => {
      const distanceX = Math.pow(point.x - destination.x, 2)
      const distanceY = Math.pow(point.y - destination.y, 2)
      return Math.sqrt(distanceX + distanceY)
    })
  }

  // finds the shortest distance between a point and it's potential destinations
  findShortestDestination (point, destinations) {
    const remainingDestinations = [...destinations]
    const distances = this.mapDistances(point, remainingDestinations)
    // TODO: solve edge case for situations where there is a tie for the shortest distance
    const shortestDistance = Math.min(...distances)
    const shortestDestinationIndex = distances.indexOf(shortestDistance)
    const shortestDestination = remainingDestinations.splice(shortestDestinationIndex, 1)[0]

    return { shortestDestination, remainingDestinations }
  }

  // finds and orders the shortest paths to each successive point
  createOptimalRouteFrom ({startingPoint, destinations, stops}) {
    const stopsToMake = stops || destinations.length // how many stops are we accumulating in our route
    const route = [startingPoint] // route to be returned by function; route begins with starting point as the first stop

    const routeBuilder = ({startingPoint, destinations}) => {
      const {
        shortestDestination,
        remainingDestinations } = this.findShortestDestination(startingPoint, destinations)

      // add the currentPoint to the list of stops
      route.push(shortestDestination) // add the currentPoint to the list of stops

      const routeFinished = route.length > stopsToMake // we use ">" here because we added the starting point to the route by default
      const noMoreDestinations = !remainingDestinations || remainingDestinations.length === 0
      const keepBuildingRoute = !routeFinished && !noMoreDestinations

      // if there are more routes to find, we keep iterating
      if ( keepBuildingRoute ) {
        return routeBuilder({
          startingPoint: shortestDestination,
          destinations: remainingDestinations
        })
      }

      return route
    }

    return routeBuilder({startingPoint, destinations})
  }

  createMap () {
    //Create a Pixi Application
    const xCoords = this.points.map( point => point.x )
    const minX = Math.min(...xCoords)
    const relXCoords = this.points.map( point => point.x - minX )
    const maxX = Math.max(...relXCoords)

    const yCoords = this.points.map( point => point.y )
    const minY = Math.min(...yCoords)
    const relYCoords = this.points.map( point => point.y - minY )
    const maxY = Math.max(...relYCoords)

    const padding = 100
    const markerContainer = document.getElementById('markers')
    const lineContainer = document.getElementById('lines')
    const canvasWidth = ((padding * 2) + maxX) + 'px'
    const canvasHeight = ((padding * 2) + maxY) + 'px'
    markerContainer.style.width = canvasWidth
    markerContainer.style.height = canvasHeight
    lineContainer.style.width = canvasWidth
    lineContainer.style.height = canvasHeight

    const tourMarkers = this.points.map( (point, i) => {
      const { x, y } = point

      const marker = document.createElement('div')
      if (i === 0) {
        marker.classList.add('home')
      }
      marker.classList.add('marker')
      marker.style.left = (x + padding - minX) + 'px';
      marker.style.top = (y + padding - minY) + 'px'
      markerContainer.appendChild(marker)

      const label = document.createElement('div')
      label.classList.add('label')
      label.innerHTML = `${x}, ${y}`
      label.style.left = (x + padding - minX) + 5 + 'px';
      label.style.top = (y + padding - minY) - 20 + 'px'
      markerContainer.appendChild(label)
    })

    let totalAnimationDuration = 0
    let totalDistance = 0
    const tourLines = this.route.map( (point, i) => {
      if (i < this.route.length - 1) {
        const point2 = this.route[i + 1]
        console.log(point, point2)
        const line = document.createElement('div')
        line.classList.add('line')
        line.style.width = '5px'
        const distanceX = Math.pow(point.x - point2.x, 2)
        const distanceY = Math.pow(point.y - point2.y, 2)
        const height = Math.sqrt(distanceX + distanceY)

        totalDistance += height

        line.style.height = height + 'px'
        line.style.left = (point.x + padding - minX) + 5 + 'px'
        line.style.top = (point.y + padding - minY) - height + 5 + 'px'
        var angleRadians = Math.atan2(point2.y - point.y, point2.x - point.x);
        var angleDeg = (Math.atan2(point2.y - point.y, point2.x - point.x) * 180 / Math.PI) + 90;
        line.style.transform = `rotate(${angleDeg}deg)`

        const lineAnimation = document.createElement('div')
        lineAnimation.classList.add('line-animation')
        line.appendChild(lineAnimation)

        const duration = height / 500
        lineAnimation.style.animationDuration = duration + 's'
        lineAnimation.style.animationDelay = totalAnimationDuration + 's'
        totalAnimationDuration += duration

        lineContainer.appendChild(line)
      }
    })

    const distanceEl = document.createElement('h1')
    distanceEl.innerHTML = `Total Distance: ${Math.floor(totalDistance)}`
    document.body.appendChild(distanceEl)
  }
}

var points = [{"x":116,"y":404},{"x":161,"y":617},{"x":16,"y":97},{"x":430,"y":536},{"x":601,"y":504},{"x":425,"y":461},{"x":114,"y":544},{"x":127,"y":118},{"x":163,"y":357},{"x":704,"y":104},{"x":864,"y":125},{"x":847,"y":523},{"x":742,"y":170},{"x":204,"y":601},{"x":421,"y":377},{"x":808,"y":49},{"x":860,"y":466},{"x":844,"y":294},{"x":147,"y":213},{"x":550,"y":124},{"x":238,"y":313},{"x":57,"y":572},{"x":664,"y":190},{"x":612,"y":644},{"x":456,"y":154},{"x":120,"y":477},{"x":542,"y":313},{"x":620,"y":29},{"x":245,"y":246},{"x":611,"y":578},{"x":627,"y":373},{"x":534,"y":286},{"x":577,"y":545},{"x":539,"y":340},{"x":794,"y":328},{"x":855,"y":139},{"x":700,"y":47},{"x":275,"y":593},{"x":130,"y":196},{"x":863,"y":35}];

const tour = new TourMapper(points)
tour.createMap()
