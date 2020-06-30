import { Platform } from 'react-native';

function lineHeight(fontSize) {
    const multiplier = (fontSize > 20) ? 0.1 : 0.33;
    return parseInt(fontSize + (fontSize * multiplier), 10);
}

const base = {
  fontSize: 12,
  lineHeight: lineHeight(12),
  ...Platform.select({
    ios: {
      fontFamily: "Regular"
    },
    android: {
        fontFamily: "Montserrat_Regular"
    }
  })
};

export default {
    base: { ...base },
    h1: { ...base, fontSize: base.fontSize * 1.75, lineHeight: lineHeight(base.fontSize * 2) },
    h2: { ...base, fontSize: base.fontSize * 1.5, lineHeight: lineHeight(base.fontSize * 1.5) },
    h3: { ...base, fontSize: base.fontSize * 1.25, lineHeight: lineHeight(base.fontSize * 1.25) },
    h4: { ...base, fontSize: base.fontSize * 1.1, lineHeight: lineHeight(base.fontSize * 1.1) },
    h5: { ...base },
    h6: {...base,fontSize: base.fontSize * 0.7, lineHeight: lineHeight(base.fontSize * 0.7) },
    base_bold: { ...base, fontFamily: "serif" },
    h1_bold: { ...base, fontFamily: "Montserrat_Bold", fontSize: base.fontSize * 1.75, lineHeight: lineHeight(base.fontSize * 2) },
    h2_bold: { ...base, fontFamily: "Montserrat_Regular", fontSize: base.fontSize * 1.5, lineHeight: lineHeight(base.fontSize * 1.75) },
    h3_bold: { ...base, fontFamily: "Montserrat_Regular", fontSize: base.fontSize * 1.25, lineHeight: lineHeight(base.fontSize * 1.5) },
    h4_bold: { ...base, fontFamily: "Montserrat_Regular", fontSize: base.fontSize * 1.1, lineHeight: lineHeight(base.fontSize * 1.25) },
    h5_bold: { ...base, fontFamily: "Montserrat_Regular", fontSize: base.fontSize * 0.9, lineHeight: lineHeight(base.fontSize * 0.9)},
    h1bold: { ...base, fontFamily: "Montserrat_Bold", fontSize: base.fontSize * 1.75, lineHeight: lineHeight(base.fontSize * 2) },
    h2bold: { ...base, fontFamily: "Montserrat_Bold", fontSize: base.fontSize * 1.5, lineHeight: lineHeight(base.fontSize * 1.75) },
    h3bold: { ...base, fontFamily: "Montserrat_Bold", fontSize: base.fontSize * 1.25, lineHeight: lineHeight(base.fontSize * 1.5) },
    h4bold: { ...base, fontFamily: "Montserrat_Bold", fontSize: base.fontSize * 1.1, lineHeight: lineHeight(base.fontSize * 1.25) },
    h5bold: { ...base, fontFamily: "Montserrat_Bold", fontSize: base.fontSize * 0.9, lineHeight: lineHeight(base.fontSize * 0.9)},

    h1_light: { ...base, fontFamily: "Montserrat_Light", fontSize: base.fontSize * 1.75, lineHeight: lineHeight(base.fontSize * 2) },
    h2_light: { ...base, fontFamily: "Montserrat_Light", fontSize: base.fontSize * 1.5, lineHeight: lineHeight(base.fontSize * 1.75) },
    h3_light: { ...base, fontFamily: "Montserrat_Light", fontSize: base.fontSize * 1.25, lineHeight: lineHeight(base.fontSize * 1.5) },
    h4_light: { ...base, fontFamily: "Montserrat_Light", fontSize: base.fontSize * 1.1, lineHeight: lineHeight(base.fontSize * 1.25) },
    h5_light: { ...base, fontFamily: "Montserrat_Light", fontSize: base.fontSize * 0.9, lineHeight: lineHeight(base.fontSize * 0.9)},


  };
