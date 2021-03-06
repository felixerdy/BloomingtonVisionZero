class DataLoader {
  static getData(year, month, weekday, bicycle, pedestrian) {
    let SQLConditions = {}
    if (year >= 2003 && year <= 2015) {
      SQLConditions.Year = year
    }
    if (month >= 1 && month <= 12) {
      SQLConditions.Month = month
    }
    if (weekday >= 1 && weekday <= 7) {
      SQLConditions.Day = weekday
    }
    if(bicycle) {
      SQLConditions['Collision Type'] = 'Cyclist'
    }
    if(pedestrian) {
      SQLConditions['Collision Type'] = 'Pedestrian'
    }
    return new Promise((resolve, reject) => {
      fetch(`https://data.bloomington.in.gov/api/action/datastore_search?resource_id=8673744e-53f2-42d1-9d05-4e412bd55c94&filters=${JSON.stringify(SQLConditions)}&limit=9999999999`)
      .then((response) => {
        return response.json()
      }).then((data) => {
        resolve(data.result.records)
      })
    })
    
  }

  static getCount(year, month, weekday, bicycle, pedestrian) {
    let SQLConditions = []
    if (year >= 2003 && year <= 2015) {
      SQLConditions.push(`"Year" = ${year}`)
    }
    if (month >= 1 && month <= 12) {
      SQLConditions.push(`"Month" = ${month}`)
    }
    if (weekday >= 1 && weekday <= 7) {
      SQLConditions.push(`"Day" = ${weekday}`)
    }
    if(bicycle) {
      SQLConditions.push('"Collision Type" LIKE \'Cyclist\'')
    }
    if(pedestrian) {
      SQLConditions.push('"Collision Type" LIKE \'Pedestrian\'');
    }
    let myCondition = ``
    for(var i = 0; i < SQLConditions.length; i++) {
      myCondition += SQLConditions[i]
      if(i === SQLConditions.length - 1) {
        break;
      }
      myCondition += ' AND '
    }
    return new Promise((resolve, reject) => {
      fetch(`https://data.bloomington.in.gov/api/action/datastore_search_sql?sql=SELECT COUNT(*) from "8673744e-53f2-42d1-9d05-4e412bd55c94" WHERE ${myCondition}`)
      .then((response) => {
        return response.json()
      }).then((data) => {
        resolve(data.result.records[0].count)
      })
    })
  }
}

export default DataLoader;
