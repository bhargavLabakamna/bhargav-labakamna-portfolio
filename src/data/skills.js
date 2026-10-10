// Icons reference lucide-react icon names, resolved dynamically in SkillCard.

export const skillCategories = [
  {
    id: 'backend',
    title: 'Backend',
    skills: [
      { name: 'PHP', icon: 'Code2', description: 'Core server-side logic and custom application architecture.' },
      { name: 'Laravel', icon: 'Layers', description: 'MVC applications, Eloquent ORM, queues and artisan tooling.' },
      { name: 'REST API', icon: 'Webhook', description: 'Designing and consuming endpoints for web and mobile clients.' },
      { name: 'JSON', icon: 'Braces', description: 'Structured request and response handling across services.' },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    skills: [
      { name: 'MySQL', icon: 'Database', description: 'Schema design, query optimization and relational data modeling.' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: [
      { name: 'HTML', icon: 'FileCode', description: 'Semantic, accessible markup for every interface.' },
      { name: 'CSS', icon: 'Paintbrush', description: 'Responsive layouts and clean visual presentation.' },
      { name: 'JavaScript', icon: 'FileJson2', description: 'Interactive, dynamic behaviour on the client side.' },
      { name: 'jQuery', icon: 'MousePointerClick', description: 'DOM interaction and event handling in legacy and hybrid stacks.' },
      { name: 'AJAX', icon: 'RefreshCw', description: 'Asynchronous data exchange without full page reloads.' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    skills: [
      { name: 'Payment Gateway', icon: 'CreditCard', description: 'PAYTM integration for secure online transactions.' },
      { name: 'SMTP', icon: 'Mail', description: 'Transactional email delivery and configuration.' },
      { name: 'SMS Gateway', icon: 'MessageSquare', description: 'Automated SMS notifications and alerts.' },
      { name: 'WhatsApp Services', icon: 'MessageCircle', description: 'Business messaging integration for customer updates.' },
      { name: 'Google APIs', icon: 'Chrome', description: 'Auth, Maps and Reviews API integration.' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & Features',
    skills: [
      { name: 'PDF Generation', icon: 'FileText', description: 'Dynamic document generation for invoices and reports.' },
      { name: 'Image Processing', icon: 'Image', description: 'PNG and image handling, resizing and optimization.' },
      { name: 'Excel Import/Export', icon: 'Sheet', description: 'Bulk data handling for admin and reporting workflows.' },
    ],
  },
]
