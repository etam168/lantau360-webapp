import { CommunityEvent } from "../entities/community-event";

export interface CommunityEventView extends CommunityEvent {
  directoryName: string;
}
