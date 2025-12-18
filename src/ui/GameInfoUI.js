import { GAME_CONST, POWERUP_VALUE } from "../const/GameConst.js";
import { UI_CONST } from "../const/UIConst.js";
import assets from "../assets.js";
import { COMMON_CONST, FONT_NAME } from "../const/CommonConst.js";

/**
 * ゲーム中の情報表示用のUI
 */
export class GameInfoUI extends Phaser.GameObjects.Container {
    /**
     *
     * @param {Phaser.Scene} scene シーン
     */
    constructor(scene) {
        super(
            scene,
            COMMON_CONST.SCREEN_WIDTH - UI_CONST.GAME_INFO_UI_WIDTH,
            0
        );
        this.scene = scene;

        // UIの背景
        const background = scene.add.rectangle(
            UI_CONST.GAME_INFO_UI_WIDTH / 2,
            COMMON_CONST.SCREEN_HEIGHT / 2,
            UI_CONST.GAME_INFO_UI_WIDTH,
            COMMON_CONST.SCREEN_HEIGHT,
            UI_CONST.CHOICE_OF_POWERUP_UI_BACKGROUND_COLOR,
            1
        );
        this.add(background);

        // コンテナをシーンに追加
        scene.add.existing(this);

        let yOffset = UI_CONST.GAME_INFO_SCORE_Y_START;

        // スコアテキスト
        this.scoreText = this.scene.add.text(
            UI_CONST.GAME_INFO_LEFT_MARGIN,
            yOffset,
            `${UI_CONST.GAME_INFO_SCORE_PREFIX}0`,
            {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: UI_CONST.GAME_INFO_SCORE_TIMER_FONT_SIZE,
                color: UI_CONST.GAME_INFO_TEXT_COLOR,
                stroke: UI_CONST.GAME_INFO_TEXT_STROKE_COLOR,
                strokeThickness: UI_CONST.GAME_INFO_TEXT_STROKE_THICKNESS,
                align: "center",
            }
        );
        this.add(this.scoreText);
        yOffset += UI_CONST.GAME_INFO_SCORE_TIMER_SPACING;

        // タイマー
        this.timeText = this.scene.add.text(
            UI_CONST.GAME_INFO_LEFT_MARGIN,
            yOffset,
            `${GAME_CONST.FORMAT_TIMER_PRE}0${GAME_CONST.FORMAT_TIMER_POST}`,
            {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: UI_CONST.GAME_INFO_SCORE_TIMER_FONT_SIZE,
                color: UI_CONST.GAME_INFO_TEXT_COLOR,
                stroke: UI_CONST.GAME_INFO_TEXT_STROKE_COLOR,
                strokeThickness: UI_CONST.GAME_INFO_TEXT_STROKE_THICKNESS,
                align: "center",
            }
        );
        this.add(this.timeText);
        yOffset += UI_CONST.GAME_INFO_TIMER_BASIC_SPACING;

        // === 基礎能力の表示 ===
        const basicAbilitiesLabel = this.scene.add.text(
            0,
            yOffset,
            UI_CONST.GAME_INFO_BASIC_LABEL_TEXT,
            {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: UI_CONST.GAME_INFO_SECTION_LABEL_FONT_SIZE,
                color: UI_CONST.GAME_INFO_BASIC_LABEL_COLOR,
                stroke: UI_CONST.GAME_INFO_TEXT_STROKE_COLOR,
                strokeThickness: UI_CONST.GAME_INFO_TEXT_STROKE_THICKNESS,
                align: "center",
            }
        );
        this.add(basicAbilitiesLabel);
        yOffset += UI_CONST.GAME_INFO_LABEL_CONTENT_SPACING;

        /** @type {IStatusProperty[]} プレイヤー基礎ステータス表示用プロパティ配列 */
        // PlayerSkillManagerから全スキル情報を取得
        const skillInfo = this.scene.player.skillManager.getAllSkillInfo();

        // テキストオブジェクトを保存する配列
        this.basicStatusTexts = [];

        this.basicStatusProperties = [
            {
                name: "speed",
                displayName: UI_CONST.GAME_INFO_JP_STATUS.speed,
                level: skillInfo.speed.level,
                // skillManagerの値を表示（基本速度）
                value: skillInfo.speed.value,
                dispValue: skillInfo.speed.displayValue,
            },
            {
                name: "power",
                displayName: UI_CONST.GAME_INFO_JP_STATUS.power,
                level: skillInfo.power.level,
                // skillManagerの値を表示
                value: Math.ceil(skillInfo.power.value),
                dispValue: skillInfo.power.displayValue,
            },
        ];

        for (const [
            index,
            statusProperty,
        ] of this.basicStatusProperties.entries()) {
            // アイコンの表示
            const icon = this.scene.add.image(
                UI_CONST.GAME_INFO_ICON_X,
                yOffset +
                    index * UI_CONST.GAME_INFO_STATUS_ITEM_SPACING +
                    UI_CONST.GAME_INFO_ICON_Y_OFFSET,
                assets.image[`icon_${statusProperty.name}`].key
            );
            icon.setDisplaySize(
                UI_CONST.GAME_INFO_ICON_SIZE,
                UI_CONST.GAME_INFO_ICON_SIZE
            );
            this.add(icon);

            // 実際の値とレベルの表示
            // const paramTextOffsetY = 40;
            const paramTextOffsetY = 0;
            const valueText = this.scene.add.text(
                UI_CONST.GAME_INFO_STATUS_TEXT_X,
                yOffset +
                    index * UI_CONST.GAME_INFO_STATUS_ITEM_SPACING +
                    paramTextOffsetY,
                `${statusProperty.dispValue}`,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: UI_CONST.GAME_INFO_STATUS_FONT_SIZE,
                    color: UI_CONST.GAME_INFO_TEXT_COLOR,
                    stroke: UI_CONST.GAME_INFO_TEXT_STROKE_COLOR,
                    strokeThickness: UI_CONST.GAME_INFO_TEXT_STROKE_THICKNESS,
                    align: "left",
                }
            );
            this.add(valueText);

            const levelText = this.scene.add.text(
                UI_CONST.GAME_INFO_UI_WIDTH - UI_CONST.GAME_INFO_LEFT_MARGIN,
                yOffset +
                    index * UI_CONST.GAME_INFO_STATUS_ITEM_SPACING +
                    paramTextOffsetY,
                `Lv.${statusProperty.level}`,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: UI_CONST.GAME_INFO_STATUS_FONT_SIZE,
                    color: UI_CONST.GAME_INFO_TEXT_COLOR,
                    stroke: UI_CONST.GAME_INFO_TEXT_STROKE_COLOR,
                    strokeThickness: UI_CONST.GAME_INFO_TEXT_STROKE_THICKNESS,
                    align: "right",
                }
            );
            levelText.setOrigin(1, 0);
            this.add(levelText);

            // テキストオブジェクトを保存
            this.basicStatusTexts.push({
                name: statusProperty.name,
                valueText,
                levelText,
            });
        }
        yOffset +=
            this.basicStatusProperties.length *
                UI_CONST.GAME_INFO_STATUS_ITEM_SPACING +
            UI_CONST.GAME_INFO_BASIC_SPECIAL_SPACING;

        // === 特殊能力の表示 ===
        const specialAbilitiesLabel = this.scene.add.text(
            0,
            yOffset,
            UI_CONST.GAME_INFO_SPECIAL_LABEL_TEXT,
            {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: UI_CONST.GAME_INFO_SECTION_LABEL_FONT_SIZE,
                color: UI_CONST.GAME_INFO_SPECIAL_LABEL_COLOR,
                stroke: UI_CONST.GAME_INFO_TEXT_STROKE_COLOR,
                strokeThickness: UI_CONST.GAME_INFO_TEXT_STROKE_THICKNESS,
                align: "center",
            }
        );
        this.add(specialAbilitiesLabel);
        yOffset += UI_CONST.GAME_INFO_LABEL_CONTENT_SPACING;

        /** @type {IStatusProperty[]} プレイヤー特殊能力表示用プロパティ配列 */
        // テキストオブジェクトを保存する配列
        this.specialStatusTexts = [];

        this.specialStatusProperties = [
            {
                name: "coinSpeedBoost",
                displayName: UI_CONST.GAME_INFO_JP_STATUS.coinSpeedBoost,
                level: skillInfo.coinSpeedBoost.level,
                dispValue: skillInfo.coinSpeedBoost.displayValue,
            },
            {
                name: "doubleJump",
                displayName: UI_CONST.GAME_INFO_JP_STATUS.doubleJump,
                level: skillInfo.doubleJump.level,
                dispValue: skillInfo.doubleJump.displayValue,
            },
            {
                name: "speedDownScore",
                displayName: UI_CONST.GAME_INFO_JP_STATUS.speedDownScore,
                level: skillInfo.speedDownScore.level,
                dispValue: skillInfo.speedDownScore.displayValue,
            },
        ];

        let spclPropIdx = 0;
        for (const [
            index,
            statusProperty,
        ] of this.specialStatusProperties.entries()) {
            if (statusProperty.level <= 0) {
                // レベル0の場合は表示しない
                continue;
            }
            // ステータス名表示
            const statusText = this.scene.add.text(
                UI_CONST.GAME_INFO_LEFT_MARGIN,
                yOffset + spclPropIdx * UI_CONST.GAME_INFO_STATUS_ITEM_SPACING,
                `${statusProperty.displayName}`,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: UI_CONST.GAME_INFO_SPECIAL_STATUS_FONT_SIZE,
                    color: UI_CONST.GAME_INFO_TEXT_COLOR,
                    stroke: UI_CONST.GAME_INFO_TEXT_STROKE_COLOR,
                    strokeThickness: UI_CONST.GAME_INFO_TEXT_STROKE_THICKNESS,
                    align: "center",
                }
            );
            this.add(statusText);

            const levelText = this.scene.add.text(
                UI_CONST.GAME_INFO_UI_WIDTH - UI_CONST.GAME_INFO_LEFT_MARGIN,
                yOffset + spclPropIdx * UI_CONST.GAME_INFO_STATUS_ITEM_SPACING,
                `Lv.${statusProperty.level}`,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: UI_CONST.GAME_INFO_STATUS_FONT_SIZE,
                    color:
                        statusProperty.level > 0
                            ? UI_CONST.GAME_INFO_TEXT_COLOR
                            : "#666666",
                    stroke: UI_CONST.GAME_INFO_TEXT_STROKE_COLOR,
                    strokeThickness: UI_CONST.GAME_INFO_TEXT_STROKE_THICKNESS,
                    align: "center",
                }
            );
            levelText.setOrigin(1, 0);
            this.add(levelText);

            yOffset += 36; // スペース調整用

            // 実際の値の表示
            const valueText = this.scene.add.text(
                UI_CONST.GAME_INFO_SPECIAL_STATUS_TEXT_X,
                yOffset + spclPropIdx * UI_CONST.GAME_INFO_STATUS_ITEM_SPACING,
                `${statusProperty.dispValue}`,
                {
                    fontFamily: FONT_NAME.CHECKPOINT,
                    fontSize: UI_CONST.GAME_INFO_SPECIAL_STATUS_FONT_SIZE,
                    color:
                        statusProperty.level > 0
                            ? UI_CONST.GAME_INFO_TEXT_COLOR
                            : "#666666",
                    stroke: UI_CONST.GAME_INFO_TEXT_STROKE_COLOR,
                    strokeThickness: UI_CONST.GAME_INFO_TEXT_STROKE_THICKNESS,
                    align: "left",
                }
            );
            valueText.setOrigin(0, 0);
            this.add(valueText);
            spclPropIdx++;
        }
    }

    /**
     * 秒数表示の更新
     * @param {number} runTimeInSeconds タイム
     */
    setTimerText(runTimeInSeconds) {
        this.timeText.setText(
            `${GAME_CONST.FORMAT_TIMER_PRE}${runTimeInSeconds}${GAME_CONST.FORMAT_TIMER_POST}`
        );
    }

    /**
     * コイン枚数表示の更新
     * @param {number} coinCount コイン枚数
     */
    setCoinText(coinCount) {
        this.scoreText.setText(
            `${UI_CONST.GAME_INFO_SCORE_PREFIX}${coinCount}`
        );
    }
}
