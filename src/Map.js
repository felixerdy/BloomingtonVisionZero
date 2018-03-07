import React, { Component } from 'react';
import './App.sass';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXhhZXRlbSIsImEiOiJjajl5OWRib2c4Y3I3MzN0NG5qb3N4ZDNhIn0.ZSVnG5S1oXz2fXDoboV_RA'

class InteractiveMap extends Component {
  map
  styleLoad = false

  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 39.154663,
      longitude: -86.525157,
      zoom: 10
    },
    crashes: this.props.mapData
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [this.state.viewport.longitude, this.state.viewport.latitude],
      zoom: this.state.viewport.zoom
    });
    this.map.on('style.load', () => {
      
    })

    this.map.on('click', 'crashes-point', (e) => {
      let recordNumbers = []
      for(let accident of e.features) {
        if(!recordNumbers.includes(accident.properties['Master Record Number'])) {
          var coordinates = accident.geometry.coordinates.slice();
          var description = `
            <b>Hour:            </b> ${accident.properties['Hour']}<br />
            <b>Collision Type:  </b> ${accident.properties['Collision Type']}<br />
            <b>Injury Type:     </b> ${accident.properties['Injury Type']}<br />
            <b>Primary Factor:  </b> ${accident.properties['Primary Factor']}<br />
          `
          console.log(accident)
          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(this.map);
  
          recordNumbers.push(accident.properties['Master Record Number'])
        }
      }
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    this.map.on('mouseenter', 'crashes-point', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    this.map.on('mouseleave', 'crashes-point', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mapData.length > 0) {
      this.arrayToMap(nextProps.mapData)
    }
  }

  arrayToMap(array) {
    this.addDataToMap(this.arrayToFeatureCollection(array));
  }

  arrayToFeatureCollection(array) {
    var tempFC = {
      'type': 'FeatureCollection',
      'features': []
    }

    array.forEach(element => {
      tempFC.features.push({
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [element.Longitude, element.Latitude]
        },
        'properties': element
      })
    })
    return tempFC
  }

  addDataToMap(data) {
    if (this.map.getSource('crashes') === undefined) {
      this.map.addSource('crashes', {
        'type': 'geojson',
        'data': data
      });
      this.map.addLayer({
        'id': 'crashes-heat',
        'type': 'heatmap',
        'source': 'crashes',
        "maxzoom": 12,
        'paint': {
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, '#63A69F',
            0.4, '#F2E1AC',
            0.6, '#F2836B',
            0.8, '#F2594B',
            1, '#CD2C24'
          ],
          // Transition from heatmap to circle layer by zoom level
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7, 1,
            12, 0
          ],
        }
      });
      this.map.addLayer({
        "id": "crashes-point",
        "type": "circle",
        "source": "crashes",
        "minzoom": 10,
        "paint": {
          // Color circle by earthquake magnitude
          "circle-color": "#F2594B",
          "circle-stroke-color": "#F2E1AC",
          "circle-stroke-width": 1,
          // Transition from heatmap to circle layer by zoom level
          "circle-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, 0,
            12, 1
          ],
          "circle-stroke-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, 0,
            12, 1
          ]
        }
      });
    } else {
      this.map.getSource('crashes').setData(data)
    }
  }

  clearMap() {
    this.map.removeSource('crashes')
    this.map.removeLayer('crashes-heat')
    this.map.removeLayer('crashes-point')
  }

  render() {
    return (
      <div className='map' ref={el => this.mapContainer = el} />
    );
  }
}

export default InteractiveMap
