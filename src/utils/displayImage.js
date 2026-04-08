export const bufferToDataURL = (imageObj) => {
  if (!imageObj?.data?.data) return "/api/placeholder/400/400";
  const uint8Array = new Uint8Array(imageObj.data.data);
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const base64 = btoa(binary);
  return `data:${imageObj.contentType};base64,${base64}`;
};
