// =============== MAIN RENDER FUNCTION ===============
function render() {
    const app = document.getElementById('app');
    
    if (!app) return;
    
    if (state.currentView === 'login') {
        app.innerHTML = renderLogin();
    } else if (state.currentView === 'teacher') {
        app.innerHTML = renderTeacherDashboard();
    } else if (state.currentView === 'student') {
        app.innerHTML = renderStudentDashboard();
    }
    
    // Wait for DOM to update before attaching event listeners
    setTimeout(() => {
        attachAllEventListeners();
    }, 0);
}

// =============== ATTACH ALL EVENT LISTENERS ===============
function attachAllEventListeners() {
    // Auth events
    attachAuthEventListeners();

    // Mobile menu
    document.getElementById('mobileMenuToggle')?.addEventListener('click', () => {
        document.getElementById('mobileMenu')?.classList.remove('hidden');
    });
    document.getElementById('closeMobileMenu')?.addEventListener('click', () => {
        document.getElementById('mobileMenu')?.classList.add('hidden');
    });
    document.getElementById('mobileMenuToggleS')?.addEventListener('click', () => {
        document.getElementById('mobileMenuS')?.classList.remove('hidden');
    });
    document.getElementById('closeMobileMenuS')?.addEventListener('click', () => {
        document.getElementById('mobileMenuS')?.classList.add('hidden');
    });

    // Teacher navigation
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.removeEventListener('click', handleTeacherNavigation);
        btn.addEventListener('click', handleTeacherNavigation);
    });

    // Student navigation
    document.querySelectorAll('[data-sview]').forEach(btn => {
        btn.removeEventListener('click', handleStudentNavigation);
        btn.addEventListener('click', handleStudentNavigation);
    });

    // Refresh buttons
    document.getElementById('refreshStudents')?.addEventListener('click', async () => {
    try {
        showToast('Data diperbarui');
        
        // Reload data dari Firebase/localStorage
        if (window.firebaseInitialized && window.firebaseDatabase) {
            // Ambil data terbaru dari Firebase
            const snapshot = await window.firebaseDatabase.ref('microclass_data').once('value');
            const freshData = snapshot.val();
            
            if (freshData && Array.isArray(freshData)) {
                // Update data di store
                store.data = freshData;
                store.notify(); // Ini akan memicu render ulang
                console.log('📦 Data diperbarui dari Firebase');
            } else {
                // Kalau ga ada di Firebase, reload dari localStorage
                store.loadFromLocalStorage();
                store.notify();
            }
        } else {
            // Fallback ke localStorage
            store.loadFromLocalStorage();
            store.notify();
        }
        
        showToast('Data berhasil diperbarui!', 'success');
    } catch (error) {
        console.error('Gagal refresh:', error);
        showToast('Gagal memperbarui data', 'error');
    }
});

    // Delete all students
    document.getElementById('deleteAllStudents')?.addEventListener('click', handleDeleteAllStudents);

    // Delete student
    document.querySelectorAll('[data-delete-student]').forEach(btn => {
        btn.removeEventListener('click', handleDeleteStudent);
        btn.addEventListener('click', handleDeleteStudent);
    });

    // Delete individual scores
    document.querySelectorAll('[data-delete-score]').forEach(btn => {
        btn.removeEventListener('click', handleDeleteScore);
        btn.addEventListener('click', handleDeleteScore);
    });

    // Materi CRUD
    attachMateriEventListeners();
    
    // Sub Materi CRUD
    attachSubMateriEventListeners();
    
    // Test CRUD
    attachTestEventListeners();
    
    // Student events
    attachStudentEventListeners();

    // =============== REKAP NILAI EVENT LISTENERS ===============
    
    // Tab switching untuk rekap nilai
    const tabPretest = document.getElementById('tabPretest');
    const tabPosttest = document.getElementById('tabPosttest');
    const pretestContainer = document.getElementById('pretestContainer');
    const posttestContainer = document.getElementById('posttestContainer');
    const pretestTools = document.getElementById('pretestTools');
    const posttestTools = document.getElementById('posttestTools');
    
    if (tabPretest) {
        tabPretest.addEventListener('click', () => {
            // Show pretest
            if (pretestContainer) pretestContainer.classList.remove('hidden');
            if (posttestContainer) posttestContainer.classList.add('hidden');
            if (pretestTools) pretestTools.classList.remove('hidden');
            if (posttestTools) posttestTools.classList.add('hidden');
            
            // Update tab styles
            tabPretest.classList.remove('bg-gray-100', 'text-gray-600');
            tabPretest.classList.add('bg-orange-100', 'text-orange-600');
            tabPosttest.classList.remove('bg-green-100', 'text-green-600');
            tabPosttest.classList.add('bg-gray-100', 'text-gray-600');
        });
    }

    if (tabPosttest) {
        tabPosttest.addEventListener('click', () => {
            // Show posttest
            if (pretestContainer) pretestContainer.classList.add('hidden');
            if (posttestContainer) posttestContainer.classList.remove('hidden');
            if (pretestTools) pretestTools.classList.add('hidden');
            if (posttestTools) posttestTools.classList.remove('hidden');
            
            // Update tab styles
            tabPosttest.classList.remove('bg-gray-100', 'text-gray-600');
            tabPosttest.classList.add('bg-green-100', 'text-green-600');
            tabPretest.classList.remove('bg-orange-100', 'text-orange-600');
            tabPretest.classList.add('bg-gray-100', 'text-gray-600');
        });
    }

    // Refresh Pretest - VERSI BARU (TANPA RELOAD BROWSER)
document.getElementById('refreshPretest')?.addEventListener('click', async () => {
    try {
        showToast('Memuat ulang data pretest...', 'info');
        
        // Reload data dari Firebase/localStorage
        if (window.firebaseInitialized && window.firebaseDatabase) {
            // Ambil data terbaru dari Firebase
            const snapshot = await window.firebaseDatabase.ref('microclass_data').once('value');
            const freshData = snapshot.val();
            
            if (freshData && Array.isArray(freshData)) {
                // Update data di store
                store.data = freshData;
                store.notify(); // Ini akan memicu render ulang
                console.log('📦 Data pretest diperbarui dari Firebase');
            } else {
                // Kalau ga ada di Firebase, reload dari localStorage
                store.loadFromLocalStorage();
                store.notify();
            }
        } else {
            // Fallback ke localStorage
            store.loadFromLocalStorage();
            store.notify();
        }
        
        showToast('Data pretest berhasil diperbarui!', 'success');
    } catch (error) {
        console.error('Gagal refresh pretest:', error);
        showToast('Gagal memperbarui data', 'error');
    }
});

// Refresh Posttest - VERSI BARU (TANPA RELOAD BROWSER)
document.getElementById('refreshPosttest')?.addEventListener('click', async () => {
    try {
        showToast('Memuat ulang data posttest...', 'info');
        
        // Reload data dari Firebase/localStorage
        if (window.firebaseInitialized && window.firebaseDatabase) {
            // Ambil data terbaru dari Firebase
            const snapshot = await window.firebaseDatabase.ref('microclass_data').once('value');
            const freshData = snapshot.val();
            
            if (freshData && Array.isArray(freshData)) {
                // Update data di store
                store.data = freshData;
                store.notify(); // Ini akan memicu render ulang
                console.log('📦 Data posttest diperbarui dari Firebase');
            } else {
                // Kalau ga ada di Firebase, reload dari localStorage
                store.loadFromLocalStorage();
                store.notify();
            }
        } else {
            // Fallback ke localStorage
            store.loadFromLocalStorage();
            store.notify();
        }
        
        showToast('Data posttest berhasil diperbarui!', 'success');
    } catch (error) {
        console.error('Gagal refresh posttest:', error);
        showToast('Gagal memperbarui data', 'error');
    }
});

    // Delete Pretest
    document.getElementById('deletePretestRekap')?.addEventListener('click', handleDeletePretest);

    // Delete Posttest
    document.getElementById('deletePosttestRekap')?.addEventListener('click', handleDeletePosttest);

    // Export buttons
    document.getElementById('exportPretest')?.addEventListener('click', exportPretestToExcel);
    document.getElementById('exportPosttest')?.addEventListener('click', exportPosttestToExcel);
}

// =============== EVENT HANDLERS ===============
function handleTeacherNavigation(e) {
    state.teacherSubView = e.currentTarget.dataset.view;
    document.getElementById('mobileMenu')?.classList.add('hidden');
    render();
}

function handleStudentNavigation(e) {
    state.studentSubView = e.currentTarget.dataset.sview;
    document.getElementById('mobileMenuS')?.classList.add('hidden');
    render();
}

// =============== FUNGSI DELETE DENGAN LKPD ===============

// Fungsi untuk menghapus submissions LKPD siswa
async function deleteStudentLkpdSubmissions(studentId) {
    if (!window.firebaseDatabase) return 0;
    
    try {
        console.log(`🗑️ Menghapus submissions LKPD untuk siswa: ${studentId}`);
        
        // Ambil semua submissions
        const snapshot = await window.firebaseDatabase.ref('submissions').once('value');
        const allSubmissions = snapshot.val() || {};
        
        let deletedCount = 0;
        
        // Loop melalui setiap sub materi
        for (const [subId, submissions] of Object.entries(allSubmissions)) {
            // Loop melalui setiap submission di sub materi
            for (const [submissionId, submission] of Object.entries(submissions)) {
                // Jika submission milik siswa yang dihapus
                if (submission.studentId === studentId) {
                    await window.firebaseDatabase.ref(`submissions/${subId}/${submissionId}`).remove();
                    deletedCount++;
                    console.log(`✅ Submission LKPD ${submissionId} dihapus`);
                }
            }
        }
        
        return deletedCount;
        
    } catch (error) {
        console.error('Error deleting student LKPD submissions:', error);
        return 0;
    }
}

// Fungsi untuk menghapus semua submissions LKPD
async function deleteAllLkpdSubmissions() {
    if (!window.firebaseDatabase) return 0;
    
    try {
        const snapshot = await window.firebaseDatabase.ref('submissions').once('value');
        const submissions = snapshot.val();
        
        if (submissions) {
            await window.firebaseDatabase.ref('submissions').remove();
            return Object.keys(submissions).length;
        }
        return 0;
    } catch (error) {
        console.error('Error deleting all submissions:', error);
        return 0;
    }
}

// =============== HANDLER DELETE SISWA ===============

// Handle delete satu siswa (SUDAH DENGAN LKPD)
function handleDeleteStudent(e) {
    const btn = e.currentTarget;
    const studentId = btn.dataset.deleteStudent;
    const student = store.getById(studentId);
    const progress = getProgress(studentId);
    
    // Konfirmasi hapus
    if (!confirm(`Hapus siswa ${student?.name || ''} dan semua datanya (nilai & LKPD)?`)) {
        return;
    }
    
    // Tampilkan loading
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '⏳ Menghapus...';
    
    // Hapus dari store
    if (student) store.delete(student.id);
    if (progress) store.delete(progress.id);
    
    // Hapus submissions LKPD dari Firebase
    deleteStudentLkpdSubmissions(studentId).then(deletedCount => {
        if (deletedCount > 0) {
            showToast(`Siswa dihapus (${deletedCount} file LKPD ikut terhapus)`, 'success');
        } else {
            showToast('Siswa dihapus', 'success');
        }
    }).catch(error => {
        console.error('Gagal hapus LKPD:', error);
        showToast('Siswa dihapus (gagal hapus beberapa file LKPD)', 'warning');
    }).finally(() => {
        // Kembalikan button
        btn.disabled = false;
        btn.innerHTML = originalText;
        render();
    });
}

// Handle delete semua siswa (SUDAH DENGAN LKPD)
function handleDeleteAllStudents(e) {
    const btn = e.currentTarget;
    const students = getStudents();
    
    if (students.length === 0) {
        showToast('Tidak ada data siswa', 'info');
        return;
    }
    
    if (btn.dataset.confirming === 'true') {
        btn.disabled = true;
        btn.innerHTML = '<span>🗑️</span><span class="hidden sm:inline">Menghapus...</span>';
        
        // Hapus semua submissions LKPD
        deleteAllLkpdSubmissions().then(deletedCount => {
            console.log(`✅ ${deletedCount} submission LKPD dihapus`);
        }).catch(error => {
            console.error('Gagal hapus submissions:', error);
        });
        
        // Hapus semua siswa dan progress
        for (const s of students) {
            store.delete(s.id);
            const progress = getProgress(s.id);
            if (progress) store.delete(progress.id);
        }
        
        showToast('Semua data siswa dan LKPD dihapus', 'success');
        btn.dataset.confirming = 'false';
        render();
        
    } else {
        btn.dataset.confirming = 'true';
        btn.innerHTML = '<span>⚠️</span><span class="hidden sm:inline">Konfirmasi Hapus Semua?</span>';
        setTimeout(() => {
            if (btn) {
                btn.dataset.confirming = 'false';
                btn.innerHTML = '<span>🗑️</span><span class="hidden sm:inline">Hapus Semua</span>';
            }
        }, 3000);
    }
}

// =============== HANDLER DELETE NILAI (PRETEST/POSTTEST) ===============

// Handle delete semua pretest (TANPA HAPUS LKPD)
function handleDeletePretest(e) {
    const btn = e.currentTarget;
    const relevantStudents = getStudents().filter(s => {
        const progress = getProgress(s.id);
        return progress && progress.pretestDone;
    });

    if (relevantStudents.length === 0) {
        showToast('Tidak ada data pretest', 'info');
        return;
    }

    if (btn.dataset.confirming === 'true') {
        btn.disabled = true;
        btn.innerHTML = '<span>🗑️</span><span>Menghapus...</span>';

        for (const s of relevantStudents) {
            const progress = getProgress(s.id);
            if (progress) {
                store.update(progress.id, {
                    pretestDone: false,
                    pretestAnswers: '[]',
                    pretestScore: 0
                });
            }
        }

        showToast('Semua data pretest dihapus', 'success');
        btn.dataset.confirming = 'false';
        render();
        
    } else {
        btn.dataset.confirming = 'true';
        btn.innerHTML = '<span>⚠️</span><span>Konfirmasi?</span>';
        setTimeout(() => {
            if (btn) {
                btn.dataset.confirming = 'false';
                btn.innerHTML = '<span>🗑️</span><span>Hapus</span>';
            }
        }, 3000);
    }
}

// Handle delete semua posttest (TANPA HAPUS LKPD)
function handleDeletePosttest(e) {
    const btn = e.currentTarget;
    const relevantStudents = getStudents().filter(s => {
        const progress = getProgress(s.id);
        return progress && progress.posttestDone;
    });

    if (relevantStudents.length === 0) {
        showToast('Tidak ada data posttest', 'info');
        return;
    }

    if (btn.dataset.confirming === 'true') {
        btn.disabled = true;
        btn.innerHTML = '<span>🗑️</span><span>Menghapus...</span>';

        for (const s of relevantStudents) {
            const progress = getProgress(s.id);
            if (progress) {
                store.update(progress.id, {
                    posttestDone: false,
                    posttestAnswers: '[]',
                    posttestScore: 0
                });
            }
        }

        showToast('Semua data posttest dihapus', 'success');
        btn.dataset.confirming = 'false';
        render();
        
    } else {
        btn.dataset.confirming = 'true';
        btn.innerHTML = '<span>⚠️</span><span>Konfirmasi?</span>';
        setTimeout(() => {
            if (btn) {
                btn.dataset.confirming = 'false';
                btn.innerHTML = '<span>🗑️</span><span>Hapus</span>';
            }
        }, 3000);
    }
}

// Handle delete nilai per siswa (TANPA HAPUS LKPD)
function handleDeleteScore(e) {
    const progressId = e.currentTarget.dataset.deleteScore;
    const progress = store.getById(progressId);
    
    if (!progress) return;
    
    // Konfirmasi
    if (!confirm('Hapus data nilai siswa ini? Data LKPD tetap ada.')) {
        return;
    }
    
    // Hapus nilai saja (pretest/posttest)
    store.update(progress.id, {
        pretestDone: false,
        posttestDone: false,
        pretestAnswers: '[]',
        posttestAnswers: '[]',
        pretestScore: 0,
        posttestScore: 0
    });
    
    showToast('Data nilai dihapus', 'success');
    render();
}

// =============== INITIALIZATION ===============
store.subscribe((data) => {
    if (state.currentUser && state.currentUser.id) {
        const updatedUser = data.find(d => d.id === state.currentUser.id);
        if (updatedUser) state.currentUser = updatedUser;
    }
    render();
});

// Bersihkan data orphan saat aplikasi dimulai
document.addEventListener('DOMContentLoaded', () => {
    store.cleanOrphanData();
    render();
});