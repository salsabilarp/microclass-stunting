// =============== TEACHER LKPD MANAGEMENT ===============

window.exportLkpdToExcel = exportLkpdToExcel;

// =============== FUNGSI DATABASE ===============

async function getSubmissions(subId) {
    if (!window.firebaseDatabase) return {};
    
    try {
        const snapshot = await window.firebaseDatabase.ref(`submissions/${subId}`).once('value');
        return snapshot.val() || {};
    } catch (error) {
        console.error('Error loading submissions:', error);
        return {};
    }
}

async function countTotalSubmissions(lkpdSubs) {
    let total = 0;
    for (const sub of lkpdSubs) {
        const subs = await getSubmissions(sub.id);
        total += Object.keys(subs).length;
    }
    return total;
}

// =============== RENDER FUNCTIONS ===============

function renderTeacherLkpd() {
    const materi = getMateri();
    const subMateri = getSubMateri();
    const students = getStudents();
    
    // Group sub materi berdasarkan materi induk
    const materiWithLkpd = materi.map(m => {
        const subs = subMateri.filter(sub => sub.materiId === m.id && sub.lkpdTitle);
        return {
            ...m,
            subs: subs
        };
    }).filter(m => m.subs.length > 0);
    
    setTimeout(async () => {
        const totalSubs = await countTotalSubmissions(subMateri.filter(sub => sub.lkpdTitle));
        const totalEl = document.querySelector('#total-submissions');
        if (totalEl) totalEl.textContent = totalSubs;
    }, 100);
    
    return `
        <div class="animate-fade">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">📋 Manajemen LKPD Siswa</h1>
                <div class="flex gap-2">
                    <button id="refreshAllLkpd" class="px-4 py-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-all text-sm font-medium flex items-center gap-1">
                        <span>🔄</span>
                        <span class="hidden sm:inline">Refresh Semua</span>
                    </button>
                </div>
            </div>

            <!-- Statistik Ringkasan -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div class="bg-white rounded-xl p-4 card-shadow">
                    <div class="text-2xl mb-1">📚</div>
                    <div class="text-2xl font-bold text-purple-600">${materi.length}</div>
                    <div class="text-sm text-gray-500">Total Materi</div>
                </div>
                <div class="bg-white rounded-xl p-4 card-shadow">
                    <div class="text-2xl mb-1">📋</div>
                    <div class="text-2xl font-bold text-indigo-600">${subMateri.filter(s => s.lkpdTitle).length}</div>
                    <div class="text-sm text-gray-500">Total LKPD</div>
                </div>
                <div class="bg-white rounded-xl p-4 card-shadow">
                    <div class="text-2xl mb-1">👨‍🎓</div>
                    <div class="text-2xl font-bold text-green-600">${students.length}</div>
                    <div class="text-sm text-gray-500">Total Siswa</div>
                </div>
                <div class="bg-white rounded-xl p-4 card-shadow">
                    <div class="text-2xl mb-1">📤</div>
                    <div class="text-2xl font-bold text-orange-600" id="total-submissions">0</div>
                    <div class="text-sm text-gray-500">Total Pengumpulan</div>
                </div>
                <div class="bg-white rounded-xl p-4 card-shadow">
                    <div class="text-2xl mb-1">✅</div>
                    <div class="text-2xl font-bold text-blue-600" id="completion-rate">0%</div>
                    <div class="text-sm text-gray-500">Tingkat Penyelesaian</div>
                </div>
            </div>

            <!-- Daftar Materi dengan Accordion -->
            <div class="space-y-4">
                ${materiWithLkpd.length === 0 ? `
                    <div class="bg-white rounded-2xl card-shadow p-12 text-center">
                        <div class="text-6xl mb-4">📋</div>
                        <h3 class="text-xl font-semibold text-gray-700 mb-2">Belum ada LKPD</h3>
                        <p class="text-gray-500">Tambahkan LKPD pada sub materi di menu Kelola Materi</p>
                    </div>
                ` : materiWithLkpd.map((materi, materiIndex) => `
                    <div class="bg-white rounded-2xl card-shadow overflow-hidden">
                        <!-- Header Materi (selalu visible) -->
                        <div class="p-4 md:p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                                        📚
                                    </div>
                                    <div>
                                        <h2 class="text-xl font-bold text-gray-800">${escapeHtml(materi.title)}</h2>
                                        <p class="text-sm text-gray-600">${materi.subs.length} LKPD</p>
                                    </div>
                                </div>
                                <button onclick="toggleMateri('materi-${materiIndex}')" class="px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                                    <span id="icon-materi-${materiIndex}">▼</span>
                                    <span class="hidden sm:inline">Tampilkan LKPD</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Daftar Sub Materi (hidden by default) -->
                        <div id="materi-${materiIndex}" class="hidden">
                            <div class="p-4 space-y-4">
                                <!-- Grid button sub materi -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                    ${materi.subs.map((sub, subIndex) => {
                                        const submissionCount = 0; // Akan diupdate async
                                        return `
                                            <button onclick="toggleSubMateri('sub-${sub.id}')" 
                                                class="lkpd-sub-btn flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-all text-left">
                                                <div class="flex items-center gap-3">
                                                    <span class="text-2xl">📋</span>
                                                    <div>
                                                        <h4 class="font-semibold text-gray-800">${escapeHtml(sub.lkpdTitle)}</h4>
                                                        
                                                    </div>
                                                </div>
                                                <span class="text-xl" id="icon-sub-${sub.id}">▼</span>
                                            </button>
                                        `;
                                    }).join('')}
                                </div>
                                
                                <!-- Container untuk tabel submissions -->
                                ${materi.subs.map(sub => `
                                    <div id="sub-${sub.id}" class="sub-materi-content hidden mt-4">
                                        <div class="flex items-center justify-between mb-4">
                                            <h3 class="text-lg font-bold text-gray-800">${escapeHtml(sub.lkpdTitle)}</h3>
                                            <div class="flex gap-2">
                                                <button onclick="refreshLkpdTable('${sub.id}')" class="px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all text-sm font-medium flex items-center gap-1">
                                                    <span>🔄</span>
                                                    <span>Refresh</span>
                                                </button>
                                                <button onclick="exportLkpdToExcel('${sub.id}', '${escapeHtml(sub.lkpdTitle)}')" class="px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all text-sm font-medium flex items-center gap-1">
                                                    <span>📥</span>
                                                    <span>Excel</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div id="submissions-loading-${sub.id}" class="text-center py-8">
                                            <span class="text-gray-400">Memuat data...</span>
                                        </div>
                                        <div id="submissions-table-${sub.id}" class="hidden"></div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Fungsi untuk toggle materi
window.toggleMateri = function(materiId) {
    const materiDiv = document.getElementById(materiId);
    const icon = document.getElementById(`icon-${materiId}`);
    
    if (materiDiv) {
        if (materiDiv.classList.contains('hidden')) {
            materiDiv.classList.remove('hidden');
            icon.textContent = '▲';
        } else {
            materiDiv.classList.add('hidden');
            icon.textContent = '▼';
            
            // Tutup juga semua sub materi di dalamnya
            materiDiv.querySelectorAll('.sub-materi-content').forEach(el => {
                el.classList.add('hidden');
            });
        }
    }
};

// Fungsi untuk toggle sub materi
window.toggleSubMateri = async function(subId) {
    const subDiv = document.getElementById(subId);
    const icon = document.getElementById(`icon-${subId}`);
    
    if (subDiv) {
        if (subDiv.classList.contains('hidden')) {
            // Tutup sub materi lain yang terbuka
            document.querySelectorAll('.sub-materi-content').forEach(el => {
                if (el.id !== subId) {
                    el.classList.add('hidden');
                    const otherIcon = document.getElementById(`icon-${el.id}`);
                    if (otherIcon) otherIcon.textContent = '▼';
                }
            });
            
            // Buka sub materi yang diklik
            subDiv.classList.remove('hidden');
            icon.textContent = '▲';
            
            // Load data jika belum pernah di-load
            const tableEl = document.getElementById(`submissions-table-${subId.replace('sub-', '')}`);
            if (tableEl && tableEl.classList.contains('hidden')) {
                await renderSubmissionTable(subId.replace('sub-', ''));
            }
        } else {
            subDiv.classList.add('hidden');
            icon.textContent = '▼';
        }
    }
};

async function renderSubmissionTable(subId) {
    try {
        const submissions = await getSubmissions(subId);
        const students = getStudents();
        const loadingEl = document.getElementById(`submissions-loading-${subId}`);
        const tableEl = document.getElementById(`submissions-table-${subId}`);
        
        if (!loadingEl || !tableEl) return;
        
        loadingEl.classList.add('hidden');
        tableEl.classList.remove('hidden');
        
        if (!submissions || Object.keys(submissions).length === 0) {
            tableEl.innerHTML = `
                <div class="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                    <div class="text-4xl mb-2">📭</div>
                    <p>Belum ada siswa yang mengumpulkan tugas</p>
                </div>
            `;
            return;
        }
        
        const submissionsList = Object.entries(submissions).map(([id, data]) => ({
            id,
            ...data
        })).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        
        tableEl.innerHTML = `
            <div class="overflow-x-auto rounded-xl border border-gray-200">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gradient-to-r from-indigo-50 to-purple-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nama</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Kelas</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Sekolah</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Link Drive</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Waktu</th>
                            <th class="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${submissionsList.map((sub, index) => {
                            const student = students.find(s => s.id === sub.studentId) || {};
                            
                            return `
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-3 text-sm text-gray-500">${index + 1}</td>
                                    <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(sub.studentName || student.name || '-')}</td>
                                    <td class="px-4 py-3 text-sm text-gray-500">${escapeHtml(student.kelas || '-')}</td>
                                    <td class="px-4 py-3 text-sm text-gray-500">${escapeHtml(student.sekolah || '-')}</td>
                                    <td class="px-4 py-3 text-sm">
                                        <a href="${sub.driveLink}" target="_blank" class="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 group">
                                            <span>🔗</span>
                                            <span class="truncate max-w-[150px] group-hover:text-blue-800">Buka Link</span>
                                        </a>
                                    </td>
                                    <td class="px-4 py-3 text-sm text-gray-500">
                                        ${formatDate(sub.submittedAt)}
                                    </td>
                                    <td class="px-4 py-3 text-sm text-center">
                                        <button onclick="deleteSubmission('${subId}', '${sub.id}')" class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        // Update total submissions
        const totalSubsEl = document.getElementById('total-submissions');
        if (totalSubsEl) {
            const allSubs = await getAllSubmissions();
            totalSubsEl.textContent = allSubs.length;
        }
        
        // Update completion rate
        updateCompletionRate();
        
    } catch (error) {
        console.error('Error rendering submission table:', error);
    }
}

// Fungsi untuk mendapatkan semua submissions
async function getAllSubmissions() {
    const allSubs = [];
    const subMateri = getSubMateri().filter(sub => sub.lkpdTitle);
    
    for (const sub of subMateri) {
        const subs = await getSubmissions(sub.id);
        if (subs && Object.keys(subs).length > 0) {
            allSubs.push(...Object.values(subs));
        }
    }
    
    return allSubs;
}

// Fungsi update completion rate
async function updateCompletionRate() {
    const students = getStudents();
    const allSubs = await getAllSubmissions();
    const uniqueStudents = new Set(allSubs.map(s => s.studentId));
    
    const rateEl = document.getElementById('completion-rate');
    if (rateEl && students.length > 0) {
        const rate = Math.round((uniqueStudents.size / students.length) * 100);
        rateEl.textContent = rate + '%';
    }
}

// =============== EXPORT FUNCTIONS ===============

async function exportLkpdToExcel(subId, subTitle) {
    try {
        showToast('Menyiapkan data...', 'info');
        
        const submissions = await getSubmissions(subId);
        const students = getStudents();
        
        if (!submissions || Object.keys(submissions).length === 0) {
            showToast('Belum ada data untuk diexport', 'error');
            return;
        }
        
        const exportData = [];
        let no = 1;
        
        const submissionsList = Object.entries(submissions).map(([id, data]) => ({
            id,
            ...data
        }));
        
        submissionsList.forEach(submission => {
            const student = students.find(s => s.id === submission.studentId) || {};
            
            exportData.push({
                'No': no++,
                'Nama': submission.studentName || student.name || '-',
                'Kelas': student.kelas || '-',
                'Sekolah': student.sekolah || '-',
                'Link Google Drive': submission.driveLink,
                'Waktu Pengumpulan': formatDate(submission.submittedAt)
            });
        });
        
        const fileName = `LKPD_${subTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().slice(0,10)}`;
        exportToExcel(exportData, fileName);
        showToast('Data berhasil diexport!', 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        showToast('Gagal export data: ' + error.message, 'error');
    }
}

// =============== EVENT HANDLERS ===============

window.refreshLkpdTable = async function(subId) {
    const loadingEl = document.getElementById(`submissions-loading-${subId}`);
    const tableEl = document.getElementById(`submissions-table-${subId}`);
    
    if (loadingEl && tableEl) {
        loadingEl.classList.remove('hidden');
        tableEl.classList.add('hidden');
        await renderSubmissionTable(subId);
        showToast('Data diperbarui');
    }
};

window.deleteSubmission = async function(subId, submissionId) {
    if (!confirm('Hapus tugas siswa ini?')) return;
    
    try {
        await window.firebaseDatabase.ref(`submissions/${subId}/${submissionId}`).remove();
        await renderSubmissionTable(subId);
        showToast('Tugas berhasil dihapus', 'success');
        
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Gagal menghapus tugas', 'error');
    }
};

// Refresh semua
document.addEventListener('click', async function(e) {
    if (e.target.id === 'refreshAllLkpd' || e.target.closest('#refreshAllLkpd')) {
        const lkpdSubs = getSubMateri().filter(sub => sub.lkpdTitle);
        
        showToast('Memperbarui semua data...', 'info');
        
        for (const sub of lkpdSubs) {
            await refreshLkpdTable(sub.id);
        }
        
        showToast('Semua data diperbarui', 'success');
    }
});
