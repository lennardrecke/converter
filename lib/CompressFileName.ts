interface Props {
  fileName: any;
}

export default function CompressFileName({ fileName }: Props): String {
  const maxSubstrLength = 20;

  if (fileName.length > maxSubstrLength) {
    const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');

    const extension = fileName.split('.').pop();

    const substrLen =
      maxSubstrLength -
      (fileNameWithoutExtension.length + extension.length + 3);

    const compressedFileName =
      fileNameWithoutExtension.substring(0, maxSubstrLength - extension - 3) +
      '...' +
      fileNameWithoutExtension.slice(-substrLen) +
      '.' +
      extension;

    return compressedFileName;
  } else {
    return fileName.trim();
  }
}
