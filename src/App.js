import React, { Component } from 'react';
import './App.sass';
import InteractiveMap from './Map';
import DataLoader from './DataLoader';
import TimeChart from './TimeChart';

// import { Chart } from "chart.js";


class App extends Component {
  hourChart
  dayChart
  monthChart
  yearChart

  constructor() {
    super();
    this.state = {
      yearHist: [],
      monthHist: [],
      weekdayHist: [],
      mapData: [],
      selectedYearLabel: 'Year',
      selectedMonthLabel: 'Month',
      selectedWeekdayLabel: 'Weekday'
    };
  }

  componentDidMount() {
    let tempYearHist = []
    for (let y = 2003; y <= 2015; y++) {
      DataLoader.getCount(y, undefined, undefined).then(data => {
        tempYearHist.push([y, data])
      })
    }
    this.setState({
      yearHist: tempYearHist
    })

    let tempMonthHist = []
    for (let m = 1; m <= 12; m++) {
      DataLoader.getCount(2015, m, undefined).then(data => {
        tempMonthHist.push([m, data])
      })
    }
    this.setState({
      monthHist: tempMonthHist
    })

    let tempWeekdayHist = []
    for (let w = 1; w <= 7; w++) {
      DataLoader.getCount(2015, 12, w).then(data => {
        tempWeekdayHist.push([w, data])
      })
    }
    this.setState({
      weekdayHist: tempWeekdayHist
    })

    DataLoader.getData(2015, undefined, undefined).then(data => {
      this.setState({
        mapData: data
      })
    })
  }

  setData(year, month, weekday) {
    this.setState({ selectedYearLabel: year, selectedMonthLabel: month, selectedWeekdayLabel: weekday })
    DataLoader.getData(year, month, weekday).then(data => {
      this.setState({
        mapData: data
      })
    })
  }

  render() {
    return (
      <div>
        <nav className="navbar fixed-bottom navbar-expand-sm navbar-dark bg-dark">
          <div className="navbar-brand"><b>Bloomington Vision Zero</b></div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropup">
                <div className="nav-link dropdown-toggle" id="dropdown10" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.selectedYearLabel}</div>
                <div className="dropdown-menu" aria-labelledby="dropdown10">
                  {
                    this.state.yearHist.length > 0 &&
                    <TimeChart
                      title="Year"
                      values={this.state.yearHist.sort((a, b) => a[0] - b[0]).map(e => parseInt(e[1], 10))}
                      labels={this.state.yearHist.sort((a, b) => a[0] - b[0]).map(e => e[0].toString())}
                      dataSelected={(data) => this.setData(data, undefined, undefined)}
                    />
                  }
                </div>
              </li>

              <li className="nav-item dropup">
                <div className="nav-link dropdown-toggle" id="dropdown10" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.selectedMonthLabel}</div>
                <div className="dropdown-menu" aria-labelledby="dropdown10">
                  {
                    this.state.monthHist.length > 0 &&
                    <TimeChart
                      title="Month"
                      values={this.state.monthHist.sort((a, b) => a[0] - b[0]).map(e => parseInt(e[1], 10))}
                      labels={this.state.monthHist.sort((a, b) => a[0] - b[0]).map(e => e[0].toString())}
                      dataSelected={(data) => this.setData(this.state.selectedYearLabel, data, undefined)}
                    />
                  }
                </div>
              </li>

              <li className="nav-item dropup">
                <div className="nav-link dropdown-toggle" id="dropdown10" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.selectedWeekdayLabel}</div>
                <div className="dropdown-menu" aria-labelledby="dropdown10">
                  {
                    this.state.monthHist.length > 0 &&
                    <TimeChart
                      title="Weekday"
                      values={this.state.weekdayHist.sort((a, b) => a[0] - b[0]).map(e => parseInt(e[1], 10))}
                      labels={this.state.weekdayHist.sort((a, b) => a[0] - b[0]).map(e => e[0].toString())}
                      dataSelected={(data) => this.setData(this.state.selectedYearLabel, this.state.selectedMonthLabel, data)}
                    />
                  }
                </div>
              </li>
            </ul>
          </div>
        </nav>
        <InteractiveMap
          mapData={this.state.mapData}
        />
      </div>
    );
  }
}

export default App;
