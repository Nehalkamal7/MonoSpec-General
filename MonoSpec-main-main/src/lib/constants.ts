import { Company, StageDefinition } from '@/types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'awamer',
    name: 'Awamer Alshabaka',
    nameAr: 'أوامر الشبكة',
    tagline: 'Enterprise Digital Transformation & Web Platforms',
    code: 'AWM',
    industry: 'Enterprise Software & Cloud Systems',
  },
  {
    id: 'creative',
    name: 'Creative System',
    nameAr: 'النظام الإبداعي',
    tagline: 'High-Performance FinTech & SaaS Product Engineering',
    code: 'CRT',
    industry: 'FinTech & SaaS Engineering',
  },
];

export const COMPANIES: Record<string, Company> = INITIAL_COMPANIES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {} as Record<string, Company>);

export const STAGES: StageDefinition[] = [
  {
    id: 'tech_analysis',
    index: 1,
    labelEn: 'Technical Analysis',
    labelAr: 'التحليل الفني',
    shortDesc: 'System architecture, data schemas, security boundaries & integrations',
    shortDescAr: 'معمارية النظام، مخططات البيانات، حدود الأمان والتكاملات التقنية',
    badge: 'ARCH-01',
    isRecommended: true,
  },
  {
    id: 'logo',
    index: 2,
    labelEn: 'Logo & Brand Identity',
    labelAr: 'تصميم اللوجو والهوية',
    shortDesc: 'Brand mark geometry, color tokens, typography scales, SVG assets & design guidelines',
    shortDescAr: 'هندسة الشعار، منظومة الألوان والخطوط، ملفات SVG ودليل الهوية البصرية',
    badge: 'LOGO-02',
    isRecommended: true,
  },
  {
    id: 'ui_ux',
    index: 3,
    labelEn: 'UI/UX Design & Figma',
    labelAr: 'تصميم واجهات وتجربة',
    shortDesc: 'Design tokens, layout wireframes, interactive flows & Figma sync',
    shortDescAr: 'توكنات التصميم، هياكل الشاشات السلكية، المسارات التفاعلية ومزامنة فيجما',
    badge: 'DSGN-03',
    isRecommended: true,
  },
  {
    id: 'engineering',
    index: 4,
    labelEn: 'Engineering',
    labelAr: 'برمجة وتطوير',
    shortDesc: 'Full-stack implementation, API endpoints, state logic & ORM models',
    shortDescAr: 'التطوير البرمجي الشامل، مسارات واجهات REST/gRPC ونماذج قواعد البيانات',
    badge: 'CODE-04',
    isRecommended: true,
  },
  {
    id: 'qa_testing',
    index: 5,
    labelEn: 'QA & Testing',
    labelAr: 'اختبار وجودة',
    shortDesc: 'End-to-end assertions, load testing, regression suite & security audits',
    shortDescAr: 'اختبارات شاملة E2E، فحص الأحمال والضغط، وتدقيق الثغرات الأمنية',
    badge: 'TEST-05',
    isRecommended: true,
  },
  {
    id: 'content',
    index: 6,
    labelEn: 'Content',
    labelAr: 'محتوى رقمي',
    shortDesc: 'Multilingual copy, microcopy, API documentation & compliance texts',
    shortDescAr: 'صياغة النصوص متعددة اللغات، التوثيق الفني، ونصوص الامتثال التنظيمي',
    badge: 'COPY-06',
    isRecommended: true,
  },
  {
    id: 'devops',
    index: 7,
    labelEn: 'Support & DevOps',
    labelAr: 'دعم وتشغيل',
    shortDesc: 'Kubernetes manifests, CI/CD pipeline, telemetry, observability & SLA runbooks',
    shortDescAr: 'ملفات كوبرنيتس، خطوط النشر الآلي CI/CD، مراقبة الأداء وكتيبات تشغيل SLA',
    badge: 'OPS-07',
    isRecommended: true,
  },
];

export const RECOMMENDED_STAGES: StageDefinition[] = [
  ...STAGES,
  {
    id: 'security_compliance',
    index: 8,
    labelEn: 'Cybersecurity & Compliance',
    labelAr: 'الأمن والامتثال',
    shortDesc: 'NCA ECC, ZATCA, GDPR, ISO 27001 data residency & penetration testing',
    badge: 'SECU-08',
    isRecommended: false,
  },
  {
    id: 'gtm_marketing',
    index: 9,
    labelEn: 'Go-To-Market & Growth',
    labelAr: 'التسويق والإطلاق',
    shortDesc: 'Funnel analytics, conversion telemetry, onboarding walkthroughs & SEO',
    badge: 'GTM-09',
    isRecommended: false,
  },
];
