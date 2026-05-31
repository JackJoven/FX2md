const test = require("node:test");
const assert = require("node:assert/strict");

const {
    collapseFloatingSaveButtonState,
    detectFloatingSaveSite,
    expandFloatingSaveButtonState,
    getFloatingSaveButtonEdgeFromX,
    getFloatingSaveButtonSize,
    isFloatingSaveIconEnabled,
    normalizeFloatingSaveButtonState,
} = require("../site_actions.js");

test("detectFloatingSaveSite recognizes supported site pages only", () => {
    assert.equal(detectFloatingSaveSite({ hostname: "linux.do", pathname: "/t/topic/841319" }), "linux_do");
    assert.equal(detectFloatingSaveSite({ hostname: "waytoagi.feishu.cn", pathname: "/wiki/QPe5w5g7UisbEkkow8XcDmOpn8e" }), "feishu");
    assert.equal(detectFloatingSaveSite({ hostname: "waytoagi.feishu.cn", pathname: "/docx/G9fzdabOlocE16x80BXcFXtUnu8" }), "feishu");
    assert.equal(detectFloatingSaveSite({ hostname: "x.com", pathname: "/foo/status/1" }), null);
});

test("isFloatingSaveIconEnabled defaults to true and respects config", () => {
    assert.equal(isFloatingSaveIconEnabled({}), true);
    assert.equal(isFloatingSaveIconEnabled({ show_site_save_icon: true }), true);
    assert.equal(isFloatingSaveIconEnabled({ show_site_save_icon: false }), false);
});

test("normalizeFloatingSaveButtonState keeps the button inside the viewport", () => {
    const viewport = { innerWidth: 320, innerHeight: 240 };

    assert.deepEqual(
        normalizeFloatingSaveButtonState({ mode: "normal", x: 999, y: -30 }, viewport),
        { mode: "normal", edge: "right", x: 270, y: 8 },
    );

    assert.deepEqual(
        normalizeFloatingSaveButtonState({ mode: "edge", edge: "left", x: 200, y: 999 }, viewport),
        { mode: "edge", edge: "left", x: 0, y: 198 },
    );
});

test("floating save button can switch between normal and side arrow states", () => {
    const viewport = { innerWidth: 400, innerHeight: 300 };

    const rightCollapsed = collapseFloatingSaveButtonState({ mode: "normal", x: 340, y: 80 }, viewport);
    assert.deepEqual(rightCollapsed, { mode: "edge", edge: "right", x: 382, y: 80 });
    assert.deepEqual(getFloatingSaveButtonSize(rightCollapsed), { width: 18, height: 34 });

    const expanded = expandFloatingSaveButtonState(rightCollapsed, viewport);
    assert.deepEqual(expanded, { mode: "normal", edge: "right", x: 334, y: 80 });
    assert.deepEqual(getFloatingSaveButtonSize(expanded), { width: 42, height: 42 });

    assert.equal(getFloatingSaveButtonEdgeFromX(20, viewport), "left");
    assert.equal(getFloatingSaveButtonEdgeFromX(380, viewport), "right");
});



