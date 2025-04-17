// src/data/hardCodedSubjects.js
export const getHardCodedSubjects = (semNumber) => {
    // Sample data for subjects per semester
    const subjectsData = {
        1: [
          { id: 1, name: 'Mathematics I', description: 'Calculus and Linear Algebra', icon: '🧮' },
          { id: 2, name: 'Chemistry', description: 'Covers atomic structure, chemical bonding, thermodynamics, and organic reactions essential to material and biological sciences.', icon: '⚛️' },
          { id: 3, name: 'Philosophy Of Engineering', description: 'Explores the ethical, social, and philosophical dimensions of engineering practice.', icon: '🔧' },
          { id: 4, name: 'Introduction To Computational Biology', description: ' An introduction to the fundamentals of computational biology, focusing on data analysis, algorithms, and their applications in biological research.', icon: '📝' },
          { id: 5, name: 'Programming For Problem Solving', description: 'Introduces fundamental programming concepts and problem-solving techniques using structured and procedural programming.', icon: '🖥️' },
          { id: 6, name: 'Foreign Languages', description: 'Basics of spoken and written communication in selected international languages.', icon: '🌍' },
          { id: 7, name: 'Workshop Practice', description: 'Hands-on technical skills', icon: '🔧' },
          { id: 8, name: 'Professional Ethics', description: 'Ethical considerations in professional practice', icon: '⚖️' },
        ],
        // Example data for semester 2
        2: [
          { id: 1, name: 'Mathematics II', description: 'Differential Equations and Statistics', icon: '📊' },
          { id: 2, name: 'Data Structures', description: 'Fundamental data structures and algorithms', icon: '🔍' },
          { id: 3, name: 'Digital Electronics', description: 'Logic gates and digital design', icon: '🔌' },
          { id: 4, name: 'Computer Architecture', description: 'Computer organization and design', icon: '🖥️' },
          { id: 5, name: 'Object-Oriented Programming', description: 'OOP principles and patterns', icon: '🧩' },
          { id: 6, name: 'Discrete Mathematics', description: 'Mathematical structures for computer science', icon: '🔢' },
          { id: 7, name: 'Professional Communication', description: 'Advanced technical communication', icon: '🗣️' },
          { id: 8, name: 'Economics for Engineers', description: 'Basic economic principles', icon: '📈' },
        ],
        // Add similar data for the remaining semesters (3-8)
        3: [
          { id: 1, name: 'Mathematics III', description: 'Advanced calculus and numerical methods', icon: '🔣' },
          { id: 2, name: 'Database Management', description: 'Database concepts and SQL', icon: '🗄️' },
          { id: 3, name: 'Computer Networks', description: 'Network protocols and architecture', icon: '🌐' },
          { id: 4, name: 'Operating Systems', description: 'OS concepts and design', icon: '⚙️' },
          { id: 5, name: 'Theory of Computation', description: 'Automata and formal languages', icon: '🧠' },
          { id: 6, name: 'Web Development', description: 'Frontend and backend technologies', icon: '🌟' },
          { id: 7, name: 'Microprocessors', description: 'Architecture and programming', icon: '💾' },
          { id: 8, name: 'Software Engineering', description: 'Software development lifecycle', icon: '📊' },
        ],
        4: [
          { id: 1, name: 'Artificial Intelligence', description: 'Introduction to AI techniques, including machine learning, neural networks, and natural language processing.', icon: '🤖' },
          { id: 2, name: 'Database Management System', description: 'Database concepts and SQL', icon: '🗄️' },
          { id: 3, name: 'Design and Analysis of Algorithm', description: 'Ways to solve problems optimally', icon: '🖥️' },
          { id: 4, name: 'Probability and Queuing Theory', description: 'Fundamentals of probability theory and queuing models for analyzing systems in operations research and performance optimization.', icon: '⚙️' },
          { id: 5, name: 'Social Engineering', description: 'Study of psychological manipulation techniques used to exploit human behavior and breach security systems.', icon: '🧠' },
          { id: 6, name: 'Universal Human Values', description: 'Focuses on ethics, self-awareness, harmony in relationships, and holistic well-being for personal and societal development.', icon: '🌟' },
          { id: 7, name: 'Design and Analysis of Algorithm (Lab)', description: 'Lab activities', icon: '💾' },
        ],
      };
      
      // For any semester not explicitly defined, generate placeholder subjects
      return subjectsData[semNumber] || Array.from({ length: 8 }, (_, i) => ({
        id: `hardcoded_${semNumber}_${i + 1}`,
        name: `Subject ${i + 1}`,
        code: `SUB${semNumber}${i + 1}`,
        description: `Description for Subject ${i + 1} in Semester ${semNumber}`,
        icon: ['📘', '📚', '📝', '📓', '📕', '📊', '📱', '💡'][i % 8],
        semesterId: semNumber
      }));
    };