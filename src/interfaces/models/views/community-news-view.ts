import { CommunityNews } from "../entities/community-news";

export interface CommunityNewsView extends CommunityNews {
  directoryName: string;
}
