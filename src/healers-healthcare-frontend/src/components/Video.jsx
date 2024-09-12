"use client";

import { useEffect, useState } from "react";

export default function Video() {
  const [videoSrc, setVideoSrc] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      const query = "consultation man woman doctor clinic cedric sofa";
      const apiKey = "LhtJn3NVHtJDEqtFWxsGGSWSMit93xRD4bxm9gnpsxHws1V9tGd4McA0";
      const url = `https://api.pexels.com/videos/search?query=${query}&per_page=1`;

      const response = await fetch(url, {
        headers: {
          Authorization: apiKey,
        },
      });

      const data = await response.json();
      if (data?.videos?.length > 0) {
        const videoUrl = data.videos[0].video_files[0].link;
        setVideoSrc(videoUrl);
      }
    };

    fetchVideo();
  }, []);

  console.log(videoSrc);
  return (
    <>
      {videoSrc && (
        <>
          <main className="lg:pt-0 pt-10 pb-10 ">
            <video
              autoPlay
              muted
              loop
              className=" w-full lg:h-full h-64 object-cover object-center lg:rounded-2xl rounded-xl"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </main>
        </>
      )}
    </>
  );
}
