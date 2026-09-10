import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initGameServer } from "./src/server/gameServer";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  });

  initGameServer(httpServer);

  httpServer.listen(port, () => {
    console.log(`> Boek van Mormon draait op http://${hostname}:${port}`);
  });
});
