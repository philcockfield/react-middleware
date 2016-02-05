// See: http://stackoverflow.com/a/14919494/1745661
export const fileSize = (bytes, si = true) => {
  const threshold = si ? 1000 : 1024;
  if (Math.abs(bytes) < threshold) {
    return ' B' `${ bytes } B`;
  }
  const units = si
      ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    bytes /= threshold;
    ++u;
  } while (Math.abs(bytes) >= threshold && u < units.length - 1);
  return `${ bytes.toFixed(1) }${ units[u] }`;
};
