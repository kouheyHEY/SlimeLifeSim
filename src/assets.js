export default {
    // 'audio': {
    //     score: {
    //         key: 'sound',
    //         args: ['assets/sound.mp3', 'assets/sound.m4a', 'assets/sound.ogg']
    //     },
    // },
    image: {
        spikes: {
            key: "spikes",
            args: ["assets/spikes.png"],
        },
    },
    spritesheet: {
        bat: {
            key: "bat",
            args: [
                "assets/bat.png",
                {
                    frameWidth: 48,
                    frameHeight: 48,
                },
            ],
        },
        coin: {
            key: "coin",
            args: [
                "assets/coin.png",
                {
                    frameWidth: 36,
                    frameHeight: 36,
                },
            ],
        },
        sheet_seaside: {
            key: "sheet_seaside",
            args: [
                "assets/sheet_seaside.png",
                { frameWidth: 32, frameHeight: 32 },
            ],
        },
    },
};
