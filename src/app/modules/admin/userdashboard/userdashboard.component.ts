import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrl: './userdashboard.component.css'
})
export class UserdashboardComponent {

  userName: string | null = "";
  userType: String = "User";

  dashBoardResponse: DashboardResponse | null = null;

  ratioArray: { label: string, y: number }[] = [];

  constructor(private dashboardService: DashboardService, private loggedUserService: LoggeduserService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userName = params.get('userId');
      this.getAllMessagesWithRatio();
    });
  }

  ngOnInit() {
    if (!this.loggedUserService.getUserId()) {
      Swal.fire("Login Error", "User Not Logged In", "error").then(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  getAllMessagesWithRatio() {
    this.dashboardService.getDashboardStatsUser(this.userName).subscribe(
      (response) => {
        this.dashBoardResponse = response;
        this.mapResponseToChart(response);
      },
      (error) => {
        Swal.fire("Error", error, "error");
      }
    )
  }

  mapResponseToChart(inputData: DashboardResponse) {
    if (!inputData || !inputData.ratios) {
      return;
    }

    this.ratioArray = Object.entries(inputData.ratios).map(([status, ratio]) => ({
      label: status,
      y: parseFloat(ratio.toString().replace('%', ''))
    }));

    this.chartOptions = {
      animationEnabled: true,
      title: {
        text: "Messages by Status"
      },
      data: [{
        type: "pie",
        startAngle: -90,
        indexLabel: "{label}: {y}%",
        yValueFormatString: "#,###.##'%'",
        dataPoints: [...this.ratioArray]
      }]
    };
  }

  getKeyPage(): void {
    this.router.navigate(['../apiinterface'], { relativeTo: this.activatedRoute });
  }

  getLoggedRole(): boolean {
    return this.router.url.startsWith("/admin/dashboard");
  }

  sessionDataWithColor(): String {
    if (this.dashBoardResponse?.whatsAppSessionDetail === "active") {
      return "green-session";
    }
    else {
      return "red-session";
    }
  }

  chartOptions = {
    animationEnabled: true,
    title: {
      text: "Messages by Status"
    },
    data: [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{label}: {y}%",
      yValueFormatString: "#,###.##'%'",
      dataPoints: [...this.ratioArray]
    }]
  };

}

interface DashboardResponse {
  totalBoughtPoints?: number;
  totalLeftPoints?: number;
  totalRequestedPoints?: number;
  apiKeyLastGeneratedDateTime?: String;
  whatsAppSessionDetail?: String;
  whatsAppLastRegisteredDateTime?: String;
  sent?: number;
  failed?: number;
  ratios: { [key: string]: string };
  totalMessages: number;
}

