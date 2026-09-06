const fs = require("fs");
const Module = require("module");
const path = require("path");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function resolve(request, parent, isMain, options) {
  if (request.startsWith("@/")) request = path.join(root, request.slice(2));
  return originalResolve.call(this, request, parent, isMain, options);
};
require.extensions[".ts"] = function compile(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  module._compile(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText, filename);
};

const { calculateReading, generateReading } = require(path.join(root, "lib", "bazi.ts"));
const genders = ["male", "female", "other"];
const concerns = [null, "How can I help with exam stress?", "How should we approach an unusual family decision?"];
const expected = new Set(["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"]);
const fixtures = new Map();

for (let day = 1; day <= 90 && fixtures.size < expected.size; day += 1) {
  const date = new Date(Date.UTC(2006, 0, day));
  const birthDate = date.toISOString().slice(0, 10);
  const reading = calculateReading({ subject_name: "Alex", birth_date: birthDate, birth_time: "12:00", gender: "female", question_type: "child_potential", variation_seed: day });
  const name = reading.chart_data.day_master_name;
  if (expected.has(name) && !fixtures.has(name)) fixtures.set(name, birthDate);
}

const failures = [];
if (fixtures.size !== expected.size) failures.push(`Found ${fixtures.size}/10 Day Masters`);
async function run() {
for (const [dayMaster, birthDate] of fixtures) {
  const unknownTimeReading = calculateReading({ subject_name: "Alex", birth_date: birthDate, birth_time: null, gender: "female", question_type: "child_potential", variation_seed: 17 });
  if (unknownTimeReading.hour_pillar !== null) failures.push(`${dayMaster}: unknown birth time created an Hour Pillar`);
  if (unknownTimeReading.chart_data.day_master_name !== dayMaster) failures.push(`${dayMaster}: unknown birth time changed the Day Master`);
  try {
    const releasedWithoutTime = await generateReading({ subject_name: "Alex", birth_date: birthDate, birth_time: null, gender: "female", question_type: "child_potential", variation_seed: 17 });
    if (releasedWithoutTime.insights_review_status !== "reviewed") failures.push(`${dayMaster}: unknown-time report did not pass release QC`);
  } catch (error) {
    failures.push(`${dayMaster}/unknown time: ${error instanceof Error ? error.message : String(error)}`);
  }
  for (const gender of genders) {
    for (const concern of concerns) {
      const reading = calculateReading({ subject_name: "Alex", birth_date: birthDate, birth_time: "12:00", gender, question_type: "child_potential", parenting_concern: concern, variation_seed: 17 });
      const summary = reading.report_content;
      const prose = JSON.stringify(summary);
      if (reading.chart_data.day_master_name !== dayMaster) failures.push(`${dayMaster}/${gender}: wrong Day Master`);
      if (summary.strengths.length !== 3 || summary.soft_spots.length < 2) failures.push(`${dayMaster}/${gender}: wrong section counts`);
      if (/\bthey (is|was|has|feels|asks|seems|becomes|explains|approaches|shows|states|finishes|begins|returns|notices|invites)\b/i.test(prose)) failures.push(`${dayMaster}/${gender}: singular-they grammar`);
      if (concern && !summary.concern_original) failures.push(`${dayMaster}/${gender}: concern omitted`);
      if (!concern && summary.concern_original) failures.push(`${dayMaster}/${gender}: unexpected concern`);
      const unmatchedConcern = concern?.includes("unusual family decision");
      if (unmatchedConcern && !summary.concern_response?.includes("without making assumptions")) failures.push(`${dayMaster}/${gender}: unmatched concern is not handled transparently`);
      if (unmatchedConcern && summary.concern_tips?.length) failures.push(`${dayMaster}/${gender}: unmatched concern received invented tips`);
      if (unmatchedConcern && summary.day_master_support?.weekly_action?.bazi_link) failures.push(`${dayMaster}/${gender}: unmatched concern received an invented Bazi link`);
      if (!summary.day_master_support?.weekly_action?.situation || !summary.day_master_support.weekly_action.action) failures.push(`${dayMaster}/${gender}: weekly action missing`);
      try {
        const released = await generateReading({ subject_name: "Alex", birth_date: birthDate, birth_time: "12:00", gender, question_type: "child_potential", parenting_concern: concern, variation_seed: 17 });
        if (released.insights_review_status !== "reviewed") failures.push(`${dayMaster}/${gender}: release QC did not approve`);
      } catch (error) {
        failures.push(`${dayMaster}/${gender}/${concern ? "concern" : "no concern"}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`QC matrix passed: ${fixtures.size} Day Masters × ${genders.length} genders × ${concerns.length} concern states, with known and unknown birth times.`);
}

run().catch((error) => { console.error(error); process.exit(1); });
