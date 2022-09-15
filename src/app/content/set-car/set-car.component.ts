import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { StorageService } from 'src/app/services/storage.service';
import { PlateNumber } from 'src/app/validators/plate-number';

@Component({
  selector: 'app-set-car',
  templateUrl: './set-car.component.html',
  styleUrls: ['./set-car.component.css']
})
export class SetCarComponent implements OnInit {

  title = 'Editar coche';
  colorList = ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo', 'Verde', 'Granate', 'Amarillo', 'Rosa', 'Beige'];
  carTypeList = ['Diesel', 'Gasolina', 'Eléctrico', 'Híbrido', 'GLP'];
  yearList: string[] = [];
  // To store query results
  dataSession: any;
  // To inform some error and success
  isCheck: any;
  // To check if plate number stored on db
  carIsTaken: undefined | boolean;

  // name, email, password, city
  setACar = new FormGroup({
    plateNum: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(7),
      this.plateNumber.validate
    ]),
    brand:new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z]+$/),
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    model:new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9 ]+$/),
      Validators.minLength(3),
      Validators.maxLength(15)
    ]),
    color:new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z]+$/),
      Validators.minLength(3),
      Validators.maxLength(15)
    ]),
    doors:new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1),
      Validators.pattern(/^[\d]{1}$/)
    ]),
    type:new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z -ÁÉÍÓÚáéíóúÄËÏÖÜäëïöü]+\D[^/\()@!¡"·$%&()=+*\^{}\[_ªº\]]$/) // diesel, gasolina
    ]),
    kilometers:new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(6),
      Validators.pattern(/^[\d]{1,6}$/)
    ]),
    year:new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern(/^[\d]{4}$/)
    ]),
    engine:new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(4),
      Validators.pattern(/^[\d.]+$/) // diesel, gaslina....
    ])
  });

  constructor(
    private plateNumber: PlateNumber,
    private sessionService: SessionService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {

    // Create an populate a year list for the input year select
    let iniYear: number = 2000;
    let lastYear: any = new Date((new Date()).getTime() + 24*60*60*1000);
    lastYear = lastYear.getFullYear();

    for(let i = lastYear; i >= iniYear; i--) {
      this.yearList.push(i.toString());
    }

  }

  onSubmit(e: any) {

    let plateNum = this.setACar.controls['plateNum'].value;
    let brand = this.setACar.controls['brand'].value;
    let model = this.setACar.controls['model'].value;
    let color = this.setACar.controls['color'].value;
    let doors = this.setACar.controls['doors'].value;
    let type = this.setACar.controls['type'].value;
    let kilometers = this.setACar.controls['kilometers'].value;
    let year = this.setACar.controls['year'].value;
    let engine = this.setACar.controls['engine'].value;
    let userId = JSON.parse(this.sessionService.getData('user-id') || ' {}');
    let id = 0;

    if(
        plateNum != '' &&
        brand != '' &&
        model != '' &&
        color != '' &&
        doors != '' &&
        type != '' &&
        kilometers != '' &&
        year != '' &&
        engine != ''     
    ) {

      // Check if the plate number is already stored
      this.storageService.checkCar(plateNum)
        .subscribe(
          (check: any) => {
            // If no records about this plate number you are free to store the car
            if(check.length == 0) {
              this.carIsTaken = false;
              this.storageService
                .setCar(plateNum, brand, model, color, doors, type, kilometers,year, engine, userId, id)
                .subscribe(
                  res => {
                    this.dataSession = res;
                    this.isCheck = 'INSERT_SUCCESS';
                    this.router.navigateByUrl('/car');  
                  },
                  (err: any) => {
                    this.isCheck = 'INSERT_ERROR'; 
              });
            } else {
              this.carIsTaken = true;
            }
          },
          error => {
            console.error('ERROR', plateNum, error)
          }
        );

    } else {
      // TODO retornar un toast ???
      this.isCheck = 'EMPTY_FIELDS_ERROR';
      console.error(this.isCheck)
    }

  }

}
