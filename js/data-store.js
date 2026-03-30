// =============== DATA MANAGEMENT ===============
class DataStore {
    constructor() {
        this.data = [];
        this.listeners = [];
        this.init();
    }

    async init() {
        // Coba load dari Firebase
        if (window.firebaseInitialized && window.firebaseDatabase) {
            try {
                const snapshot = await window.firebaseDatabase.ref('microclass_data').once('value');
                const firebaseData = snapshot.val();
                if (firebaseData && Array.isArray(firebaseData)) {
                    this.data = firebaseData;
                    console.log('📦 Data dimuat dari Firebase');
                } else {
                    this.loadFromLocalStorage();
                }
            } catch (e) {
                console.warn('Gagal load dari Firebase, pakai localStorage', e);
                this.loadFromLocalStorage();
            }
        } else {
            this.loadFromLocalStorage();
        }
        
        this.notify();
    }

    loadFromLocalStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this.data = JSON.parse(stored);
                console.log('💾 Data dimuat dari localStorage');
            } catch (e) {
                this.data = [];
            }
        } else {
            this.data = [];
        }
    }

    async saveToStorage() {
        // Simpan ke localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        
        // Simpan ke Firebase
        if (window.firebaseInitialized && window.firebaseDatabase) {
            try {
                await window.firebaseDatabase.ref('microclass_data').set(this.data);
                console.log('☁️ Data disinkronkan ke Firebase');
            } catch (e) {
                console.warn('Gagal sync ke Firebase', e);
            }
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
        listener(this.data);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.saveToStorage();
        this.listeners.forEach(listener => listener(this.data));
    }

    create(item) {
        const newItem = {
            ...item,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.data.push(newItem);
        this.notify();
        return newItem;
    }

    update(id, updates) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { 
                ...this.data[index], 
                ...updates, 
                updatedAt: new Date().toISOString() 
            };
            this.notify();
            return this.data[index];
        }
        return null;
    }

    delete(id) {
        this.data = this.data.filter(item => item.id !== id);
        this.notify();
    }

    getAll() { return this.data; }
    getByType(type) { return this.data.filter(item => item.type === type); }
    getById(id) { return this.data.find(item => item.id === id); }
    
    cleanOrphanData() {
        const materiIds = this.getByType('materi').map(m => m.id);
        
        const subs = this.getByType('submateri');
        subs.forEach(sub => {
            if (!materiIds.includes(sub.materiId)) {
                this.delete(sub.id);
            }
        });
        
        const studentIds = this.getByType('student').map(s => s.id);
        const progresses = this.getByType('progress');
        progresses.forEach(progress => {
            if (!studentIds.includes(progress.studentId)) {
                this.delete(progress.id);
            }
        });
        
        const validSubIds = this.getByType('submateri').map(s => s.id);
        progresses.forEach(progress => {
            if (progress.completedSubMateri) {
                const completedSubs = parseJSON(progress.completedSubMateri);
                const filteredSubs = completedSubs.filter(subId => validSubIds.includes(subId));
                if (completedSubs.length !== filteredSubs.length) {
                    this.update(progress.id, {
                        completedSubMateri: JSON.stringify(filteredSubs)
                    });
                }
            }
            
            if (progress.completedLkpd) {
                const completedLkpd = parseJSON(progress.completedLkpd);
                const filteredLkpd = completedLkpd.filter(subId => validSubIds.includes(subId));
                if (completedLkpd.length !== filteredLkpd.length) {
                    this.update(progress.id, {
                        completedLkpd: JSON.stringify(filteredLkpd)
                    });
                }
            }
        });
    }
}

const store = new DataStore();

function getStudents() { return store.getByType('student'); }
function getMateri() { return store.getByType('materi'); }
function getSubMateri(materiId = null) {
    const subs = store.getByType('submateri');
    const materiIds = getMateri().map(m => m.id);
    const validSubs = subs.filter(sub => materiIds.includes(sub.materiId));
    return materiId ? validSubs.filter(s => s.materiId === materiId) : validSubs;
}
function getTests() { return store.getByType('test'); }
function getProgress(studentId) {
    return store.getByType('progress').find(p => p.studentId === studentId);
}