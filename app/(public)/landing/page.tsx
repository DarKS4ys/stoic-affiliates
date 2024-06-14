'use client';
import { AuroraBackground } from '@/components/aceternity/aurora-background';
import Particles from '@/components/magicui/particles';
import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import ShimmerButton from '@/components/magicui/shimmer-button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ContainerScroll } from '@/components/aceternity/container-scroll-animation';

export default function Page() {
  const [hidden, setHidden] = useState(false);
  const [muted, setMuted] = useState('&muted=true');
  const [controls, setControls] = useState('&controls=false');
  const [playing, setPlaying] = useState(false);

  function handleMouseOver() {
    setHidden(!hidden);
  }

  const handlePlay = () => {
    setMuted('');
    setControls('&controls=true');
    setPlaying(!playing);
  };

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl flex flex-col items-center mx-auto w-full text-primary z-10">

          <ContainerScroll
          titleComponent={
            <div
            id="header"
            className="w-full flex flex-col gap-y-2 items-center justify-center px-4"
          >
            <h1 className="text-7xl md:text-8xl mb-4 font-medium mt-8 text-center">
              Stoic <br className="md:hidden"/>Affiliates
            </h1>
            <p className="text-lg break-words md:text-2xl mx-auto text-center mb-5 text-muted-foreground font-medium">
              Generate qualified leads and get paid through our affiliate system.
            </p>
            
            <ShimmerButton className='mb-4'>Get Started</ShimmerButton>
            </div>
          }
      >
          <div
            onMouseEnter={handleMouseOver}
            onMouseLeave={handleMouseOver}
            className={cn(
              'order-first group md:order-last w-full overflow-hidden md:rounded-t-xl relative max-w-8xl z-20 m-0 aspect-video mx-auto',
              playing && 'md:rounded-xl'
            )}
          >
            <motion.div
              className="w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ stiffness: 85, type: 'spring' }}
            >
              <div
                className={cn(
                  'transition duration-300 z-20 absolute w-full aspect-video bg-black/30 flex items-center justify-center cursor-pointer bg-gradient-to-t from-bg to-transparent',
                  playing && 'opacity-0 pointer-events-none'
                )}
                onClick={handlePlay}
              >
                <Image
                  src="/play.png"
                  alt="play"
                  width={50}
                  height={0}
                />
              </div>
              <iframe
                className="w-full h-full"
                src={`https://customer-hyo06dqr7c3pgrtr.cloudflarestream.com/4b47940531476dd77426b1aa55aec8dc/iframe?${controls}${muted}&preload=true&autoplay=true&loop=true&poster=https%3A%2F%2Fcustomer-hyo06dqr7c3pgrtr.cloudflarestream.com%2F4b47940531476dd77426b1aa55aec8dc%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600`}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen={true}
              />
            </motion.div>
            <div className="absolute top-0 w-full max-w-7xl md:rounded-lg aspect-video mx-auto bg-neutral-800 animate-pulse -z-10" />
          </div>
      </ContainerScroll>
        
      </main>
      <Particles
        className="fixed inset-0 -z-10 pointer-events-none"
        quantity={100}
        ease={80}
        refresh
      />
    </div>
  );
}
