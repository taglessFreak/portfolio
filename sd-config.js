// clean: style-dictionary clean --config ./sd.config.js
// build: style-dictionary build --config ./sd.config.js

function isReferencedValue(token) {
  try {
    return token.value.toString().charAt(0) === "$";
  } catch {
    return false;
  }
}

function isType(token, type) {
  return token.original.type === type;
}

// String Modifiers
function removeDollarSignAtCharZero(value) {
  if (value.indexOf("$") === 0) {
    return value.substr(1, value.length);
  }
  return value;
}

function wrapValueWithDoubleQuote(value) {
  return `"${value}"`;
}

function wrapValueWithBraces(value) {
  return `{${value}}`;
}

module.exports = {
  source: [`tokens/**/*.json`],
  transform: {
    "fontFamily/literal": {
      type: "value",
      transitive: false,
      matcher: (token) => {
        return isType(token, "fontFamilies");
      },
      transformer: (token) => {
        return wrapValueWithDoubleQuote(token.value);
      },
    },
    "referencedValue/object": {
      type: "value",
      transitive: true,
      matcher: (token) => {
        return isReferencedValue(token);
      },
      transformer: (token) => {
        return `${wrapValueWithBraces(
          `${removeDollarSignAtCharZero(token.value.toString())}.value`
        )}`;
      },
    },
    "fontSize/pxToRem": {
      type: "value",
      transitive: false,
      matcher: (token) => {
        return isType(token, "fontSizes");
      },
      transformer: (token) => {
        return `${token.value / 16}rem`;
      },
    },
  },
  platforms: {
    scss: {
      transformGroup: "scss",
      transforms: ["attribute/cti", "name/cti/kebab"],
      buildPath: "src/",
      files: [
        {
          destination: "scss/variables/_rma-variables.scss",
          format: "scss/variables",
        },
      ],
    },
  },
};
