import environment from "../test-data/environment.json";
import uiSelectors from "../test-data/ui-selectors.json";
import downloadData from "../test-data/download.json";

export const appConfig = {
  baseUrl: environment.baseUrl,
  popupSelectors: environment.popupSelectors,

  selectors: {
    header: uiSelectors.header,
    marketingBanner: uiSelectors.marketingBanner,
    downloadButton: downloadData.selector
  },

  expectations: {
    downloadDomains: downloadData.expectedDomains
  }
};