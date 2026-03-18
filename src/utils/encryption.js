import CryptoJS from "crypto-js";
const SECRET_KEY = "shopi-ecommerce-app-2024";

export const encryptToken = (token) => {
  try {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return token;
  }
};

export const decryptToken = (encryptedToken) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedToken;
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedToken;
  }
};
