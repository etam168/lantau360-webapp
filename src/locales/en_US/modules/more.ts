import { message } from "typia/lib/protobuf";

export default {
  title: "More",
  mainMenu: {
    logon: "Sign in",
    logoff: "Logout",
    joinNow: "Join now",
    language: "Language",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    profile: "Profile",
    aboutUs: "About",
    account: "Account",
    myCheckin: "My Check-In"
  },

  mainMenuDialog: {
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    aboutUs: "About",
    myCheckin: "My Check-In",
    profileDetail: {
      title: "Profile",
      save: "Save"
    },
    account: {
      title: "Account",
      expired: "Expired",
      availablePoints: "Points Balance : {availablePoints}",
      spentPoints: "By this time you spent {spentPoints}",
      topUpPoints: "Top-up Points",
      recentTransactions: "Recent Transactions",
      history: "History",
      recent: "Last 3 months",
      repost: "Repost",
      topUpYourAccount: "Top-up your account",
      topUpAmount: "Top-up Amount",
      essentialInformation: "Enter the essential information below to top up your points",
      payByStrip: "Pay By Strip",
      paymentOptions: "Payment Options",
      noRecord: "There is no Record to show you right now."
    }
  },

  footer: {
    version: "Ver {version}",
    copyright: "© {currentYear} Lantau360.com."
  },

  topUp: {
    freePoints: {
      option1: "Option 1",
      subtitle: "Free top-up points",
      description:
        "Claim 100 free points to publish a post in the community. Users have the opportunity to claim free points once a month, allowing them to participate and share their thoughts and content without any cost",
      buttonText: "CLAIM YOUR FREE POINT",
      error: "You have already claimed your 100 free points for this month."
    },
    purchasePoints: {
      title: "Option 2",
      subtitle: "Purchase top-up points",
      description:
        "Purchase points to gain the ability to publish posts in the community module. By buying points, users can actively participate and share their thoughts, ideas, and content with the community",
      buttonText: "PURCHASE"
    }
  },
  message:{
    pointsAlreadyAvailed: "Free points have already been claimed this month"
  }
};
