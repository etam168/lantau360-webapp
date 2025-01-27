// image-url.ts
export const IMAGE_URL = {
  BUSINESS_IMAGE: `/BusinessImage`,
  MEMBER_IMAGE: `/MemberImage`,
  POSTING_IMAGE: "/PostingImage",
  SITE_IMAGE: `/BusinessImage`
};

export type ImageURLKey = keyof typeof IMAGE_URL;
