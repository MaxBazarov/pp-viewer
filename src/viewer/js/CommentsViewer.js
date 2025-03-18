
let commentsViewer = null;

class CommentsViewer extends AbstractViewer
{
    constructor()
    {
        super("comments_viewer")

        this.alwaysHandlePageChanged = true
        this.preventCustomTextSearch = true
        this.blockMainNavigation = true;

        this.inputFocused = false
        commentsViewer = this

        this.forumID = viewer.teamID
        this.backURL = document.location.origin + "/ds/_private/comments/backend/server.php?fid=" + this.forumID

        this.comments = new Comments(this.forumID, this.backURL);
    }

    initialize(force = false)
    {
        if (!super.initialize(force)) return
    }

    ///////////////////////////////////////////////// called by Viewer


    _hideSelf()
    {
        hideEl(byId("comments_viewer"));
        super._hideSelf()
        viewer.refresh_url(viewer.currentPage, "", false)
        viewer.currentPage.linksDiv.querySelectorAll("a").forEach(el => showEl(el));
        if (this.comments) this.comments.hideViewer()
    }

    handleKeyDownWhileInactive(event)
    {
        if (67 == event.which)
        { // c
            // Key "C" activates self
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
        this._showCommentCounter()
        if (!this.visible)
        {
            return
        }
        if (!this.inited) return this.initialize();
        comments.reloadComments()
    }



    handleKeyDown(event)
    {
        if (27 == event.which)
        { // esc
            this.toggle()
        } else if (!comments.inputFocused && 67 == event.which)
        { // key "g"
            // Key "G" deactivates Symbol Viewer
            this.toggle()
        } else if (comments.inputFocused)
        {
            return true
        } else
        {
            return super.handleKeyDown(event)
        }

        event.preventDefault()
        return true
    }
    /////////////////////////////////////////////////

    askCommentCounters(handler)
    {
        var formData = new FormData();
        this.sendRequest(formData, "getProjectInfo", handler)
    }

    _showCommentCounter()
    {
        var formData = new FormData();
        this.sendRequest(formData, "getPageInfo", function ()
        {
            var result = JSON.parse(this.responseText);
            //
            if ("ok" == result.status)
            {
                commentsViewer.updateCommentCounter(result.data.commentsTotal)
            } else
            {
                console.log(result.message);
            }
            return

        })
        /*
            var xhr = new XMLHttpRequest();
            xhr.open("POST", story.commentsURL + "&cmd=getPageInfo", true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.onload = function () {
                var result = JSON.parse(this.responseText);
                //
                if ("ok" == result.status) {
                    commentsViewer.updateCommentCounter(result.data.commentsTotal)
                } else {
                    console.log(result.message);
                }
                return
    
            };
            xhr.send(formData);
            */
    }

    sendRequest(formData, cmd, handler)
    {
        var xhr = new XMLHttpRequest()
        xhr.open("POST", this.backURL + "&cmd=" + cmd, true)
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
        xhr.onload = handler
        xhr.send(formData)
    }

    updateCommentCounter(total)
    {
        var div = bySel('#nav #pageComments #counter')
        if (total > 0)
        {
            div.innerHTML = total;
            showEl(div);
        } else
        {
            hideEl(div);
        }
    }

    _showComments()
    {
        /*
        var formData = new FormData();
        //
        var uid = window.localStorage.getItem("comments-uid")
        var sid = window.localStorage.getItem("comments-sid")
        if (null != uid && null != sid)
        {
            formData.append("uid", uid);
            formData.append("sid", sid);
        }
        //
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.commentsURL + "&cmd=buildFullHTML", true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = function ()
        {
            var result = JSON.parse(this.responseText);
            //
            if ("ok" == result.status)
            {
                byId('comments_viewer_content').innerHTML = result.data;
            } else
            {
                byId('comments_viewer_content').innerHTML = result.message;
            }
            return

        };
        xhr.send(formData);
        */
    }


    _showSelf()
    {
        if (!this.inited) this.initialize()
        showEl(byId("comments_viewer"))
        super._showSelf()
        //
        viewer.refresh_url(viewer.currentPage, "", false)
        viewer.currentPage.linksDiv.querySelectorAll("a").forEach(el => hideEl(el));
        //
        if (this.comments) this.comments.showViewer()
    }
}
