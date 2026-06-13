// Variant A: パステルカード + クリーム背景 + 黒い下タブ + 黄色アクセント
// 全5タブ実装、料理タップで詳細シート、冷蔵庫の自由編集、献立の日単位再生成・品数調整・リクエスト、買い物の完了折り畳み・手動追加
const {
  useState,
  useMemo,
  useRef,
  useEffect,
  Fragment
} = React;
const APP_VERSION = '1.4.4';

// ─────────── パレット ───────────
const A_PAL = {
  cream: '#F8F1E4',
  card: '#FFFFFF',
  yellow: '#FFE38A',
  yellowD: '#F4C944',
  pink: '#FFD4D4',
  mint: '#C7EEDB',
  lavender: '#D9CCF2',
  orange: '#FFC4A0',
  ink: '#1F1B16',
  inkSoft: '#6B6357',
  inkSub: '#A39E92',
  hairline: '#E8E2D6',
  black: '#15110D',
  warn: '#E5705B'
};

// ─────────── ジャンル別の色（主菜/副菜/汁物） ───────────
const A_ROLE = {
  main: {
    bg: '#FFE9A3',
    soft: '#FFF6D5',
    ink: '#6B4F00',
    label: '主菜',
    emoji: '🍳'
  },
  side: {
    bg: '#C9EFDA',
    soft: '#E4F6EB',
    ink: '#1F5E40',
    label: '副菜',
    emoji: '🥗'
  },
  soup: {
    bg: '#DBCEF2',
    soft: '#ECE6F7',
    ink: '#3F2E78',
    label: '汁物',
    emoji: '🍲'
  }
};

// ─────────── アイコン ───────────
const AIcon = {
  home: c => /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinejoin: "round"
  })),
  fridge: c => /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "3",
    width: "14",
    height: "18",
    rx: "2.5",
    stroke: c,
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 10h14M9 6.5v1.5M9 13v3",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round"
  })),
  meal: c => /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 3v8a4 4 0 0 0 8 0V3M9 3v18M16 3c2 1 3 3 3 6s-1 5-3 5v7",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  cart: c => /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 4h2l2.5 11.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.4L21 8H6.5",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "20",
    r: "1.4",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "20",
    r: "1.4",
    fill: c
  })),
  cog: c => /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3",
    stroke: c,
    strokeWidth: "1.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8L4.3 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.5.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
    stroke: c,
    strokeWidth: "1.6"
  })),
  plus: c => /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14",
    stroke: c,
    strokeWidth: "3",
    strokeLinecap: "round"
  })),
  minus: c => /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14",
    stroke: c,
    strokeWidth: "3",
    strokeLinecap: "round"
  })),
  mic: c => /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "3",
    width: "6",
    height: "12",
    rx: "3",
    stroke: c,
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 11a7 7 0 0 0 14 0M12 18v3",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round"
  })),
  chev: c => /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "14",
    viewBox: "0 0 10 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 2l5 5-5 5",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round"
  })),
  chevD: c => /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "8",
    viewBox: "0 0 12 8",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l5 5 5-5",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  warn: c => /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2L1 22h22L12 2zm0 7v6m0 3v.5",
    stroke: c,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round"
  })),
  check: c => /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12l5 5L20 6",
    stroke: c,
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  refresh: c => /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  swap: c => /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 7h13l-3-3M21 17H8l3 3",
    stroke: c,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  close: c => /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18",
    stroke: c,
    strokeWidth: "2.5",
    strokeLinecap: "round"
  })),
  trash: c => /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 7h16M9 7V4h6v3M6 7l1.5 13h9L18 7M10 11v6M14 11v6",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  edit: c => /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 20h4l11-11-4-4L4 16v4zM13 5l4 4",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  sparkle: c => /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3",
    fill: c
  })),
  filter: c => /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 5h18l-7 9v6l-4-2v-4L3 5z",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinejoin: "round"
  })),
  heart: (c, fill = 'none') => /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: fill
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 21s-7.5-4.7-9.5-9.2C1.2 8.9 2.7 5.5 5.8 5.1c1.8-.2 3.5.6 4.5 2.1 1-1.5 2.7-2.3 4.5-2.1 3.1.4 4.6 3.8 3.3 6.7C19.5 16.3 12 21 12 21z",
    stroke: c,
    strokeWidth: "1.8",
    strokeLinejoin: "round"
  }))
};
const A_CATS = ['野菜', '肉', '魚', '卵・乳製品', 'その他'];
const A_UNITS = ['個', '本', '玉', '袋', '枚', '切', '丁', 'パック', 'g', 'ml', 'L', 'cm'];
const A_SHOP_CATS = ['野菜', '肉・魚', '乳製品', '乾物', '調味料', 'その他'];
const A_KANA_ROWS = [{
  key: 'all',
  label: '全て'
}, {
  key: 'a',
  label: 'あ'
}, {
  key: 'ka',
  label: 'か'
}, {
  key: 'sa',
  label: 'さ'
}, {
  key: 'ta',
  label: 'た'
}, {
  key: 'na',
  label: 'な'
}, {
  key: 'ha',
  label: 'は'
}, {
  key: 'ma',
  label: 'ま'
}, {
  key: 'ya',
  label: 'や'
}, {
  key: 'ra',
  label: 'ら'
}, {
  key: 'wa',
  label: 'わ'
}, {
  key: 'other',
  label: '他'
}];
const A_KANA_ROW_CHARS = {
  a: 'あいうえおぁぃぅぇぉ',
  ka: 'かきくけこがぎぐげご',
  sa: 'さしすせそざじずぜぞ',
  ta: 'たちつてとだぢづでどっ',
  na: 'なにぬねの',
  ha: 'はひふへほばびぶべぼぱぴぷぺぽ',
  ma: 'まみむめも',
  ya: 'やゆよゃゅょ',
  ra: 'らりるれろ',
  wa: 'わをん'
};
const A_KANJI_INITIAL_KANA = {
  油: 'あ',
  厚: 'あ',
  甘: 'あ',
  赤: 'あ',
  青: 'あ',
  牛: 'ぎ',
  玉: 'た',
  鶏: 'と',
  豚: 'ぶ',
  卵: 'た',
  鮭: 'さ',
  鯖: 'さ',
  鯵: 'あ',
  鰯: 'い',
  米: 'こ',
  小: 'こ',
  高: 'こ',
  黒: 'く',
  白: 'し',
  塩: 'し',
  生: 'し',
  焼: 'や',
  長: 'な',
  大: 'だ',
  人: 'に',
  里: 'さ',
  春: 'し',
  水: 'み'
};
function kanaRowForIngredient(name) {
  const text = String(name || '').trim();
  if (!text) return 'other';
  let head = A_KANJI_INITIAL_KANA[text[0]] || text[0];
  const code = head.charCodeAt(0);
  if (code >= 0x30A1 && code <= 0x30F6) head = String.fromCharCode(code - 0x60);
  for (const [row, chars] of Object.entries(A_KANA_ROW_CHARS)) {
    if (chars.includes(head)) return row;
  }
  return 'other';
}
function ingredientChoices() {
  const units = window.KM_DATA?.ingredientData?.units || {};
  return Object.keys(units).filter(name => name && !/^\?+$/.test(name)).sort((a, b) => a.localeCompare(b, 'ja'));
}
function defaultUnitForIngredient(name) {
  const text = String(name || '');
  if (/水|牛乳|豆乳|甘酒|ジュース|茶|コーヒー|油|酢|醤油|酒|みりん|ポン酢|めんつゆ|ソース|ドレッシング/.test(text)) return 'ml';
  if (/肉|牛|豚|鶏|魚|鮭|鯖|鯵|いわし|まぐろ|かつお|サーモン|えび|いか|たこ|ほたて|豆腐|チーズ|バター|ヨーグルト|ご飯|米|麺|パスタ/.test(text)) return 'g';
  if (/ねぎ|きゅうり|大根|にんじん|なす|ピーマン|ズッキーニ|バナナ|りんご/.test(text)) return '本';
  if (/キャベツ|白菜|レタス|玉ねぎ|かぶ/.test(text)) return '玉';
  if (/卵|トマト|じゃがいも|さつまいも|しいたけ|エリンギ|レモン/.test(text)) return '個';
  if (/しめじ|えのき|まいたけ|もやし|小松菜|ほうれん草|にら|水菜|カット野菜/.test(text)) return '袋';
  return '個';
}

// ─────────── ホーム ───────────
function AHome({
  data,
  fridge,
  shopping,
  mealPlan,
  recipes,
  setTab,
  openRecipe
}) {
  const today = mealPlan[0];
  const main = recipes[today.recipes[0]];
  const sides = today.recipes.slice(1);
  const expiring = fridge.filter(f => f.daysLeft <= 3).length;
  const unchecked = shopping.filter(s => !s.checked).length;
  const shoppingTotal = shopping.length;
  const SectionLabel = ({
    children,
    action
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
      paddingLeft: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 800,
      letterSpacing: 1.5
    }
  }, children), action);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px 100px',
      background: A_PAL.cream,
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: A_PAL.inkSub,
      fontSize: 12,
      fontWeight: 600
    }
  }, "2026\u5E745\u670822\u65E5 (\u6728)"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 26,
      fontWeight: 800,
      color: A_PAL.ink,
      letterSpacing: -0.4
    }
  }, "\u4ECA\u591C\u306E\u3054\u306F\u3093"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSoft,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      background: A_PAL.card,
      padding: '4px 10px',
      borderRadius: 12,
      border: `1px solid ${A_PAL.hairline}`
    }
  }, "\uD83D\uDC65 ", data.settings.people, "\u4EBA\u5206"))), /*#__PURE__*/React.createElement("div", {
    onClick: () => openRecipe(main.id),
    style: {
      marginTop: 18,
      background: A_ROLE.main.bg,
      borderRadius: 22,
      padding: '18px 18px',
      cursor: 'pointer',
      boxShadow: '0 10px 26px rgba(244, 201, 68, 0.24)',
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 57,
      height: 57,
      borderRadius: 18,
      background: 'rgba(255,255,255,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 27,
      flexShrink: 0
    }
  }, A_ROLE.main.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: A_ROLE.main.ink,
      letterSpacing: 1
    }
  }, A_ROLE.main.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: A_PAL.ink,
      lineHeight: 1.25,
      marginTop: 2
    }
  }, main.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: A_ROLE.main.ink,
      fontWeight: 800,
      whiteSpace: 'nowrap',
      flexShrink: 0
    }
  }, main.time, "\u5206"), AIcon.chev(A_ROLE.main.ink)), sides.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, sides.map(rid => {
    const r = recipes[rid];
    const tone = A_ROLE[r.role];
    return /*#__PURE__*/React.createElement("div", {
      key: rid,
      onClick: () => openRecipe(rid),
      style: {
        background: tone.bg,
        borderRadius: 16,
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0
      }
    }, tone.emoji), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        color: tone.ink,
        letterSpacing: 1
      }
    }, tone.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: A_PAL.ink,
        lineHeight: 1.3,
        marginTop: 1
      }
    }, r.name)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: tone.ink,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }, r.time, "\u5206"), AIcon.chev(tone.ink));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, null, "\u4ECA\u306E\u72B6\u614B"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setTab('fridge'),
    style: {
      background: A_PAL.card,
      borderRadius: 18,
      padding: '14px 16px',
      cursor: 'pointer',
      border: `1px solid ${A_PAL.hairline}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, AIcon.fridge(A_PAL.inkSoft), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSoft,
      fontWeight: 700,
      letterSpacing: 0.5
    }
  }, "\u51B7\u8535\u5EAB")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4,
      fontFeatureSettings: '"tnum"'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: A_PAL.ink,
      lineHeight: 1
    }
  }, fridge.length), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: A_PAL.inkSoft
    }
  }, "\u54C1")), expiring > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.warn,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      whiteSpace: 'nowrap'
    }
  }, AIcon.warn(A_PAL.warn), " \u671F\u9650\u8FD1 ", expiring, "\u54C1") : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub
    }
  }, "\u3059\u3079\u3066\u4F59\u88D5")), /*#__PURE__*/React.createElement("div", {
    onClick: () => setTab('shopping'),
    style: {
      background: A_PAL.card,
      borderRadius: 18,
      padding: '14px 16px',
      cursor: 'pointer',
      border: `1px solid ${A_PAL.hairline}`,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, AIcon.cart(A_PAL.inkSoft), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSoft,
      fontWeight: 700,
      letterSpacing: 0.5
    }
  }, "\u8CB7\u3044\u7269")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 4,
      fontFeatureSettings: '"tnum"'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 26,
      fontWeight: 800,
      color: A_PAL.ink,
      lineHeight: 1
    }
  }, unchecked), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: A_PAL.inkSoft
    }
  }, "\u54C1")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      whiteSpace: 'nowrap'
    }
  }, "\u5168", shoppingTotal, "\u54C1\u4E2D \u672A\u30C1\u30A7\u30C3\u30AF")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(SectionLabel, null, "\u3053\u306E\u3042\u3068\u306E\u4E88\u5B9A"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, mealPlan.slice(1).map(d => {
    const dayMain = recipes[d.recipes[0]];
    return /*#__PURE__*/React.createElement("div", {
      key: d.id,
      onClick: () => setTab('meal'),
      style: {
        background: A_PAL.card,
        borderRadius: 16,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        border: `1px solid ${A_PAL.hairline}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 46,
        textAlign: 'center',
        fontFeatureSettings: '"tnum"',
        borderRight: `1px solid ${A_PAL.hairline}`,
        paddingRight: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: A_PAL.inkSub,
        fontWeight: 700
      }
    }, d.date.split('/')[0], "\u6708"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 22,
        fontWeight: 800,
        color: A_PAL.ink,
        lineHeight: 1,
        marginTop: 2
      }
    }, d.date.split('/')[1])), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: A_PAL.inkSub,
        fontWeight: 700,
        letterSpacing: 0.5
      }
    }, d.label), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 2,
        fontSize: 14,
        fontWeight: 700,
        color: A_PAL.ink,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, dayMain.name), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 2,
        fontSize: 10,
        color: A_PAL.inkSub,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, d.recipes.slice(1).map(rid => recipes[rid].name).join('・'))), /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0
      }
    }, AIcon.chev(A_PAL.inkSub)));
  }))));
}

// ─────────── 冷蔵庫 ───────────
function AFridge({
  fridge,
  setFridge,
  openEditor,
  onCarryOver
}) {
  const [cat, setCat] = useState('野菜');
  const items = useMemo(() => fridge.filter(f => f.category === cat), [fridge, cat]);
  const inc = (id, d) => setFridge(prev => prev.map(f => f.id === id ? {
    ...f,
    amount: Math.max(0, +(f.amount + d).toFixed(2))
  } : f).filter(f => f.amount > 0));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.cream,
      minHeight: '100%',
      padding: '14px 0 170px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 20px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: A_PAL.inkSub,
      fontSize: 12,
      letterSpacing: 0.5
    }
  }, "FRIDGE"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '2px 0 0',
      fontSize: 24,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, "\u51B7\u8535\u5EAB")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub
    }
  }, "\u5168", fridge.length, "\u54C1")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      overflowX: 'auto',
      padding: '14px 20px 4px'
    }
  }, A_CATS.map(c => {
    const active = c === cat;
    const count = fridge.filter(f => f.category === c).length;
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      onClick: () => setCat(c),
      style: {
        flex: '0 0 auto',
        height: 36,
        padding: '0 14px',
        borderRadius: 18,
        background: active ? A_PAL.black : A_PAL.card,
        color: active ? A_PAL.yellow : A_PAL.ink,
        border: active ? 0 : `1px solid ${A_PAL.hairline}`,
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, c, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        color: active ? 'rgba(255,255,255,0.6)' : A_PAL.inkSub
      }
    }, count));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 20px'
    }
  }, items.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 16,
      padding: '32px 16px',
      textAlign: 'center',
      color: A_PAL.inkSub,
      fontSize: 13
    }
  }, "\u3053\u306E\u30AB\u30C6\u30B4\u30EA\u306B\u306F\u307E\u3060\u4F55\u3082\u3042\u308A\u307E\u305B\u3093\u3002", /*#__PURE__*/React.createElement("br", null), "\u53F3\u4E0B\u306E\uFF0B\u304B\u3089\u8FFD\u52A0\u3067\u304D\u307E\u3059\u3002"), items.map(item => {
    const tone = item.daysLeft <= 2 ? A_PAL.pink : item.daysLeft <= 5 ? A_PAL.yellow : A_PAL.mint;
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      onClick: () => openEditor(item),
      style: {
        background: A_PAL.card,
        borderRadius: 16,
        padding: '12px 14px',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 40,
        borderRadius: 4,
        background: tone,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 700,
        color: A_PAL.ink,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }
    }, item.name, /*#__PURE__*/React.createElement("span", {
      style: {
        color: A_PAL.inkSub
      }
    }, AIcon.edit(A_PAL.inkSub))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: A_PAL.inkSub,
        marginTop: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        whiteSpace: 'nowrap'
      }
    }, item.daysLeft <= 3 && AIcon.warn(A_PAL.warn), "\u3042\u3068", item.daysLeft, "\u65E5")), /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => inc(item.id, -(item.unit === 'g' || item.unit === 'ml' ? 50 : 1)),
      style: {
        width: 30,
        height: 30,
        borderRadius: 15,
        border: 0,
        background: A_PAL.cream,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, AIcon.minus(A_PAL.ink)), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 50,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 700,
        color: A_PAL.ink
      }
    }, item.amount, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: A_PAL.inkSub,
        marginLeft: 2
      }
    }, item.unit)), /*#__PURE__*/React.createElement("button", {
      onClick: () => inc(item.id, item.unit === 'g' || item.unit === 'ml' ? 50 : 1),
      style: {
        width: 30,
        height: 30,
        borderRadius: 15,
        border: 0,
        background: A_PAL.yellow,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, AIcon.plus(A_PAL.ink))));
  })));
}
function AFridgeFloatingActions({
  onCarryOver,
  openEditor
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 88,
      left: 14,
      right: 14,
      display: 'grid',
      gridTemplateColumns: '1fr 48px 56px',
      gap: 8,
      zIndex: 35,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCarryOver,
    title: "\u524D\u56DE\u4F59\u308A\u3092\u8FFD\u52A0",
    style: {
      height: 48,
      padding: '0 14px',
      borderRadius: 18,
      border: 0,
      background: A_PAL.black,
      color: A_PAL.yellow,
      boxShadow: '0 4px 14px rgba(0,0,0,0.16)',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 800,
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, AIcon.plus(A_PAL.yellow), " \u524D\u56DE\u4F59\u308A"), /*#__PURE__*/React.createElement("button", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 18,
      border: 0,
      background: A_PAL.card,
      boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.mic(A_PAL.ink)), /*#__PURE__*/React.createElement("button", {
    onClick: () => openEditor(null),
    style: {
      width: 56,
      height: 56,
      borderRadius: 20,
      border: 0,
      background: A_PAL.yellowD,
      boxShadow: '0 6px 18px rgba(244, 201, 68, 0.45)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.plus(A_PAL.ink)));
}

// ─────────── 献立 ───────────
function AMeal({
  mealPlan,
  recipes,
  openRecipe,
  regenDay,
  regenAll,
  addRecipe,
  removeRecipe,
  swapRecipe,
  openRequest,
  clearDayRequest,
  requestsByScope,
  isFavoriteRecipeName,
  toggleFavoriteRecipe
}) {
  const globalReq = requestsByScope.all || {
    cuisine: [],
    type: [],
    feel: [],
    mood: [],
    useIngredients: [],
    free: ''
  };
  const reqCountOf = r => r ? r.cuisine.length + r.type.length + r.feel.length + (r.mood?.length || 0) + (r.free ? 1 : 0) : 0;
  const summaryOf = r => [...(r.cuisine || []), ...(r.type || []), ...(r.mood || []), ...(r.feel || []), r.free && `「${r.free}」`].filter(Boolean).join(' · ');
  const reqCount = reqCountOf(globalReq);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.cream,
      minHeight: '100%',
      padding: '14px 20px 100px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: A_PAL.inkSub,
      fontSize: 12,
      letterSpacing: 0.5
    }
  }, "MEAL PLAN"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '2px 0 0',
      fontSize: 24,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, "\u732E\u7ACB")), /*#__PURE__*/React.createElement("button", {
    onClick: regenAll,
    style: {
      height: 32,
      padding: '0 12px',
      borderRadius: 16,
      border: 0,
      background: A_PAL.black,
      color: A_PAL.yellow,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      cursor: 'pointer'
    }
  }, AIcon.refresh(A_PAL.yellow), " \u3059\u3079\u3066\u518D\u751F\u6210")), /*#__PURE__*/React.createElement("button", {
    onClick: () => openRequest('all'),
    style: {
      marginTop: 12,
      width: '100%',
      padding: '10px 14px',
      borderRadius: 16,
      background: reqCount > 0 ? A_PAL.yellow : A_PAL.card,
      border: `1px solid ${reqCount > 0 ? A_PAL.yellowD : A_PAL.hairline}`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 16,
      background: A_PAL.black,
      color: A_PAL.yellow,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, AIcon.sparkle(A_PAL.yellow)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: A_PAL.ink
    }
  }, "\u5E0C\u671B\u3092\u4F1D\u3048\u308B\uFF08\u5168\u4F53\uFF09"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSoft,
      marginTop: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, reqCount === 0 ? '麺類・丼・パスタ、食べたい料理など' : '希望を反映して献立を作ります')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 800,
      color: A_PAL.ink,
      flexShrink: 0,
      background: 'rgba(255,255,255,0.6)',
      padding: '4px 8px',
      borderRadius: 10,
      whiteSpace: 'nowrap'
    }
  }, reqCount > 0 ? `${reqCount}件` : '＋')), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, mealPlan.map((day, di) => {
    // 日ごとの合計時間
    const total = day.recipes.reduce((s, rid) => s + recipes[rid].time, 0);
    const dayReq = requestsByScope[day.id];
    const dayReqCount = reqCountOf(dayReq);
    return /*#__PURE__*/React.createElement("div", {
      key: day.id,
      style: {
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
        padding: '0 4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        fontWeight: 800,
        color: A_PAL.ink
      }
    }, day.date), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: A_PAL.inkSub
      }
    }, day.label), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 1,
        background: A_PAL.hairline,
        marginLeft: 4
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: A_PAL.inkSub,
        fontFeatureSettings: '"tnum"'
      }
    }, "\u8A08", total, "\u5206"), /*#__PURE__*/React.createElement("button", {
      onClick: () => regenDay(day.id),
      title: "\u3053\u306E\u65E5\u3092\u518D\u751F\u6210",
      style: {
        height: 28,
        padding: '0 10px',
        borderRadius: 14,
        border: `1px solid ${A_PAL.hairline}`,
        background: A_PAL.card,
        color: A_PAL.ink,
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, AIcon.sparkle(A_PAL.ink), " \u518D\u751F\u6210")), /*#__PURE__*/React.createElement("button", {
      onClick: () => openRequest(day.id),
      style: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: 14,
        marginBottom: 8,
        background: dayReqCount > 0 ? A_PAL.yellow : 'transparent',
        border: `1px dashed ${dayReqCount > 0 ? A_PAL.yellowD : A_PAL.inkSub + '55'}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        textAlign: 'left'
      }
    }, AIcon.sparkle(dayReqCount > 0 ? A_PAL.ink : A_PAL.inkSoft), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 800,
        color: dayReqCount > 0 ? A_PAL.ink : A_PAL.inkSoft,
        letterSpacing: 0.5
      }
    }, dayReqCount > 0 ? `${day.date} だけの希望` : `${day.date} の希望を設定`), dayReqCount > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#6B5200',
        marginTop: 1,
        fontWeight: 600,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, "\u3053\u306E\u65E5\u3060\u3051\u306E\u5E0C\u671B\u3092\u53CD\u6620\u3057\u307E\u3059")), dayReqCount > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        color: A_PAL.ink,
        flexShrink: 0,
        background: 'rgba(255,255,255,0.6)',
        padding: '2px 7px',
        borderRadius: 8,
        whiteSpace: 'nowrap'
      }
    }, dayReqCount, "\u4EF6")), day.recipes.map((rid, ri) => {
      const r = recipes[rid];
      const tone = A_ROLE[r.role];
      const isMain = r.role === 'main';
      const favorite = isFavoriteRecipeName(r.name);
      return /*#__PURE__*/React.createElement("div", {
        key: `${day.id}-${ri}`,
        onClick: () => openRecipe(rid),
        style: {
          background: tone.bg,
          borderRadius: 18,
          padding: '12px 14px',
          marginBottom: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: isMain ? '0 6px 18px rgba(0,0,0,0.06)' : 'none'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0
        }
      }, tone.emoji), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10,
          color: tone.ink,
          fontWeight: 800,
          letterSpacing: 0.8
        }
      }, tone.label, " \xB7 ", r.tag), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: isMain ? 16 : 14,
          fontWeight: 700,
          color: A_PAL.ink,
          marginTop: 2,
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, r.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: tone.ink,
          marginTop: 3,
          whiteSpace: 'nowrap'
        }
      }, "\u23F1 ", r.time, "\u5206")), /*#__PURE__*/React.createElement("div", {
        onClick: e => e.stopPropagation(),
        style: {
          display: 'flex',
          gap: 4,
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => toggleFavoriteRecipe(r.name),
        title: favorite ? 'お気に入り解除' : 'お気に入りに追加',
        style: {
          width: 30,
          height: 30,
          borderRadius: 15,
          border: 0,
          background: favorite ? A_PAL.black : 'rgba(255,255,255,0.75)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, AIcon.heart(favorite ? A_PAL.yellow : tone.ink, favorite ? A_PAL.yellow : 'none')), /*#__PURE__*/React.createElement("button", {
        onClick: () => swapRecipe(day.id, ri),
        title: "\u5DEE\u3057\u66FF\u3048",
        style: {
          width: 30,
          height: 30,
          borderRadius: 15,
          border: 0,
          background: 'rgba(255,255,255,0.75)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, AIcon.swap(tone.ink)), /*#__PURE__*/React.createElement("button", {
        onClick: () => removeRecipe(day.id, ri),
        title: "\u524A\u9664",
        style: {
          width: 30,
          height: 30,
          borderRadius: 15,
          border: 0,
          background: 'rgba(255,255,255,0.75)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, AIcon.close(tone.ink))));
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginTop: 4
      }
    }, ['main', 'side', 'soup'].map(role => /*#__PURE__*/React.createElement("button", {
      key: role,
      onClick: () => addRecipe(day.id, role),
      style: {
        flex: 1,
        height: 36,
        border: `1px dashed ${A_ROLE[role].ink}55`,
        borderRadius: 14,
        background: 'transparent',
        color: A_ROLE[role].ink,
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4
      }
    }, AIcon.plus(A_ROLE[role].ink), " ", A_ROLE[role].label))));
  })));
}

// ─────────── 買い物 ───────────
function AShopping({
  shopping,
  setShopping,
  openAdd,
  openConfirmClear
}) {
  const toggle = id => setShopping(prev => prev.map(s => s.id === id ? {
    ...s,
    checked: !s.checked
  } : s));
  const grouped = useMemo(() => {
    const g = {};
    shopping.forEach(s => {
      (g[s.category] = g[s.category] || []).push(s);
    });
    return g;
  }, [shopping]);
  const done = shopping.filter(s => s.checked).length;
  const total = shopping.length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.cream,
      minHeight: '100%',
      padding: '14px 20px 130px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: A_PAL.inkSub,
      fontSize: 12,
      letterSpacing: 0.5
    }
  }, "SHOPPING"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '2px 0 0',
      fontSize: 24,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, "\u8CB7\u3044\u7269\u30EA\u30B9\u30C8")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.yellow,
      padding: '6px 12px',
      borderRadius: 14,
      fontSize: 12,
      fontWeight: 700,
      color: A_PAL.ink,
      fontFeatureSettings: '"tnum"'
    }
  }, done, "/", total)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      height: 6,
      borderRadius: 3,
      background: A_PAL.card,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${done / Math.max(1, total) * 100}%`,
      background: A_PAL.yellowD,
      transition: 'width .2s'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, total === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 16,
      padding: '32px 16px',
      textAlign: 'center',
      color: A_PAL.inkSub,
      fontSize: 13
    }
  }, "\u30EA\u30B9\u30C8\u306B\u54C1\u7269\u304C\u3042\u308A\u307E\u305B\u3093\u3002", /*#__PURE__*/React.createElement("br", null), "\u300C\u81EA\u5206\u3067\u8FFD\u52A0\u300D\u3067\u8FFD\u52A0\u3067\u304D\u307E\u3059\u3002"), total > 0 && total === done && /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_ROLE.side.bg,
      borderRadius: 16,
      padding: '14px 16px',
      marginBottom: 12,
      textAlign: 'center',
      color: A_ROLE.side.ink,
      fontSize: 14,
      fontWeight: 700
    }
  }, "\u2713 \u5168\u90E8\u30C1\u30A7\u30C3\u30AF\u6E08\u307F\uFF01\u304A\u3064\u304B\u308C\u3055\u307E"), Object.entries(grouped).map(([category, items]) => /*#__PURE__*/React.createElement("div", {
    key: category,
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6,
      paddingLeft: 4
    }
  }, category.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 18,
      overflow: 'hidden'
    }
  }, items.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    onClick: () => toggle(s.id),
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 14px',
      borderBottom: i < items.length - 1 ? `1px solid ${A_PAL.hairline}` : 'none',
      cursor: 'pointer',
      transition: 'opacity .15s',
      opacity: s.checked ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: 12,
      flexShrink: 0,
      border: s.checked ? 0 : `2px solid ${A_PAL.hairline}`,
      background: s.checked ? A_PAL.yellowD : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background .15s'
    }
  }, s.checked && AIcon.check(A_PAL.ink)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: s.checked ? A_PAL.inkSub : A_PAL.ink,
      textDecoration: s.checked ? 'line-through' : 'none',
      transition: 'color .15s'
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      marginTop: 1,
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", null, s.amount, s.unit), s.auto && /*#__PURE__*/React.createElement("span", {
    style: {
      background: A_PAL.yellow,
      padding: '1px 6px',
      borderRadius: 8,
      fontSize: 9,
      fontWeight: 800,
      color: '#7A5A00',
      letterSpacing: 0.5
    }
  }, "\u732E\u7ACB\u304B\u3089"))))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 92,
      left: 14,
      right: 14,
      zIndex: 5,
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: openConfirmClear,
    disabled: done === 0,
    style: {
      flex: 1,
      height: 48,
      borderRadius: 16,
      border: `1px solid ${done === 0 ? A_PAL.hairline : A_PAL.warn + '55'}`,
      background: done === 0 ? A_PAL.card : '#fff',
      color: done === 0 ? A_PAL.inkSub : A_PAL.warn,
      fontSize: 12,
      fontWeight: 800,
      cursor: done === 0 ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      boxShadow: '0 4px 14px rgba(0,0,0,0.08)'
    }
  }, AIcon.trash(done === 0 ? A_PAL.inkSub : A_PAL.warn), /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, "\u5B8C\u4E86\u3092\u6D88\u3059", done > 0 && `・${done}`)), /*#__PURE__*/React.createElement("button", {
    onClick: openAdd,
    style: {
      flex: 1.2,
      height: 48,
      borderRadius: 16,
      border: 0,
      background: A_PAL.black,
      color: A_PAL.yellow,
      fontSize: 13,
      fontWeight: 800,
      cursor: 'pointer',
      boxShadow: '0 8px 22px rgba(0,0,0,0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, AIcon.plus(A_PAL.yellow), " \u81EA\u5206\u3067\u8FFD\u52A0")));
}

// ─────────── 設定 ───────────
function ASettings({
  settings,
  setSettings,
  stats,
  appVersion,
  openBackup,
  onResetData
}) {
  const setS = (k, v) => setSettings(prev => ({
    ...prev,
    [k]: v
  }));
  const listText = key => (settings[key] || []).join('、');
  const setListText = (key, value) => {
    setS(key, value.split(/[、,\n]/).map(v => v.trim()).filter(Boolean));
  };
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const stepper = (label, key, min, max, step = 1) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 16,
      padding: '12px 14px',
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 15,
      fontWeight: 600,
      color: A_PAL.ink
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    onClick: () => setS(key, Math.max(min, settings[key] - step)),
    style: {
      width: 30,
      height: 30,
      borderRadius: 15,
      border: 0,
      background: A_PAL.cream,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.minus(A_PAL.ink)), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 40,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 800,
      color: A_PAL.ink,
      fontFeatureSettings: '"tnum"'
    }
  }, settings[key]), /*#__PURE__*/React.createElement("button", {
    onClick: () => setS(key, Math.min(max, settings[key] + step)),
    style: {
      width: 30,
      height: 30,
      borderRadius: 15,
      border: 0,
      background: A_PAL.yellow,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.plus(A_PAL.ink)));
  const toggle = (label, key) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 16,
      padding: '12px 14px',
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 15,
      fontWeight: 600,
      color: A_PAL.ink
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    onClick: () => setS(key, !settings[key]),
    style: {
      width: 46,
      height: 26,
      borderRadius: 13,
      border: 0,
      padding: 2,
      background: settings[key] ? A_PAL.yellowD : '#D6D2C5',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: settings[key] ? 'flex-end' : 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 11,
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
    }
  })));
  const textarea = (label, key, placeholder) => /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 16,
      padding: '12px 14px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: A_PAL.inkSoft,
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("textarea", {
    value: listText(key),
    onChange: e => setListText(key, e.target.value),
    placeholder: placeholder,
    style: {
      width: '100%',
      minHeight: 58,
      border: `1px solid ${A_PAL.hairline}`,
      borderRadius: 12,
      background: A_PAL.cream,
      padding: '10px 12px',
      color: A_PAL.ink,
      fontSize: 14,
      lineHeight: 1.5,
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box'
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.cream,
      minHeight: '100%',
      padding: '14px 20px 100px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: A_PAL.inkSub,
      fontSize: 12,
      letterSpacing: 0.5
    }
  }, "SETTINGS"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '2px 0 18px',
      fontSize: 24,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, "\u8A2D\u5B9A"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6,
      paddingLeft: 4
    }
  }, "\u732E\u7ACB\u6761\u4EF6"), stepper('人数', 'people', 1, 8), stepper('日数', 'days', 1, 7), stepper('副菜の数', 'sideDishCount', 0, 4), stepper('最大調理時間 (分)', 'maxTime', 10, 90, 5), /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 16,
      padding: '12px 14px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: A_PAL.ink,
      marginBottom: 10
    }
  }, "\u958B\u59CB\u66DC\u65E5"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: 5
    }
  }, weekdays.map(w => {
    const active = (settings.startWeekday || '金') === w;
    return /*#__PURE__*/React.createElement("button", {
      key: w,
      onClick: () => setS('startWeekday', w),
      style: {
        height: 34,
        borderRadius: 12,
        border: active ? 0 : `1px solid ${A_PAL.hairline}`,
        background: active ? A_PAL.black : A_PAL.cream,
        color: active ? A_PAL.yellow : A_PAL.ink,
        fontSize: 13,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, w);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6,
      marginTop: 18,
      paddingLeft: 4
    }
  }, "\u597D\u307F"), toggle('かんたんレシピを優先', 'preferEasy'), toggle('よく作る料理を優先', 'preferFrequentRecipes'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6,
      marginTop: 18,
      paddingLeft: 4
    }
  }, "\u907F\u3051\u308B\u3082\u306E\u30FB\u597D\u304D\u306A\u6599\u7406"), textarea('苦手食材', 'avoidIngredients', '例：なす、さば、きのこ'), textarea('アレルギー', 'allergyIngredients', '例：卵、えび、牛乳'), (settings.favoriteRecipeNames || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 16,
      padding: '12px 14px',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: A_PAL.inkSoft,
      marginBottom: 8
    }
  }, "\u304A\u6C17\u306B\u5165\u308A\u767B\u9332\u6E08\u307F"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, (settings.favoriteRecipeNames || []).map(name => /*#__PURE__*/React.createElement("button", {
    key: name,
    onClick: () => setS('favoriteRecipeNames', (settings.favoriteRecipeNames || []).filter(n => n !== name)),
    style: {
      height: 30,
      padding: '0 8px 0 10px',
      borderRadius: 15,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.yellow,
      color: A_PAL.ink,
      fontSize: 12,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      cursor: 'pointer'
    }
  }, name, AIcon.close(A_PAL.ink))))), textarea('お気に入り料理', 'favoriteRecipeNames', '例：親子丼、豚汁、ナポリタン'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6,
      marginTop: 18,
      paddingLeft: 4
    }
  }, "\u30C7\u30FC\u30BF"), /*#__PURE__*/React.createElement("button", {
    onClick: openBackup,
    style: {
      width: '100%',
      height: 48,
      borderRadius: 16,
      background: A_PAL.black,
      color: A_PAL.yellow,
      fontSize: 14,
      fontWeight: 800,
      border: 0,
      cursor: 'pointer',
      marginBottom: 8
    }
  }, "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7 / \u5FA9\u5143"), /*#__PURE__*/React.createElement("button", {
    onClick: onResetData,
    style: {
      width: '100%',
      height: 48,
      borderRadius: 16,
      background: 'transparent',
      color: A_PAL.warn,
      fontSize: 14,
      fontWeight: 700,
      border: `1px solid ${A_PAL.hairline}`,
      cursor: 'pointer'
    }
  }, "\u4FDD\u5B58\u30C7\u30FC\u30BF\u3092\u30EA\u30BB\u30C3\u30C8"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: '10px 4px 0',
      fontSize: 10,
      lineHeight: 1.7,
      color: A_PAL.inkSub
    }
  }, /*#__PURE__*/React.createElement("div", null, "\u30A2\u30D7\u30EAver ", appVersion), /*#__PURE__*/React.createElement("div", null, "\u4E3B\u83DC ", stats.main, "\u4EF6 / \u526F\u83DC ", stats.side, "\u4EF6 / \u6C41\u7269 ", stats.soup, "\u4EF6 / \u6750\u6599 ", stats.ingredients, "\u4EF6")));
}

// ─────────── タブバー ───────────
function ATabBar({
  tab,
  setTab
}) {
  const items = [{
    k: 'home',
    label: 'ホーム',
    icon: AIcon.home
  }, {
    k: 'fridge',
    label: '冷蔵庫',
    icon: AIcon.fridge
  }, {
    k: 'meal',
    label: '献立',
    icon: AIcon.meal
  }, {
    k: 'shopping',
    label: '買い物',
    icon: AIcon.cart
  }, {
    k: 'settings',
    label: '設定',
    icon: AIcon.cog
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: A_PAL.black,
      paddingBottom: 28,
      paddingTop: 10,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      zIndex: 30
    }
  }, items.map(it => {
    const active = tab === it.k;
    const c = active ? A_PAL.yellow : 'rgba(255,255,255,0.55)';
    return /*#__PURE__*/React.createElement("button", {
      key: it.k,
      onClick: () => setTab(it.k),
      style: {
        flex: 1,
        background: 'transparent',
        border: 0,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: '4px 0'
      }
    }, it.icon(c), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: c,
        fontWeight: active ? 700 : 500
      }
    }, it.label));
  }));
}

// ─────────── 詳細シート ───────────
function ARecipeSheet({
  recipeId,
  recipes,
  settings,
  isFavoriteRecipeName,
  toggleFavoriteRecipe,
  onClose
}) {
  if (!recipeId) return null;
  const r = recipes[recipeId];
  const tone = A_ROLE[r.role];
  const favorite = isFavoriteRecipeName(r.name);
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(20,15,10,0.4)',
      zIndex: 40,
      animation: 'fadeIn .18s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 41,
      background: A_PAL.cream,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: '88%',
      overflowY: 'auto',
      animation: 'slideUp .25s cubic-bezier(.2,.7,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: A_PAL.hairline
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: tone.bg,
      padding: '18px 22px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: tone.ink,
      fontWeight: 700,
      letterSpacing: 0.5,
      background: 'rgba(255,255,255,0.6)',
      padding: '3px 10px',
      borderRadius: 10
    }
  }, tone.label, " \xB7 ", r.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => toggleFavoriteRecipe(r.name),
    title: favorite ? 'お気に入り解除' : 'お気に入りに追加',
    style: {
      width: 28,
      height: 28,
      borderRadius: 14,
      border: 0,
      cursor: 'pointer',
      background: favorite ? A_PAL.black : 'rgba(255,255,255,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.heart(favorite ? A_PAL.yellow : tone.ink, favorite ? A_PAL.yellow : 'none')), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 28,
      height: 28,
      borderRadius: 14,
      border: 0,
      cursor: 'pointer',
      background: 'rgba(255,255,255,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.close(tone.ink)))), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '12px 0 8px',
      fontSize: 22,
      fontWeight: 800,
      color: A_PAL.ink,
      lineHeight: 1.3
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      fontSize: 12,
      color: tone.ink,
      fontWeight: 600,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u23F1 \u8ABF\u7406 ", r.time, "\u5206"), /*#__PURE__*/React.createElement("span", null, "\uD83E\uDDFD \u7247\u4ED8\u3051 ", r.cleanup, "\u5206"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC65 ", settings.people, "\u4EBA\u5206"), r.cuisine && /*#__PURE__*/React.createElement("span", null, r.cuisine, "\u98DF"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 8
    }
  }, "\u6750\u6599\uFF08", settings.people, "\u4EBA\u5206\uFF09"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 16,
      overflow: 'hidden'
    }
  }, r.ingredients.map((ing, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 14px',
      borderBottom: i < r.ingredients.length - 1 ? `1px solid ${A_PAL.hairline}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 10,
      background: ing.have ? A_PAL.mint : A_PAL.pink
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 14,
      color: A_PAL.ink,
      fontWeight: 600
    }
  }, ing.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: A_PAL.inkSoft
    }
  }, (ing.amount * settings.people / 2).toFixed(ing.amount % 1 ? 1 : 0).replace(/\.0$/, ''), ing.unit), !ing.have && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 8,
      fontSize: 9,
      fontWeight: 700,
      color: '#7A2F39',
      background: A_PAL.pink,
      padding: '2px 6px',
      borderRadius: 6
    }
  }, "\u8CB7\u3046"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px 30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 8
    }
  }, "\u4F5C\u308A\u65B9"), r.steps.map((step, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 12,
      padding: '10px 0',
      borderBottom: i < r.steps.length - 1 ? `1px dashed ${A_PAL.hairline}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      width: 26,
      height: 26,
      borderRadius: 13,
      background: tone.bg,
      color: tone.ink,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 800
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: A_PAL.ink,
      lineHeight: 1.6,
      paddingTop: 3
    }
  }, step)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 22px 30px',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      flex: 1,
      height: 48,
      border: 0,
      borderRadius: 16,
      background: A_PAL.card,
      color: A_PAL.ink,
      fontSize: 14,
      fontWeight: 700,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, AIcon.swap(A_PAL.ink), " \u5225\u306E\u6599\u7406\u306B"), /*#__PURE__*/React.createElement("button", {
    style: {
      flex: 1,
      height: 48,
      border: 0,
      borderRadius: 16,
      background: A_PAL.black,
      color: A_PAL.yellow,
      fontSize: 14,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "\u3053\u308C\u3067\u6C7A\u5B9A"))));
}

// ─────────── 冷蔵庫エディタシート ───────────
function AFridgeEditor({
  open,
  initial,
  onClose,
  onSave,
  onDelete
}) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState('個');
  const [category, setCategory] = useState('野菜');
  const [daysLeft, setDaysLeft] = useState(7);
  const [ingredientRow, setIngredientRow] = useState('all');
  const [ingredientSearch, setIngredientSearch] = useState('');
  const choices = useMemo(() => ingredientChoices(), [open]);
  useEffect(() => {
    if (open) {
      setName(initial?.name || '');
      setAmount(initial?.amount ?? 1);
      setUnit(initial?.unit || '個');
      setCategory(initial?.category || '野菜');
      setDaysLeft(initial?.daysLeft ?? 7);
      setIngredientSearch('');
      setIngredientRow('all');
    }
  }, [open, initial]);
  if (!open) return null;
  const isEdit = !!initial;
  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id || `f${Date.now()}`,
      name: name.trim(),
      amount: +amount || 1,
      unit,
      category,
      daysLeft: +daysLeft || 7
    });
  };
  const chooseIngredient = itemName => {
    setName(itemName);
    setUnit(defaultUnitForIngredient(itemName));
    setCategory(fridgeCategoryFromShopping({
      name: itemName
    }));
  };
  const filteredChoices = choices.filter(itemName => ingredientRow === 'all' || kanaRowForIngredient(itemName) === ingredientRow).filter(itemName => {
    const query = ingredientSearch.trim();
    return !query || itemName.includes(query);
  }).slice(0, 72);
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(20,15,10,0.4)',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 51,
      background: A_PAL.cream,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: '88%',
      overflowY: 'auto',
      animation: 'slideUp .22s cubic-bezier(.2,.7,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: A_PAL.hairline
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 22px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 18,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, isEdit ? '食材を編集' : '食材を追加'), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 28,
      height: 28,
      borderRadius: 14,
      border: 0,
      cursor: 'pointer',
      background: A_PAL.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.close(A_PAL.ink))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u98DF\u6750\u540D"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "\u4F8B: \u304D\u3085\u3046\u308A",
    style: {
      width: '100%',
      height: 44,
      padding: '0 14px',
      borderRadius: 14,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      fontSize: 15,
      fontWeight: 600,
      color: A_PAL.ink,
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u98DF\u6750\u304B\u3089\u9078\u3076"), /*#__PURE__*/React.createElement("input", {
    value: ingredientSearch,
    onChange: e => setIngredientSearch(e.target.value),
    placeholder: "\u98DF\u6750\u3092\u691C\u7D22",
    style: {
      width: '100%',
      height: 40,
      padding: '0 12px',
      borderRadius: 13,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      fontSize: 14,
      fontWeight: 600,
      color: A_PAL.ink,
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      overflowX: 'auto',
      padding: '10px 0 8px',
      WebkitOverflowScrolling: 'touch'
    }
  }, A_KANA_ROWS.map(row => {
    const active = ingredientRow === row.key;
    return /*#__PURE__*/React.createElement("button", {
      key: row.key,
      onClick: () => setIngredientRow(row.key),
      style: {
        flex: '0 0 auto',
        height: 30,
        minWidth: 38,
        padding: '0 10px',
        borderRadius: 15,
        border: active ? 0 : `1px solid ${A_PAL.hairline}`,
        background: active ? A_PAL.black : A_PAL.card,
        color: active ? A_PAL.yellow : A_PAL.ink,
        fontSize: 12,
        fontWeight: 800,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, row.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      maxHeight: 150,
      overflowY: 'auto',
      paddingRight: 2
    }
  }, filteredChoices.map(itemName => {
    const active = name.trim() === itemName;
    return /*#__PURE__*/React.createElement("button", {
      key: itemName,
      onClick: () => chooseIngredient(itemName),
      style: {
        minHeight: 32,
        padding: '7px 10px',
        borderRadius: 16,
        border: active ? 0 : `1px solid ${A_PAL.hairline}`,
        background: active ? A_PAL.yellowD : A_PAL.card,
        color: A_PAL.ink,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        lineHeight: 1.25
      }
    }, itemName);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px 0',
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u6570\u91CF"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 44,
      borderRadius: 14,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      padding: '0 6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAmount(v => Math.max(0, +(v - 1).toFixed(1))),
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: 0,
      background: A_PAL.cream,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.minus(A_PAL.ink)), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.5",
    value: amount,
    onChange: e => setAmount(e.target.value),
    style: {
      flex: 1,
      height: '100%',
      border: 0,
      background: 'transparent',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 800,
      color: A_PAL.ink,
      outline: 'none',
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAmount(v => +(+v + 1).toFixed(1)),
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: 0,
      background: A_PAL.yellow,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.plus(A_PAL.ink)))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 110,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u5358\u4F4D"), /*#__PURE__*/React.createElement("select", {
    value: unit,
    onChange: e => setUnit(e.target.value),
    style: {
      width: '100%',
      height: 44,
      padding: '0 14px',
      borderRadius: 14,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      fontSize: 15,
      fontWeight: 600,
      color: A_PAL.ink,
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      fontFamily: 'inherit'
    }
  }, A_UNITS.map(u => /*#__PURE__*/React.createElement("option", {
    key: u,
    value: u
  }, u))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u30AB\u30C6\u30B4\u30EA"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, A_CATS.map(c => {
    const active = c === category;
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      onClick: () => setCategory(c),
      style: {
        height: 34,
        padding: '0 12px',
        borderRadius: 17,
        border: active ? 0 : `1px solid ${A_PAL.hairline}`,
        background: active ? A_PAL.black : A_PAL.card,
        color: active ? A_PAL.yellow : A_PAL.ink,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, c);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u8CDE\u5473\u671F\u9650\uFF08\u3042\u3068\u4F55\u65E5\uFF09"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, [1, 2, 3, 5, 7, 10, 14, 30].map(d => {
    const active = +daysLeft === d;
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: () => setDaysLeft(d),
      style: {
        height: 34,
        minWidth: 44,
        padding: '0 10px',
        borderRadius: 17,
        border: active ? 0 : `1px solid ${A_PAL.hairline}`,
        background: active ? d <= 3 ? A_PAL.warn : A_PAL.yellowD : A_PAL.card,
        color: active ? '#fff' : A_PAL.ink,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, d, "\u65E5");
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 22px 28px',
      display: 'flex',
      gap: 8
    }
  }, isEdit && /*#__PURE__*/React.createElement("button", {
    onClick: () => onDelete(initial.id),
    style: {
      width: 48,
      height: 48,
      borderRadius: 16,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.trash(A_PAL.warn)), /*#__PURE__*/React.createElement("button", {
    onClick: handleSave,
    disabled: !name.trim(),
    style: {
      flex: 1,
      height: 48,
      border: 0,
      borderRadius: 16,
      background: name.trim() ? A_PAL.black : '#A39E92',
      color: A_PAL.yellow,
      fontSize: 14,
      fontWeight: 800,
      cursor: name.trim() ? 'pointer' : 'not-allowed'
    }
  }, isEdit ? '保存' : '追加'))));
}

// ─────────── 献立リクエストシート ───────────
function AMealRequestSheet({
  scope,
  mealPlan,
  requestsByScope,
  fridge,
  onClose,
  onApply,
  onClearScope
}) {
  const [editScope, setEditScope] = useState(scope || 'all');
  const [cuisine, setCuisine] = useState([]);
  const [type, setType] = useState([]);
  const [feel, setFeel] = useState([]);
  const [mood, setMood] = useState([]); // 自由な「今日の気分」カスタムタグ
  const [moodInput, setMoodInput] = useState('');
  const [free, setFree] = useState('');
  const [voiceState, setVoiceState] = useState('idle'); // idle | listening | analyzing
  const [voiceError, setVoiceError] = useState('');
  const recogRef = useRef(null);
  const open = scope != null;
  const EMPTY = {
    cuisine: [],
    type: [],
    feel: [],
    mood: [],
    useIngredients: [],
    free: ''
  };

  // 開いたとき：propの scope に切り替え + そのスコープの内容をロード
  useEffect(() => {
    if (scope == null) return;
    setEditScope(scope);
  }, [scope]);

  // editScope が変わるたびに、そのスコープの保存済み内容をフィールドに読み込む
  useEffect(() => {
    if (scope == null) return;
    const src = requestsByScope[editScope] || EMPTY;
    setCuisine(src.cuisine || []);
    setType(src.type || []);
    setFeel(src.feel || []);
    setMood(src.mood || []);
    setFree(src.free || '');
    setMoodInput('');
    setVoiceState('idle');
    setVoiceError('');
  }, [editScope, scope]);
  useEffect(() => {
    return () => {
      if (recogRef.current) {
        try {
          recogRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);
  if (!open) return null;
  const reqTags = window.KM_DATA.requestTags;

  // スコープタブの選択肢: 全日 + 各日付
  const scopes = [{
    id: 'all',
    label: '全日に適用',
    sub: '基本ルール'
  }, ...mealPlan.map(d => ({
    id: d.id,
    label: d.date,
    sub: d.label
  }))];
  const toggleIn = (arr, setArr, v) => {
    if (arr.includes(v)) setArr(arr.filter(x => x !== v));else setArr([...arr, v]);
  };
  const addMood = v => {
    const t = (v || '').trim();
    if (!t) return;
    if (!mood.includes(t)) setMood([...mood, t]);
    setMoodInput('');
  };
  const reset = () => {
    setCuisine([]);
    setType([]);
    setFeel([]);
    setMood([]);
    setFree('');
  };
  const apply = () => {
    onApply(editScope, {
      cuisine,
      type,
      feel,
      mood,
      useIngredients: [],
      free
    });
  };
  const hasScopeOverride = editScope !== 'all' && requestsByScope[editScope];
  const editingDay = mealPlan.find(d => d.id === editScope);

  // 音声入力
  const startVoice = () => {
    setVoiceError('');
    const Recog = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recog) {
      setVoiceError('このブラウザでは音声入力が使えません。手動で入力してください。');
      // Demo fallback: simulated mic — pretend we heard something
      simulateVoice();
      return;
    }
    const baseText = free; // 録音前の文字列を保持
    let finalText = '';
    const recog = new Recog();
    recog.lang = 'ja-JP';
    recog.interimResults = true;
    recog.continuous = false;
    recog.onstart = () => setVoiceState('listening');
    recog.onresult = e => {
      let final = '';
      let interim = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;else interim += r[0].transcript;
      }
      finalText = final;
      const combined = (baseText ? baseText + (baseText.endsWith(' ') ? '' : ' ') : '') + final + interim;
      setFree(combined);
    };
    recog.onerror = e => {
      setVoiceState('idle');
      setVoiceError('認識できませんでした：' + (e.error || ''));
    };
    recog.onend = () => {
      setVoiceState('idle');
      // 音声から得た最終テキストで分析
      if (finalText.trim()) analyzeText(finalText);
    };
    recog.start();
    recogRef.current = recog;
  };
  const stopVoice = () => {
    if (recogRef.current) {
      try {
        recogRef.current.stop();
      } catch (e) {}
    }
    setVoiceState('idle');
  };
  // Demo simulator: ビルトインのSpeechRecognitionがない環境（プレビューイフレーム等）ではデモとしてサンプルを足す
  const simulateVoice = () => {
    setVoiceState('listening');
    setTimeout(() => {
      const sample = '今日は麺類が食べたい、さっぱりしたもので';
      setFree(prev => (prev ? prev + ' ' : '') + sample);
      setVoiceState('idle');
      analyzeText(sample);
    }, 1400);
  };
  const analyzeText = async text => {
    if (!text || !text.trim()) return;
    setVoiceState('analyzing');
    try {
      const prompt = `次の文から、夕食の希望を抽出してJSONだけを返してください。
format: {"cuisine":["和食"or"洋食"or"中食"のそんざい],"type":["麺類","丼物","烒め物","焼き物","煮物","揚げ物","サラダ","一品で完結"のうち該当するもの],"feel":["ご飯がすすむ","さっぱり","がっつり","時短","野菜たっぷり","ピリ辛"のうち該当するもの],"mood":[「パスタ」「茶碗蒸し」「ラーメン」といった具体的な料理名]}
該当しないキーは空配列。JSON以外の説明は一切不要。
文: ${text}`;
      const res = await window.claude.complete(prompt);
      const m = res.match(/\{[\s\S]*\}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        if (Array.isArray(parsed.cuisine)) {
          setCuisine(prev => Array.from(new Set([...prev, ...parsed.cuisine.filter(c => typeof c === 'string' && c.trim())])));
        }
        if (Array.isArray(parsed.type)) {
          setType(prev => Array.from(new Set([...prev, ...parsed.type.filter(t => typeof t === 'string' && t.trim())])));
        }
        if (Array.isArray(parsed.feel)) {
          setFeel(prev => Array.from(new Set([...prev, ...parsed.feel.filter(f => typeof f === 'string' && f.trim())])));
        }
        if (Array.isArray(parsed.mood)) {
          setMood(prev => Array.from(new Set([...prev, ...parsed.mood.filter(m => typeof m === 'string' && m.trim())])));
        }
      }
    } catch (e) {
      setVoiceError('分析できませんでした');
    }
    setVoiceState('idle');
  };
  const total = cuisine.length + type.length + feel.length + mood.length + (free ? 1 : 0);
  const chips = (label, options, selected, setter, tone) => /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, options.map(o => {
    const active = selected.includes(o);
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      onClick: () => toggleIn(selected, setter, o),
      style: {
        height: 34,
        padding: '0 12px',
        borderRadius: 17,
        border: active ? 0 : `1px solid ${A_PAL.hairline}`,
        background: active ? tone || A_PAL.black : A_PAL.card,
        color: active ? tone === A_PAL.yellow ? A_PAL.ink : A_PAL.yellow : A_PAL.ink,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, o);
  })));
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(20,15,10,0.4)',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 51,
      background: A_PAL.cream,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: '92%',
      overflowY: 'auto',
      animation: 'slideUp .22s cubic-bezier(.2,.7,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: A_PAL.hairline
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 22px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 18,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, editScope === 'all' ? '希望を伝える' : `${editingDay?.date} の希望`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      marginTop: 2
    }
  }, editScope === 'all' ? '全体の基本ルールとして使われます' : `${editingDay?.label} のみに適用されます`)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 28,
      height: 28,
      borderRadius: 14,
      border: 0,
      cursor: 'pointer',
      background: A_PAL.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.close(A_PAL.ink))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      overflowX: 'auto',
      paddingBottom: 4
    }
  }, scopes.map(s => {
    const active = s.id === editScope;
    const hasOverride = s.id !== 'all' && requestsByScope[s.id];
    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      onClick: () => setEditScope(s.id),
      style: {
        flex: '0 0 auto',
        padding: '7px 12px',
        borderRadius: 14,
        border: active ? 0 : `1px solid ${A_PAL.hairline}`,
        background: active ? A_PAL.black : A_PAL.card,
        color: active ? A_PAL.yellow : A_PAL.ink,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1,
        minWidth: s.id === 'all' ? 90 : 70,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.5
      }
    }, s.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9,
        fontWeight: 600,
        color: active ? 'rgba(255,255,255,0.6)' : A_PAL.inkSub
      }
    }, s.sub), hasOverride && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        background: A_PAL.yellowD,
        border: `1.5px solid ${A_PAL.cream}`
      }
    }));
  })), editScope !== 'all' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: '10px 12px',
      borderRadius: 12,
      background: hasScopeOverride ? A_PAL.yellow : A_PAL.card,
      border: `1px solid ${hasScopeOverride ? A_PAL.yellowD : A_PAL.hairline}`,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: A_PAL.ink
    }
  }, hasScopeOverride ? `${editingDay?.date} だけの設定（保存済み）` : `${editingDay?.date} だけの設定`), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: A_PAL.inkSoft,
      marginTop: 1
    }
  }, hasScopeOverride ? '編集して上書きできます' : '保存すると、この日だけ全日と違う条件にできます')), hasScopeOverride && /*#__PURE__*/React.createElement("button", {
    onClick: () => onClearScope(editScope),
    style: {
      height: 28,
      padding: '0 10px',
      borderRadius: 14,
      background: A_PAL.card,
      color: A_PAL.warn,
      fontSize: 11,
      fontWeight: 700,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      border: `1px solid ${A_PAL.warn}55`
    }
  }, AIcon.trash(A_PAL.warn), " \u6D88\u3059"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px 0'
    }
  }, chips('ジャンル', reqTags.cuisine.map(c => c + '食'), cuisine, setCuisine), chips('料理タイプ', reqTags.type, type, setType), chips('雰囲気', reqTags.feel, feel, setFeel), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u98DF\u3079\u305F\u3044\u6599\u7406\u540D"), mood.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 8
    }
  }, mood.map(m => /*#__PURE__*/React.createElement("div", {
    key: m,
    style: {
      height: 34,
      padding: '0 6px 0 12px',
      borderRadius: 17,
      background: A_PAL.yellow,
      fontSize: 12,
      fontWeight: 700,
      color: A_PAL.ink,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, m, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMood(mood.filter(x => x !== m)),
    style: {
      width: 22,
      height: 22,
      border: 0,
      borderRadius: 11,
      background: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.close(A_PAL.ink))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 44,
      borderRadius: 14,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      padding: '0 6px 0 12px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: moodInput,
    onChange: e => setMoodInput(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter') addMood(moodInput);
    },
    placeholder: "\u4F8B: \u30D1\u30B9\u30BF / \u8336\u7897\u84B8\u3057 / \u30E9\u30FC\u30E1\u30F3",
    style: {
      flex: 1,
      height: '100%',
      border: 0,
      background: 'transparent',
      fontSize: 14,
      color: A_PAL.ink,
      outline: 'none',
      fontFamily: 'inherit',
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => addMood(moodInput),
    disabled: !moodInput.trim(),
    style: {
      height: 30,
      padding: '0 10px',
      borderRadius: 8,
      border: 0,
      background: moodInput.trim() ? A_PAL.yellowD : A_PAL.cream,
      color: A_PAL.ink,
      fontSize: 12,
      fontWeight: 700,
      cursor: moodInput.trim() ? 'pointer' : 'not-allowed',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      whiteSpace: 'nowrap'
    }
  }, AIcon.plus(A_PAL.ink), " \u8FFD\u52A0")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 10,
      color: A_PAL.inkSub
    }
  }, "\u671F\u9593\u5185\u30671\u56DE\u3060\u3051\u512A\u5148\u3057\u307E\u3059\u3002\u300C\u9EBA\u985E\u300D\u300C\u30D1\u30B9\u30BF\u300D\u300C\u8336\u7897\u84B8\u3057\u300D\u306A\u3069\u3002")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6,
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, "\u6761\u4EF6\u30FB\u96F0\u56F2\u6C17\u3092\u3072\u3068\u3053\u3068\u3067", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 500,
      color: A_PAL.inkSub
    }
  }, "\u30DE\u30A4\u30AF\u30DC\u30BF\u30F3\u3067\u8A71\u3057\u304B\u3051\u3066\u3082OK")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: free,
    onChange: e => setFree(e.target.value),
    placeholder: "\u4F8B: \u5B50\u3069\u3082\u304C\u98DF\u3079\u3084\u3059\u3044\u3082\u306E\u3001\u8F9B\u304F\u306A\u3044\u3082\u306E\u3001\u7C21\u5358\u306B...",
    style: {
      width: '100%',
      minHeight: 76,
      padding: '12px 56px 12px 12px',
      borderRadius: 14,
      border: `1px solid ${voiceState === 'listening' ? A_PAL.warn : A_PAL.hairline}`,
      background: A_PAL.card,
      fontSize: 13,
      color: A_PAL.ink,
      fontFamily: 'inherit',
      outline: 'none',
      boxSizing: 'border-box',
      resize: 'none'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: voiceState === 'listening' ? stopVoice : startVoice,
    disabled: voiceState === 'analyzing',
    style: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 40,
      height: 40,
      borderRadius: 20,
      border: 0,
      background: voiceState === 'listening' ? A_PAL.warn : A_PAL.black,
      cursor: voiceState === 'analyzing' ? 'wait' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: voiceState === 'listening' ? '0 0 0 6px rgba(229,112,91,0.25)' : 'none',
      animation: voiceState === 'listening' ? 'micPulse 1.2s ease-in-out infinite' : 'none'
    }
  }, voiceState === 'analyzing' ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 8,
      border: `2px solid ${A_PAL.yellow}`,
      borderTopColor: 'transparent',
      animation: 'spin 0.8s linear infinite'
    }
  }) : AIcon.mic(voiceState === 'listening' ? '#fff' : A_PAL.yellow)), free && voiceState === 'idle' && /*#__PURE__*/React.createElement("button", {
    onClick: () => analyzeText(free),
    style: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      height: 28,
      padding: '0 10px',
      borderRadius: 14,
      border: 0,
      background: A_PAL.yellow,
      color: A_PAL.ink,
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, AIcon.sparkle(A_PAL.ink), " \u5206\u6790")), voiceState === 'listening' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 11,
      color: A_PAL.warn,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 3,
      background: A_PAL.warn,
      animation: 'micPulse 0.8s ease-in-out infinite'
    }
  }), "\u805E\u3044\u3066\u307E\u3059... \u3082\u3046\u4E00\u5EA6\u30BF\u30C3\u30D7\u3067\u505C\u6B62"), voiceState === 'analyzing' && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 11,
      color: A_PAL.inkSoft,
      fontWeight: 700
    }
  }, "AI\u3067\u5206\u6790\u4E2D... \u30BF\u30B0\u3092\u81EA\u52D5\u9078\u629E\u3057\u307E\u3059"), voiceError && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontSize: 11,
      color: A_PAL.warn
    }
  }, voiceError))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      bottom: 0,
      background: A_PAL.cream,
      padding: '14px 22px 28px',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      borderTop: `1px solid ${A_PAL.hairline}`
    }
  }, total > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    style: {
      height: 48,
      padding: '0 14px',
      borderRadius: 16,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      color: A_PAL.inkSoft,
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  }, "\u30AF\u30EA\u30A2"), /*#__PURE__*/React.createElement("button", {
    onClick: apply,
    style: {
      flex: 1,
      height: 48,
      border: 0,
      borderRadius: 16,
      background: A_PAL.black,
      color: A_PAL.yellow,
      fontSize: 14,
      fontWeight: 800,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6
    }
  }, AIcon.sparkle(A_PAL.yellow), total > 0 ? editScope === 'all' ? `この${total}件で全日再生成` : `${editingDay?.date}を${total}件で再生成` : editScope === 'all' ? '全日を再生成' : `${editingDay?.date}を再生成`))));
}

// ─────────── 買い物 手動追加シート ───────────
function AShoppingAddSheet({
  open,
  onClose,
  onAdd
}) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState('個');
  const [category, setCategory] = useState('野菜');
  useEffect(() => {
    if (open) {
      setName('');
      setAmount(1);
      setUnit('個');
      setCategory('野菜');
    }
  }, [open]);
  if (!open) return null;
  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({
      id: `s${Date.now()}`,
      name: name.trim(),
      amount: +amount || 1,
      unit,
      category,
      checked: false,
      auto: false
    });
  };
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(20,15,10,0.4)',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 51,
      background: A_PAL.cream,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: '88%',
      overflowY: 'auto',
      animation: 'slideUp .22s cubic-bezier(.2,.7,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      padding: '8px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: A_PAL.hairline
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 22px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 18,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, "\u8CB7\u3044\u7269\u306B\u8FFD\u52A0"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 28,
      height: 28,
      borderRadius: 14,
      border: 0,
      cursor: 'pointer',
      background: A_PAL.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.close(A_PAL.ink))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u54C1\u7269"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "\u4F8B: \u725B\u4E73",
    autoFocus: true,
    style: {
      width: '100%',
      height: 44,
      padding: '0 14px',
      borderRadius: 14,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      fontSize: 15,
      fontWeight: 600,
      color: A_PAL.ink,
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px 0',
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u6570\u91CF"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      height: 44,
      borderRadius: 14,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      padding: '0 6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAmount(v => Math.max(0, +(v - 1).toFixed(1))),
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: 0,
      background: A_PAL.cream,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.minus(A_PAL.ink)), /*#__PURE__*/React.createElement("input", {
    type: "number",
    step: "0.5",
    value: amount,
    onChange: e => setAmount(e.target.value),
    style: {
      flex: 1,
      height: '100%',
      border: 0,
      background: 'transparent',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 800,
      color: A_PAL.ink,
      outline: 'none',
      minWidth: 0
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAmount(v => +(+v + 1).toFixed(1)),
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      border: 0,
      background: A_PAL.yellow,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, AIcon.plus(A_PAL.ink)))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 110,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u5358\u4F4D"), /*#__PURE__*/React.createElement("select", {
    value: unit,
    onChange: e => setUnit(e.target.value),
    style: {
      width: '100%',
      height: 44,
      padding: '0 14px',
      borderRadius: 14,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      fontSize: 15,
      fontWeight: 600,
      color: A_PAL.ink,
      outline: 'none',
      appearance: 'none',
      WebkitAppearance: 'none',
      fontFamily: 'inherit'
    }
  }, A_UNITS.map(u => /*#__PURE__*/React.createElement("option", {
    key: u,
    value: u
  }, u))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 22px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: A_PAL.inkSub,
      fontWeight: 700,
      letterSpacing: 1,
      marginBottom: 6
    }
  }, "\u30AB\u30C6\u30B4\u30EA"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6
    }
  }, A_SHOP_CATS.map(c => {
    const active = c === category;
    return /*#__PURE__*/React.createElement("button", {
      key: c,
      onClick: () => setCategory(c),
      style: {
        height: 34,
        padding: '0 12px',
        borderRadius: 17,
        border: active ? 0 : `1px solid ${A_PAL.hairline}`,
        background: active ? A_PAL.black : A_PAL.card,
        color: active ? A_PAL.yellow : A_PAL.ink,
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }
    }, c);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 22px 28px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleAdd,
    disabled: !name.trim(),
    style: {
      width: '100%',
      height: 48,
      border: 0,
      borderRadius: 16,
      background: name.trim() ? A_PAL.black : '#A39E92',
      color: A_PAL.yellow,
      fontSize: 14,
      fontWeight: 800,
      cursor: name.trim() ? 'pointer' : 'not-allowed'
    }
  }, "\u30EA\u30B9\u30C8\u306B\u8FFD\u52A0"))));
}
function ASavedPlansSheet({
  open,
  savedPlans,
  recipes,
  onClose,
  onRestore,
  onDelete
}) {
  if (!open) return null;
  const formatDate = iso => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(20,15,10,0.45)',
      zIndex: 60,
      animation: 'fadeIn .15s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 61,
      background: A_PAL.cream,
      borderRadius: '26px 26px 0 0',
      padding: '18px 20px 28px',
      maxHeight: '76%',
      overflowY: 'auto',
      boxShadow: '0 -14px 34px rgba(0,0,0,0.22)',
      animation: 'slideUp .2s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: A_PAL.inkSub,
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: 1
    }
  }, "SAVED PLANS"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '2px 0 0',
      fontSize: 20,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, "\u732E\u7ACB\u4FDD\u5B58\u5C65\u6B74")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 34,
      height: 34,
      borderRadius: 17,
      border: 0,
      background: A_PAL.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, AIcon.close(A_PAL.ink))), savedPlans.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 18,
      padding: '28px 16px',
      textAlign: 'center',
      color: A_PAL.inkSub,
      fontSize: 13
    }
  }, "\u307E\u3060\u4FDD\u5B58\u3055\u308C\u305F\u732E\u7ACB\u306F\u3042\u308A\u307E\u305B\u3093\u3002", /*#__PURE__*/React.createElement("br", null), "\u732E\u7ACB\u753B\u9762\u306E\u300C\u732E\u7ACB\u3092\u4FDD\u5B58\u300D\u304B\u3089\u6B8B\u305B\u307E\u3059\u3002"), savedPlans.map(plan => {
    const first = plan.mealPlan?.[0]?.recipes?.[0];
    const firstName = recipes[first]?.name || '献立';
    const count = plan.mealPlan?.reduce((sum, day) => sum + (day.recipes?.length || 0), 0) || 0;
    return /*#__PURE__*/React.createElement("div", {
      key: plan.id,
      style: {
        background: A_PAL.card,
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        border: `1px solid ${A_PAL.hairline}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 12,
        background: A_PAL.yellow,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, AIcon.meal(A_PAL.ink)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 800,
        color: A_PAL.ink,
        lineHeight: 1.25
      }
    }, plan.title || firstName), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontSize: 11,
        color: A_PAL.inkSub,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, formatDate(plan.createdAt), " \xB7 ", count, "\u54C1 \xB7 ", firstName))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onRestore(plan.id),
      style: {
        flex: 1,
        height: 38,
        borderRadius: 14,
        border: 0,
        background: A_PAL.black,
        color: A_PAL.yellow,
        fontSize: 12,
        fontWeight: 800,
        cursor: 'pointer'
      }
    }, "\u3053\u306E\u732E\u7ACB\u306B\u623B\u3059"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onDelete(plan.id),
      style: {
        width: 42,
        height: 38,
        borderRadius: 14,
        border: `1px solid ${A_PAL.hairline}`,
        background: A_PAL.card,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, AIcon.trash(A_PAL.warn))));
  })));
}
function ABackupSheet({
  open,
  backupText,
  setBackupText,
  onRefresh,
  onRestore,
  onClose
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(20,15,10,0.45)',
      zIndex: 60,
      animation: 'fadeIn .15s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 61,
      background: A_PAL.cream,
      borderRadius: '26px 26px 0 0',
      padding: '18px 20px 28px',
      maxHeight: '78%',
      overflowY: 'auto',
      boxShadow: '0 -14px 34px rgba(0,0,0,0.22)',
      animation: 'slideUp .2s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: A_PAL.inkSub,
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: 1
    }
  }, "BACKUP"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '2px 0 0',
      fontSize: 20,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, "\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7 / \u5FA9\u5143")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 34,
      height: 34,
      borderRadius: 17,
      border: 0,
      background: A_PAL.card,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, AIcon.close(A_PAL.ink))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: A_PAL.card,
      borderRadius: 18,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: A_PAL.inkSoft,
      lineHeight: 1.55,
      marginBottom: 10
    }
  }, "\u3053\u306E\u67A0\u306E\u5185\u5BB9\u3092\u63A7\u3048\u3066\u304A\u304F\u3068\u3001\u5225\u30D6\u30E9\u30A6\u30B6\u3084\u30EA\u30BB\u30C3\u30C8\u5F8C\u306B\u8CBC\u308A\u4ED8\u3051\u3066\u5FA9\u5143\u3067\u304D\u307E\u3059\u3002"), /*#__PURE__*/React.createElement("textarea", {
    value: backupText,
    onChange: e => setBackupText(e.target.value),
    style: {
      width: '100%',
      minHeight: 210,
      border: `1px solid ${A_PAL.hairline}`,
      borderRadius: 14,
      background: A_PAL.cream,
      padding: 12,
      color: A_PAL.ink,
      fontSize: 12,
      lineHeight: 1.5,
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onRefresh,
    style: {
      height: 44,
      borderRadius: 14,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      color: A_PAL.ink,
      fontSize: 13,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, "\u6700\u65B0\u30C7\u30FC\u30BF\u3092\u8868\u793A"), /*#__PURE__*/React.createElement("button", {
    onClick: onRestore,
    style: {
      height: 44,
      borderRadius: 14,
      border: 0,
      background: A_PAL.black,
      color: A_PAL.yellow,
      fontSize: 13,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, "\u8CBC\u308A\u4ED8\u3051\u5185\u5BB9\u3067\u5FA9\u5143"))));
}

// ─────────── 確認モーダル ───────────
function AConfirmModal({
  open,
  title,
  message,
  confirmLabel = '削除する',
  danger = true,
  onCancel,
  onConfirm
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement(Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onCancel,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(20,15,10,0.55)',
      zIndex: 60,
      animation: 'fadeIn .15s ease'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '50%',
      left: 24,
      right: 24,
      zIndex: 61,
      transform: 'translateY(-50%)',
      background: A_PAL.cream,
      borderRadius: 22,
      padding: '22px 22px 18px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
      animation: 'fadeIn .15s ease'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 17,
      fontWeight: 800,
      color: A_PAL.ink
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 13,
      color: A_PAL.inkSoft,
      lineHeight: 1.55
    }
  }, message), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      flex: 1,
      height: 44,
      borderRadius: 14,
      border: `1px solid ${A_PAL.hairline}`,
      background: A_PAL.card,
      color: A_PAL.ink,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "\u30AD\u30E3\u30F3\u30BB\u30EB"), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    style: {
      flex: 1,
      height: 44,
      borderRadius: 14,
      border: 0,
      background: danger ? A_PAL.warn : A_PAL.black,
      color: '#fff',
      fontSize: 13,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, confirmLabel))));
}

// ─────────── レシピ選択ロジック ───────────
function includesListedIngredient(recipe, list) {
  if (!list || list.length === 0) return false;
  return list.some(name => {
    const t = String(name || '').trim();
    if (!t) return false;
    return recipe.ingredients.some(i => i.name === t || i.name.includes(t) || t.includes(i.name));
  });
}
function isFavoriteRecipe(recipe, list) {
  if (!list || list.length === 0) return false;
  return list.some(name => {
    const t = String(name || '').trim();
    return t && (recipe.name === t || recipe.name.includes(t) || t.includes(recipe.name));
  });
}
function requestDesiredTerms(request) {
  const terms = [];
  (request?.mood || []).forEach(t => terms.push(t));
  if (request?.free) {
    const normalized = String(request.free).replace(/今日は|今日|今夜は|今夜|夕食は|夕飯は|晩ごはんは|ご飯は/g, '').replace(/が食べたい|を食べたい|も食べたい|食べたい|がいい|もいい|でもいい|でいい|にしたい|希望|お願い|作りたい/g, ' ').replace(/っぽい|みたいな/g, ' ');
    normalized.split(/[、,\s。！？!?.「」『』・／/]+/).map(t => t.trim()).filter(t => t.length >= 2).forEach(t => terms.push(t));
  }
  return Array.from(new Set(terms.map(t => String(t || '').trim()).filter(Boolean)));
}
function termMatchesRecipe(recipe, term) {
  const t = String(term || '').trim();
  if (!t) return false;
  if (recipe.name.includes(t) || t.includes(recipe.name)) return true;
  if ((recipe.tags || []).some(tag => tag.includes(t) || t.includes(tag))) return true;
  return recipe.ingredients.some(i => i.name.includes(t) || t.includes(i.name));
}
function desiredRecipeScore(recipe, request) {
  let score = 0;
  requestDesiredTerms(request).forEach(t => {
    if (recipe.name === t || recipe.name.includes(t) || t.includes(recipe.name)) score += 30;else if (termMatchesRecipe(recipe, t)) score += 10;
  });
  return score;
}
function matchingDesiredTerms(recipe, request) {
  return requestDesiredTerms(request).filter(t => termMatchesRecipe(recipe, t));
}
function bestDesiredRole(request, recipes, recipeIds) {
  const terms = requestDesiredTerms(request);
  if (terms.length === 0) return null;
  const best = recipeIds.map(id => ({
    id,
    recipe: recipes[id],
    score: desiredRecipeScore(recipes[id], request)
  })).filter(x => x.score > 0).sort((a, b) => b.score - a.score)[0];
  return best ? best.recipe.role : null;
}
function scoreRecipe(recipe, request, settings) {
  if (includesListedIngredient(recipe, settings?.allergyIngredients)) return -9999;
  if (includesListedIngredient(recipe, settings?.avoidIngredients)) return -9999;
  if (settings?.maxTime && recipe.time > settings.maxTime) return -9999;
  if (!request) request = {};
  let score = 0;
  if (settings?.preferEasy) score += Math.max(0, 35 - recipe.time) / 5;
  if (settings?.preferFrequentRecipes && recipe.tag !== 'たまに') score += 1.5;
  if (isFavoriteRecipe(recipe, settings?.favoriteRecipeNames)) score += 8;
  score += desiredRecipeScore(recipe, request);
  // ジャンル
  if (request.cuisine && request.cuisine.length > 0) {
    const cMatch = request.cuisine.some(c => c.startsWith(recipe.cuisine));
    if (cMatch) score += 3;
  }
  // タイプ
  if (request.type && request.type.length > 0) {
    request.type.forEach(t => {
      if ((recipe.tags || []).includes(t)) score += 3;
    });
  }
  // 雰囲気
  if (request.feel && request.feel.length > 0) {
    request.feel.forEach(f => {
      if ((recipe.tags || []).includes(f)) score += 2;
    });
  }
  // 今日の気分（自由タグ）— レシピ名やタグに部分一致
  if (request.mood && request.mood.length > 0) {
    request.mood.forEach(m => {
      const t = m.trim();
      if (!t) return;
      if (recipe.name.includes(t)) score += 6;else if ((recipe.tags || []).some(tag => tag.includes(t) || t.includes(tag))) score += 4;
    });
  }
  return score;
}
const KONMEMO_STORAGE_KEY = 'konmemo4:a:v1';
function loadKonmemoState() {
  try {
    const raw = localStorage.getItem(KONMEMO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
}
function saveKonmemoState(state) {
  try {
    localStorage.setItem(KONMEMO_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // 容量上限などで保存できない場合も、画面操作は継続する。
  }
}
function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}
function fridgeCategoryFromShopping(item) {
  const name = item.name || '';
  if (item.category === '野菜') return '野菜';
  if (item.category === '乳製品' || /卵|牛乳|チーズ|ヨーグルト|バター/.test(name)) return '卵・乳製品';
  if (/魚|鮭|さば|鯖|たら|ぶり|まぐろ|あじ|えび|いか/.test(name)) return '魚';
  if (item.category === '肉・魚' || /肉|鶏|豚|牛|ひき肉|ベーコン|ハム/.test(name)) return '肉';
  return 'その他';
}
function daysLeftFromShopping(item) {
  if (item.category === '肉・魚') return 3;
  if (item.category === '乳製品') return 5;
  if (item.category === '野菜') return 6;
  return 14;
}
function shoppingCategoryFromIngredient(name) {
  if (/鶏|豚|牛|肉|ベーコン|ハム|鮭|さば|鯖|たら|ぶり|まぐろ|あじ|えび|いか|魚/.test(name)) return '肉・魚';
  if (/卵|牛乳|チーズ|ヨーグルト|バター|生クリーム/.test(name)) return '乳製品';
  if (/醤油|しょうゆ|味噌|みそ|砂糖|塩|酢|油|だし|ソース|ケチャップ|マヨネーズ|カレー粉|コンソメ/.test(name)) return '調味料';
  if (/米|麺|パスタ|スパゲティ|うどん|そば|パン|小麦粉|片栗粉|豆腐|わかめ|海苔|ごま/.test(name)) return '乾物';
  if (/玉ねぎ|人参|にんじん|キャベツ|トマト|ピーマン|じゃがいも|きゅうり|ほうれん草|小松菜|長ねぎ|もやし|大根|なす|きのこ|しいたけ|しめじ|レタス|白菜|野菜/.test(name)) return '野菜';
  return 'その他';
}
function initialSettings(storedSettings) {
  return {
    ...window.KM_DATA.settings,
    startWeekday: '金',
    ...(storedSettings || {})
  };
}

// ─────────── メイン ───────────
function VariantA() {
  const stored = useMemo(loadKonmemoState, []);
  const [tab, setTab] = useState('home');
  const [fridge, setFridge] = useState(stored.fridge || window.KM_DATA.fridge);
  const [shopping, setShopping] = useState(stored.shopping || window.KM_DATA.shopping);
  const [mealPlan, setMealPlan] = useState(stored.mealPlan || window.KM_DATA.mealPlan);
  const [settings, setSettings] = useState(initialSettings(stored.settings));
  const [openedRecipe, setOpenedRecipe] = useState(null);
  const [fridgeEditOpen, setFridgeEditOpen] = useState(false);
  const [fridgeEditing, setFridgeEditing] = useState(null);
  const [requestScope, setRequestScope] = useState(null); // null = closed, 'all' or dayId
  const [requestsByScope, setRequestsByScope] = useState(stored.requestsByScope || {
    all: {
      cuisine: [],
      type: [],
      feel: [],
      mood: [],
      useIngredients: [],
      free: ''
    }
    // d1/d2/d3 keys only present when user sets per-day override
  });
  const [shopAddOpen, setShopAddOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [savedPlansOpen, setSavedPlansOpen] = useState(false);
  const [savedPlans, setSavedPlans] = useState(stored.savedPlans || []);
  const [backupOpen, setBackupOpen] = useState(false);
  const [backupText, setBackupText] = useState('');
  const recipes = window.KM_DATA.recipes;
  const recipeIds = useMemo(() => Object.keys(recipes), [recipes]);
  const appStats = useMemo(() => {
    const base = {
      main: 0,
      side: 0,
      soup: 0,
      ingredients: 0
    };
    Object.values(recipes).forEach(recipe => {
      if (base[recipe.role] != null) base[recipe.role] += 1;
    });
    base.ingredients = Object.keys(window.KM_DATA.ingredientData?.units || {}).length;
    return base;
  }, [recipes]);
  useEffect(() => {
    saveKonmemoState({
      fridge,
      shopping,
      mealPlan,
      settings,
      requestsByScope,
      savedPlans
    });
  }, [fridge, shopping, mealPlan, settings, requestsByScope, savedPlans]);
  useEffect(() => {
    const grouped = {};
    mealPlan.forEach(day => {
      (day.recipes || []).forEach(rid => {
        const recipe = recipes[rid];
        if (!recipe) return;
        recipe.ingredients.forEach(ing => {
          if (ing.have) return;
          const category = shoppingCategoryFromIngredient(ing.name);
          const key = `${category}|${ing.name}|${ing.unit}`;
          const amount = +(ing.amount * settings.people / 2).toFixed(2);
          if (!grouped[key]) {
            grouped[key] = {
              id: `auto-${category}-${ing.name}-${ing.unit}`.replace(/\s+/g, '-'),
              name: ing.name,
              category,
              amount: 0,
              unit: ing.unit,
              checked: false,
              auto: true
            };
          }
          grouped[key].amount = +(grouped[key].amount + amount).toFixed(2);
        });
      });
    });
    setShopping(prev => {
      const previousByKey = {};
      prev.forEach(item => {
        previousByKey[`${item.category}|${item.name}|${item.unit}`] = item;
      });
      const autoItems = Object.values(grouped).map(item => {
        const previous = previousByKey[`${item.category}|${item.name}|${item.unit}`];
        return {
          ...item,
          checked: previous?.checked || false
        };
      });
      const manualItems = prev.filter(item => !item.auto);
      return [...autoItems, ...manualItems];
    });
  }, [mealPlan, settings.people, recipes]);

  // fridge ops
  const openFridgeEditor = item => {
    setFridgeEditing(item);
    setFridgeEditOpen(true);
  };
  const closeFridgeEditor = () => {
    setFridgeEditOpen(false);
    setFridgeEditing(null);
  };
  const saveFridge = item => {
    setFridge(prev => {
      const idx = prev.findIndex(f => f.id === item.id);
      if (idx === -1) return [...prev, item];
      const next = [...prev];
      next[idx] = item;
      return next;
    });
    closeFridgeEditor();
  };
  const deleteFridge = id => {
    setFridge(prev => prev.filter(f => f.id !== id));
    closeFridgeEditor();
  };

  // shopping ops
  const addShopping = item => {
    setShopping(prev => [...prev, item]);
    setShopAddOpen(false);
  };
  const clearDoneShopping = () => {
    setShopping(prev => prev.filter(s => !s.checked));
    setConfirmClearOpen(false);
  };
  const saveCurrentPlan = () => {
    const now = new Date();
    const title = `${now.getMonth() + 1}/${now.getDate()}の献立`;
    const saved = {
      id: `plan-${Date.now()}`,
      title,
      createdAt: now.toISOString(),
      mealPlan: cloneData(mealPlan),
      shopping: cloneData(shopping)
    };
    setSavedPlans(prev => [saved, ...prev].slice(0, 20));
    setSavedPlansOpen(true);
  };
  const restoreSavedPlan = id => {
    const plan = savedPlans.find(p => p.id === id);
    if (!plan) return;
    setMealPlan(cloneData(plan.mealPlan || []));
    if (plan.shopping) setShopping(cloneData(plan.shopping));
    setSavedPlansOpen(false);
    setTab('meal');
  };
  const deleteSavedPlan = id => {
    setSavedPlans(prev => prev.filter(p => p.id !== id));
  };
  const isFavoriteRecipeName = name => (settings.favoriteRecipeNames || []).includes(name);
  const toggleFavoriteRecipe = name => {
    setSettings(prev => {
      const list = prev.favoriteRecipeNames || [];
      const next = list.includes(name) ? list.filter(n => n !== name) : [...list, name];
      return {
        ...prev,
        favoriteRecipeNames: next
      };
    });
  };
  const addCarryOverToFridge = () => {
    const latest = savedPlans[0];
    const latestChecked = (latest?.shopping || []).filter(item => item.checked);
    const currentChecked = shopping.filter(item => item.checked);
    const checked = latestChecked.length > 0 ? latestChecked : currentChecked;
    if (checked.length === 0) {
      window.alert('前回のチェック済み買い物がありません。買い物リストでチェックしてから使えます。');
      return;
    }
    const carry = checked.map(item => ({
      id: `carry-${Date.now()}-${item.id}`,
      name: item.name,
      category: fridgeCategoryFromShopping(item),
      amount: item.amount,
      unit: item.unit,
      daysLeft: daysLeftFromShopping(item)
    }));
    setFridge(prev => [...prev, ...carry]);
    setTab('fridge');
  };
  const backupPayload = () => JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    fridge,
    shopping,
    mealPlan,
    settings,
    requestsByScope,
    savedPlans
  }, null, 2);
  const openBackup = () => {
    setBackupText(backupPayload());
    setBackupOpen(true);
  };
  const restoreBackup = () => {
    try {
      const parsed = JSON.parse(backupText);
      if (!parsed || !Array.isArray(parsed.fridge) || !Array.isArray(parsed.shopping) || !Array.isArray(parsed.mealPlan)) {
        window.alert('復元データの形式が違います。バックアップ全文を貼り付けてください。');
        return;
      }
      setFridge(parsed.fridge);
      setShopping(parsed.shopping);
      setMealPlan(parsed.mealPlan);
      setSettings(initialSettings(parsed.settings));
      setRequestsByScope(parsed.requestsByScope || {
        all: {
          cuisine: [],
          type: [],
          feel: [],
          mood: [],
          useIngredients: [],
          free: ''
        }
      });
      setSavedPlans(parsed.savedPlans || []);
      setBackupOpen(false);
      window.alert('復元しました。');
    } catch (err) {
      window.alert('JSONを読み取れませんでした。貼り付け内容を確認してください。');
    }
  };
  const resetData = () => {
    if (!window.confirm('保存データをリセットしますか？献立履歴、買い物チェック、冷蔵庫の編集内容が初期状態に戻ります。')) return;
    localStorage.removeItem(KONMEMO_STORAGE_KEY);
    setFridge(cloneData(window.KM_DATA.fridge));
    setShopping(cloneData(window.KM_DATA.shopping));
    setMealPlan(cloneData(window.KM_DATA.mealPlan));
    setSettings(initialSettings());
    setRequestsByScope({
      all: {
        cuisine: [],
        type: [],
        feel: [],
        mood: [],
        useIngredients: [],
        free: ''
      }
    });
    setSavedPlans([]);
    setTab('home');
  };

  // effective request for a given day (override or global)
  const effectiveRequest = dayId => requestsByScope[dayId] || requestsByScope.all;

  // レシピ選択 — dayId指定で全体・日リクエストを使い分ける
  const pickRecipeFor = (role, exclude, req, desiredUsedTerms = []) => {
    const pool = recipeIds.filter(id => recipes[id].role === role && !exclude.includes(id) && !matchingDesiredTerms(recipes[id], req).some(t => desiredUsedTerms.includes(t)));
    if (pool.length === 0) {
      const all = recipeIds.filter(id => recipes[id].role === role);
      return all[Math.floor(Math.random() * all.length)];
    }
    const scored = pool.map(id => ({
      id,
      desired: desiredRecipeScore(recipes[id], req),
      score: scoreRecipe(recipes[id], req, settings) + Math.random() * 0.5
    })).filter(x => x.score > -9990);
    if (scored.length === 0) return pool[Math.floor(Math.random() * pool.length)];
    const desired = scored.filter(x => x.desired > 0).sort((a, b) => b.desired - a.desired || b.score - a.score);
    if (desired.length > 0) {
      matchingDesiredTerms(recipes[desired[0].id], req).forEach(t => {
        if (!desiredUsedTerms.includes(t)) desiredUsedTerms.push(t);
      });
      return desired[0].id;
    }
    scored.sort((a, b) => b.score - a.score);
    const topN = Math.max(1, Math.min(8, Math.floor(scored.length * 0.12)));
    const top = scored.slice(0, topN);
    return top[Math.floor(Math.random() * top.length)].id;
  };
  const pickRecipe = (role, exclude = [], dayId, desiredUsedTerms = []) => pickRecipeFor(role, exclude, effectiveRequest(dayId), desiredUsedTerms);
  // 日付ヘルパー（基準日: 5/22 木）
  const BASE_DATE = useMemo(() => new Date(2026, 4, 22), []);
  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
  const dayInfoAt = offset => {
    const d = new Date(BASE_DATE);
    d.setDate(d.getDate() + offset);
    const m = d.getMonth() + 1;
    const dd = d.getDate();
    const startIndex = Math.max(0, WEEKDAYS.indexOf(settings.startWeekday || '金'));
    const wd = WEEKDAYS[(startIndex + offset) % 7];
    return {
      id: `d${offset + 1}`,
      date: `${m}/${dd}`,
      label: offset === 0 ? `今日 (${wd})` : offset === 1 ? `明日 (${wd})` : `${wd}曜日`
    };
  };
  useEffect(() => {
    setMealPlan(prev => prev.map((day, i) => {
      const info = dayInfoAt(i);
      return {
        ...day,
        date: info.date,
        label: info.label
      };
    }));
  }, [settings.startWeekday]);
  const regenDay = dayId => {
    setMealPlan(prev => prev.map(d => {
      if (d.id !== dayId) return d;
      const roles = d.recipes.map(rid => recipes[rid].role);
      const used = [];
      const desiredUsedTerms = [];
      const newRecipes = roles.map(role => {
        const next = pickRecipe(role, used, dayId, desiredUsedTerms);
        used.push(next);
        return next;
      });
      return {
        ...d,
        recipes: newRecipes
      };
    }));
  };
  // 全日再生成 — settings.days まで自動拡張・縮小
  const regenAll = () => {
    setMealPlan(prev => {
      const target = Math.max(1, settings.days);
      const result = [];
      const desiredUsedTerms = [];
      for (let i = 0; i < target; i++) {
        const existing = prev[i];
        const info = dayInfoAt(i);
        const id = existing?.id || info.id;
        // 既存があれば構成（roles）を維持、なければ main+side+soup の3品で初期化
        const roles = existing && existing.recipes.length > 0 ? existing.recipes.map(rid => recipes[rid].role) : ['main', 'side', 'soup'];
        const used = [];
        const newRecipes = roles.map(role => {
          const next = pickRecipe(role, used, id, desiredUsedTerms);
          used.push(next);
          return next;
        });
        result.push({
          id,
          date: existing?.date || info.date,
          label: existing?.label || info.label,
          recipes: newRecipes
        });
      }
      return result;
    });
  };
  const addRecipe = (dayId, role) => {
    setMealPlan(prev => prev.map(d => {
      if (d.id !== dayId) return d;
      const next = pickRecipe(role, d.recipes, dayId, []);
      return {
        ...d,
        recipes: [...d.recipes, next]
      };
    }));
  };
  const removeRecipe = (dayId, ri) => {
    setMealPlan(prev => prev.map(d => {
      if (d.id !== dayId) return d;
      const next = [...d.recipes];
      next.splice(ri, 1);
      return {
        ...d,
        recipes: next
      };
    }));
  };
  const swapRecipe = (dayId, ri) => {
    setMealPlan(prev => prev.map(d => {
      if (d.id !== dayId) return d;
      const role = recipes[d.recipes[ri]].role;
      const replacement = pickRecipe(role, d.recipes, dayId, []);
      const next = [...d.recipes];
      next[ri] = replacement;
      return {
        ...d,
        recipes: next
      };
    }));
  };

  // シートにスコープを渡して開く
  const openRequest = (scope = 'all') => setRequestScope(scope);
  const closeRequest = () => setRequestScope(null);
  const clearDayRequest = dayId => {
    setRequestsByScope(prev => {
      const next = {
        ...prev
      };
      delete next[dayId];
      return next;
    });
  };

  // シートから適用 — 'all' のときは settings.days に拡張、特定日のときは1日のみ
  const applyRequest = (scope, req) => {
    const newByScope = {
      ...requestsByScope,
      [scope]: req
    };
    setRequestsByScope(newByScope);
    setRequestScope(null);
    setTimeout(() => {
      const reqFor = dayId => newByScope[dayId] || newByScope.all;
      const desiredUsedTerms = [];
      const regenRecipesFor = (roles, dayId) => {
        const used = [];
        const eff = reqFor(dayId);
        return roles.map(role => {
          const pool = recipeIds.filter(id => recipes[id].role === role && !used.includes(id) && !matchingDesiredTerms(recipes[id], eff).some(t => desiredUsedTerms.includes(t)));
          if (pool.length === 0) {
            const all = recipeIds.filter(id => recipes[id].role === role);
            const r = all[Math.floor(Math.random() * all.length)];
            used.push(r);
            return r;
          }
          const scored = pool.map(id => ({
            id,
            desired: desiredRecipeScore(recipes[id], eff),
            score: scoreRecipe(recipes[id], eff, settings) + Math.random() * 0.5
          })).filter(x => x.score > -9990);
          if (scored.length === 0) {
            const choice = pool[Math.floor(Math.random() * pool.length)];
            used.push(choice);
            return choice;
          }
          const desired = scored.filter(x => x.desired > 0).sort((a, b) => b.desired - a.desired || b.score - a.score);
          if (desired.length > 0) {
            const choice = desired[0].id;
            used.push(choice);
            matchingDesiredTerms(recipes[choice], eff).forEach(t => {
              if (!desiredUsedTerms.includes(t)) desiredUsedTerms.push(t);
            });
            return choice;
          }
          scored.sort((a, b) => b.score - a.score);
          const topN = Math.max(1, Math.min(8, Math.floor(scored.length * 0.12)));
          const top = scored.slice(0, topN);
          const choice = top[Math.floor(Math.random() * top.length)].id;
          used.push(choice);
          return choice;
        });
      };
      setMealPlan(prev => {
        if (scope !== 'all') {
          // 特定日のみ再生成
          return prev.map(d => {
            if (d.id !== scope) return d;
            const roles = d.recipes.map(rid => recipes[rid].role);
            return {
              ...d,
              recipes: regenRecipesFor(roles, d.id)
            };
          });
        }
        // 全日: settings.days まで拡張・縮小
        const target = Math.max(1, settings.days);
        const result = [];
        for (let i = 0; i < target; i++) {
          const existing = prev[i];
          const info = dayInfoAt(i);
          const id = existing?.id || info.id;
          const roles = existing && existing.recipes.length > 0 ? existing.recipes.map(rid => recipes[rid].role) : ['main', 'side', 'soup'];
          result.push({
            id,
            date: existing?.date || info.date,
            label: existing?.label || info.label,
            recipes: regenRecipesFor(roles, id)
          });
        }
        return result;
      });
    }, 0);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      paddingTop: 62,
      background: A_PAL.cream,
      fontFamily: '-apple-system, "Hiragino Sans", system-ui, sans-serif',
      color: A_PAL.ink,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 62,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto'
    }
  }, tab === 'home' && /*#__PURE__*/React.createElement(AHome, {
    data: window.KM_DATA,
    fridge: fridge,
    shopping: shopping,
    mealPlan: mealPlan,
    recipes: recipes,
    setTab: setTab,
    openRecipe: setOpenedRecipe
  }), tab === 'fridge' && /*#__PURE__*/React.createElement(AFridge, {
    fridge: fridge,
    setFridge: setFridge,
    openEditor: openFridgeEditor,
    onCarryOver: addCarryOverToFridge
  }), tab === 'meal' && /*#__PURE__*/React.createElement(AMeal, {
    mealPlan: mealPlan,
    recipes: recipes,
    openRecipe: setOpenedRecipe,
    regenDay: regenDay,
    regenAll: regenAll,
    addRecipe: addRecipe,
    removeRecipe: removeRecipe,
    swapRecipe: swapRecipe,
    openRequest: openRequest,
    clearDayRequest: clearDayRequest,
    requestsByScope: requestsByScope,
    isFavoriteRecipeName: isFavoriteRecipeName,
    toggleFavoriteRecipe: toggleFavoriteRecipe
  }), tab === 'shopping' && /*#__PURE__*/React.createElement(AShopping, {
    shopping: shopping,
    setShopping: setShopping,
    openAdd: () => setShopAddOpen(true),
    openConfirmClear: () => setConfirmClearOpen(true)
  }), tab === 'settings' && /*#__PURE__*/React.createElement(ASettings, {
    settings: settings,
    setSettings: setSettings,
    stats: appStats,
    appVersion: APP_VERSION,
    openBackup: openBackup,
    onResetData: resetData
  })), tab === 'fridge' && /*#__PURE__*/React.createElement(AFridgeFloatingActions, {
    onCarryOver: addCarryOverToFridge,
    openEditor: openFridgeEditor
  }), /*#__PURE__*/React.createElement(ATabBar, {
    tab: tab,
    setTab: setTab
  }), /*#__PURE__*/React.createElement(ARecipeSheet, {
    recipeId: openedRecipe,
    recipes: recipes,
    settings: settings,
    isFavoriteRecipeName: isFavoriteRecipeName,
    toggleFavoriteRecipe: toggleFavoriteRecipe,
    onClose: () => setOpenedRecipe(null)
  }), /*#__PURE__*/React.createElement(AFridgeEditor, {
    open: fridgeEditOpen,
    initial: fridgeEditing,
    onClose: closeFridgeEditor,
    onSave: saveFridge,
    onDelete: deleteFridge
  }), /*#__PURE__*/React.createElement(AMealRequestSheet, {
    scope: requestScope,
    mealPlan: mealPlan,
    requestsByScope: requestsByScope,
    fridge: fridge,
    onClose: closeRequest,
    onApply: applyRequest,
    onClearScope: clearDayRequest
  }), /*#__PURE__*/React.createElement(AShoppingAddSheet, {
    open: shopAddOpen,
    onClose: () => setShopAddOpen(false),
    onAdd: addShopping
  }), /*#__PURE__*/React.createElement(ASavedPlansSheet, {
    open: savedPlansOpen,
    savedPlans: savedPlans,
    recipes: recipes,
    onClose: () => setSavedPlansOpen(false),
    onRestore: restoreSavedPlan,
    onDelete: deleteSavedPlan
  }), /*#__PURE__*/React.createElement(ABackupSheet, {
    open: backupOpen,
    backupText: backupText,
    setBackupText: setBackupText,
    onRefresh: () => setBackupText(backupPayload()),
    onRestore: restoreBackup,
    onClose: () => setBackupOpen(false)
  }), /*#__PURE__*/React.createElement(AConfirmModal, {
    open: confirmClearOpen,
    title: "\u30C1\u30A7\u30C3\u30AF\u6E08\u307F\u3092\u6D88\u3057\u307E\u3059\u304B\uFF1F",
    message: `チェックをつけた ${shopping.filter(s => s.checked).length} 品をリストから削除します。この操作は取り消せません。`,
    confirmLabel: "\u524A\u9664\u3059\u308B",
    onCancel: () => setConfirmClearOpen(false),
    onConfirm: clearDoneShopping
  }));
}
window.VariantA = VariantA;