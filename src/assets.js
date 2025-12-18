export default {
    /**
     * オーディオアセット群
     */
    audio: {
        // BGM
        bgm_stage_normal: {
            key: "bgm_stage_normal",
            args: ["assets/sounds/bgm_stage_normal.ogg"],
        },
        bgm_stage_snow: {
            key: "bgm_stage_snow",
            args: ["assets/sounds/bgm_stage_snow.wav"],
        },
        // ジングル
        jingle_clear: {
            key: "jingle_clear",
            args: ["assets/sounds/jingle_clear.wav"],
        },
        jingle_start: {
            key: "jingle_start",
            args: ["assets/sounds/jingle_start.wav"],
        },
        // 効果音
        se_break: {
            key: "se_break",
            args: ["assets/sounds/se_break.wav"],
        },
        se_coin_get: {
            key: "se_coin_get",
            args: ["assets/sounds/se_coin_get.wav"],
        },
        se_jump: {
            key: "se_jump",
            args: ["assets/sounds/se_jump.wav"],
        },
        se_powerup: {
            key: "se_powerup",
            args: ["assets/sounds/se_powerup.wav"],
        },
        se_wall_hit: {
            key: "se_wall_hit",
            args: ["assets/sounds/se_wall_hit.wav"],
        },
    },
    /**
     * 画像アセット群
     */
    image: {
        spikes: {
            key: "spikes",
            args: ["assets/spikes.png"],
        },
        tileset_1: {
            key: "tileset_1",
            args: ["assets/tileset_1.png"],
        },
        background_1: {
            key: "background_1",
            args: ["assets/background_1.png"],
        },
        icon_speed: {
            key: "icon_speed",
            args: ["assets/icon_speed.png"],
        },
        icon_power: {
            key: "icon_power",
            args: ["assets/icon_power.png"],
        },
        icon_coin_speed_boost: {
            key: "icon_coin_speed_boost",
            args: ["assets/icon_coin_speed_boost.png"],
        },
        icon_double_jump: {
            key: "icon_double_jump",
            args: ["assets/icon_double_jump.png"],
        },
        icon_speed_down_score: {
            key: "icon_speed_down_score",
            args: ["assets/icon_speed_down_score.png"],
        },
    },
    spritesheet: {
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
        chara: {
            key: "chara",
            args: [
                "assets/chara.png",
                {
                    frameWidth: 48,
                    frameHeight: 48,
                },
            ],
        },
        flag: {
            key: "flag",
            args: [
                "assets/flag.png",
                {
                    frameWidth: 32,
                    frameHeight: 32,
                },
            ],
        },
        boxWood: {
            key: "boxWood",
            args: [
                "assets/box_wood_96x96.png",
                {
                    frameWidth: 96,
                    frameHeight: 96,
                },
            ],
        },
        tutorial_jump: {
            key: "tutorial_jump",
            args: [
                "assets/tutorial_jump.png",
                {
                    frameWidth: 420,
                    frameHeight: 240,
                },
            ],
        },
        tutorial_woodbox: {
            key: "tutorial_woodbox",
            args: [
                "assets/tutorial_woodbox.png",
                {
                    frameWidth: 420,
                    frameHeight: 240,
                },
            ],
        },
    },
};
