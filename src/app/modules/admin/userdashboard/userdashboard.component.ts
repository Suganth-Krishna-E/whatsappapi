import { Component } from '@angular/core';
import { DashboardService } from '../servies/dashboard.service';
import { LoggeduserService } from '../../user/services/loggeduser.service';
import { error } from 'console';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrl: './userdashboard.component.css'
})
export class UserdashboardComponent {

  ratioArray: RatioMessages[] | null = null;

  constructor(private dashboardService: DashboardService, private loggedUserService: LoggeduserService) {
    this.getAllMessagesWithRatio();
  }

  getAllMessagesWithRatio() {
    this.dashboardService.getAllMessagesWithRatio(this.loggedUserService.getUserId()).subscribe(
      (response) => {
        console.log(response);
        this.convertObjectToRatioMessages(response);
      },
      (error) => {
        console.log(error);
      }
    )
  }
  
  convertObjectToRatioMessages(inputData: Response) {
    console.log(inputData);
  }

  chartOptions = {
	  animationEnabled: true,
	  title: {
		text: "Messages by Status"
	  },
	  data: [{
		type: "pie",
		startAngle: -90,
		indexLabel: "{status}: {ratio}",
		yValueFormatString: "#,###.##'%'",
		dataPoints: this.ratioArray
	  }]
	}
}



interface RatioMessages {
  ratio: number;
  status: String;
}

interface RatioResponse {
  ratios: RatioMessages;
}

interface Response {
  FAILED: String;
  SENT: String;
  totalMessages: number;
  ratios: RatioResponse;
}


