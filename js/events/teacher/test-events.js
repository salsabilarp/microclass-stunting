// =============== TEST EVENT LISTENERS ===============
function attachTestEventListeners() {
    // Open test modals
    document.getElementById('addPretest')?.addEventListener('click', () => openTestModal('pretest'));
    document.getElementById('addPosttest')?.addEventListener('click', () => openTestModal('posttest'));

    // View test
    document.querySelectorAll('[data-view-test]').forEach(btn => {
        btn.addEventListener('click', () => {
            const testType = btn.dataset.viewTest;
            const test = getTests().find(t => t.testType === testType);
            if (test) {
                const questions = parseJSON(test.questions);
                document.getElementById('modalViewTestTitle').textContent = testType === 'pretest' ? 'Soal Pretest' : 'Soal Posttest';
                document.getElementById('viewTestContainer').innerHTML = questions.map((q, i) => `
                    <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-purple-500">
                        <p class="font-semibold text-gray-800 mb-2">${i + 1}. ${q.question}</p>
                        <p class="text-sm ${q.answer ? 'text-green-600' : 'text-red-600'} font-medium">
                            ✓ Jawaban: ${q.answer ? 'Benar' : 'Salah'}
                        </p>
                    </div>
                `).join('');
                document.getElementById('modalViewTest').classList.remove('hidden');
            }
        });
    });

    document.getElementById('closeViewTest')?.addEventListener('click', () => {
        document.getElementById('modalViewTest').classList.add('hidden');
    });

    // Edit test
    document.querySelectorAll('[data-edit-test]').forEach(btn => {
        btn.addEventListener('click', () => {
            const testType = btn.dataset.editTest;
            const test = getTests().find(t => t.testType === testType);
            if (test) {
                state.currentTestType = testType;
                state.testQuestions = parseJSON(test.questions);
                state.editingTest = test;
                document.getElementById('modalTestTitle').textContent = `Edit ${testType === 'pretest' ? 'Pretest' : 'Posttest'}`;
                renderTestQuestions();
                document.getElementById('modalTest').classList.remove('hidden');
            }
        });
    });

    // Delete test
    document.querySelectorAll('[data-delete-test]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const testId = e.currentTarget.dataset.deleteTest;
            store.delete(testId);
            showToast('Soal dihapus');
        });
    });

    // Add question
    document.getElementById('addQuestion')?.addEventListener('click', () => {
        state.testQuestions.push({ question: '', answer: true });
        renderTestQuestions();
    });

    // Cancel test
    document.getElementById('cancelTest')?.addEventListener('click', () => {
        document.getElementById('modalTest').classList.add('hidden');
    });

    // Save test
    document.getElementById('saveTest')?.addEventListener('click', () => {
        const validQuestions = state.testQuestions.filter(q => q.question.trim());
        if (validQuestions.length === 0) {
            showToast('Tambahkan minimal 1 soal', 'error');
            return;
        }

        const data = {
            type: 'test',
            testType: state.currentTestType,
            questions: JSON.stringify(validQuestions)
        };

        if (state.editingTest) {
            store.update(state.editingTest.id, data);
        } else {
            store.create(data);
        }

        document.getElementById('modalTest').classList.add('hidden');
        showToast('Soal disimpan');
    });
}

function renderTestQuestions() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;

    container.innerHTML = state.testQuestions.map((q, i) => `
        <div class="bg-white border border-gray-200 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
                <span class="font-semibold text-gray-700 px-3 py-1 bg-purple-100 rounded-lg">${i + 1}</span>
                ${state.testQuestions.length > 1 ? `
                    <button data-remove-q="${i}" class="text-red-500 hover:text-red-700 font-bold">✕</button>
                ` : ''}
            </div>
            <textarea data-q-text="${i}" class="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:ring-2 focus:ring-purple-500" rows="2" placeholder="Masukkan pertanyaan">${q.question}</textarea>
            <div class="flex gap-4">
                <label class="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
                    <input type="radio" name="answer${i}" value="true" ${q.answer ? 'checked' : ''} data-q-ans="${i}" class="w-4 h-4 text-green-600">
                    <span class="text-green-600 font-medium">✓ Benar</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-red-50 transition-all">
                    <input type="radio" name="answer${i}" value="false" ${!q.answer ? 'checked' : ''} data-q-ans="${i}" class="w-4 h-4 text-red-600">
                    <span class="text-red-600 font-medium">✕ Salah</span>
                </label>
            </div>
        </div>
    `).join('');

    document.getElementById('questionCount').textContent = state.testQuestions.length + ' soal';

    container.querySelectorAll('[data-q-text]').forEach(input => {
        input.addEventListener('input', (e) => {
            state.testQuestions[parseInt(e.target.dataset.qText)].question = e.target.value;
        });
    });

    container.querySelectorAll('[data-q-ans]').forEach(input => {
        input.addEventListener('change', (e) => {
            state.testQuestions[parseInt(e.target.dataset.qAns)].answer = e.target.value === 'true';
        });
    });

    container.querySelectorAll('[data-remove-q]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.testQuestions.splice(parseInt(btn.dataset.removeQ), 1);
            renderTestQuestions();
        });
    });

    // Di dalam attachTestEventListeners(), tambahkan:

        // Refresh LKPD
        document.querySelectorAll('[data-refresh-lkpd]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const subId = e.currentTarget.dataset.refreshLkpd;
                const submissionsDiv = document.getElementById(`submissions-${subId}`);
                if (submissionsDiv) {
                    submissionsDiv.innerHTML = renderSubmissionTable(subId);
                    showToast('Data diperbarui');
                }
            });
        });

        // Export LKPD
        document.querySelectorAll('[data-export-lkpd]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const subId = e.currentTarget.dataset.exportLkpd;
                const sub = getSubMateri().find(s => s.id === subId);
                await exportLkpdToExcel(subId, sub?.lkpdTitle || 'LKPD');
            });
        });

        // Delete submission
        document.querySelectorAll('[data-delete-submission]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const submissionId = e.currentTarget.dataset.deleteSubmission;
                const subId = e.currentTarget.dataset.subId;
                await deleteSubmission(subId, submissionId);
            });
        });
}

function openTestModal(type) {
    state.currentTestType = type;
    state.testQuestions = [{ question: '', answer: true }];
    state.editingTest = null;
    document.getElementById('modalTestTitle').textContent = `Buat ${type === 'pretest' ? 'Pretest' : 'Posttest'}`;
    renderTestQuestions();
    document.getElementById('modalTest').classList.remove('hidden');
}