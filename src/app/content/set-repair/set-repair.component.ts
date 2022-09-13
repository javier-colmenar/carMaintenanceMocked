import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { StorageService } from 'src/app/services/storage.service';
import { PlateNumber } from 'src/app/validators/plate-number';

@Component({
  selector: 'app-set-repair',
  templateUrl: './set-repair.component.html',
  styleUrls: ['./set-repair.component.css']
})
export class SetRepairComponent implements OnInit {

  title = 'Añadir/editar reparación';
  carList: string[] = [];
  dataSession: any;
  isCheck: any;


  setRepair = new FormGroup({
    plateNum: new FormControl('', [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(7),
      this.plateNumber.validate
    ]),
    faultyPart:new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z]+$/),
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    faultyDescription:new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9]+[`!_,¿?=)(/&%$·"ªº\\^*+)]$/),
      Validators.minLength(5),
      Validators.maxLength(15)
    ]),
    dateIn:new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(1),
      Validators.pattern(/^[\d]{1}$/)
    ]),
    fixDescription:new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z -ÁÉÍÓÚáéíóúÄËÏÖÜäëïöü]+\D[^/\()@!¡"·$%&()=+*\^{}\[_ªº\]]$/) // diesel, gasolina
    ]),
    fixedOn:new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(6),
      Validators.pattern(/^[\d]{1,6}$/)
    ]),
    status:new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
      Validators.pattern(/^[\d]{4}$/)
    ]),
    repeat:new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[\d.]+$/) // diesel, gaslina....
    ]),
    cost:new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(4),
      Validators.pattern(/^[\d]+$/)
    ]),
    minutes:new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(3),
      Validators.pattern(/^[\d]+$/)
    ])
  });

  constructor(
    private plateNumber: PlateNumber,
    private sessionService: SessionService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
  // Get the user id from storage
  let userId = JSON.parse(this.sessionService.getData('user-id') || ' {}');
  userId = userId.toString();

    // Get the user data
    this.storageService.getCar(userId)
    .subscribe(
      res => {
        this.dataSession = res;
        this.isCheck = 'SUCCESS';

        for (let i = 0; i < this.dataSession.length; i++) {
          this.carList.push(this.dataSession[i]['plateNumber']);
        }

      },
      (err: any) => {
        this.isCheck = 'ERROR_USER';
      });


  }
  
  onSubmit(e: any) {

  }

}
