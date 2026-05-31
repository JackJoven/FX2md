(function (globalScope) {
    const SITE_FLOATING_SAVE_BUTTON_ID = "__fx2md_site_save_button";
    const FLOATING_SAVE_BUTTON_STATE_KEY = "__fx2md_floating_save_button_state";
    const FLOATING_SAVE_BUTTON_MARGIN = 8;
    const FLOATING_SAVE_BUTTON_DEFAULT_TOP = 96;
    const FLOATING_SAVE_BUTTON_DEFAULT_RIGHT = 24;
    const FLOATING_SAVE_BUTTON_NORMAL_SIZE = { width: 42, height: 42 };
    const FLOATING_SAVE_BUTTON_EDGE_SIZE = { width: 18, height: 34 };

    function isFloatingSaveIconEnabled(config = {}) {
        return config.show_site_save_icon !== false;
    }

    function detectFloatingSaveSite(locationLike = globalScope.location) {
        const hostname = String(locationLike?.hostname || "").toLowerCase();
        const pathname = String(locationLike?.pathname || "");

        if (hostname === "linux.do" && /^\/t\/[^/]+\/\d+(?:\/\d+)?\/?$/.test(pathname)) {
            return "linux_do";
        }

        if (hostname.endsWith(".feishu.cn") && (/^\/wiki\/[^/]+/.test(pathname) || /^\/docx\/[^/]+/.test(pathname))) {
            return "feishu";
        }

        if (hostname === "mp.weixin.qq.com" && /^\/s(\/|$|\?)/.test(pathname)) {
            return "wechat";
        }

        return null;
    }

    function getFloatingSaveSiteConfig(siteKey) {
        if (siteKey === "linux_do") {
            return {
                label: "MD",
                title: "保存当前 LINUX DO 内容为 Markdown",
                background: "#f97316",
                shadow: "rgba(249, 115, 22, 0.35)",
            };
        }

        if (siteKey === "feishu") {
            return {
                label: "MD",
                title: "保存当前飞书文档为 Markdown",
                background: "#1677ff",
                shadow: "rgba(22, 119, 255, 0.35)",
            };
        }

        if (siteKey === "wechat") {
            return {
                label: "MD",
                title: "保存当前微信公众号文章为 Markdown",
                background: "#07c160",
                shadow: "rgba(7, 193, 96, 0.35)",
            };
        }

        return null;
    }

    function getViewportSize(viewportLike = globalScope) {
        const width = Number(viewportLike?.innerWidth || viewportLike?.width || 0) || 1024;
        const height = Number(viewportLike?.innerHeight || viewportLike?.height || 0) || 768;
        return { width, height };
    }

    function clampNumber(value, min, max) {
        if (max < min) return min;
        return Math.min(Math.max(value, min), max);
    }

    function isFloatingSaveButtonEdgeMode(state = {}) {
        return state.mode === "edge";
    }

    function getFloatingSaveButtonSize(state = {}) {
        return isFloatingSaveButtonEdgeMode(state)
            ? FLOATING_SAVE_BUTTON_EDGE_SIZE
            : FLOATING_SAVE_BUTTON_NORMAL_SIZE;
    }

    function getFloatingSaveButtonEdgeFromX(x, viewportLike = globalScope) {
        const { width } = getViewportSize(viewportLike);
        return Number(x) < width / 2 ? "left" : "right";
    }

    function normalizeFloatingSaveButtonState(state = {}, viewportLike = globalScope) {
        const { width, height } = getViewportSize(viewportLike);
        const mode = state.mode === "edge" ? "edge" : "normal";
        const edge = state.edge === "left" ? "left" : "right";
        const size = getFloatingSaveButtonSize({ mode });
        const defaultX = Math.max(
            FLOATING_SAVE_BUTTON_MARGIN,
            width - FLOATING_SAVE_BUTTON_NORMAL_SIZE.width - FLOATING_SAVE_BUTTON_DEFAULT_RIGHT
        );

        let x = Number(state.x);
        let y = Number(state.y);
        if (!Number.isFinite(x)) x = defaultX;
        if (!Number.isFinite(y)) y = FLOATING_SAVE_BUTTON_DEFAULT_TOP;

        if (mode === "edge") {
            x = edge === "left" ? 0 : Math.max(0, width - size.width);
        } else {
            x = clampNumber(x, FLOATING_SAVE_BUTTON_MARGIN, width - size.width - FLOATING_SAVE_BUTTON_MARGIN);
        }
        y = clampNumber(y, FLOATING_SAVE_BUTTON_MARGIN, height - size.height - FLOATING_SAVE_BUTTON_MARGIN);

        return {
            mode,
            edge,
            x: Math.round(x),
            y: Math.round(y),
        };
    }

    function getDefaultFloatingSaveButtonState(viewportLike = globalScope) {
        return normalizeFloatingSaveButtonState({
            mode: "normal",
            edge: "right",
            y: FLOATING_SAVE_BUTTON_DEFAULT_TOP,
        }, viewportLike);
    }

    function collapseFloatingSaveButtonState(state = {}, viewportLike = globalScope) {
        const normalized = normalizeFloatingSaveButtonState(state, viewportLike);
        const edge = getFloatingSaveButtonEdgeFromX(
            normalized.x + FLOATING_SAVE_BUTTON_NORMAL_SIZE.width / 2,
            viewportLike
        );
        return normalizeFloatingSaveButtonState({
            mode: "edge",
            edge,
            y: normalized.y,
        }, viewportLike);
    }

    function expandFloatingSaveButtonState(state = {}, viewportLike = globalScope) {
        const normalized = normalizeFloatingSaveButtonState({ ...state, mode: "edge" }, viewportLike);
        const { width } = getViewportSize(viewportLike);
        const x = normalized.edge === "left"
            ? FLOATING_SAVE_BUTTON_DEFAULT_RIGHT
            : width - FLOATING_SAVE_BUTTON_NORMAL_SIZE.width - FLOATING_SAVE_BUTTON_DEFAULT_RIGHT;
        return normalizeFloatingSaveButtonState({
            mode: "normal",
            edge: normalized.edge,
            x,
            y: normalized.y,
        }, viewportLike);
    }

    const exported = {
        FLOATING_SAVE_BUTTON_EDGE_SIZE,
        FLOATING_SAVE_BUTTON_NORMAL_SIZE,
        FLOATING_SAVE_BUTTON_STATE_KEY,
        collapseFloatingSaveButtonState,
        SITE_FLOATING_SAVE_BUTTON_ID,
        detectFloatingSaveSite,
        expandFloatingSaveButtonState,
        getDefaultFloatingSaveButtonState,
        getFloatingSaveButtonEdgeFromX,
        getFloatingSaveButtonSize,
        getFloatingSaveSiteConfig,
        isFloatingSaveIconEnabled,
        isFloatingSaveButtonEdgeMode,
        normalizeFloatingSaveButtonState,
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = exported;
    }

    Object.assign(globalScope, exported);
})(typeof globalThis !== "undefined" ? globalThis : this);



