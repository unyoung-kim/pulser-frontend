export class API {
  public static uploadImage = async (file: File): Promise<string> => {
    console.log('Converting file to Base64 without uploading.');

    // Return a promise that resolves with the Base64 string
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // On successful read, resolve with the Base64 string
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };

      // On error, reject the promise
      reader.onerror = (error) => {
        console.error('Error converting file to Base64:', error);
        reject(error);
      };

      // Start reading the file as a Data URL (Base64)
      reader.readAsDataURL(file);
    });
  };
}

export default API;
