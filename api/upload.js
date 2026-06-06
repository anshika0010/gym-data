import nextConnect from "next-connect";
import multer from "multer";
import cloudinary from "@/lib/cloudinary";

const upload = multer({ dest: "/tmp" });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: error.message });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: "Method not allowed" });
  },
});

apiRoute.use(upload.single("image"));

apiRoute.post(async (req, res) => {
  try {
    const file = req.file.path;

    const result = await cloudinary.uploader.upload(file, {
      folder: "gym_uploads",
    });

    res.json({
      url: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};