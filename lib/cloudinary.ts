export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing in .env")
  }

  const data = new FormData();
  
  data.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  
  data.append('upload_preset', uploadPreset)
  data.append('cloud_name', cloudName)

  const response = await fetch(`https://api.cloudinary.com/v1_1/dulfxe0gb/image/upload`, {
    method: 'POST',
    body: data,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })

  const result = await response.json()

  if (result.secure_url) {
    return result.secure_url
  } else {
    throw new Error(result.error?.message || "Cloudinary upload failed")
  }
}