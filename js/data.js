/* Local fallback data (mirror of data/portfolio.json). Used when API_BASE_URL is empty or the API is unreachable. */
window.PORTFOLIO_DATA = {
  "profile": {
    "name": "Vikas Kumar Mishra",
    "shortName": "Vikas",
    "title": "Full Stack .NET Developer",
    "roles": [
      "Full Stack .NET Developer",
      "ASP.NET Core Engineer",
      "Angular Developer",
      "SQL Server Optimizer"
    ],
    "tagline": "I build secure, scalable enterprise web applications for large telecom platforms like AT&T and Cricket Wireless.",
    "location": "Delhi, India",
    "phone": "+91-9598508060",
    "email": "devvikasmishra@gmail.com",
    "linkedin": "https://www.linkedin.com/in/vikasbits",
    "resumeUrl": "",
    "photo": "images/profile.jpg",
    "available": true,
    "summary": "Full Stack .NET Developer with 4+ years of experience building and maintaining enterprise-scale web applications for large telecom platforms, including AT&T and Cricket Wireless. Strong expertise in ASP.NET Core, ASP.NET Web API, C#, Angular, TypeScript, and SQL Server. Experienced in designing secure, scalable RESTful APIs using Clean Architecture, SOLID principles, and Dependency Injection, and in tuning SQL Server queries and stored procedures for high-volume transactional systems. Consistently delivers 40 to 50+ Change Requests per release cycle in Agile Scrum teams, with a focus on code quality through code reviews, SonarQube static analysis, and unit testing."
  },
  "stats": [
    {
      "value": 4,
      "suffix": "+",
      "label": "Years Experience"
    },
    {
      "value": 150,
      "suffix": "+",
      "label": "Change Requests Delivered"
    },
    {
      "value": 60,
      "suffix": "K+",
      "label": "Subscribers Served"
    },
    {
      "value": 2,
      "suffix": "",
      "label": "Enterprise Telecom Platforms"
    }
  ],
  "skills": [
    {
      "category": "Languages",
      "icon": "code",
      "items": [
        "C#",
        "TypeScript",
        "JavaScript",
        "Python"
      ]
    },
    {
      "category": "Backend",
      "icon": "server",
      "items": [
        "ASP.NET Core",
        "ASP.NET Core Web API",
        "ASP.NET MVC",
        "ASP.NET Web Forms",
        "Entity Framework",
        "ADO.NET",
        "LINQ"
      ]
    },
    {
      "category": "Frontend",
      "icon": "layout",
      "items": [
        "Angular",
        "Angular Material",
        "AJAX",
        "jQuery",
        "HTML5",
        "CSS3",
        "Bootstrap"
      ]
    },
    {
      "category": "Architecture & Design",
      "icon": "layers",
      "items": [
        "Clean Architecture",
        "Microservices",
        "RESTful API Design",
        "N-Tier Architecture",
        "SOLID Principles",
        "Dependency Injection",
        "Design Patterns",
        "OOP"
      ]
    },
    {
      "category": "Databases",
      "icon": "database",
      "items": [
        "SQL Server",
        "MySQL",
        "Oracle",
        "Stored Procedures",
        "Indexing",
        "Query Optimization"
      ]
    },
    {
      "category": "API & Security",
      "icon": "shield",
      "items": [
        "JWT Authentication",
        "Swagger / OpenAPI",
        "Third-Party API Integration"
      ]
    },
    {
      "category": "Cloud & DevOps",
      "icon": "cloud",
      "items": [
        "Microsoft Azure",
        "IIS",
        "CI/CD Pipelines",
        "Git",
        "SourceTree"
      ]
    },
    {
      "category": "Testing & Quality",
      "icon": "check",
      "items": [
        "Unit Testing",
        "Postman",
        "SonarQube",
        "Code Review",
        "Debugging",
        "Root-Cause Analysis"
      ]
    },
    {
      "category": "Methodologies",
      "icon": "refresh",
      "items": [
        "Agile",
        "Scrum",
        "SDLC"
      ]
    }
  ],
  "experience": [
    {
      "role": "Software Engineer",
      "company": "Plasma Softtech Pvt. Ltd.",
      "period": "June 2023 – Present",
      "location": "Noida, India",
      "highlights": [
        "Design, develop, and maintain enterprise-scale web applications using ASP.NET Core, C#, Angular, and SQL Server for large telecom clients in production environments.",
        "Deliver 40+ Change Requests (CRs) and feature enhancements per release cycle, consistently meeting sprint deadlines across multiple telecom platforms.",
        "Build secure, scalable RESTful APIs with JWT authentication and Swagger/OpenAPI documentation, improving cross-system integration and maintainability.",
        "Apply Clean Architecture (Domain, Application, Infrastructure, and API layers) with SOLID principles and Dependency Injection to improve testability and long-term maintainability.",
        "Develop reusable, modular Angular components and services, reducing development time for new frontend features.",
        "Enforce code quality with Git, SourceTree, peer code reviews, and SonarQube static analysis, reducing critical production bugs.",
        "Mentor junior developers on ASP.NET Core best practices, coding standards, and debugging techniques.",
        "Document API contracts and technical specifications and lead knowledge-transfer sessions for new team members."
      ]
    },
    {
      "role": "Junior Software Developer",
      "company": "Plasma Softtech Pvt. Ltd.",
      "period": "July 2021 – May 2023",
      "location": "Noida, India",
      "highlights": [
        "Developed and maintained ASP.NET MVC and ASP.NET Web Forms applications for telecom clients, gaining strong foundations in C# and SQL Server.",
        "Built frontend modules using Angular, TypeScript, HTML5, CSS3, and Bootstrap, improving UI consistency across web applications.",
        "Wrote and optimized SQL Server stored procedures, views, and queries for reporting and data-processing workflows.",
        "Implemented RESTful Web APIs with ASP.NET Web API and integrated them with Angular frontends and third-party services.",
        "Participated actively in Agile Scrum ceremonies — sprint planning, daily stand-ups, retrospectives, and demos.",
        "Fixed production bugs, performed root-cause analysis, and documented solutions for recurring issues.",
        "Collaborated with senior developers on architecture decisions and code reviews to improve code quality."
      ]
    },
    {
      "role": "Software Development Intern",
      "company": "Plasma Softtech Pvt. Ltd.",
      "period": "January 2021 – June 2021",
      "location": "Noida, India",
      "highlights": [
        "Assisted in developing internal tools and client modules using C#, ASP.NET MVC, and SQL Server.",
        "Learned and applied OOP principles, SOLID design, and basic software design patterns under senior guidance.",
        "Wrote SQL queries and assisted with database testing, data validation, and report generation.",
        "Participated in daily stand-ups and sprint reviews, gaining hands-on exposure to Agile delivery.",
        "Built small Angular components for dashboard and reporting screens, improving exposure to full-stack development."
      ]
    }
  ],
  "projects": [
    {
      "name": "PAOS – AT&T",
      "subtitle": "Telecom Enterprise Platform",
      "description": "Large-scale telecom platform supporting order processing, provisioning, and account management workflows for AT&T, serving 60K+ subscribers.",
      "tech": [
        "ASP.NET Core",
        "Angular",
        "SQL Server",
        "Entity Framework",
        "ADO.NET",
        "IIS"
      ],
      "metric": "50+ CRs · 60K+ subscribers",
      "url": "",
      "highlights": [
        "Implemented 50+ Change Requests end-to-end, from requirement analysis and technical design through development, unit testing, and production deployment.",
        "Designed secure RESTful APIs using N-tier architecture, enabling seamless integration between the Angular front end, backend services, and downstream AT&T systems.",
        "Optimized SQL Server queries, stored procedures, and indexing strategies, improving execution time and API response times for high-traffic endpoints.",
        "Built the data access layer with Entity Framework and ADO.NET, balancing ORM productivity with raw ADO.NET performance for high-volume transactions.",
        "Resolved high-priority production incidents under tight SLAs through root-cause analysis of API failures and data inconsistencies, minimizing customer-facing downtime.",
        "Implemented asynchronous UI updates using AJAX and Angular services, and performed cross-browser and responsive testing.",
        "Coordinated with the DevOps team on CI/CD deployments to IIS-hosted environments, shortening release turnaround.",
        "Collaborated with QA engineers, business analysts, and AT&T stakeholders in sprint planning, stand-ups, and retrospectives."
      ]
    },
    {
      "name": "Cricket Wireless",
      "subtitle": "Telecom Product Suite",
      "description": "Prepaid telecom product suite with customer-facing self-service and account management applications requiring continuous feature development and third-party integrations.",
      "tech": [
        "ASP.NET Core",
        "Angular",
        "Angular Material",
        "SQL Server",
        "REST APIs"
      ],
      "metric": "50+ CRs · Third-party integrations",
      "url": "",
      "highlights": [
        "Delivered 50+ Change Requests, feature enhancements, and third-party API integrations for customer-facing self-service modules.",
        "Designed and implemented third-party API integrations, enabling reliable data exchange between Cricket Wireless systems and external service providers.",
        "Enhanced frontend functionality with Angular and Angular Material, improving UI responsiveness and user experience.",
        "Refactored legacy backend logic and optimized SQL queries, improving maintainability and reducing processing time for high-volume workflows.",
        "Diagnosed and resolved production defects raised through support tickets and monitoring tools, improving overall application stability.",
        "Applied SOLID principles and Dependency Injection in a Clean Architecture-based structure, simplifying unit testing of shared services.",
        "Supported production releases with deployment verification and post-release monitoring, and documented designs, test cases, and RCAs."
      ]
    },
    {
      "name": "Inventory Management System",
      "subtitle": "Enterprise Inventory & Stock Control",
      "description": "Full-stack inventory management platform with stock tracking, supplier management, purchase orders, low-stock alerts, and reporting dashboards for multi-warehouse operations.",
      "tech": [
        "ASP.NET Core",
        "C#",
        "Angular",
        "SQL Server",
        "Entity Framework Core",
        "JWT"
      ],
      "metric": "Multi-warehouse · Real-time stock",
      "url": "",
      "highlights": [
        "Built the full-stack application with ASP.NET Core Web API backend and Angular frontend using Clean Architecture and SOLID principles.",
        "Implemented product, supplier, and warehouse modules with CRUD operations, validation, and role-based access control using JWT.",
        "Designed and optimized SQL Server schema with stored procedures and indexing for fast stock-level and reporting queries.",
        "Developed real-time low-stock alerts and auto-generated purchase order suggestions based on configurable thresholds.",
        "Created Angular Material dashboards with charts and filters for inventory turnover, stock valuation, and supplier performance.",
        "Integrated Swagger/OpenAPI documentation and unit tests for API endpoints, reducing integration and regression issues.",
        "Implemented audit logging and transaction history for stock movements, improving traceability and compliance."
      ]
    },
    {
      "name": "Library Management System",
      "subtitle": "Digital Library & Book Lending",
      "description": "Library automation system for book cataloging, member management, book issuing/return, fine calculation, reservations, and reporting for academic institutions.",
      "tech": [
        "ASP.NET Core",
        "C#",
        "Angular",
        "SQL Server",
        "Entity Framework Core",
        "Bootstrap"
      ],
      "metric": "Catalog · Lending · Fines",
      "url": "",
      "highlights": [
        "Developed end-to-end library workflows: book cataloging, member registration, issue/return, reservations, and fine calculation with automated due-date logic.",
        "Designed normalized SQL Server schema with stored procedures for fast search, availability checks, and overdue reports.",
        "Built role-based dashboards for admins, librarians, and members using Angular and Bootstrap with responsive layouts.",
        "Implemented search and filter features (title, author, ISBN, category) with pagination and debounced API calls for performance.",
        "Automated fine calculation and email notifications for due and overdue books using background jobs and templated emails.",
        "Added reporting modules for most-borrowed books, active members, and monthly circulation statistics.",
        "Wrote unit tests and integrated Swagger for API validation and smoother QA handoff."
      ]
    },
    {
      "name": "Cafe Management System",
      "subtitle": "POS & Order Management",
      "description": "Cafe point-of-sale and order management system covering menu management, table ordering, billing, kitchen display, and daily sales reporting for a multi-counter cafe.",
      "tech": [
        "ASP.NET Core",
        "C#",
        "Angular",
        "SQL Server",
        "REST APIs",
        "Bootstrap"
      ],
      "metric": "POS · Kitchen · Billing",
      "url": "",
      "highlights": [
        "Built a full-featured POS system with menu management, table ordering, item customization, and instant billing.",
        "Developed a kitchen display module that pushes new orders in real time and tracks preparation status, reducing order turnaround time.",
        "Implemented GST-compliant billing with discounts, split payments, and printable receipts using templated invoice generation.",
        "Designed SQL Server schema and stored procedures for orders, items, tables, and daily sales with optimized reporting queries.",
        "Built admin dashboards for sales analytics, top-selling items, and shift-wise revenue using Angular charts.",
        "Added role-based access for admin, cashier, and kitchen staff with JWT authentication and protected API routes.",
        "Integrated Swagger documentation and unit tests for core order and billing endpoints."
      ]
    }
  ],
  "achievements": [
    {
      "title": "Consistent Delivery",
      "text": "Delivered 40 to 50+ Change Requests per release cycle across two enterprise telecom platforms while maintaining high code quality."
    },
    {
      "title": "Fewer Defects",
      "text": "Reduced critical and blocker-level defects before release through disciplined code reviews, SonarQube analysis, and unit testing."
    },
    {
      "title": "Better Architecture",
      "text": "Introduced Clean Architecture and SOLID design practices across project modules, improving testability and reducing onboarding time."
    },
    {
      "title": "Stakeholder Trust",
      "text": "Recognized by cross-functional stakeholders for reliable, on-time delivery in fast-paced Agile Scrum release cycles."
    }
  ],
  "education": [
    {
      "degree": "B.Tech, Computer Science & Engineering",
      "institution": "Nitra Technical Campus, Ghaziabad",
      "period": ""
    },
    {
      "degree": "Diploma, Computer Science & Engineering",
      "institution": "Government Polytechnic, Saharanpur",
      "period": ""
    }
  ],
  "softSkills": [
    "Stakeholder Communication",
    "Problem-Solving",
    "Team Mentoring",
    "Time Management",
    "Adaptability",
    "Attention to Detail"
  ],
  "interests": []
};
