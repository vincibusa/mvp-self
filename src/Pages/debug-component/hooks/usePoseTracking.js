/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { POSE_LANDMARKS } from '../constants/constants';
import useDrawLandmarks from '../../../hooks/useDrawLandmarks';
import useSetupPose from './useSetUpPose';
import { toast } from 'react-toastify';

const usePoseTracking = ({
  side,
  isTracking,
  canvasRef,
  videoRef,
  setAngle,
  setMaxFlexion,
}) => {
  const landmarkConnections = useMemo(() => ({
    leftSide: [
      [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_SHOULDER],
      [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
      [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST]
    ],
    rightSide: [
      [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_SHOULDER],
      [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
      [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST]
    ]
  }), []);

  const REQUIRED_LANDMARKS = useMemo(() => {
    return side === 'left'
      ? [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST]
      : [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST];
  }, [side]);

  const { drawLandmarks } = useDrawLandmarks(
    {
      leftSide: side === 'left' ? landmarkConnections.leftSide : [],
      rightSide: side === 'right' ? landmarkConnections.rightSide : []
    }
  );

  const hasShownPositiveAngleToast = useRef(false);

  const calculateShoulderFlexion = useCallback((hip, shoulder, elbow) => {
    const shoulderToHip = [hip[0] - shoulder[0], hip[1] - shoulder[1]];
    const shoulderToElbow = [elbow[0] - shoulder[0], elbow[1] - shoulder[1]];
  
    const magnitudeShoulderToHip = Math.hypot(...shoulderToHip);
    const magnitudeShoulderToElbow = Math.hypot(...shoulderToElbow);

    if (magnitudeShoulderToHip === 0 || magnitudeShoulderToElbow === 0) return 0;
  
    const dotProduct = shoulderToHip[0] * shoulderToElbow[0] + shoulderToHip[1] * shoulderToElbow[1];
    const cosTheta = Math.min(Math.max(dotProduct / (magnitudeShoulderToHip * magnitudeShoulderToElbow), -1), 1);
    
    let angleRadians = Math.acos(cosTheta);
    
    const crossProduct = side === 'left'
      ? shoulderToHip[0] * shoulderToElbow[1] - shoulderToHip[1] * shoulderToElbow[0]
      : shoulderToHip[1] * shoulderToElbow[0] - shoulderToHip[0] * shoulderToElbow[1];
    
    const sign = crossProduct > 0 ? 1 : -1; 
    return (angleRadians * 180) / Math.PI * sign;
  }, [side]);

  const onResults = useCallback(
    (results) => {
      if (!results.poseLandmarks) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const landmarks = results.poseLandmarks;
      const [hipIdx, shoulderIdx, elbowIdx] = REQUIRED_LANDMARKS;

      const hip = [landmarks[hipIdx].x * width, landmarks[hipIdx].y * height];
      const shoulder = [landmarks[shoulderIdx].x * width, landmarks[shoulderIdx].y * height];
      const elbow = [landmarks[elbowIdx].x * width, landmarks[elbowIdx].y * height];

      const newAngle = calculateShoulderFlexion(hip, shoulder, elbow);
      setAngle(newAngle);
      
      setMaxFlexion((prevMax) => {
        if (newAngle > 0) {
          const updatedMax = Math.max(prevMax, Math.abs(newAngle));
          localStorage.setItem('maxFlexion', updatedMax.toString());
          return updatedMax;
        } else {
          const updatedMax = Math.abs(prevMax);
          return updatedMax;
        }
      });

      if (newAngle < -30) {
        if (!hasShownPositiveAngleToast.current) {
          toast.error("Posizione scorretta! Stai estendendo la spalla! Allinea il braccio al busto.", {
            position: "top-center",
            autoClose: 3000,
            draggable: true,
            className: "text-2xl w-full h-auto"
          });
          hasShownPositiveAngleToast.current = true;
        }
      } else {
        hasShownPositiveAngleToast.current = false;
      }

      drawLandmarks(landmarks, ctx, width, height);
    },
    [REQUIRED_LANDMARKS, ]
  );

  const { setupPose, cleanup, trackingRef } = useSetupPose({ videoRef, onResults });

  useEffect(() => {
    if (isTracking && side) {
      trackingRef.current = true;
      setupPose();
    }
    return cleanup;
  }, [isTracking, setupPose, side]);

  useEffect(() => {
    const handleResize = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        canvas.width = video.videoWidth || Math.min(window.innerWidth, 1280);
        canvas.height = video.videoHeight || Math.min(window.innerHeight, 720);
      }
    };

    // Aggiungi un listener per quando il video è caricato
    const handleVideoLoaded = () => {
      handleResize();
    };

    videoRef.current?.addEventListener('loadedmetadata', handleVideoLoaded);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      videoRef.current?.removeEventListener('loadedmetadata', handleVideoLoaded);
      window.removeEventListener('resize', handleResize);
    };
  }, [videoRef, canvasRef]);

  return null;
};

export default usePoseTracking;