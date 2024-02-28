function Video() {
    return (
      <div className="my-0 mx-auto min-h-full max-w-screen-sm bg-white mb-20">
          <div className="border-b-2 border-gray-400">
              <h2 className="text-xl font-bold px-4 py-4">Video</h2>
          </div>
          <div className="flex flex-col gap-8 py-10">
            <div className="flex justify-center">
                <iframe width="360" height="204" src="https://www.youtube.com/embed/hBEAvorom88?si=lFSdQglQio6iGYOT?rel=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            <div className="flex justify-center">
                <iframe width="360" height="204" src="https://www.youtube.com/embed/Bs11fMfWwm8?si=O--qWgpYCZupaVHD?rel=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            <div className="flex justify-center">
                <iframe width="360" height="204" src="https://www.youtube.com/embed/iWXlkYxMmWQ?si=FJY9MFwDCcIaw6-Y?rel=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
          </div>
      </div>
    )
  }
  
  export default Video