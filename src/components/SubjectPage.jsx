// src/components/SubjectPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChapterResources from './ChapterResources';
import './SubjectPage.css';

function SubjectPage() {
  const { semId, subjectId } = useParams();
  const [activeTab, setActiveTab] = useState('chapters');
  const [isLoading, setIsLoading] = useState(true);
  
  // Database of subjects for all semesters
  // You can easily modify this with your actual content
  const subjectsDatabase = {
    // Semester 1 Subjects
    "1": {
      "1": {
        name: "Calculus and Linear Algebra",
        code: "18MAB101T",
        description: "This course covers calculus, linear algebra, and analytical geometry. Students will learn fundamental mathematical concepts and problem-solving techniques.",
        instructor: "Dr. Sarah Johnson",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_MATH1_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Unit 1: Matrices',
            description: 'Eigen values, Eigen vectors, Cayley-Hamilton Theorem and Orthagonal reduction',
            driveEmbedUrl: "https://drive.google.com/file/d/1XDCl-Yew0aNeGcAeLj97OLzVZ2z7r6Yo/view?usp=sharing"
          },
          {
            id: 2,
            title: 'Unit 2: Functions of Several Variables',
            description: 'Rules of differentiation, Taylor’s expansion, Partial derivatives, Maxima and Minima, Lagrangian Multiplier method, Jacobians problems',
            driveEmbedUrl: "https://drive.google.com/file/d/1uRQ-j0LuyHJQJFkAcBZoNWa4tqf_DvFP/view?usp=sharing"
          },
          {
            id: 3,
            title: 'Unit 3: Ordinary DIfferential Equations',
            description: 'Linear equations of second order with constant coefficients, Homogeneous equation of Euler and Legendre type, Equations reducible to homogeneous form, Variation of parameters',
            driveEmbedUrl: "https://drive.google.com/file/d/143CxzBqJ5U_S2wMW9go-ag2N7FVAirIz/view?usp=sharing"
          },
          {
            id: 4,
            title: 'Unit 4: Differential Calculus and Beta Gamma Functions',
            description: 'Radius of Curvature – Cartesian coordinates and Polar coordinates, Circle of curvature, Beta and Gamma functions',
            driveEmbedUrl: "https://drive.google.com/file/d/1TMcRBW836EaoQAYo-BquHmvLqQ-SnUMk/view?usp=sharing"
          },
          {
            id: 5,
            title: 'Unit 5: Sequences and Series',
            description: 'Test of Convergence, Integral test, D’Alemberts Ratio test, Raabe’s root test., Cauchy’s Root test ,Leibnitz test, Series of positive and Negative terms.',
            driveEmbedUrl: "https://drive.google.com/file/d/1YcDUcI3NfYy2FpMZ4DySIT8rThJ0z4pU/view?usp=sharing"
          }
        ],
        previousYearQuestions: [
          {
            id: 1,
            year: '2023',
            semester: 'Mid-Term',
            type: 'Calculus Exam',
            fileUrl: 'https://drive.google.com/file/d/sample_math_pyq_2023/view'
          },
          {
            id: 2,
            year: '2022',
            semester: 'Final',
            type: 'Comprehensive Exam',
            fileUrl: 'https://drive.google.com/file/d/sample_math_pyq_2022/view'
          }
        ],
        assignments: [
          {
            id: 1,
            title: 'Calculus Problem Set',
            description: 'Solving advanced differentiation and integration problems',
            deadline: 'March 15, 2025',
            difficulty: 'Hard',
            fileUrl: 'https://drive.google.com/file/d/sample_math_assignment1/view'
          },
          {
            id: 2,
            title: 'Linear Algebra Assignment',
            description: 'Matrix operations and linear transformations',
            deadline: 'April 5, 2025',
            difficulty: 'Medium',
            fileUrl: 'https://drive.google.com/file/d/sample_math_assignment2/view'
          }
        ],
        videoLectures: [
          {
            id: 1,
            title: 'Introduction to Limits',
            description: 'Fundamental concepts of limits in calculus',
            url: 'https://www.youtube.com/embed/sample_math_video1',
            thumbnailUrl: 'https://img.youtube.com/vi/sample_math_video1/hqdefault.jpg',
            duration: '45:30',
            instructor: 'Dr. Sarah Johnson',
            views: 1024
          },
          {
            id: 2,
            title: 'Advanced Differentiation Techniques',
            description: 'Complex differentiation methods and applications',
            url: 'https://www.youtube.com/embed/sample_math_video2',
            thumbnailUrl: 'https://img.youtube.com/vi/sample_math_video2/hqdefault.jpg',
            duration: '55:15',
            instructor: 'Dr. Sarah Johnson',
            views: 756
          }
        ]
      },
      "2": {
        name: "Physics I",
        code: "PHY101",
        description: "Introduction to mechanics, waves, and thermodynamics with practical applications and laboratory experiments.",
        instructor: "Dr. Robert Chen",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PHYSICS1_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Mechanics',
            description: 'Newton\'s laws of motion and applications',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_MECHANICS_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Waves',
            description: 'Wave properties, sound, and light',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_WAVES_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Thermodynamics',
            description: 'Heat, energy, and laws of thermodynamics',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_THERMO_URL_HERE#list"
          }
        ]
      },
      "3": {
        name: "Introduction to Programming",
        code: "CSE101",
        description: "Fundamentals of programming concepts using C/C++, including data types, control structures, functions, and basic algorithms.",
        instructor: "Prof. Emily Wang",
        credits: 3,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PROGRAMMING_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Basics of Programming',
            description: 'Introduction to programming concepts and C/C++ syntax',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PROGRAMMING_BASICS_URL#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Control Structures',
            description: 'Conditional statements and loops',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_CONTROL_STRUCTURES_URL#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Functions & Arrays',
            description: 'Function declaration, parameters, and array manipulation',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_FUNCTIONS_ARRAYS_URL#list"
          }
        ]
      }
    },
    
    // Semester 2 Subjects
    "2": {
      "1": {
        name: "Mathematics II",
        code: "MTH201",
        description: "Advanced calculus, differential equations, and numerical methods with engineering applications.",
        instructor: "Dr. Michael Peterson",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_MATH2_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Multivariable Calculus',
            description: 'Partial derivatives and multiple integrals',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_MULTIVARIABLE_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Differential Equations',
            description: 'Solving ordinary differential equations',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_DIFFEQ_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Numerical Methods',
            description: 'Computational techniques for mathematical problems',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NUMERICAL_URL_HERE#list"
          }
        ],
        previousYearQuestions: [
          {
            id: 1,
            year: '2023',
            semester: 'Mid-Term',
            type: 'Calculus Exam',
            fileUrl: 'https://drive.google.com/file/d/sample_math_pyq_2023/view'
          },
          {
            id: 2,
            year: '2022',
            semester: 'Final',
            type: 'Comprehensive Exam',
            fileUrl: 'https://drive.google.com/file/d/sample_math_pyq_2022/view'
          }
        ],
        assignments: [
          {
            id: 1,
            title: 'Calculus Problem Set',
            description: 'Solving advanced differentiation and integration problems',
            deadline: 'March 15, 2025',
            difficulty: 'Hard',
            fileUrl: 'https://drive.google.com/file/d/sample_math_assignment1/view'
          },
          {
            id: 2,
            title: 'Linear Algebra Assignment',
            description: 'Matrix operations and linear transformations',
            deadline: 'April 5, 2025',
            difficulty: 'Medium',
            fileUrl: 'https://drive.google.com/file/d/sample_math_assignment2/view'
          }
        ],
        videoLectures: [
          {
            id: 1,
            title: 'Introduction to Limits',
            description: 'Fundamental concepts of limits in calculus',
            url: 'https://www.youtube.com/embed/sample_math_video1',
            thumbnailUrl: 'https://img.youtube.com/vi/sample_math_video1/hqdefault.jpg',
            duration: '45:30',
            instructor: 'Dr. Sarah Johnson',
            views: 1024
          },
          {
            id: 2,
            title: 'Advanced Differentiation Techniques',
            description: 'Complex differentiation methods and applications',
            url: 'https://www.youtube.com/embed/sample_math_video2',
            thumbnailUrl: 'https://img.youtube.com/vi/sample_math_video2/hqdefault.jpg',
            duration: '55:15',
            instructor: 'Dr. Sarah Johnson',
            views: 756
          }
        ]
      
      },
      "2": {
        name: "Physics II",
        code: "PHY201",
        description: "Electromagnetism, optics, and modern physics with practical applications and experiments.",
        instructor: "Dr. Lisa Rodriguez",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PHYSICS2_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Electrostatics',
            description: 'Electric charges, fields, and potentials',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_ELECTROSTATICS_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Magnetism',
            description: 'Magnetic fields and electromagnetic induction',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_MAGNETISM_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Optics',
            description: 'Ray optics and wave optics principles',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_OPTICS_URL_HERE#list"
          }
        ]
      },
      "3": {
        name: "Data Structures",
        code: "CSE201",
        description: "Implementation and application of fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs.",
        instructor: "Prof. James Wilson",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_DS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Arrays & Linked Lists',
            description: 'Implementation and operations on basic data structures',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_ARRAYS_LL_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Stacks & Queues',
            description: 'LIFO and FIFO data structures and applications',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_STACK_QUEUE_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Trees & Graphs',
            description: 'Hierarchical and network data structures',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_TREES_GRAPHS_URL_HERE#list"
          }
        ]
      }
    },
    
    // Semester 3 Subjects
    "3": {
      "1": {
        name: "Object-Oriented Programming",
        code: "CSE301",
        description: "Advanced programming techniques using OOP concepts like classes, inheritance, polymorphism, and encapsulation in Java.",
        instructor: "Dr. Alicia James",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_OOP_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Classes & Objects',
            description: 'Creating classes, objects, and understanding encapsulation',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_CLASSES_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Inheritance & Polymorphism',
            description: 'Extending classes and method overriding',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_INHERITANCE_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Interfaces & Abstract Classes',
            description: 'Creating flexible, modular code with interfaces',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_INTERFACES_URL_HERE#list"
          }
        ]
      },
      "2": {
        name: "Database Management Systems",
        code: "CSE302",
        description: "Fundamentals of database design, SQL, normalization, and transaction management.",
        instructor: "Prof. David Kumar",
        credits: 3,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_DBMS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Database Design',
            description: 'ER diagrams and relational model',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_DB_DESIGN_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: SQL',
            description: 'Data definition and manipulation using SQL',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_SQL_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Normalization',
            description: 'Reducing redundancy through normal forms',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NORMALIZATION_URL_HERE#list"
          }
        ]
      }
    },
    
    // Semester 4 Subjects
    "4": {
      "1": {
        name: "Operating Systems",
        code: "CSE401",
        description: "Concepts of operating systems including process management, memory management, file systems, and scheduling algorithms.",
        instructor: "Dr. Thomas Lee",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_OS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Process Management',
            description: 'Process states, scheduling, and inter-process communication',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PROCESS_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Memory Management',
            description: 'Virtual memory, paging, and segmentation',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_MEMORY_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: File Systems',
            description: 'File organization, allocation methods, and directory structures',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_FILESYSTEM_URL_HERE#list"
          }
        ]
      },
      "2": {
        name: "Computer Networks",
        code: "CSE402",
        description: "Fundamentals of data communication, network protocols, TCP/IP model, and network security.",
        instructor: "Prof. Maria Garcia",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NETWORKS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Network Fundamentals',
            description: 'Network types, topologies, and OSI model',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NETWORK_BASICS_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: TCP/IP Protocol Suite',
            description: 'Internet protocols and packet routing',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_TCPIP_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Network Security',
            description: 'Encryption, authentication, and security protocols',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NETWORK_SECURITY_URL_HERE#list"
          }
        ]
      },
      "3": {
        name: "Design and Analysis of Algorithm",
        code: "21CSC204J",
        description: "Covers advanced algorithmic strategies such as divide and conquer, dynamic programming, and greedy methods to design efficient and optimal solutions for computational problems.",
        instructor: "Prof. Maria Garcia",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NETWORKS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Unit 1: Introduction to Algorithm Design',
            ddescription: "Fundamentals of designing efficient algorithms using basic strategies like recursion, sorting, and searching.",
            driveEmbedUrl: "https://drive.google.com/file/d/1QGM7W-rkgV3m-UW-0IABo-D-VjTWrTzP/view?usp=sharing"
          },
          {
            id: 2,
            title: 'Unit 2: Divide and Conquer',
            description: "Solves problems by recursively breaking them into subproblems, solving independently, and combining the results.",
            driveEmbedUrl: "https://drive.google.com/file/d/1IQbA_QRmRAqph6YyhQ7FSZheF6SRQKN1/view?usp=sharing"
          },
          {
            id: 3,
            title: 'Unit 3: Greedy Algorithm and Dynamic Programming',
            description: "Explores Greedy and Dynamic Programming techniques to solve optimization problems through local choices or overlapping subproblems.",
            driveEmbedUrl: "https://drive.google.com/file/d/1MzEbBRhor5BlAo69zxyV-pKIj6AVWM0t/view?usp=sharing"
          },
          {
            id: 4,
            title: 'Unit 4: Backtracking',
            description: "Solves problems by exploring all possible solutions through recursion and pruning invalid paths along the way.",
            driveEmbedUrl: "https://drive.google.com/file/d/1_BIlgYw8io5tLghT5aN1BD7kAgm9ekhY/view?usp=sharing"
          },
          {
            id: 5,
            title: 'Unit 5: Introduction to Randomization and Approximation Algorithm',
            description: "Introduces algorithms that use randomness or approximation to efficiently solve complex or intractable problems.",
            driveEmbedUrl: "https://drive.google.com/file/d/1HgbNuAvR2xTKL4evhB6KcPXT_sWt5K0w/view?usp=sharing"
          }
        ],
        previousYearQuestions: [
          {
            id: 1,
            year: '2025',
            semester: 'Mid-Term',
            type: 'CT-1 SET-A',
            fileUrl: 'https://docs.google.com/document/d/1bnZpleFyTeLbzsfObNX_wkHFu338fBr5/edit?usp=sharing&ouid=113246827768609351560&rtpof=true&sd=true'
          },
          {
            id: 2,
            year: '2025',
            semester: 'Mid-Term',
            type: 'CT-1 SET-B',
            fileUrl: 'https://docs.google.com/document/d/1cMokj2uSBENL2Ir5hAEoSF823AcRVzBF/edit?usp=sharing&ouid=113246827768609351560&rtpof=true&sd=true'
          }
        ],
        assignments: [
          {
            id: 1,
            title: 'NONE',
            description: 'NONE',
            deadline: 'NONE',
            fileUrl: 'NIL'
          }
        ],
        videoLectures: [
            {
              id: 1,
              title: 'DAA – One Shot',
              description: 'You got it all covered',
              url: 'https://youtu.be/z6DY_YSdyww?si=M_Ji6QIhKr1vpZQw',
              iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/z6DY_YSdyww" title="Complete DAA Design and Analysis of Algorithm in one shot | Semester Exam | Hindi" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            },
            {
              id: 2,
              title: 'Introduction to DAA',
              description: 'Overview of algorithm design strategies, complexity analysis, and problem-solving fundamentals in DAA.',
              url: 'https://youtu.be/9mjGoOBy8vs',
              iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/9mjGoOBy8vs" title="Lec 1: Introduction to Algorithm &amp; Syllabus Discussion for GATE/NET | DAA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            },
            {
              id: 3,
              title: 'Backtracking',
              description: 'Explores backtracking as a recursive problem-solving technique for exploring all possible solutions efficiently.',
              url: 'https://youtu.be/MHXR4PCY8c0',
              iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/MHXR4PCY8c0" title="Backtracking | N-Queen Problem &amp; Sudoku Solver | Java and C++ | Anuj Bhaiya ✅| DSAOne Course #11" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            },
            {
              id: 4,
              title: 'Greedy Algorithm',
              description: 'Covers greedy strategy for solving optimization problems by making locally optimal choices at each step.',
              url: 'https://youtu.be/lfQvPHGtu6Q',
              iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/lfQvPHGtu6Q" title="Greedy Algorithms Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            },
            {
              id: 4,
              title: 'Dynamic Programming and Divide and Conquer',
              description: 'Introduction to problem-solving using Divide and Conquer and Dynamic Programming techniques for optimal substructure and overlapping subproblems.',
              url: 'https://youtu.be/HTGba6ta2z0',
              iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/HTGba6ta2z0" title="What is Dynamic Programming | Dynamic Programming and Divide and Conquer | Algorithm (DAA)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            }
          ]
      }
    },
    
    
    // Semester 5 Subjects
    "5": {
      "1": {
        name: "Software Engineering",
        code: "CSE501",
        description: "Software development methodologies, requirements analysis, design patterns, and project management.",
        instructor: "Dr. Samantha Brown",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_SE_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Software Development Life Cycle',
            description: 'Waterfall, Agile, and other methodologies',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_SDLC_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Requirements Engineering',
            description: 'Gathering and analyzing software requirements',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_REQUIREMENTS_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Design Patterns',
            description: 'Common software design patterns and principles',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PATTERNS_URL_HERE#list"
          }
        ]
      },
      "2": {
        name: "Artificial Intelligence",
        code: "CSE502",
        description: "Introduction to AI concepts, search algorithms, knowledge representation, and machine learning fundamentals.",
        instructor: "Prof. Richard White",
        credits: 3,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_AI_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Search Algorithms',
            description: 'Uninformed and informed search strategies',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_SEARCH_ALGO_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Knowledge Representation',
            description: 'Logic, semantic networks, and frames',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_KNOWLEDGE_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Machine Learning Basics',
            description: 'Supervised, unsupervised, and reinforcement learning',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_ML_BASICS_URL_HERE#list"
          }
        ]
      }
    },
    
    // Semester 6 Subjects
    "6": {
      "1": {
        name: "Web Technologies",
        code: "CSE601",
        description: "Frontend and backend web development with HTML, CSS, JavaScript, and server-side frameworks.",
        instructor: "Dr. Jessica Martinez",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_WEBTECH_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Frontend Development',
            description: 'HTML, CSS, and responsive design',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_FRONTEND_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: JavaScript & DOM',
            description: 'Client-side scripting and DOM manipulation',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_JS_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Backend Development',
            description: 'Server-side programming and databases',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_BACKEND_URL_HERE#list"
          }
        ]
      },
      "2": {
        name: "Cloud Computing",
        code: "CSE602",
        description: "Introduction to cloud architectures, services, deployment models, and security considerations.",
        instructor: "Prof. Andrew Clark",
        credits: 3,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_CLOUD_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Cloud Fundamentals',
            description: 'Service and deployment models',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_CLOUD_BASICS_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Cloud Services',
            description: 'IaaS, PaaS, and SaaS offerings',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_CLOUD_SERVICES_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Cloud Security',
            description: 'Security challenges and best practices',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_CLOUD_SECURITY_URL_HERE#list"
          }
        ]
      }
    },
    
    // Semester 7 Subjects
    "7": {
      "1": {
        name: "Machine Learning",
        code: "CSE701",
        description: "Advanced machine learning algorithms, neural networks, and practical implementation using Python libraries.",
        instructor: "Dr. Laura Thompson",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_ML_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Supervised Learning',
            description: 'Regression, classification, and evaluation metrics',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_SUPERVISED_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Neural Networks',
            description: 'Deep learning architectures and training',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NEURAL_NETWORKS_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Practical ML',
            description: 'Implementation using scikit-learn and TensorFlow',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PRACTICAL_ML_URL_HERE#list"
          }
        ]
      },
      "2": {
        name: "Blockchain Technology",
        code: "CSE702",
        description: "Understanding blockchain fundamentals, cryptocurrencies, smart contracts, and distributed applications.",
        instructor: "Prof. Daniel Moore",
        credits: 3,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_BLOCKCHAIN_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Blockchain Basics',
            description: 'Distributed ledgers and consensus mechanisms',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_BLOCKCHAIN_BASICS_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Cryptocurrencies',
            description: 'Bitcoin, Ethereum, and other crypto assets',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_CRYPTO_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: Smart Contracts',
            description: 'Programming and deploying smart contracts',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_SMART_CONTRACTS_URL_HERE#list"
          }
        ]
      }
    },
    
    // Semester 8 Subjects
    "8": {
      "1": {
        name: "Capstone Project",
        code: "CSE801",
        description: "Final year project implementing all aspects of software development on a real-world problem.",
        instructor: "Dr. Kevin Anderson",
        credits: 6,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_CAPSTONE_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Phase 1: Project Planning',
            description: 'Requirements gathering and project scope',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PROJECT_PLANNING_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Phase 2: Design & Implementation',
            description: 'System design and coding guidelines',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_DESIGN_IMPLEMENTATION_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Phase 3: Testing & Deployment',
            description: 'Quality assurance and deployment strategies',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_TESTING_DEPLOYMENT_URL_HERE#list"
          }
        ]
      },
      "2": {
        name: "Ethics in Computing",
        code: "CSE802",
        description: "Ethical considerations in software development, data privacy, AI, and technology's impact on society.",
        instructor: "Prof. Karen Nelson",
        credits: 2,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_ETHICS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Chapter 1: Professional Ethics',
            description: 'Ethical codes and professional responsibilities',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PROFESSIONAL_ETHICS_URL_HERE#list"
          },
          {
            id: 2,
            title: 'Chapter 2: Privacy & Security',
            description: 'Data protection and security implications',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PRIVACY_URL_HERE#list"
          },
          {
            id: 3,
            title: 'Chapter 3: AI Ethics',
            description: 'Ethical considerations in artificial intelligence',
            driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_AI_ETHICS_URL_HERE#list"
          }
        ]
      }
    }
  };

  function getYouTubeID(url) {
    // Regular expression to extract YouTube video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\\&\\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  // Get the subject data from our database using the semId and subjectId
  const subject = subjectsDatabase[semId]?.[subjectId] || {
    name: "Subject Not Found",
    code: "N/A",
    description: "This subject does not exist in our database.",
    instructor: "N/A",
    credits: 0,
    driveEmbedUrl: "",
    chapters: []
  };
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chapters':
        return (
          <div className="chapters-container">
            <h3>Chapter Notes</h3>
            {subject.chapters && subject.chapters.length > 0 ? (
              subject.chapters.map(chapter => (
                <ChapterResources 
                  key={chapter.id} 
                  chapter={{
                    ...chapter,
                    driveEmbedUrl: chapter.driveEmbedUrl || '#'
                  }} 
                />
              ))
            ) : (
              <div className="error-message">No chapters available for this subject</div>
            )}
          </div>
        );
  
      case 'previous-years':
        return (
          <div className="previous-years-container">
            <h3>Previous Year Question Papers</h3>
            {(subject.previousYearQuestions || []).map(pyq => (
              <div key={pyq.id} className="material-card pyq-item">
                <div className="material-icon pdf-icon"></div>
                <div className="material-content">
                  <h4>{pyq.year} {pyq.semester} {pyq.type}</h4>
                  <div className="material-actions">
                    <a href={pyq.fileUrl || '#'} className="action-btn download-btn">View</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
  
      case 'assignments':
        return (
          <div className="assignments-container">
            <h3>Assignments</h3>
            {(subject.assignments || []).map(assignment => (
              <div key={assignment.id} className="material-card assignment-item">
                <div className="material-icon pdf-icon"></div>
                <div className="material-content">
                  <h4>{assignment.title}</h4>
                  <p>{assignment.description}</p>
                  <div className="material-meta">
                    <span className="meta-item">Deadline: {assignment.deadline || 'N/A'}</span>
                  </div>
                </div>
                <div className="material-actions">
                  <a href={assignment.fileUrl || '#'} className="action-btn download-btn">Download</a>
                  <button className="action-btn submit-btn">Submit</button>
                </div>
              </div>
            ))}
          </div>
        );
  
      // Replace the case 'video-lectures' section in your renderTabContent function with this:

// Replace the video-lectures case in your renderTabContent function with this
case 'video-lectures':
  return (
    <div className="video-lectures-container">
      <h3>Video Lectures</h3>
      <div className="video-grid">
        {(subject.videoLectures || []).map(video => (
          <div key={video.id} className="material-card video-item">
            <div className="video-container">
              {/* Extract YouTube ID and create direct iframe */}
              <iframe 
                src={video.url.includes('embed') ? video.url : `https://www.youtube.com/embed/${getYouTubeID(video.url)}`}
                title={video.title}
                className="video-embed"
                width="100%"
                height="100%" 
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="video-content">
              <h4 className="video-title">{video.title}</h4>
              <p className="video-description">{video.description}</p>
              <div className="video-meta">

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
// Add this helper function somewhere in your component (outside of any other function)

  
        case 'ai-help':
          return (
            <div className="ai-help-section">
              <div className="ai-assistant-header">
                <div className="ai-icon"></div>
                <div>
                  <h3>AI Learning Assistant</h3>
                  <p>Get instant help with your subject queries</p>
                </div>
              </div>
              <div className="ai-chat-container">
                <iframe 
                  src="https://your-ai-assistant-url.com" 
                  title="AI Learning Assistant"
                  className="ai-chat-iframe"
                  width="100%"
                  height="600px"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="subject-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading subject content...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subject-page">
      <div className="subject-header-wrapper">
        <div className="container">
          <div className="subject-header">
            <Link to={`/semester/${semId}`} className="back-link">
              ← Back to Semester {semId}
            </Link>
            <div className="subject-headline">
              <h1>{subject.name}</h1>
              <div className="subject-meta">
                <span className="subject-code">{subject.code}</span>
                <span className="subject-instructor">Instructor: {subject.instructor}</span>
                <span className="subject-credits">{subject.credits} Credits</span>
              </div>
            </div>
            <p className="subject-description">{subject.description}</p>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="subject-content">
        <div className="tabs">
  <button 
    className={`tab ${activeTab === 'chapters' ? 'active' : ''}`}
    onClick={() => setActiveTab('chapters')}
  >
    <span className="tab-icon chapters-icon"></span>
    Chapters & Resources
  </button>
  <button 
    className={`tab ${activeTab === 'previous-years' ? 'active' : ''}`}
    onClick={() => setActiveTab('previous-years')}
  >
    <span className="tab-icon pyq-icon"></span>
    Previous Years
  </button>
  <button 
    className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
    onClick={() => setActiveTab('assignments')}
  >
    <span className="tab-icon assignments-icon"></span>
    Assignments
  </button>
  <button 
    className={`tab ${activeTab === 'video-lectures' ? 'active' : ''}`}
    onClick={() => setActiveTab('video-lectures')}
  >
    <span className="tab-icon videos-icon"></span>
    Video Lectures
  </button>
  <button 
    className={`tab ${activeTab === 'ai-help' ? 'active' : ''}`}
    onClick={() => setActiveTab('ai-help')}
  >
    <span className="tab-icon ai-icon"></span>
    AI Help
  </button>
</div>
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectPage;