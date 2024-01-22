export async function createFile(imgPath) {
  const resp = await fetch(imgPath);
  const blob = await resp.blob();
  const ext = blob.type.split("/").at(-1);
  const newFile = new File([blob], `archivo.${ext}`, { type: blob.type });
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(newFile);
  return dataTransfer;
}
