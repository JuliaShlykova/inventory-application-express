function decoderQuotation(str) {
  return str.replaceAll('&#x27;', '\'');
}

function capitalization(str) {
  return str.toLowerCase().replace(/\b\w/g, w=>w.toUpperCase())
}

module.exports.decoder = decoderQuotation;
module.exports.capitalization = capitalization;