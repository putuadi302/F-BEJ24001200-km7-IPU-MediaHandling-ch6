const route = require("express").Router();
const multerUpload = require("../libs/multer");
const ImageControllers = require("../controllers/imageControllers");

//upload banyak image
route.post(
  "/moreImages",
  multerUpload.array("image"),
  ImageControllers.UploadMoreImage
);

route.get("/allImages", ImageControllers.GetAllImages);
route.get("/getImage/:id", ImageControllers.GetImageById);
route.delete("/deleteImage/:id", ImageControllers.DeleteImage);
route.put("/updateImage/:id", ImageControllers.UpdateImage);

module.exports = route;
