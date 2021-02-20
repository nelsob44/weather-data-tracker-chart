import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeatherData } from '../../models/weather-data';
import { By } from '@angular/platform-browser';
import { MockData } from './mock-data';
import { of } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { ChartComponent } from './chart.component';
import { FormsModule } from '@angular/forms';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let mockData: MockData;
  let weatherService: WeatherService;

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      providers: [WeatherService, MockData],
      declarations: [ChartComponent]
    });
    weatherService = TestBed.inject(WeatherService);
    mockData = TestBed.inject(MockData);
  });
  
  it('should create weatherservice', () => {
    expect(weatherService).toBeTruthy();
  });

  it('should create chart component', () => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('fetchResults', () => {
    it('should return a collection of weather data', () => {
      const weatherDataResponse = mockData.returnedData;
      let response;
      spyOn(weatherService, 'fetchResults').and.returnValue(of(weatherDataResponse));

      weatherService.fetchResults('Tmin', 'England', 2010, 1, 12).subscribe(res => {
        response = res;
      });

      expect(response).toEqual(weatherDataResponse);
    });
  });

  it('should verify submit button is on page', () => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    let buttonElement = fixture.debugElement.query(By.css('.set-button'));
    expect(buttonElement).toBeTruthy();
  });

  it('should verify onSubmit function is called when button is clicked', () => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    let buttonElement = fixture.debugElement.query(By.css('.set-button'));
    
    buttonElement.triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.onSubmit).toHaveBeenCalled();
    });
  });
});
