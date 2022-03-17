export function setFileHandler(e) {
  const reader = new FileReader();
  const target = e.target.files[0];

  reader.onloadend = () => {
    return {
      target: target,
      filePreviewUrl: reader.result,
    };
  };

  reader.readAsDataURL(target);
}
