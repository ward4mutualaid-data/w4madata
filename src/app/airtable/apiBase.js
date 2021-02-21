class AirtableAPIBase {
  constructor(apiKey, baseKey, baseName, allowedKeys) {
    const Airtable = require("airtable");
    this.airtableBase = new Airtable({
      apiKey: apiKey,
    }).base(baseKey);
    this.allowedKeys = allowedKeys;
    this.baseName = baseName;
    this.ignoreVals = [undefined, NaN, "", null, []];
    this.createdRecord = null;
  }

  preparePayload(values) {
    let payload = {};
    for (const key of this.allowedKeys) {
      const val = values[key];
      if (!this.ignoreVals.includes(val)) {
        payload[key] = val;
      }
    }
    return payload;
  }

  create(values) {
    this.createdRecord = null;
    const payload = this.preparePayload(values);
    return this.airtableBase(this.baseName).create(payload);
  }
}

export default AirtableAPIBase;
