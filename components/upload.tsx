'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from './../lib/utils';
import Image from 'next/image';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { BiLoader } from 'react-icons/bi';

export default function Upload({
  title,
  onFileSelected,
  progress,
  complete,
  closeModal
}: {
  title: string;
  onFileSelected: (file: File) => void;
  complete: boolean;
  progress?: undefined | number;
  closeModal: () => void
}) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);
      setSelectedImage(file);
      await onFileSelected(file);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        handleFileUpload(file);
      } else {
        
      }
    },
  });

  return (
    <div className="flex flex-col space-y-4 items-center">
      <h1 className="font-semibold">{title}</h1>
      <div
        {...getRootProps({
          className: cn(
            'active:scale-95 relative transition p-8 w-full h-64 group border-2 border-muted-foreground/80 border-dashed rounded-lg flex text-center justify-center items-center',
            !selectedImage
              ? isDragActive
                ? isDragAccept
                  ? 'bg-green-500/40 cursor-wait'
                  : 'bg-red-500/40 cursor-not-allowed'
                : 'hover:bg-border/60 hover:border-muted-foreground bg-border cursor-pointer'
              : 'bg-border/60 hover:bg-border cursor-pointer h-72'
          ),
        })}
      >
        <input {...getInputProps()} />

        {selectedImage ? (
          <div className="space-y-2 flex flex-col">
            <Image
              alt="Selected image"
              src={URL.createObjectURL(selectedImage)}
              fill
              className="p-2 rounded-lg flex max-h-[16rem] w-full object-contain mx-auto"
            />
            <div className="pt-60">
              <p className="group-hover:text-primary transition text-sm text-muted-foreground">
                Click again to select another image
              </p>
            </div>
          </div>
        ) : (
          <>
            {isDragActive && !selectedImage ? (
              isDragAccept ? (
                <p className="text-green-600 font-medium">
                  Drop the file here...
                </p>
              ) : (
                <p className="text-red-600 font-medium">File not accepted!</p>
              )
            ) : (
              <p className="font-medium">
                Drag & drop a file here, or click to select a file
              </p>
            )}
          </>
        )}
      </div>

      {/* <Button disabled={loading || !selectedImage} className="w-full">Upload</Button> */}

      {progress !== undefined && progress !== null && progress !== 100 && progress > 1 && (<Progress value={progress} />) }

      <Button onClick={closeModal} disabled={!complete} className="w-full">
        {loading ? <div className='flex space-x-1.5 items-center'><BiLoader className='animate-spin'/>Loading</div> : <p>Complete</p>}
      </Button>
    </div>
  );
}
