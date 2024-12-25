import jsonwebtoken from 'jsonwebtoken';

/**
 * TODO: Better handle jwt token
 * See https://tiptap.dev/docs/editor/extensions/functionality/export
 * @param secretKey
 * @returns
 */
export const getJwtToken = (secretKey: string): string => {
  //   if (!secretKey) {
  //     throw new Error('Secret key is required');
  //   }

  const payload = {
    // userId: "user123",
    // iat: Math.floor(Date.now() / 1000),
    // exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours from now
  };

  return jsonwebtoken.sign(payload, secretKey);
};
