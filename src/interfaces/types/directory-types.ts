import { BusinessDirectory } from "../models/entities/business-directory";
import { CommunityDirectory } from "../models/entities/community-directory";
import { SiteDirectory } from "../models/entities/site-directory";

export type DirectoryTypes = SiteDirectory | CommunityDirectory | BusinessDirectory;
