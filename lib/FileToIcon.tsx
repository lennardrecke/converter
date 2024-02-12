import { AiFillFile } from 'react-icons/ai';
import {
  BsFileEarmarkTextFill,
  BsFillCameraVideoFill,
  BsFillImageFill,
} from 'react-icons/bs';
import { PiSpeakerSimpleHighFill } from 'react-icons/pi';

export default function fileToIcon(file_type: string): any {
  if (file_type.includes('video')) return <BsFillCameraVideoFill />;
  if (file_type.includes('audio')) return <PiSpeakerSimpleHighFill />;
  if (file_type.includes('text')) return <BsFileEarmarkTextFill />;
  if (file_type.includes('image')) return <BsFillImageFill />;
  else return <AiFillFile />;
}
