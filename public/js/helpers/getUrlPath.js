export const getPath = () => {
  let completeUrl = window.location.href;

  let urlObj = new URL(completeUrl);
  let path = urlObj.pathname.split("/").pop();
  return path;
};
