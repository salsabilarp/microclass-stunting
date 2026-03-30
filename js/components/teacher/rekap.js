// =============== REKAP NILAI ===============

// Di awal setiap file component, pastikan fungsi didefinisikan secara global
window.renderRekapNilai = renderRekapNilai;
window.exportPretestToExcel = exportPretestToExcel;
window.exportPosttestToExcel = exportPosttestToExcel;

function renderRekapNilai(students, pretest, posttest) {
    return `
        <div class="animate-fade">
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">📈 Rekap Nilai</h1>
            </div>

            <!-- Tab Navigation -->
            <div class="flex flex-col sm:flex-row gap-3 mb-6">
                <button id="tabPretest" 
                    class="flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all
                           bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm">
                    <span class="text-xl">✏️</span>
                    <span>Pretest</span>
                    <span class="bg-orange-200 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">
                        ${pretest ? parseJSON(pretest.questions).length : 0} soal
                    </span>
                </button>
                <button id="tabPosttest" 
                    class="flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-semibold transition-all
                           bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm">
                    <span class="text-xl">✏️</span>
                    <span>Posttest</span>
                    <span class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-bold">
                        ${posttest ? parseJSON(posttest.questions).length : 0} soal
                    </span>
                </button>
            </div>

            <!-- Pretest Tools Section -->
            <div id="pretestTools" class="bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-5 md:p-6 mb-6 border border-orange-200">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
                            ✏️
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-800">Pretest</h2>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-sm bg-white px-3 py-1 rounded-full text-orange-600 font-semibold">
                                    ${students.filter(s => getProgress(s.id)?.pretestDone).length}/${students.length} siswa
                                </span>
                                <span class="text-xs text-gray-500">selesai</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="refreshPretest" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-sm font-semibold shadow-sm border border-blue-200">
                            <span class="text-lg">🔄</span>
                            <span>Refresh</span>
                        </button>
                        <button id="deletePretestRekap" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm font-semibold shadow-sm border border-red-200">
                            <span class="text-lg">🗑️</span>
                            <span>Hapus</span>
                        </button>
                        <button id="exportPretest" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-semibold shadow-sm">
                            <span class="text-lg">📥</span>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
                
                <!-- Pretest Statistics -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-orange-200">
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Total Soal</div>
                        <div class="text-2xl font-bold text-orange-600">${pretest ? parseJSON(pretest.questions).length : 0}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Rata-rata</div>
                        <div class="text-2xl font-bold text-orange-600">${calculateAverageScore(students, 'pretest')}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Nilai Tertinggi</div>
                        <div class="text-2xl font-bold text-green-600">${calculateHighestScore(students, 'pretest')}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Nilai Terendah</div>
                        <div class="text-2xl font-bold text-red-600">${calculateLowestScore(students, 'pretest')}</div>
                    </div>
                </div>
            </div>

            <!-- Posttest Tools Section -->
            <div id="posttestTools" class="hidden bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl p-5 md:p-6 mb-6 border border-green-200">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
                            ✏️
                        </div>
                        <div>
                            <h2 class="text-xl font-bold text-gray-800">Posttest</h2>
                            <div class="flex items-center gap-2 mt-1">
                                <span class="text-sm bg-white px-3 py-1 rounded-full text-green-600 font-semibold">
                                    ${students.filter(s => getProgress(s.id)?.posttestDone).length}/${students.length} siswa
                                </span>
                                <span class="text-xs text-gray-500">selesai</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button id="refreshPosttest" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all text-sm font-semibold shadow-sm border border-blue-200">
                            <span class="text-lg">🔄</span>
                            <span>Refresh</span>
                        </button>
                        <button id="deletePosttestRekap" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm font-semibold shadow-sm border border-red-200">
                            <span class="text-lg">🗑️</span>
                            <span>Hapus</span>
                        </button>
                        <button id="exportPosttest" 
                            class="flex items-center justify-center gap-2 px-5 py-3 sm:px-4 sm:py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all text-sm font-semibold shadow-sm">
                            <span class="text-lg">📥</span>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>
                
                <!-- Posttest Statistics -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-green-200">
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Total Soal</div>
                        <div class="text-2xl font-bold text-green-600">${posttest ? parseJSON(posttest.questions).length : 0}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Rata-rata</div>
                        <div class="text-2xl font-bold text-green-600">${calculateAverageScore(students, 'posttest')}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Nilai Tertinggi</div>
                        <div class="text-2xl font-bold text-green-600">${calculateHighestScore(students, 'posttest')}</div>
                    </div>
                    <div class="bg-white/80 backdrop-blur rounded-xl p-4">
                        <div class="text-xs text-gray-500 mb-1">Nilai Terendah</div>
                        <div class="text-2xl font-bold text-red-600">${calculateLowestScore(students, 'posttest')}</div>
                    </div>
                </div>
            </div>

            

            <!-- Pretest Results -->
            <div id="pretestContainer" class="bg-white rounded-2xl card-shadow p-4 md:p-6">
                ${!pretest ? `
                    <div class="text-center py-12 text-gray-400">
                        <div class="text-5xl mb-4">✏️</div>
                        <p class="text-lg font-medium">Belum ada pretest dibuat</p>
                        <p class="text-sm mt-2">Buat pretest terlebih dahulu di menu Kelola Pretest & Posttest</p>
                    </div>
                ` : students.filter(s => getProgress(s.id)?.pretestDone).length === 0 ? `
                    <div class="text-center py-12 text-gray-400">
                        <div class="text-5xl mb-4">⏳</div>
                        <p class="text-lg font-medium">Belum ada siswa mengerjakan pretest</p>
                        <p class="text-sm mt-2">Tunggu siswa menyelesaikan pretest mereka</p>
                    </div>
                ` : renderPretestTable(students, pretest)}
            </div>

            <!-- Posttest Results -->
            <div id="posttestContainer" class="hidden bg-white rounded-2xl card-shadow p-4 md:p-6">
                ${!posttest ? `
                    <div class="text-center py-12 text-gray-400">
                        <div class="text-5xl mb-4">✏️</div>
                        <p class="text-lg font-medium">Belum ada posttest dibuat</p>
                        <p class="text-sm mt-2">Buat posttest terlebih dahulu di menu Kelola Pretest & Posttest</p>
                    </div>
                ` : students.filter(s => getProgress(s.id)?.posttestDone).length === 0 ? `
                    <div class="text-center py-12 text-gray-400">
                        <div class="text-5xl mb-4">⏳</div>
                        <p class="text-lg font-medium">Belum ada siswa mengerjakan posttest</p>
                        <p class="text-sm mt-2">Tunggu siswa menyelesaikan posttest mereka</p>
                    </div>
                ` : renderPosttestTable(students, posttest)}
            </div>
        </div>
    `;
}

// Fungsi helper untuk menghitung rata-rata nilai
function calculateAverageScore(students, testType) {
    const scores = students
        .map(s => {
            const progress = getProgress(s.id);
            return testType === 'pretest' ? progress?.pretestScore : progress?.posttestScore;
        })
        .filter(score => score !== undefined && score !== null);
    
    if (scores.length === 0) return 0;
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round(average);
}

// Fungsi helper untuk nilai tertinggi
function calculateHighestScore(students, testType) {
    const scores = students
        .map(s => {
            const progress = getProgress(s.id);
            return testType === 'pretest' ? progress?.pretestScore : progress?.posttestScore;
        })
        .filter(score => score !== undefined && score !== null);
    
    if (scores.length === 0) return 0;
    return Math.max(...scores);
}

// Fungsi helper untuk nilai terendah
function calculateLowestScore(students, testType) {
    const scores = students
        .map(s => {
            const progress = getProgress(s.id);
            return testType === 'pretest' ? progress?.pretestScore : progress?.posttestScore;
        })
        .filter(score => score !== undefined && score !== null);
    
    if (scores.length === 0) return 0;
    return Math.min(...scores);
}

function renderPretestTable(students, pretest) {
    const questions = parseJSON(pretest.questions);
    const totalSoal = questions.length;
    
    return `
        <div class="overflow-x-auto">
            <table class="min-w-full w-full border-collapse">
                <thead>
                    <tr class="bg-orange-50">
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">No</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Nama</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Kelas</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Sekolah</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Tanggal</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b" colspan="${totalSoal}">Jawaban (${totalSoal} soal)</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Benar</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Salah</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Nilai</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Aksi</th>
                    </tr>
                    <tr class="bg-orange-50/50">
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        ${Array.from({ length: totalSoal }, (_, i) => 
                            `<th class="text-center py-2 px-2 border-b text-xs font-medium text-gray-500">${i + 1}</th>`
                        ).join('')}
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                    </tr>
                </thead>
                <tbody>
                    ${students.filter(s => getProgress(s.id)?.pretestDone).map((s, index) => {
                        const progress = getProgress(s.id);
                        const answers = parseJSON(progress.pretestAnswers);
                        const correctCount = answers.filter((a, i) => a === questions[i]?.answer).length;
                        const wrongCount = totalSoal - correctCount;
                        
                        return `
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-3 px-4 font-medium text-gray-500">${index + 1}</td>
                                <td class="py-3 px-4 font-medium">${s.name}</td>
                                <td class="py-3 px-4">${s.kelas}</td>
                                <td class="py-3 px-4">${s.sekolah}</td>
                                <td class="py-3 px-4 text-sm">${formatDate(progress.createdAt || progress.updatedAt || new Date().toISOString())}</td>
                                ${answers.map(answer => `
                                    <td class="py-3 px-2 text-center">
                                        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold 
                                            ${answer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                            ${answer ? 'B' : 'S'}
                                        </span>
                                    </td>
                                `).join('')}
                                <td class="py-3 px-4 text-center font-semibold text-green-600">${correctCount}</td>
                                <td class="py-3 px-4 text-center font-semibold text-red-600">${wrongCount}</td>
                                <td class="py-3 px-4 text-center">
                                    <span class="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold">${progress.pretestScore || 0}</span>
                                </td>
                                <td class="py-3 px-4 text-center">
                                    <button data-delete-score="${progress.id}" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus nilai">
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
}

function renderPosttestTable(students, posttest) {
    const questions = parseJSON(posttest.questions);
    const totalSoal = questions.length;
    
    return `
        <div class="overflow-x-auto">
            <table class="min-w-full w-full border-collapse">
                <thead>
                    <tr class="bg-green-50">
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">No</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Nama</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Kelas</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Sekolah</th>
                        <th class="text-left py-3 px-4 font-semibold text-gray-600 border-b">Tanggal</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b" colspan="${totalSoal}">Jawaban (${totalSoal} soal)</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Benar</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Salah</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Nilai</th>
                        <th class="text-center py-3 px-4 font-semibold text-gray-600 border-b">Aksi</th>
                    </tr>
                    <tr class="bg-green-50/50">
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        ${Array.from({ length: totalSoal }, (_, i) => 
                            `<th class="text-center py-2 px-2 border-b text-xs font-medium text-gray-500">${i + 1}</th>`
                        ).join('')}
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                        <th class="py-2 px-4 border-b"></th>
                    </tr>
                </thead>
                <tbody>
                    ${students.filter(s => getProgress(s.id)?.posttestDone).map((s, index) => {
                        const progress = getProgress(s.id);
                        const answers = parseJSON(progress.posttestAnswers);
                        const correctCount = answers.filter((a, i) => a === questions[i]?.answer).length;
                        const wrongCount = totalSoal - correctCount;
                        
                        return `
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-3 px-4 font-medium text-gray-500">${index + 1}</td>
                                <td class="py-3 px-4 font-medium">${s.name}</td>
                                <td class="py-3 px-4">${s.kelas}</td>
                                <td class="py-3 px-4">${s.sekolah}</td>
                                <td class="py-3 px-4 text-sm">${formatDate(progress.updatedAt || progress.createdAt || new Date().toISOString())}</td>
                                ${answers.map(answer => `
                                    <td class="py-3 px-2 text-center">
                                        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold 
                                            ${answer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                                            ${answer ? 'B' : 'S'}
                                        </span>
                                    </td>
                                `).join('')}
                                <td class="py-3 px-4 text-center font-semibold text-green-600">${correctCount}</td>
                                <td class="py-3 px-4 text-center font-semibold text-red-600">${wrongCount}</td>
                                <td class="py-3 px-4 text-center">
                                    <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">${progress.posttestScore || 0}</span>
                                </td>
                                <td class="py-3 px-4 text-center">
                                    <button data-delete-score="${progress.id}" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus nilai">
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
}

// Export Functions
function exportPretestToExcel() {
    const students = getStudents();
    const pretest = getTests().find(t => t.testType === 'pretest');
    
    if (!pretest) {
        showToast('Belum ada pretest dibuat', 'error');
        return;
    }

    const questions = parseJSON(pretest.questions);
    const totalSoal = questions.length;
    const exportData = [];
    let no = 1;
    
    students.forEach(s => {
        const progress = getProgress(s.id);
        if (progress?.pretestDone) {
            const answers = parseJSON(progress.pretestAnswers);
            const correctCount = answers.filter((a, i) => a === questions[i]?.answer).length;
            const wrongCount = totalSoal - correctCount;
            
            const rowData = {
                'No': no++,
                'Tanggal': formatDate(progress.createdAt || progress.updatedAt || new Date().toISOString()),
                'Nama': s.name,
                'Kelas': s.kelas,
                'Sekolah': s.sekolah
            };
            
            answers.forEach((answer, index) => {
                rowData[`Soal ${index + 1}`] = answer ? 'B' : 'S';
            });
            
            rowData['Jumlah Benar'] = correctCount;
            rowData['Jumlah Salah'] = wrongCount;
            rowData['Nilai'] = progress.pretestScore || 0;
            
            exportData.push(rowData);
        }
    });

    if (exportData.length === 0) {
        showToast('Belum ada siswa mengerjakan pretest', 'info');
        return;
    }

    exportToExcel(exportData, `Rekap_Pretest_${new Date().toISOString().slice(0,10)}`);
}

function exportPosttestToExcel() {
    const students = getStudents();
    const posttest = getTests().find(t => t.testType === 'posttest');
    
    if (!posttest) {
        showToast('Belum ada posttest dibuat', 'error');
        return;
    }

    const questions = parseJSON(posttest.questions);
    const totalSoal = questions.length;
    const exportData = [];
    let no = 1;
    
    students.forEach(s => {
        const progress = getProgress(s.id);
        if (progress?.posttestDone) {
            const answers = parseJSON(progress.posttestAnswers);
            const correctCount = answers.filter((a, i) => a === questions[i]?.answer).length;
            const wrongCount = totalSoal - correctCount;
            
            const rowData = {
                'No': no++,
                'Tanggal': formatDate(progress.updatedAt || progress.createdAt || new Date().toISOString()),
                'Nama': s.name,
                'Kelas': s.kelas,
                'Sekolah': s.sekolah
            };
            
            answers.forEach((answer, index) => {
                rowData[`Soal ${index + 1}`] = answer ? 'B' : 'S';
            });
            
            rowData['Jumlah Benar'] = correctCount;
            rowData['Jumlah Salah'] = wrongCount;
            rowData['Nilai'] = progress.posttestScore || 0;
            
            exportData.push(rowData);
        }
    });

    if (exportData.length === 0) {
        showToast('Belum ada siswa mengerjakan posttest', 'info');
        return;
    }

    exportToExcel(exportData, `Rekap_Posttest_${new Date().toISOString().slice(0,10)}`);
}