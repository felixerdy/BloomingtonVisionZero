import React, { Component } from 'react';
import './App.sass';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import { Chart } from "chart.js";

mapboxgl.accessToken = 'pk.eyJ1IjoiZmVsaXhhZXRlbSIsImEiOiJjajl5OWRib2c4Y3I3MzN0NG5qb3N4ZDNhIn0.ZSVnG5S1oXz2fXDoboV_RA'



class App extends Component {
  map
  hourChart
  dayChart
  monthChart
  yearChart

  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 39.154663,
      longitude: -86.525157,
      zoom: 10
    },
    crashes: {}
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/dark-v9',
      center: [this.state.viewport.longitude, this.state.viewport.latitude],
      zoom: this.state.viewport.zoom
    });
    this.map.on('style.load', () => {
      fetch('https://data.bloomington.in.gov/api/action/datastore_search?resource_id=8673744e-53f2-42d1-9d05-4e412bd55c94&limit=60000')
        .then((response) => {
          return response.json()
        }).then((data) => {
          console.log('got data')
          this.setState({ crashes: this.arrayToFeatureCollection(data.result.records) })
          this.addDataToMap(this.arrayToFeatureCollection(data.result.records))
        })
    })
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

    console.log(data)
    this.map.addSource('cashes', {
      'type': 'geojson',
      'data': data
    });

    this.map.addLayer({
      'id': 'crashes-heat',
      'type': 'heatmap',
      'source': 'cashes',
      'paint': {
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgb(103,169,207)',
          0.4, 'rgb(209,229,240)',
          0.6, 'rgb(253,219,199)',
          0.8, 'rgb(239,138,98)',
          1, 'rgb(178,24,43)'
        ]
      }
    });
    this.dayChart = this.createChart(
      this.refs.dayChartCanvas.getContext('2d'), 
      ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], 
      "Day")

    this.monthChart = this.createChart(
      this.refs.monthChartCanvas.getContext('2d'), 
      ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], 
      "Month")

    this.yearChart = this.createChart(
      this.refs.yearChartCanvas.getContext('2d'), 
      Array.apply(null, { length: this.getYearBounds().max + 1}).map(Number.call, Number).slice(this.getYearBounds().min),  
      "Year")
  }

  createChart(ctxContainer, xLabels, timeFrame) {
    return new Chart(ctxContainer, {
      type: 'bar',
      data: {
        labels: xLabels,
        datasets: [{
          label: '# of Crashes',
          data: Array(xLabels.length).fill().map((e, i) => {
            if(timeFrame === "Year") {
              return this.getNumberOfCrashes(timeFrame, xLabels[i])
            } else {
              return this.getNumberOfCrashes(timeFrame, i + 1)
            }
          }),
          backgroundColor: 'lightgrey',
          hoverBackgroundColor: 'red',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        onHover: (event, elements) => {
          if (elements.length) {
            if(timeFrame === "Year") {
              this.changeTime(timeFrame, xLabels[elements[0]._index])
            } else {
              this.changeTime(timeFrame, elements[0]._index + 1)
            }
          } else {
            this.changeTime("", -1)
          }
        }
      }
    });
  }

  changeTime(timeFrame, timeValue) {
    console.log(timeFrame, timeValue)
    if (timeValue === -1) {
      this.map.setFilter('crashes-heat', null);
    } else {
      this.map.setFilter('crashes-heat', ['==', timeFrame, timeValue.toString()]);
    }
  }

  getNumberOfCrashes(timeFrame, timeValue) {
    console.log(timeFrame, timeValue)
    let counter = 0
    this.state.crashes.features.forEach(e => {
      if (timeFrame === "Day" && e.properties.Day === timeValue.toString()) {
        counter++
      } else if (timeFrame === "Hour" && e.properties.Hour === timeValue.toString()) {
        counter++
      } else if (timeFrame === "Month" && e.properties.Month === timeValue.toString()) {
        counter++
      } else if (timeFrame === "Year" && e.properties.Year === timeValue.toString()) {
        counter++
      }
    })
    return counter
  }

  getYearBounds() {
    let tempArr = this.state.crashes.features.map((e) => { return e.properties.Year });
    return {
      'min': Math.min.apply(null, tempArr),
      'max': Math.max.apply(null, tempArr)
    }
  }

  render() {
    return (
      <div>
        <div className='map' ref={el => this.mapContainer = el} />
        <div className='sidebar'>
          <div className='chart-container'>
            <canvas ref='hourChartCanvas' width={1} height={1}></canvas>
            <canvas ref='dayChartCanvas' width={1} height={1}></canvas>
            <canvas ref='monthChartCanvas' width={1} height={1}></canvas>
            <canvas ref='yearChartCanvas' width={1} height={1}></canvas>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
