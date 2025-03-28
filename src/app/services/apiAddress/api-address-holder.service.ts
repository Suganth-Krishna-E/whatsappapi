import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiAddressHolderService {

  baseUrl = environment.baseUrl;

  userLoginUrl = this.baseUrl + 'user/login';
  
  complaintUrl = this.baseUrl + 'complaint/';

  pointsUrl = this.baseUrl + 'points/';

  pointRequestUrl = this.baseUrl + 'pointrequest/';

  paymentWebSocketUrl = environment.paymentWebSocketUrl;

  whatsAppUrl = this.baseUrl + 'user/';

  whatsAppSessionWebSocketUrl = environment.whatsAppSessionWebSocketUrl;

  generateWhatsAppSessionUrl = this.baseUrl + 'session/generateQR';

  deleteWhatsAppSessionUrl = this.baseUrl + 'session/deleteSession';

  whatsAppKeyUrl = this.baseUrl + 'key/';

  dashboardUrl = this.baseUrl + 'dashboard/';

  getAllMessagesByUserIdUrl = this.baseUrl + 'message/getAllMessagesByUserId';

  getTotalMessagesCountUrl = this.baseUrl + 'message/getTotalPageCount';

  verifyJWTTokenUrl = this.baseUrl + 'jwtutils/verifyJwt';

  constructor() { }


}
