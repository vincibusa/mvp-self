const VideoCanvas = ({ videoRef, canvasRef, videoUrl }) => {
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        videoRef.current.src = url;
      }
    };
  
    return (
      <div className="relative w-full h-full md:aspect-video aspect-[4/3]">
        <input 
          type="file" 
          accept="video/*"
          onChange={handleFileChange}
          className="absolute top-4 right-4 z-10"
        />
        <video
          style={{ transform: 'scaleX(-1)' }}
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          playsInline
          controls
        />
        <canvas
          style={{ transform: 'scaleX(-1)' }}
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
    );
  };
  
  export default VideoCanvas;