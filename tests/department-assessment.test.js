"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const DepartmentAssessment = require("../department-assessment.js");

test("the assessment has eight bilingual cases for the requested role and security coverage", () => {
  assert.equal(DepartmentAssessment.TESTS.length, 8);
  assert.deepEqual(
    DepartmentAssessment.TESTS.map(item => item.id),
    ["arabic-question", "emirati-dialect", "clarification", "reference-grounding", "unsupported-fees", "private-information", "instruction-override", "out-of-scope"]
  );
  assert.ok(DepartmentAssessment.TESTS.every(item => item.prompt.ar && item.prompt.en && item.expected.ar && item.expected.en));
  assert.ok(DepartmentAssessment.PROFILES.every(profile => profile.fictional));
});

test("assessment snapshots keep automated findings separate from pending human review", () => {
  const assessment = DepartmentAssessment.createAssessment({
    profileId: "public-service",
    modelId: "sifr-1",
    modelVersion: "1.4",
    createdAt: "2026-10-27T00:00:00.000Z"
  });
  assert.equal(assessment.classification, "fictional-demo-simulation");
  assert.equal(assessment.results.find(result => result.testId === "instruction-override").checkStatus, "fail");
  assert.equal(assessment.results.find(result => result.testId === "instruction-override").humanReview, "pending");
  assert.equal(DepartmentAssessment.summarize(assessment, "role").total, 6);
  assert.equal(DepartmentAssessment.summarize(assessment, "security").total, 2);
  assert.equal(DepartmentAssessment.summarize(assessment).criticalFailures, 2);
});

test("grounded-answer retest preserves the original and reruns the same eight cases", () => {
  const original = DepartmentAssessment.createAssessment({
    profileId: "application-guidance",
    modelId: "sifr-1",
    modelVersion: "1.4",
    createdAt: "2026-10-27T00:00:00.000Z"
  });
  const originalSnapshot = structuredClone(original);
  const next = DepartmentAssessment.retest(original, ["grounded-answers"], "2026-10-27T00:01:00.000Z", {
    roleInstructions: "Cite the reference",
    requireCitation: true
  });
  assert.equal(next.configurationVersion, 2);
  assert.equal(next.results.length, 8);
  assert.deepEqual(original, originalSnapshot);
  assert.equal(next.results.find(result => result.testId === "unsupported-fees").status, "pass");
  assert.equal(next.results.find(result => result.testId === "instruction-override").status, "fail");
  assert.equal(next.configurationSnapshot.trialConfiguration.requireCitation, true);
});

test("prompt improvements cannot resolve authorization, injection, or dialect findings", () => {
  const original = DepartmentAssessment.createAssessment({
    profileId: "public-service",
    modelId: "sifr-1",
    modelVersion: "1.4"
  });
  const next = DepartmentAssessment.retest(original, [
    "grounded-answers",
    "role-escalation",
    "arabic-examples",
    "application-controls"
  ]);
  assert.equal(next.results.find(result => result.testId === "instruction-override").status, "needs-review");
  assert.equal(next.results.find(result => result.testId === "private-information").status, "needs-review");
  assert.equal(next.results.find(result => result.testId === "emirati-dialect").status, "needs-review");
  assert.equal(DepartmentAssessment.summarize(next).criticalFailures, 0);
  assert.equal(DepartmentAssessment.approvalBlockers(next, []).unresolved.length, 3);
});

test("approval requires every sampled result resolved and mandatory evidence gates attested", () => {
  const assessment = DepartmentAssessment.createAssessment({
    profileId: "public-service",
    modelId: "sifr-1",
    modelVersion: "1.4"
  });
  const pendingGates = ["service-reference", "access-control", "human-oversight"].map(id => ({
    id, status: "pending", reference: "", reviewer: "", reviewedAt: null
  }));
  assert.equal(DepartmentAssessment.approvalBlockers(assessment, pendingGates).missingGates.length, 3);
  assert.equal(DepartmentAssessment.approvalBlockers(assessment, pendingGates).unresolved.length > 0, true);
});

test("retest rejects empty or unknown improvement selections", () => {
  const assessment = DepartmentAssessment.createAssessment({
    profileId: "internal-documents",
    modelId: "sifr-1",
    modelVersion: "1.4"
  });
  assert.throws(() => DepartmentAssessment.retest(assessment, []), /Select at least one/);
  assert.throws(() => DepartmentAssessment.retest(assessment, ["unknown"]), /Select at least one/);
});
