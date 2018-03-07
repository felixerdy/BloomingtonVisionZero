import React, { Component } from 'react';
import './App.sass';
import InteractiveMap from './Map';
import DataLoader from './DataLoader';
import TimeChart from './TimeChart';
import Imprint from './Imprint'

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
      loading: false,
      bicycle: false,
      pedestrian: false
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

    for (let y = 2003; y <= 2015; y++) {
      DataLoader.getCount(y, month + 1, weekday + 1, this.state.bicycle, this.state.pedestrian).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.yearHist;
          tempArr.push([y, data])
          return { yearHist: tempArr }
        })
      })
    }

    for (let m = 1; m <= 12; m++) {
      DataLoader.getCount(this.state.selectedYearLabel, m, weekday + 1, this.state.bicycle, this.state.pedestrian).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.monthHist;
          tempArr.push([m, data])
          return { monthHist: tempArr }
        })
      })
    }

    for (let w = 1; w <= 7; w++) {
      DataLoader.getCount(this.state.selectedYearLabel, month + 1, w, this.state.bicycle, this.state.pedestrian).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.weekdayHist;
          tempArr.push([w, data])
          return { weekdayHist: tempArr }
        })
      })
    }

    if (!(this.state.selectedYear === undefined && this.state.selectedMonth === undefined && this.selectedWeekday === undefined) || this.state.bicycle || this.state.pedestrian) {
      DataLoader.getData(this.state.selectedYearLabel, month + 1, weekday + 1, this.state.bicycle, this.state.pedestrian).then(data => {
        this.setState({
          mapData: data,
          loading: false
        })
      })
    } else {
      this.setState({
        mapData: [],
        loading: false
      })
      this.refs.map.clearMap();
    }
  }

  defaultCharts() {
    this.setState({ loading: true })
    for (let y = 2003; y <= 2015; y++) {
      DataLoader.getCount(y, undefined, undefined, false, false).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.yearHist;
          tempArr.push([y, data])
          return { yearHist: tempArr }
        })
      })
    }

    for (let m = 1; m <= 12; m++) {
      DataLoader.getCount(undefined, m, undefined, false, false).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.monthHist;
          tempArr.push([m, data])
          return { monthHist: tempArr }
        })
      })
    }

    for (let w = 1; w <= 7; w++) {
      DataLoader.getCount(undefined, undefined, w, false, false).then(data => {
        this.setState(prevstate => {
          let tempArr = prevstate.weekdayHist;
          tempArr.push([w, data])
          return {
            weekdayHist: tempArr,
            loading: false
          }
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
      bicycle: false,
      pedestrian: false
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
                      dataSelected={(data) => this.setData(data, this.state.selectedMonth, this.state.selectedWeekday, this.state.bicycle, this.state.pedestrian)}
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
                      dataSelected={(data) => this.setData(this.state.selectedYear, data, this.state.selectedWeekday, this.state.bicycle, this.state.pedestrian)}
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
                      dataSelected={(data) => this.setData(this.state.selectedYear, this.state.selectedMonth, data, this.state.bicycle, this.state.pedestrian)}
                    />
                  }
                </div>
              </li>
              <li>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button
                    type="button"
                    className={"btn btn-info " + (this.state.bicycle ? 'active' : "")}
                    onClick={() => {
                      this.setState(prevState => {
                        return { 
                          bicycle: !prevState.bicycle,
                          pedestrian: false
                        }
                      }, () => {
                        this.setData(this.state.selectedYear, this.state.selectedMonth, this.selectedWeekday, this.state.bicycle, this.state.pedestrian)
                      })
                    }
                    }>
                    <i className="material-icons">directions_bike</i>
                  </button>
                  <button
                    type="button"
                    className={'btn btn-info ' + (this.state.pedestrian ? 'active' : '')}
                    onClick={() => {
                      this.setState(prevState => {
                        return { 
                          bicycle: false,
                          pedestrian: !prevState.pedestrian
                        }
                      }, () => {
                        this.setData(this.state.selectedYear, this.state.selectedMonth, this.selectedWeekday, this.state.bicycle, this.state.pedestrian)
                      })
                    }}>
                    <i className="material-icons">directions_walk</i>
                  </button>
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
            <ul className="nav navbar-nav navbar-right">
              <li><div className="nav-link" onClick={() => this.refs.modal.toggle()}>About</div></li>
            </ul>
          </div>
        </nav>
        <Imprint ref='modal' />
        <InteractiveMap
          ref='map'
          mapData={this.state.mapData}
        />
      </div>
    );
  }
}

export default App;
