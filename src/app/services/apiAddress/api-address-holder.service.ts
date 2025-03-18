import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiAddressHolderService {

  userLoginUrl = 'http://localhost:5004/api/whatsapp/user/login';
  
  complaintUrl = 'http://localhost:5004/api/whatsapp/complaint/';

  pointsUrl = 'http://localhost:5004/api/whatsapp/points/';

  pointRequestUrl = 'http://localhost:5004/api/whatsapp/pointrequest/';

  paymentWebSocketUrl = 'ws://localhost:5007';

  whatsAppUrl = 'http://localhost:5004/api/whatsapp/user/';

  whatsAppSessionWebSocketUrl = 'ws://localhost:5005';

  generateWhatsAppSessionUrl = 'http://localhost:5004/api/whatsapp/generateQR';

  deleteWhatsAppSessionUrl = 'http://localhost:5004/api/whatsapp/deleteSession';

  whatsAppKeyUrl = 'http://localhost:5004/api/whatsapp/key/';

  dashboardUrl = 'http://localhost:5004/api/whatsapp/dashboard/';

  getAllMessagesByUserIdUrl = 'http://localhost:5004/api/whatsapp/message/getAllMessagesByUserId';

  getTotalMessagesCountUrl = 'http://localhost:5004/api/whatsapp/message/getTotalPageCount';

  constructor() { }


}
