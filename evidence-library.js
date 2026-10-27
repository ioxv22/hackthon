(function (root, factory) {
  const library = factory();
  if (typeof module === "object" && module.exports) module.exports = library;
  if (root) root.EvidenceLibrary = library;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";

  const SCHEMA_VERSION = 1;
  const SOURCES = [
    {
      id: "UAE-AI-RESOURCES",
      title: { en: "AI resources", ar: "موارد الذكاء الاصطناعي" },
      publisher: "UAE Government",
      url: "https://u.ae/en/about-the-uae/digital-uae/digital-technology/artificial-intelligence/ai-resources",
      version: null,
      publishedDate: null,
      accessedDate: "2026-10-27",
      type: "government-policy",
      language: ["English"],
      verificationStatus: "verified",
      verificationNote: "Official UAE Government Portal page opened; page title and publisher were verified. Individual linked publications and their legal effect were not independently reviewed.",
      scope: {
        en: "Use as an official entry point to UAE AI publications; check the linked publication itself before relying on any policy or requirement.",
        ar: "بوابة رسمية للوصول إلى منشورات الإمارات حول الذكاء الاصطناعي؛ يجب مراجعة المنشور المرتبط نفسه قبل الاستناد إلى سياسة أو متطلب."
      },
      limitations: {
        en: "No specific UAE legal clause or applicability to an entity or use case is asserted here. Publication dates and versions are not stated on the landing page.",
        ar: "لا يثبت هذا السجل مادة قانونية إماراتية محددة أو انطباقها على جهة أو استخدام. لا يعرض الرابط تاريخاً أو إصداراً للصفحة."
      },
      license: "Not assessed"
    },
    {
      id: "UAE-DIGITAL-PORTAL",
      title: { en: "Digital UAE", ar: "الإمارات الرقمية" },
      publisher: "UAE Government",
      url: "https://u.ae/en/about-the-uae/digital-uae",
      version: null,
      publishedDate: null,
      accessedDate: "2026-10-27",
      type: "government-policy",
      language: ["English"],
      verificationStatus: "verified",
      verificationNote: "Official UAE Government Portal page opened; title and publisher were verified.",
      scope: {
        en: "Context about UAE digital-government initiatives; not an AI approval rule or model list.",
        ar: "مرجع سياقي لمبادرات الحكومة الرقمية في الإمارات؛ ليس قاعدة لاعتماد الذكاء الاصطناعي أو قائمة نماذج."
      },
      limitations: {
        en: "Does not establish that a specific AI requirement applies to a particular entity or use case.",
        ar: "لا يثبت انطباق متطلب ذكاء اصطناعي محدد على جهة أو حالة استخدام بعينها."
      },
      license: "Not assessed"
    },
    {
      id: "NIST-AI-RMF-PLAYBOOK",
      title: { en: "NIST AI Risk Management Framework Playbook", ar: "دليل إطار NIST لإدارة مخاطر الذكاء الاصطناعي" },
      publisher: "National Institute of Standards and Technology (NIST)",
      url: "https://airc.nist.gov/airmf-resources/playbook/",
      version: "AI RMF 1.0 core; the page says the framework is being updated",
      publishedDate: null,
      accessedDate: "2026-10-27",
      type: "voluntary-framework",
      language: ["English"],
      verificationStatus: "verified",
      verificationNote: "Official NIST page opened. It describes suggestions aligned to Govern, Map, Measure, and Manage and explicitly says suggestions are voluntary and the Playbook is not a checklist.",
      scope: {
        en: "Optional risk-management actions to consider and tailor to a use case.",
        ar: "إجراءات اختيارية لإدارة المخاطر يمكن النظر فيها ومواءمتها مع حالة الاستخدام."
      },
      limitations: {
        en: "Voluntary guidance, not a UAE legal requirement or a checklist. NIST says AI RMF 1.0 is being updated; recheck the current edition.",
        ar: "إرشاد طوعي، وليس متطلباً قانونياً إماراتياً أو قائمة إلزامية. يذكر NIST أن AI RMF 1.0 قيد التحديث؛ تحقّق من الإصدار الحالي."
      },
      license: "Official page accessed; reuse terms not assessed"
    },
    {
      id: "OECD-AI-PRINCIPLES",
      title: { en: "OECD AI Principles", ar: "مبادئ منظمة التعاون الاقتصادي والتنمية للذكاء الاصطناعي" },
      publisher: "Organisation for Economic Co-operation and Development (OECD)",
      url: "https://oecd.ai/en/ai-principles",
      version: "Adopted 2019; updated May 2024",
      publishedDate: "2024-05",
      accessedDate: "2026-10-27",
      type: "voluntary-guidance",
      language: ["English"],
      verificationStatus: "verified",
      verificationNote: "Official OECD AI Principles page opened; it states the initial 2019 adoption and May 2024 update.",
      scope: {
        en: "International policy guidance for trustworthy AI and policymaking; use as a reference, not as a local legal determination.",
        ar: "إرشاد دولي للذكاء الاصطناعي الجدير بالثقة وصنع السياسات؛ يُستخدم كمرجع لا كحكم قانوني محلي."
      },
      limitations: {
        en: "Does not establish UAE legal applicability, certification, or compliance for this project.",
        ar: "لا يثبت انطباقاً قانونياً إماراتياً أو شهادة أو امتثالاً لهذا المشروع."
      },
      license: "Official page accessed; reuse terms not assessed"
    },
    {
      id: "OWASP-GENAI",
      title: { en: "OWASP GenAI Security Project", ar: "مشروع OWASP لأمن الذكاء الاصطناعي التوليدي" },
      publisher: "Open Worldwide Application Security Project (OWASP)",
      url: "https://genai.owasp.org/",
      relatedUrl: "https://genai.owasp.org/llm-top-10/",
      version: "Project resource; version of the linked material requires review",
      publishedDate: null,
      accessedDate: "2026-10-27",
      type: "security-guidance",
      language: ["English"],
      verificationStatus: "needs-review",
      verificationNote: "Official OWASP project site opened. A linked LLM Top 10 page was reachable, but its full edition and detailed content were not verified in this review.",
      scope: {
        en: "A starting point for an application-security review of GenAI use; consult the current OWASP material directly.",
        ar: "مدخل لمراجعة أمن تطبيقات الذكاء الاصطناعي التوليدي؛ راجع مواد OWASP الحالية مباشرة."
      },
      limitations: {
        en: "Security guidance, not a law or certification. This record does not reproduce or claim a verified OWASP control list.",
        ar: "إرشادات أمنية وليست قانوناً أو شهادة. لا ينسخ هذا السجل قائمة ضوابط OWASP ولا يدّعي التحقق منها."
      },
      license: "Not assessed"
    },
    {
      id: "ISO-42001",
      title: { en: "ISO/IEC 42001:2023", ar: "ISO/IEC 42001:2023" },
      publisher: "International Organization for Standardization (ISO)",
      url: "https://www.iso.org/standard/42001",
      version: "ISO/IEC 42001:2023",
      publishedDate: "2023",
      accessedDate: "2026-10-27",
      type: "standard",
      language: ["English"],
      verificationStatus: "needs-review",
      verificationNote: "The public ISO page was opened and describes ISO/IEC 42001 as an AI management-system standard; the full licensed standard was not accessed.",
      scope: {
        en: "Public ISO summary describes organization-wide AI management policies and procedures using Plan-Do-Check-Act.",
        ar: "يصف ملخص ISO العام سياسات وإجراءات لإدارة الذكاء الاصطناعي على مستوى المؤسسة باستخدام خطط-نفّذ-تحقق-حسّن."
      },
      limitations: {
        en: "The full standard is not reproduced or represented as freely available. No clause numbers or conformity claims are made; obtain licensed access and expert review.",
        ar: "لا يُعرض النص الكامل للمعيار ولا يُدّعى أنه متاح مجاناً. لا تُذكر أرقام بنود أو ادعاءات مطابقة؛ يلزم وصول مرخص ومراجعة مختص."
      },
      license: "Public summary only; full standard access/licensing not verified"
    },
    {
      id: "DUBAI-CPI-OPEN-DATA",
      title: { en: "Dubai CPI percentage-change dataset metadata", ar: "بيانات دبي الوصفية لمجموعة تغيّر مؤشر أسعار المستهلك" },
      publisher: "Dubai Data and Statistics Establishment",
      url: "https://data.dubai/en/e/statistic/35681/724658",
      version: null,
      publishedDate: null,
      accessedDate: "2026-10-23",
      type: "government-open-data",
      language: ["English"],
      verificationStatus: "needs-review",
      verificationNote: "Earlier project inspection recorded that the metadata page showed no data and disabled downloads. Recheck the page, licence, and available extract before use.",
      scope: {
        en: "Potential public-data test source only if a usable extract and reuse terms are verified.",
        ar: "مصدر محتمل لاختبار البيانات العامة فقط بعد التحقق من توفر ملف قابل للاستخدام وشروط إعادة النشر."
      },
      limitations: {
        en: "No dataset rows or benchmark questions are included. This source is not currently used to score models.",
        ar: "لا تتضمن المكتبة صفوف بيانات أو أسئلة معيارية من هذه المجموعة، ولا تُستخدم حالياً لتقييم النماذج."
      },
      license: "Recheck the dataset-specific licence and reuse permissions"
    }
  ];

  const GUIDANCE = [
    {
      id: "NIST-GOVERN-REVIEW",
      title: { en: "Set accountable governance and review ownership", ar: "حدّد الحوكمة والمسؤولية عن المراجعة" },
      description: { en: "Consider who owns the AI risk review, how responsibilities are recorded, and when the review is revisited.", ar: "راجع من يملك مسؤولية تقييم مخاطر الذكاء الاصطناعي، وكيف توثّق المسؤوليات، ومتى يعاد النظر." },
      domain: "governance",
      sourceId: "NIST-AI-RMF-PLAYBOOK",
      originalReference: "AI RMF function: Govern (function name verified; no subcategory ID claimed)",
      relevance: { en: "Relevant across use cases because accountability and review scope must be decided by the organization.", ar: "مهم لمختلف الاستخدامات لأن الجهة هي من تحدد المسؤولية ونطاق المراجعة." },
      evidenceRequest: { en: "Ask for an internal responsibility map, named reviewer, and dated review record.", ar: "اطلب مصفوفة مسؤوليات داخلية واسم المراجع وسجل مراجعة مؤرخ." },
      category: "voluntary-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["governance", "human-review"]
    },
    {
      id: "NIST-MAP-USE-CASE",
      title: { en: "Describe the use case, affected people, and context", ar: "وثّق الاستخدام والأشخاص المتأثرين والسياق" },
      description: { en: "Map the intended task, operating context, affected groups, and foreseeable impact before selecting evidence.", ar: "حدّد المهمة والسياق التشغيلي والفئات المتأثرة والآثار المتوقعة قبل اختيار الأدلة." },
      domain: "governance",
      sourceId: "NIST-AI-RMF-PLAYBOOK",
      originalReference: "AI RMF function: Map (function name verified; no subcategory ID claimed)",
      relevance: { en: "The intake captures task, language, data sensitivity, hosting, and human oversight to support a use-case-specific review.", ar: "يجمع نموذج الاستقبال المهمة واللغة وحساسية البيانات والاستضافة والإشراف البشري لدعم مراجعة مرتبطة بالاستخدام." },
      evidenceRequest: { en: "Ask for an approved use-case description, data-flow overview, and affected-user analysis.", ar: "اطلب وصفاً معتمداً لحالة الاستخدام ومخطط تدفق البيانات وتحليلاً للفئات المتأثرة." },
      category: "voluntary-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["governance", "privacy", "human-review"]
    },
    {
      id: "NIST-MEASURE-EVALUATION",
      title: { en: "Record the scope and limitations of each evaluation", ar: "سجّل نطاق كل تقييم وحدوده" },
      description: { en: "Document what was tested, the method and source, observed outcomes, and known limitations; do not infer performance from a model profile.", ar: "وثّق ما اختُبر والمنهج والمصدر والنتائج المرصودة والحدود المعروفة؛ لا تستنتج الأداء من ملف النموذج." },
      domain: "performance",
      sourceId: "NIST-AI-RMF-PLAYBOOK",
      originalReference: "AI RMF function: Measure (function name verified; no subcategory ID claimed)",
      relevance: { en: "The use-case task and requested languages should shape test questions and human review.", ar: "ينبغي أن توجه المهمة واللغات المطلوبة أسئلة الاختبار والمراجعة البشرية." },
      evidenceRequest: { en: "Ask for a dated test plan, traceable test cases, recorded outputs, and reviewer notes.", ar: "اطلب خطة اختبار مؤرخة وحالات قابلة للتتبع ومخرجات مسجلة وملاحظات المراجع." },
      category: "voluntary-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["performance", "fairness", "transparency"]
    },
    {
      id: "NIST-MANAGE-CHANGE",
      title: { en: "Plan response and reassessment for material changes", ar: "خطط للاستجابة وإعادة التقييم عند التغييرات الجوهرية" },
      description: { en: "Consider how identified risks are handled and which model, data, or context changes trigger another review.", ar: "راجع كيفية التعامل مع المخاطر المحددة والتغييرات في النموذج أو البيانات أو السياق التي تستدعي مراجعة جديدة." },
      domain: "governance",
      sourceId: "NIST-AI-RMF-PLAYBOOK",
      originalReference: "AI RMF function: Manage (function name verified; no subcategory ID claimed)",
      relevance: { en: "Model versions, data handling, and deployment conditions can change after the initial assessment.", ar: "قد تتغير إصدارات النموذج ومعالجة البيانات وظروف النشر بعد التقييم الأولي." },
      evidenceRequest: { en: "Ask for change-control, incident escalation, and reassessment-trigger records.", ar: "اطلب سجلات ضبط التغيير وتصعيد الحوادث ومحفزات إعادة التقييم." },
      category: "voluntary-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["governance", "security", "performance"]
    },
    {
      id: "NIST-PRIVACY-DATA-LIFECYCLE",
      title: { en: "Review the data lifecycle and retention boundaries", ar: "راجع دورة حياة البيانات وحدود الاحتفاظ" },
      description: { en: "Illustrative prompt: identify what data enters the system, where it is processed, who can access it, and how long it is retained; verify each point against applicable policy.", ar: "سؤال توضيحي: حدّد البيانات التي تدخل النظام ومكان معالجتها ومن يمكنه الوصول إليها ومدة الاحتفاظ بها، ثم تحقّق من كل نقطة وفق السياسة المنطبقة." },
      domain: "privacy",
      sourceId: "NIST-AI-RMF-PLAYBOOK",
      originalReference: "Project-added prompt informed by the voluntary Playbook; no subcategory ID or direct NIST requirement is asserted",
      relevance: { en: "Relevant when personal, sensitive, or confidential data may be processed; applicability and obligations require human review.", ar: "ذو صلة عند احتمال معالجة بيانات شخصية أو حساسة أو سرية؛ ويتطلب الانطباق والالتزامات مراجعة بشرية." },
      evidenceRequest: { en: "Ask for a data-flow overview, retention/deletion policy, access controls, and a dated review by the responsible privacy reviewer.", ar: "اطلب مخطط تدفق البيانات وسياسة الاحتفاظ والحذف وضوابط الوصول ومراجعة مؤرخة من مسؤول الخصوصية." },
      category: "voluntary-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["privacy", "transparency"]
    },
    {
      id: "NIST-TRANSPARENCY-USER-NOTICE",
      title: { en: "Explain the system's role and limitations to users", ar: "وضّح للمستخدمين دور النظام وحدوده" },
      description: { en: "Illustrative prompt: document what the AI does, what it does not decide, important limitations, and how a person can request help or review.", ar: "سؤال توضيحي: وثّق ما الذي يفعله الذكاء الاصطناعي وما لا يقرره والحدود المهمة وكيف يمكن للمستخدم طلب المساعدة أو المراجعة." },
      domain: "transparency",
      sourceId: "NIST-AI-RMF-PLAYBOOK",
      originalReference: "Project-added prompt informed by the voluntary Playbook; no subcategory ID or direct NIST requirement is asserted",
      relevance: { en: "Useful when people rely on or are affected by AI outputs; tailor notices to the actual service and audience.", ar: "قد يفيد عندما يعتمد الأشخاص على مخرجات الذكاء الاصطناعي أو يتأثرون بها؛ ويجب مواءمة الإشعار مع الخدمة والجمهور." },
      evidenceRequest: { en: "Ask for the approved user notice, a description of known limitations, and the human escalation route.", ar: "اطلب إشعار المستخدم المعتمد ووصفاً للحدود المعروفة ومسار التصعيد إلى الموظف المختص." },
      category: "voluntary-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["transparency", "human-review"]
    },
    {
      id: "NIST-FAIRNESS-IMPACT-REVIEW",
      title: { en: "Plan checks for unequal impacts on affected groups", ar: "خطّط لفحص اختلاف الأثر على الفئات المتأثرة" },
      description: { en: "Illustrative prompt: identify affected groups, choose a justified evaluation method, and record limitations; do not infer fairness from a score or evidence inventory.", ar: "سؤال توضيحي: حدّد الفئات المتأثرة واختر منهج تقييم مبرراً وسجّل حدوده؛ لا تستنتج العدالة من درجة أو قائمة أدلة." },
      domain: "fairness",
      sourceId: "NIST-AI-RMF-PLAYBOOK",
      originalReference: "Project-added prompt informed by the voluntary Playbook; no subcategory ID or direct NIST requirement is asserted",
      relevance: { en: "Relevant when outputs may differ across language or user groups; the reviewer determines a proportionate test scope.", ar: "ذو صلة عندما قد تختلف المخرجات بين اللغات أو فئات المستخدمين؛ ويحدد المراجع نطاق اختبار مناسباً." },
      evidenceRequest: { en: "Ask for a dated evaluation plan, justified group measures, observed results, limitations, and reviewer notes.", ar: "اطلب خطة تقييم مؤرخة ومقاييس مبررة للفئات والنتائج المرصودة والحدود وملاحظات المراجع." },
      category: "voluntary-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["fairness", "performance"]
    },
    {
      id: "NIST-HUMAN-OVERSIGHT-ROLES",
      title: { en: "Define human review and escalation roles", ar: "حدّد أدوار المراجعة البشرية والتصعيد" },
      description: { en: "Illustrative prompt: specify when a person reviews an output, what decisions remain human-owned, and how errors or appeals are escalated.", ar: "سؤال توضيحي: حدّد متى يراجع الشخص المخرجات والقرارات التي تبقى بشرية وكيفية تصعيد الأخطاء أو الاعتراضات." },
      domain: "human-review",
      sourceId: "NIST-AI-RMF-PLAYBOOK",
      originalReference: "Project-added prompt informed by the voluntary Playbook; no subcategory ID or direct NIST requirement is asserted",
      relevance: { en: "Important where outputs inform public services or consequential decisions; the prototype cannot replace an authorized reviewer.", ar: "مهم عندما تؤثر المخرجات في الخدمات العامة أو القرارات المهمة؛ ولا يحل النموذج الأولي محل المراجع المخوّل." },
      evidenceRequest: { en: "Ask for a named review role, decision boundaries, escalation and appeal steps, and a dated operating procedure.", ar: "اطلب دور المراجع بالاسم وحدود القرار وخطوات التصعيد والاعتراض وإجراء تشغيل مؤرخ." },
      category: "voluntary-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["human-review", "governance"]
    },
    {
      id: "UAE-VERIFY-APPLICABILITY",
      title: { en: "Verify which UAE publications apply to this entity and use", ar: "تحقّق من المنشورات الإماراتية المنطبقة على الجهة والاستخدام" },
      description: { en: "Use official UAE AI resources as a discovery point, then have the entity identify and verify the specific current publication and its applicability.", ar: "استخدم موارد الذكاء الاصطناعي الإماراتية الرسمية للبحث، ثم دع الجهة تحدد المنشور الحالي بعينه وتتحقق من انطباقه." },
      domain: "governance",
      sourceId: "UAE-AI-RESOURCES",
      originalReference: "Official resource landing page; no legal clause asserted",
      relevance: { en: "Applicability depends on the entity, use case, and current official requirements; this prototype cannot decide it.", ar: "يتوقف الانطباق على الجهة والاستخدام والمتطلبات الرسمية الحالية؛ ولا يحدده هذا النموذج الأولي." },
      evidenceRequest: { en: "Ask for the exact official publication, version/date, applicability rationale, and the responsible policy/legal reviewer.", ar: "اطلب المنشور الرسمي المحدد وإصداره/تاريخه ومبرر الانطباق واسم مراجع السياسات أو الشؤون القانونية." },
      category: "official-reference",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["governance", "privacy", "transparency", "human-review"]
    },
    {
      id: "OECD-REFERENCE-REVIEW",
      title: { en: "Consider the OECD AI Principles as an optional reference", ar: "انظر في مبادئ OECD كمرجع اختياري" },
      description: { en: "Review the current OECD AI Principles and record whether any are useful to the organization's own policy mapping.", ar: "راجع مبادئ OECD الحالية وسجّل ما إذا كان أي منها مفيداً لمواءمة سياسات الجهة." },
      domain: "governance",
      sourceId: "OECD-AI-PRINCIPLES",
      originalReference: "OECD AI Principles page; no numbered principle mapped",
      relevance: { en: "An optional cross-jurisdictional reference may help explain policy choices; it does not determine UAE legal obligations.", ar: "قد يساعد مرجع دولي اختياري في شرح خيارات السياسات، لكنه لا يحدد الالتزامات القانونية الإماراتية." },
      evidenceRequest: { en: "Ask for the applicable principle text as cited by the reviewer and a short rationale; do not claim certification.", ar: "اطلب النص الذي استشهد به المراجع ومبرراً موجزاً؛ لا تدّعِ وجود شهادة." },
      category: "voluntary-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["governance", "fairness", "transparency", "human-review"]
    },
    {
      id: "OWASP-SECURITY-REVIEW",
      title: { en: "Review current GenAI application-security guidance", ar: "راجع إرشادات أمن تطبيقات الذكاء الاصطناعي التوليدي الحالية" },
      description: { en: "Use the current OWASP GenAI material to inform a security review; confirm the edition and relevant topics directly with OWASP.", ar: "استفد من مواد OWASP الحالية لتوجيه المراجعة الأمنية؛ وتحقق مباشرة من الإصدار والموضوعات ذات الصلة." },
      domain: "security",
      sourceId: "OWASP-GENAI",
      originalReference: "OWASP GenAI project; specific item/edition not verified",
      relevance: { en: "Relevant when the use case includes a generative model, external content, or tools; the reviewer determines applicability.", ar: "قد يكون ذا صلة عند استخدام نموذج توليدي أو محتوى خارجي أو أدوات؛ ويحدد المراجع الانطباق." },
      evidenceRequest: { en: "Ask for a dated security assessment and test report reviewed by an accountable security specialist.", ar: "اطلب تقييماً أمنياً وتقرير اختبار مؤرخين راجعهما مختص أمن مسؤول." },
      category: "optional-security-guidance",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["security", "privacy"]
    },
    {
      id: "ISO42001-MANAGEMENT-SYSTEM",
      title: { en: "Consider AI management-system practices (licensed standard)", ar: "انظر في ممارسات نظام إدارة الذكاء الاصطناعي (معيار مرخّص)" },
      description: { en: "The public ISO summary describes an organization-wide AI management-system standard and Plan-Do-Check-Act. Obtain licensed text before mapping specific requirements.", ar: "يصف ملخص ISO العام معياراً لنظام إدارة الذكاء الاصطناعي على مستوى المؤسسة ومنهجية خطط-نفّذ-تحقق-حسّن. احصل على النص المرخّص قبل مواءمة متطلبات محددة." },
      domain: "governance",
      sourceId: "ISO-42001",
      originalReference: "ISO public summary only; no clause number or conformity claim",
      relevance: { en: "May inform organization-wide governance planning, but is not a per-model approval or a free public checklist.", ar: "قد يفيد تخطيط الحوكمة المؤسسية، لكنه ليس موافقة لكل نموذج أو قائمة مجانية متاحة." },
      evidenceRequest: { en: "Ask for licensed-standard access and an expert's documented mapping; do not ask for a certificate as a substitute for review.", ar: "اطلب وصولاً مرخّصاً للمعيار ومواءمة موثقة من مختص؛ ولا تعتبر الشهادة بديلاً عن المراجعة." },
      category: "licensed-standard-reference",
      reviewStatus: "needs-review",
      reviewer: "",
      lastReviewed: null,
      areas: ["governance", "human-review"]
    }
  ];

  const COLLECTIONS = [
    "sources", "guidance", "useCases", "modelProfiles", "tests",
    "evidence", "decisions", "versions", "auditEvents"
  ];
  const DATABASE_RECORDS = [
    "sources", "guidance", "useCases", "modelProfiles", "tests",
    "evidence", "decisions", "versions", "auditEvents"
  ];
  const DOMAINS = new Set(["governance", "privacy", "transparency", "fairness", "security", "performance", "human-review"]);
  const GUIDANCE_CATEGORIES = new Set([
    "official-reference", "voluntary-guidance", "optional-security-guidance",
    "licensed-standard-reference", "internal-policy", "simulation"
  ]);
  const EVIDENCE_STATUSES = new Set(["pending-review", "satisfied", "not-satisfied", "insufficient", "not-applicable"]);
  const APPLICABILITY_STATUSES = new Set(["pending-review", "applicable", "not-applicable"]);

  function createDatabase() {
    return {
      schemaVersion: SCHEMA_VERSION,
      sources: JSON.parse(JSON.stringify(SOURCES)),
      guidance: JSON.parse(JSON.stringify(GUIDANCE)),
      useCases: [],
      modelProfiles: [],
      tests: [],
      evidence: [],
      decisions: [],
      versions: [],
      auditEvents: []
    };
  }

  function validateDatabase(database) {
    const errors = [];
    if (!database || typeof database !== "object" || Array.isArray(database) ||
        database.schemaVersion !== SCHEMA_VERSION) return ["Unsupported or invalid database schema version."];
    if (Object.keys(database).some(key => !["schemaVersion", ...COLLECTIONS].includes(key))) {
      errors.push("Database contains unsupported collections.");
    }
    for (const collection of COLLECTIONS) {
      if (!Array.isArray(database[collection])) {
        errors.push(`${collection} must be an array.`);
        continue;
      }
      if (database[collection].length > 20_000) errors.push(`${collection} exceeds the record limit.`);
      const ids = new Set();
      for (const record of database[collection]) {
        if (!record || typeof record !== "object" || Array.isArray(record) ||
            typeof record.id !== "string" || !record.id.trim() || record.id.length > 200) {
          errors.push(`${collection} contains a record without a valid ID.`);
          continue;
        }
        if (ids.has(record.id)) errors.push(`${collection} has duplicate ID ${record.id}.`);
        ids.add(record.id);
      }
    }
    if (errors.length) return errors;
    const sources = new Set(database.sources.map(item => item.id));
    const guidanceIds = new Set(database.guidance.map(item => item.id));
    const useCaseIds = new Set(database.useCases.map(item => item.id));
    const modelIds = new Set(database.modelProfiles.map(item => item.id));
    for (const source of database.sources) {
      if (typeof source.url !== "string" || !/^https:\/\/[^ ]+$/i.test(source.url) ||
          !["verified", "needs-review", "unavailable"].includes(source.verificationStatus) ||
          !source.title || typeof source.title.en !== "string" || typeof source.title.ar !== "string" ||
          typeof source.publisher !== "string" || typeof source.type !== "string" ||
          !Array.isArray(source.language) || !source.scope || typeof source.scope.en !== "string" ||
          typeof source.scope.ar !== "string" || !source.limitations ||
          typeof source.limitations.en !== "string" || typeof source.limitations.ar !== "string" ||
          typeof source.verificationNote !== "string" || typeof source.license !== "string") {
        errors.push(`${source.id} has an invalid URL or verification status.`);
      }
    }
    for (const item of database.guidance) {
      if (!sources.has(item.sourceId) ||
          !item.title || typeof item.title.en !== "string" || typeof item.title.ar !== "string" ||
          !item.description || typeof item.description.en !== "string" || typeof item.description.ar !== "string" ||
          !item.relevance || typeof item.relevance.en !== "string" || typeof item.relevance.ar !== "string" ||
          !item.evidenceRequest || typeof item.evidenceRequest.en !== "string" || typeof item.evidenceRequest.ar !== "string" ||
          !DOMAINS.has(item.domain) || !GUIDANCE_CATEGORIES.has(item.category) ||
          !["needs-review", "reviewed", "not-applicable"].includes(item.reviewStatus) ||
          typeof item.reviewer !== "string" || !Array.isArray(item.areas)) {
        errors.push(`${item.id} has invalid guidance fields or refers to an unknown source.`);
      }
    }
    for (const item of database.evidence) {
      if ((item.guidanceId && !guidanceIds.has(item.guidanceId)) ||
          (item.sourceId && !sources.has(item.sourceId)) ||
          !APPLICABILITY_STATUSES.has(item.applicability) ||
          !EVIDENCE_STATUSES.has(item.status) || typeof item.mandatory !== "boolean" ||
          typeof item.evidenceReference !== "string" || typeof item.reviewer !== "string") {
        errors.push(`${item.id} has invalid evidence fields or refers to unknown guidance/source.`);
      }
      if (item.useCaseId && !useCaseIds.has(item.useCaseId)) errors.push(`${item.id} refers to an unknown use case.`);
    }
    for (const item of database.tests) {
      if (item.modelId && !modelIds.has(item.modelId)) errors.push(`${item.id} refers to an unknown model.`);
    }
    for (const item of database.modelProfiles) {
      if (typeof item.name !== "string" || typeof item.provider !== "string" ||
          typeof item.version !== "string" || typeof item.identityStatus !== "string") {
        errors.push(`${item.id} has invalid model-profile fields.`);
      }
    }
    for (const item of database.useCases) {
      if (typeof item.name !== "string" || typeof item.description !== "string" ||
          typeof item.entity !== "string" || typeof item.classification !== "string") {
        errors.push(`${item.id} has invalid use-case fields.`);
      }
    }
    return errors;
  }

  function validateExportPackage(value) {
    if (!value || typeof value !== "object" || Array.isArray(value) ||
        value.format !== "aigov-compass-evidence-db" ||
        value.schemaVersion !== SCHEMA_VERSION || !value.database) {
      return ["This is not a supported AIGov Compass evidence-database export."];
    }
    const errors = validateDatabase(value.database);
    if (value.workspaceSnapshot !== undefined) {
      const snapshot = value.workspaceSnapshot;
      if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot) ||
          !Array.isArray(snapshot.evaluations) || snapshot.evaluations.length > 100 ||
          !Array.isArray(snapshot.passportHistory) || snapshot.passportHistory.length > 100 ||
          !Array.isArray(snapshot.audit) || snapshot.audit.length > 1_000) {
        errors.push("Workspace backup snapshot is invalid or exceeds its limits.");
      }
    }
    return errors;
  }

  function packageDatabase(database, exportedAt = new Date().toISOString(), workspaceSnapshot = null) {
    const result = {
      format: "aigov-compass-evidence-db",
      schemaVersion: SCHEMA_VERSION,
      exportedAt,
      database: JSON.parse(JSON.stringify(database))
    };
    if (workspaceSnapshot) result.workspaceSnapshot = JSON.parse(JSON.stringify(workspaceSnapshot));
    return result;
  }

  function mergeDatabase(current, incoming) {
    const merged = JSON.parse(JSON.stringify(current));
    const counts = {};
    for (const collection of COLLECTIONS) {
      const existing = new Map(merged[collection].map(item => [item.id, item]));
      let added = 0;
      let duplicate = 0;
      for (const record of incoming[collection]) {
        if (existing.has(record.id)) {
          duplicate++;
          continue;
        }
        merged[collection].push(JSON.parse(JSON.stringify(record)));
        existing.set(record.id, record);
        added++;
      }
      counts[collection] = { added, duplicate };
    }
    return { database: merged, counts };
  }

  function recommendGuidance(form) {
    const description = String(form.description || "").toLowerCase();
    const relevant = new Set(["governance"]);
    if (form.personal === "Yes" || ["Sensitive", "Confidential"].includes(form.sensitivity)) relevant.add("privacy");
    if ((form.languages || []).includes("Arabic") || (form.languages || []).length > 1) relevant.add("fairness");
    if (form.category === "Citizen services" || /eligib|decision|applicant|citizen|قرار|متعامل|طلب/.test(description)) relevant.add("human-review");
    if (/generative|language model|llm|assistant|chat|توليدي|محادث/.test(description)) relevant.add("security");
    if (form.languages?.length || /benchmark|test|evaluate|اختبار|تقييم/.test(description)) relevant.add("performance");
    if (form.hosting && form.hosting !== "Undecided") relevant.add("transparency");
    return GUIDANCE.map(item => ({
      guidance: item,
      matched: item.areas.filter(area => relevant.has(area)),
      reasonKey: relevant.has(item.domain) ? item.domain : item.areas.find(area => relevant.has(area)) || "governance"
    })).filter(item => item.matched.length > 0);
  }

  return {
    SCHEMA_VERSION,
    SOURCES,
    GUIDANCE,
    COLLECTIONS,
    createDatabase,
    validateDatabase,
    validateExportPackage,
    packageDatabase,
    mergeDatabase,
    recommendGuidance
  };
});
