export function getPage(page, event) {
  let changedPage = page;
  if (event.target.classList.contains("btn-next")) {
    changedPage++;
  }
  if (event.target.classList.contains("btn-prev")) {
    if (changedPage == 0) {
      return changedPage;
    }
    changedPage--;
  }

  return changedPage;
}
