import "dotenv/config";
import { app } from "./src/app.js";
import { createServer } from "http";

const server = createServer(app);
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`server is running at PORT ${PORT}`);
});
