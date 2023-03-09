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

  public async getNewDashboardData() {
    const filePath = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQLMujrcrLDFPS_Qia-SWNJAAVdiic2ZgX3QfzgoN_hQOuSrfm-5qfdCwuLD6OaUlMgZGRrHPCQJR8w/pub?gid=1362881472&single=true&output=csv'
    //const filePath = 'time_series_covid19_deaths_US.csv'
    if (!localStorage.getItem('rawData')) {
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
                  'population': item.Population,
                  'date': '2021-04-24',
                  'deaths': parseInt(item['4/24/21'])
                },
                {
                  'uid': `${item.UID}-2021-04-25}`,
                  'country': item.iso,
                  'provinceState': item.Province_State,
                  'city': item.Admin2,
                  'population': item.Population,
                  'date': '2021-04-25',
                  'deaths': parseInt(item['4/25/21'])
                },
                {
                  'uid': `${item.UID}-2021-04-26}`,
                  'country': item.iso,
                  'provinceState': item.Province_State,
                  'city': item.Admin2,
                  'population': item.Population,
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
      //save raw data in local storage
      const rawData = await dataParsed
      localStorage.setItem('rawData', JSON.stringify(rawData))
    }
  }

  public updateDashboardData(newRawData: DashboardItem[]) {
    localStorage.setItem('rawData', JSON.stringify(newRawData))
  }

  public getDashboardData(): DashboardItem[] {
    const rawData = JSON.parse(localStorage.getItem('rawData'))
    return rawData
  }
}

