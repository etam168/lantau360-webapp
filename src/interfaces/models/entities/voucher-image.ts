import { BaseImage } from "../base-entities/base-image";

export interface VoucherImage extends BaseImage {
  businessVoucherId: number;
}
