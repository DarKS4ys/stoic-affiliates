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
  const [complete, setComplete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { edgestore } = useEdgeStore();

  const handleBannerUpload = async (file: File) => {
    if (!file) {
      console.error('Error with banner upload.');
      return;
    }

    setProgress(0)
    setComplete(false)
    try {
      const upload = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setProgress(progress);
        },
      });

      const imageUrl = upload.url

      await updateUserMetadata(user.externalId, { banner: imageUrl });
      
      setComplete(true);
    } catch {
    } finally {
    }
  };

  const toggleModal = () => {
    setComplete(false)
    setProgress(0)
    setModalOpen(!modalOpen)
  }

  return (
    <Dialog open={modalOpen} onOpenChange={toggleModal}>
      <DialogTrigger asChild>
        <Button className="gap-x-1.5 items-center">
          Edit Banner <FaPen />
        </Button>
      </DialogTrigger>
      <DialogContent closeButton>
        <Upload
          closeModal={toggleModal}
          complete={complete}
          progress={progress}
          onFileSelected={handleBannerUpload}
          title={'Upload your banner'}
        />
      </DialogContent>
    </Dialog>
  );
}
