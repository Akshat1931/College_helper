

const STORAGE_KEYS = {
    SUBJECTS: 'collegeHelper_subjects',
    SEMESTERS: 'collegeHelper_semesters'
  };
  
  // Initialize default semesters if not exists
  export const initializeSemesters = () => {
    const existingSemesters = localStorage.getItem(STORAGE_KEYS.SEMESTERS);
    
    if (!existingSemesters) {
      const defaultSemesters = [];
      for (let i = 1; i <= 8; i++) {
        defaultSemesters.push({
          id: i,
          name: `Semester ${i}`,
          description: i === 1 
            ? 'Your first step into higher education. This semester builds the foundation for your entire degree with core subjects that introduce fundamental concepts.'
            : i === 2
              ? 'Continue building on your foundation with more specialized knowledge and advanced concepts across core disciplines.'
              : i === 3
                ? 'Dive deeper into your field with more specialized courses that prepare you for upper-division study.'
                : i === 4
                  ? 'Begin to focus on application of knowledge and prepare for practical challenges in your field.'
                  : i === 5
                    ? 'Start your specialization with targeted courses that align with your career interests.'
                    : i === 6
                      ? 'Apply your knowledge to complex problems and scenarios relevant to industry needs.'
                      : i === 7
                        ? 'Focus on research methodologies and innovative approaches in your field.'
                        : 'Complete your capstone project and prepare for transitioning into the workforce.',
          image: `https://images.unsplash.com/photo-${1500000000 + i * 100000}?q=80&w=1000`
        });
      }
      
      localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(defaultSemesters));
      return defaultSemesters;
    }
    
    return JSON.parse(existingSemesters);
  };
  
  // Get all subjects
  export const getAllSubjects = () => {
    const subjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return subjects ? JSON.parse(subjects) : [];
  };
  
  // Get subjects for a specific semester
  export const getSubjectsBySemester = (semesterId) => {
    const subjects = getAllSubjects();
    return subjects.filter(subject => subject.semesterId === parseInt(semesterId));
  };
  
  // Get a specific subject by ID
  export const getSubjectById = (subjectId) => {
    const subjects = getAllSubjects();
    return subjects.find(subject => subject.id === subjectId);
  };
  
  // Add a new subject
  export const addSubject = (subjectData) => {
    const subjects = getAllSubjects();
    const newSubject = {
      ...subjectData,
      id: Date.now().toString(), // Generate unique ID
      chapters: [],
      previousYearQuestions: [],
      assignments: [],
      videoLectures: []
    };
    
    subjects.push(newSubject);
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    return newSubject;
  };
  
  // Update existing subject
  export const updateSubject = (subjectId, updatedData) => {
    const subjects = getAllSubjects();
    const updatedSubjects = subjects.map(subject => 
      subject.id === subjectId ? { ...subject, ...updatedData } : subject
    );
    
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(updatedSubjects));
    return updatedSubjects.find(subject => subject.id === subjectId);
  };
  
  // Delete subject
  export const deleteSubject = (subjectId) => {
    const subjects = getAllSubjects();
    const filteredSubjects = subjects.filter(subject => subject.id !== subjectId);
    
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(filteredSubjects));
    return filteredSubjects;
  };
  
  // Add chapter to subject
  export const addChapter = (subjectId, chapterData) => {
    const subjects = getAllSubjects();
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        const chapterId = Date.now().toString();
        const newChapter = {
          ...chapterData,
          id: chapterId
        };
        
        return {
          ...subject,
          chapters: [...(subject.chapters || []), newChapter]
        };
      }
      return subject;
    });
    
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(updatedSubjects));
    return updatedSubjects.find(subject => subject.id === subjectId);
  };
  
  // Add video lecture to subject
  export const addVideoLecture = (subjectId, videoData) => {
    const subjects = getAllSubjects();
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        const videoId = Date.now().toString();
        const newVideo = {
          ...videoData,
          id: videoId
        };
        
        return {
          ...subject,
          videoLectures: [...(subject.videoLectures || []), newVideo]
        };
      }
      return subject;
    });
    
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(updatedSubjects));
    return updatedSubjects.find(subject => subject.id === subjectId);
  };
  
  // Add previous year question to subject
  export const addPreviousYearQuestion = (subjectId, pyqData) => {
    const subjects = getAllSubjects();
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        const pyqId = Date.now().toString();
        const newPYQ = {
          ...pyqData,
          id: pyqId
        };
        
        return {
          ...subject,
          previousYearQuestions: [...(subject.previousYearQuestions || []), newPYQ]
        };
      }
      return subject;
    });
    
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(updatedSubjects));
    return updatedSubjects.find(subject => subject.id === subjectId);
  };
  
  // Add assignment to subject
  export const addAssignment = (subjectId, assignmentData) => {
    const subjects = getAllSubjects();
    const updatedSubjects = subjects.map(subject => {
      if (subject.id === subjectId) {
        const assignmentId = Date.now().toString();
        const newAssignment = {
          ...assignmentData,
          id: assignmentId
        };
        
        return {
          ...subject,
          assignments: [...(subject.assignments || []), newAssignment]
        };
      }
      return subject;
    });
    
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(updatedSubjects));
    return updatedSubjects.find(subject => subject.id === subjectId);
  };
  
  // Get all semesters
  export const getAllSemesters = () => {
    const semesters = localStorage.getItem(STORAGE_KEYS.SEMESTERS);
    if (!semesters) {
      return initializeSemesters();
    }
    return JSON.parse(semesters);
  };
  
  // Update semester info
  export const updateSemester = (semesterId, updatedData) => {
    const semesters = getAllSemesters();
    const updatedSemesters = semesters.map(semester => 
      semester.id === parseInt(semesterId) 
        ? { ...semester, ...updatedData } 
        : semester
    );
    
    localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(updatedSemesters));
    return updatedSemesters.find(semester => semester.id === parseInt(semesterId));
  };
  
  // Initialize with example data for testing
  export const initializeWithExampleData = () => {
    // Check if we already have data
    const existingSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (existingSubjects && JSON.parse(existingSubjects).length > 0) {
      return; // Don't override existing data
    }
    
    const exampleSubjects = [
      {
        id: '1001',
        name: 'Mathematics I',
        code: '18MAB101T',
        description: 'This course covers calculus, linear algebra, and analytical geometry. Students will learn fundamental mathematical concepts and problem-solving techniques.',
        instructor: 'Dr. Sarah Johnson',
        credits: 4,
        semesterId: 1,
        syllabusUrl: 'https://drive.google.com/file/d/1ZyuDGExbr648v6CJBlYt0ccdUA2G39TP/view?usp=sharing',
        chapters: [
          {
            id: '2001',
            title: 'Unit 1: Matrices',
            description: 'Eigen values, Eigen vectors, Cayley-Hamilton Theorem and Orthagonal reduction',
            driveEmbedUrl: 'https://drive.google.com/file/d/1XDCl-Yew0aNeGcAeLj97OLzVZ2z7r6Yo/view?usp=sharing'
          }
        ],
        videoLectures: [
          {
            id: '3001',
            title: 'Unit 1 Lecture',
            description: 'Introduction to Matrices and eigenvalues',
            url: 'https://www.youtube.com/embed/FcOIWK5SGZg',
            iframe: '<iframe width="1057" height="634" src="https://www.youtube.com/embed/FcOIWK5SGZg" title="12. Finding nature from Quadratic form without Eigen values" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
          }
        ],
        previousYearQuestions: [],
        assignments: []
      }
    ];
    
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(exampleSubjects));
  };
  
  // Export a default object with all methods
  export default {
    initializeSemesters,
    getAllSubjects,
    getSubjectsBySemester,
    getSubjectById,
    addSubject,
    updateSubject,
    deleteSubject,
    addChapter,
    addVideoLecture,
    addPreviousYearQuestion,
    addAssignment,
    getAllSemesters,
    updateSemester,
    initializeWithExampleData
  };