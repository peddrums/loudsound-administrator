/*export function generateImgPath(id, path) {
    const imgStoragePath = `expenses/${formatDatePath()}/${id}`;
  
    return imgStoragePath;
  }*/

function formatDate(region, date, options) {
  return new Intl.DateTimeFormat(region, options).format(date);
}

export function formatDatePath() {
  const region = "en-GB";
  const today = new Date();
  const quarter = Math.floor((today.getMonth() + 2) / 3);
  const endOfQuarterDate = new Date(today.getFullYear(), quarter * 3 + 1, 0);

  return `QE-${formatDate(region, endOfQuarterDate, {
    month: "short",
  })}-${formatDate(region, endOfQuarterDate, {
    day: "numeric",
  })}-${today.getFullYear()}`;
}
