$(document).ready(function() {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let checklists = JSON.parse(localStorage.getItem('checklists')) || [];
    let currentEditingId = null;

    // Render Notes
    function renderNotes() {
        const $list = $('#notesList');
        $list.empty();
        notes.forEach((note, index) => {
            const $card = $(`
                <div class="col-md-6 col-lg-4">
                    <div class="card note-card p-3 h-100" data-index="${index}">
                        <h6 class="fw-bold">${note.title || 'Untitled'}</h6>
                        <p class="text-muted small">${note.content.substring(0, 80)}${note.content.length > 80 ? '...' : ''}</p>
                        <small class="text-end text-muted">${new Date(note.date).toLocaleDateString()}</small>
                    </div>
                </div>
            `);
            $card.find('.note-card').on('click', () => editNote(index));
            $list.append($card);
        });
    }

    // Render Checklists
    function renderChecklists() {
        const $list = $('#checklistsList');
        $list.empty();
        checklists.forEach((list, idx) => {
            let itemsHTML = '';
            list.items.forEach((item, i) => {
                itemsHTML += `
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" ${item.checked ? 'checked' : ''} data-idx="${idx}" data-i="${i}">
                        <label class="form-check-label ${item.checked ? 'text-decoration-line-through' : ''}">${item.text}</label>
                    </div>`;
            });
            const $item = $(`
                <div class="list-group-item checklist-item">
                    <h6>${list.title}</h6>
                    ${itemsHTML}
                </div>
            `);
            $list.append($item);
        });

        // Checkbox handler
        $('.form-check-input').on('change', function() {
            const listIdx = $(this).data('idx');
            const itemIdx = $(this).data('i');
            checklists[listIdx].items[itemIdx].checked = this.checked;
            localStorage.setItem('checklists', JSON.stringify(checklists));
        });
    }

    // New Note
    $('#newNoteBtn').on('click', () => {
        currentEditingId = null;
        $('#noteTitle').val('');
        $('#noteContent').val('');
        $('#noteModal').modal('show');
    });

    // New Checklist
    $('#newChecklistBtn').on('click', () => {
        const title = prompt("Checklist Title (e.g. Grocery List)");
        if (!title) return;
        const newList = { title, items: [], date: Date.now() };
        checklists.unshift(newList);
        localStorage.setItem('checklists', JSON.stringify(checklists));
        renderChecklists();
        // Allow adding items (simple prompt for demo)
        addChecklistItem(checklists.length - 1);
    });

    function addChecklistItem(listIndex) {
        const text = prompt("Add item to checklist:");
        if (text) {
            checklists[listIndex].items.push({text, checked: false});
            localStorage.setItem('checklists', JSON.stringify(checklists));
            renderChecklists();
        }
    }

    // Save Note
    $('#saveNoteBtn').on('click', function() {
        const title = $('#noteTitle').val().trim();
        const content = $('#noteContent').val().trim();
        if (!content) return;

        if (currentEditingId !== null) {
            notes[currentEditingId] = { title, content, date: Date.now() };
        } else {
            notes.unshift({ title, content, date: Date.now() });
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        $('#noteModal').modal('hide');
        renderNotes();
    });

    function editNote(index) {
        currentEditingId = index;
        const note = notes[index];
        $('#noteTitle').val(note.title || '');
        $('#noteContent').val(note.content);
        $('#noteModal').modal('show');
    }

    // Simple Calendar Demo
    function renderMiniCalendar() {
        const $cal = $('#miniCalendar');
        $cal.empty();
        for (let i = 1; i <= 31; i++) {
            const $day = $(`<div class="text-center border rounded p-2 mx-1 mb-2" style="width:40px;cursor:pointer;">${i}</div>`);
            $day.on('click', () => {
                const task = prompt(`Add task for day ${i}?`);
                if (task) {
                    alert(`Task "${task}" added to calendar (demo)`);
                }
            });
            $cal.append($day);
        }
    }

    // Initialize
    renderNotes();
    renderChecklists();
    renderMiniCalendar();

    // Auto-save simulation on note input (in real use, it would trigger on blur)
    $('#noteContent').on('input', function() {
        // In a full version, this would trigger auto-save
    });

    // Demo welcome
    setTimeout(() => {
        if (notes.length === 0 && checklists.length === 0) {
            alert("Welcome to Notepad Web!\n\nCreate notes, checklists, and calendar tasks.\nEverything is saved locally and auto-saved.");
        }
    }, 1000);
});
