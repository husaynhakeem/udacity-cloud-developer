import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // Function to:
  //     - Download, filter and save the filtered image locally.
  //     - Send back the filtered image to the caller.
  //     - Clear the local filtered image.
  app.get("/filteredimage", async (req, res) => {
    if (!req.query.image_url) {
      res.status(400).send("Invalid request. The image_url query parameter is missing.");
    }

    const imageUrl = req.query.image_url;
    const filterImagePath = await filterImageFromURL(imageUrl);

    res.sendFile(filterImagePath, async (error) => {
      await deleteLocalFiles([filterImagePath]);
      if (!error) {
        res.status(200);
      }
      res.status(500).send("The server has encountered an error while returning the filtered image.");
    });
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();