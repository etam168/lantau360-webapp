import { BusinessDirectory } from "../models/entities/business-directory";
import { CommunityDirectory } from "../models/entities/community-directory";
import { Directory } from "../models/entities/directory";

export type DirectoryTypes = Directory | CommunityDirectory | BusinessDirectory;
