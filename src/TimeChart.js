import React, { Component } from 'react';
import './App.sass';
import Chart from "frappe-charts/dist/frappe-charts.min.esm"

class TimeChart extends Component {
  chart

  componentDidMount() {
    let data = {
      labels: this.props.labels,
      datasets: [
        {
          title: this.props.title,
          values: this.props.values
        }
      ]
    };

    this.chart = new Chart({
      parent: `#${this.props.title}_chart`,
      data: data,
      type: 'bar',
      is_navigable: 1,
      height: 240,
      colors: ['#63A69F'],
      format_tooltip_x: d => (d + '').toUpperCase(),
      format_tooltip_y: d => d + ' Accidents'
    });

    this.chart.parent.addEventListener('data-select', (e) => {
      this.props.dataSelected(this.props.labels[e.index]); // e contains index and value of current datapoint
    });
  }

  componentWillReceiveProps(nextProps) {
    this.chart.update_values(
      [
        {values: nextProps.values},
      ],
      nextProps.labels
    );
  }

  render() {
    return (
      <div id={`${this.props.title}_chart`}></div>
    );
  }
}

export default TimeChart;
