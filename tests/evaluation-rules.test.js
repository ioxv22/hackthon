"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateTimeReduction, approvalBlockers, validateOpenDataPackage } = require("../evaluation-rules.js");

test("time reduction uses comparable manual and assisted hours", () => {
  assert.equal(calculateTimeReduction(10, 2), 80);
  assert.equal(calculateTimeReduction(3, 3), 0);
  assert.equal(calculateTimeReduction(0, 0), null);
  assert.equal(calculateTimeReduction(4, 5), null);
  assert.equal(calculateTimeReduction("x", 1), null);
});

test("mandatory evidence findings cannot be bypassed by a score", () => {
  const ids = ["identity", "security"];
  assert.deepEqual(approvalBlockers([
    { id: "identity", finding: "Met" },
    { id: "security", finding: "Pending review" }
  ], ids).map(item => item.id), ["security"]);
  assert.deepEqual(approvalBlockers([
    { id: "identity", finding: "Not met" },
    { id: "security", finding: "Insufficient evidence" }
  ], ids).map(item => item.id), ids);
  assert.deepEqual(approvalBlockers([
    { id: "identity", finding: "Met" }
  ], ids).map(item => item.id), ["security"]);
  assert.deepEqual(approvalBlockers([
    { id: "identity", finding: "Not applicable", justification: "Out of scope" },
    { id: "security", finding: "Met" }
  ], ids), []);
  assert.equal(approvalBlockers([
    { id: "identity", finding: "Not applicable", justification: "" }
  ], ids).length, 1);
});

test("open-data import requires source metadata and ten traceable tests", () => {
  const valid = {
    metadata: { title: "Open dataset", sourceUrl: "https://example.gov/dataset", license: "Open Data Licence", dataDate: "2025-01", accessedDate: "2026-10-23", transformations: "No transformations" },
    rows: [{ rowId: "r1", fields: { amount: 7 } }],
    tests: Array.from({ length: 10 }, (_, i) => ({
      id: `Q${i + 1}`, type: ["extraction", "extraction", "calculation", "calculation", "summary", "summary", "summary", "summary", "summary", "unanswerable"][i], question: `Question ${i + 1}`,
      expectedAnswer: `Answer ${i + 1}`, rowIds: ["r1"], fields: ["amount"]
    }))
  };
  assert.deepEqual(validateOpenDataPackage(valid), []);
  assert.ok(validateOpenDataPackage({ ...valid, tests: valid.tests.slice(0, 9) }).some(error => error.includes("exactly 10")));
  assert.ok(validateOpenDataPackage({ ...valid, tests: valid.tests.map((item, i) => i ? item : { ...item, rowIds: ["missing"] }) }).some(error => error.includes("rowIds")));
});
