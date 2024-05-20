import { CommunityNotice } from "../entities/community-notice";

export interface CommunityNoticeView extends CommunityNotice {
  directoryName: string;
}
