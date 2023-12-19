// bulletin-types.ts
import { CommunityEvent } from "@/interfaces/models/entities/community-event";
import { CommunityNews } from "@/interfaces/models/entities/community-news";
import { CommunityNotice } from "@/interfaces/models/entities/community-notice";

export type BulletinTypes = CommunityEvent | CommunityNotice | CommunityNews;
