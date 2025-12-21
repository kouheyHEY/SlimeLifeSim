export default {
    // 'audio': {
    //     score: {
    //         key: 'sound',
    //         args: ['assets/sound.mp3', 'assets/sound.m4a', 'assets/sound.ogg']
    //     },
    // },
    image: {
        fish_funa: {
            key: "fish_funa",
            args: ["assets/fish_funa.png"],
        },
        fish_nijimasu: {
            key: "fish_nijimasu",
            args: ["assets/fish_nijimasu.png"],
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
        sheet_seaside: {
            key: "sheet_seaside",
            args: [
                "assets/sheet_seaside.png",
                { frameWidth: 32, frameHeight: 32 },
            ],
        },
    },
};
