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
    console.log('caa', this.citiesArr)
  }

  emitCloseAddForm() {
    this.closeAddForm.emit()
  }

  emitNewElement() {
    const raw_data = this.dashboardService.getDashboardData()
    const { date, city, accDeath } = this.addForm.value

    const newElement = {
      'uid': `${city}-${date}`,
      'country': city.country,
      'provinceState': city.provinceState,
      'city': city.city,
      'date': date,
      'population': city.population,
      'deaths': accDeath
    }
    this.newElement.emit(newElement)
  }

}
