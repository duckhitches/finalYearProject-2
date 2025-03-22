// Define the category structure
export interface Category {
  id: string;
  name: string;
  description: string;
  modules: {
    id: number;
    title: string;
    description: string;
  }[];
}

// Define topic structure for the LearningPage component
export interface InteractiveQuiz {
  type: 'quiz';
  question: string;
  options: string[];
  correctAnswer?: string;
}

export interface InteractiveActivity {
  type: 'activity';
  name: string;
  description: string;
  allowUpload?: boolean;
  dragDropItems?: {
    items: string[];
    dropZones: string[];
    correctPairings: { [key: string]: string };
  };
}

export type InteractiveElement = InteractiveQuiz | InteractiveActivity;

export interface TheorySection {
  title: string;
  content: string;
  keyPoints: string[];
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  splineUrl: string;
  theory: TheorySection[];
  interactiveElements: InteractiveElement[];
}

// Hardcoded categories and modules
export const categories: Category[] = [
  {
    id: 'introduction',
    name: 'Introduction',
    description: 'Learn about the basic concepts of children\'s rights',
    modules: [
      { id: 1, title: "Introduction to Children's Rights", description: 'Understanding the fundamental rights of every child' },
      { id: 2, title: "Protection of Children", description: 'Understanding child protection and safety measures' },
      { id: 3, title: "Children's Health", description: 'Exploring physical and mental health aspects' }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Educational rights for children',
    modules: [
      { id: 4, title: "Child Development", description: 'Understanding physical, mental, and social development' },
      { id: 5, title: "Child Participation", description: 'Learning about active participation and decision-making' },
      { id: 6, title: "Quality Education", description: 'Understanding what makes education accessible and effective' }
    ]
  },
  {
    id: 'child-labor',
    name: 'Child Labor',
    description: 'Understanding and preventing child labor',
    modules: [
      { id: 7, title: "Understanding Child Labor", description: 'Learn about what constitutes child labor and its global impact' },
      { id: 8, title: "Effects of Child Labor", description: 'Understand how child labor affects development and well-being' },
      { id: 9, title: "Preventing Child Labor", description: 'Explore strategies to prevent and eliminate child labor' }
    ]
  },
  {
    id: 'health',
    name: 'Health and Wellbeing',
    description: 'Children\'s health and wellbeing rights',
    modules: [
      { id: 10, title: "Physical Health", description: 'Understanding the importance of physical health for children' },
      { id: 11, title: "Mental Health", description: 'Learning about children\'s mental health and emotional wellbeing' },
      { id: 12, title: "Healthcare Access", description: 'Ensuring all children have access to quality healthcare' }
    ]
  },
  {
    id: 'protection',
    name: 'Child Protection',
    description: 'Protecting children from harm and abuse',
    modules: [
      { id: 13, title: "Safety from Harm", description: 'Understanding how to protect children from physical harm' },
      { id: 14, title: "Online Safety", description: 'Protecting children in digital environments' },
      { id: 15, title: "Emotional Security", description: 'Building environments where children feel emotionally secure' }
    ]
  }
];

// Detailed topics for Learning Page
export const topics: Topic[] = [
  {
    id: 1,
    title: "Introduction to Children's Rights",
    description: "Learn about the fundamental rights of children and their importance in society.",
    videoUrl: "https://www.youtube.com/embed/HHNfaPuoZHM?si=Ipl_nz-S2DI38My_",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "What are Children's Rights?",
        content: "Children's rights are the human rights of children with particular attention to the rights of special protection and care afforded to minors.",
        keyPoints: [
          "Every child has the right to survival and development",
          "Protection from discrimination",
          "Best interests of the child should be a primary consideration",
          "Views of the child should be respected"
        ]
      }
    ],
    interactiveElements: [
      {
        type: 'quiz',
        question: "Which of these is a fundamental right of children?",
        options: ["Education", "Work", "Drive", "Vote"],
        correctAnswer: "Education"
      },
      {
        type: "activity",
        name: "Match Rights Categories",
        description: "Drag and drop the rights to their correct categories",
        dragDropItems: {
          items: ["Education", "Healthcare", "Play", "Protection"],
          dropZones: ["Basic Rights", "Social Rights", "Development Rights", "Safety Rights"],
          correctPairings: {
            "Education": "Development Rights",
            "Healthcare": "Basic Rights",
            "Play": "Social Rights",
            "Protection": "Safety Rights"
          }
        }
      }
    ]
  },
  {
    id: 2,
    title: "The Right to Education",
    description: "Understand the importance of education as a fundamental right for children.",
    videoUrl: " https://www.youtube.com/embed/xq6BxsZU_TI",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Education as a Fundamental Right",
        content: "Education is a fundamental human right and essential for the exercise of all other human rights.",
        keyPoints: [
          "Free primary education",
          "Equal access to education",
          "Quality of education",
          "Safe learning environment"
        ]
      }
    ],
    interactiveElements: [
      {
        type: 'quiz',
        question: "What is a key aspect of the right to education?",
        options: ["Free primary education", "Paid schooling", "Optional attendance", "Limited access"],
        correctAnswer: "Free primary education"
      }
    ]
  },
  {
    id: 3,
    title: "Protection from Child Labor",
    description: "Learn about child labor issues and the importance of protecting children from exploitation.",
    videoUrl: "https://www.youtube.com/embed/k7EqKfonbgc",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Understanding Child Labor",
        content: "Child labor is work that deprives children of their childhood, their potential and their dignity, and that is harmful to physical and mental development.",
        keyPoints: [
          "Definition of child labor",
          "Impact on children's development",
          "Global statistics",
          "Prevention measures"
        ]
      }
    ],
    interactiveElements: [
      {
        type: 'quiz',
        question: "What is the main issue with child labor?",
        options: ["It provides income", "It deprives childhood", "It teaches skills", "It saves money"],
        correctAnswer: "It deprives childhood"
      }
    ]
  },
  {
    id: 4,
    title: "Child Development",
    description: "Understanding physical, mental, and social development...",
    videoUrl: "https://www.youtube.com/embed/V1BFLitBkco",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Stages of Development",
        content: "Child development includes physical, cognitive, social, and emotional growth. Each stage is crucial and builds upon previous stages to support healthy development.",
        keyPoints: [
          "Physical development milestones",
          "Cognitive growth and learning",
          "Social skill development",
          "Emotional maturity"
        ]
      },
      {
        title: "Supporting Development",
        content: "Understanding how to support healthy development through appropriate activities, interactions, and environments that promote growth in all areas.",
        keyPoints: [
          "Age-appropriate activities",
          "Supportive relationships",
          "Learning through play",
          "Building independence"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "What helps development most?", 
        options: ["Play", "Study", "Both", "Neither"],
        correctAnswer: "Both"
      },
      { 
        type: "activity", 
        name: "Growth Timeline", 
        description: "Create a timeline of your own development milestones",
        dragDropItems: {
          items: ["Baby", "Toddler", "Child", "Teen"],
          dropZones: ["0-1 years", "1-3 years", "3-12 years", "13-18 years"],
          correctPairings: {
            "Baby": "0-1 years",
            "Toddler": "1-3 years", 
            "Child": "3-12 years",
            "Teen": "13-18 years"
          }
        }
      }
    ]
  },
  {
    id: 5,
    title: "Child Participation",
    description: "Learning about active participation and decision-making...",
    videoUrl: "https://www.youtube.com/embed/COjVj9czgrY",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Right to Participate",
        content: "Children have the right to participate in decisions affecting their lives. This includes expressing their views and having those views taken seriously in accordance with their age and maturity.",
        keyPoints: [
          "Voice in decision-making",
          "Freedom of expression",
          "Active participation in community",
          "Respect for opinions"
        ]
      },
      {
        title: "Forms of Participation",
        content: "Understanding different ways children can participate in family, school, and community life, and how this participation contributes to their development and society.",
        keyPoints: [
          "School councils and committees",
          "Community projects",
          "Family decision-making",
          "Youth advocacy"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "How can you participate?", 
        options: ["Share ideas", "Join activities", "Both", "None"],
        correctAnswer: "Both"
      },
      { 
        type: "activity", 
        name: "Participation Project", 
        description: "Design a project to improve your community",
        dragDropItems: {
          items: ["Environmental", "Social", "Educational", "Health"],
          dropZones: ["Clean-up", "Volunteering", "Tutoring", "Awareness"],
          correctPairings: {
            "Environmental": "Clean-up",
            "Social": "Volunteering",
            "Educational": "Tutoring",
            "Health": "Awareness"
          }
        }
      }
    ]
  },
  {
    id: 6,
    title: "Quality Education",
    description: "Understanding what makes education accessible and effective...",
    videoUrl: "https://www.youtube.com/embed/LbNUT7KQzQo",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Equal Access to Education",
        content: "Quality education means ensuring that all children, regardless of their background, have equal access to educational opportunities that help them reach their full potential.",
        keyPoints: [
          "Removing barriers to education",
          "Inclusive learning environments",
          "Addressing resource inequalities",
          "Supporting disadvantaged groups"
        ]
      },
      {
        title: "Effective Teaching Methods",
        content: "Quality education involves using teaching methods that engage children, promote critical thinking, and support different learning styles and abilities.",
        keyPoints: [
          "Learner-centered approaches",
          "Diverse teaching strategies",
          "Practical and relevant curriculum",
          "Continuous assessment and feedback"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "What is essential for quality education?", 
        options: ["Expensive facilities", "Qualified teachers", "Lots of homework", "Long school hours"],
        correctAnswer: "Qualified teachers"
      },
      { 
        type: "activity", 
        name: "Educational Resources", 
        description: "Match educational resources with their benefits",
        dragDropItems: {
          items: ["Books", "Technology", "Field trips", "Group projects"],
          dropZones: ["Knowledge", "Skills", "Experience", "Collaboration"],
          correctPairings: {
            "Books": "Knowledge",
            "Technology": "Skills",
            "Field trips": "Experience",
            "Group projects": "Collaboration"
          }
        }
      }
    ]
  },
  {
    id: 7,
    title: "Understanding Child Labor",
    description: "Learn about what constitutes child labor and its global impact...",
    videoUrl: "https://www.youtube.com/embed/KN-R_X7J-yI",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Defining Child Labor",
        content: "Child labor refers to work that deprives children of their childhood, their potential and dignity, and is harmful to their physical and mental development. It includes work that interferes with their education.",
        keyPoints: [
          "Different forms of child labor",
          "Global statistics and prevalence",
          "Legal frameworks and definitions",
          "Difference between child work and child labor"
        ]
      },
      {
        title: "Root Causes",
        content: "Understanding the complex factors that contribute to child labor, including poverty, lack of access to education, social norms, and economic pressures.",
        keyPoints: [
          "Economic factors and poverty",
          "Educational barriers",
          "Cultural and social norms",
          "Lack of legal enforcement"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "Which is an example of harmful child labor?", 
        options: ["Helping with family chores", "Working in hazardous factories", "Doing homework", "School activities"],
        correctAnswer: "Working in hazardous factories"
      },
      { 
        type: "activity", 
        name: "Causes and Effects", 
        description: "Match causes of child labor with their effects",
        dragDropItems: {
          items: ["Poverty", "Lack of education", "Poor enforcement", "Social acceptance"],
          dropZones: ["Economic necessity", "Limited opportunities", "Exploitation", "Normalization"],
          correctPairings: {
            "Poverty": "Economic necessity",
            "Lack of education": "Limited opportunities",
            "Poor enforcement": "Exploitation",
            "Social acceptance": "Normalization"
          }
        }
      }
    ]
  },
  {
    id: 8,
    title: "Effects of Child Labor",
    description: "Understand how child labor affects development and well-being...",
    videoUrl: "https://www.youtube.com/embed/ikp1eenvMpQ",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Physical Impacts",
        content: "Child labor can have severe physical impacts on children, including injuries, exposure to hazardous substances, stunted growth, and long-term health problems.",
        keyPoints: [
          "Immediate physical risks and injuries",
          "Long-term health consequences",
          "Impact on physical development",
          "Exposure to harmful conditions"
        ]
      },
      {
        title: "Psychological and Social Impacts",
        content: "Beyond physical effects, child labor can also have profound psychological and social impacts, affecting a child's emotional well-being, social development, and future prospects.",
        keyPoints: [
          "Psychological trauma and stress",
          "Missed educational opportunities",
          "Social isolation and stigma",
          "Cycle of poverty and limited future prospects"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "What is a long-term effect of child labor?", 
        options: ["Better job skills", "Higher income", "Limited education", "More independence"],
        correctAnswer: "Limited education"
      },
      { 
        type: "activity", 
        name: "Impact Areas", 
        description: "Match effects of child labor with impact areas",
        dragDropItems: {
          items: ["Malnutrition", "Missing school", "Safety hazards", "Social isolation"],
          dropZones: ["Health", "Education", "Safety", "Development"],
          correctPairings: {
            "Malnutrition": "Health",
            "Missing school": "Education",
            "Safety hazards": "Safety",
            "Social isolation": "Development"
          }
        }
      }
    ]
  },
  {
    id: 9,
    title: "Preventing Child Labor",
    description: "Explore strategies to prevent and eliminate child labor...",
    videoUrl: "https://www.youtube.com/embed/TyP09S0UEzA",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Education and Awareness",
        content: "Education is a crucial component in preventing child labor, both by providing alternatives for children and by raising awareness about the harms of child labor among communities, businesses, and policymakers.",
        keyPoints: [
          "Free and accessible education",
          "Awareness campaigns",
          "Teacher training and support",
          "Family education programs"
        ]
      },
      {
        title: "Policy and Enforcement",
        content: "Effective policies, laws, and enforcement mechanisms are essential to prevent and eliminate child labor, alongside economic support for vulnerable families.",
        keyPoints: [
          "International standards and conventions",
          "National laws and enforcement",
          "Economic support for families",
          "Responsible business practices"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "What helps prevent child labor most effectively?", 
        options: ["Punishing children", "Ignoring the problem", "Comprehensive approach", "Closing businesses"],
        correctAnswer: "Comprehensive approach"
      },
      { 
        type: "activity", 
        name: "Prevention Strategies", 
        description: "Match prevention strategies with stakeholders",
        dragDropItems: {
          items: ["School programs", "Family support", "Law enforcement", "Business policies"],
          dropZones: ["Education sector", "Community", "Government", "Private sector"],
          correctPairings: {
            "School programs": "Education sector",
            "Family support": "Community",
            "Law enforcement": "Government",
            "Business policies": "Private sector"
          }
        }
      }
    ]
  },
  {
    id: 10,
    title: "Physical Health",
    description: "Understanding the importance of physical health for children...",
    videoUrl: "https://www.youtube.com/embed/FWwEMFSY1r0",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Nutrition and Growth",
        content: "Proper nutrition is fundamental to children's physical health, supporting growth, brain development, and the immune system. It's essential for children to have access to nutritious food.",
        keyPoints: [
          "Balanced diet requirements",
          "Critical nutrients for development",
          "Impact of malnutrition",
          "Healthy eating habits"
        ]
      },
      {
        title: "Physical Activity",
        content: "Regular physical activity is essential for children's health, contributing to physical development, cardiovascular health, and psychological well-being.",
        keyPoints: [
          "Benefits of regular exercise",
          "Age-appropriate physical activities",
          "Balance between activity and rest",
          "Reducing sedentary behavior"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "Why is physical activity important for children?", 
        options: ["Only for professional athletes", "Just for weight control", "Multiple health benefits", "It's not important"],
        correctAnswer: "Multiple health benefits"
      },
      { 
        type: "activity", 
        name: "Healthy Choices", 
        description: "Match healthy choices with their benefits",
        dragDropItems: {
          items: ["Fruits and vegetables", "Regular exercise", "Adequate sleep", "Regular check-ups"],
          dropZones: ["Vitamins and minerals", "Strong muscles", "Rest and recovery", "Early detection"],
          correctPairings: {
            "Fruits and vegetables": "Vitamins and minerals",
            "Regular exercise": "Strong muscles",
            "Adequate sleep": "Rest and recovery",
            "Regular check-ups": "Early detection"
          }
        }
      }
    ]
  },
  {
    id: 11,
    title: "Mental Health",
    description: "Learning about children's mental health and emotional wellbeing...",
    videoUrl: "https://www.youtube.com/embed/HHNfaPuoZHM",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Emotional Development",
        content: "Emotional development is a critical aspect of children's mental health, involving learning to understand, express, and manage emotions in healthy ways.",
        keyPoints: [
          "Recognizing and naming emotions",
          "Developing emotional regulation",
          "Building empathy and compassion",
          "Creating emotional resilience"
        ]
      },
      {
        title: "Mental Health Support",
        content: "Supporting children's mental health involves creating safe and nurturing environments, recognizing signs of distress, and ensuring access to appropriate mental health services when needed.",
        keyPoints: [
          "Creating supportive environments",
          "Recognizing warning signs",
          "Building coping skills",
          "Access to professional help"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "What helps support children's mental health?", 
        options: ["Ignoring emotions", "Consistent support", "Constant supervision", "Avoiding all stress"],
        correctAnswer: "Consistent support"
      },
      { 
        type: "activity", 
        name: "Emotional Wellness", 
        description: "Match emotional skills with their benefits",
        dragDropItems: {
          items: ["Self-awareness", "Communication", "Stress management", "Positive thinking"],
          dropZones: ["Understanding feelings", "Expressing needs", "Handling challenges", "Building resilience"],
          correctPairings: {
            "Self-awareness": "Understanding feelings",
            "Communication": "Expressing needs",
            "Stress management": "Handling challenges",
            "Positive thinking": "Building resilience"
          }
        }
      }
    ]
  },
  {
    id: 12,
    title: "Healthcare Access",
    description: "Ensuring all children have access to quality healthcare...",
    videoUrl: "https://www.youtube.com/embed/ZtKPr1tpsQ0",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Healthcare as a Right",
        content: "Access to healthcare is a fundamental right for all children, playing a crucial role in their survival, development, and ability to thrive and reach their full potential.",
        keyPoints: [
          "Universal healthcare principles",
          "Preventive care importance",
          "Primary healthcare services",
          "Health equity considerations"
        ]
      },
      {
        title: "Barriers to Healthcare",
        content: "Despite healthcare being a right, many children face barriers to accessing quality healthcare services, including financial, geographical, cultural, and systemic obstacles.",
        keyPoints: [
          "Economic barriers and solutions",
          "Geographical accessibility",
          "Cultural competence in healthcare",
          "Child-friendly health services"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "What is important for healthcare access?", 
        options: ["Only emergency services", "Only for certain groups", "Universal coverage", "Only expensive options"],
        correctAnswer: "Universal coverage"
      },
      { 
        type: "activity", 
        name: "Healthcare Components", 
        description: "Match healthcare components with their purposes",
        dragDropItems: {
          items: ["Vaccinations", "Regular check-ups", "Health education", "Specialist care"],
          dropZones: ["Disease prevention", "Monitoring growth", "Building knowledge", "Treating conditions"],
          correctPairings: {
            "Vaccinations": "Disease prevention",
            "Regular check-ups": "Monitoring growth",
            "Health education": "Building knowledge",
            "Specialist care": "Treating conditions"
          }
        }
      }
    ]
  },
  {
    id: 13,
    title: "Safety from Harm",
    description: "Understanding how to protect children from physical harm...",
    videoUrl: "https://www.youtube.com/embed/CpxF5nhmIZA",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Physical Safety Fundamentals",
        content: "Creating physically safe environments for children involves understanding, preventing, and addressing various forms of physical harm and dangers.",
        keyPoints: [
          "Identifying physical hazards",
          "Age-appropriate supervision",
          "Safety education for children",
          "Emergency response preparation"
        ]
      },
      {
        title: "Prevention Strategies",
        content: "Effective prevention of physical harm to children requires multi-level strategies involving families, schools, communities, and policy frameworks.",
        keyPoints: [
          "Home safety measures",
          "School safety protocols",
          "Community safety initiatives",
          "Policy protections against violence"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "What is key to preventing physical harm?", 
        options: ["Constant fear", "Awareness and education", "Complete isolation", "No physical activity"],
        correctAnswer: "Awareness and education"
      },
      { 
        type: "activity", 
        name: "Safety Responsibilities", 
        description: "Match safety responsibilities with groups",
        dragDropItems: {
          items: ["Supervision", "Safety rules", "Reporting systems", "Safe facilities"],
          dropZones: ["Parents", "Educators", "Community", "Institutions"],
          correctPairings: {
            "Supervision": "Parents",
            "Safety rules": "Educators",
            "Reporting systems": "Community",
            "Safe facilities": "Institutions"
          }
        }
      }
    ]
  },
  {
    id: 14,
    title: "Online Safety",
    description: "Protecting children in digital environments...",
    videoUrl: "https://www.youtube.com/embed/aJoGct2vJrI",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Digital Risks and Challenges",
        content: "As children increasingly engage with digital environments, understanding the unique risks and challenges they face online is essential for effective protection.",
        keyPoints: [
          "Cyberbullying and harassment",
          "Privacy and data protection",
          "Inappropriate content exposure",
          "Online predators and grooming"
        ]
      },
      {
        title: "Digital Literacy and Safety Skills",
        content: "Equipping children with digital literacy and safety skills empowers them to navigate online spaces more safely and responsibly.",
        keyPoints: [
          "Critical thinking about online content",
          "Privacy management skills",
          "Responsible digital communication",
          "When and how to seek help"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "What should children do if contacted by strangers online?", 
        options: ["Share personal information", "Meet them in person", "Tell a trusted adult", "Keep it secret"],
        correctAnswer: "Tell a trusted adult"
      },
      { 
        type: "activity", 
        name: "Online Safety Strategies", 
        description: "Match online risks with safety strategies",
        dragDropItems: {
          items: ["Personal information", "Cyberbullying", "Screen time", "Unknown links"],
          dropZones: ["Protect privacy", "Report and block", "Set limits", "Avoid clicking"],
          correctPairings: {
            "Personal information": "Protect privacy",
            "Cyberbullying": "Report and block",
            "Screen time": "Set limits",
            "Unknown links": "Avoid clicking"
          }
        }
      }
    ]
  },
  {
    id: 15,
    title: "Emotional Security",
    description: "Building environments where children feel emotionally secure...",
    videoUrl: "https://www.youtube.com/embed/TafvHxXFzUM",
    splineUrl: "https://cdn-factory.marketjs.com/en/water-bomber/index.html",
    theory: [
      {
        title: "Foundations of Emotional Security",
        content: "Emotional security provides the foundation for children's mental health, self-esteem, and ability to form healthy relationships throughout life.",
        keyPoints: [
          "Consistent and responsive caregiving",
          "Secure attachment relationships",
          "Emotional validation and support",
          "Stable and predictable environments"
        ]
      },
      {
        title: "Building Resilience",
        content: "Resilience helps children cope with challenges, recover from difficulties, and adapt positively to change, supporting long-term emotional wellbeing.",
        keyPoints: [
          "Developing coping strategies",
          "Building supportive relationships",
          "Fostering a positive self-image",
          "Creating meaning from challenges"
        ]
      }
    ],
    interactiveElements: [
      { 
        type: "quiz", 
        question: "What builds emotional security in children?", 
        options: ["Unpredictable responses", "Consistent care", "Avoiding all emotions", "Constant praise"],
        correctAnswer: "Consistent care"
      },
      { 
        type: "activity", 
        name: "Emotional Environment", 
        description: "Match emotional environment factors with their impacts",
        dragDropItems: {
          items: ["Responsive adults", "Expressing feelings", "Setting boundaries", "Handling failure"],
          dropZones: ["Trust development", "Emotional intelligence", "Sense of safety", "Building resilience"],
          correctPairings: {
            "Responsive adults": "Trust development",
            "Expressing feelings": "Emotional intelligence",
            "Setting boundaries": "Sense of safety",
            "Handling failure": "Building resilience"
          }
        }
      }
    ]
  }
];

// API functions to fetch modules
export async function getCategories(): Promise<Category[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return categories;
}

export async function getTopics(): Promise<Topic[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return topics;
}

export async function getTopic(id: number): Promise<Topic | undefined> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return topics.find(topic => topic.id === id);
} 