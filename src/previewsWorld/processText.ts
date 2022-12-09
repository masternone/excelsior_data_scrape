import * as puppeteer from 'puppeteer';

export const processText = async (
  page: puppeteer.Page,
  textElement: puppeteer.ElementHandle<Element> | null
): Promise<{ Text?: string; Rated?: string }> => {
  if (!textElement) {
    return { Text: '', Rated: '' };
  }
  const textText = await page.evaluate((el) => {
    for (const selector of [
      '#PageContent > div.CatalogFullDetail > div.Text > div.ItemCode',
      '#PageContent > div.CatalogFullDetail > div.Text > div.Creators',
      '#PageContent > div.CatalogFullDetail > div.Text > div.ReleaseDate',
      '#PageContent > div.CatalogFullDetail > div.Text > div.SRP',
      '#PageContent > div.CatalogFullDetail > div.Text > a',
      '#PageContent > div.CatalogFullDetail > div.Text > div:nth-child(7)',
      '#PageContent > div.CatalogFullDetail > div.Text > div:nth-child(7) > div.pullboxButtons',
    ]) {
      const element = document.querySelector(selector);
      element?.parentNode?.removeChild(element);
    }
    return el?.textContent
      ?.replace(/ORDER|SUBSCRIBE|WISH LIST|Click to View/g, '')
      .trim();
  }, textElement);
  const [Text, Rated] = (textText?.split('Rated') || []).map((item, index) => {
    switch (index) {
      case 0:
        return `<p>${item.trim().replace(/([^-]{2})\s\s+/g, '$1</p><p>')}</p>`;
      case 1:
      default:
        return item.length > 0 ? `Rated ${item.trim()}` : '';
    }
  });
  return { Text, Rated };
};
