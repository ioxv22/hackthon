(function (root, factory) {
  const rules = factory();
  if (typeof module === "object" && module.exports) module.exports = rules;
  if (root) root.AIGovRules = rules;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";

  function calculateTimeReduction(manual, assisted) {
    const manualHours = Number(manual);
    const assistedHours = Number(assisted);
    if (!Number.isFinite(manualHours) || !Number.isFinite(assistedHours) ||
        manualHours <= 0 || assistedHours < 0 || assistedHours > manualHours) return null;
    return ((manualHours - assistedHours) / manualHours) * 100;
  }

  function approvalBlockers(findings, mandatoryIds) {
    const mandatory = new Set(mandatoryIds || []);
    return (findings || []).filter(item => mandatory.has(item.id) &&
      !(item.finding === "Met" ||
        (item.finding === "Not applicable" && Boolean(item.justification && item.justification.trim()))));
  }

  function validateOpenDataPackage(data) {
    const errors = [];
    if (!data || typeof data !== "object" || Array.isArray(data)) return ["Expected a JSON object."];
    const metadata = data.metadata;
    if (!metadata || !["title", "sourceUrl", "license", "dataDate", "accessedDate", "transformations"]
      .every(key => typeof metadata[key] === "string" && metadata[key].trim())) {
      errors.push("Metadata must include title, sourceUrl, license, dataDate, accessedDate, and transformations.");
    }
    if (metadata?.sourceUrl && !/^https:\/\/[^ ]+$/i.test(metadata.sourceUrl)) errors.push("sourceUrl must use HTTPS.");
    if (!Array.isArray(data.rows) || data.rows.length === 0) errors.push("Include at least one source row.");
    const rowIds = new Set();
    const rowsById = new Map();
    (Array.isArray(data.rows) ? data.rows : []).forEach((row, index) => {
      if (!row || typeof row.rowId !== "string" || !row.rowId.trim() ||
          !row.fields || typeof row.fields !== "object" || Array.isArray(row.fields)) {
        errors.push(`Source row ${index + 1} needs a rowId and a fields object.`);
      } else if (rowIds.has(row.rowId)) errors.push(`Duplicate source row ID: ${row.rowId}.`);
      else { rowIds.add(row.rowId); rowsById.set(row.rowId, row); }
    });
    if (!Array.isArray(data.tests) || data.tests.length !== 10) errors.push("Include exactly 10 tests.");
    const testIds = new Set();
    const types = new Set(["extraction", "calculation", "summary", "unanswerable"]);
    const includedTypes = new Set();
    (Array.isArray(data.tests) ? data.tests : []).forEach((test, index) => {
      if (!test || typeof test.id !== "string" || !test.id.trim() || testIds.has(test.id)) {
        errors.push(`Test ${index + 1} needs a unique ID.`);
        return;
      }
      testIds.add(test.id);
      if (!types.has(test.type)) errors.push(`${test.id}: type must be extraction, calculation, summary, or unanswerable.`);
      else includedTypes.add(test.type);
      if (typeof test.question !== "string" || !test.question.trim()) errors.push(`${test.id}: question is required.`);
      if (typeof test.expectedAnswer !== "string" || !test.expectedAnswer.trim()) errors.push(`${test.id}: expectedAnswer is required.`);
      if (!Array.isArray(test.rowIds) || !test.rowIds.length || test.rowIds.some(id => !rowIds.has(id))) {
        errors.push(`${test.id}: rowIds must refer to at least one included source row.`);
      }
      if (!Array.isArray(test.fields) || !test.fields.length || test.fields.some(field => typeof field !== "string" || !field.trim())) {
        errors.push(`${test.id}: include the source field names used by the reference.`);
      } else if (Array.isArray(test.rowIds) && test.fields.some(field =>
        !test.rowIds.some(rowId => rowsById.get(rowId) && Object.prototype.hasOwnProperty.call(rowsById.get(rowId).fields, field)))) {
        errors.push(`${test.id}: every cited field must exist in one of its referenced source rows.`);
      }
      if (typeof test.evaluationMethod !== "string" || !test.evaluationMethod.trim()) errors.push(`${test.id}: evaluationMethod is required.`);
    });
    for (const type of types) if (!includedTypes.has(type)) errors.push(`Include at least one ${type} test.`);
    return errors;
  }

  return { calculateTimeReduction, approvalBlockers, validateOpenDataPackage };
});
