function respToDataRecs(resp)
{
    if (resp.readyState == resp.DONE)
    {
        if (resp.status == 200 && resp.responseText != null)
        {
            const data = JSON.parse(resp.responseText)
            if (undefined != data['recs'])
            {
                return data
            }
        }
        showError("Can't get information about the versions.")
    }
    return null
}

function getVersionInfoRequest()
{
    const data = respToDataRecs(this)
    if (data === null) return false
    viewer.infoViewer._showData(data);
    return true
}


class infoViewer extends AbstractViewer
{
    constructor()
    {
        super("info_viewer")

        this.preventCustomTextSearch = true

        this.context = "all";
        this.screenDiffs = []
        this.mode = 'diff'
        this.published = story.docVersion != 100000001
        this.currentRec = null

        this.dataLoaded = false
    }

    initialize(force = false)
    {
        if (!super.initialize(force)) return

        // init document common data here        
        this._showStatic()
        if (this.published)
        {
            this._showLoadingMessage()
        }
    }

    loadData(force = false)
    {
        if (this.dataLoade && !force) return
        this._loadFigmaData(getVersionInfoRequest)
        this.dataLoaded = true
    }

    _loadFigmaData(func)
    {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", `../data.json?${story.docVersion}`, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onreadystatechange = func;
        xhr.send(null);
    }

    goToVersionByRec(rec)
    {
        const newURL = "../" + rec['ver'] + '?' + encodeURIComponent(viewer.currentPage.getHash())
        window.open(newURL, "_self");
    }

    goToVersionByRecIndex(recIndex)
    {
        this.goToVersionByRec(this.data['recs'][recIndex])
    }


    goToScreen(recIndex, screenIndex, pageIndex)
    {
        this.currentRec = this.data['recs'][recIndex]
        this.nextRec = this.data['recs'][recIndex + 1]
        viewer.goToPage(pageIndex)
    }

    // delta = -1 or +1
    switchMode(delta)
    {
        const modes = ['diff', 'prev', 'new']
        var posMode = modes.indexOf(this.mode)
        if (undefined == posMode) return

        posMode += delta
        if (posMode < 0) posMode = modes.length - 1
        if (posMode >= modes.length) posMode = 0

        modes.forEach(function (mode, pos)
        {
            byId("info_viewer_mode_" + mode).checked = pos == posMode;
        }, this)

        this.pageChanged()
    }

    switchContext(newContext)
    {
        if (newContext !== "all" && newContext !== "current") return console.log(`switchContext(newContext),newContext=${newContext}`);
        this.context = newContext;
        this._showLoadingMessage();
        this.loadData(true);
    }

    ///////////////////////////////////////////////// called by Viewer


    _hideSelf()
    {
        this._restoreNewImages()
        hideEl(byId("info_viewer"));
        hideEl(byId("info_viewer_options"));
        if (document.location.search.includes('v'))
        {
            document.location.search = "" // remove ?v
        }
        super._hideSelf()
    }

    pageChanged()
    {

        var disabled = !this.screenDiffs[viewer.currentPage.getHash()]

        byId("info_viewer_mode_diff").disabled = disabled;
        byId("info_viewer_mode_new").disabled = disabled;
        byId("info_viewer_mode_prev").disabled = disabled;
        if (disabled) return
        //
        showEl(byId('info_viewer_options'));

        this._showCurrentPageDiffs()
    }


    handleKeyDownWhileInactive(event)
    {
        if (38 == event.which && event.shiftKey)
        {   // shift + up
            viewer.increaseVersion()
        } else if (40 == event.which && event.shiftKey)
        {   // shift + down
            viewer.decreaseVersion()
        } else if (86 == event.which)
        { // "v" key
            this.toggle()
        } else
        {
            return super.handleKeyDownWhileInactive(event)
        }

        event.preventDefault()
        return true
    }


    handleKeyDown(event)
    {
        var disabled = !this.screenDiffs[viewer.currentPage.getHash()]

        if (86 == event.which)
        { // "v" key
            this.toggle()
        } else if (!disabled && 37 == event.which && event.shiftKey)
        {   // left + shift
            this.switchMode(-1)
        } else if (!disabled && 39 == event.which && event.shiftKey)
        {   // right + shift
            this.switchMode(1)
        } else if (event.shiftKey)
        {  //shift
        } else
        {
            return super.handleKeyDown(event)
        }

        event.preventDefault()
        return true
    }

    showRecDetails(index, forNew, oneImage = "")
    {
        const rec = this.data['recs'][index]
        if (!rec) return
        ///
        const div = bySel("#info_viewer .record ." + (forNew ? 'n' : 'u') + "screens#i" + index);
        if (!div) return
        div.innerHTML = "";
        var info = ""
        ///
        if (rec.isVisible)
        {
            rec.isVisible = false
        } else
        {
            info += this._showScreens(rec, index, forNew, oneImage)
            rec.isVisible = true
        }
        div.innerHTML = info;
    }
    /////////////////////////////////////////////////

    _restoreNewImages()
    {
        story.pages.forEach(function (page)
        {
            if (page.srcImageObjSrc) page.imageObj.attr("src", page.srcImageObjSrc)
        })

    }


    _showScreens(rec, recIndex, showNew, oneImage = "")
    {
        var info = "";
        for (const [screenIndex, screen] of rec['screens_changed'].entries())
        {
            if (oneImage != "" && screen["image_name"] != oneImage) continue;
            //
            if (screen['is_new'] != showNew) continue;
            const pageIndex = viewer.getPageIndex(screen['screen_name'], -1)
            const page = pageIndex >= 0 ? story.pages[pageIndex] : undefined

            // We don't need to show external artboards here
            if (page && ("external" == page.type)) continue

            var pageName = page ? page.title : screen['screen_name'];

            if (page && screen['is_diff'])
            {
                this.screenDiffs[screen['screen_name']] = screen
            }

            info += "<div class='version-screen-div' onclick='viewer.infoViewer.goToScreen(" + recIndex + "," + screenIndex + "," + pageIndex + ")'>";
            info += "<div>";
            info += pageName;
            info += "</div><div>";
            info += `<img src = "../${rec['ver']}/images${screen['is_new'] ? "" : "-diff"}/${screen['image_name']}" border = "0" width = "216px" /> `
            info += "</div>";
            info += "</div>";
        }
        return info;
    }


    _showCurrentPageDiffs()
    {
        const data = this.currentRec
        const page = viewer.currentPage
        if (!page || !data) return false

        const screen = this.screenDiffs[page.getHash()]
        if (!screen) return false

        this.mode = $("#info_viewer_mode_diff").prop('checked') ? 'diff' : ($("#info_viewer_mode_prev").prop('checked') ? 'prev' : 'new')
        var newSrc = ''

        // save original image srcs
        if (!page.srcImageObjSrc) page.srcImageObjSrc = page.imageObj.attr("src")

        if ('diff' == this.mode)
        {
            newSrc = `../ ${data['ver']} / images - diff / ${screen['image_name']}`
        } else if ('new' == this.mode)
        {
            if (page.imageObj.attr("src") != page.srcImageObjSrc) newSrc = page.srcImageObjSrc
        } else
        {
            if (this.nextRec) newSrc = "../" + this.nextRec['ver'] + "/" + page.srcImageObjSrc
        }


        page.imageObj.attr("src", newSrc)
        return true
    }

    _showStatic()
    {
        var info = ""

        if (story.ownerEmail != '')
        {
            info += `<div class="head" style = "font-weight:bold;" > <div class="tooltip">Owner: ${story.ownerName}<span class="tooltiptext">${story.ownerEmail}</span></div></div> `
        } else
        {
            // Owner is uknown
            info += ""
        }
        info += `<div id="info_viewer_content_dynamic"/> `

        byId("info_viewer_content").innerHTML = info;
    }

    _showData(data)
    {
        this.data = data;
        let info = "";
        if (this.context == "all")
        {
            info += this._buildDataForAll(data);
        } else
        {
            info += this._buildDataForCurrent(data);
        }
        byId("info_viewer_content_dynamic").innerHTML = info;
    }

    _buildRecHeadHTML(rec, index)
    {
        var authorHTML = undefined != rec['email'] ? ` <div class= "tooltip" > by ${rec['author']}  <span class= "tooltiptext" > ${rec['email']}</span ></div > ` : rec['author'];
        return `
            <div class="ver">
            <a href="#" 
                onclick="viewer.infoViewer.goToVersionByRecIndex(${index})"
                >#${rec['ver']}</a> ${new Date(rec['time'] * 1000).toLocaleDateString()} ${authorHTML}
            </div>
            <div class="message">${rec['message'].replaceAll('--NOTELE', '')}</div>
            `;
    }

    _buildDataForCurrent(data)
    {
        var info = ""
        var curr = viewer.currentPage.image;

        let recPrinter = 0;
        data['recs'].forEach(function (rec, index)
        {
            if (rec["message"] === "-") return // don't show minor changes
            if (rec["screens_changed"] === undefined) return; //skip some broken recs;
            //
            let screenRec = rec['screens_changed'].filter((s) => s["image_name"] === curr)[0];
            if (screenRec == undefined) return;
            //
            if (recPrinter++) info += "<br/>"
            //
            info += `
                <div class= "record" >
                ${this._buildRecHeadHTML(rec, index)}
                <div class="info">
            `
            if (screenRec['is_new'])
            {
                info += `<a href="#" onclick="viewer.infoViewer.showRecDetails(${index},true,'${curr}')" style="font-weight: normal">Show added</a>`
                info += `<div class="nscreens" id="i${index}"/>`
            }
            if (screenRec['is_diff'])
            {
                info += `<a href="#" onclick="viewer.infoViewer.showRecDetails(${index},false,'${curr}')" style="font-weight: normal">Show updated</a>`
                info += `<div class="uscreens" id="i${index}"/>`
            }
            info += `</div></div > `
        }, this)

        return info;
    }

    _buildDataForAll(data)
    {
        var info = ""

        let recPrinter = 0;
        data['recs'].forEach(function (rec, index)
        {
            if (rec["message"] === "-") return // don't show minor changes                        
            //
            info += `
            <div class= "record">
                ${this._buildRecHeadHTML(rec, index)}             
                <div class="info">
            `;
            if (rec['screens_total_new'])
            {
                info += `Added: <a href="#" onclick="viewer.infoViewer.showRecDetails(${index},true)" style="font-weight: normal">${rec['screens_total_new']} screen(s)</a>`
                info += `<div class="nscreens" id="i${index}"></div>`
            }
            if (rec['screens_total_changed'])
            {
                info += `Updated: <a href="#" onclick="viewer.infoViewer.showRecDetails(${index},false)" style="font-weight: normal">${rec['screens_total_changed']} screen(s)</a>`
                info += `<div class="uscreens" id="i${index}"></div>`
            }
            if (!rec['screens_total_new'] && !rec['screens_total_changed'])
            {
                info += "No visual changes";
            }
            info += `
                </div>
            </div>`
        }, this)

        return info;;
    }


    _showSelf()
    {
        if (!this.inited) this.initialize()
        showEl(byId("info_viewer"));
        this.loadData()

        super._showSelf()
    }

    _showLoadingMessage()
    {
        byId("info_viewer_content_dynamic").innerHTML = "Loading...";
    }
}
