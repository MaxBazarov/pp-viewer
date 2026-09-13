function noteReplaceEnds(value)
{
    return value.replace(new RegExp('\r?\n', 'g'), '<br/>')
}

class Notes_NoteOverview
{
    constructor(note)
    {
        this.note = note;
        this.id = note.id;
        this.div = undefined;
        this.hidden = false;
        //        
        this.show();
    }
    show()
    {
        if (this.note.expandedObj && !this.note.expandedObj.hidden) this.note.expandedObj.hide();
        if (!this.note.overviewObj) this._build();
        //
        showEl(this.div);
        this.hidden = false;
        //
        if (notes.floatOverviewNote != null && notes.floatOverviewNote != this)
        {
            notes.floatOverviewNote.hide();
            notes.floatOverviewNote = null;;
        }
        notes.setFloatOverviewNote(this, this.id);
    }
    hide()
    {
        setTimeout(function (id)
        {
            notes.showHideMarker(id, true);
        }, 150, this.id);
        //
        hideEl(this.div);
        this.hidden = true;
        //        
        notes.unsetFloatOverviewNote(this, this.id);
    }
    _build()
    {
        function setElTopVisible(el)
        {
            const offset = 10;
            const rect = el.getBoundingClientRect();
            const top = rect.top
            if (top < offset)
            {
                const delta = offset - top;
                el.style.top = (rect.top + delta) + "px";
                el.style.height = rect.height + "px";
            }
        }
        function setElRightVisible(el)
        {
            const offset = 10;
            const rect = el.getBoundingClientRect();
            const sceneWidth = viewer.fullWidth - viewer.defSidebarWidth;
            if (rect.right > sceneWidth)
            {
                el.style.left = (sceneWidth - rect.width - offset) + "px";
                el.style.width = rect.width + "px";
            }
        }
        if (this.div)
        {
            this.div.remove();
            this.div = undefined;
        }
        //
        const note = this.note;
        const id = this.id;
        let page = viewer.currentPage;
        //
        //
        const sd = new StageDiv(
            note.x * viewer.currentZoom + viewer.currentMarginLeft,
            note.y * viewer.currentZoom + viewer.currentMarginTop,
            200, null, "note-overview-box", "note-overview" + id
        );
        const div = sd.elDiv()
        addClass(div, "note-overview-corner-lefttop")
        div.addEventListener("mouseleave", (e) =>
        {
            this.hide();
        });
        div.addEventListener("click", (e) =>
        {
            if (notes.floatNewNote)
            {
                return notes.floatNewNote.hide();
            }
            e.preventDefault();
            this.hide();
            notes.showNoteExpanded(id);
        }, undefined, true);
        //        
        div.innerHTML = this._buildHTML(note)
        this.div = div;
        //
        bySel('#notesScene').appendChild(div);
        setElTopVisible(div);
        setElRightVisible(div);
        //
        note.overviewObj = this;
    }
    _buildHTML(note)
    {
        let code = "";
        ///            
        //
        code += `
        <div id = "n${note.id}" class="note">
            <div>                             
                <span id="msg">${noteReplaceEnds(note.text)}<span>
            </div>
        `
        code += `
            </div>
        `;
        return code;
    }
}
class Notes_NoteExpanded
{
    constructor(note)
    {
        this.note = note;
        this.id = note.id;
        this.div = undefined;
        this.hidden = false;
        //        
        this.show();
    }
    show()
    {
        if (notes.floatExpandedNote == this)
        { // Hide
            return this.hide();
        }
        // Show
        if (!this.note.expandedObj) this._build();
        showEl(this.div);
        this.hidden = false;
        //
        if (notes.floatExpandedNote != null)
        {
            notes.floatExpandedNote.hide();
            notes.floatExpandedNote = null;;
        }
        //
        notes.floatExpandedNote = this;
        notes._selectNote(this.id, true);
    }
    hide()
    {
        //
        hideEl(this.div);
        this.hidden = true;
        this._cancelEditing();
        notes.floatExpandedNote = null;
        notes._highlightNote(this.id, false)
        notes._selectNote(this.id, false);
    }
    _replaceData(newNoteData)
    {
        // Replace load note by remote date
        const oldNote = notes.getNoteByID(newNoteData.id);
        if (!oldNote) return;
        Object.keys(oldNote).forEach(key => oldNote[key] = newNoteData[key]);
        // Rebuild view
        this._build();
    }
    _build()
    {
        function setElRightVisible(el)
        {
            const offset = 10;
            const rect = el.getBoundingClientRect();
            const sceneWidth = viewer.fullWidth - viewer.defSidebarWidth;
            if (rect.right > sceneWidth)
            {
                el.style.left = (sceneWidth - rect.width - offset) + "px";
                el.style.width = rect.width + "px";
            }
        }
        if (this.div)
        {
            this.div.remove();
            this.div = undefined;
        }
        //
        //
        const note = this.note;
        let page = viewer.currentPage;
        //
        const sd = new StageDiv(
            note.x * viewer.currentZoom + viewer.currentMarginLeft,
            note.y * viewer.currentZoom + viewer.currentMarginTop,
            240, null, "note-expanded-box", "note-expanded" + this.id
        );
        //sd.top = note.y + "px";
        const div = sd.elDiv()
        this.div = div;
        //        
        div.innerHTML = this._buildHTML()
        //
        bySel('#notesScene').appendChild(div);
        //        
        //        
        setElRightVisible(div);
        //
        note.expandedObj = this;
    }
    _buildHTML()
    {
        const notes = notes.notes;
        const note = this.note;

        function buildMessageHTML(note)
        {
            let code = "";
            //
            code += `
                <div id = "n${note.id}" class="note">                             
                    <span id="msg">${noteReplaceEnds(note.text)}<span>
                </div>
             </div>
            `
            return code;
        }
        let code = `
        <div class="header">
                <div style="width:100%;">Note</div>
        `
        code += `            
                <div style="cursor: pointer;margin-left:8px;" onclick="if(notes.floatExpandedNote) notes.floatExpandedNote.hide();  return false;">
                    <svg class="uiIcon16">
                        <use xlink:href="#icClose16"></use>
                    </svg>
                </div>
            </div>
    <div class="notes-list">
        `;
        code += buildMessageHTML(note);
        code += `
    </div>
`;
        return code;
    }

}
////
let notes = null;
class Notes
{
    constructor()
    {
        notes = this;
        this.currentPage = null

        this.notes = null
        //        
        this.floatExpandedNote = null;
        this.floatOverviewNote = null;
        //
        this.inputFocused = false
        notesViewer.notes = this
        //
        this.styles = {
            buttonPrimary: "margin-top:4px;border: none;border-radius:4px;font-size:12px;background-color:#008CBA;color:white;width:100px;height:30px",
            buttonSecondary: "margin-top:4px;border: none;border-radius:4px;font-size:12px;background-color:#e7e7e7; color: black;width:100px;height:30px",
            input: "font-size:12px;margin-left:0px;padding: 0.25em 0.5em;background-color:var(--color-background);border:2px solid var(--color-border);border-radius:4px;"
        }
    }
    ////////
    reloadNotes()
    {
        bySel("#notes_viewer_content #notes").innerHTML = "Loading...";
        this.build(viewer.currentPage.notes)
    }
    getNoteByID(noteID)
    {
        return this.notes[noteID];
    }
    ///////
    build(notes)
    {
        //
        this.notes = notes
        //        
        this._buildScene()
        this._buildMarkers()
        this._buildNotes();
    }
    //    
    _buildNoteHTML(note, index)
    {
        const counterStyle = "font-weight:bold;"
        ///
        let code = "";
        ///
        ///            
        let noteID = index;
        let actions = ""
        //
        code += `
            <div id = "n${noteID}" class="note"
                onclick = "notes._openNote(${noteID})"
                onmouseenter = "notes._highlightNote(${noteID},true,true)"
                onmouseleave = "notes._highlightNote(${noteID},false,true)"
            >
                <div>                             
                    <span id="msg">${noteReplaceEnds(note.text)}<span>
                </div>
            </div>
        `
        return code;
    }
    unsetFloatOverviewNote(obj, noteID)
    {
        this._highlightNote(noteID, false);
        this.floatOverviewNote = null;
    }
    setFloatOverviewNote(obj, noteID)
    {
        this._highlightNote(noteID, true);
        this.floatOverviewNote = obj;

    }
    _openNote(noteID)
    {
        this.showNoteExpanded(noteID);
    }
    _selectNote(noteID, state)
    {
        const div = bySel("#notes_viewer_content #notes #n" + noteID);
        if (div)
        {
            if (state)
                addClass(div, "selected");
            else
                removeClass(div, "selected");
        }
    }
    _highlightNote(noteID, state, onMouse = false)
    {
        const div = bySel("#notes_viewer_content #notes #n" + noteID);
        if (div)
        {
            if (state)
                addClass(div, "highlighted");
            else
                removeClass(div, "highlighted");
        }
        if (onMouse && state)
        {
            const text = bySel("#notesScene #mark-" + noteID + " text");
            text.animate([
                { fontSize: '12px' },
                { fontSize: '24px' },
                { fontSize: '12px' },
            ], {
                // timing options
                duration: 700,
                iterations: 1,
            });
        }
    }
    _addNote(newNoteHTML)
    {
        const el = bySel("#notes_viewer_content #notes #list");
        el.innerHTML = newNoteHTML + el.innerHTML;
    }
    _buildNotes()
    {
        let code = ""
        //
        //
        code += `<div id = "list">`
        let counter = this.notes.length
        this.notes.forEach(function (note, index)
        {
            code += this._buildNoteHTML(note, index);
            counter--;
        }, this)
        code += `</div> `
        //
        bySel("#notes_viewer_content #notes").innerHTML = code;
        //
        notesViewer.updateNoteCounter(this.notes.length)
    }
    _buildMarkers(showCount = false)
    {
        this._clearScene()
        //let counter = this.notes.length
        //
        this.notes.reverse().forEach(function (note, index)
        {
            if (undefined != note.x)
            {
                this.addMarkersToScene(index, note.x, note.y, index + 1, note)
            }
            //counter--
        }, this)
    }
    //
    _buildScene()
    {
        this._dropScene()
        //
        let page = viewer.currentPage
        let width = viewer.fullWidth;

        let code = `<div id = "notesScene" style="position:fixed"> <svg style="z-index:2" height="100%" width="${width}px"></svg>
                    </div> `
        bySel("body #container").innerHTML += code;
        //
        this.currentPage = page
    }
    showHideMarker(id, visible)
    {
        showEl(bySel(`#notesScene svg #mark-${id} `), visible);
    }
    showNoteOverview(id)
    {
        const note = this.getNoteByID(id);
        //
        if (note.overviewObj && !note.overviewObj.hidden) return;
        if (note.expandedObj && !note.expandedObj.hidden) return;
        //
        if (!note.overviewObj)
            note.overviewObj = new Notes_NoteOverview(note);
        else
            note.overviewObj.show();
    }
    showNoteExpanded(id)
    {
        const note = this.getNoteByID(id);
        if (!note.expandedObj)
            note.expandedObj = new Notes_NoteExpanded(note);
        else
            note.expandedObj.show();
    }
    addMarkersToScene(id, x, y, text = "", note = undefined)
    {
        const width = 40, height = 40;
        let r = 20
        x = (Number(x)) * viewer.currentZoom + viewer.currentMarginLeft;
        if ((x + width) >= (viewer.fullWidth - viewer.defSidebarWidth))
        {
            x = viewer.fullWidth - viewer.defSidebarWidth - width;
        }
        y = (Number(y)) * viewer.currentZoom + viewer.currentMarginTop;
        //        
        let code = `
        <svg
            id = "mark-${id}"
            onmouseenter = "notes.showNoteOverview('${id}')"
            width = "${width}" height = "${height}" id = "n${id}" x = "${x}" y = "${y}" fill = "none" xmlns = "http://www.w3.org/2000/svg"
        >
<g filter="url(#filter0_d_217_21)">
<path d="M3 3H19C27.8366 3 35 10.1634 35 19C35 27.8366 27.8366 35 19 35C10.1634 35 3 27.8366 3 19V3Z" fill="white" shape-rendering="crispEdges"/>
<rect x="7" y="7" width="24" height="24" rx="12" fill="#007BE5"/>
</g>
<text x="19" y="20" dy="0" style="fill:white;" dominant-baseline="middle" text-anchor="middle">${text}</text>
<defs>
<filter id="filter0_d_217_21" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dx="1" dy="1"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_217_21"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_217_21" result="shape"/>
</filter>
</defs>
</svg>
    `;

        if (note !== undefined)
        {
            let text = `
                <div id = "${id}> 
                    ${note.text}
                </div>
    `
            bySel('#notesScene').innerHTML += text;
            //            
        }
        bySel('#notesScene svg').innerHTML += code;
        bySel('#notesScene').innerHTML = bySel('#notesScene').innerHTML;
        //
    }
    removeCircleOnScene(id)
    {
        const el = bySel('#notesScene svg #' + id);
        const c = this.getNoteByID(id);
        c["mode"] = undefined;
        if (!el) return;
        el.remove();
    }
    _dropScene()
    {
        const scene = bySel('#notesScene');
        if (!scene) return;
        scene.remove();
    }
    _clearScene()
    {
        const svg = bySel('#notesScene svg');
        if (!svg) return;
        svg.innerHTML = "";
    }
    //
    showViewer()
    {
        this.reloadNotes();
    }
    hideViewer()
    {
        if (this.currentForm) this.currentForm.hideViewer()
        //
        this._dropScene()
        //        
    }
}