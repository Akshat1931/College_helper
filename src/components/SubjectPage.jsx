import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DiscussionEmbed } from 'disqus-react';
import ChapterResources from './ChapterResources';
import ChatbotEmbed from './ChatbotEmbed';
import './SubjectPage.css';

function SubjectPage() {
  const { semId, subjectId } = useParams();
  const [activeTab, setActiveTab] = useState('chapters');
  const [isLoading, setIsLoading] = useState(true);
  const [currentSubject, setCurrentSubject] = useState(null);
  
  // Function to get YouTube ID
  function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\\&\\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  const subjectsDatabase = {
    // Semester 1 Subjects
    "1": {
      "1": {
        name: "Calculus and Linear Algebra",
        code: "18MAB101T",
        description: "This course covers calculus, linear algebra, and analytical geometry. Students will learn fundamental mathematical concepts and problem-solving techniques.",
        instructor: "Dr. Sarah Johnson",
        credits: 4,
        syllabusUrl: "https://drive.google.com/file/d/1KGFaWOLvt-M9YC9RmUuh8ZnpnhDxJGSy/view?usp=sharing",
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
            year: 'Nov-2024',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/1sH8KmHoekev8WgAopJ_cWqptZBaVQkJk/view?usp=sharing'
          },
          {
            id: 2,
            year: 'Dec-2023',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/1Qpjz7MFAo87HizgYtTmlaJWoYxjQ-O2L/view?usp=sharing'
          },
          {
            id: 3,
            year: 'Jan-2023',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/1ZQSvMAyPnqE3d4YXcY79dDhNRBGSA0mG/view?usp=sharing'
          },
          {
            id: 4,
            year: 'May-2022',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/14PZoN6f2Kzws4yx2INMKuEyk28dImUCg/view?usp=sharing'
          },
          {
            id: 5,
            year: 'May-2019',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/1wZ12zbhCG0CvP0IdlvT4hakk6iHrOrIl/view?usp=sharing'
          },
          {
            id: 6,
            year: 'Nov-2018',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/1oMF37_D9V-Qdp3v-QSXBUu3Hn-tqqZ0E/view?usp=sharing'
          },
          {
            id: 7,
            year: '2022-2024',
            semester: 'Mid-sem',
            type: 'all CTs',
            fileUrl: 'https://drive.google.com/file/d/1Ct7FkjNCkH-QZAz5fTiVLsSO2NZtjodG/view?usp=sharing'
          },
          {
            id: 8,
            year: '2022-2024',
            semester: 'Mid-sem',
            type: 'all CTs MCQs',
            fileUrl: 'https://drive.google.com/file/d/1b95wQxvjUuSt0WApPl0qQLbQf1T26mg4/view?usp=sharing'
          },
        ],
        
        videoLectures: [
          {
            id: 1,
            title: 'Unit 1 ',
            description: 'https://www.youtube.com/watch?v=FcOIWK5SGZg&list=PLrhWE6dwHUei8J1MmzMG8tWE0Zbn7yi4E   follow the playlist for all videos.',
            url: 'https://youtu.be/FcOIWK5SGZg?list=PLrhWE6dwHUei8J1MmzMG8tWE0Zbn7yi4E',
            iframe: '<iframe width="1057" height="634" src="https://www.youtube.com/embed/FcOIWK5SGZg?list=PLrhWE6dwHUei8J1MmzMG8tWE0Zbn7yi4E" title="12. Finding nature from Quadratic form without Eigen values" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          },
          {
            id: 2,
            title: 'Unit 2',
            description: 'https://www.youtube.com/watch?v=Js83wHU8TsU&list=PLrhWE6dwHUehyKmS--qiyKbK6nqfjBIYF   follow the playlist for all videos.',
            url: 'https://youtu.be/9VfE-yfwTxI?list=PLrhWE6dwHUehyKmS--qiyKbK6nqfjBIYF',
            iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/9VfE-yfwTxI?list=PLrhWE6dwHUehyKmS--qiyKbK6nqfjBIYF" title="1. Taylor Series Part 1—21MAB101T" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          },
          {
            id: 3,
            title: 'Unit 3',
            description: 'https://www.youtube.com/watch?v=o4Ao3DL6jlI&list=PLrhWE6dwHUeiLzh_o2dD-HGD-yB2pKlo9   follow the playlist for all videos.',
            url: 'https://youtu.be/Dpi4qCmJZiU?list=PLrhWE6dwHUeiLzh_o2dD-HGD-yB2pKlo9',
            iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/Dpi4qCmJZiU?list=PLrhWE6dwHUeiLzh_o2dD-HGD-yB2pKlo9" title="1. Differential Equations Basics - Unit - 3 : 21MAB101T" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          },
          {
            id: 4,
            title: 'Unit 4',
            description: 'https://www.youtube.com/watch?v=6wvb1ikas1o&list=PLrhWE6dwHUegXKK-B4uUR1QPuwnzcXlK8   follow the playlist for all videos.',
            url: 'https://youtu.be/1k4ZE2KzOIs?list=PLrhWE6dwHUegXKK-B4uUR1QPuwnzcXlK8',
            iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/1k4ZE2KzOIs?list=PLrhWE6dwHUegXKK-B4uUR1QPuwnzcXlK8" title="Beta Gamma Functions" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          },
          {
            id: 4,
            title: 'Unit 5',
            description: 'https://www.youtube.com/watch?v=A9xJAgwbyUs&list=PLrhWE6dwHUegpsEnjr8dWHMRzCmD8TiFn  follow the playlist for all videos.',
            url: 'https://youtu.be/2ngXxOjfmgk?list=PLrhWE6dwHUegpsEnjr8dWHMRzCmD8TiFn',
            iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/2ngXxOjfmgk?list=PLrhWE6dwHUegpsEnjr8dWHMRzCmD8TiFn" title="1. Sequence and Series Basics - 21MAB101T - Semster 1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          }
        ]
      },
      "2": {
        name: "Chemistry",
        code: "21CYB101J",
        description: "Covers atomic structure, chemical bonding, thermodynamics, and organic reactions essential to material and biological sciences.",
        instructor: "Dr. Robert Chen",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_PHYSICS1_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Unit 1: Periodic Properties (handwritten)',
            description: 'Explores the trends in the periodic table such as atomic size, ionization energy, electron affinity, and electronegativity, and their significance in chemical behavior.',
            driveEmbedUrl: "https://drive.google.com/file/d/1jk-mygvmU5RsvlrLwxiGXq67hDuoH_cF/view?usp=sharing"
          },
          {
            id: 2,
            title: 'Unit 2: Use Of Free Energy In Chemical Equilibria (handwritten)',
            description: 'Explains how Gibbs free energy determines the spontaneity and equilibrium position of chemical reactions under constant temperature and pressure.',
            driveEmbedUrl: "https://drive.google.com/file/d/1pHf8CVc8MRGXZryUZ-X0nzSs5cltBZwk/view?usp=sharing"
          },
          {
            id: 3,
            title: 'Unit 3: Stereo Chemistry And Organic Reactions (handwritten)',
            description: 'Covers the spatial arrangement of atoms in molecules, including isomerism and chirality, and their influence on the mechanisms and outcomes of organic reactions.',
            driveEmbedUrl: "https://drive.google.com/file/d/1y-j1Yu-ClWLvlRNcBHDnzTmFktkrnrw3/view?usp=sharing"
          },
          {
            id: 4,
            title: 'Unit 4: Polymers (handwritten)',
           description: 'Introduces the classification, synthesis, and properties of polymers, including natural and synthetic types, and their applications in everyday materials.',
            driveEmbedUrl: "https://drive.google.com/file/d/1phdnCgEjs2hEBpL9ycACeMBH9QD8Iw0h/view?usp=sharing"
          },
          {
            id: 5,
            title: 'Unit 5: Advanced Engineering Materials (handwritten)',
            description: 'Focuses on the structure, properties, and applications of advanced materials such as composites, nanomaterials, biomaterials, and smart materials used in modern engineering solutions.',
            driveEmbedUrl: "https://drive.google.com/file/d/1pacH5UHvNzfZugccBU73hsu7XSRqnk-l/view?usp=sharing"
          }
        ],
        previousYearQuestions: [
          {
            id: 1,
            year: 'May-2024',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/1GJhYYSdUfO0VxpbnU05IkK5IP0xPnv7G/view?usp=sharing'
          },
          {
            id: 2,
            year: 'May-2023',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/19KKyUwOdoimNtfCTIcGiiti4g24EWUuh/view?usp=sharing'
          },
          {
            id: 3,
            year: 'Jan-2023',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/1D8bjVEN3wwmroIr8kK0PEP7BwKgU_CSh/view?usp=sharing'
          },
          {
            id: 4,
            year: 'May-2019',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/1Ad0-MIZGsOewxh67rB83BTVlQZRMlIv7/view?usp=sharing'
          },
          {
            id: 5,
            year: 'Nov-2018',
            semester: 'End-sem',
            type: 'all units',
            fileUrl: 'https://drive.google.com/file/d/1WhmPnexSAadNL6GKUPIX3PzuRinUIwVk/view?usp=sharing'
          },
          {
            id: 6,
            year: 'Nov-2018',
            semester: 'Mid-sem',
            type: 'all CTs',
            fileUrl: 'https://drive.google.com/drive/folders/1J3K6-KkxmmT-2S2wL1gzCHmZfNAoLCkK'
          },
          {
            id: 7,
            year: '2022-2024',
            semester: 'Mid-sem',
            type: 'all MCQs',
            fileUrl: 'https://drive.google.com/drive/folders/1HF-FA22lkkSHXuNu25sq61_oU7otpK2V'
          },
        ],
        videoLectures: [
          {
            id: 1,
            title: 'Unit 1 ',
            description: 'Periodic Properties',
            url: 'https://youtu.be/6iXauS-MOjs',
            iframe: '<iframe width="1144" height="575" src="https://www.youtube.com/embed/6iXauS-MOjs" title="Periodic Properties | Lecture 1 | Chemistry-I for B.Tech | BS-CH201 | MAKAUT | IAE Academy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          },
          {
            id: 2,
            title: 'Unit 2',
            description: 'Use Of Free Energy In Chemical Equilibria',
            url: 'https://youtu.be/a4HHpoykUXQ',
            iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/a4HHpoykUXQ" title="Chemical Equilibrium Full Topic Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          },
          {
            id: 3,
            title: 'Unit 3',
            description: 'Stereo Chemistry And Organic Reactions',
            url: 'https://youtu.be/CCBJnkQwZzc',
            iframe: '<iframe width="1057" height="626" src="https://www.youtube.com/embed/CCBJnkQwZzc" title="SN1 &amp; SN2 Reactions | Intro, Kinetics, Mechanism, Stereochemistry, ReactivityOrder, Examples BP 202T" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          },
          {
            id: 4,
            title: 'Unit 4',
            description: 'Polymers',
            url: 'https://youtu.be/BC1nk4x5BlQ',
            iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/BC1nk4x5BlQ" title="POLYMERS in One Shot - All Concepts, Tricks &amp; PYQs | Class 12 | NEET" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          },
          {
            id: 4,
            title: 'Unit 5',
            description: 'Advanced Engineering Materials',
            url: 'https://youtu.be/DKYXjVIxIcU',
            iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/DKYXjVIxIcU" title="Engineering Materials | Introduction | Lec 1 | GATE 2021 ME Exam | Manish Sir" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
          }
        ]
      },
      "3": {
        name: "Philosophy Of Engineering",
        code: "21GNH101J",
        description: "Explores the ethical, social, and philosophical dimensions of engineering practice.",
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
        name: "Artifical Intelligence",
        code: "21CSC206T",
        description: "Concepts of operating systems including process management, memory management, file systems, and scheduling algorithms.",
        instructor: "Dr. Thomas Lee",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_OS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Unit 1: Introduction to AI',
            description: 'Fundamentals of Artificial Intelligence, covering problem-solving techniques, search algorithms, and knowledge representation.',
            driveEmbedUrl: "https://drive.google.com/file/d/15wv9K9IN8PjSGuz1DrASGikhmw7DKEgq/view?usp=sharing"
          },
          {
            id: 2,
            title: 'Unit 2: Basic Intro to DATA structure and Search Algorithms',
            description: 'Introduction to fundamental data structures and search algorithms, focusing on efficient data organization and retrieval techniques.',
            driveEmbedUrl: "https://drive.google.com/file/d/1d8D0zAd92AopN_4aAQUk1xEfEJ4mZIKu/view?usp=sharing"
          },
          {
            id: 3,
            title: 'Unit 3: Adversial Search Problem and Intelligent Agent',
            description: 'Explores adversarial search in competitive environments, such as game theory, and the role of intelligent agents in decision-making and problem-solving.',
            driveEmbedUrl: "https://drive.google.com/file/d/1cfszFRiMh8VVCzaCUsGSG8cruAvh7mjo/view?usp=sharing"
          },
          {
            id: 4,
            title: 'Unit 4: Knowledge Representation',
            description: 'Covers methods of representing information in AI systems, including logic, semantic networks, and frames for effective reasoning.',
            driveEmbedUrl: "https://drive.google.com/file/d/1nSoXQ1DObLOK0bsnXP3PgxZJnH_ZoBAZ/view?usp=sharing"
          },
          {
            id: 5,
            title: 'Unit 5: Planning and Expert System',
            description: 'Explores AI planning techniques for goal-oriented problem solving and the design of expert systems for decision-making and reasoning.',
            driveEmbedUrl: "https://drive.google.com/file/d/1Yv5YeIf8B-eqwBVVcilm3UPpW3yM_VIQ/view?usp=sharing"
          }
        ],
        previousYearQuestions: [
          {
            id: 1,
            year: '2023-34',
            semester: 'Mid-Term',
            type: 'CT-2 SET-A & B',
            fileUrl: 'https://drive.google.com/file/d/1nbI_vRAre2V5PG7QjN3u96UIMESfMDij/view?usp=sharing'
          },
          
        ],
        assignments: [
          {
            id: 1,
            title: 'none',
            description: 'none',
            deadline: 'depends on faculty',
            fileUrl: ''
          }
        ],
        videoLectures: [
            
          ]
      },
      "2": {
        name: "Database Management System",
        code: "21CSC205P",
        description: 'Introduction to database concepts, design, SQL, and efficient data management techniques.',
        instructor: "Prof. Maria Garcia",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NETWORKS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Unit 1: Introduction to DBMS and ER Diagram',
            description: 'Covers basic DBMS concepts and entity-relationship diagrams for data modeling and schema design.',
            driveEmbedUrl: "https://drive.google.com/file/d/169yUZ3IGNBpEDVx9Dyet6nuSCKmooyOh/view?usp=sharing"
          },
          {
            id: 2,
            title: 'Unit 2: Relational Schemas and Calculus',
            description: 'Explores relational schema design and formal query languages like relational algebra and calculus.',
            driveEmbedUrl: "https://drive.google.com/file/d/1k4uc0ZCj_iafvWvt1U3gJYhKczUSUF9Q/view?usp=sharing"
          },
          {
            id: 3,
            title: 'Unit 3: SQL Commands Queris and Triggers',
            description: 'Covers core SQL commands, query writing, and the use of triggers for automated database operations.',
            driveEmbedUrl: "https://drive.google.com/file/d/1yTJZRBewwVEyMK4nHr8fxyKgNINySgLT/view?usp=sharing"
          },
          {
            id: 4,
            title: 'Unit 4: Dependencies and Normalization',
            description: 'Discusses functional dependencies and normalization techniques to eliminate data redundancy and ensure consistency.',
            driveEmbedUrl: "https://drive.google.com/file/d/1UYKlLWUnc4R4BcHbmFwm8cL8erARebG2/view?usp=sharing"
          },
          {
            id: 5,
            title: 'Unit 5: Transcation control, Concurrency control and Failure and Recovery Algorithms',
            description: 'Focuses on transaction management, concurrency control techniques, and recovery algorithms to maintain database integrity.',
            driveEmbedUrl: "https://drive.google.com/file/d/1Ho3HN8r24l4Ma0E-dUUlKAbvIVAxWxis/view?usp=sharing"
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
            description: "Fundamentals of designing efficient algorithms using basic strategies like recursion, sorting, and searching.",
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
            title: 'Elab',
            description: 'Solution pdf of elab',
            deadline: 'depends on faculty',
            fileUrl: ''
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
      },
      "4": {
        name: "Probability and Queuing Theory",
        code: "21MAB204T",
        description: "Fundamentals of probability theory and queuing models for analyzing systems in operations research and performance optimization.",
        instructor: "Prof. Maria Garcia",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NETWORKS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'Unit 1: Random Variables',
            description: 'Introduces random variables, probability distributions, and their role in modeling uncertainty and predicting outcomes in probabilistic systems.',
            driveEmbedUrl: "https://drive.google.com/file/d/19r_BHbI-wM3eaON4MdhgK6kEBEqbDP3_/view?usp=sharing"
          },
          {
            id: 2,
            title: 'Unit 2: Theoretical Distribution',
            description: 'Explores various theoretical probability distributions, such as binomial, Poisson, and normal distributions, and their applications in statistical modeling and analysis.',
            driveEmbedUrl: "https://drive.google.com/file/d/1-v8LxP9qWA5VwhwyswvM2dSqX0Gt5ZyT/view?usp=sharing"
          },
          {
            id: 3,
            title: 'Unit 3: 2-D Random Variables',
            description: 'Focuses on the study of two-dimensional random variables, including joint distributions, marginal distributions, and dependence between random variables.',
            driveEmbedUrl: "https://drive.google.com/file/d/1I_N7H6rSLoRL32NBnAyyuixB5r0h1Esm/view?usp=sharing"
          },
          {
            id: 4,
            title: 'Unit 4: Queuing Theory',
            description: 'Introduces queuing theory, focusing on the analysis of waiting lines, queue models, and performance metrics such as arrival rates, service rates, and system efficiency.',
            driveEmbedUrl: "https://drive.google.com/file/d/1P5w_ZniBkbaD-Wr7T788JIDxti4dGtSk/view?usp=sharing"
          },
          {
            id: 5,
            title: 'Unit 5: Markov Chain',
            description: 'Explores the concept of Markov chains, focusing on state transitions, transition matrices, and their applications in modeling stochastic processes and systems with memoryless properties.',
            driveEmbedUrl: "https://drive.google.com/file/d/1okpkcdok7fVMmELjD9L5Zy10ejo1DI5X/view?usp=sharing"
          },
          {
            id: 6,
            title: 'Unit 1: Random Variables (handwritten)',
            description: 'Introduces random variables, probability distributions, and their role in modeling uncertainty and predicting outcomes in probabilistic systems.',
            driveEmbedUrl: "https://drive.google.com/file/d/13SK3vuwMbfbaeVmPLpSVmG5mu0FQo-nP/view?usp=sharing"
          },
          {
            id: 7,
            title: 'Unit 4: Queuing Theory (handwritten)',
            description: 'Introduces queuing theory, focusing on the analysis of waiting lines, queue models, and performance metrics such as arrival rates, service rates, and system efficiency.',
            driveEmbedUrl: "https://drive.google.com/file/d/1vIR4ZqasOyIKdKkuO_zRfTuk8ycnnWKh/view?usp=sharing"
          }
              ],
        previousYearQuestions: [
          {
            id: 1,
            year: '2022',
            semester: 'Mid-Term',
            type: 'All CTs',
            fileUrl: 'https://drive.google.com/file/d/1qBM4J0hK48cx4T-AYQMgLrX_KnHbrGTn/view?usp=sharing'
          }
        ],
        assignments: [
          {
            id: 1,
            title: 'Assignment-1',
            description: 'Maths assignment for Unit-1',
            deadline: 'depends on faculty',
            fileUrl: 'https://drive.google.com/file/d/1lDQ4TFwOmv7RveSVe5DBn1e9F5rRFh37/view?usp=sharing'
          }
        ],
        videoLectures: [
            {
              id: 1,
              title: 'Unit 1 ',
              description: 'https://www.youtube.com/watch?v=NebCsY4-fIw&list=PLrhWE6dwHUeiSTblHiOe9RyvGBAp8nAeo   follow the playlist for all videos.',
              url: 'https://youtu.be/NebCsY4-fIw?list=PLrhWE6dwHUeiSTblHiOe9RyvGBAp8nAeo',
              iframe: '<iframe width="1057" height="600" src="https://www.youtube.com/embed/NebCsY4-fIw?list=PLrhWE6dwHUeiSTblHiOe9RyvGBAp8nAeo" title="1. Basic Probability | UNIT 1 | Probability - 21MAB301T/ 21MAB204T" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            },
            {
              id: 2,
              title: 'Unit 2',
              description: 'https://www.youtube.com/watch?v=PnsPOnGu9YE&list=PLrhWE6dwHUejDwxsDGiEAgSr5seCvgUgj   follow the playlist for all videos.',
              url: 'https://youtu.be/PnsPOnGu9YE?list=PLrhWE6dwHUejDwxsDGiEAgSr5seCvgUgj',
              iframe: '<iframe width="1057" height="533" src="https://www.youtube.com/embed/PnsPOnGu9YE?list=PLrhWE6dwHUejDwxsDGiEAgSr5seCvgUgj" title="Binomial Distribution:  Part - 1 | UNIT 2 | Distributions:   21MAB301T/ 21MAB204T" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            },
            {
              id: 3,
              title: 'Unit 3',
              description: 'https://www.youtube.com/watch?v=LPiPMOd-avM&list=PLrhWE6dwHUegR0LtYvoW_7omUsAAJh_74   follow the playlist for all videos.',
              url: 'https://youtu.be/LPiPMOd-avM?list=PLrhWE6dwHUegR0LtYvoW_7omUsAAJh_74',
              iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/LPiPMOd-avM?list=PLrhWE6dwHUegR0LtYvoW_7omUsAAJh_74" title="Joint Probability Mass Function - Basics and Problems" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            },
            {
              id: 4,
              title: 'Unit 4',
              description: 'https://www.youtube.com/watch?v=A5woq-Arz3o&list=PLrhWE6dwHUeh5kCyy-l7_zmEPfAnrjk65   follow the playlist for all videos.',
              url: 'https://youtu.be/A5woq-Arz3o?list=PLrhWE6dwHUeh5kCyy-l7_zmEPfAnrjk65',
              iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/A5woq-Arz3o?list=PLrhWE6dwHUeh5kCyy-l7_zmEPfAnrjk65" title="Queueing Theory Basics | UNIT 4 | 21MAB204T" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            },
            {
              id: 4,
              title: 'Unit 5',
              description: 'https://www.youtube.com/watch?v=jyjHBqAq0sE&list=PLrhWE6dwHUejM_Smfd40IbJwaGBXuhdSI  follow the playlist for all videos.',
              url: 'https://youtu.be/jyjHBqAq0sE?list=PLrhWE6dwHUejM_Smfd40IbJwaGBXuhdSI',
              iframe: '<iframe width="1057" height="595" src="https://www.youtube.com/embed/jyjHBqAq0sE?list=PLrhWE6dwHUejM_Smfd40IbJwaGBXuhdSI" title="Markov Chain Basics   | UNIT 5 |  | 21MAB204T" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
            }
          ]
      },
      "5": {
        name: "Social Engineering",
        code: "21PDH209T",
        description: 'Introduction to database concepts, design, SQL, and efficient data management techniques.',
        instructor: "Prof. Maria Garcia",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NETWORKS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'All units combined',
            description: 'All the units of social engineering combined',
            driveEmbedUrl: "https://drive.google.com/file/d/1AcRpMsLrSxPvg_HgGLBPhYh25E4LeIpB/view?usp=sharing"
          },
        ],
        previousYearQuestions: [
          {
            id: 1,
            year: '2023',
            semester: 'Mid-Term',
            type: 'All CTs',
            fileUrl: 'https://drive.google.com/file/d/1DPcNNtEOUfshhQrn57yKFNRMKlHcPDCE/view?usp=sharing'
          }
        ],
      },
      "6": {
        name: "Universal Human Values",
        code: "21PDH209T",
        description: 'Focuses on ethics, self-awareness, harmony in relationships, and holistic well-being for personal and societal development.',
        instructor: "Prof. Maria Garcia",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NETWORKS_FOLDER_ID#list",
        
    },
    "7": {
        name: "Design and Analysis of Algorithm (Lab)",
        code: "21CSC204J",
        description: 'Focuses on ethics, self-awareness, harmony in relationships, and holistic well-being for personal and societal development.',
        instructor: "Prof. Maria Garcia",
        credits: 4,
        driveEmbedUrl: "https://drive.google.com/embeddedfolderview?id=YOUR_NETWORKS_FOLDER_ID#list",
        chapters: [
          {
            id: 1,
            title: 'All experments',
            description: 'All experiments to be perfomed in lab',
            driveEmbedUrl: ""
          },
        ],
    },
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


  
  
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      // Get subject data or default
      const foundSubject = subjectsDatabase[semId]?.[subjectId];
      setCurrentSubject(foundSubject || {
        name: "Subject Not Found",
        code: "N/A",
        description: "This subject does not exist in our database.",
        instructor: "N/A",
        credits: 0,
        syllabusUrl: "#",
        chapters: [],
        previousYearQuestions: [],
        videoLectures: []
      });
      setIsLoading(false);
    }, 800);
  }, [semId, subjectId]);
  
  const renderTabContent = () => {
    if (!currentSubject) return <div>Loading content...</div>;
    
    switch (activeTab) {
      case 'chapters':
        return (
          <div className="chapters-container">
            <h3>Chapter Notes</h3>
            {currentSubject.chapters && currentSubject.chapters.length > 0 ? (
              currentSubject.chapters.map(chapter => (
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
            {(currentSubject.previousYearQuestions || []).length > 0 ? (
              currentSubject.previousYearQuestions.map(pyq => (
                <div key={pyq.id} className="material-card pyq-item">
                  <div className="material-icon pdf-icon"></div>
                  <div className="material-content">
                    <h4>{pyq.year} {pyq.semester} {pyq.type}</h4>
                    <div className="material-actions">
                      <a href={pyq.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="action-btn download-btn">View</a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="error-message">No previous year questions available for this subject</div>
            )}
          </div>
        );
  
      case 'assignments':
        return (
          <div className="assignments-container">
            <h3>Assignments</h3>
            {(currentSubject.assignments || []).length > 0 ? (
              currentSubject.assignments.map(assignment => (
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
                    <a href={assignment.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="action-btn download-btn">View</a>
                  </div>
                </div>
              ))
            ) : (
              <div className="error-message">No assignments available for this subject</div>
            )}
          </div>
        );
  
      case 'video-lectures':
        return (
          <div className="video-lectures-container">
            <h3>Video Lectures</h3>
            {(currentSubject.videoLectures || []).length > 0 ? (
              <div className="video-grid">
                {currentSubject.videoLectures.map(video => (
                  <div key={video.id} className="material-card video-item">
                    <div className="video-container">
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="error-message">No video lectures available for this subject</div>
            )}
          </div>
        );
  
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
            <ChatbotEmbed />
            </div>
          </div>
        );
        
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  // Configure Disqus props
  const disqusConfig = {
    url: window.location.href,
    identifier: `semester-${semId}-subject-${subjectId}`,
    title: currentSubject ? `${currentSubject.name} - ${currentSubject.code}` : `Subject ${subjectId}`,
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
              <h1>{currentSubject?.name}</h1>
              <div className="subject-meta">
                <span className="subject-code">{currentSubject?.code}</span>
                <span className="subject-instructor">Instructor: {currentSubject?.instructor}</span>
                <span className="subject-credits">{currentSubject?.credits} Credits</span>
                <a 
                  href={currentSubject?.syllabusUrl || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="syllabus-btn"
                >
                  <span className="syllabus-icon"></span>
                  View Syllabus
                </a>
              </div>
            </div>
            <p className="subject-description">{currentSubject?.description}</p>
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
          
          {/* Discussion Forum Section - Below all tabs */}
          <div className="discussion-section">
            <div className="discussion-header">
              <h3>Discussion Forum</h3>
              <p>Discuss this subject with your classmates and instructors</p>
            </div>
            <div className="disqus-container">
              <DiscussionEmbed
                shortname='collegehelper-comments'
                config={disqusConfig}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectPage;