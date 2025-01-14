/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef } from "react";
import { POSE_LANDMARKS } from "../constants/constants";
import useDrawLandmarks from "../../../../hooks/useDrawLandmarks";
import useSetupPose from "../../../../hooks/useSetUpPose";
import { toast } from "react-toastify";

const usePoseTracking = ({
  side,
  isTracking,
  canvasRef,
  videoRef,
  setAngle,
  setMaxFlexion,
}) => {

  useEffect(() => {
    console.log(side);
  }, [side]);
  const landmarkConnections = useMemo(
    () => ({
      leftSide: [
        [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_HIP],
        [POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.LEFT_KNEE],
      ],
      rightSide: [
        [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_HIP],
        [POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.RIGHT_KNEE],
      ],
    }),
    []
  );

  const REQUIRED_LANDMARKS = useMemo(() => {
    return side === "left"
      ? [
          POSE_LANDMARKS.LEFT_HIP,
          POSE_LANDMARKS.LEFT_SHOULDER,
          POSE_LANDMARKS.LEFT_KNEE,
        ]
      : [
          POSE_LANDMARKS.RIGHT_HIP,
          POSE_LANDMARKS.RIGHT_SHOULDER,
          POSE_LANDMARKS.RIGHT_KNEE,
        ];
  }, [side]);

  const { drawLandmarks } = useDrawLandmarks({
    leftSide: side === "left" ? landmarkConnections.leftSide : [],
    rightSide: side === "right" ? landmarkConnections.rightSide : [],
  });

  // Riferimenti per tracciare la visualizzazione dei toast
  const hasShownPositiveAngleToast = useRef(false);

  const calculateHipFlexion = useCallback((shoulder, hip, knee) => {
    const hipToShoulder = [shoulder[0] - hip[0], shoulder[1] - hip[1]];

    const hipToKnee = [knee[0] - hip[0], knee[1] - hip[1]];

    const magnitudeHipToShoulder = Math.hypot(...hipToShoulder);
    const magnitudeHipToKnee = Math.hypot(...hipToKnee);

    const dotProduct =
      hipToShoulder[0] * hipToKnee[0] + hipToShoulder[1] * hipToKnee[1];
    const cosTheta = Math.min(
      Math.max(dotProduct / (magnitudeHipToShoulder * magnitudeHipToKnee), -1),
      1
    );

    let angleRadians = Math.acos(cosTheta);

    let crossProduct;

    if (side === "left") {
      crossProduct =
        hipToShoulder[0] * hipToKnee[1] - hipToShoulder[1] * hipToKnee[0];
    } else if (side === "right") {
      crossProduct =
        hipToShoulder[1] * hipToKnee[0] - hipToShoulder[0] * hipToKnee[1];
    }

    const sign = crossProduct > 0 ? 1 : -1;

    const angleDegrees = 2 * ((angleRadians * 180) / Math.PI) * sign;

    console.log("Calcolato angolo:", angleDegrees);
    return angleDegrees;
  }, [side]);

  const onResults = useCallback(
    (results) => {
      if (!results.poseLandmarks) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const landmarks = results.poseLandmarks;
      const [shoulderIdx, hipIdx, kneeIdx] = REQUIRED_LANDMARKS;

      const hip = [landmarks[hipIdx].x * width, landmarks[hipIdx].y * height];
      const shoulder = [
        landmarks[shoulderIdx].x * width,
        landmarks[shoulderIdx].y * height,
      ];
      const knee = [
        landmarks[kneeIdx].x * width,
        landmarks[kneeIdx].y * height,
      ];

      const newAngle = calculateHipFlexion(shoulder, hip, knee);
      setAngle(newAngle);
      setMaxFlexion((prevMax) => {
        if (newAngle > 0) {
          const updatedMax = Math.max(prevMax, Math.abs(newAngle));
          localStorage.setItem("maxFlexion", updatedMax.toString());
          return updatedMax;
        } else {
          const updatedMax = Math.abs(prevMax);
          return updatedMax;
        }
      });

      if (newAngle < -30) {
        if (!hasShownPositiveAngleToast.current) {
          toast.error(
            "Posizione scorretta! Stai estendendo l'anca! Allinea l'anca al busto.",
            {
              position: "top-center",
              autoClose: 3000,
              draggable: true,
              className: "text-2xl w-full h-auto ",
            }
          );
          hasShownPositiveAngleToast.current = true;
        }
      } else {
        hasShownPositiveAngleToast.current = false;
      }

      drawLandmarks(landmarks, ctx, width, height);
    },
    [REQUIRED_LANDMARKS]
  );

  const { setupPose, cleanup, trackingRef } = useSetupPose({
    videoRef,
    onResults,
  });

  useEffect(() => {
    if (isTracking && side) {
      trackingRef.current = true;
      setupPose();
    }
    return cleanup;
  }, [isTracking, setupPose,side]);

  useEffect(() => {
    const handleResize = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        video.width = Math.min(window.innerWidth, 1280);
        video.height = Math.min(window.innerHeight, 720);
        canvas.width = video.width;
        canvas.height = video.height;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [videoRef, canvasRef]);

  return null;
};

export default usePoseTracking;
