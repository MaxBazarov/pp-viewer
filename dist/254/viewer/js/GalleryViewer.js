const GALLERY_TOP_MARGIN = 80
const GALLERY_GROUP_VMARGIN = 40
const GALLERY_LEFTRIGH_MARGIN = 40

const GALLERY_FRAME_LABEL_HEIGHT = 32
const GALLERY_FRAME_LABEL_MINZOOM = 0.2

const GALLERY_MIN_ZOOM = 0.05
const GALLERY_MAX_ZOOM = 3

const ZOOM_MODE_OPT = "opt"

const svgNS = "http://www.w3.org/2000/svg";

//  https://github.com/onury/invert-color/blob/master/lib/invert.js
var DEFAULT_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.05;
var RE_HEX = /^(?:[0-9a-f]{3}){1,2}$/i;
var DEFAULT_BW = {
    black: '#000000',
    white: '#ffffff',
    threshold: DEFAULT_THRESHOLD
};
// -------------------------------
// HELPER METHODS
// -------------------------------
function padz(str, len)
{
    if (len === void 0) { len = 2; }
    return (new Array(len).join('0') + str).slice(-len);
}
function hexToRgbArray(hex)
{
    if (hex.slice(0, 1) === '#')
        hex = hex.slice(1);
    if (!RE_HEX.test(hex))
        throw new Error("Invalid HEX color: \"" + hex + "\"");
    // normalize / convert 3-chars hex to 6-chars.
    if (hex.length === 3)
    {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16) // b
    ];
}
function toRGB(c)
{
    return { r: c[0], g: c[1], b: c[2] };
}
function toRgbArray(c)
{
    if (!c)
        throw new Error('Invalid color value');
    if (Array.isArray(c))
        return c;
    return typeof c === 'string' ? hexToRgbArray(c) : [c.r, c.g, c.b];
}
// http://stackoverflow.com/a/3943023/112731
function getLuminance(c)
{
    var i, x;
    var a = []; // so we don't mutate
    for (i = 0; i < c.length; i++)
    {
        x = c[i] / 255;
        a[i] = x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function invertToBW(color, bw, asArr)
{
    var options = (bw === true)
        ? DEFAULT_BW
        : Object.assign({}, DEFAULT_BW, bw);
    return getLuminance(color) > options.threshold
        ? (asArr ? hexToRgbArray(options.black) : options.black)
        : (asArr ? hexToRgbArray(options.white) : options.white);
}
// -------------------------------
// PUBLIC MEMBERS
// -------------------------------
/**
 *  Generates inverted (opposite) version of the given color.
 *  @param {Color} color - Color to be inverted.
 *  @param {BlackWhite|boolean} [bw=false] - Whether to amplify the inversion to
 *  black or white. Provide an object to customize black/white colors.
 *  @returns {HexColor} - Hexadecimal representation of the inverted color.
 */
function invertColor(color, bw)
{
    if (bw === void 0) { bw = false; }
    color = toRgbArray(color);
    if (bw)
        return invertToBW(color, bw);
    return '#' + color.map(function (c) { return padz((255 - c).toString(16)); }).join('');
}
// -------------------------------

class GalleryViewerLink
{
    constructor(index, link, spage, dpage)
    {
        this.index = index
        this.link = link
        this.spage = spage
        this.dpage = dpage
        //
        if (undefined == spage.slinks) spage.slinks = []
        if (undefined == dpage.dlinks) dpage.dlinks = []
        spage.slinks.push(this)
        dpage.dlinks.push(this)
        //
    }

    appendCode(svg, zoom, visible)
    {
        const page = this.spage
        const dpage = this.dpage
        const l = this.link
        //
        var lsx = l.rect.x + l.rect.width / 2 + page.globalLeft
        var lsy = l.rect.y + l.rect.height / 2 + page.globalTop
        //
        var ldx0 = dpage.globalLeft
        var ldx1 = dpage.globalLeft + dpage.width
        var ldy0 = dpage.globalTop
        var ldx = 0, ldy = 0, dc = 0
        // find the best target edge to connect with
        if (ldx0 > lsx)
        {
            ldx = ldx0
            ldy = ldy0 + dpage.height / 2
            lsx += l.rect.width / 2 // place start to hotspot right edge
            dc = 50
        } else if (lsx > ldx1)
        {
            ldx = ldx1
            ldy = ldy0 + dpage.height / 2
            lsx -= l.rect.width / 2 // place start to hotspot left edge
            dc = 50
        } else if (ldy0 > lsy)
        {
            lsy += l.rect.height / 2
            ldx = ldx0 + dpage.width / 2
            ldy = ldy0
            dc = 0
        } else
        {
            lsy -= l.rect.height / 2
            ldx = ldx0 + dpage.width / 2
            ldy = ldy0 + dpage.height
            dc = 0
        }
        //
        const path = document.createElementNS(svgNS, "path");
        //if (visible) path.setAttribute("display", "none");
        path.id = "l" + this.index;
        path.setAttribute("marker-end", "url(#arrow)")
        path.setAttribute("d", "M "
            + Math.round(lsx * zoom) + " "
            + Math.round(lsy * zoom) + " "
            + "q "
            + Math.round((ldx - lsx) / 2 * zoom) + " "
            + dc + " "
            + Math.round((ldx - lsx) * zoom) + " "
            + Math.round((ldy - lsy) * zoom) + " "
        );
        svg.appendChild(path);
        //
        const circle = document.createElementNS(svgNS, "circle");
        //if (visible) circle.setAttribute("display", "none");
        circle.id = "s" + this.index;
        circle.setAttribute("cx", Math.round(lsx * zoom));
        circle.setAttribute("cy", Math.round(lsy * zoom));
        circle.setAttribute("r", 3);
        svg.appendChild(circle);
    }
}

function handleWheel(e)
{
    if (e.ctrlKey)
    {
        e.preventDefault();
        //
        let newZoom = viewer.galleryViewer.zoom - e.deltaY / 1000
        viewer.galleryViewer.zoomChanged(newZoom)

        //
        // Adjust zoom
        const zoomSelect = bySel("#gallery-modal #controls #zoomSelector");
        const customOption = zoomSelect.options[0]
        customOption.selected = true
        customOption.label = `${Math.round(viewer.galleryViewer.zoom * 100)}%`
        customOption.value = viewer.galleryViewer.zoom
        //        
    }
}


class GalleryViewer extends AbstractViewer
{
    constructor()
    {
        super()
        this.isSidebarChild = false
        this.blockMainNavigation = true
        this.enableTopNavigation = true
        this.links = null
        this.focusedPage = null
        this.lastCurrentPage = null
        //
        this.isLinksVisible = false
        if (window.localStorage.getItem("galleryIsLinkVisible") == "true") this.isLinksVisible = true
        bySel("#gallery-header #galleryShowLinks").checked = this.isLinksVisible;
        //
        this.zoom = 1
        this.zoomMode = ZOOM_MODE_OPT
        this.currentFullWidth = null
        this.searchInputFocused = false
        //
        this._initPages()
    }

    _initPages()
    {
        this.pages = story.pages
    }

    initialize(force = false)
    {
        if (!force && this.inited) return

        this.divGrid = document.querySelector("#gallery #grid")

        this.buildContent()

        // Load page comment counters
        if (viewer.commentsViewer)
        {
            var formData = new FormData();
            viewer.commentsViewer.askCommentCounters(function ()
            {
                var result = JSON.parse(this.responseText);
                //
                if ("ok" == result.status)
                {
                    viewer.galleryViewer._updateCommentCounters(result.data)
                } else
                {
                    console.log(result.message);
                }
                return
            })
        }

        //update info
        document.querySelector("#gallery-header-container #info #title").innerHTML = story.title
        document.querySelector("#gallery-header-container #info #frames").innerHTML = this.pages.length + " frames";
        //
        this.inited = true

        // Position content
        this.reShow()
    }

    reShow()
    {
        this.calcNodePositions()
        this.positionScene()
        this.positionContent()

    }

    _updateCommentCounters(pagesInfo)
    {
        this.pages.forEach(function (page)
        {
            const pageID = page.getHash()
            const pageInfo = pagesInfo[pageID]
            if (!pageInfo)
            {
                //console.log("Can't find page info for " + pageID);
                return
            }
            //
            let text = ""
            if (pageInfo['commentsTotal'] != 0) text = "  (" + pageInfo['commentsTotal'] + ")"
            //
            bySel("#gallery #grid #t" + page.index + " #comm").innerHTML = text;
        }, this);
    }

    handleKeyDown(event)
    {

        // Key "ESC"
        if (27 == event.which)
            this.toggle()
        // Ctl and Key "+" increase zoom
        else if (187 == event.which && event.metaKey)
            this.changeZoom(true)
        else if (189 == event.which && event.metaKey)
            this.changeZoom(false)
        // Key "G" activates/deactivates Symbol Viewer
        else if (!this.searchInputFocused && 71 == event.which && !event.metaKey)

            this.toggle()
        else if (this.searchInputFocused)
        {
            return true
        }
        // Key "L"
        else if (76 == event.which)
        {
            byId("galleryShowLinks").click()
        } else if (77 == event.which)        
        {
            return super.handleKeyDown(event)
        }

        event.preventDefault()
        return true
    }

    changeZoom(positive)
    {
        const newZoom = this.zoom + (positive ? 0.1 : -0.1)
        this.zoomChanged(newZoom)
    }

    zoomChanged(zoomValue)
    {
        if (zoomValue === ZOOM_MODE_OPT)
        {
            this.zoom = this._calcOptZoom()
            this.zoomMode = zoomValue
        } else
        {
            if (zoomValue < GALLERY_MIN_ZOOM) zoomValue = GALLERY_MIN_ZOOM
            if (zoomValue > GALLERY_MAX_ZOOM) zoomValue = GALLERY_MAX_ZOOM

            this.zoom = zoomValue
            this.zoomMode = ""
        }
        {
            const now = Date.now()
            const prevTime = this.time
            if (prevTime != undefined)
            {
                //console.log(now - prevTime)
                if ((now - prevTime) < 40) return
                console.log(this.zoom)
                this.time = now
            } else
            {
                this.time = now
                console.log("start")
            }
            this.reShow()
        }
    }

    viewerResized()
    {
        this.reShow()
    }

    handleKeyDownWhileInactive(event)
    {

        if (71 == event.which && !event.metaKey)
        { // g
            // Key "G" activates Symbol Viewer
            this.toggle()
        } else
        {
            return super.handleKeyDownWhileInactive(event)
        }

        event.preventDefault()
        return true
    }

    // Calling from UI
    showLinks(visible)
    {
        window.localStorage.setItem("galleryIsLinkVisible", visible)
        this.isLinksVisible = visible
        this._showHideLinks(visible ? null : false)
    }


    _showSelf()
    {
        if (!this.inited || this.currentFullWidth != viewer.fullWidth) this.initialize(true)

        showEl(byId('gallery-modal'));

        byId('searchInput').addEventListener("focusin", function ()
        {
            viewer.galleryViewer.searchInputFocused = true
        })
        byId('searchInput').addEventListener("focusout", function ()
        {
            viewer.galleryViewer.searchInputFocused = false
        })
        //$('#searchInput').focus()

        document.addEventListener(
            "wheel", handleWheel,
            {
                passive: false
            }
        );


        super._showSelf()

        // Redraw search results
        this.onSearchInputChange()
        viewer.refresh_url(viewer.currentPage, "", false)

        this._markCurrentPage()

    }

    _hideSelf()
    {
        document.removeEventListener("wheel", handleWheel)
        //
        hideEl(byId("gallery-modal"))
        super._hideSelf()
        viewer.refresh_url(viewer.currentPage, "", false)
    }

    _markCurrentPage()
    {
        if (this.lastCurrentPage)
        {
            const div = bySel("#gallery #grid #p" + this.lastCurrentPage.index);
            if (div) removeClass(div, "active");
            //            
        }
        this.lastCurrentPage = viewer.currentPage
        const div = bySel("#gallery #grid #p" + this.lastCurrentPage.index);
        if (div) addClass(div, "active");

    }


    buildContent()
    {
        story.groups.forEach(function (group)
        {
            this.buildContent_Group(group)
            group.pages.forEach(page => this.buildContent_Page(page, group))
        }, this);
        //this._buildLinks()
    }

    buildContent_Group(group)
    {
        var divGroup = document.createElement("div");
        divGroup.id = "g" + group.index;
        divGroup.style.left = "0px";
        divGroup.style.top = "0px";
        divGroup.style.width = "200%";
        divGroup.style.height = "0px";
        if (story.galleryPageColorsEnabled) divGroup.style.background = group.backColor;
        group.div = divGroup

        this.divGrid.appendChild(group.div)

        // find group pages
        const pages = this.pages.filter(s => s.groupIndex == group.index)
        group.pages = pages
    }

    buildContent_Page(page, group)
    {
        let y = page.globalTop

        /// build frame label
        if (page.isFrame)
        {
            var labelDiv = document.createElement("div");
            labelDiv.style.left = "0px";
            labelDiv.style.top = "0px";
            //labelDiv.style.width = "0px";
            //labelDiv.style.height = "0px";
            labelDiv.style.fontSize = "12px";
            labelDiv.style.color = invertColor(group.backColor);
            labelDiv.className = "label galleryAbsFrameLabel hidden";
            labelDiv.innerHTML = page.title;
            //
            this.divGrid.appendChild(labelDiv);
            //            
            page.label_div = labelDiv
        } else
        {
            page.label_div = null
        }

        // Show frame itself
        {
            var div = document.createElement("div");
            div.style.left = "0px";
            div.style.top = "0px";
            div.style.width = "0px";
            div.style.height = "0px";
            div.className = page.isFrame ? "galleryArtboardAbs" : "galleryItemAbs";
            div.id = "p" + page.index;

            if (page.isFrame)
            {
                div.addEventListener("click", function (e)
                {
                    viewer.galleryViewer.selectPage(page.index)
                });
                div.addEventListener("mouseenter", function ()
                {
                    viewer.galleryViewer.mouseEnterPage(page.index)
                })
                div.addEventListener("mouseleave", function ()
                {
                    viewer.galleryViewer.mouseLeavePage(page.index)
                })
            }
            this.divGrid.appendChild(div);
            page.div = div
            // Sbow image
            let img = new Image()
            const name = "previews/" + page.image;
            if (story.singleFile)
                img.src = IMAGES[name];
            else
                img.src = encodeURIComponent(viewer.files) + "/" + name;
            img.class = "gallery-image"
            img.alt = page.title

            /*
            let src = encodeURIComponent(viewer.files)
            src += "/" + page.image
            var img = $('<img/>', {
                class: "gallery-image",
                alt: page.title,
                width: "100%",
                height: "100%",
                src: src
            });*/
            div.appendChild(img)
            page.img_div = img

        }

    }

    calcNodePositions()
    {

        // find maximum width of page with frames
        this.maxGroupWidth = null
        let y = 0

        story.groups.forEach(function (group)
        {
            if (group.pages.length == 0) return
            ///
            let groupLocLeft = null, groupLocRight = null, groupLocTop = null, groupLocBottom = null
            //
            group.pages.forEach(function (page)
            {
                page.group = group
                page.slinks = []
                page.dlinks = []
                // add label height to page height
                //
                if (null == groupLocTop || page.y < groupLocTop) groupLocTop = page.y
                if (null == groupLocLeft || page.x < groupLocLeft) groupLocLeft = page.x
                if (null == groupLocRight || (page.x + page.width) > groupLocRight) groupLocRight = page.x + page.width
                if (null == groupLocBottom || (page.y + page.height) > groupLocBottom) groupLocBottom = page.y + page.height
                // 
            }, this);
            // 
            group.localTop = groupLocTop
            group.height = groupLocBottom - groupLocTop + GALLERY_GROUP_VMARGIN * 2
            group.localLeft = groupLocLeft
            group.localRight = groupLocRight
            ////            
            ////
            const groupLocWidth = groupLocRight - groupLocLeft
            if (null == this.maxGroupWidth || groupLocWidth > this.maxGroupWidth) this.maxGroupWidth = groupLocWidth
            //
            group.globTop = y
            y += group.height
        }, this);

        // Calculate zoom to fit max width
        if (this.zoomMode == ZOOM_MODE_OPT)
        {
            this.zoom = this._calcOptZoom()
        }
        this.currentFullWidth = viewer.fullWidth

        // show pages using their coordinates and current zoom
        y = 0
        this.fullHeight = 0

        story.groups.forEach(function (group)
        {
            if (group.pages.length == 0) return
            //// show pages
            group.pages.forEach(function (page)
            {
                page.globalTop = group.globTop - group.localTop + page.y + GALLERY_GROUP_VMARGIN
                page.globalLeft = page.x - group.localLeft
            }, this);
            //
            this.fullHeight += group.height
            //
            y += group.height // + groupSpace + groupTitleHeight + 30
        }, this);
    }

    _calcOptZoom()
    {
        let zoom = (viewer.fullWidth - GALLERY_LEFTRIGH_MARGIN * 2) / this.maxGroupWidth
        //if (zoom < 0.05) zoom = 0.05
        if (zoom > 0.6) zoom = 0.6
        return zoom
    }


    positionScene()
    {
        const groupsFullWidth = this.maxGroupWidth * this.zoom;
        const sceneWidth = groupsFullWidth < viewer.fullWidth ? viewer.fullWidth : groupsFullWidth;
        this.divGrid.style.width = (sceneWidth + GALLERY_LEFTRIGH_MARGIN * 2) + "px";
    }


    positionContent()
    {
        story.groups.forEach(function (group)
        {
            this.positionContent_Group(group)
            group.pages.forEach(page => this.positionContent_Page(page))
        }, this);
        this._buildLinks()
    }

    positionContent_Group(group)
    {
        group.div.style.top = this._posToStyleValue(group.globTop - 1, GALLERY_TOP_MARGIN)
        group.div.style.height = this._posToStyleValue(group.height + 2)
    }

    positionContent_Page(page)
    {
        // position frame label
        if (page.label_div)
        {
            let top = page.globalTop - (this.zoom < 0.5 ? (GALLERY_FRAME_LABEL_HEIGHT / this.zoom * 0.6) : GALLERY_FRAME_LABEL_HEIGHT)
            page.label_div.style.top = this._posToStyleValue(top, GALLERY_TOP_MARGIN)
            page.label_div.style.left = this._posToStyleValue(page.globalLeft, GALLERY_LEFTRIGH_MARGIN)
            showEl(page.label_div, this.zoom >= GALLERY_FRAME_LABEL_MINZOOM);
        }
        // position frame itself
        page.div.style.left = this._posToStyleValue(page.globalLeft, GALLERY_LEFTRIGH_MARGIN)
        page.div.style.top = this._posToStyleValue(page.globalTop, GALLERY_TOP_MARGIN)
        page.div.style.width = this._posToStyleValue(page.width)
        page.div.style.height = this._posToStyleValue(page.height)
        page.img_div.style.width = this._posToStyleValue(page.width)
        page.img_div.style.height = this._posToStyleValue(page.height)
    }


    selectPage(index)
    {
        this.hide()
        viewer.goToPage(index, this.actualSearchText)
    }

    mouseEnterPage(index)
    {
        if (this.isLinksVisible) return
        //
        if (this.focusedPage) this.focusedPage.showHideGalleryLinks(false)
        const page = story.pages[index]
        page.showHideGalleryLinks(true)
        this.focusedPage = page
    }

    mouseLeavePage(index)
    {
        if (this.isLinksVisible) return
        //
        if (this.focusedPage) this.focusedPage.showHideGalleryLinks(false)
    }


    _valueToStyle(styleName, v, absDelta = 0)
    {
        return styleName + ": " + Math.round(v * this.zoom + absDelta) + "px;"
    }
    _posToStyleValue(pos, absDelta = 0)
    {
        return Math.round(pos * this.zoom + absDelta) + "px"
    }

    _showHideLinks(show)
    {
        this._buildLinks()
    }


    _buildLinks()
    {
        const finalWidth = this.maxGroupWidth
        let finalHeight = this.fullHeight
        //drop old scene
        const old = document.getElementById("links_svg")
        if (old) old.remove()
        if (!this.isLinksVisible) return
        // build scene        
        const svg = document.createElementNS(svgNS, "svg");
        svg.id = "links_svg";
        svg.setAttribute("width", Math.abs(Math.round(finalWidth * this.zoom)));
        svg.setAttribute("height", Math.abs(Math.round(finalHeight * this.zoom)));

        const defs = document.createElementNS(svgNS, "defs");
        svg.appendChild(defs);

        const marker = document.createElementNS(svgNS, "marker");
        marker.id = "arrow";
        marker.setAttribute("viewBox", "0 0 10 10");
        marker.setAttribute("refX", 5);
        marker.setAttribute("refY", 5);
        marker.setAttribute("markerWidth", 6);
        marker.setAttribute("markerHeight", 6);
        marker.setAttribute("fill", "#F89000");
        marker.setAttribute("orient", "auto");
        defs.appendChild(marker);

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
        path.setAttribute("fill", "#F89000");
        svg.appendChild(path);

        //
        let indexCounter = 0
        this.links = []
        //
        this.pages.forEach(function (page)
        {
            page.links.forEach(function (frameLink)
            {
                /// Show links to other pages
                frameLink.reactions.forEach(function (l)
                {
                    // valide destination page
                    if (l.frameIndex == page.index) return
                    const dpage = story.pages[l.frameIndex]
                    if (!dpage || "external" == dpage.type) return
                    // build SVG coode for the link
                    const link = new GalleryViewerLink(indexCounter++, frameLink, page, dpage)
                    link.appendCode(svg, this.zoom, this.isLinksVisible)
                    this.links.push(link)
                }, this)
            }, this)
        }, this)

        this.divGrid.appendChild(svg)
    }

    //Search page in gallery by page name
    onSearchInputChange()
    {
        var keyword = byId("searchInput").value.toLowerCase().trim()
        if (undefined == this.actualSearchText && "" == keyword) return

        var foundScreenAmount = 0;

        this.pages.forEach(function (page)
        {
            const title = page.title.toLowerCase().trim()
            const div = bySel("#gallery #grid #p" + page.index);
            let visible = keyword == ''
            let foundTextLayers = []

            // Reset prev results
            div.querySelectorAll(".searchFocusedResultDiv,.searchResultDiv").forEach(el => el.remove());

            // Search in artboard title and image name            
            if (keyword != '')
            {
                visible = title.includes(keyword) || page.image.includes(keyword)

                // Search in text layers                
                page.findTextLayersByText(keyword, foundTextLayers)
                if (foundTextLayers.length > 0)
                {
                    visible = true
                }
                //
            }

            if (visible) foundScreenAmount++
            page.visibleInGallery = visible
            if (visible)
            {
                removeClass(div, "galleryArtboardAbsHidden");
                if (visible)
                {
                    foundTextLayers.forEach(function (l)
                    {
                        viewer.galleryViewer._findTextShowElement(page, l, div)
                    })
                }
            } else
            {
                addClass(div, "galleryArtboardAbsHidden");
            }
        });

        // Final procedures
        this.actualSearchText = keyword != '' ? keyword : undefined
        viewer.galleryViewer._showHideLinks()

        //load amount of pages to gallery title
        bySel("#gallery-header-container #info #frames").innerHTML = foundScreenAmount + " frames"
    }

    _findTextShowElement(page, l, div)
    {
        const isFocused = true
        const padding = isFocused ? 2 : 0
        const zoom = this.zoom;

        let x = l.x * zoom
        let y = l.y * zoom

        // show layer border
        const elemDiv = document.createElement("div");
        elemDiv.className = isFocused ? "searchFocusedResultDiv" : "searchResultDiv";
        elemDiv.style.left = x + "px";
        elemDiv.style.top = y + "px";
        elemDiv.style.width = (l.w * zoom + padding * 2) + "px";
        elemDiv.style.height = (l.h * zoom + padding * 2) + "px";

        div.appendChild(elemDiv);
    }

}
