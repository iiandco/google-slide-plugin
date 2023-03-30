import express from "express";
import { OAuth2Client } from "google-auth-library";

export function startAuthServer(
  oauth2Client: OAuth2Client,
  onAuthCodeReceived: (authCode: string) => void,
  onError: (error: Error) => void
) {
  const app = express();

  // Эндпоинт для получения кода авторизации
  app.get("/oauth2callback", async (req, res) => {
    const authCode = req.query.code;

    if (typeof authCode === "string") {
      onAuthCodeReceived(authCode);
      res.send("Authorization successful. You can close this window.");
    } else {
      const error = new Error("Failed to receive authorization code");
      onError(error);
      res.status(500).send(error.message);
    }

    server.close();
  });

  // Запускаем сервер авторизации
  const server = app.listen(3000, () => {
    console.log("Authorization server running on http://localhost:3000");
  });

  return server;
}
