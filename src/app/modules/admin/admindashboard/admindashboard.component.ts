import { Component } from '@angular/core';
import { LoggeduserService } from '../../../services/loggeduser/loggeduser.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent {

  userName: string | null = "";
  userType: String = "Admin";

  dashBoardResponse: DashboardResponse | null = null;

  ratioArray: { label: string, y: number }[] = [];

  constructor(
    private loggedUserService: LoggeduserService,
    private dashboardService: DashboardService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.getAllMessagesWithRatio();
  }

  ngOnInit() {
    if (!this.loggedUserService.getUserId()) {
      Swal.fire("Login Error", "User Not Logged In", "error").then(() => {
        this.router.navigate(['/login']);
      });
    }
  }

  getAllMessagesWithRatio() {
    this.dashboardService.getDashboardStatsAdmin().subscribe(
      (response: DashboardResponse) => {
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
        text: "Session by Status"
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

  chartOptions = {
    animationEnabled: true,
    title: {
      text: "Session by Status"
    },
    data: [{
      type: "pie",
      startAngle: -90,
      indexLabel: "{label}: {y}%",
      yValueFormatString: "#,###.##'%'",
      dataPoints: [...this.ratioArray]
    }]
  };

  loadUsersPage() {
    this.router.navigate(['../users'], { relativeTo: this.activatedRoute });
  }

  loadComplaintsPage() {
    this.router.navigate(['../complaints'], { relativeTo: this.activatedRoute });
  }

}

interface DashboardResponse {
  noOfUsers?: number;
  noOfSessions?: number;
  noOfActiveSessions?: number;
  noOfInactiveSessions?: number;
  noOfUnsolvedComplaints?: number;
  totalNoOfMessages?: number;
  totalNoOfPointRequests?: number;
  ratios: { [key: string]: string };
}

