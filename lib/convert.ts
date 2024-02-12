import { Action } from './types/types';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

function getFileExtension(fileName: string) {
  const regex = /(?:\.([^.]+))?$/;
  const match = regex.exec(fileName);

  if (match && regex.exec(fileName)) {
    return match[1];
  }
  return ''; // no extension found
}

function removeFileExtension(fileName: string) {
  return fileName.split('.').slice(0, -1).join('.');
}

export default async function convertFile(
  ffmpeg: FFmpeg,
  action: Action
): Promise<any> {
  const { file, file_name, file_size, from, to, file_type } = action;
  const input = getFileExtension(file_name);
  const output = removeFileExtension(file_name) + '.' + to;

  ffmpeg.writeFile(input, await fetchFile(file));

  let ffmpeg_cmd: any = [];

  if (to === '3gp') {
    ffmpeg_cmd = [
      '-i',
      input,
      '-r',
      '20',
      '-s',
      '352x288',
      '-vb',
      '400k',
      '-acodec',
      'aac',
      '-strict',
      'experimental',
      '-ac',
      '1',
      '-ar',
      '8000',
      '-ab',
      '24k',
      output,
    ];
  } else {
    ffmpeg_cmd = ['-i', input, output];
  }

  await ffmpeg.exec(ffmpeg_cmd);

  const data = (await ffmpeg.readFile(output)) as any;
  const blob = new Blob([data], { type: file_type.split('/')[0] });
  const url = URL.createObjectURL(blob);

  return { url, output };
}
