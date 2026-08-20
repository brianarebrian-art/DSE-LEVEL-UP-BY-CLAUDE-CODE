/* audio.js — Web Audio API 原生音效（spec §5.1：零音效庫、零外部音檔）
 *
 * 全部由 OscillatorNode + GainNode 即場合成。AudioContext 只喺用戶第一次
 * 互動後先建立（瀏覽器 autoplay 政策），失敗一律靜默降級 —— 冇聲唔應該阻住玩。
 */
(function () {
  'use strict';

  var ctx = null;
  var enabled = true;

  function ensure() {
    if (ctx) return ctx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch { ctx = null; }
    return ctx;
  }

  function tone(freq, dur, type, vol, delay) {
    if (!enabled) return;
    var c = ensure();
    if (!c) return;
    try {
      if (c.state === 'suspended') c.resume();
      var t0 = c.currentTime + (delay || 0);
      var osc = c.createOscillator();
      var g = c.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g).connect(c.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    } catch { /* 靜默 */ }
  }

  window.SMAudio = {
    setEnabled: function (v) { enabled = !!v; },
    /** 加入購物車：輕柔一聲「叮」 */
    ding: function () { tone(880, 0.12, 'sine', 0.07); },
    /** 支付成功：上行三音 */
    success: function () {
      tone(523.25, 0.14, 'triangle', 0.07, 0);
      tone(659.25, 0.14, 'triangle', 0.07, 0.11);
      tone(783.99, 0.24, 'triangle', 0.07, 0.22);
    },
    /** 送達：輕快四音 */
    arrive: function () {
      tone(659.25, 0.12, 'square', 0.05, 0);
      tone(783.99, 0.12, 'square', 0.05, 0.1);
      tone(987.77, 0.12, 'square', 0.05, 0.2);
      tone(1318.5, 0.26, 'square', 0.05, 0.3);
    },
    /** 家具落地：短促「啪」 */
    place: function () { tone(196, 0.09, 'triangle', 0.09); },
    /** 風水觸發：柔和雙音 */
    sparkle: function () {
      tone(1046.5, 0.16, 'sine', 0.05, 0);
      tone(1567.98, 0.22, 'sine', 0.04, 0.12);
    },
  };
})();
