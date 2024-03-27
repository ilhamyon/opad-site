function Video() {
    const videoLatihan = 'https://embunraya.amayor.id/Kekuatan-otot-Jalan-Kaki-music.mp4';
    const videoAutogenic = 'https://embunraya.amayor.id/musik-autogenic.mp4';
    return (
        <div className="my-0 mx-auto min-h-full max-w-screen-sm bg-white mb-20">
            <div className="border-b-2 border-gray-400">
                <h2 className="text-xl font-bold px-4 py-4">Video</h2>
            </div>
            <div className="flex flex-col gap-8 py-10">
                <div className="flex justify-center px-4">
                    <video width="100%" height="auto" controls>
                        <source src={videoLatihan} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <h2 className="px-4 text-xl font-semibold -mt-4">Kekuatan otot Jalan-Kaki</h2>
            </div>

            <div className="flex flex-col gap-8 pb-10">
                <div className="flex justify-center px-4">
                    <video width="100%" height="auto" controls>
                        <source src={videoAutogenic} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <h2 className="px-4 text-xl font-semibold -mt-4 mb-52">Terapi Autogenik</h2>
            </div>
        </div>
    )
}

export default Video