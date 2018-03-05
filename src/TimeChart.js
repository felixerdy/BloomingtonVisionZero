import React, { Component } from 'react';
import './App.sass';
// import Chart from "frappe-charts/dist/frappe-charts.min.esm"
import { Chart } from "chart.js";

class TimeChart extends Component {
  chart

  componentDidMount() {
    // let data = {
    //   labels: this.props.labels,
    //   datasets: [
    //     {
    //       title: this.props.title,
    //       values: this.props.values
    //     }
    //   ]
    // };

    this.chart = new Chart(this.c, {
      type: 'bar',
      data: {
        labels: this.props.labels,
        datasets: [{
          label: this.props.title,
          data: this.props.values,
          backgroundColor: '#63A69F',
          borderWidth: 0
        }]
      },
      options: {
        onClick: (e) => {
          if (this.chart.getElementAtEvent(e)[0]) {
            this.props.dataSelected(this.chart.getElementAtEvent(e)[0]._index)
          }
        },
        scales: {
          xAxes: [{
            barPercentage: 0.8,
            ticks: {
              fontFamily: '"Quicksand"',
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontFamily: '"Quicksand"'
            },
            gridLines: {
              drawBorder: false
            }
          }]
        }
      }
    });

    // this.chart = new Chart({
    //   parent: this.c,
    //   data: data,
    //   type: 'bar',
    //   is_navigable: 1,
    //   height: 240,
    //   colors: ['#63A69F'],
    //   format_tooltip_x: d => (d + '').toUpperCase(),
    //   format_tooltip_y: d => d + ' Accidents'
    // });

    // this.chart.parent.addEventListener('data-select', (e) => {
    //   this.props.dataSelected(this.props.labels[e.index]); // e contains index and value of current datapoint
    // });
  }

  componentWillReceiveProps(nextProps) {
    this.chart.config.data = {
      labels: nextProps.labels,
      datasets: [{
        label: nextProps.title,
        data: nextProps.values,
        backgroundColor: '#63A69F',
        borderWidth: 0
      }]
    }
    this.chart.update()


    // this.chart.update_values(
    //   [
    //     {values: nextProps.values},
    //   ],
    //   nextProps.labels
    // );
  }

  render() {
    return (
      <canvas ref={chart => (this.c = chart)}></canvas>
    );
  }
}

export default TimeChart;
