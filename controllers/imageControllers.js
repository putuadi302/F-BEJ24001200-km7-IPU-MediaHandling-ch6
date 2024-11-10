const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../libs/imagekit");

class ImageControllers {
  // static async UploadImage(req, res) {
  //   const { title, description } = req.body;
  //   // Validasi jika tidak ada file yang diunggah
  //   if (req.files.length === 0) {
  //     return res.status(400).json({
  //       message: "Bad Request",
  //       error: "Minimal upload 1 foto",
  //     });
  //   }

  //   try {
  //     const result = await imagekit.upload({
  //       file: req.file.buffer,
  //       fileName: req.file.originalname,
  //     });

  //     const image = await prisma.image.create({
  //       data: {
  //         title,
  //         description,
  //         profileImageUrl: result.url,
  //         imageFieldId: result.fileId,
  //       },
  //     });

  //     res.json(image);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }
  static async UploadMoreImage(req, res) {
    try {
      const { titles, descriptions } = req.body;

      // Proses pengunggahan gambar ke ImageKit dan penyimpanan ke database
      const uploadResults = await Promise.all(
        req.files.map(async (fileData, index) => {
          const bufferData = fileData.buffer.toString("base64");

          // Upload ke ImageKit
          const uploadedImage = await imagekit.upload({
            fileName: fileData.originalname,
            file: bufferData,
          });

          // Simpan setiap gambar yang berhasil diunggah ke database menggunakan Prisma
          return await prisma.image.create({
            data: {
              title: titles[index],
              description: descriptions[index],
              profileImageUrl: uploadedImage.url,
              imageFieldId: uploadedImage.fileId,
            },
          });
        })
      );

      // Kirimkan hasil sebagai respon
      res.status(201).json({
        message: "Images uploaded and saved successfully",
        data: uploadResults,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async GetAllImages(req, res) {
    try {
      const images = await prisma.image.findMany();
      if (images.length === 0) {
        return res.status(404).json({ message: "No images found." });
      }
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async GetImageById(req, res) {
    const { id } = req.params;
    try {
      const image = await prisma.image.findUnique({
        where: { id: parseInt(id) },
      });
      if (!image) return res.status(404).json({ error: "Image not found" });
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async DeleteImage(req, res) {
    const { id } = req.params;

    try {
      const image = await prisma.image.findUnique({
        where: { id: parseInt(id) },
      });
      if (!image) return res.status(404).json({ error: "Image not found" });

      // Pastikan imageFieldId ada sebelum melanjutkan
      if (!image.imageFieldId) {
        return res.status(400).json({ error: "Image URL is missing" });
      }

      // Ambil fileId dari imageFieldId
      const fileId = image.imageFieldId.split("/").pop(); // Menggunakan imageFieldId
      await imagekit.deleteFile(fileId);

      await prisma.image.delete({ where: { id: parseInt(id) } });
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async UpdateImage(req, res) {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      // Mencari gambar berdasarkan ID
      const image = await prisma.image.findUnique({
        where: { id: parseInt(id) },
      });

      // Validasi jika gambar dengan ID tidak ditemukan
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }

      // Melakukan pembaruan jika gambar ditemukan
      const updatedImage = await prisma.image.update({
        where: { id: parseInt(id) },
        data: { title, description },
      });

      // Mengirimkan gambar yang sudah diperbarui
      res.json(updatedImage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ImageControllers;
