
let notesViewer = null;

class NotesViewer extends AbstractViewer
{
    constructor()
    {
        super("notes_viewer")

        this.alwaysHandlePageChanged = true
        this.preventCustomTextSearch = true
        this.blockMainNavigation = true;

        this.inputFocused = false
        notesViewer = this

        this.scene = new NotesScene();
    }

    initialize(force = false)
    {
        if (!super.initialize(force)) return
    }

    ///////////////////////////////////////////////// called by Viewer


    handleKeyDownWhileInactive(event)
    {
        if (78 == event.which)
        { // n
            // Key "n" activates self
            this.toggle()
        } else
        {
            return super.handleKeyDownWhileInactive(event)
        }

        event.preventDefault()
        return true
    }

    pageChanged()
    {
        this._showNotesCounter()
        if (!this.visible)
        {
            return
        }
        if (!this.inited) return this.initialize();
        notes.reloadNotes()
    }



    handleKeyDown(event)
    {
        if (78 == event.which)
        { // n           
            this.toggle()
        } else
        {
            return super.handleKeyDown(event)
        }

        event.preventDefault()
        return true
    }
    /////////////////////////////////////////////////

    _showNotesCounter()
    {
        notesViewer.updateNoteCounter(viewer.currentPage.notes.length)


    }

    updateNoteCounter(total)
    {
        var div = bySel('#nav #pageNotes')
        if (total > 0)
        {
            //div.innerHTML = total;
            showEl(div);
        } else
        {
            hideEl(div);
        }
    }

    _showSelf()
    {
        if (!this.inited) this.initialize()
        //
        this.scene.show()
        //viewer.linksDisabled = true
        //
        showEl(byId('notes_viewer'));
        super._showSelf()
    }


    _hideSelf()
    {
        this.scene.hide()        //
        viewer.linksDisabled = false;
        //
        super._hideSelf()
    }
}
