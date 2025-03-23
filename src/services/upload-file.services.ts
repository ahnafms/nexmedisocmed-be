import ImageKit from "imagekit";

export class UploadFileServices {
  private static imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL || "",
  });

  public static async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      if (!file) {
        throw new Error("No file uploaded");
      }

      const result = await this.imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });

      file.buffer = null as any;

      return result;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Image upload failed");
    }
  }
}
