/**
 * アセット用の定数
 */
export const ASSETS_CONST = {
    /** 画像アセットのキー */
    IMAGE_KEY: "image",
    /** スプライトシートアセットのキー */
    SPRITESHEET_KEY: "spritesheet",
};

/**
 * 共通定数
 */
export const COMMON_CONST = {
    /** 画面の幅 */
    SCREEN_WIDTH: 1280,
    /** 画面の高さ */
    SCREEN_HEIGHT: 720,
};

/** キー名定数 */
export const KEY_NAME = {
    /** スペースキー */
    SPACE: "space",
    /** Zキー */
    Z: "z",
    /** Xキー */
    X: "x",
    /** Cキー */
    C: "c",
};

/** フォント名 */
export const FONT_NAME = {
    /** メロナノフォント */
    MELONANO: "Melonano",
    /** チェックポイントフォント */
    CHECKPOINT: "checkPoint",
};

/** 言語設定 */
export const LANGUAGE = {
    /** 日本語 */
    JAPANESE: "JP",
    /** 英語 */
    ENGLISH: "EN",
};

/** LocalStorage キー */
export const STORAGE_KEY = {
    /** 言語設定 */
    LANGUAGE: "slimelife_language",
};

/**
 * 現在の言語設定を取得
 * @returns {string} 言語コード（"JP" または "EN"）
 */
export function getCurrentLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY.LANGUAGE);
    return saved || null; // デフォルトはnull（未設定）
}

/**
 * 言語設定を保存
 * @param {string} language - 言語コード（"JP" または "EN"）
 */
export function setCurrentLanguage(language) {
    localStorage.setItem(STORAGE_KEY.LANGUAGE, language);
}

/**
 * 多言語テキストから現在の言語のテキストを取得
 * @param {Object} textObject - {JP: "...", EN: "..."} 形式のオブジェクト
 * @returns {string} 現在の言語のテキスト
 */
export function getLocalizedText(textObject) {
    if (!textObject) return "";
    if (typeof textObject === "string") return textObject;
    const lang = getCurrentLanguage() || LANGUAGE.JAPANESE;
    return textObject[lang] || textObject.JP || "";
}
