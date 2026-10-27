"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Library = require("../evidence-library.js");

test("seeded source and guidance catalogue is traceable and schema-valid", () => {
  const database = Library.createDatabase();
  assert.deepEqual(Library.validateDatabase(database), []);
  assert.equal(database.sources.length, 7);
  assert.equal(database.guidance.length, 12);
  for (const domain of ["governance", "privacy", "transparency", "fairness", "security", "performance", "human-review"]) {
    assert.ok(database.guidance.some(item => item.domain === domain), `${domain} has a guidance record`);
  }
  for (const guidance of database.guidance) {
    const source = database.sources.find(item => item.id === guidance.sourceId);
    assert.ok(source, `${guidance.id} has a source`);
    assert.equal(source.url.startsWith("https://"), true);
    assert.ok(guidance.evidenceRequest.en);
    assert.ok(guidance.originalReference);
  }
  assert.equal(database.sources.find(item => item.id === "ISO-42001").verificationStatus, "needs-review");
  assert.match(database.sources.find(item => item.id === "NIST-AI-RMF-PLAYBOOK").limitations.en, /Voluntary/);
  assert.match(database.sources.find(item => item.id === "DUBAI-CPI-OPEN-DATA").limitations.en, /No dataset rows/);
});

test("recommendations respond to use-case details without deciding mandatory applicability", () => {
  const recommendations = Library.recommendGuidance({
    category: "Citizen services",
    description: "Bilingual assistant for applicant support",
    languages: ["Arabic", "English"],
    sensitivity: "Sensitive",
    personal: "Yes",
    hosting: "UAE private cloud",
    oversight: "Mandatory human review"
  });
  const ids = recommendations.map(item => item.guidance.id);
  assert.ok(ids.includes("OWASP-SECURITY-REVIEW"));
  assert.ok(ids.includes("NIST-MEASURE-EVALUATION"));
  assert.ok(ids.includes("NIST-PRIVACY-DATA-LIFECYCLE"));
  assert.ok(ids.includes("NIST-TRANSPARENCY-USER-NOTICE"));
  assert.ok(ids.includes("NIST-FAIRNESS-IMPACT-REVIEW"));
  assert.ok(ids.includes("NIST-HUMAN-OVERSIGHT-ROLES"));
  assert.ok(ids.includes("UAE-VERIFY-APPLICABILITY"));
  assert.ok(recommendations.every(item => item.guidance.category !== "internal-policy"));
});

test("validated import is append-only and preserves existing records on ID collision", () => {
  const original = Library.createDatabase();
  const imported = Library.createDatabase();
  imported.sources.push({
    ...imported.sources.find(item => item.id === "UAE-DIGITAL-PORTAL"),
    id: "CUSTOM-SOURCE",
    title: { en: "Custom source", ar: "مصدر مخصص" }
  });
  const packageData = Library.packageDatabase(imported, "2026-10-27T00:00:00.000Z");
  assert.deepEqual(Library.validateExportPackage(packageData), []);
  const merged = Library.mergeDatabase(original, imported);
  assert.equal(merged.counts.sources.added, 1);
  assert.equal(merged.counts.sources.duplicate, 7);
  assert.equal(merged.database.sources.find(item => item.id === "UAE-DIGITAL-PORTAL").title.en, "Digital UAE");
  assert.equal(merged.database.sources.some(item => item.id === "CUSTOM-SOURCE"), true);

  const invalid = Library.packageDatabase(imported);
  invalid.database.guidance[0].sourceId = "MISSING-SOURCE";
  assert.ok(Library.validateExportPackage(invalid).some(error => error.includes("unknown source")));
});
