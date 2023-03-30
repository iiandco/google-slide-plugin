import { google, slides_v1 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { getAuthCode } from "./getAuthCode";

export class GoogleSlidesApi {
  private static instance: GoogleSlidesApi;
  private slidesApi: slides_v1.Slides;

  private constructor(authClient: OAuth2Client) {
    this.slidesApi = google.slides({ version: "v1", auth: authClient });
  }

  public static async getInstance(): Promise<GoogleSlidesApi> {
    if (!this.instance) {
      const authClient = await this.authorize();
      this.instance = new GoogleSlidesApi(authClient);
    }
    return this.instance;
  }

  private static async authorize(): Promise<OAuth2Client> {
    const clientId = '802627914353-ssgj5hvgnjr66k7dg7a2ps8eluflbiu5.apps.googleusercontent.com';
    const clientSecret = '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';
    const redirectUri = 'https://googleplugin.pupaproj.ru';
  
    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Missing OAuth2 client configuration");
    }
  
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);
  
    // Получите код авторизации, используя функцию getAuthCode
    const authCode = await getAuthCode(oauth2Client);
  
    // Обменяйте код авторизации на токены доступа и обновления
    const { tokens } = await oauth2Client.getToken(authCode);
    oauth2Client.setCredentials(tokens);
  
    return oauth2Client;
  }
  

  public async getSelectedElement(presentationId: string): Promise<{ text: string; type: string }> {
    const response = await this.slidesApi.presentations.get({ presentationId });
    const currentPageId = response.data.slides?.[0].objectId;

    if (!currentPageId) {
      throw new Error("No slides found");
    }

    const pageElements = response.data.slides[0].pageElements;

    if (!pageElements) {
      throw new Error("No elements found on the slide");
    }

    // Выберите первый элемент на слайде
    const selectedElement = pageElements[0];
    const elementType = selectedElement.elementType;
    const elementText = selectedElement.shape?.text?.textElements?.[0].textRun?.content;

    return {
      text: elementText || "",
      type: elementType || "",
    };
  }
}
