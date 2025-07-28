import express, { Request, Response } from "express";
import AWS from "aws-sdk";

const router = express.Router();

// AWS config (or use .env vars)
AWS.config.update({
  region: "us-east-1", // Change based on your region
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const rekognition = new AWS.Rekognition();

router.post("/verify-photo", async (req: Request, res: Response) => {
  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ error: "Missing image data" });
  }

  try {
    // Remove base64 prefix if present
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Call Rekognition API
    const params = {
      Image: { Bytes: buffer },
      Attributes: ["ALL"],
    };

    rekognition.detectFaces(params, (err, data) => {
      if (err) {
        console.error("AWS Rekognition error:", err);
        return res.status(500).json({ error: "Image analysis failed" });
      }

      const faceDetails = data.FaceDetails;
      if (faceDetails && faceDetails.length > 0) {
        return res.json({ status: "verified", faceDetails });
      } else {
        return res.json({ status: "needsReview", message: "No face detected" });
      }
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Server error during verification" });
  }
});

export default router;
