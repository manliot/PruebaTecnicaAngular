import { Component, Input, OnInit } from "@angular/core";
import { DashboardItem } from "../../../interfaces/dashboard.item.type";
import { DashboardService } from "../../../services/dashboard.service";
import { DashboardComponent } from "../dashboard.component";

@Component({
  selector: "app-dashboard-box",
  templateUrl: "./dashboard-box.component.html",
  styleUrls: ["./dashboard-box.component.css"],
})
export class DashboardBoxComponent implements OnInit {
  public expanded = false;
  @Input() public metricName: string = '';
  @Input() public metricValue: number = 0;
  @Input() public province: string = '';

  // must be changed for real data from dashboard component, does not make sense call a service from this component
  public fixedData: DashboardItem;

  constructor() {

  }

  public ngOnInit(): void {
  }

  /**
   * changePanel
   */
  public changePanel() {
    this.expanded = !this.expanded;
  }
}
