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
    const quarter = Math.floor((today.getMonth() + 3) / 3);
    const endOfQuarterMonth = new Date(today.getFullYear(), quarter * 3 + 1, 0);
    const endOfQuarterMonthDate = new Date(
      today.getFullYear(),
      quarter * 3 + 2,
      0
    );
  
    return `QE-${formatDate(region, endOfQuarterMonth, {
      month: "short",
    })}-${formatDate(region, endOfQuarterMonthDate, {
      day: "numeric",
    })}-${today.getFullYear()}`;
  }