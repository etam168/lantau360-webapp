import { BusinessVoucher } from "../entities/business-voucher";

export interface BusinessVoucherView extends BusinessVoucher {
  businessName: string;
  directoryName: string;
  directoryTemplate: number;
}
