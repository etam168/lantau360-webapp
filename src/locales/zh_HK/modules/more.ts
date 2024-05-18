export default {
  title: "更多",
  language: "語言",
  aboutUs: "關於我們",
  terms: "條款與條件",
  privacy: "隱私政策",
  locationPermission: "位置權限",
  login: "登入",
  profile: "個人資料",
  logout: "登出",
  loginName: "登入名稱",

  checkIn: {
    title: "我的簽到",
    detail: "簽到信息詳細",
    history: "歷史",
    map: "地圖",
    lastCheckIn: "上次簽到：{date}",
    noCheckIn: "您沒有任何簽到記錄"
  },

  creditCard: {
    title: "付款",
    cardNumber: "卡號",
    expiryDate: "到期日",
    cvv: "CVV",
    proceedToPay: "繼續付款",
    subtitle: "您正在進行此付款，因為您已達到本月的積分限額",
    total: "總計：{amount}",
    payByCreditCard: "信用卡支付"
  },

  account: {
    title: "帳戶",
    availablePointBalance: "可用積分餘額",
    recentTransactions: "最近交易",
    history: "歷史",
    repost: "重新發布",
    topUpYourAccount: "充值您的帳戶",
    topUpAmount: "充值金額",
    essentialInformation: "請輸入以下必要信息以充值積分",
    payByStrip: "通過Stripe支付",
    paymentOptions: "支付選項"
  },

  profileSetting: {
    buyPoints: "儲值積分",
    title: "個人資料",
    subtitle: "選擇您在應用程式中的顯示方式",
    save: "儲存",
    profileUpdate: "個人資料已更新",
    availablePoints: "积分余额 : {availablePoints}",
    bythisTimeText: "截至目前您已花費 {spentPoints} 積分",
    pointLessThan50: "請在積分餘額少於 {points} 時再試",
    claimFreePointText: "您確定要領取您的免費 {points} 積分嗎？",
    enoughPoints: "足夠的積分",
    confirmation: "確認",
    expired: "已過期"
  },

  contentDialog: {
    title: {
      privacy: "隱私政策",
      terms: "條款與條件",
      aboutUs: "關於我們"
    }
  },

  message: {
    claimedFreePointsSuccessfully: "您已成功領取免費積分",
    enoughPoints: "您有足夠的積分來創建新的帖子。",
    notPosting: "此記錄未發布",
    purchasePointSuccessfully: "成功購買積分",
    transactionSuccess: "交易成功",
    transactionCancelled: "交易請求已取消",
    invalidRequestData: "請求數據無效",
    stripeReferenceNotInitiazed: "Stripe引用未初始化"
  },

  footer: {
    version: "{version} 版本",
    copyright: "© {currentYear} Lantau360.com"
  },

  topUpSection: {
    option1: "选项1",
    option2: "选项2",
    purchase: "购买",
    claimYourFreePoint: "领取您的免费积分",
    freeTopUpPoints: "免费充值积分",
    purchaseTopUpPoints: "购买充值积分",
    claimDescription:
      "索取 {point} 免费积分以在社区中发布帖子。用户每月有机会领取两次免费积分，从而无需支付任何费用即可参与并分享他们的想法和内容",
    alreadyClaimedDescription:
      "您已领取本月的 {point} 免费积分。要继续在社区中发帖，请购买额外积分并继续分享您宝贵的见解和内容。",
    purchasePointsDescription:
      "购买积分以获得在社区模块中发布帖子的权限。通过购买积分，用户可以积极参与并与社区分享他们的想法、观点和内容。"
  }
};
