'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { FaPen } from 'react-icons/fa';
import Upload from './upload';
import { updateUserMetadata } from '@/actions/user';
import type { User } from '@prisma/client';
import { useEdgeStore } from '@/lib/edgestore';

export default function BannerUpload({ user }: { user: User }) {
  const [progress, setProgress] = useState<undefined | number>(undefined);
  const { edgestore } = useEdgeStore();

  const handleBannerUpload = async (file: File) => {
    if (!file) {
      console.error('Error with banner upload.');
      return;
    }
    try {
      const response = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });
      /* await updateUserMetadata(user.externalId, { banner: file }); */
    } catch {
    } finally {
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-x-1">
          Edit Banner <FaPen />
        </Button>
      </DialogTrigger>
      <DialogContent closeButton>
        <Upload
          progress={progress}
          onFileSelected={handleBannerUpload}
          title={'Upload your banner'}
        />
      </DialogContent>
    </Dialog>
  );
}
