import { Component, Input, OnInit } from "@angular/core";
import { DashboardItem } from "../../../interfaces/dashboard.item.type";


@Component({
  selector: 'app-dashboard-table',
  templateUrl: './dashboard-table.component.html',
  styleUrls: ['./dashboard-table.component.scss']
})
export class DashboardTableComponent implements OnInit {
  columns: string[] = ['Date', 'City', 'Population', 'Deaths to Date', 'Deaths vs Population', 'Edit'];
  @Input() rawData: DashboardItem[];
  constructor() { }

  ngOnInit(): void {
  }

}
