const landingPageService = {
  getLandingPage: async function () {
    return {
      status: 200,
      body: {
        message: "Landing page data fetched successfully.",
        status: "success",
        data: {
          landingPagePrimaryMessage: "Discover products you'll love",
          landingPageSecondaryMessage:
            "Thoughtfully curated everyday essentials, delivered to your door.",
          searchMessage: "Search products...",
        },
      },
    };
  },
};

module.exports = landingPageService;
