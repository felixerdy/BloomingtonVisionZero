import React, { Component } from 'react';
import './App.sass';
import InteractiveMap from './Map';
import DataLoader from './DataLoader';
import TimeChart from './TimeChart';

class App extends Component {
  monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  yearNames = [...Array(13).keys()].map(x => x += 2003);

  constructor() {
    super();
    this.state = {
      yearHist: [],
      monthHist: [],
      weekdayHist: [],
      mapData: [],
      selectedYearLabel: 'Year',
      selectedMonthLabel: 'Month',
      selectedWeekdayLabel: 'Weekday',
      selectedYear: undefined,
      selectedMonth: undefined,
      selectedWeekday: undefined,
      filterEnabled: false,
      loading: false
    };
  }

  componentDidMount() {
    this.defaultCharts()

    // console.log(tempYearHist, tempMonthHist, tempWeekdayHist)

    // this.setState({
    //   // yearHist: tempYearHist,
    //   monthHist: tempMonthHist,
    //   weekdayHist: tempWeekdayHist
    // })

    // this.setData(undefined, undefined, undefined);
  }

  setData(year, month, weekday) {
    this.setState({
      selectedYearLabel: year === undefined ? 'Year' : this.yearNames[year],
      selectedMonthLabel: month === undefined ? 'Month' : this.monthNames[month],
      selectedWeekdayLabel: weekday === undefined ? 'Weekday' : this.dayNames[weekday],
      selectedYear: year,
      selectedMonth: month,
      selectedWeekday: weekday,
      yearHist: [],
      monthHist: [],
      weekdayHist: [],
      filterEnabled: true,
      loading: true
    })

    console.log(year, month, weekday)

    for (let y = 2003; y <= 2015; y++) {
      DataLoader.getCount(y, month + 1, weekday + 1).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.yearHist;
          tempArr.push([y, data])
          return { yearHist: tempArr }
        })
      })
    }

    for (let m = 1; m <= 12; m++) {
      DataLoader.getCount(this.state.selectedYearLabel, m, weekday + 1).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.monthHist;
          tempArr.push([m, data])
          return { monthHist: tempArr }
        })
      })
    }

    for (let w = 1; w <= 7; w++) {
      DataLoader.getCount(this.state.selectedYearLabel, month + 1, w).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.weekdayHist;
          tempArr.push([w, data])
          return { weekdayHist: tempArr }
        })
      })
    }

    DataLoader.getData(this.state.selectedYearLabel, month + 1, weekday + 1).then(data => {
      this.setState({
        mapData: data,
        loading: false
      })
    })
  }

  defaultCharts() {
    this.setState({loading: true})
    for (let y = 2003; y <= 2015; y++) {
      DataLoader.getCount(y, undefined, undefined).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.yearHist;
          tempArr.push([y, data])
          return { yearHist: tempArr }
        })
      })
    }

    for (let m = 1; m <= 12; m++) {
      DataLoader.getCount(undefined, m, undefined).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.monthHist;
          tempArr.push([m, data])
          return { monthHist: tempArr }
        })
      })
    }

    for (let w = 1; w <= 7; w++) {
      DataLoader.getCount(undefined, undefined, w).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.weekdayHist;
          tempArr.push([w, data])
          return { weekdayHist: tempArr,
          loading: false }
        })
      })
    }
  }

  clearFilter() {
    this.setState({
      selectedYearLabel: 'Year',
      selectedMonthLabel: 'Month',
      selectedWeekdayLabel: 'Weekday',
      yearHist: [],
      monthHist: [],
      weekdayHist: [],
      selectedYear: undefined,
      selectedMonth: undefined,
      selectedWeekday: undefined,
      filterEnabled: false,
      mapData: [],
    })

    this.defaultCharts()

    this.refs.map.clearMap();
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
                      dataSelected={(data) => this.setData(data, this.state.selectedMonth, this.state.selectedWeekday)}
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
                      labels={this.state.monthHist.sort((a, b) => a[0] - b[0]).map(e => this.monthNames[e[0] - 1])}
                      dataSelected={(data) => this.setData(this.state.selectedYear, data, this.state.selectedWeekday)}
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
                      labels={this.state.weekdayHist.sort((a, b) => a[0] - b[0]).map(e => this.dayNames[e[0] - 1])}
                      dataSelected={(data) => this.setData(this.state.selectedYear, this.state.selectedMonth, data)}
                    />
                  }
                </div>
              </li>
              {
                this.state.filterEnabled &&
                <li>
                  <button type="button" className="btn btn-light" onClick={() => this.clearFilter()}>Clear Filter</button>
                </li>
              }
              {
                this.state.loading &&
                <li>
                  <div className='spinner'></div>
                </li>
              }
              
            </ul>
          </div>
        </nav>
        <InteractiveMap
          ref='map'
          mapData={this.state.mapData}
        />
      </div>
    );
  }
}

export default App;
