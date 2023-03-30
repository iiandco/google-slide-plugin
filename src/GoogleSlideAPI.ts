import { google, slides_v1, drive_v3 } from "googleapis";
import { GoogleAuth, OAuth2Client } from "googleapis-common";

export async function getGoogleSlideAPI(accessToken: string): Promise<slides_v1.Resource$Presentations> {
  const auth = new OAuth2Client();
  auth.setCredentials({ access_token: accessToken });

  const slidesAPI = google.slides({ version: "v1", auth });
  return slidesAPI.presentations;
}

export async function getGoogleDriveAPI(accessToken: string): Promise<drive_v3.Resource$Files> {
  const auth = new OAuth2Client();
  auth.setCredentials({ access_token: accessToken });

  const driveAPI = google.drive({ version: "v3", auth });
  return driveAPI.files;
}

export async function getPresentations(driveAPI: drive_v3.Resource$Files): Promise<drive_v3.Schema$File[]> {
  const response = await driveAPI.list({
    q: "mimeType='application/vnd.google-apps.presentation'",
    fields: "nextPageToken, files(id, name)",
  });

  return response.data.files || [];
}
