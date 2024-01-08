import { BaseImage } from "../base-entities/base-image";

export interface CommunityEventImage extends BaseImage {
  communityEventId: number;
}
