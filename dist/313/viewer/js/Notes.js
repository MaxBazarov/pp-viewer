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
        if (!this.note.overviewObj) this._build();
        //
        showEl(this.div);
        this.hidden = false;
        //
        if (notesScene.floatOverviewNote != null && notesScene.floatOverviewNote != this)
        {
            notesScene.floatOverviewNote.hide();
            notesScene.floatOverviewNote = null;;
        }
        notesScene.setFloatOverviewNote(this, this.id);
    }
    hide()
    {
        setTimeout(function (id)
        {
            notesScene.showHideMarker(id, true);
        }, 150, this.id);
        //
        hideEl(this.div);
        this.hidden = true;
        //        
        notesScene.unsetFloatOverviewNote(this, this.id);
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
            note.x,
            note.y,
            200, null, "note-overview-box", "note-overview" + id
        );
        sd.position = "absolute";
        const div = sd.elDiv()
        addClass(div, "note-overview-corner-lefttop")
        div.addEventListener("mouseleave", (e) =>
        {
            this.hide();
        });
        //        
        div.innerHTML = this._buildHTML(note)
        this.div = div;
        //
        notesScene.sceneEl.appendChild(div);
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
                <span id="msg">${noteReplaceEnds(note.text)}`;
        if (note.link != null)
        {
            code += `<br/><br/><a href="${note.link}">Link</a>`;
        }
        code += `<span>
            </div>
        `
        code += `
            </div>
        `;
        return code;
    }
}
////
let notesScene = null;
class NotesScene
{
    constructor()
    {
        notesScene = this;
        this.notelist = null
        //        
        this.floatOverviewNote = null;
        //

    }
    getNoteByID(noteID)
    {
        return this.notelist[noteID];
    }
    _buildNoteHTML(note, index)
    {
        const counterStyle = "font-weight:bold;"
        ///
        let code = "";
        ///
        let noteID = index;
        //        
        code += `
            <div id = "n${noteID}" class="note"             
                onmouseenter = "notesScene.showNoteOverview(${noteID});notesScene._highlightNote(${noteID},true,true)"(${noteID},true,true)"
                onmouseleave = "notesScene.hidewNoteOverview(${noteID});notesScene._highlightNote(${noteID},false,true);"
            >
              <div class="head">                
                    <div class="author">#${index + 1}</div>
                </div>
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
    _buildMarkers(showCount = false)
    {
        this.notelist.forEach((note, index) => this.addMarkersToScene(index, note.x, note.y, index + 1, note));
    }
    //
    _buildScene()
    {
        this._dropScene()
        //        
        //let code = `<div id = "notesScene" style="position:fixed"> <svg style="z-index:2" height="100%" width="100%"></svg></div>`;
        //bySel(`body #container #div_links_${viewer.currentPage.index}`).innerHTML += code;
        //this.sceneEl = bySel("#notesScene svg");
        //let code = `<div id = "notesScene" style="position:fixed"> <svg style="z-index:2" height="100%" width="100%"></svg></div>`;        
        this.sceneEl = bySel(`body #container #div_links_${viewer.currentPage.index}`);
    }
    _dropScene()
    {
        if (!this.sceneEl) return;
        this.sceneEl.querySelectorAll(".notesMarker").forEach(el => el.remove());
    }
    showHideMarker(id, visible)
    {
        showEl(bySel(`#content #marker-${id} `), visible);
    }
    showNoteOverview(id)
    {
        const note = this.getNoteByID(id);
        //
        if (note.overviewObj && !note.overviewObj.hidden) return;
        //
        if (!note.overviewObj)
            note.overviewObj = new Notes_NoteOverview(note);
        else
            note.overviewObj.show();
    }
    hidewNoteOverview(id)
    {
        const note = this.getNoteByID(id);
        //
        if (!note.overviewObj || note.overviewObj.hidden) return;
        note.overviewObj.hide();
    }

    addMarkersToScene(id, x, y, text = "", note = undefined)
    {
        const width = 40, height = 40;
        let r = 20
        x = Number(x)
        if ((x + width) >= viewer.currentPage.width)
        {
            x = viewer.currentPage.width - width;
        }
        y = (Number(y))
        //        
        const sd = new StageDiv(
            x,
            y,
            width, height, "notesMarker", "marker-" + id
        );
        sd.position = "absolute";
        const div = sd.elDiv()

        let code = `
        <svg
            id = "mark-${id}"
            onmouseenter = "notesScene.showNoteOverview('${id}')"
            width = "${width}" height = "${height}" id = "n${id}" x = "0" y = "0" fill = "none" xmlns = "http://www.w3.org/2000/svg"
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
</div>
    `   ;
        div.innerHTML += code;
        this.sceneEl.appendChild(div);
    }

    _fillSidebar()
    {
        let code = ""
        //
        code += `<div id = "list">`
        let counter = this.notelist.length
        this.notelist.forEach(function (note, index)
        {
            code += this._buildNoteHTML(note, index);
            counter--;
        }, this)
        code += `</div> `
        //
        bySel("#notes_viewer_content #notes").innerHTML = code;
        //
        notesViewer.updateNoteCounter(this.notelist.length)
    }
    //

    //
    show()
    {
        // prepare data
        this.notelist = viewer.currentPage.notes;

        // Fill sidebar        
        this._fillSidebar()

        this._buildScene();
        this._buildMarkers()
    }
    hide()
    {
        this._dropScene()
    }

    reload()
    {
        this.hide();
        this.show();
    }
}