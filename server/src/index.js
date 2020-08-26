const appName = "Photo Gallery API"; 
const port = process.env.PORT || 8080;
const createServer = require("./server");
const server = createServer({
  photosDb: "photos.db",
  albumsDb: "albums.db"
});
server.listen(port, () => console.log(`${appName} running on port ${port}!`));