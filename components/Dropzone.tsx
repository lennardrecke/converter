'use client';

import { Action } from '@/lib/types/types';
import { useEffect, useRef, useState } from 'react';
import { useToast } from './ui/use-toast';
import convertFile from '@/lib/convert';
import loadFFmpeg from '@/lib/LoadFFmpeg';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { Skeleton } from './ui/skeleton';
import fileToIcon from '@/lib/FileToIcon';
import bytesToSize from '@/lib/BytesToSize';
import { Badge } from './ui/badge';
import { BiError } from 'react-icons/bi';
import { MdClose, MdDone } from 'react-icons/md';
import { ImSpinner3 } from 'react-icons/im';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Button } from './ui/button';
import { HiOutlineDownload } from 'react-icons/hi';
import ReactDropzone from 'react-dropzone';
import { LuFileSymlink } from 'react-icons/lu';
import { FiUploadCloud } from 'react-icons/fi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

const extensions = {
  image: [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'webp',
    'ico',
    'tif',
    'tiff',
    'svg',
    'raw',
    'tga',
  ],
  video: [
    'mp4',
    'm4v',
    'mp4v',
    '3gp',
    '3g2',
    'avi',
    'mov',
    'wmv',
    'mkv',
    'flv',
    'ogv',
    'webm',
    'h264',
    '264',
    'hevc',
    '265',
  ],
  audio: ['mp3', 'wav', 'ogg', 'aac', 'wma', 'flac', 'm4a'],
};

export default function Dropzone() {
  const { toast } = useToast();
  const [is_hover, setIsHover] = useState<boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [is_ready, setIsReady] = useState<boolean>(false);
  const [files, setFiles] = useState<Array<any>>([]);
  const [is_loaded, setIsLoaded] = useState<boolean>(false);
  const [is_converting, setIsConverting] = useState<boolean>(false);
  const [is_done, setIsDone] = useState<boolean>(false);
  const ffmpegRef = useRef<any>(null);
  const [defaultValues, setDefaultValues] = useState<any>('video');
  const [selected, setSelected] = useState<any>('...');
  const accepted_files = {
    'image/*': [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.webp',
      '.ico',
      '.tif',
      '.tiff',
      '.raw',
      '.tga',
    ],
    'audio/*': [],
    'video/*': [],
  };

  const reset = () => {
    setIsDone(false);
    setActions([]);
    setFiles([]);
    setIsReady(false);
    setIsConverting(false);
  };

  const downloadAll = (): void => {
    for (let action of actions) {
      !action.is_error && download(action);
    }
  };

  const download = (action: Action) => {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = action.url;
    a.download = action.output;

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(action.url);
    document.body.removeChild(a);
  };

  const convert = async (): Promise<any> => {
    let tmp_actions = actions.map((el) => ({
      ...el,
      is_converting: true,
    }));
    setActions(tmp_actions);
    setIsConverting(true);
    for (let action of tmp_actions) {
      try {
        const { url, output } = await convertFile(ffmpegRef.current, action);
        tmp_actions = tmp_actions.map((el) =>
          el === action
            ? {
                ...el,
                is_converted: true,
                is_converting: false,
                url,
                output,
              }
            : el
        );
        setActions(tmp_actions);
      } catch {
        tmp_actions = tmp_actions.map((el) =>
          el === action
            ? {
                ...el,
                is_error: true,
                is_converting: false,
                is_converted: false,
              }
            : el
        );
        setActions(tmp_actions);
      }
    }
    setIsDone(true);
    setIsConverting(false);
  };

  const handleUpload = (data: Array<any>): void => {
    handleExitHover();
    setFiles(data);
    const tmp: Action[] = [];
    data.forEach((file: any) => {
      tmp.push({
        file_name: file.name,
        file_size: file.size,
        from: file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2),
        to: null,
        file_type: file.type,
        file,
        is_converted: false,
        is_converting: false,
        is_error: false,
      });
    });
    setActions(tmp);
  };

  const handleHover = (): void => setIsHover(true);
  const handleExitHover = (): void => setIsHover(false);

  const updateAction = (file_name: string, to: string) => {
    setActions(
      actions.map((action): Action => {
        if (action.file_name === file_name) {
          return {
            ...action,
            to,
          };
        }
        return action;
      })
    );
  };

  const checkIsReady = (): void => {
    let tmp_is_ready = true;
    actions.forEach((action: Action) => {
      if (!action.to) tmp_is_ready = false;
    });
    setIsReady(tmp_is_ready);
  };

  const deleteAction = (action: Action): void => {
    setActions(actions.filter((el) => el !== action));
    setFiles(files.filter((el) => el.name !== action.file_name));
  };

  useEffect(() => {
    if (!actions.length) {
      setIsDone(false);
      setFiles([]);
      setIsReady(false);
      setIsConverting(false);
    } else {
      checkIsReady();
    }
  }, [actions]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const ffmpeg_response: FFmpeg = await loadFFmpeg();
    ffmpegRef.current = ffmpeg_response;
    setIsLoaded(true);
  };

  if (actions.length) {
    return (
      <div className='space-y-6'>
        {actions.map((action: Action, i: any) => (
          <div
            key={i}
            className='relative flex h-fit w-full cursor-pointer flex-wrap items-center justify-between space-y-2 rounded-xl border px-4 py-4 lg:h-20 lg:flex-nowrap lg:px-10 lg:py-0'
          >
            {!is_loaded && (
              <Skeleton className='absolute -ml-10 h-full w-full cursor-progress rounded-xl' />
            )}
            <div className='flex items-center gap-4'>
              <span className='text-2xl text-purple-500'>
                {fileToIcon(action.file_type)}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className='max-w-28 truncate text-sm'>
                      {action.file_name}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className='max-w-96 truncate text-sm'>
                      {action.file_name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className='text-sm text-gray-400'>
                ({bytesToSize(action.file_size)})
              </span>
            </div>

            {action.is_error ? (
              <Badge variant='destructive' className='flex gap-2'>
                <span>Error Converting File</span>
                <BiError />
              </Badge>
            ) : action.is_converted ? (
              <Badge variant='default' className='flex gap-2 bg-green-500'>
                <span>Done</span>
                <MdDone />
              </Badge>
            ) : action.is_converting ? (
              <Badge variant='default' className='flex gap-2'>
                <span>Converting...</span>
                <span className='animate-spin'>
                  <ImSpinner3 />
                </span>
              </Badge>
            ) : (
              <div className='text-md flex items-center gap-4 text-gray-400'>
                <span>Convert to</span>
                <Select
                  onValueChange={(value) => {
                    if (extensions.audio.includes(value)) {
                      setDefaultValues('audio');
                    } else if (extensions.video.includes(value)) {
                      setDefaultValues('video');
                    }
                    setSelected(value);
                    updateAction(action.file_name, value);
                  }}
                  value={selected}
                >
                  <SelectTrigger className='text-md w-32 bg-gray-50 text-center font-medium text-gray-600 outline-none focus:outline-none focus:ring-0'>
                    <SelectValue placeholder='....' />
                  </SelectTrigger>
                  <SelectContent className='h-fit'>
                    {action.file_type.includes('image') && (
                      <div className='grid w-fit grid-cols-2 gap-2'>
                        {extensions.image.map((el, i) => (
                          <div key={i} className='col-span-1 text-center'>
                            <SelectItem value={el} className='mx-auto'>
                              {el}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    )}
                    {action.file_type.includes('video') && (
                      <Tabs defaultValue={defaultValues} className='w-full'>
                        <TabsList className='w-full'>
                          <TabsTrigger value='video' className='w-full'>
                            Video
                          </TabsTrigger>
                          <TabsTrigger value='video' className='w-full'>
                            Audio
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value='video'>
                          <div className='grid w-fit grid-cols-3 gap-2'>
                            {extensions.video.map((el, i) => (
                              <div key={i} className='col-span-1 text-center'>
                                <SelectItem value={el} className='mx-auto'>
                                  {el}
                                </SelectItem>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value='audio'>
                          <div className='grid w-fit grid-cols-3 gap-2'>
                            {extensions.video.map((el, i) => (
                              <div key={i} className='col-span-1 text-center'>
                                <SelectItem value={el} className='mx-auto'>
                                  {el}
                                </SelectItem>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                    {action.file_type.includes('audio') && (
                      <div className='grid w-fit grid-cols-2 gap-2'>
                        {extensions.audio.map((el, i) => (
                          <div key={i} className='col-span-1 text-center'>
                            <SelectItem value={el} className='mx-auto'>
                              {el}
                            </SelectItem>
                          </div>
                        ))}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {action.is_converted ? (
              <Button variant='outline' onClick={() => download(action)}>
                Download
              </Button>
            ) : (
              <span
                onClick={() => deleteAction(action)}
                className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-2xl text-gray-400 hover:bg-gray-50'
              >
                <MdClose />
              </span>
            )}
          </div>
        ))}
        <div className='flex w-full justify-end'>
          {is_done ? (
            <div className='w-fit space-y-4'>
              <Button
                size='lg'
                className='text-md relative flex w-full items-center gap-2 rounded-xl py-4 font-semibold'
                onClick={downloadAll}
              >
                {actions.length > 1 ? 'Download All' : 'Download'}
                <HiOutlineDownload />
              </Button>
              <Button
                size='lg'
                onClick={reset}
                variant='outline'
                className='rounded-xl'
              >
                Convert More
              </Button>
            </div>
          ) : (
            <Button
              size='lg'
              disabled={!is_ready || is_converting}
              onClick={convert}
              className='text-md relative flex w-44 items-center rounded-xl py-4 font-semibold'
            >
              {is_converting ? (
                <span className='animate-spin text-lg'>
                  <ImSpinner3 />
                </span>
              ) : (
                <span>Convert Now</span>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ReactDropzone
      onDrop={handleUpload}
      onDragEnter={handleHover}
      onDragLeave={handleExitHover}
      accept={accepted_files}
      onDropRejected={() => {
        handleExitHover();
        toast({
          variant: 'destructive',
          title: 'Error uploading file',
          description:
            'File type not supported. For more information read the documentation [here](/documentation)',
          duration: 5000,
        });
      }}
      onError={() => {
        handleExitHover();
        toast({
          variant: 'destructive',
          title: 'Error uploading file',
          description:
            'File type not supported. For more information read the documentation [here](/documentation)',
          duration: 5000,
        });
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className='flex h-72 cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed bg-gray-50 shadow-sm lg:h-80 xl:h-96'
        >
          <input {...getInputProps()} />
          <div className='space-y-4 text-gray-500'>
            {is_hover ? (
              <>
                <div className='flex justify-center text-6xl'>
                  <LuFileSymlink />
                </div>
                <h3 className='text-center text-2xl font-medium'>
                  Yes, right there
                </h3>
              </>
            ) : (
              <>
                <div className='flex flex-col items-center justify-center text-6xl'>
                  <FiUploadCloud />
                  <h3 className='text-center text-2xl font-medium'>
                    Click, or drop your files here
                  </h3>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ReactDropzone>
  );
}
