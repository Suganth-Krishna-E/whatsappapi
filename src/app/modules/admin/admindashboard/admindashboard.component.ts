import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent {

  userName: string | null = "";
  userType: String = "Admin";

  dashBoardResponse: DashboardResponse | null = null;

  subscriptions: Subscription[] = [];

  ratioArray: { label: string, y: number }[] = [];

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.getAllMessagesWithRatio();
  }

  ngOnInit() {
    this.authService.checkLoggedIn();

    this.userName = this.authService.getLoggedUserId();
  }

  getAllMessagesWithRatio() {
    this.subscriptions.push(
      this.dashboardService.getDashboardStatsAdmin().subscribe(
        (response: DashboardResponse) => {
          this.dashBoardResponse = response;
          this.mapResponseToChart(response);
        },
        (error) => {
          Swal.fire("Error", error, "error");
        }
      )
    );
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

  ngOnDestroy() {
    this.subscriptions.forEach(subsriptionValue => {
      subsriptionValue.unsubscribe();
    });
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

