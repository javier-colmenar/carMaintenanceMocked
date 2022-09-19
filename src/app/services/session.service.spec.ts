import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  // Since we are creating a browser value, this data MUST CLEANED before
  afterEach(() => {
    service.removeData('user-session');
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Check set Session object', () => {
    service.saveData('user-session', 'logged-in');
    expect(service.getData('user-session')).toEqual('"logged-in"');
  });

  it('Should remove all Session Storag data', () => {

    // Set some values
    service.saveData('Testing value 1', 1);
    service.saveData('Testing value 2', 2);
    service.saveData('Testing value 3', '3');
    service.saveData('Testing value 4', true);
    service.saveData('Testing value 5', false);

    // Throw values from console to check they exists
    console.info(service.getData('Testing value 1'));
    console.info(service.getData('Testing value 2'));
    console.info(service.getData('Testing value 3'));
    console.info(service.getData('Testing value 4'));
    console.info(service.getData('Testing value 5'));

    // Remove all
    service.clearData();

    // Check result
    expect(service.getData('Testing value 1')).toBeNull();

  })
  
});
