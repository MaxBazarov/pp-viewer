const MAP_ICON_URL = "https://maxbazarov.github.io/pp-viewer/src/viewer/resources/cursor-newcomment.svg";

function commentReplaceEnds(value)
{
    return value.replace(new RegExp('\r?\n', 'g'), '<br/>')
}

function commentSaveMarker()
{
    commentsViewer.comments.commentForm.saveMarker()
}

function commentCursorClicked(e)
{
    commentsViewer.comments.cursor.clicked(e)
}

class CommentsAbstractForm
{
    constructor(formName)
    {
        this.formName = formName
        this.built = false
        //
    }
    _tuneInput(inputName, type = "input")
    {
        let input = bySel("#comments_viewer_content #" + this.formName + " #" + inputName)
        input.addEventListener("focusin", function ()
        {
            comments.inputFocused = true
        });
        input.addEventListener("focusout", function ()
        {
            comments.inputFocused = false
        })
        if ("input" == type)
        {
            input.addEventListener("keydown", function (e)            
            {
                if (e.which == 13)
                {
                    comments.currentForm.submit()
                }
            });
        } else if ("textarea" == type)
        {
            input.addEventListener("keydown", function (e)                
            {
                if (e.which == 13 && e.metaKey)
                {
                    comments.currentForm.submit()
                }
            });
        }
    }
    _setInputValue(inputName, value)
    {
        let input = bySel("#comments_viewer_content #" + this.formName + " #" + inputName)
        input.value = value;
        return input
    }
    _setElContent(elName, content)
    {
        let el = bySel("#comments_viewer_content #" + this.formName + " #" + elName)
        el.innerHTML = content;
        return el;
    }
    showError(errorText)
    {
        bySel("#comments_viewer_content #" + this.formName + " #error").innerHTML = errorText;
    }
    show()
    {
        if (!this.built) this.buildHTML();
        this.putDataInForm()
        showEl(bySel("#comments_viewer_content #" + this.formName));
        comments.currentForm = this
    }
    hide()
    {
        hideEl(bySel("#comments_viewer_content #" + this.formName));
        this.showError("")

    }
    showViewer()
    {
    }
    hideViewer()
    {
    }
    //// to overwrite
    buildHTML()
    {
        this.built = true
    }
    getDataFromForm()
    {

    }
    putDataInForm()
    {

    }
    checkData()
    {

    }
    handleEnterKey()
    {
        return false
    }
    clear()
    {
        this.putDataInForm()
    }
    submit() { }
}
////////////////// LOGIN FORM /////////
class CommentsLoginForm extends CommentsAbstractForm
{
    constructor()
    {
        super("loginForm")
        this.email = ""
    }
    putDataInForm()
    {
        this._setInputValue("email", this.email);
    }
    // Check data
    checkData()
    {
        if ("" == this.email)
        {
            this.showError("Specify email");
            return false;
        }
        return true
    }
    getDataFromForm()
    {
        this.email = bySel("#comments_viewer_content #loginForm #email").value;
    }
    buildHTML()
    {
        super.buildHTML()
        let s = `
    <div id='loginForm' class="hidden"">
        <div id="title" style="font-weight:bold;">Login As</div>
        <div id="error" style="color:red"></div>
        <div>
            <input id="email" style="${comments.styles.input}" placeholder="Your email" />
        </div>
        <div id="buttons">
            <input style="${comments.styles.buttonPrimary}" id="send" type="button" onclick="comments.loginForm.submit();return false;" value="Login" />
        </div>
    </div>`
        bySel("#comments_viewer_content #top").innerHTML += s;
        this._tuneInput("email")
    }
    submit()
    {
        this.getDataFromForm();
        if (!this.checkData()) return false;
        ///
        var formData = new FormData();
        formData.append("email", this.email);
        //
        var handler = function ()
        {
            var form = comments.loginForm
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //
            console.log(this.responseText);
            if (result.status != 'ok')
            {
                form.showError(result.message);
            } else
            {
                console.log(result);
                comments.authForm.userExists = result.data.exists;
                form.hide()
                comments.authForm.show()
            }
        }
        //
        return comments.sendCommand("login", formData, handler);
    }
    clear()
    {
        this.email = ""
        super.clear()
    }

}
////////////////// AUTH FORM /////////
class CommentsAuthForm extends CommentsAbstractForm
{
    constructor()
    {
        super("authForm")
        this.code = ""
        this.name = ""
        this.userExists = false
    }
    putDataInForm()
    {
        this._setInputValue("code", this.code)
        let nameField = this._setInputValue("name", this.name)
        showEl(nameField, !this.userExists)

    }
    // Check data
    checkData()
    {
        if ("" == this.code)
        {
            this.showError("Specify code");
            return false;
        }
        if (!this.userExists && "" == this.name)
        {
            this.showError("Specify your name");
            return false;
        }
        return true
    }
    getDataFromForm()
    {
        this.code = bySel("#comments_viewer_content #top #authForm #code").value;
        this.name = bySel("#comments_viewer_content #top #authForm #name").value;
    }
    buildHTML()
    {
        super.buildHTML()
        let s = `
    <div id='authForm' class="hidden">        
        <div id="title" style="font-weight:bold;">Confirm login</div>
        <div id="msg">
            Check new email to get a code
        </div>
        <div id="error" style="color:red"></div>         
        <div>
            <input id="code" style="${comments.styles.input}" placeholder="Authorization code" />
        </div>
        <div>
            <input id="name" style="${comments.styles.input}" placeholder="Your name" />
        </div>
        <div id="buttons">
            <input id="send" style="${comments.styles.buttonPrimary}" type="button" onclick="comments.authForm.submit();return false;" value="Confirm" />
            <input id="send" style="${comments.styles.buttonSecondary}" type="button" onclick="comments.authForm.cancel();return false;" value="Cancel" />
        </div>
    </div>`
        bySel("#comments_viewer_content #top").innerHTML += s;
        this._tuneInput("code")
        this._tuneInput("name")
    }
    cancel()
    {
        this.clear()
        this.hide()
        comments.loginForm.show()
    }
    submit()
    {
        this.getDataFromForm();
        if (!this.checkData()) return false;
        ///
        var formData = new FormData();
        formData.append("code", this.code);
        formData.append("name", this.name);
        formData.append("email", comments.loginForm.email);
        //
        var handler = function ()
        {
            var form = comments.authForm
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //                        
            console.log(this.responseText);
            if (result.status != 'ok')
            {
                if ("#010.003" == result.errorCode)
                {
                    form.showError("Authorization code is wrong");
                } else
                {
                    form.showError(result.message);
                }
            } else
            {
                comments.sid = result.data.sid
                comments.uid = result.data.uid
                comments.user = result.data.user;

                comments.saveSessionInBrowser()

                form.hide()
                comments.commentForm.show()
                comments.reloadComments()
            }
        }
        //    
        return comments.sendCommand("auth", formData, handler);
    }
    clear()
    {
        this.code = ""
        this.name = ""
        this.email = ""
        super.clear()
    }

}
////////////////// NEW COMMENT FORM /////////
class CommentsNewCommentForm extends CommentsAbstractForm
{
    constructor()
    {
        super("commentForm")
        this.msg = ""
        this.cursorEnabled = false
        this.markX = null
        this.markY = null
    }
    putDataInForm()
    {
        this._setInputValue("msg", this.msg)
        this._setElContent("name", comments.user.name)
    }
    // Check data
    checkData()
    {
        if ("" == this.msg)
        {
            this.showError("Specify message");
            return false;
        }
        return true
    }
    getDataFromForm()
    {
        this.msg = bySel("#comments_viewer_content #top #commentForm #msg").value;
    }
    getHTML()
    {
        let s = `
        <div id="commentForm" class="commentForm hidden" style="font-size:12px;">
            <div id="user">
                <span id="name"></span>&nbsp<a href="#" onclick="comments.logout();return false;">Logout</a>
                <br/><br/>
            </div>    
            <div id="error" style="color:red" ></div>
            <div>
                <textarea id="msg" rows="5" cols="20" placeholder="New comment"></textarea>
            </div>
            <div id="buttons" style="display: grid; gap:10px;grid-auto-rows: minmax(10px, auto); grid-template-columns: max-content max-content">
                <div>
                    <button type="button" id="send" class="button button--primary" onclick="comments.commentForm.submit();return false;">Send</button> 
                    <!-- <input id="send"  style="${comments.styles.buttonPrimary}" type="button" onclick="comments.commentForm.submit();return false;" value="Send"/> -->
                </div>
                <div id="addMarker">
                    <button type="button" class="button button--secondary" onclick="comments.commentForm.startMarkerMove();return false;">Set marker</button> 
                    <!-- <input style="${comments.styles.buttonSecondary}" type="button" onclick="comments.commentForm.startMarkerMove();return false" value="Set Marker"/> -->
                </div>
                <div id="dropMarker" class="hidden">
                    <input style="${comments.styles.buttonSecondary}" type="button" onclick="comments.commentForm.stopMarkerMove();return false" value="Drop Marker"/>
                </div>
                <div id="editMarker"  class="hidden">
                    <input style="${comments.styles.buttonSecondary}" type="button" onclick="comments.commentForm.startMarkerMove();return false" value="Move Marker"/>
                    &nbsp;
                    <input style="${comments.styles.buttonSecondary}" type="button" onclick="comments.commentForm.dropMarker();return false" value="Drop"/>
                </div>           
            </div>
        </div> `
        return s
    }
    buildHTML()
    {
        super.buildHTML()
        let s = this.getHTML()
        bySel("#comments_viewer_content #top").innerHTML += s;
        this._tuneInput("msg", "textarea")
    }
    startMarkerMove()
    {
        //
        if (null != this.markX)
        {
            commentsViewer.comments.removeCircleOnScene("new")
            this.markX = null
            this.markY = null
        }
        //
        viewer.currentPage.imageDiv.style.cursor = `url('${MAP_ICON_URL}'), auto`;
        viewer.currentPage.imageDiv.addEventListener("click", commentSaveMarker);
        hideEl(bySel("#comments_viewer_content #addMarker"));
        showEl(bySel("#comments_viewer_content #dropMarker"));
        hideEl(bySel("#comments_viewer_content #editMarker"));
        //
        this.cursorEnabled = true
        viewer.setMouseMoveHandler(this)
    }
    stopMarkerMove()
    {
        viewer.currentPage.imageDiv.style.cursor = "";
        viewer.currentPage.imageDiv.removeEventListener("click", commentSaveMarker);
        viewer.setMouseMoveHandler(null)
        this.cursorEnabled = false
        showEl(bySel("#comments_viewer_content #addMarker"));
        hideEl(bySel("#comments_viewer_content #dropMarker"));
        hideEl(bySel("#comments_viewer_content #editMarker"));
    }
    onMouseMove(x, y)
    {
        this.x = Math.round(x / viewer.currentZoom) - viewer.currentPage.currentLeft
        this.y = Math.round(y / viewer.currentZoom) - viewer.currentPage.currentTop
    }
    saveMarker()
    {
        this.stopMarkerMove()
        //
        this.markX = this.x
        this.markY = this.y
        //
        commentsViewer.comments.addCircleToScene("new", this.markX, this.markY)
        hideEl(bySel("#comments_viewer_content #addMarker"));
        hideEl(bySel("#comments_viewer_content #dropMarker"));
        showEl(bySel("#comments_viewer_content #editMarker"));
    }
    dropMarker()
    {
        this.markX = null
        this.markY = null
        commentsViewer.comments.removeCircleOnScene("new")
        //
        showEl(bySel("#comments_viewer_content #addMarker"));
        hideEl(bySel("#comments_viewer_content #editMarker"));
        hideEl(bySel("#comments_viewer_content #dropMarker"));
    }
    submit()
    {
        this.getDataFromForm();
        if (!this.checkData()) return false;
        ///
        var formData = new FormData();
        formData.append("msg", this.msg);
        formData.append("pageOwnerName", story.authorName);
        formData.append("pageOwnerEmail", story.authorEmail);
        if (null != this.markX)
        {
            formData.append("markX", this.markX);
            formData.append("markY", this.markY);
        }
        //
        var handler = function ()
        {
            var form = comments.commentForm
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //                        
            console.log(this.responseText)
            if (result.status != 'ok')
            {
                form.showError(result.message)
            } else
            {
                console.log(result)
                form.clear()
                const commentList = result.data.comments;
                //
                const newComment = commentList[0];
                const newCommentHTML = comments._buildCommentHTML(newComment, commentList.length, result.data);
                comments._addComment(newCommentHTML);
            }
        }
        //    
        return comments.sendCommand("addComment", formData, handler);
    }
    clear()
    {
        this.msg = ""
        this.dropMarker()
        this.showError("")
        super.clear()
    }
    hide()
    {
        if (this.cursorEnabled) this.stopMarkerMove()
        super.hide()
    }
    hideViewer()
    {
        if (this.cursorEnabled) this.stopMarkerMove()
    }
}
////////////////// EDIT COMMENT FORM /////////
class CommentsEditCommentForm extends CommentsAbstractForm
{
    constructor(commentID)
    {
        super("editCommentForm")
        this.commentID = ""
        //
        this.msg = ""
        this.cursorEnabled = false
        this.markX = null
        this.markY = null
    }
    build(commentID)
    {
        this.commentID = commentID

        this.msgDiv = bySel("#comments #c" + this.commentID + " #msg");
        if (!this.msgDiv) return false

        const comment = comments.getCommentByID(commentID)
        if (undefined == comment) return false
        this.msg = comment['msg']
        //
        this.buildHTML()
        this.putDataInForm()
        //
        return true
    }
    putDataInForm()
    {
        this._setInputValue("msg", this.msg)
    }
    // Check data
    checkData()
    {
        if ("" == this.msg)
        {
            this.showError("Specify message");
            return false;
        }
        return true
    }
    cancel()
    {
        this.msgDiv.innerHTML = commentReplaceEnds(this.msg);
        comments.editCommentForm = null
        showEl(this.elActions);
    }
    getDataFromForm()
    {
        this.msg = bySel("#comments #c" + this.commentID + " #editCommentForm #msg").value;
    }
    getHTML()
    {
        let s = `
    <div id = "editCommentForm" class="commentForm"> 
        <div id = "error" style = "color:red" ></div>
        <div>
            <textarea id="msg" rows="5" cols="20" ></textarea>
        </div>
        <div style="display: grid; gap:10px;grid-auto-rows: minmax(10px, auto); grid-template-columns: max-content max-content">
            <div>
                <button type="button" id="send" class="button button--primary" onclick="comments.editCommentForm.submit();return false;">Save</button> 
                <!-- <input id="send"  style="${comments.styles.buttonPrimary}" type="button" onclick="comments.editCommentForm.submit();return false;" value="Save"/>-->
            </div>
            <div>
                <button type="button" class="button button--secondary" onclick="comments.editCommentForm.cancel();return false;">Cancel</button> 
                <!-- <input id="send"  style="${comments.styles.buttonSecondary}" type="button" onclick="comments.editCommentForm.cancel();return false;" value="Cancel"/> -->
            </div>
        `/*
            <div id="addMarker" >
                <input style="${comments.styles.buttonSecondary}" type="button" onclick="comments.commentForm.startMarkerMove();return false" value="Set Marker"/>
            </div>
            <div id="dropMarker" style="display:none">
                <input style="${comments.styles.buttonSecondary}" type="button" onclick="comments.commentForm.stopMarkerMove();return false" value="Drop Marker"/>
            </div>
            <div id="editMarker" style="display:none">
                <input style="${comments.styles.buttonSecondary}" type="button" onclick="comments.commentForm.startMarkerMove();return false" value="Move Marker"/>
                &nbsp;
                <input style="${comments.styles.buttonSecondary}" type="button" onclick="comments.commentForm.dropMarker();return false" value="Drop"/>
            </div>           
            */
        s += `
        </div>
    </div > `
        return s
    }
    buildHTML()
    {
        super.buildHTML()
        let s = this.getHTML()
        this.msgDiv.innerHTML = s;
        this._tuneInput("msg", "textarea")
        this.elActions = bySel("#comments_viewer_content #comments #c" + this.commentID + " .actions");
        hideEl(this.elActions);
        return true
    }
    startMarkerMove()
    {
        //
        if (null != this.markX)
        {
            commentsViewer.comments.removeCircleOnScene("new")
            this.markX = null
            this.markY = null
        }
        //
        viewer.currentPage.imageDiv.style.cursor = `url('${MAP_ICON_URL}'), auto`;
        viewer.currentPage.imageDiv.addEventListener("click", commentSaveMarker);
        hideEl(bySel("#comments_viewer_content #addMarker"));
        showEl(bySel("#comments_viewer_content #dropMarker"));
        hideEl(bySel("#comments_viewer_content #editMarker"));
        //
        this.cursorEnabled = true
        viewer.setMouseMoveHandler(this)
    }
    stopMarkerMove()
    {
        viewer.currentPage.imageDiv.style.cursor = "";
        viewer.currentPage.imageDiv.removeEventListener("click", commentSaveMarker);
        viewer.setMouseMoveHandler(null)
        this.cursorEnabled = false
        showEl(bySel("#comments_viewer_content #addMarker"));
        hideEl(bySel("#comments_viewer_content #dropMarker"));
        hideEl(bySel("#comments_viewer_content #editMarker"));
    }
    onMouseMove(x, y)
    {
        this.x = Math.round(x / viewer.currentZoom) - viewer.currentPage.currentLeft
        this.y = Math.round(y / viewer.currentZoom) - viewer.currentPage.currentTop
    }
    saveMarker()
    {
        this.stopMarkerMove()
        //
        this.markX = this.x
        this.markY = this.y
        //
        commentsViewer.comments.addCircleToScene("new", this.markX, this.markY)
        hideEl(bySel("#comments_viewer_content #addMarker"));
        hideEl(bySel("#comments_viewer_content #dropMarker"));
        showEl(bySel("#comments_viewer_content #editMarker"));
    }
    dropMarker()
    {
        this.markX = null
        this.markY = null
        commentsViewer.comments.removeCircleOnScene("new")
        //
        showEl(bySel("#comments_viewer_content #addMarker"));
        hideEl(bySel("#comments_viewer_content #editMarker"));
        hideEl(bySel("#comments_viewer_content #dropMarker"));
    }
    submit()
    {
        this.getDataFromForm();
        if (!this.checkData()) return false;
        ///
        var formData = new FormData();
        formData.append("msg", this.msg);
        formData.append("commentID", this.commentID);
        if (null != this.markX)
        {
            formData.append("markX", this.markX);
            formData.append("markY", this.markY);
        }
        //
        var handler = function ()
        {
            var form = comments.editCommentForm
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //                        
            console.log(this.responseText)
            if (result.status != 'ok')
            {
                form.showError(result.message)
            } else
            {
                console.log(result)
                form.cancel()
                //form.clear()
                //$("#comments_viewer_content #comments").html(result.data)
            }
        }
        //    
        return comments.sendCommand("updateComment", formData, handler);
    }
    clear()
    {
        this.msg = ""
        this.dropMarker()
        this.showError("")
        super.clear()
    }
    hide()
    {
        if (this.cursorEnabled) this.stopMarkerMove()
        super.hide()
        showEl(this.elActions);
    }
    hideViewer()
    {
        if (this.cursorEnabled) this.stopMarkerMove()
    }
}
////
////////////////// NewComment /////////
class CommentsCursor
{
    constructor()
    {
        this.enabled = false
        this.markX = null
        this.markY = null
    }
    show()
    {
        viewer.currentPage.imageDiv.style.cursor = `url('${MAP_ICON_URL}'), auto`;
        viewer.currentPage.imageDiv.addEventListener("click", commentCursorClicked);
        //
        this.enabled = true
    }
    hide()
    {
        viewer.currentPage.imageDiv.style.cursor = "";
        viewer.currentPage.imageDiv.removeEventListener("click", commentCursorClicked);
        viewer.setMouseMoveHandler(null)
        this.enabled = false
    }
    clicked(e)
    {
        const srcX = e.pageX, srcY = e.pageY;
        const x = Math.round(srcX / viewer.currentZoom) - viewer.currentPage.currentLeft;
        const y = Math.round((srcY) / viewer.currentZoom) - viewer.currentPage.currentTop;
        //
        //this.hide()
        //        
        //
        commentsViewer.comments.addCircleToScene("new", x, y)
    }
}
class Comments_CommentOverview
{
    constructor(comment)
    {
        this.comment = comment;
        this.id = comment.id;
        this.div = undefined;
        this.hidden = false;
        //        
        this.show();
    }
    show()
    {
        if (!this.comment.overviewObj) this._build();
        //
        showEl(this.div);
        this.hidden = false;
        //
        // Hide comment mark 
        comments.showHideMarker(this.id, false);
    }
    hide()
    {
        hideEl(this.div);
        this.hidden = true;
        // Show comment mark again
        comments.showHideMarker(this.id, true);
    }
    _build()
    {
        const comment = this.comment;
        const id = this.id;
        let page = viewer.currentPage;
        //
        let x = comment['markX'];
        //
        const sd = new StageDiv(x, null, 200, null, "comment-overview-box", "comment-overview" + id);
        sd.bottom = (page.height - comment['markY']) + "px";
        const div = sd.elDiv()
        addClass(div, "comment-overview-corner-leftbottom")
        div.addEventListener("mouseleave", (e) =>
        {
            this.hide();
        });
        div.addEventListener("click", (e) =>
        {
            this.hide();
            comments.showCommentExpanded(id);
        });
        //        
        div.innerHTML = this._buildHTML(comment, this.commentList)
        this.div = div;
        //
        bySel('#commentsScene').appendChild(div);
        //
        comment.overviewObj = this;
    }
    _buildHTML()
    {
        const comment = this.comment;
        const id = this.id;

        const user = comments.commentList['users'][comment['uid']]
        let code = "";
        ///
        var createdDate = new Date(comment['created'] * 1000)
        var createdStr = createdDate.toLocaleDateString() + " " + createdDate.toLocaleTimeString()
        ///            
        let uid = comment['uid']
        let commentID = comment['id']
        let actions = ""
        //
        code += `
        <div id = "c${commentID}" class="comment" >
            <div class="author">${user.name}</div> 
            <div class="date">${createdStr}</div>            
            <div>                             
                <span id="msg">${commentReplaceEnds(comment['msg'])}<span>
            </div>
        `
        if (comment.replies != undefined && comment.replies.length > 0)
        {
            code += `
            <div class="replies">${comment.replies.length} replies</div>               
            `;
        }
        code += `
            </div >
        `
        return code;
    }
}
class Comments_CommentExpanded
{
    constructor(comment)
    {
        this.comment = comment;
        this.id = comment.id;
        this.div = undefined;
        this.hidden = false;
        //        
        this.show();
    }
    show()
    {
        if (!this.comment.expandedObj) this._build();
        showEl(this.div);
        this.hidden = false;
    }
    hide()
    {
        hideEl(this.div);
        this.hidden = true;
    }
    _build()
    {
        const comment = this.comment;
        let page = viewer.currentPage;
        let x = comment['markX'];
        //
        const sd = new StageDiv(x, comment.markY, 200, null, "comment-expanded-box", "comment-expanded" + this.id);
        //sd.top = comment["markY"] + "px";
        const div = sd.elDiv()
        this.div = div;
        //        
        div.innerHTML = this._buildHTML()
        //
        bySel('#commentsScene').appendChild(div);
        //
        comment.expandedObj = this;
    }
    _buildHTML()
    {
        const commentList = comments.commentList;
        const comment = this.comment;

        function buildMessageHTML(msg)
        {
            const user = commentList['users'][comment.uid];
            let code = "";
            ///
            var createdDate = new Date(comment['created'] * 1000)
            var createdStr = createdDate.toLocaleDateString() + " " + createdDate.toLocaleTimeString()
            ///            
            let uid = comment['uid']
            let commentID = comment['id']
            let actions = ""
            //
            code += `
                <div id = "c${commentID}" class="comment" >
                <div class="author">${user.name}</div> 
                <div class="date">
                    ${createdStr}                                    
                </div> 
                <div>                             
                    <span id="msg">${commentReplaceEnds(comment['msg'])}<span>
                </div>
            `
            code += `
             </div >
            `
            return code;
        }
        let code = "";
        code += buildMessageHTML(comment);
        comment["replies"].forEach(msg =>
        {
            code += buildMessageHTML(msg);
        });
        return code;
    }
}
////
let comments = null;
class Comments
{
    constructor(forumID, url)
    {
        comments = this;
        this.forumID = forumID
        this.url = url
        this.currentPage = null

        // load user data from browser storage   
        this.loadSessionFromBrowser();
        //
        this.commentList = null
        //
        this.currentForm = null
        this.loginForm = new CommentsLoginForm()
        this.authForm = new CommentsAuthForm()
        this.commentForm = new CommentsNewCommentForm()
        this.cursor = new CommentsCursor();
        this.editCommentForm = null
        //
        this.inputFocused = false
        commentsViewer.comments = this
        //
        this.styles = {
            buttonPrimary: "margin-top:4px;border: none;border-radius:4px;font-size:12px;background-color:#008CBA;color:white;width:100px;height:30px",
            buttonSecondary: "margin-top:4px;border: none;border-radius:4px;font-size:12px;background-color:#e7e7e7; color: black;width:100px;height:30px",
            input: "font-size:12px;margin-left:0px;padding: 0.25em 0.5em;background-color:var(--color-background);border:2px solid var(--color-border);border-radius:4px;"
        }
    }

    clearSession()
    {
        this.uid = ""
        this.sid = ""
        this.user = []
        this.saveSessionInBrowser()
        this.loginForm.clear()
        this.authForm.clear()
        this.commentForm.clear()
        //
        this.commentForm.hide()
        this.loginForm.show()
    }
    loadSessionFromBrowser()
    {
        this.uid = window.localStorage.getItem("comments-uid");
        this.sid = window.localStorage.getItem("comments-sid");
        this.user = JSON.parse(window.localStorage.getItem("comments-user-info"));
    }
    saveSessionInBrowser()
    {
        window.localStorage.setItem("comments-uid", this.uid)
        window.localStorage.setItem("comments-sid", this.sid)
        window.localStorage.setItem("comments-user-info", JSON.stringify(this.user));
    }
    processRequestResult(result)
    {
        console.log(result)

        if (
            ("ok" == result.status && result.dropSession)
            ||
            ("error" == result.status && "#001.003" == result.errorCode)
        )
        {
            this.clearSession()
        } else
            return false
        return true
    }
    ///
    sendCommand(cmd, formData, handler)
    {
        var xhr = new XMLHttpRequest()
        xhr.open('POST', this.url + "&cmd=" + cmd, true)
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = handler
        if ("" != this.uid && "" != this.sid)
        {
            formData.append("uid", this.uid);
            formData.append("sid", this.sid);
        }
        xhr.send(formData);
    }
    ///////
    logout()
    {
        var formData = new FormData();
        var handler = function ()
        {
            console.log(this.responseText)
            comments.clearSession()
        }
        //    
        return this.sendCommand("logout", formData, handler);
    }
    ////////
    reloadComments()
    {
        bySel("#comments_viewer_content #comments").innerHTML = "Loading...";
        ///
        var formData = new FormData();
        var handler = function ()
        {
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //                        
            if (result.status != 'ok')
            {
                console.log(result.message)
            } else
            {
                comments.build(result.data)
            }
        }
        //    
        return comments.sendCommand("getComments", formData, handler);
    }
    removeComment(commentID)
    {
        if (!confirm("Delete the comment?")) return;
        //
        var formData = new FormData();
        formData.append("commentID", commentID);
        var handler = function ()
        {
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //                        
            if (result.status != 'ok')
            {
                console.log(result.message)
                alert("Can't remove the comment. " + result.message)
            } else
            {
                // remove comment
                bySel("#comments #c" + commentID).remove()
                // remove marker (if exists)
                let m = bySel('#commentsScene svg #c' + commentID)
                if (m) m.remove()
                //
                comments.reloadComments();
            }
        }
        //    
        return comments.sendCommand("removeComment", formData, handler);
    }
    editComment(commentID)
    {
        // Create edit form
        this.editCommentForm = new CommentsEditCommentForm()
        if (!this.editCommentForm.build(commentID))
        {
            this.editCommentForm = null
            return false
        }
    }
    getCommentByID(commentID)
    {
        const found = this.commentList['comments'].find(c => c['id'] == commentID)
        return found
    }
    getUserByUID(uid)
    {
        const user = this.commentList['users'][uid]
        return user
    }
    ///////
    build(commentList)
    {
        //
        this.commentList = commentList
        this.commentForm.buildHTML();
        this.loginForm.buildHTML();
        this.authForm.buildHTML();
        //        
        if (this.sid != "")
        {
            this.commentForm.show()
        } else
        {
            this.loginForm.show()
        }
        this._buildScene()
        this._buildMarkers()
        this._buildComments(commentList)
    }
    //    
    _buildCommentHTML(comment, counter, commentList)
    {
        const counterStyle = "font-weight:bold;"
        ///
        const visited = commentList['visited'];
        const user = commentList['users'][comment['uid']]
        let code = "";
        ///
        var createdDate = new Date(comment['created'] * 1000)
        var createdStr = createdDate.toLocaleDateString() + " " + createdDate.toLocaleTimeString()
        if (visited && visited < comment['created'])
        {
            createdStr += "&nbsp;<b>New</b>"
        }
        ///            
        let uid = comment['uid']
        let commentID = comment['id']
        let actions = ""
        //
        code += `
        <div id = "c${commentID}" class="comment" >
            <div class="header" style="display: grid; gap:10px;grid-auto-rows: minmax(10px, auto); grid-template-columns: 10px auto auto">
                <div>#${counter}</div>                    
                <div>
                    ${createdStr}                    
                </div>                    
            </div>
            <div class="tooltip">${user['name']}
                <span class="tooltiptext">${user['email']}</span>
            </div> 
            <div>                             
                <span id="msg">${commentReplaceEnds(comment['msg'])}<span>
            </div>
        `
        if (uid == this.uid)
        {
            code += `    
            <!-- Actions -->
            <div class="actions" style="display: grid; gap:8px;grid-auto-rows: minmax(10px, auto); grid-template-columns: 20px auto auto">
                <button class="button button--tertiary mb-xxsmall" onclick="comments.editComment('${commentID}')">Edit</button>
                <button class="button button--tertiary mb-xxsmall" onclick="comments.removeComment('${commentID}')">Remove</button>
            </div>
            `
        }
        code += `
            </div >
        `
        return code;
    }
    _addComment(newCommentHTML)
    {
        const el = bySel("#comments_viewer_content #comments #list");
        el.innerHTML = newCommentHTML + el.innerHTML;
    }
    _buildComments(commentList)
    {
        //
        let code = ""
        //      
        code += `<div id="list">`
        let counter = commentList['comments'].length
        commentList['comments'].forEach(function (comment)
        {
            code += this._buildCommentHTML(comment, counter, commentList);
            counter--;
        }, this)
        code += `</div>`
        //
        bySel("#comments_viewer_content #comments").innerHTML = code;
        //
        commentsViewer.updateCommentCounter(commentList['comments'].length)
    }
    _buildMarkers(showCount = false)
    {
        this._clearScene()
        //let counter = this.commentList['comments'].length
        //
        this.commentList['comments'].reverse().forEach(function (comment)
        {
            if (undefined != comment['markX'])
            {
                const id = comment['id']
                const user = this.getUserByUID(comment['uid'])
                let c = user ? user["name"].substring(0, 1) : "?"
                this.addCircleToScene(id, comment['markX'], comment['markY'], c, comment)
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
        let width = page.imageDiv.style.width;
        let height = page.imageDiv.style.height;

        let code = `<div id="commentsScene"><svg height="${height}" width="${width}">
                    </svg>
                    </div>`
        page.linksDiv.innerHTML += code;
        //
        this.currentPage = page
        this.cursor.show();
    }
    showHideMarker(id, visible)
    {
        showEl(bySel(`#commentsScene svg #mark-${id}`), visible);
    }
    showCommentOverview(id)
    {
        const comment = this.getCommentByID(id);
        if (!comment.overviewObj)
            comment.overviewObj = new Comments_CommentOverview(comment);
        else
            comment.overviewObj.show();
    }
    showCommentExpanded(id)
    {
        const comment = this.getCommentByID(id);
        if (!comment.expandedObj)
            comment.expandedObj = new Comments_CommentExpanded(comment);
        else
            comment.expandedObj.show();
    }
    addCircleToScene(id, x, y, text = "", comment = undefined)
    {
        let r = 20
        x = Number(x)
        y = Number(y) - 40
        //        
        let code = `
        <svg 
            id="mark-${id}"                        
            onmouseenter="comments.showCommentOverview('${id}')"             
            width="40" height="40" id="c${id}" x="${x}" y="${y}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_217_21)">
        <path d="M3 19C3 10.1634 10.1634 3 19 3V3C27.8366 3 35 10.1634 35 19V19C35 27.8366 27.8366 35 19 35H3V19Z" fill="white" shape-rendering="crispEdges"/>
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

        if (comment !== undefined)
        {
            let text = `
                <div id="${id}> 
                    ${comment['msg']}
                </div>
            `
            bySel('#commentsScene').innerHTML += text;
            //            
        }
        bySel('#commentsScene svg').innerHTML += code;
        bySel('#commentsScene').innerHTML = bySel('#commentsScene').innerHTML;
        //    
    }
    removeCircleOnScene(id)
    {
        const el = bySel('#commentsScene svg #' + id);
        const c = this.getCommentByID(id);
        c["mode"] = undefined;
        if (!el) return;
        el.remove();
    }
    _dropScene()
    {
        const scene = bySel('#commentsScene');
        if (!scene) return;
        scene.remove();
    }
    _clearScene()
    {
        const svg = bySel('#commentsScene svg');
        if (!svg) return;
        svg.innerHTML = "";
    }
    //
    showViewer()
    {
        this.reloadComments();
    }
    hideViewer()
    {
        if (this.currentForm) this.currentForm.hideViewer()
        //
        this._dropScene()
        //        
    }
}