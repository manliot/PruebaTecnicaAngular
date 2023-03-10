import { Component, Injectable, OnInit } from "@angular/core";
import { DashboardMetricItem } from "src/app/interfaces/dashboardMetric.item.type";
import { provinceMetrics } from "src/app/interfaces/provinceMetrics.type";
import { DashboardItem } from "../../interfaces/dashboard.item.type";
import { DashboardService } from "../../services/dashboard.service";
import { ToastService } from "../../services/toast.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
@Injectable({
  providedIn: "root",
})
export class DashboardComponent implements OnInit {
  public elements: DashboardItem[] = [];
  public rawData: DashboardItem[] = [];
  public loading = false;
  public minProviceDeath: provinceMetrics;
  public maxProviceDeath: provinceMetrics;
  public mostAfectedProvidence: provinceMetrics;
  public showUpdateForm: boolean = false;
  public showAddForm: boolean = false;
  public cities: any[] = [];

  public ngxLoadingAnimationTypes = {
    chasingDots: "chasing-dots",
    circle: "sk-circle",
    circleSwish: "circleSwish",
    cubeGrid: "sk-cube-grid",
    doubleBounce: "double-bounce",
    none: "none",
    pulse: "pulse",
    rectangleBounce: "rectangle-bounce",
    rotatingPlane: "rotating-plane",
    threeBounce: "three-bounce",
    wanderingCubes: "wandering-cubes",
  };

  constructor(
    private dashboardService: DashboardService,
    private toast: ToastService
  ) { }


  public ngOnInit() {
    this.loading = true;
    this.dashboardService.getNewDashboardData()
      .then((res) => {
        this.getData()
        this.loading = false;
      })

  }
  public openAddForm() {
    this.showAddForm = true;
  }
  public closeAddForm() {
    this.showAddForm = false;
  }
  /**
   * getMetrics
   */
  public newElement(event: any) {
    this.loading = true;
    if (event) {
      const rawDataUpdate = [...this.rawData]
      rawDataUpdate.push(event)
      this.dashboardService.updateDashboardData(rawDataUpdate)
      this.getData()
      this.loading = false;
    }
    this.closeAddForm()
  }
  public getData() {
    try {
      this.rawData = this.dashboardService.getDashboardData();
      this.elements = [...this.rawData]
      const { maxProviceDeath, minProviceDeath, mostAfectedProvidence } = this.dashboardService.getMetricsByState();
      this.minProviceDeath = minProviceDeath
      this.maxProviceDeath = maxProviceDeath
      this.mostAfectedProvidence = mostAfectedProvidence
      this.cities = this.dashboardService.getCitiesInfo();
    } catch (e) {
      console.log(e);
      this.toast.error(
        "No se pudieron obtener los indicadores del dashboard, revise su conexi??n"
      );
    }
  }
}
