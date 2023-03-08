import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { DashboardItem } from "../interfaces/dashboard.item.type";
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

    const dataParsed = new Promise((resolve,reject)=>{
      parse(filePath, {
        header: true,
        delimiter: ",",
        download: true,
        endoding: 'utf8',
        complete: (results) => {
            const data = results.data.map((row)=>{
            return {
              'uid': row.UID,
              'country': row.iso,
              'provinceState': row.Province_State,
              'city': row.Admin2,
              'd_2021_04_24': parseInt(row['4/24/21']),
              'd_2021_04_25': parseInt(row['4/25/21']),
              'd_2021_04_26': parseInt(row['4/26/21'])
            }
          })
          resolve(data)
        },
        error: (err) =>{
          reject(err)
        }
      })
    })

    const data_res = await dataParsed
    return data_res  
  }
}