// bulletin-types.ts
import { CommunityEventView } from "@/interfaces/models/views/community-event-view";
import { CommunityNews } from "@/interfaces/models/entities/community-news";
import { CommunityNotice } from "@/interfaces/models/entities/community-notice";

export type BulletinTypes = CommunityEventView | CommunityNotice | CommunityNews;
