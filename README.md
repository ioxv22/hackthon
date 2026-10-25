# AIGov Compass

**The right model, with clear evidence, and a human decision.**
From government use case to evidence-backed AI approval.

## دليل التسليم السريع بالعربية

هذا نموذج أولي للهاكثون، وليس خدمة حكومية أو اعتماداً أو شهادة امتثال. يبدأ التطبيق في **الوضع التجريبي** ببيانات افتراضية ثابتة، ولا يتصل بمزودي النماذج. هدف خفض وقت التقييم البالغ ٨٠٪ غير مقاس أو مضمون.

### تشغيل العرض

1. افتح `index.html` في متصفح حديث، أو شغّل الخادم المحلي وفق خطوات Live أدناه.
2. اترك الوضع مضبوطاً على **تجريبي** ثم اضغط **ابدأ عرض التحكيم**؛ يبدأ المسار من حالة الاستخدام دون إرسال طلب خارجي.
3. اتبع الخطوات حتى مقارنة النماذج، الاختبارات، حالة النقص الإلزامي، الحالة التجريبية المستقلة، قرار المراجع، والتقرير.
4. من **النشر والمراقبة** حاكِ تحديث الإصدار؛ يحتفظ التطبيق بسجل الموافقة السابقة ويطلب إعادة تقييم النسخة الجديدة.
5. من **جواز النموذج** نزّل JSON، أو اختر **طباعة / حفظ بصيغة PDF** ثم احفظ الملف من نافذة الطباعة. لم يُختبر حفظ PDF فعلياً في هذه البيئة.
6. استخدم **إعادة ضبط العرض** للعودة إلى بيانات البداية. تُحفظ بيانات العرض والاستيراد في تخزين المتصفح المحلي.

### حالة التحقق لهذا التسليم

- اكتملت رحلة التحكيم الإرشادية في المتصفح، بما فيها منع الموافقة عند نقص الدليل، والموافقة البشرية التجريبية المكتملة، وتحديث الإصدار مع الاحتفاظ بالسجل السابق.
- اختُبر فشل Live بمحاكاة تعذّر الخادم: ظهر الخطأ وخيار إعادة المحاولة، ولم تُستبدل الردود بإجابات Demo. هذا اختبار للواجهة فقط، وليس اختباراً للمزودين.
- فُحص RTL والتبديل إلى العربية على شاشات التطبيق. لم يُنفذ اختبار شامل على أجهزة جوال فعلية.
- **لم يُختبر الخادم أو مزودا API فعلياً** لأن Node.js غير متاح في بيئة التحضير. لم يُعثر على دليل المسابقة ضمن ملفات المشروع؛ لذلك لا يمكن التحقق من مطابقة كل بند للمسابقة.

### نسخة احتياطية

حُفظت الملفات الأساسية قبل تعديلات الإنهاء في `.backup-20261025-162053`. هذا المجلد مستثنى من Git بواسطة `.gitignore` ولا يحتاج إلى رفعه.

A hackathon prototype for responsible AI and smart cognitive government. It has no official endorsement, certification, government approval, or production integrations. The 80% time-reduction figure is a project target—not a measured or guaranteed result.

## Run the demo

### Demo Mode

Open `index.html` in a modern browser. Demo Mode uses fixed fictional data and does not call model services. Browser local storage holds the demonstration evaluations and optional public-data imports. Use **Reset demo** to clear local demo state and the imported dataset.

### Live Mode and API status

**API status for this delivery: written, not tested.** Node.js is not installed in the environment in which these changes were prepared, so the local backend and upstream endpoints could not be exercised. Do not represent Live mode as verified or working until it has been tested in the intended presentation environment.

1. Install Node.js 20.3 or newer.
2. Open a terminal in this folder.
3. Run `node server.js`.
4. Open `http://127.0.0.1:4173` (do not open the HTML as a `file://` URL for Live mode).
5. Select **Live model comparison**, switch to Live, use fictional/public non-sensitive text, and accept the data warning before the first request.

The backend uses a fixed allowlist for:

- `https://kilwaapi.vercel.app/kilwa-deepseek`
- `https://kilwaapi.vercel.app/kilwa-claude`

It calls each route with GET and URL-encodes the prompt using `URL.searchParams`. The server validates HTTP status and the `{status, model, reply}` response, limits prompts to 8,000 characters, request bodies to 40 KB, and provider replies to 1 MB, allows at most two concurrent provider requests, enforces a 30-second timeout, and supports client cancellation. Only source rows and fields referenced by the selected test are sent. It does not log prompts or replies. Provider identity and data practices are unverified; the provider-reported model name is not independently verified. GET URLs may be retained in provider infrastructure logs. Never send personal, confidential, or sensitive government information.

Live replies are not persisted in browser storage. Failures remain visible with retry; they are never replaced by demo answers. Demo evidence cannot qualify a live provider for approval.

## Five-minute judging flow

1. Select **Start judging demo**. It forces Demo Mode; it does not call external services.
2. Review the proposed use case and plan, then compare the fictional candidate profiles.
3. Open **Live model comparison** in Demo Mode and run the fixed fictional challenge suite.
4. Inspect the Sifr Assist case: missing mandatory evidence blocks approval regardless of suitability score.
5. Open the separate Noura Civic fictional evidence fixture, complete human review, and record the simulated internal decision.
6. Download the model passport JSON or print the evaluation report. For the seven-slide deck, open **Pitch & 90-day plan** and select **Print 7-slide deck**; choose “Save as PDF” in the browser print dialog.
7. Trigger a simulated model update from Deployment & monitoring. The previous record is retained; the new version requires reassessment.

The **Pitch & 90-day plan** page includes the five-minute outline, an independent 2–3 minute video script, a printable seven-slide deck, proposed 90-day milestones, and honest committee Q&A.

## Open-data tests

The official Data Dubai page for **Annual Percentage Change in Consumer Price Index- Base Year 2021** was accessed on 2026-10-23. The metadata page described monthly/quarterly CPI changes and listed the dataset as Open, but its data tables displayed “No data available” and the data-download controls were disabled in the accessed session. Therefore this prototype does not claim to use that dataset, and it contains no fabricated public data or reference answers.

The [Data Dubai Terms & Conditions](https://data.dubai/en/terms-conditions) state that Open Data use is subject to the Open Data Licence and separately describe limits on general copying. Review the licence and obtain confirmation of reuse, attribution, and redistribution permissions for the exact dataset before importing or sharing it.

Open **Open-data tests** to download a JSON or CSV template. Import only a permitted, public, non-personal dataset package (maximum 500 KB) with:

- dataset title, HTTPS source URL, exact licence, source data date (or explicit unknown), access date, and transformation notes;
- source rows containing stable `rowId` values and original field names/values;
- exactly ten unique tests, with at least one each of `extraction`, `calculation`, `summary`, and `unanswerable`; every test needs a question, reference answer, evaluation method, referenced row IDs, and field names that exist in those rows.

Imports are stored locally and are not sent automatically. Select an imported test in Live model comparison to send the cited rows and question to both third-party routes, after accepting the Live warning. The reference answer is not included in the provider prompt. Demo Mode deliberately does not invent replies for imported data. Automated reference-string checks for scalar extraction/calculation are limited checks, not proof of truth; summaries and unanswerable cases require human review.

CSV columns are `id,type,question,expected_answer,source_rows_json,fields_json,evaluation_method,title,source_url,license,data_date,accessed_date,transformations`. The two `*_json` columns contain valid JSON arrays; `source_rows_json` items use `{"rowId":"...","fields":{"field":"value"}}`. Dataset metadata must be identical across all ten rows.

## Evaluation and approval limits

- Suitability is a weighted fit signal, separate from compliance and security findings.
- Human ratings remain pending until recorded: factual accuracy 50%, Arabic quality 25%, and source adherence 25%.
- The approval gate blocks when any applicable mandatory finding is not Met or lacks a justified “Not applicable” finding. Suitability cannot override the gate.
- Prototype evidence rules are illustrative and require validation against the applicable official policy. No UAE legal clauses are invented here.
- Live-provider identity, hosting, data retention/deletion, and independent security evidence are unavailable. No demo evidence is used to approve a live provider.
- The synthetic bilingual service guide and fixed demo replies are fictional. Limited tests do not prove security, accuracy, or compliance.
- Local storage and exported passports are demo records, not tamper-resistant audit logs or official certificates.

## Tests and validation

Focused rules tests use Node's built-in test runner:

```powershell
node --test tests\evaluation-rules.test.js
```

Run these checks in the presentation environment:

```powershell
node --check app.js
node --check server.js
node --test tests\evaluation-rules.test.js
```

In this preparation environment, `node --test tests\evaluation-rules.test.js` could not run because `node` is not installed or available on `PATH`; VS Code test discovery also has no registered test controller. Browser checks covered the guided Demo flow, score and mandatory-gate rules, a stubbed Live backend failure with retry/no fallback, Arabic/RTL rendering, and JSON/HTML report content. The real backend and upstream APIs were not tested. PDF saving and a physical-device mobile pass still need manual verification. Do not claim those checks passed until performed in the presentation environment.
