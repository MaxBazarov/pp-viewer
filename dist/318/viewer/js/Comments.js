const MAP_ICON_URL = "https://maxbazarov.github.io/pp-viewer/src/viewer/resources/cursor-newcomment.svg";

function commentReplaceEnds(value)
{
    return value.replace(new RegExp('\r?\n', 'g'), '<br/>')
}


function commentCursorClicked(e)
{
    commentsViewer.comments.cursor.clicked(e)
}

function tuneInput(input, type = "input")
{
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


class CommentsAbstractForm
{
    constructor(formName, parentID = "comments_viewer_content")
    {
        this.formName = formName;
        this.parentID = parentID;
        this.formSelName = "#" + parentID + " #" + this.formName;
        this.built = false;
        //
    }
    _tuneInput(inputName, type = "input")
    {
        let input = bySel(this.formSelName + " #" + inputName)
        tuneInput(input, type);
    }
    _setInputValue(inputName, value)
    {
        let input = bySel(this.formSelName + " #" + inputName)
        input.value = value;
        return input
    }
    _setElContent(elName, content)
    {
        let el = bySel(this.formSelName + " #" + elName)
        el.innerHTML = content;
        return el;
    }
    showError(errorText)
    {
        bySel(this.formSelName + " #error").innerHTML = errorText;
    }
    show()
    {
        if (!this.built) this.buildHTML();
        this.putDataInForm()
        showEl(bySel(this.formSelName));
        comments.currentForm = this
    }
    hide()
    {
        hideEl(bySel(this.formSelName));
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
    <div id='loginForm' class="hidden">
        <div id="title" style="font-weight:bold;">Login As</div>
        <div id="error" style="color:red"></div>
        <div>
            <input id="email" style="${comments.styles.input}" placeholder="Your email" 
                onfocus="comments.inputFocused = true"
                onblur="comments.inputFocused = false"
            />
        </div>
        <div class="buttons">                        
            <button class="button button--primary" id="send" type="button" onclick="comments.loginForm.submit();return false;">Login</button>
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
        <div class="buttons">
            <button class="button button--primary" id="send" type="button" onclick="comments.authForm.submit();return false;">Confirm</button>
            <button class="button button--secondary" id="cancel" type="button" onclick="comments.authForm.cancel();return false;">Cancel</button>
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
////////////////// NewComment /////////
class CommentsCursor
{
    constructor()
    {
        this.enabled = false
        this.markX = null
        this.markY = null
        this.datePaused = null;
    }
    show()
    {
        this.datePaused = Date.now();
        byId("commentsScene").style.cursor = `url('${MAP_ICON_URL}'), auto`;
        byId("commentsScene").addEventListener("click", commentCursorClicked);
        //
        this.enabled = true
    }
    hide()
    {
        byId("commentsScene").style.cursor = "";
        byId("commentsScene").removeEventListener("click", commentCursorClicked);
        viewer.setMouseMoveHandler(null)
        this.enabled = false
    }
    clicked(e)
    {
        if (comments.floatExpandedComment != null)
        {
            comments.floatExpandedComment.hide();
            comments.floatExpandedComment = null;;
        }
        if (comments.floatNewComment != null)
        {
            comments.floatNewComment.hide();
            comments.floatNewComment = null;;
        }
        //
        if (this.datePaused)
        {
            console.log(Date.now() - this.datePaused)
            if ((Date.now() - this.datePaused) < 200)
                return;
            else
                this.datePaused = null;
        }
        if (!this.enabled) return;
        //
        if (comments.uid == "") return alert("You need to log in before");
        //
        const srcX = e.pageX, srcY = e.pageY;
        const x = Math.round(srcX / viewer.currentZoom) - viewer.currentPage.currentLeft;
        const y = Math.round(srcY / viewer.currentZoom) - viewer.currentPage.currentTop;
        //
        comments.floatNewComment = new Comments_Float_NewComment(x, y);
        comments.floatNewComment.show();
        //this.hide()
        //        
        //
        //commentsViewer.comments.addMarkersToScene("new", x, y)
    }
}
class Comments_Float_NewComment extends CommentsAbstractForm
{
    constructor(x, y)
    {
        super("_newCommentForm", "commentsScene")
        this.x = x;
        this.y = y;
        this.div = undefined;
        this.hidden = false;
        //                
    }
    show()
    {
        this._build();
        //
        showEl(this.div);
        this.hidden = false;
        //
        if (comments.floatExpandedComment) comments.floatExpandedComment.hide();
        // Hide comment mark 
        comments.cursor.hide();
    }
    hide()
    {
        // Show comment mark again
        comments.cursor.show();
        /*setTimeout(function (id)
        {
            comments.showHideMarker(id, true);
        }, 150, this.id);*/
        //
        hideEl(this.div);
        this.hidden = true;
        //
        comments.floatNewComment = null;
        this.div.remove();
    }

    _build()
    {
        let page = viewer.currentPage;
        //        
        //
        const sd = new StageDiv(
            (this.x + 10) * viewer.currentZoom + viewer.currentMarginLeft,
            (this.y + 10) * viewer.currentZoom + viewer.currentMarginTop,
            200, null, "comment-overview-box", "comment-overview");
        const div = sd.elDiv()
        addClass(div, "comment-overview-corner-lefttop")
        //        
        div.innerHTML = this._buildHTML()
        this.div = div;
        //
        bySel('#commentsScene').appendChild(div);
        //
        this._tuneInput("msg");
        bySel(this.formSelName + " #msg").focus();
        //
    }
    handleKeyDown(e)
    {
        if (27 == e.which)
        {
            e.preventDefault()
            this.hide();
            return true;
        }
        return false;
    }
    _buildHTML()
    {
        let code = "";
        //
        code += `
        <div id = "_newCommentForm" class="comment">            
            <div>                   
                <textarea id="msg" style="font-size:12px" rows="3" cols="20" placeholder="Add a comment"></textarea>           
                <div class="buttons">                        
                    <button class="button button--primary" id="send" type="button" onclick="return comments.floatNewComment.submit();">Send</button>
                    <button class="button button--secondary" id="cancel" type="button" onclick="return comments.floatNewComment._cancel();return false;">Cancel</button>
                </div>                            
            </div>
        `;
        code += `
            </div>
        `
        return code;
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
        this.msg = bySel("#commentsScene #_newCommentForm #msg").value;
    }
    _cancel()
    {
        this.hide();
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
        formData.append("markX", this.x);
        formData.append("markY", this.y);
        //
        var handler = function ()
        {
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //                                    
            if (result.status != 'ok')
            {
                //form.showError(result.message)
            } else
            {
                const commentList = result.data.comments;
                comments.reloadComments();
            }
        }
        //
        this.hide();
        //
        return comments.sendCommand("addComment", formData, handler);
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
        if (this.comment.expandedObj && !this.comment.expandedObj.hidden) this.comment.expandedObj.hide();
        if (!this.comment.overviewObj) this._build();
        //
        showEl(this.div);
        this.hidden = false;
        //
        // Hide comment mark 
        comments.cursor.hide();
        comments.showHideMarker(this.id, false);
        //        
        if (comments.floatOverviewComment != null && comments.floatOverviewComment != this)
        {
            comments.floatOverviewComment.hide();
            comments.floatOverviewComment = null;;
        }
        comments.setFloatOverviewComment(this, this.id);
    }
    hide()
    {
        setTimeout(function (id)
        {
            comments.showHideMarker(id, true);
        }, 150, this.id);
        //
        hideEl(this.div);
        this.hidden = true;
        //        
        comments.unsetFloatOverviewComment(this, this.id);
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
        const comment = this.comment;
        const id = this.id;
        let page = viewer.currentPage;
        //
        //
        const sd = new StageDiv(
            comment['markX'] * viewer.currentZoom + viewer.currentMarginLeft,
            comment['markY'] * viewer.currentZoom + viewer.currentMarginTop,
            200, null, "comment-overview-box", "comment-overview" + id
        );
        const div = sd.elDiv()
        addClass(div, "comment-overview-corner-lefttop")
        div.addEventListener("mouseleave", (e) =>
        {
            this.hide();
            // Show comment mark again
            comments.cursor.show();

        });
        div.addEventListener("click", (e) =>
        {
            if (comments.floatNewComment)
            {
                return comments.floatNewComment.hide();
            }
            e.preventDefault();
            this.hide();
            comments.showCommentExpanded(id);
        }, undefined, true);
        //        
        div.innerHTML = this._buildHTML(comment, this.commentList)
        this.div = div;
        //
        bySel('#commentsScene').appendChild(div);
        setElTopVisible(div);
        setElRightVisible(div);
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
        <div id = "c${commentID}" class="comment">
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
            </div>
        `;
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
        this.editCommentID = "";
        //        
        this.show();
    }
    show()
    {
        if (comments.floatExpandedComment == this)
        { // Hide
            return this.hide();
        }
        // Show
        if (!this.comment.expandedObj) this._build();
        showEl(this.div);
        this.hidden = false;
        //
        if (comments.floatExpandedComment != null)
        {
            comments.floatExpandedComment.hide();
            comments.floatExpandedComment = null;;
        }
        //
        comments.floatExpandedComment = this;
        comments._selectComment(this.id, true);
    }
    hide()
    {
        //
        hideEl(this.div);
        this.hidden = true;
        this._cancelEditing();
        comments.floatExpandedComment = null;
        comments._highlightComment(this.id, false)
        comments._selectComment(this.id, false);
    }
    _replaceData(newCommentData)
    {
        // Replace load comment by remote date
        const oldComment = comments.getCommentByID(newCommentData.id);
        if (!oldComment) return;
        Object.keys(oldComment).forEach(key => oldComment[key] = newCommentData[key]);
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
        const comment = this.comment;
        let page = viewer.currentPage;
        //
        const sd = new StageDiv(
            comment['markX'] * viewer.currentZoom + viewer.currentMarginLeft,
            comment['markY'] * viewer.currentZoom + viewer.currentMarginTop,
            240, null, "comment-expanded-box", "comment-expanded" + this.id
        );
        //sd.top = comment["markY"] + "px";
        const div = sd.elDiv()
        this.div = div;
        //        
        div.innerHTML = this._buildHTML()
        //
        bySel('#commentsScene').appendChild(div);
        //
        div.addEventListener("mouseleave", (e) =>
        {
            comments.cursor.show();

        });
        div.addEventListener("mouseenter", (e) =>
        {
            comments.cursor.hide();

        });
        //        
        setElRightVisible(div);
        //
        comment.expandedObj = this;
    }
    _buildHTML()
    {
        const commentList = comments.commentList;
        const comment = this.comment;

        function buildMessageHTML(msg, replyMode = false)
        {
            const user = commentList['users'][msg.uid];
            let code = "";
            ///
            var createdDate = new Date(msg['created'] * 1000)
            var createdStr = createdDate.toLocaleDateString() + " " + createdDate.toLocaleTimeString()
            ///            
            let uid = msg['uid']
            let commentID = msg['id']
            //
            code += `
                <div id = "c${commentID}Edit" class="commentEdit hidden">
                    <textarea id="msg" rows="2"
                        onfocus="comments.inputFocused = true"
                        onblur="comments.inputFocused = false"

                    >${msg['msg']}</textarea>
                    <div class="buttons">                        
                        <button class="button button--primary" id="save" type="button" onclick="return comments.floatExpandedComment._saveEditing();">Save</button>
                        <button class="button button--secondary" id="cancel" type="button" onclick="return comments.floatExpandedComment._cancelEditing();">Cancel</button>
                    </div>
                </div>
                <div id = "c${commentID}" class="comment">
                    <div class="head">
                        <div class = "author"> ${user.name}</div> 
            `;
            if (comments.uid != "" && comments.uid == uid)
            {
                code += `
                    <div style="cursor: pointer" onclick="comments.floatExpandedComment._switchToEdit('${commentID}'); return false;">
                        <svg class="uiIcon16 uiIcon">
                            <use xlink:href="#icEdit16"></use>
                        </svg>
                    </div>
                `;
                if (replyMode)
                {
                    code += `
                        <div style="cursor: pointer" onclick="comments.floatExpandedComment._deleteReply('${commentID}');return false;">
                            <svg class="uiIcon16 uiIcon">
                                <use xlink:href="#icDelete16"></use>
                            </svg>
                        </div>
                    `;
                }
            }
            code += `
                </div>
                <div class="date">
                    ${createdStr}                                    
                </div> 
                <div>                             
                    <span id="msg">${commentReplaceEnds(msg['msg'])}<span>
                </div>
             </div>
            `
            return code;
        }
        function _buildReplyForm()
        {
            let code = `
    <div id = "replyForm" class="comment">
        <div>
            <textarea id="msg" rows="2" placeholder="Add a comment"
                onfocus="comments.inputFocused = true; comments.floatExpandedComment.newCommentFocused()"                
                onblur="comments.inputFocused = false"

            ></textarea>
            <div class="buttons hidden">
                <button class="button button--primary" id="send" type="button" onclick="return comments.floatExpandedComment.sendReply();">Send</button>
                <button class="button button--secondary" id="reset" type="button" onclick="return comments.floatExpandedComment._resetReply();">Reset</button>
            </div>
        </div>
`;
            return code
        }
        let code = `
        <div class="header">
                <div style="width:100%;">Comment</div>
        `
        if (comments.uid != "" && comments.uid == comment.uid)
        {
            code += `
                <div style="cursor: pointer" onclick="if(comments.floatExpandedComment) comments.floatExpandedComment._remove();  return false;">
                    <svg class="uiIcon16">
                        <use xlink:href="#icDelete16"></use>
                    </svg>
                </div>
            `;
        }
        code += `            
                <div style="cursor: pointer;margin-left:8px;" onclick="if(comments.floatExpandedComment) comments.floatExpandedComment.hide();  return false;">
                    <svg class="uiIcon16">
                        <use xlink:href="#icClose16"></use>
                    </svg>
                </div>
            </div>
    <div class="comments-list">
        `;
        code += buildMessageHTML(comment);
        if (comment["replies"])
        {
            comment["replies"].forEach(msg =>
            {
                code += buildMessageHTML(msg, this.id);
            });
        }
        if (comments.uid != "") code += _buildReplyForm();
        code += `
    </div>
`;
        return code;
    }
    _findCommentEl(ext = "")
    {
        return bySel("#comment-expanded" + this.id + " #c" + this.editCommentID + ext);
    }
    _saveEditing()
    {
        if (this.editCommentID == "") return;
        //
        const textArea = this._findCommentEl("Edit textarea");
        ///
        var formData = new FormData();
        formData.append("msg", textArea.value);
        formData.append("commentID", this.id);
        const replyMode = this.editCommentID != this.id;
        if (replyMode)
        {
            formData.append("replyID", this.editCommentID);
        }
        //
        var handler = function ()
        {
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //                       
            console.log(this.responseText)
            if (result.status != 'ok')
            {
                alert(result.message);
                //form.showError(result.message)
            } else
            {
                comments.floatExpandedComment._cleanUpEditing();
                comments.floatExpandedComment._replaceData(result.data);
            }
        }
        //
        return comments.sendCommand(replyMode ? "updateReply" : "updateComment", formData, handler);
    }
    _cancelEditing(rollback = true)
    {
        if (this.editCommentID == "") return;
        // switch editing to view mode
        hideEl(this._findCommentEl("Edit"));
        showEl(this._findCommentEl());
        if (rollback)
        {
            const textArea = this._findCommentEl("Edit textarea");
            textArea.value = this.editCommentOld;
        }
        this._cleanUpEditing();
    }
    _cleanUpEditing()
    {
        // reset temp vars
        this.editCommentID = "";
        this.editCommentOld = "";
    }
    _switchToEdit(commentID)
    {
        // close old editing
        this._cancelEditing();

        // open new editing
        this.editCommentID = commentID;
        showEl(this._findCommentEl("Edit"));
        hideEl(this._findCommentEl());

        // save old context
        const textArea = this._findCommentEl("Edit textarea");
        this.editCommentOld = textArea.value;
    }

    newCommentFocused()
    {
        const msgEl = bySel("#comment-expanded" + this.id + " #replyForm #msg");
        addClass(msgEl, "focused");
        const btn = bySel("#comment-expanded" + this.id + " #replyForm .buttons");
        showEl(btn);
    }

    newCommentUnfocused()
    {
        const btn = bySel("#comment-expanded" + this.id + " #replyForm .buttons");
        hideEl(btn);
    }

    _resetReply()
    {
        const msgEl = bySel("#comment-expanded" + this.id + " #replyForm #msg");
        msgEl.value = "";
    }

    _remove()
    {
        if (!comments.removeComment(this.id)) return;
        this.hide();
    }

    _deleteReply(replyID)
    {
        if (!confirm("Delete the reply?")) return;
        //
        var formData = new FormData();
        formData.append("commentID", this.id);
        formData.append("replyID", replyID);
        var handler = function ()
        {
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //                        
            if (result.status != 'ok')
            {
                alert("Can't remove the reply. " + result.message)
            } else
            {
                comments.floatExpandedComment._replaceData(result.data);
            }
        }
        //    
        return comments.sendCommand("removeReply", formData, handler);
    }

    sendReply()
    {
        const text = bySel("#comment-expanded" + this.id + " #replyForm #msg").value;
        ///
        var formData = new FormData();
        formData.append("msg", text);
        formData.append("commentID", this.id);
        //
        var handler = function ()
        {
            var result = JSON.parse(this.responseText);
            if (comments.processRequestResult(result)) return
            //                        
            console.log(this.responseText)
            if (result.status != 'ok')
            {
                alert(result.message);
                //form.showError(result.message)
            } else
            {
                comments.floatExpandedComment._replaceData(result.data);
            }
        }
        //
        return comments.sendCommand("replyComment", formData, handler);
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

        this.uid = ""
        this.sid = ""
        this.user = null;

        // load user data from browser storage   
        this.loadSessionFromBrowser();
        //
        this.commentList = null
        //
        this.currentForm = null
        this.loginForm = new CommentsLoginForm()
        this.authForm = new CommentsAuthForm()
        //
        this.cursor = new CommentsCursor();
        this.floatNewComment = null;
        this.floatExpandedComment = null;
        this.floatOverviewComment = null;
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
        this.user = null;
        this.saveSessionInBrowser()
        this.loginForm.clear()
        this.authForm.clear()
        hideEl(bySel("#comments_viewer_content #comments #user"));
        //
        this.loginForm.show()
    }
    loadSessionFromBrowser()
    {
        const prevUID = window.localStorage.getItem("comments-uid");
        this.uid = prevUID != null ? prevUID : "";
        const prevSID = window.localStorage.getItem("comments-sid");
        this.sid = prevSID != null ? prevSID : "";
        if (this.uid != "") this.user = JSON.parse(window.localStorage.getItem("comments-user-info"));
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
        if (!confirm("Sign out?")) return false;
        //
        var formData = new FormData();
        var handler = function ()
        {
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
        if (!confirm("Delete the comment?")) return false;
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
        this.loginForm.buildHTML();
        this.authForm.buildHTML();
        //        
        if (this.sid == "")        
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
            <div id = "c${commentID}" class="comment"
                onclick = "comments._openComment(${commentID})"
                onmouseenter = "comments._highlightComment(${commentID},true,true)"
                onmouseleave = "comments._highlightComment(${commentID},false,true)"
            >
                <div class="head">                
                    <div class="author">${user['name']}</div>
                </div>
                <div>
                    ${createdStr}                    
                </div>                       
                <div>                             
                    <span id="msg">${commentReplaceEnds(comment['msg'])}<span>
                </div>
            </div>
        `
        return code;
    }
    unsetFloatOverviewComment(obj, commentID)
    {
        this._highlightComment(commentID, false);
        this.floatOverviewComment = null;
    }
    setFloatOverviewComment(obj, commentID)
    {
        this._highlightComment(commentID, true);
        this.floatOverviewComment = obj;

    }
    _openComment(commentID)
    {
        this.showCommentExpanded(commentID);
    }
    _selectComment(commentID, state)
    {
        const div = bySel("#comments_viewer_content #comments #c" + commentID);
        if (div)
        {
            if (state)
                addClass(div, "selected");
            else
                removeClass(div, "selected");
        }
    }
    _highlightComment(commentID, state, onMouse = false)
    {
        const div = bySel("#comments_viewer_content #comments #c" + commentID);
        if (div)
        {
            if (state)
                addClass(div, "highlighted");
            else
                removeClass(div, "highlighted");
        }
        if (onMouse && state)
        {
            const text = bySel("#commentsScene #mark-" + commentID + " text");
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
    _addComment(newCommentHTML)
    {
        const el = bySel("#comments_viewer_content #comments #list");
        el.innerHTML = newCommentHTML + el.innerHTML;
    }
    _buildComments(commentList)
    {
        let code = ""
        //
        if (comments.user)
        {
            code += `<div id = "user" style="width:100%;">   
                    <div id="name" style="width:100%;">
                        Logged as ${comments.user.name}         
                    </div>
                    <div style="width:16px; height:16px; cursor: pointer;" 
                        onclick="commentsViewer.comments.logout();  return false;"
                        >
                        <svg class="svgIcon">
                            <use xlink:href="#icSignOut16"></use>
                        </svg>
                    </div>            
            </div>
        `;
        }
        //
        code += `<div id = "list">`
        if (commentList['comments'].length == 0)
        {
            code += `<div class="empty">
                Click anywhere to leave a comment
            `;
        }
        let counter = commentList['comments'].length
        commentList['comments'].forEach(function (comment)
        {
            code += this._buildCommentHTML(comment, counter, commentList);
            counter--;
        }, this)
        code += `</div> `
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
                this.addMarkersToScene(id, comment['markX'], comment['markY'], c, comment)
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

        let code = `<div id = "commentsScene" style="position:fixed"> <svg style="z-index:2" height="100%" width="${width}px"></svg>
                    </div> `
        bySel("body #container").innerHTML += code;
        //
        this.currentPage = page
        this.cursor.show();
    }
    showHideMarker(id, visible)
    {
        showEl(bySel(`#commentsScene svg #mark-${id} `), visible);
    }
    showCommentOverview(id)
    {
        const comment = this.getCommentByID(id);
        //
        if (comment.overviewObj && !comment.overviewObj.hidden) return;
        if (comment.expandedObj && !comment.expandedObj.hidden) return;
        //
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
    addMarkersToScene(id, x, y, text = "", comment = undefined)
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
            onmouseenter = "comments.showCommentOverview('${id}')"
            width = "${width}" height = "${height}" id = "c${id}" x = "${x}" y = "${y}" fill = "none" xmlns = "http://www.w3.org/2000/svg"
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

        if (comment !== undefined)
        {
            let text = `
                <div id = "${id}> 
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