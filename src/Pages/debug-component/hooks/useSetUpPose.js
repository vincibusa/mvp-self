import { useRef, useCallback } from 'react';
import * as MediapipePose from '@mediapipe/pose';

const useSetupPose = ({ videoRef, onResults }) => {
  const poseRef = useRef(null);
  const animationFrameRef = useRef(null);
  const trackingRef = useRef(false);

  const processFrame = useCallback(async () => {
    const video = videoRef.current;
    
    if (trackingRef.current && poseRef.current && video && !video.paused) {
      try {
        await poseRef.current.send({ image: video });
      } catch (error) {
        console.error("Error sending frame to pose:", error);
      }
      
      animationFrameRef.current = requestAnimationFrame(processFrame);
    }
  }, [videoRef]);

  const setupPose = useCallback(() => {
    const pose = new MediapipePose.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
      enableSegmentation: false,
    });
    
    pose.onResults(onResults);
    poseRef.current = pose;

    // Start processing frames when video starts playing
    videoRef.current.addEventListener('play', () => {
      trackingRef.current = true;
      processFrame();
    });

    videoRef.current.addEventListener('pause', () => {
      trackingRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    });

  }, [onResults, videoRef, processFrame]);

  const cleanup = () => {
    trackingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    poseRef.current?.close();
    poseRef.current = null;
  };

  return {
    setupPose,
    cleanup,
    trackingRef,
  };
};

export default useSetupPose;