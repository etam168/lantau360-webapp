import { Posting } from "../entities/posting";

export interface PostingView extends Posting {
  memberFirstName: string;
  memberLastName: string;
  memberAlias: string;
  memberPhone: string;
  memberEmail: string;
  memberImage: string;
}
