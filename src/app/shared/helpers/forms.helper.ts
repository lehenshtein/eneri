export const tagsForSendDto = (tags: string): string[] => {
  if (!tags) {
    return []
  }
  return tags.split(',').map((element: string) => element.trim());
}

export const createFormDataWithFile = (data: { [key: string]: any }, fieldToClearIfFile?: string): FormData => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key !== 'file') {
      formData.append(key, value as string);
    } else if (key === 'file' && value) {
      formData.append('images', <File>value, (<File>value).name);
      if (fieldToClearIfFile) {
        formData.set(fieldToClearIfFile, 'null');
      }
    }
  }
  return formData;
}
