import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WeatherData } from '../../models/weather-data';
import { Chart } from 'chart.js';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  private weatherDataSub?: Subscription;
  private isLoading: boolean = false;
  private weatherData?: WeatherData;
  metricDefault = 'Tmax';
  locationDefault = 'England';
  dataValues: number[] = [];
  metricLabel?: string;
  labels = ['Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private weatherService: WeatherService) { 
    
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.weatherDataSub = this.weatherService.fetchResults('Tmin', this.locationDefault, 2010, 1, 12).subscribe(resData => {
      const newResult: number[] = [];
      resData.forEach((res: WeatherData) => {
        newResult.push(res.value);
      })  
      this.dataValues = newResult;

      //assign variables to Chart object from chart.js
      var myChart = new Chart('myChart', {
        type: 'bar',
        data: {
            labels: this.labels,
            datasets: [{
                label: 'Minimum Temperature for the year 2010',
                data: this.dataValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });       
        
      this.isLoading = false;      
    });
  }

  //submit form
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    } else if(form.value.year.isNaN) {
      alert('The year entry was not a number');
      return;
    }
    
    const year = parseInt(form.value.year);
    const month1 = parseInt(form.value.month1) || 1;
    const month2 = parseInt(form.value.month2) || 12;
    const metric = form.value.metric;
    const location = form.value.location;

    this.isLoading = true;
    this.weatherDataSub = this.weatherService.fetchResults(metric, location, year, month1, month2).subscribe(results => {
      const newResult: number[] = [];
      results.forEach((res: WeatherData) => {
        newResult.push(res.value);
      })  
      this.dataValues = newResult;

      //assign variables to Chart object from chart.js
      var myChart = new Chart('myChart', {
        type: 'bar',
        data: {
            labels: this.labels,
            datasets: [{
                label: metric === 'Tmax' ? 'Maximum Temperature' : metric === 'Tmin' ? 'Minimum Temperature' : metric,
                data: this.dataValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    });
  }  

  //filter results by month when date value changes
  filterByMonth(form: NgForm) {
    const year = parseInt(form.value.year);
    const month1 = parseInt(form.value.month1) || 1;
    const month2 = parseInt(form.value.month2) || 12;
    const metric = form.value.metric || 'Minimum Temperature for the year 2010';
    const location = form.value.location;
    if(month1 >= month2) {
      form.value.month1 = 1;
      form.value.month2 = 12;
      this.ngOnInit();
      alert('Your chosen 1st month should not be greater than your chosen 2nd month');
      return;
    } 
    
    this.weatherDataSub = this.weatherService.results.subscribe(() => {
      const newLabels: any = [];
      const newResult: number[] = [];
      this.dataValues.forEach((res: number, index) => {
        if((index + 1) >= month1 && (index + 1) <= month2) {
          newLabels.push(index);
        }
      });
      console.log(newLabels);

      const newData: number[] = [];
      this.dataValues.forEach((dat, index) => {
        if(newLabels.includes(index)) {
          newData.push(dat);
        }
      })

      const usefulLabels: string[] = [];
      this.labels.forEach((lab: string, index) => {
        if(newLabels.includes(index)) {
          usefulLabels.push(lab);
        }
      })

      //assign variables to Chart object from chart.js
      var myChart = new Chart('myChart', {
        type: 'bar',
        data: {
            labels: usefulLabels,
            datasets: [{
                label: metric === 'Tmax' ? 'Maximum Temperature' : metric === 'Tmin' ? 'Minimum Temperature' : metric,
                data: newData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    });
    
  }

  //clear subscription
  ngOnDestroy() {
    if (this.weatherDataSub) {
      this.weatherDataSub.unsubscribe();
    }
  }

}
