import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardItem } from "../interfaces/dashboard.item.type";
import { parse } from 'papaparse';



@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {
  }

  private readParseData(filePath) {
    //Promise to read and parse csv
    const dataParsed = new Promise((resolve, reject) => {
      parse(filePath, {
        header: true,
        delimiter: ",",
        download: true,
        endoding: 'utf8',
        complete: (res) => {
          const data: DashboardItem[] = res.data.map((item) =>
            [
              {
                'uid': `${item.UID}-2021-04-24}`,
                'country': item.iso,
                'provinceState': item.Province_State,
                'city': item.Admin2,
                'population': parseInt(item.Population),
                'date': '2021-04-24',
                'deaths': parseInt(item['4/24/21'])
              },
              {
                'uid': `${item.UID}-2021-04-25}`,
                'country': item.iso,
                'provinceState': item.Province_State,
                'city': item.Admin2,
                'population': parseInt(item.Population),
                'date': '2021-04-25',
                'deaths': parseInt(item['4/25/21'])
              },
              {
                'uid': `${item.UID}-2021-04-26}`,
                'country': item.iso,
                'provinceState': item.Province_State,
                'city': item.Admin2,
                'population': parseInt(item.Population),
                'date': '2021-04-26',
                'deaths': parseInt(item['4/26/21'])
              }
            ]
          ).flat(1)
          resolve(data)
        },
        error: (err) => {
          reject(err)
        }
      })
    })
    return dataParsed
  }

  public getNewDashboardData() {
    const filePath = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLMujrcrLDFPS_Qia-SWNJAAVdiic2ZgX3QfzgoN_hQOuSrfm-5qfdCwuLD6OaUlMgZGRrHPCQJR8w/pub?gid=1362881472&single=true&output=csv'
    //const filePath = 'time_series_covid19_deaths_US.csv'
    const RawDataPromise = new Promise((resolve, reject) => {
      if (!localStorage.getItem('rawData')) {
        //save raw data in local storage
        this.readParseData(filePath)
          .then(rawData => {
            localStorage.setItem('rawData', JSON.stringify(rawData))
            resolve('Sucess')
          })
          .catch(error => {
            console.error(error)
            reject(error)
          })
      } else { resolve('Sucess') }

    })
    return RawDataPromise
  }

  public updateDashboardData(newRawData: DashboardItem[]) {
    localStorage.setItem('rawData', JSON.stringify(newRawData))
  }

  public getDashboardData(): DashboardItem[] {
    const rawData = JSON.parse(localStorage.getItem('rawData'))
    return rawData
  }

  public getMetricsByState() {
    const rawData = this.getDashboardData()

    //calculate death to date by providence date
    const acumDeathsByStateDate = []
    rawData.forEach(row => {
      const provinceAccDate = {
        'provinceState': row.provinceState,
        'date': row.date,
        'accDeath': row.deaths | 0,
        'population': row.population | 0
      }
      const indexProvinceDate = acumDeathsByStateDate.findIndex(prov => prov.provinceState === row.provinceState && prov.date === row.date)
      if (indexProvinceDate === -1) {
        acumDeathsByStateDate.push(provinceAccDate)
      } else {
        acumDeathsByStateDate[indexProvinceDate].accDeath += row.deaths
        acumDeathsByStateDate[indexProvinceDate].population += row.population
      }
    })

    //sort array asc by death to date
    acumDeathsByStateDate.sort((a, b) => a.accDeath - b.accDeath)

    const minProviceDeath = acumDeathsByStateDate[0]
    const maxProviceDeath = acumDeathsByStateDate[acumDeathsByStateDate.length - 1]

    //sort array asc by %death
    acumDeathsByStateDate.sort((a, b) => {
      const div1 = !a.population || a.population === 0 ? 0 : (a.accDeath / a.population)
      const div2 = !b.population || b.population === 0 ? 0 : (b.accDeath / b.population)
      return div1 - div2
    }
    )

    return {
      minProviceDeath,
      maxProviceDeath,
      mostAfectedProvidence: acumDeathsByStateDate[acumDeathsByStateDate.length - 1]
    }
  }
}