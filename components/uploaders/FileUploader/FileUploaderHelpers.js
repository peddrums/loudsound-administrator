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

  function getTheYear() {
    if (endOfQuarterDate.getMonth() === 0 && today.getMonth() > 9 || endOfQuarterDate.getMonth() === 1 && today.getMonth() > 9) {
      return endOfQuarterDate.getFullYear() + 1;
    }

    return endOfQuarterDate.getFullYear();
  }

  return `QE-${formatDate(region, endOfQuarterDate, {
    month: "short",
  })}-${formatDate(region, endOfQuarterDate, {
    day: "numeric",
  })}-${getTheYear()}`;
}
