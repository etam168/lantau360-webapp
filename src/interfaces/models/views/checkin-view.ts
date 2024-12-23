import { CheckIn } from "../entities/checkin";

export interface CheckInView extends CheckIn {
    directoryId: number;
    areaName: string;
    areaNameAlt: string;
    directoryName: string;
    siteName: string;
    contactPhone: string;
    title: string;
    subtitle1: string;
    subtitle2: string;
    subtitle3: string;
    description: string;
    imagePath: string;
    bannerPath: string;
    iconPath: string;
    checkInfo: Record<string, any>;
    latitude: number;
    longitude: number;
    directoryMeta: Record<string, any>;
    siteMeta: Record<string, any>;
    createdByUsername: number;
}
