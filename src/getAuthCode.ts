import { OAuth2Client } from "google-auth-library";
import open from "open";
import { startAuthServer } from "./auth-server";

export async function getAuthCode(oauth2Client: OAuth2Client): Promise<string> {
  return new Promise(async (resolve, reject) => {
    // Запускаем сервер авторизации
    const server = startAuthServer(oauth2Client, resolve, reject);

    // Открываем страницу авторизации Google в браузере пользователя
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/presentations.readonly"],
    });
    await open(authUrl);

    // Устанавливаем таймаут на случай, если пользователь не завершит процесс авторизации
    setTimeout(() => {
      reject(new Error("Authorization timeout"));
      server.close();
    }, 60000); // Таймаут в 60 секунд
  });
}
