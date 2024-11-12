class StageDiv
{
    constructor(x = 0, y = 0, w = 0, h = 0, _class = "")
    {
        this.x = x + "px"
        this.y = y + "px"
        this.w = w + "px"
        this.h = h + "px"
        this.class = _class
    }

    coordsToCSS()
    {
        return `left:${this.x}px;top:${this.y}px;width:${this.w}px;height:${this.h}px;`
    }
    elDiv(elType = "div")
    {
        const el = document.createElement(elType);
        el.style.left = this.x; el.style.top = this.y;
        if (elType === "video")
        {
            el.setAttribute("width", this.w);
            el.setAttribute("height", this.h);
        } else
        {
            el.style.width = this.w; el.style.height = this.h;
        }
        if (this.class != "") el.className = this.class;
        return el
    }
}

// =============================== PRELOAD IMAGES =========================
var pagerLoadingTotal = 0

function getQuery(uri, q)
{
    return (uri.match(new RegExp('[?&]' + q + '=([^&]+)')) || [, null])[1];
}

function showError(error)
{
    alert(error)
    return false
}

function showMessage(message)
{
    alert(message)
}


function handleDecreaseVersion()
{
    const data = respToDataRecs(this)
    if (data === null) return false
    //
    const currentVerIndex = viewer._findCurrentVersionIndex(data)
    if (currentVerIndex === null) return
    if ((currentVerIndex + 1) === data['recs'].length) return this.showMessage(`The current #${story.docVersion} version is first version`)
    //
    viewer.infoViewer.goToVersionByRec(data['recs'][currentVerIndex + 1])
}

function handleIncreaseVersion()
{
    const data = respToDataRecs(this)
    if (data === null) return false
    //
    const currentVerIndex = viewer._findCurrentVersionIndex(data)
    if (currentVerIndex === null) return
    if (currentVerIndex === 0) return this.showMessage(`The current #${story.docVersion} version is first version`)
    //
    viewer.infoViewer.goToVersionByRec(data['recs'][currentVerIndex - 1])
}

function doTransNext()
{
    // get oldest transition
    const trans = viewer.transQueue[0]
    // if it still active then run it
    if (trans.active)
    {
        viewer.next()
        console.log("RUN transition")
    } else
    {
        console.log("skip transition")
    }

    // remove this transtion from stack
    viewer.transQueue.shift()
}

function pagerMarkImageAsLoaded()
{
    console.log(pagerLoadingTotal);
    if (--pagerLoadingTotal == 0)
    {
        addClass(bySel("#nav #loading"), "hidden")
    }
}

async function preloadAllPageImages()
{
    removeClass(bySel("#nav #loading"), "hidden")
    pagerLoadingTotal = story.totalImages
    for (var page of story.pages)
    {
        if (page.elImage == undefined)
        {
            page.loadImages()
            addClass(page.imageDiv, "hidden")
        }
    }
}

function reloadAllPageImages()
{
    for (var page of story.pages)
    {
        page.elImage.parent.remove();
        page.elImage = undefined
        for (var p of page.fixedPanels)
        {
            p.elImage.parent.remove();
            p.elImage = undefined
        }
    }
    preloadAllPageImages()
}

function doBlinkHotspots()
{
    viewer.toogleHightlighSpots(false)
    viewer.blinkingHotspots = false
}


// str: .transit .slideInDown"
function splitStylesStr(str)
{
    return str.split(" ").map(s => s.replace(".", ""))
}

// ============================ VIEWER ====================================

class Viewer
{
    constructor(story, files)
    {
        this.highlightAllHotspotsOn = false
        this.showLayout = false
        this.showUI = true
        this.isFullScreen = false
        this.isEmbed = false

        this.teamID = ""
        this.searchText = ""

        this.fullBaseURL = ""
        this.fullCurrentPageURL = ""

        this.prevPage = undefined
        this.currentPage = undefined
        this.lastRegularPage = undefined

        this.currentMarginLeft = undefined
        this.currentMarginTop = undefined

        this.backStack = []
        this.urlLastIndex = -1
        this.urlLocked = false
        this.stateChangeIgnore = false
        this.files = files
        this.userStoryPages = []
        this.visStoryPages = []
        this.zoomEnabled = story.zoomEnabled
        this.menuVisible = false

        this.sidebarVisible = false
        this.child = null // some instance of Viewer
        this.allChilds = [] // list of all inited instances of Viewer

        this.symbolViewer = null
        this.infoViewer = null
        this.commentsViewer = null
        this.presenterViewer = null
        this.expViewer = null

        this.defSidebarWidth = 240

        this.transQueue = []
    }

    initialize()
    {
        this.initParseGetParams()
        this.buildUserStory();
        this.initializeHighDensitySupport();
        this.initAnimations()

        { // Calc Team ID
            const ids = document.location.pathname.split("/")
            if (ids.length >= 3) this.teamID = ids[2]
            if (ids.length >= 4) this.docID = ids[3]
        }

        /// Init UI
        const menuItemZoom = bySel("#menu #zoom");
        if (menuItemZoom) menuItemZoom.checked = this.zoomEnabled

        /// Init Viewers
        if (!story.hideGallery)
        {
            this.galleryViewer = new GalleryViewer()
        }

        if (story.layersExist)
        {
            this.symbolViewer = new SymbolViewer()
            if (story.experimentalExisting) this.expViewer = new ExpViewer()
        }
        this.infoViewer = new infoViewer()
        this.presenterViewer = new PresenterViewer()

        if (story.enableComments)
        {
            this.commentsViewer = new CommentsViewer()
            removeClass(bySel("#nav #pageComments"), "hidden")
        }

        if (story.experimentalExisting)
        {
            removeClass(bySel("#nav #experimental"), "hidden")
        }

        if (story.fileKey) removeClass(bySel("#nav #figma"), "hidden")

    }

    initAnimations()
    {
        if (story.layersExist)
        {
            // TODO
        }
        // transform ".transit .slideInDown" strings into class name arrays
        TRANS_ANIMATIONS.forEach(function (t, index)
        {
            if (0 == index) return
            t.in_classes = splitStylesStr(t.in_str_classes)
            t.out_classes = splitStylesStr(t.out_str_classes)
        }, this)
    }

    initializeLast()
    {

        byTag("body").addEventListener("keydown", function (event)
        {
            viewer.handleKeyDown(event)
        })
        window.addEventListener('mousemove', function (e)
        {
            viewer.onMouseMove(e.pageX, e.pageY)
        });
        window.addEventListener('resize', function () { viewer.zoomContent() });

        // Activate galleryViewer
        const gParam = this.urlParams.get('g')
        const av = this.urlParams.get('av')
        if (gParam != null && this.galleryViewer)
        {
            this.galleryViewer.show()
        } else if (this.urlParams.get('v') != null && this.infoViewer)
        {
            // Activate Changes Inspector
            this.infoViewer.toggle()
        } else if (this.urlParams.get('c') != null && this.commentsViewer)
        {
            // Activate Comment Viewer
            this.commentsViewer.toggle()
        } else if (av != null && av === "exp" && this.expViewer)
        {
            const widgetName = this.urlParams.get('expn')
            if (widgetName !== null) this.expViewer.highlightWidget(decodeURIComponent(widgetName))
            // Activate Experimental Viewer widget
            this.expViewer.toggle()
        }
    }

    initParseGetParams()
    {
        const loc = document.location
        this.fullBaseURL = loc.protocol + "//" + loc.hostname + loc.pathname
        this.urlParams = new URLSearchParams(loc.search.substring(1));
        this.urlSearch = loc.search

        if (this.urlParams.get('e') != null)
        {
            this.isEmbed = true
            // hide image preload indicator
            addClass(bySel("#nav #loading"), "hidden")
            // hide Navigation
            addClass(bySel(".navCenter"), "hidden")
            addClass(bySel(".navPreviewNext"), "hidden")
            addClass(bySel("#btnMenu"), "hidden")
            removeClass(bySel("#btnOpenNew"), "hidden")
        }
    }
    initializeHighDensitySupport()
    {
        if (window.matchMedia)
        {
            this.hdMediaQuery = window
                .matchMedia("only screen and (min--moz-device-pixel-ratio: 1.1), only screen and (-o-min-device-pixel-ratio: 2.2/2), only screen and (-webkit-min-device-pixel-ratio: 1.1), only screen and (min-device-pixel-ratio: 1.1), only screen and (min-resolution: 1.1dppx)");
            var v = this;
            this.hdMediaQuery.addListener(function (e)
            {
                v.refresh();
            });
        }
    }
    isHighDensityDisplay()
    {
        return (this.hdMediaQuery && this.hdMediaQuery.matches || (window.devicePixelRatio && window.devicePixelRatio > 1));
    }
    buildUserStory()
    {
        // convert array to object list
        story.pages = story.pages.map(page => new ViewerPage(page))
        //
        this.userStoryPages = []
        this.visStoryPages = []
        for (var page of story.pages)
        {
            if ('regular' == page.type || 'modal' == page.type)
            {
                page.userIndex = this.userStoryPages.length
                this.userStoryPages.push(page)
            } else
            {
                page.userIndex = -1
            }
            //
            if ('regular' == page.type || 'modal' == page.type || 'overlay' == page.type)
            {
                page.visIndex = this.visStoryPages.length
                this.visStoryPages.push(page)
            } else
            {
                page.visIndex = -1
            }
        }
        if (story.startPageIndex === undefined)
        {
            story.startPageIndex = this.userStoryPages[0].index
        }
    }

    handleKeyDown(event)
    {
        const v = viewer

        const allowNavigation = !this.child || !this.child.blockMainNavigation
        const enableTopNavigation = !this.child || this.child.enableTopNavigation

        // allow all childs to handle global keys
        if (!this.child)
        {
            for (const child of this.allChilds)
            {
                if (child.handleKeyDownWhileInactive(event)) return true
            }
        }

        // allow currently active childs to handle global keys
        if (this.child && this.child.handleKeyDown(event)) return true

        /*if (allowNavigation && 91 == event.which)
        { // cmd
            if (this.2highlightLinks) v.toogleHightlighSpots(false) // hide hightlights to allow user to make a screenshot on macOS
        }*/

        if (allowNavigation && (13 == event.which || 39 == event.which))
        { // enter OR right
            v.next()
        } else if (allowNavigation && (8 == event.which || 37 == event.which))
        { // backspace OR left
            v.previous()
        } else if (allowNavigation && story.layersExist && event.metaKey && (70 == event.which) && (!this.child || !this.child.customTextSearchPrevented()))
        { // Cmd+F
            this.showTextSearch()
        } else if (allowNavigation && story.layersExist && event.metaKey && (71 == event.which) && (!this.child || !this.child.customTextSearchPrevented()))
        { // Cmd+G -> Next search
            this.currentPage.findTextNext()
        } else if (allowNavigation && (16 == event.which) && story.highlightAllHotspots && !event.metaKey)
        { // SHIFT and no CMD to allow user to make a screenshot on macOS
            v.toogleHightlighSpots()
        } else if (event.metaKey || event.altKey || event.ctrlKey)
        { // skip any modificator active to allow a browser to handle its own shortkeys
            return false
        } else if (allowNavigation && 90 == event.which)
        { // z
            v.toggleZoom()
        } else if (allowNavigation && 69 == event.which)
        { // e
            v.share()
        } else if (73 == event.which)
        { // i
            v.openFullImage()
        } else if (allowNavigation && 76 == event.which)
        { // l
            v.toogleLayout();
        } else if (allowNavigation && 78 == event.which)
        { // n
            v.toogleUI();
        } else if (70 == event.which)
        { // f
            v.toogleFullScreen()
        } else if (enableTopNavigation && 83 == event.which)
        { // s
            var first = null != story.startPageIndex ? story.pages[story.startPageIndex] : v.getFirstUserPage()
            if (first && (first.index != v.currentPage.index || this.child))
            {
                this.hideChild()
                v.goToPage(first.index)
            }
        } else if (allowNavigation && 27 == event.which)
        { // esc
            v.onKeyEscape()
        } else
        {
            return false
        }
        event.preventDefault()
        return true
    }

    showTextSearch()
    {
        const search = prompt("Type text to find:", this.searchText)
        if (null != search)
        {
            this.searchText = search
            if (this.currentPage.findText(this.searchText))
            {
            }
        }
    }

    blinkHotspots()
    {
        if (this.blinkingHotspots) return

        if (this.symbolViewer && this.symbolViewer.visible) return
        this.blinkingHotspots = true
        this.toogleHightlighSpots(true)
        setTimeout(doBlinkHotspots, 500)
    }

    setMouseMoveHandler(obj)
    {
        this.mouseMoveHandler = obj
    }

    onMouseMove(x, y)
    {
        if (this.mouseMoveHandler && this.mouseMoveHandler.onMouseMove(x, y)) return
        if (this.currentPage) this.currentPage.onMouseMove(x, y)
    }

    onContentClick()
    {
        // Do we need to close a menu?
        if (this.menuVisible) this.hideMenu()

        // allow currently active child to handle click
        if (this.child && this.child.onContentClick()) return true

        if (this.linksDisabled) return false
        if (this.onKeyEscape()) return
        if (story.highlightAllHotspots) this.blinkHotspots()
    }
    onModalClick()
    {
        this.blinkHotspots()
    }


    showMenu()
    {
        addRemoveClass('class', 'menu', 'active')
        this.menuVisible = true
        return true
    }
    hideMenu()
    {
        addRemoveClass('class', 'menu', 'active')
        this.menuVisible = false
        return true
    }

    convFigmaURL(url)
    {
        if (story.cloud)
            return this._convFigmaURL_Cloud(url);
        else
            return this._convFigmaURL_Local(url);
    }

    _convFigmaURL_Local(url)
    {
        if (!url.includes("figma.com")) return url;
        if (story.fileKey === undefined || story.fileKey === "") return url;
        //
        let fileKey = "";
        let frameID = "";

        // Parse URL to check if the requested file is the same as current
        // URL examples: 
        // https://www.figma.com/proto/2irRrkEgfBgbLMcdgPUSXt/CX-OpenSearch?page-id=72%3A8537&type=design&node-id=72-8539&viewport=573%2C324%2C0.55&t=O8y2XTWKw9peUxsc-1&scaling=min-zoom&starting-point-node-id=72%3A8539&mode=design
        // https://www.figma.com/file/2irRrkEgfBgbLMcdgPUSXt/CX-OpenSearch?type=design&node-id=72%3A8539&mode=design&t=gbtgxDgFPZbXo6GZ-1
        //                                                 
        {
            // Parse URL
            const items = url.split("/");
            if (items.length < 2)
            {
                console.log(`Can't parse ${url}`);
                return "";
            }
            fileKey = items[4];
        }
        //                
        if (story.fileKey !== fileKey) return url;
        //        
        const qi = url.indexOf("?");
        if (qi < 0)
        {
            console.log(`Can't find ? in ${url}`);
            return "";
        }
        // Parse URL to find a requested node-id
        const searchParams = new URLSearchParams(url.substring(qi));
        if (searchParams.has("starting-point-node-id"))
        {
            frameID = searchParams.get("starting-point-node-id");
        } else
        {
            if (searchParams.has("node-id"))
            {
                frameID = searchParams.get("node-id");
            }
        }
        if (frameID === "") return url;
        // Try to find a local page by node-id
        const foundPages = story.pages.filter(p => p.id === frameID);
        if (foundPages.length == 0)
        {
            console.log(`Can't find page by node-id "${frameID}"`);
            return "";
        }
        return foundPages[0].index;
    }

    _convFigmaURL_Cloud(url)
    {
        if (!url.includes("figma.com") || this.teamID === "free") return url
        //
        var formData = new FormData()
        formData.append("url", url)
        //
        var request = new XMLHttpRequest();
        request.open("POST", `../../../_private/tools.php?cmd=convertFigmaURL&tid=${this.teamID}`, false);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(formData);
        if (request.status === 200)
        {
            const resp = JSON.parse(request.responseText)
            if (resp["error"] !== undefined)
            {
                console.log("Got error: " + resp["error"])
            } else
            {
                if (resp["docID"] !== this.docID)
                    return resp["url"]
                else
                    return resp["get"]
            }
        } else
        {
            console.log("Can't convert Figma URL")
        }
        return url
    }

    _findCurrentVersionIndex(data, showErrors = true)
    {
        const currentVerIndex = data['recs'].findIndex(rec => rec['ver'] == story.docVersion)
        if (currentVerIndex < 0) return showErrors ? this.showError("Can't parse version data") : false
        return currentVerIndex
    }

    decreaseVersion()
    {
        if (!this.infoViewer) return false
        this.infoViewer._loadFigmaData(handleDecreaseVersion)
    }

    increaseVersion()
    {
        if (!this.infoViewer) return false
        this.infoViewer._loadFigmaData(handleIncreaseVersion)
    }
    openFigma()
    {
        const group = this.groups[this.currentPage.groupIndex];
        let url = `https://www.figma.com/file/${story.fileKey}/${encodeURIComponent(story.docName)}?page-id=${encodeURIComponent(group.id)}&node-id=${encodeURIComponent(this.currentPage.id)}`
        window.open(url);
    }
    showChild(child)
    {
        // Hide currently visible child
        if (this.child)
        {
            this.hideChild(this.child)
        }

        // Show new child
        this.child = child;
        if (child.isSidebarChild)
        {
            this._showSidebar()
        }
        child._showSelf()
    }

    _showSidebar()
    {
        this.sidebarVisible = true
        removeClass(bySel("#sidebar"), "hidden")
        viewer.zoomContent()
    }

    _hideSidebar()
    {
        this.sidebarVisible = false
        addClass(byId("sidebar"), "hidden")
        this.zoomContent()
    }

    hideChild()
    {
        if (!this.child) return;
        if (this.child.isSidebarChild)
        {
            this._hideSidebar()
        }
        this.child._hideSelf()
        this.child = null;

    }

    share()
    {
        var page = this.currentPage
        let url = this._getPageFullURL()
        url += '&e=1'

        var iframe = '<iframe src="' + url + '" style="border: none;" noborder="0"'
        iframe += ' width="' + (story.iFrameSizeWidth ? story.iFrameSizeWidth : page.width) + '"'
        iframe += ' height="' + (story.iFrameSizeHeight ? story.iFrameSizeHeight : page.height) + '"'
        iframe += ' scrolling="auto" seamless id="iFrame1"></iframe>'

        iframe += '\n\n'

        var ihref = url.substring(0, url.lastIndexOf("/"))

        ihref = ihref + "/images/" + page.image
        iframe += "<a target='_blank' href='" + url + "'>" + "<img border='0' "
        iframe += ' width="' + (story.iFrameSizeWidth ? story.iFrameSizeWidth : page.width) + '"'
        //iframe += ' height="'+(story.iFrameSizeHeight?story.iFrameSizeHeight:page.height) + '"'
        iframe += "src='" + ihref + "'"
        iframe += "/></a>"

        alert(iframe)
    }


    openFullImage()
    {
        let page = this.currentPage
        let url = this._getPageFullURL(page)
        url = url.substring(0, url.lastIndexOf("/")) + "/images/" + page['image']

        window.open(url, "_blank")
    }



    toggleZoom(newState = undefined, updateToogler = true)
    {
        this.zoomEnabled = newState !== undefined ? newState : !this.zoomEnabled
        if (updateToogler)
        {
            let menuZoomItem = bySel("#menu #zoom");
            if (menuZoomItem) menuZoomItem.checked = this.zoomEnabled
        }
        this.zoomContent()
    }

    openNewWindow()
    {
        let url = this.fullCurrentPageURL
        // ok, now open it in the new browse window
        window.open(url, "_blank")
    }

    zoomContent()
    {
        var page = this.lastRegularPage
        if (undefined == page) return

        var content = byId('content');
        var contentModal = byId('content-modal');
        var elems = [content, contentModal] //,contentShadow

        var fullWidth = byTag("html").clientWidth
        var availableWidth = fullWidth
        var zoom = ""
        var scale = ""

        // check sidebar
        var sidebarWidth = 0
        if (this.sidebarVisible)
        {
            var sidebar = byId("sidebar")

            sidebarWidth = this.defSidebarWidth

            /* commented because it works in bad way with small artboards and large screen
            sidebarWidth = Math.round((fullWidth - page.width) / 2)
            if (sidebarWidth < defSidebarWidth) {
                sidebarWidth = defSidebarWidth
                availableWidth = fullWidth - sidebarWidth
            }*/
            if (((fullWidth - page.width) / 2) < sidebarWidth)
            {
                availableWidth = fullWidth - sidebarWidth
            }

            sidebar.style.marginLeft = (fullWidth - sidebarWidth) + "px";
            sidebar.style.marginTop = (0) + "px";
            sidebar.style.width = sidebarWidth + "px";
            sidebar.style.height = "100%";
        }


        if (this.zoomEnabled && ((availableWidth < page.width) || screen.width <= 800))
        {
            zoom = availableWidth / page.width
            scale = "scale(" + zoom + ")"
        }

        var newZoom = zoom != '' ? (zoom + 0) : 1

        if (undefined == this.currentZoom || this.currentZoom != newZoom)
        {
            for (var el of elems)
            {
                el.style.setProperty("zoom", zoom);
                el.style.setProperty("-moz-transform", scale);
            }
            content.style.setProperty("-moz-transform-origin", "left top");
            contentModal.style.setProperty("-moz-transform-origin", "center top");

        }

        this.currentZoom = newZoom
        this.fullWidth = fullWidth

        // Calculate margins
        this.currentMarginLeft = Math.round(availableWidth / 2) - Math.round(page.width / 2 * this.currentZoom)
        this.currentMarginTop = 0

        if (this.currentMarginLeft < 0) this.currentMarginLeft = 0

        // Set content to new left positions
        content.style.setProperty("margin-left", this.currentMarginLeft + "px")
        content.style.setProperty("margin-top", this.currentMarginTop + "px")
        this.currentPage.updatePosition()

        //
        if (this.child)
        {
            this.child.viewerResized()
        }
    }

    getPageHashes()
    {
        if (this.pageHashes == null)
        {
            var hashes = {};
            for (var page of story.pages)
            {
                hashes[page.getHash()] = page.index;
            }
            this.pageHashes = hashes;
        }
        return this.pageHashes;
    }

    getModalFirstParentPageIndex(modalIndex)
    {
        var foundPageIndex = null
        // scan all regular pages
        story.pages.filter(page => "regular" == page.type).some(function (page)
        {
            const foundLinks = page.links.filter(link => link.frameIndex != null && link.frameIndex == modalIndex)
            if (foundLinks.length != 0)
            {
                // return the page index which has link to modal
                foundPageIndex = page.index
                return true
            }
            // save a first regular page as a "found" for case if we will not
            // find any page with a link to a specified modal
            if (null == foundPageIndex) foundPageIndex = page.index
            return false
        }, this)

        // ok, we found some regular page which has a link to specified modal ( or it was a fist regular page)
        return foundPageIndex
    }

    getPageIndex(page, defIndex = 0)
    {
        var index;

        if (typeof page === "number")
        {
            index = page;
        } else if (page === "")
        {
            index = defIndex;
        } else
        {
            index = this.getPageHashes()[page];
            if (index == undefined)
            {
                index = defIndex;
            }
        }
        return index;
    }

    goBack()
    {
        if (this.backStack.length > 0)
        {
            this.goTo(this.backStack[this.backStack.length - 1], true, undefined, false);
            this.backStack.pop();
        } else if (this.currentPage.type === "modal" && this.lastRegularPage)
        {
            this.goTo(this.lastRegularPage.index, true, undefined, false);
        } else
        {
            window.history.back();
        }
    }
    closeModal()
    {
        return this.goBack()
    }
    goToPage(page, searchText)
    {
        this.clear_context();
        this.goTo(page);
        //
        if (undefined != searchText)
        {
            this.searchText = searchText
            this.currentPage.findText(this.searchText, false)
        }
    }

    goTo(page, refreshURL = true, link = undefined, incBackStack = true)
    {

        var index = this.getPageIndex(page);
        var newPage = story.pages[index];

        // Need to build a context for overlay
        if (newPage.type === "overlay")
        {
            if (newPage.showOverlayOverParent()) return
        }

        // We don't need any waiting page transitions anymore
        this._resetTransQueue()

        //if(this.symbolViewer) this.symbolViewer.hide()
        var currentPage = this.currentPage

        if (incBackStack && currentPage && currentPage.type !== "modal")
        {
            this.backStack.push(currentPage.index);
        }

        var oldcurrentPageModal = currentPage && currentPage.type === "modal"

        if (index < 0 || (currentPage && index == currentPage.index) || index >= story.pages.length) return;


        if (newPage.type === "modal")
        {
            // hide parent page links hightlighting
            this._updateLinksState(false, byId('content'))

            // no any page visible now, need to find something
            if (undefined == currentPage)
            {
                var parentIndex = this.getModalFirstParentPageIndex(index);
                this.goTo(parentIndex, false);
                this.zoomContent()
            }

            // redraw modal links hightlighting
            this._updateLinksState()
        } else
        {
            if (oldcurrentPageModal)
            {
                // hide modal page links hightlighting
                this._updateLinksState(false, byId('content-modal'))
                this._updateLinksState(undefined, byId('content'))
            }
        }
        this.prevPage = currentPage
        var prevRegularPage = this.lastRegularPage

        newPage.show()

        this.refresh_adjust_content_layer(newPage);
        this.refresh_hide_last_image(newPage)
        this.refresh_switch_modal_layer(newPage);
        if (refreshURL)
        {
            this.refresh_url(newPage)
        } else
        {
            this._calcCurrentPageURL(newPage)
        }
        this.refresh_update_navbar(newPage);

        this.currentPage = newPage;
        if (newPage.type !== "modal")
        {
            this.lastRegularPage = newPage
        }

        // zoom content if the new page dimensions differ from the previous
        if (newPage.type !== "modal")
        {
            if (!prevRegularPage || newPage.width != prevRegularPage.width || newPage.height != prevRegularPage.height)
            {
                this.zoomContent()
            }
        }


        if (newPage.transNextMsecs != undefined)
        {
            this._setupTransNext(newPage.transNextMsecs)
        }

        if (!newPage.disableAutoScroll && (!link || !link.disableAutoScroll))
        {
            window.scrollTo(0, 0)
        }

        if (this.child) this.child.pageChanged()
        this.allChilds.filter(c => c.alwaysHandlePageChanged).forEach(function (c)
        {
            c.pageChanged()
        })
    }

    _setupTransNext(msecs)
    {
        // deactivate all waiting transitions
        for (var trans of this.transQueue)
        {
            trans.active = false
        }
        // place new active transition over the top of stack
        this.transQueue.push({
            page: this.currentPage,
            active: true
        })
        // set timer in milisecs
        setTimeout(doTransNext, msecs)
    }
    // Deactivate all waiting transitions
    _resetTransQueue()
    {
        for (var trans of this.transQueue)
        {
            trans.active = false
        }
    }
    refresh_update_navbar(page)
    {
        var VERSION_INJECT = story.docVersion != 100000001 ? (" (v" + story.docVersion + ")") : "";

        var prevPage = this.getPreviousUserPage(page)
        var nextPage = this.getNextUserPage(page)

        bySel('#nav .title').innerHTML = (page.userIndex + 1) + '/' + this.userStoryPages.length + ' - ' + page.title + VERSION_INJECT;
        toggleClass(byId('nav-left-prev'), 'disabled', !prevPage);
        toggleClass(byId('nav-left-next'), 'disabled', !nextPage);

        byId('nav-left-prev').title = prevPage ? prevPage.title : "";
        byId('nav-left-next').title = nextPage ? nextPage.title : "";
        //toggleClass(byId("nav-right-hints"), 'disabled', page.annotations == undefined);

        this.refresh_update_links_toggler(page);
    }
    refresh_update_links_toggler(page)
    {
        let menuItemLinks = bySel("#menu #links");
        if (menuItemLinks) menuItemLinks.checked = this.highlightAllHotspotsOn;
    }
    refresh_hide_last_image(page)
    {
        var isModal = page.type === "modal";
        // hide last regular page to show a new regular after modal
        if (!isModal && this.lastRegularPage && this.lastRegularPage.index != page.index)
        {
            var lastPageImg = byId('img_' + this.lastRegularPage.index);
            if (lastPageImg) this.lastRegularPage.hide();
        }

        // hide last modal
        var prevPageWasModal = this.prevPage != null && this.prevPage.type === "modal"
        if (prevPageWasModal)
        {
            var prevImg = byId('img_' + this.prevPage.index);
            if (prevImg) this.prevPage.hide();
        }
    }
    refresh_adjust_content_layer(page)
    {
        if (page.type === "modal") return;

        const prevPageWasModal = this.prevPage && this.prevPage.type === "modal"
        if (prevPageWasModal)
        {
            addClass(byId('content-shadow'), 'hidden');
            addClass(byId('content-modal'), 'hidden');
        }
    }

    refresh_switch_modal_layer(page)
    {
        if (page.type !== "modal") return;

        var showShadow = page.showShadow == 1;
        var contentModal = byId('content-modal');
        var contentShadow = byId('content-shadow');

        if (showShadow)
        {
            removeClass(contentShadow, 'no-shadow');
            addClass(contentShadow, 'shadow');
            removeClass(contentShadow, 'hidden');
        } else
        {
            addClass(contentModal, 'hidden');
        }
        removeClass(contentModal, 'hidden');
    }

    _getSearchPath(page = null, extURL = null)
    {
        if (!page) page = this.currentPage
        let search = '?' + encodeURIComponent(page.getHash())
        if (extURL != null && extURL != "") search += "&" + extURL
        return search
    }

    _getPageFullURL(page = null, extURL = null)
    {
        if (!page) page = this.currentPage
        return this.fullBaseURL + this._getSearchPath(page, extURL)
    }

    _calcCurrentPageURL(page = null, extURL = null)
    {
        if (!page) page = this.currentPage;
        this.urlLastIndex = page.index;
        document.title = story.title + ': ' + page.title;

        let newPath = this._getPageFullURL(page, extURL);
        this.fullCurrentPageURL = newPath;
    }

    refresh_url(page, extURL = "", pushHistory = true)
    {
        if (this.urlLocked) return

        this._calcCurrentPageURL(page, extURL)
        let newPath = this.fullCurrentPageURL
        this.fullCurrentPageURL = newPath

        if (this.isEmbed)
        {
            newPath += "&e=1"
        }
        if (this.galleryViewer && this.galleryViewer.isVisible())
        {
            newPath += "&g=" + (this.galleryViewer.isMapMode ? "m" : "g")
        }
        if (this.commentsViewer && this.commentsViewer.isVisible())
        {
            newPath += "&c=1"
        }

        if (pushHistory)
        {
            window.history.pushState(newPath, page.title, newPath);
        } else
        {
            window.history.replaceState({}, page.title, newPath);
        }
    }

    _parseLocationSearch()
    {
        //if (document.location.hash != null && document.location.hash != "")
        //  return this._parseLocationHash()

        var result = {
            page_name: "",
            reset_url: false,
            overlayLinkIndex: undefined,
            redirectOverlayLinkIndex: undefined,
        }
        this.urlParams.forEach(function (value, key)
        {
            if ("" == value) result.page_name = key
        }, this);

        if (null == result.page_name || "" == result.page_name || this.urlParams.get(result.page_name) != "")
        {
            result.page_name = ""
            result.reset_url = true
        } else
        {
            result.overlayLinkIndex = this.urlParams.get("o")
        }
        return result
    }

    handleNewLocation(initial)
    {
        var locInfo = this._parseLocationSearch()
        var pageIndex = locInfo.page_name != null ? this.getPageIndex(locInfo.page_name, null) : null
        if (null == pageIndex)
        {
            if (locInfo.page_name != "") alert("The requested page is not found. You will be redirected to the default page.")
            // get the default page
            pageIndex = story.startPageIndex
            locInfo.reset_url = true
        }

        if (!initial && this.urlLastIndex == pageIndex)
        {
            return
        }

        var page = story.pages[pageIndex];

        if (initial)
            page.isDefault = true
        else
            this.clear_context();

        // check if this page overlay
        // check if this redirect overlay
        this.goTo(pageIndex, locInfo.reset_url);

        if (locInfo.overlayLinkIndex != null)
        {
            page.showOverlayByLinkIndex(locInfo.overlayLinkIndex)
        }

        if (!initial) this.urlLastIndex = pageIndex

        // Open redirect overlay over the overlay source page
        /*if (overlayRedirectInfo)
        {
            overlayRedirectInfo.link.a.click()
        }*/
    }

    clear_context_hide_all_images()
    {
        const page = this.currentPage;
        const isModal = page && page.type === "modal";

        addClass(byId('content-shadow'), 'hidden');
        addClass(byId('content-shadow'), 'hidden');

        // hide last regular page
        if (this.lastRegularPage)
        {
            var lastPageImg = byId('img_' + this.lastRegularPage.index);
            if (lastPageImg) this.lastRegularPage.hide();
        }
        // hide current modal
        if (isModal)
            if (byId('img_' + this.currentPage.index)) this.currentPage.hide();
    }

    clear_context()
    {
        this.clear_context_hide_all_images()

        this.prevPage = undefined
        this.currentPage = undefined
        this.lastRegularPage = undefined

        this.backStack = []
    }

    refresh()
    {
        reloadAllPageImages()
        this.currentPage.show()
    }

    onKeyEscape()
    {
        // Close menu
        if (this.menuVisible) return this.hideMenu()


        const page = this.currentPage
        if (!page) return false
        // If the current page has search visible then hide it
        if (undefined != page.actualSearchText)
        {
            page.stopTextSearch()
            return true
        }
        // If the current page has some overlay open then close it
        if (page.hideCurrentOverlays())
        {
            return true
        }
        // If the current page is modal then close it and go to the last non-modal page
        if (this.currentPage.type === "modal")
        {
            viewer.closeModal()
            return true
        }
        return false
    }
    next()
    {
        var page = this.getNextUserPage(this.currentPage)
        if (!page) return
        this.goToPage(page.index);
    }

    previous()
    {
        // Get previous page
        var page = this.getPreviousUserPage(this.currentPage)
        // Go from the first to the latest page
        if (!page) page = this.userStoryPages[this.userStoryPages.length - 1]
        // oops
        if (!page) return
        this.goToPage(page.index);
    }

    getFirstUserPage()
    {
        var first = this.userStoryPages[0]
        return first ? first : null
    }
    getNextUserPage(page = null)
    {
        let nextUserIndex = 0
        if (!page) page = this.currentPage
        if (page) nextUserIndex = page.userIndex + 1
        if (nextUserIndex >= this.userStoryPages.length) nextUserIndex = 0
        return this.userStoryPages[nextUserIndex]
    }
    getNextVisPage(page, loopSearch = true)
    {
        let nexVisIndex = page ? page.visIndex + 1 : 0
        if (nexVisIndex >= this.visStoryPages.length)
            if (loopSearch) nexVisIndex = 0; else return null
        return this.visStoryPages[nexVisIndex]
    }
    getPreviousUserPage(page)
    {
        var prevUserIndex = page ? page.userIndex - 1 : -1
        if (prevUserIndex < 0) return null
        return this.userStoryPages[prevUserIndex]
    }
    toogleHightlighSpots(newState = undefined, updateToogler = true)
    {
        this.highlightAllHotspotsOn = newState != undefined ? newState : !this.highlightAllHotspotsOn
        if (updateToogler) this.refresh_update_links_toggler(this.currentPage)
        this._updateLinksState()
    }
    toogleLayout(newState = undefined, updateToogler = true)
    {
        this.showLayout = newState != undefined ? newState : !this.showLayout
        if (updateToogler)
        {
            let menuItemGrid = bySel("#menu #pagegrid");
            if (menuItemGrid) menuItemGrid.checked = this.showLayout;
        }
        const div = byId('content');

        if (this.showLayout)
        {
            this.currentPage.showLayout();
            addClass(div, "contentLayoutVisible");
        } else
            removeClass(div, "contentLayoutVisible");
    }
    toogleFullScreen(newState = undefined, updateToogler = true)
    {
        this.isFullScreen = newState != undefined ? newState : !this.isFullScreen;
        if (updateToogler)
        {
            let menuItemFullScreen = bySel("#menu #fullScreen");
            if (menuItemFullScreen) menuItemFullScreen.checked = this.isFullScreen;
        }
        //
        return this.isFullScreen ? this._enableFullScreen() : this._disableFullScreen()
    }
    //
    toogleUI(newState = undefined, updateToogler = true)
    {
        this.showUI = newState != undefined ? newState : !this.showUI;
        if (updateToogler)
        {
            let menuItemToogler = bySel("#menu #ui");
            if (menuItemToogler) menuItemToogler.checked = this.showUI;
        }
        toggleClass(byId('nav'), "hidden", !this.showUI)
    }
    _updateLinksState(showLinks = undefined, div = undefined)
    {
        if (undefined == showLinks) showLinks = this.highlightAllHotspotsOn

        const divs = div ? [div] : (showLinks & this.currentPage.type === 'modal' ?
            [byId('content-modal')]
            : [byId('content-modal'), byId('content')])
        if (showLinks)
            divs.forEach(d => addClass(d, "contentLinksVisible"))
        else
            divs.forEach(d => removeClass(d, "contentLinksVisible"))
    }

    showHints()
    {
        var text = this.currentPage.annotations;
        if (text == undefined) return;
        alert(text);
    }

    handleStateChanges(e)
    {
        if (this.stateChangeIgnore)
        {
            this.stateChangeIgnore = false
            return
        }

        viewer.urlLocked = true
        viewer.currentPage.hide(true, true)
        viewer.currentPage = null

        viewer.initParseGetParams()
        viewer.handleNewLocation(true)
        viewer.urlLocked = false
    }

    _enableFullScreen()
    {
        ///
        const elem = document.documentElement
        if (elem.requestFullscreen)
        {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen)
        { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen)
        { /* IE11 */
            elem.msRequestFullscreen();

        }
        //
        const changeHandler = function (event)
        {
            if (document.webkitIsFullScreen === false || document.mozFullScreen === false || document.msFullscreenElement === false)
            {
                presenterViewer.stop(false)
            }
        }
        document.addEventListener("fullscreenchange", changeHandler, false);
        document.addEventListener("webkitfullscreenchange", changeHandler, false);
        document.addEventListener("mozfullscreenchange", changeHandler, false);
    }

    _disableFullScreen()
    {
        if (document.exitFullscreen)
        {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen)
        { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen)
        { /* IE11 */
            document.msExitFullscreen();
        }
    }
}

// ADD | REMOVE CLASS
// mode ID - getELementByID
// mode CLASS - getELementByClassName

function addRemoveClass(mode, el, cls)
{
    var el;
    switch (mode)
    {
        case 'class':
            el = document.getElementsByClassName(el)[0];
            break;

        case 'id':
            el = byId(el);
            break;
    }
    if (el.classList.contains(cls))
        el.classList.remove(cls);
    else
        el.classList.add(cls);
}

function toggleClass(el, className)
{
    el.classList.toggle(className)
}

function hasClass(el, className)
{
    return el.classList.contains(className);
}
function addClass(el, className)
{
    if (!el.classList.contains(className)) el.classList.add(className);
}
function removeClass(el, className)
{
    if (el.classList.contains(className)) el.classList.remove(className);
}

function byId(elementID)
{
    return document.getElementById(elementID);
}

function byClass(elementID)
{
    return document.getElementsByClassName(elementID)[0];
}
function byClassAll(elementID)
{
    return Array.prototype.filter.call(document.getElementsByClassName(elementID), (el) => true)
}

function byTag(tag)
{
    return document.getElementsByTagName(tag)[0];
}

function bySel(selector)
{
    const el = document.querySelector(selector);
    if (el === null)
    {
        console.log(`Can not find element by selector "${selector}"`);
    }
    return el;
}

function showEl(el, visible = true)
{
    if (visible)
        removeClass(el, "hidden");
    else
        hideEl(el);
}

function toogleVisEl(el)
{
    toggleClass("el", "hidden")
}

function hideEl(el)
{
    addClass(el, "hidden")
}

function handleStateChanges(e)
{
    viewer.handleStateChanges(e)
}

addEventListener("DOMContentLoaded", (event) => 
{
    viewer.initialize();
    if (!!('ontouchstart' in window) || !!('onmsgesturechange' in window))
    {
        removeClass(byTag("body"), 'screen');
    }

    viewer.handleNewLocation(true)
    if (!viewer.isEmbed) preloadAllPageImages();

    window.addEventListener("popstate", handleStateChanges);
    window.addEventListener("hashchange", handleStateChanges);

    viewer.zoomContent()
    viewer.initializeLast()
});
