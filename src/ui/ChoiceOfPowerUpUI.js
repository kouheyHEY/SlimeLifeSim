import {
    POWERUP_TYPE,
    POWERUP_EXPLANATION,
    POWERUP_NAME,
    POWERUP_VALUE,
    GAME_CONST,
} from "../const/GameConst.js";
import { UI_CONST } from "../const/UIConst.js";
import assets from "../assets.js";
import { FONT_NAME } from "../const/CommonConst.js";
import { PlayerSkillManager } from "../PlayerSkillManager.js";

/**
 * ゴール時のパワーアップの選択肢のUI
 */
export class ChoiceOfPowerUpUI extends Phaser.GameObjects.Container {
    /**
     *
     * @param {Phaser.Scene} scene シーン
     * @param {number} x x座標
     * @param {number} y y座標
     * @param {string} powerUpType パワーアップのタイプ
     * @param {PlayerSkillManager|Object} skillManager スキル管理インスタンスまたは旧形式のパラメータ
     */
    constructor(scene, x, y, powerUpType, skillManager) {
        super(scene, x, y);
        this.scene = scene;
        this.powerUpType = powerUpType;

        // 後方互換性: オブジェクトの場合はPlayerSkillManagerに変換
        if (!(skillManager instanceof PlayerSkillManager)) {
            skillManager = new PlayerSkillManager(skillManager);
        }
        this.skillManager = skillManager;

        // UIの背景
        const background = scene.add.rectangle(
            0,
            0,
            UI_CONST.CHOICE_OF_POWERUP_UI_WIDTH,
            UI_CONST.CHOICE_OF_POWERUP_UI_HEIGHT,
            UI_CONST.CHOICE_OF_POWERUP_UI_BACKGROUND_COLOR,
            0.8
        );
        this.add(background);

        // クリック判定用の矩形
        background.setInteractive(
            new Phaser.Geom.Rectangle(
                0,
                0,
                UI_CONST.CHOICE_OF_POWERUP_UI_WIDTH,
                UI_CONST.CHOICE_OF_POWERUP_UI_HEIGHT
            ),
            Phaser.Geom.Rectangle.Contains
        );

        // PlayerSkillManagerから現在値と次のレベルの値を取得
        const skillInfo = this.skillManager.getSkillInfoForChoice(
            this.powerUpType
        );

        // アイコン表示と説明文表示
        let iconStr = "";
        let nameStr = "";
        let explanationStr = "";
        if (this.powerUpType === POWERUP_TYPE.SPEED) {
            iconStr = assets.image.icon_speed.key;
            nameStr = POWERUP_NAME.SPEED;
            explanationStr = POWERUP_EXPLANATION.SPEED;
        } else if (this.powerUpType === POWERUP_TYPE.POWER) {
            iconStr = assets.image.icon_power.key;
            nameStr = POWERUP_NAME.POWER;
            explanationStr = POWERUP_EXPLANATION.POWER;
        } else if (this.powerUpType === POWERUP_TYPE.COIN_SPEED_BOOST) {
            iconStr = assets.image.icon_coin_speed_boost.key;
            nameStr = POWERUP_NAME.COIN_SPEED_BOOST;
            explanationStr = POWERUP_EXPLANATION.COIN_SPEED_BOOST;
        } else if (this.powerUpType === POWERUP_TYPE.DOUBLE_JUMP) {
            iconStr = assets.image.icon_double_jump.key;
            nameStr = POWERUP_NAME.DOUBLE_JUMP;
            explanationStr = POWERUP_EXPLANATION.DOUBLE_JUMP;
        } else if (this.powerUpType === POWERUP_TYPE.SPEED_DOWN_SCORE) {
            iconStr = assets.image.icon_speed_down_score.key;
            nameStr = POWERUP_NAME.SPEED_DOWN_SCORE;
            explanationStr = POWERUP_EXPLANATION.SPEED_DOWN_SCORE;
        }

        // レベル変更テキスト
        let levelChangeStr = `Lv.${skillInfo.currentLevel} → Lv.${skillInfo.nextLevel}`;

        this.powerUpIcon = scene.add.image(
            -UI_CONST.CHOICE_OF_POWERUP_UI_WIDTH / 2 +
                UI_CONST.CHOICE_OF_POWERUP_ICON_WIDTH / 2 +
                20,
            0,
            iconStr
        );
        this.powerUpIcon.setOrigin(0.5);
        this.add(this.powerUpIcon);

        // テキスト表示の基準X座標
        const textBaseX =
            -UI_CONST.CHOICE_OF_POWERUP_UI_WIDTH / 2 +
            UI_CONST.CHOICE_OF_POWERUP_ICON_WIDTH +
            40;

        // 名称テキスト表示
        this.powerUpNameText = scene.add.text(textBaseX, -40, nameStr, {
            fontFamily: FONT_NAME.CHECKPOINT,
            fontSize: 22,
            fill: "#ffff00",
        });
        this.powerUpNameText.setOrigin(0, 0.5);
        this.add(this.powerUpNameText);

        // レベル変更テキスト表示
        this.levelChangeText = scene.add.text(
            textBaseX + this.powerUpNameText.width + 20,
            -40,
            levelChangeStr,
            {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: 18,
                fill: "#00ff00",
            }
        );
        this.levelChangeText.setOrigin(0, 0.5);
        this.add(this.levelChangeText);

        // 説明テキスト表示
        this.explanationText = scene.add.text(textBaseX, -22, explanationStr, {
            fontFamily: FONT_NAME.CHECKPOINT,
            fontSize: 16,
            fill: "#ffffff",
        });
        this.explanationText.setOrigin(0, 0);
        this.add(this.explanationText);

        // 効果変化テキスト表示
        this.effectChangeText = scene.add.text(
            textBaseX,
            18,
            skillInfo.displayText,
            {
                fontFamily: FONT_NAME.CHECKPOINT,
                fontSize: 16,
                fill: "#00ffff",
            }
        );
        this.effectChangeText.setOrigin(0, 0);
        this.add(this.effectChangeText);

        // コンテナをシーンに追加
        scene.add.existing(this);

        // クリック時の処理
        background.on("pointerdown", () => {
            // パワーアップが選択されたことをシーンに通知
            this.scene.events.emit("powerupSelected", this.powerUpType);
        });
    }
}
