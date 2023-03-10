import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-form-add',
  templateUrl: './form-add.component.html',
  styleUrls: ['./form-add.component.scss']
})
export class FormAddComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private toast: ToastService
  ) {

  }
  @Output() closeAddForm = new EventEmitter();
  @Output() newElement = new EventEmitter();
  @Input() citiesArr: any[];
  addForm = new FormGroup({
    date: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    accDeath: new FormControl('', Validators.required)
  })
  ngOnInit(): void {
  }

  emitCloseAddForm() {
    this.closeAddForm.emit()
  }

  emitNewElement() {
    const { date, city, accDeath } = this.addForm.value
    const cityInfo = this.citiesArr.find(elem => elem.city == city)

    if (cityInfo) {
      const raw_data = this.dashboardService.getDashboardData().filter(elem => elem.city === cityInfo.city)
      const maxAcumDeath = raw_data.reduce((max, elem) => Math.max(max, elem.deaths), 0)
      if (maxAcumDeath < accDeath) {
        const newElement = {
          'uid': `${cityInfo.city}-${date}`,
          'country': cityInfo.country,
          'provinceState': cityInfo.provinceState,
          'city': cityInfo.city,
          'date': date,
          'population': cityInfo.population,
          'deaths': accDeath
        }
        if (raw_data.findIndex(elem => elem.city == city && elem.date == date) === -1) {
          this.toast.success(
            "Data Added",
            "Success"
          );
          this.newElement.emit(newElement)
          console.log(newElement)
        } else {
          this.toast.error(
            "The data of this city and data exist",
            "Error"
          );
        }

      } else {
        this.toast.error(
          "Death to Date must be grather or equal to the past data",
          "Error"
        );
      }
    }
    else {
      this.toast.error(
        "City not found",
        "Error"
      );
    }
  }

}
