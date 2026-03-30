// =============== GLOBAL STATE ===============
const state = {
    currentUser: null,
    currentView: 'login',
    teacherSubView: 'dashboard',
    studentSubView: 'dashboard', // 'dashboard', 'materi', 'nilai', 'sub-materi-detail'
    editingMateri: null,
    editingSubMateri: null,
    editingTest: null,
    selectedMateriForSub: null,
    currentTestType: null,
    testQuestions: [],
    currentStudentTest: null,
    studentAnswers: [],
    currentLkpdId: null,
    currentSubMateri: null
};