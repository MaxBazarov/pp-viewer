
///
const Constants = {
    FRAME_OVERLAY_PIN_HOTSPOT: "HOTSPOT",
    FRAME_OVERLAY_PIN_PAGE: "PAGE",
    //
    FRAME_OVERLAY_PIN_HOTSPOT_UNDER_LEFT: "UNDER_LEFT",
    FRAME_OVERLAY_PIN_HOTSPOT_UNDER_CENTER: "UNDER_CENTER",
    FRAME_OVERLAY_PIN_HOTSPOT_UNDER_RIGHT: "UNDER_RIGHT",
    FRAME_OVERLAY_PIN_HOTSPOT_TOP_LEFT: "TOP_LEFT",
    FRAME_OVERLAY_PIN_HOTSPOT_TOP_CENTER: "TOP_CENTER",
    FRAME_OVERLAY_PIN_HOTSPOT_TOP_RIGHT: "TOP_RIGHT",
    FRAME_OVERLAY_PIN_HOTSPOT_BOTTOM_RIGHT: "BOTTOM_RIGHT",
    FRAME_OVERLAY_PIN_HOTSPOT_UP_CENTER: "UP_CENTER",
    FRAME_OVERLAY_PIN_HOTSPOT_RELATIVE: "RELATIVE",
    //
    FRAME_OVERLAY_PIN_PAGE_TOP_LEFT: "TOP_LEFT",
    FRAME_OVERLAY_PIN_PAGE_TOP_CENTER: "TOP_CENTER",
    FRAME_OVERLAY_PIN_PAGE_TOP_RIGHT: "TOP_RIGHT",
    FRAME_OVERLAY_PIN_PAGE_BOTTOM_LEFT: "BOTTOM_LEFT",
    FRAME_OVERLAY_PIN_PAGE_BOTTOM_CENTER: "BOTTOM_CENTER",
    FRAME_OVERLAY_PIN_PAGE_BOTTOM_RIGHT: "BOTTOM_RIGHT",
    FRAME_OVERLAY_PIN_PAGE_CENTER: "CENTER",

    TRIGGER_ON_HOVER: 1,

    FRAME_TRANS_ANIM_NONE: 0,
    FRAME_TRANS_ANIM_SLIDEIN_UP: 1,
    FRAME_TRANS_ANIM_SLIDEIN_LEFT: 2,
    FRAME_TRANS_ANIM_FADE: 3,
    FRAME_TRANS_ANIM_SLIDEIN_RIGHT: 4,
    FRAME_TRANS_ANIM_SLIDEIN_DOWN: 5,

    LAYER_VSCROLL_NONE: 0,
    LAYER_VSCROLL_DEFAULT: 1,
    LAYER_VSCROLL_ALWAYS: 2,
    LAYER_VSCROLL_NEVER: 3,
}

const EVENT_HOVER = 1
let TRANS_ANIMATIONS = [
    {},
    { in_str_classes: ".transit .slideInUp", out_str_classes: ".transit .slideOutDown", in_token: "transition-slidein-up", out_token: "transition-slideout-down" },
    { in_str_classes: ".transit .slideInLeft", out_str_classes: ".transit .slideOutRight", in_token: "transition-slidein-left", out_token: "transition-slideout-right" },
    { in_str_classes: ".transit .fadeIn", out_str_classes: ".transit .fadeOut", in_token: "transition-fadein_str_classes:", out_token: "transition-fadeout" },
    { in_str_classes: ".transit .slideInRight", out_str_classes: ".transit .slideOutLeft", in_token: "transition-slidein-right", out_token: "transition-slideout-left" },
    { in_str_classes: ".transit .slideInDown", out_str_classes: ".transit .slideOutUp", in_token: "transition-slidein-down", out_token: "transition-slideout-up" },
]

function inViewport(elem)
{
    const H = window.innerHeight;
    const r = elem.getBoundingClientRect();
    const elH = r.height;
    const t = r.top;
    const b = r.bottom;
    return [r.top, Math.max(0, t > 0 ? Math.min(elH, H - t) : Math.min(b, H))]
}

function handleAnimationEndOnHide(el)
{
    el.target.removeEventListener("animationend", handleAnimationEndOnHide)
    const t = TRANS_ANIMATIONS[el.target.getAttribute("_tch")]
    t.out_classes.forEach(function (className)
    {
        el.target.classList.remove(className)
    })
    el.target.classList.add("hidden")
}

function handleAnimationEndOnShow(el)
{
    el.target.removeEventListener("animationend", handleAnimationEndOnShow)
    const t = TRANS_ANIMATIONS[el.target.getAttribute("_tcs")]
    t.in_classes.forEach(function (className)
    {
        el.target.classList.remove(className)
    })
}

class ViewerPage
{

    constructor(storyPage)
    {
        this.currentOverlays = []
        this.parentPage = undefined

        this.visible = false
        this.image = undefined
        this.imageDiv = undefined
        this.elImage = undefined

        this.currentLeft = undefined
        this.currentTop = undefined

        this.currentX = undefined
        this.currentY = undefined

        this.currentLink = undefined;

        // this.searchLayer  = undefined

        this.overlayByEvent = undefined
        this.tmpSrcOverlayByEvent = undefined

        this.visibleInGallery = true

        //
        Object.keys(storyPage).forEach(key =>
        {
            this[key] = storyPage[key]
        }, this)
    }

    showHideGalleryLinks(show = null)
    {

        if (this.slinks) this._showHideGalleryLinkSet(this.slinks, show)
        if (this.dlinks) this._showHideGalleryLinkSet(this.dlinks, show)
    }

    _showHideGalleryLinkSet(links, forceShow = null)
    {
        links.forEach(function (link)
        {
            let show = forceShow != null ? forceShow : this.visibleInGallery && link.dpage.visibleInGallery && link.spage.visibleInGallery
            // hide link
            const o = bySel("#gallery #grid svg #l" + link.index);
            showEl(o, show);
            // hide start point
            const sp = bySel("#gallery #grid svg #s" + link.index);
            showEl(sp, show);
        }, this)
    }

    getHash()
    {
        var image = this.image;
        return image.substring(0, image.length - 4); // strip .png suffix
    }

    hide(hideChilds = false, disableAnim = false)
    {
        if (!disableAnim && this.currentTransAnimReaction && this.type !== "modal")
        {
            const transInfo = TRANS_ANIMATIONS[this.currentTransAnimReaction.transAnimType]
            const el = this.imageDiv
            el.setAttribute("_tch", this.currentTransAnimReaction.transAnimType)
            transInfo.out_classes.forEach(function (className)
            {
                addClass(this.imageDiv, className);
            }, this)
            el.addEventListener("animationend", handleAnimationEndOnHide)
        } else
        {
            hideEl(this.imageDiv)
        }

        if (undefined != this.parentPage)
        { // current page is overlay      

            if (hideChilds) this.hideChildOverlays()

            const parent = this.parentPage
            viewer.stateChangeIgnore = true
            viewer.refresh_url(parent)
            // remove this from parent overlay
            const index = parent.currentOverlays.indexOf(this)
            parent.currentOverlays.splice(index, 1)
            this.parentPage = undefined
        } else
        {
            this.hideCurrentOverlays()
        }

        if (undefined != this.tmpSrcOverlayByEvent)
        {
            this.overlayByEvent = this.tmpSrcOverlayByEvent
            this.tmpSrcOverlayByEvent = undefined
        }
        // Cleanup
        this.visible = false
        this.currentLink = null
    }

    hideCurrentOverlays()
    {
        const overlays = this.currentOverlays.filter(p => p.currentReaction && p.currentReaction.overlayCloseOnClickOutside === true).slice()
        for (let overlay of overlays)
        {
            overlay.hide()
        }
        return overlays.length > 0
    }

    hideChildOverlays()
    {
        const overlays = this.parentPage.currentOverlays.slice()
        for (let overlay of overlays)
        {
            if (overlay.currentLink.orgPage != this) continue
            overlay.hide()
        }
    }

    hideOtherParentOverlays()
    {
        const overlays = this.parentPage.currentOverlays.slice()
        for (let overlay of overlays)
        {
            if (overlay == this) continue
            overlay.hide()
        }
    }


    show(disableAnim = false)
    {
        if (!this.elImage) this.loadImages(true)

        this.updatePosition()

        if (!disableAnim && this.currentTransAnimReaction && this.type !== "modal")
        {
            const transInfo = TRANS_ANIMATIONS[this.currentTransAnimReaction.transAnimType]
            const el = this.imageDiv;
            el.setAttribute("_tcs", this.currentTransAnimReaction.transAnimType)
            transInfo.in_classes.forEach(function (className, index)
            {
                addClass(el, className);
            }, this)
            //this.currentTransAnimReaction.transAnimDuration = 1000            
            el.style.animationDuration = this.currentTransAnimReaction.transAnimDuration + "s";
            el.addEventListener("animationend", handleAnimationEndOnShow)
        } else
        {
        }
        // Set scene back color
        if (this.type !== "modal")
        {
            const group = story.groups[this.groupIndex];
            if (group && group.backColor != undefined)
            {
                byClass("screenBody").style.backgroundColor = group.backColor;
            } else
            {
                console.log(`Can't find page with index=${this.groupIndex}`)
            }
        }
        //
        showEl(this.imageDiv);
        this.visible = true;
        // 
        if (this.linkTimeout)
        {
            const customEvent = {
                pageIndex: this.index,
                linkIndex: this.linkTimeout.index
            }
            setTimeout(handleLinkEvent, this.linkTimeout.triggerTimeout, null, customEvent)
        }
    }

    showOverlayOverParent()
    {
        var foundPage = null
        var foundLink = null
        // scan all regular pages
        story.pages.filter(page => "regular" == page.type).some(function (page)
        {
            const foundLinks = []
            page.links.forEach((link) =>
            {
                link.reaction.forEach((reaction) =>
                {
                    if (reaction.frameIndex != null && reaction.frameIndex == this.index) foundLinks.push(link);
                })
            }, this)
            if (foundReactions.length != 0)
            {
                // return the page index which has link to modal                    
                foundPage = page
                foundLink = foundLinks[0]
                return true
            }
            return false
        }, this)
        if (!foundPage) return false

        // ok, we found some regular page which has a link to specified overlay        
        viewer.goTo(foundPage.index, true);
        foundPage.showOverlayByLinkIndex(foundLink.index)

        return true
    }

    findTextNext()
    {
        if (undefined == this.textElemIndex) return false
        //
        //this.textElemIndex++
        this.findText(this.actualSearchText)
    }

    findText(text, interactive = true)
    {
        text = text.toLowerCase().trim()
        //        
        if (undefined != this.actualSearchText && this.actualSearchText != text)
        {
            this.textElemIndex = undefined
            this.actualSearchText = undefined
        }
        if (undefined == this.textElemIndex) this.textElemIndex = 0

        // Search all layers with required text inside
        let foundLayers = []
        this.findTextLayersByText(text, foundLayers)
        foundLayers.sort(function (a, b)
        {
            return a.y < b.y ? -1 : 1
        })
        //  No results
        if (0 == foundLayers.length)
        {
            if (!interactive) return false
            const nextPage = this.findNextPageWithText(text)
            if (!nextPage)
            {
                window.alert("The text was not found")
                return false
            }
            if (!window.confirm("Not found on the current page. Do you want to check other pages?"))
            {
                return false
            }
            viewer.goTo(nextPage.index)
            return true
        }
        if (foundLayers.length <= this.textElemIndex)
        {
            // No more results ahead
            if (interactive)
            {
                const nextPage = this.findNextPageWithText(text)
                if (nextPage)
                {
                    if (window.confirm("The last result found on the current page. Do you want to check other pages?"))
                    {
                        //this.stopTextSearch()
                        viewer.goTo(nextPage.index)
                        return true
                    }
                }
            }
            this.textElemIndex = 0
        }
        // Highlight results
        this.hideFoundTextResults()
        foundLayers.forEach(function (l, index)
        {
            this._findTextShowElement(l, index == this.textElemIndex)
        }, this)
        //
        this.actualSearchText = text
        if ((foundLayers.length + 1) > this.textElemIndex) this.textElemIndex++
        //
        return foundLayers.length > 0
    }

    findNextPageWithText(text)
    {
        let foundPage = null
        let page = this
        while (true)
        {
            // if we have some next pages?
            const nextPage = viewer.getNextVisPage(page)
            if (!nextPage) break
            // we don't want to run infinity loop
            if (nextPage.index == this.index) break
            // if a next page has this text
            if (nextPage.findText(text, false))
            {
                foundPage = nextPage
                break
            }
            page = nextPage
        }
        return foundPage
    }

    // Arguments:
    //  foundLayers: ref to list result
    //  layers: list of layers or null (to get a root layers)
    findTextLayersByText(text, foundLayers, layers = null)
    {
        if (!story.layersExist) return false
        if (null == layers)
        {
            const data = viewer.symbolViewer.getData()
            if (!data) return false
            layers = data.layers[this.index].c
            if (!layers) return false
        }

        for (var l of layers.slice().reverse())
        {
            if ("Text" == l.tp && l.tx.toLowerCase().includes(text))
            {
                foundLayers.push(l)
            }
            if (undefined != l.c)
                this.findTextLayersByText(text, foundLayers, l.c)
        }
    }
    _findTextShowElement(l, isFocused = false)
    {
        const padding = isFocused ? 5 : 0
        let x = l.x - padding
        let y = l.y - padding

        // show layer border
        const elemDiv = document.createElement("div");
        elemDiv.className = isFocused ? "searchFocusedResultDiv" : "searchResultDiv";
        elemDiv.style.left = x + "px";
        elemDiv.style.top = y + "px";
        elemDiv.style.width = (l.w + padding * 2) + "px";
        elemDiv.style.height = (l.h + padding * 2) + "px";

        this.linksDiv.appendChild(elemDiv);

        // scroll window to show a layer
        if (isFocused)
        {
            this._scrollTo(l.x, l.y)
        }
    }
    _createVideoPlayers()
    {
        if (!this.videoNodes) return
        this.videoNodes.forEach((n) =>
        {
            const stageDiv = new StageDiv(n.x, n.y, n.w, n.h, "videoDiv");
            const div = stageDiv.elDiv();
            this.linksDiv.appendChild(div);
            //
            const filePathCompleted = n.n.includes("/") || n.n.includes("\\")
            const filePath = filePathCompleted ? n.n : "images/" + n.n;
            //
            const stageVideo = new StageDiv(0, 0, n.w, n.h);
            const video = stageVideo.elDiv("video");
            video.setAttribute("src", filePath);
            //video.setAttribute("type", "video/mov");
            video.setAttribute("controls", "true");
            //elemDiv.className = isFocused ? "searchFocusedResultDiv" : "searchResultDiv";
            //< source src = "movie.mp4" type = "video/mp4" ></source>
            div.appendChild(video);
        }, this);
    }

    _scrollTo(x, y)
    {
        for (let p of this.fixedPanels)
        {
            if (Math.round(p.y) == 0)
            {
                y -= p.height
                break
            }
        }
        window.scrollTo(x, y - 10);
    }

    hideFoundTextResults()
    {
        byClassAll("searchResultDiv").forEach(el => el.remove());
        byClassAll("searchFocusedResultDiv").forEach(el => el.remove());
    }

    stopTextSearch()
    {
        this.hideFoundTextResults()
        this.actualSearchText = undefined
        this.textElemIndex = undefined
    }

    updatePosition()
    {
        this.currentLeft = viewer.currentMarginLeft
        this.currentTop = viewer.currentMarginTop

        if (this.type === "modal")
        {
            var regPage = viewer.lastRegularPage

            this.currentLeft += Math.round(regPage.width / 2) - Math.round(this.width / 2)
            const [y, visibleHeight] = inViewport(regPage.imageDiv)
            this.currentTop += Math.round(visibleHeight / 2) - Math.round(this.height / 2 * viewer.currentZoom)
            if (this.currentTop < 0) this.currentTop = 0
            if (this.currentLeft < 0) this.currentLeft = 0

            const contentModal = byId('content-modal');
            contentModal.style.marginLeft = this.currentLeft + "px";
            contentModal.style.marginTop = this.currentTop + "px";
            if (this.height >= visibleHeight)
                contentModal.style.overflowY = "scroll";
            else
                contentModal.style.overflowY = "";
        } else if ("overlay" == this.type)
        {
            this.currentLeft = viewer.currentPage ? viewer.currentPage.currentLeft : 0
            this.currentTop = viewer.currentPage ? viewer.currentPage.currentTop : 0
        }
        // Update fixed layers position)
        /*let py = null, ph = null
        this.fixedPanels.filter(p => !p.constrains.top && p.constrains.bottom).forEach(p =>
        {            
            if (py === null) [py, ph] = inViewport(this.imageDiv)
            if(viewer.currentZoom>=1)
                p.imageDiv.css("top", (py + ph - p.height) + "px")
            else
                p.imageDiv.css("top", (this.height - p.height) + "px")
        }, this)*/
    }

    showOverlayByLinkIndex(linkIndex)
    {
        linkIndex = parseInt(linkIndex, 10)

        var link = this._getLinkByIndex(linkIndex)
        if (!link)
        {
            console.log('Error: can not find link to overlay by index="' + linkIndex + '"')
            return false
        }

        // can handle only page-to-page transition
        if ((link["page"] == undefined)) return false

        var destPage = story.pages[link.frameIndex]
        // for mouseover overlay we need to show it on click, but only one time)
        if ("overlay" == destPage.type && Constants.TRIGGER_ON_HOVER == destPage.overlayByEvent)
        {
            destPage.tmpSrcOverlayByEvent = destPage.overlayByEvent
            destPage.overlayByEvent = Constants.TRIGGER_ON_HOVER
            viewer.customEvent = {
                x: link.rect.x,
                y: link.rect.y,
                pageIndex: this.index,
                linkIndex: link.index
            }
            handleLinkEvent({})
            viewer.customEvent = undefined
        } else
        {
            link.a.click()
        }
    }

    // return true (overlay is hidden) or false (overlay is visible)
    onMouseMove(x, y)
    {
        for (let overlay of this.currentOverlays)
        {
            // Commented to hide mouseover-overlay inside onclick-overlay  (ver 12.4.3)
            //if (overlay.currentLink.orgPage != this) continue 
            overlay.onMouseMoveOverlay(x, y)
        }
    }

    // return true (overlay is hidden) or false (overlay is visible)
    onMouseMoveOverlay(x, y)
    {
        if (hasClass(this.imageDiv, "hidden") || this.overlayByEvent != Constants.TRIGGER_ON_HOVER) return false
        if (viewer.linksDisabled) return false

        // handle mouse hover if this page is overlay
        var _hideSelf = false
        while (true)//Constants.TRIGGER_ON_CLICK == this.overlayByEvent)
        {
            var localX = (x / viewer.currentZoom) - this.currentLeft
            var localY = (y / viewer.currentZoom) - this.currentTop
            //alert(" localX:"+localX+" localY:"+localY+" linkX:"+this.currentLink.x+" linkY:"+this.currentLink.y);


            if ( // check if we inside in overlay
                localX >= this.currentX
                && localY >= this.currentY
                && localX < (this.currentX + this.width)
                && localY < (this.currentY + this.height)
            )
            {
                break
            }

            if ( // check if we out of current hotspot
                localX < this.currentLink.x
                || localY < this.currentLink.y
                || localX >= (this.currentLink.x + this.currentLink.width)
                || localY >= (this.currentLink.y + this.currentLink.height)
            )
            {
                _hideSelf = true
                break
            }
            break
        }

        // allow childs to handle mouse move
        var visibleTotal = 0
        var total = 0

        for (let overlay of this.parentPage.currentOverlays)
        {
            if (overlay.currentLink.orgPage != this) continue
            total++
            if (overlay.onMouseMoveOverlay(x, y)) visibleTotal++
        }

        if (_hideSelf)
            if (!total || (total && !visibleTotal))
            {
                this.hide(false)
                return false
            }

        return true
    }


    showAsOverlayInCurrentPage(orgPage, link, reaction, posX = 0, posY = 0, linkParentFixed = false, disableAnim = false)
    {
        this.currentReaction = reaction

        if (typeof posX == "string") posX = Number(posX.replace("px", ""))
        if (typeof posY == "string") posY = Number(posY.replace("px", ""))

        const newParentPage = viewer.currentPage

        if (!this.imageDiv) this.loadImages(true)
        if (link && link.panel === undefined) link.panel = this

        // check if we need to hide any other already visible overlay
        var positionCloned = false
        const currentOverlays = newParentPage.currentOverlays

        let overlayIndex = currentOverlays.indexOf(this.index)
        if (link.orgPage && overlayIndex < 0)
        {
            if ('overlay' !== link.orgPage.type || this.overlayClosePrevOverlay)
            {
                // if we show new overlay by clicking inside other overlay then we close the original overlay
                if ('overlay' == orgPage.type && this.overlayClosePrevOverlay)
                {
                    orgPage.hide()
                } else
                {
                    for (let overlay of currentOverlays)
                    {
                        if (overlay == this) continue
                        overlay.hide()
                    }
                }
            }
        }

        // Show overlay on the new position
        const div = this.imageDiv

        this.inFixedPanel = linkParentFixed && (this.overlayAlsoFixed || link.panel.isVertScroll)
        if (!this.parentPage || this.parentPage.id != newParentPage.id || hasClass(div, 'hidden'))
        {
            if (link.panel.isVertScroll)
            {
                removeClass(div, 'fixedPanelFloat')
                addClass(div, 'divPanel')
            }
            else if (this.inFixedPanel)
            {
                removeClass(div, 'divPanel')
                addClass(div, 'fixedPanelFloat')
            } else if (newParentPage.type === "modal")
            {
                //removeClass(div,'divPanel')
                //removeClass(div,'fixedPanelFloat')        
            } else
            {
                removeClass(div, 'fixedPanelFloat') // clear after inFixedPanel
                addClass(div, 'divPanel')
            }

            // click on overlay outside of any hotspots should not close it
            div.addEventListener("click", function (event)
            {
                event.stopPropagation();
                const index = parseInt(this.id.substring(this.id.indexOf("_") + 1))
                if (index >= 0)
                {
                    const page = story.pages[index]
                    const indexOverlay = page.parentPage.currentOverlays.indexOf(page)
                    if (indexOverlay == 0) page.hideOtherParentOverlays()
                }
                return false
            })

            if (link.fixedBottomPanel)
            {
                const panel = link.fixedBottomPanel;
                const panelLink = panel.links[link.index]
                posX = panel.x + panelLink.rect.x
                posY = orgPage.height - panel.y - panelLink.rect.y// + panelLink.rect.height)}

                // check page right border
                if ((posX + this.width) > orgPage.width) posX = orgPage.width - this.width

                newParentPage.imageDiv.appendChild(div)
                div.style.top = "";
                div.style.bottom = - posY + "px";
                div.style.marginLeft = posX + "px";
            } else if (reaction.overlayPinPagePositionType)
            {
                /*
                let top = posY, bottom = "", ml = "", mr = ""
                /*if (reaction.overlayPinPagePositionType === Constants.FRAME_OVERLAY_PIN_PAGE_BOTTOM_CENTER)
                {
                    ml = (newParentPage.width - this.width) / 2
                    bottom = 0
                } else if (reaction.overlayPinPagePositionType === Constants.FRAME_OVERLAY_PIN_PAGE_TOP_CENTER)
                {
                    ml = (newParentPage.width - this.width) / 2
                    top = 0
                }
                if (ml != "" && (ml + this.width) > newParentPage.width) ml = newParentPage.width - this.width
                //
                newParentPage.imageDiv.appendChild(div)
                div.style.top = top + (top != "" ? "px" : "");
                div.style.bottom = bottom + (bottom != "" ? "px" : "");
                div.style.marginLeft = ml + (ml != "" ? "px" : "");
                div.style.marginRight = mr + (mr != "" ? "px" : "");*/
                newParentPage.imageDiv.appendChild(div)
                div.style.top = posY + (posY != "" ? "px" : "");
                div.style.marginLeft = posX + (posX != "" ? "px" : "");
            } else
            {
                // 
                if (!this.overlayClosePrevOverlay && !positionCloned && undefined != this.overlayShadowX &&
                    (
                        (Constants.FRAME_OVERLAY_PIN_HOTSPOT == reaction.overlayPinType) // FRAME_OVERLAY_PIN_HOTSPOT
                        && (3 == reaction.overlayPinHotspot) //FRAME_OVERLAY_PIN_HOTSPOT_TOP_LEFT
                    )
                )
                {// OLD_FRAME_OVERLAY_ALIGN_HOTSPOT_TOP_LEFT
                    posX -= this.overlayShadowX
                }
                if (link.panel.isVertScroll)
                {
                    posY -= link.panel.y
                    //if(orgPage.type==="modal") posY+=orgPage.
                }

                this.currentX = posX
                this.currentY = posY

                if (link.panel.isVertScroll)
                {
                    link.panel.imageDiv.appendChild(div)
                } else if ("modal" == orgPage.type)
                    newParentPage.imageDiv.appendChild(div)
                div.style.top = posY + "px";
                div.style.marginLeft = posX + "px";
            }

            this.show(disableAnim)
            div.style.zIndex = 50 + newParentPage.currentOverlays.length;
            newParentPage.currentOverlays.push(this)
            this.parentPage = newParentPage
            this.currentLink = link

            // Change URL
            var extURL = 'o=' + link.index
            viewer.refresh_url(newParentPage, extURL)


        } else if (Constants.TRIGGER_ON_CLICK == this.overlayByEvent && posX == this.currentX && posY == this.currentY)
        {//handle only mouse hover
            // cursor returned back from overlay to hotspot -> nothing to do
        } else
        {
            this.hide()
            viewer.refresh_url(newParentPage)
        }
    }

    loadImages(force = false)
    {
        /// check if already loaded images for this page
        if (!force && this.elImage != undefined)
        {
            return pagerMarkImageAsLoaded()
        }

        const enableLinks = true;
        var isModal = this.type === "modal";

        const imageDiv = document.createElement("div");
        imageDiv.id = "div_" + this.index;
        imageDiv.style.height = this.height + "px";
        imageDiv.style.width = this.width + "px";
        imageDiv.className = ('overlay' == this.type) ? "divPanel" : "image_div";
        if (this.overlayShadow != undefined)
            imageDiv.style.boxShadow = this.overlayShadow;
        if ('overlay' == this.type && this.overlayOverFixed)
            imageDiv.style.zIndex = 50;

        this.imageDiv = imageDiv


        // create fixed panel images        
        for (var panel of this.fixedPanels)
        {
            const isBottomFloat = panel.isFloat && !panel.constrains.top && panel.constrains.bottom

            const panelDiv = document.createElement("div");
            panelDiv.id = panel.divID != '' ? panel.divID : ("fixed_" + this.index + "_" + panel.index);

            let cssClass = ""

            if (panel.isVertScroll)
            {
                cssClass = "panelVSCroll divPanel"
                switch (panel.vst)
                {
                    case Constants.LAYER_VSCROLL_ALWAYS:
                        cssClass += " always"; break
                    case Constants.LAYER_VSCROLL_NEVER:
                        cssClass += " never"; break
                }
                panelDiv.style.height = panel.mskH + "px";
                panelDiv.style.width = panel.width + "px";
                panelDiv.style.marginLeft = panel.x + "px";
                panelDiv.style.top = panel.y + "px";

            } else
            {
                panelDiv.style.height = panel.height + "px";
                panelDiv.style.width = panel.width + "px";

                if (panel.constrains.top || panel.isFixedisVertScrollDiv || (!panel.constrains.top && !panel.constrains.bottom))
                {
                    panelDiv.style.top = panel.y + "px";
                } else if (panel.constrains.bottom)
                {
                    panelDiv.style.bottom = (this.height - panel.y - panel.height) + "px";
                }
                panelDiv.style.marginLeft = panel.x + "px";
                //

                if (panel.shadow != undefined) panelDiv.style.boxShadow = panel.shadow
                // create Div for fixed panel            
                if (isBottomFloat)
                {
                    cssClass = 'fixedBottomPanelFloat'
                } else if (panel.isFloat)
                {
                    cssClass = 'fixedPanelFloat'
                } else if (panel.isVertScroll)
                {
                    cssClass = 'divPanel'
                } else if ("top" == panel.type)
                {
                    cssClass = 'fixedPanel fixedPanelTop'
                } else if ("left" == panel.type)
                {
                    cssClass = 'fixedPanel'
                }
            }

            panelDiv.className = cssClass;

            if (isBottomFloat)
            {
                const wrap1 = document.createElement("div");
                wrap1.style.position = "absolute";
                wrap1.style.zIndex = 13;
                const wrap2 = document.createElement("div");
                wrap1.style.position = "fixed";
                wrap1.style.height = "100vh";
                wrap1.style.top = "0px";
                wrap1.style.maxHeight = this.height + "px";

                wrap2.appendChild(panelDiv);
                wrap1.appendChild(wrap2);
                imageDiv.appendChild(wrap1);
            } else
            {
                imageDiv.appendChild(panelDiv);
            }
            panel.imageDiv = panelDiv;

            // create link div
            panel.linksDiv = document.createElement("div");
            panel.linksDiv.className = "linksDiv";
            panel.linksDiv.style.height = panel.height + "px";
            panel.linksDiv.style.width = panel.width + "px";
            panel.imageDiv.appendChild(panel.linksDiv);
            this._createLinks(panel);

            // add image itself
            panel.elImage = this._loadSingleImage(panel.isFloat || panel.isVertScroll ? panel : this, 'img_' + panel.index + "_");
            panelDiv.appendChild(panel.elImage);
            if (!this.isDefault) panel.elImage.style.webkitTransform = "translate3d(0,0,0)"
        }

        // create main content image      
        {
            byId(isModal ? "content-modal" : "content").appendChild(imageDiv);

            // create link div
            if (enableLinks)
            {
                const linksDiv = document.createElement("div");
                linksDiv.id = "div_links_" + this.index;
                linksDiv.className = "linksDiv";
                linksDiv.style.height = this.height + "px";
                linksDiv.style.width = this.width + "px";

                imageDiv.appendChild(linksDiv);
                this.linksDiv = linksDiv

                this._createLinks(this)
            }
        }
        var img = this._loadSingleImage(this, 'img_')
        this.elImage = img
        imageDiv.appendChild(img)
        //
        this._createVideoPlayers();
    }

    showLayout()
    {
        if (undefined == this.layoutCreated)
        {
            this.layoutCreated = true
            this._addLayoutLines(this.imageDiv)
        }
    }

    _addLayoutLines(imageDiv)
    {
        if (this.type != "regular" || undefined == this.layout) return

        var x = this.layout.offset
        var colWidth = this.layout.columnWidth
        var colWidthInt = Math.round(this.layout.columnWidth)
        var gutterWidth = this.layout.gutterWidth
        for (var i = 0; i < this.layout.numberOfColumns; i++)
        {
            const colDiv = document.createElement("div");
            colDiv.className = "layoutColDiv layouLineDiv";
            colDiv.style.left = Math.trunc(x) + "px";
            colDiv.style.top = "0px";
            colDiv.style.width = colWidthInt + "px";
            colDiv.style.height = this.height + "px";

            this.linksDiv.appendChild(colDiv);
            x += colWidth + gutterWidth;
        }

        for (var y = 0; y < this.height; y += 5)
        {
            const colDiv = document.createElement("div");
            colDiv.className = "layoutRowDiv layouLineDiv";
            colDiv.style.left = "0px";
            colDiv.style.top = y + "px";
            colDiv.style.width = this.width + "px";
            colDiv.style.height = "1px";

            this.linksDiv.appendChild(colDiv);
        }
    }


    /*------------------------------- INTERNAL METHODS -----------------------------*/

    // Try to find a first page and link which has a link to this page
    _getSrcPageAndLink()
    {
        let res = null
        for (var page of story.pages)
        {
            res = this._getLinkByTargetPage(page, page.links, this.index)
            if (res) return res
            for (var panel of page.fixedPanels)
            {
                res = this._getLinkByTargetPage(page, panel.links, this.index)
                if (res) return res
            }
        }
        return null
    }

    _getLinkByTargetPage(page, links, targetPageIndex)
    {
        const foundLink = null;
        links.forEach((link) =>
        {
            if (link.reactions.find(r => r.frameIndex == targetPageIndex)) foundLink = foundLinklink;
        })
        if (!foundLink) return null
        return {
            link: foundLink,
            page: page
        }
    }



    _getLinkByIndex(index)
    {
        var link = this._getLinkByIndexInLinks(index, this.links)
        if (link != null) return link
        for (var panel of this.fixedPanels)
        {
            link = this._getLinkByIndexInLinks(index, panel.links)
            if (link != null) return link
        }
        return null
    }

    _getLinkByIndexInLinks(index, links)
    {
        var found = links.find(function (el)
        {
            return el.index == index
        })
        return found != undefined ? found : null
    }


    _loadSingleImage(sizeSrc, idPrefix, namePrefix = "")
    {
        var unCachePostfix = 100000001 == story.docVersion ? "" : ("?" + story.docVersion)

        const img = document.createElement('img');
        img.id = idPrefix + this.index;
        img.setAttribute("class", "pageImage");
        img.style.width = sizeSrc.width + "px";
        img.style.height = sizeSrc.height + "px";
        img.onload = function ()
        {
            pagerMarkImageAsLoaded()
        };
        img.src = encodeURIComponent(viewer.files) + '/' + namePrefix + (sizeSrc.imageFixedLess ? sizeSrc.imageFixedLess : encodeURIComponent(sizeSrc.image)) + unCachePostfix;
        return img;
    }

    // panel: ref to panel or this
    _createLinks(panel)
    {
        var linksDiv = panel.linksDiv

        for (var link of panel.links)
        {
            link.panel = panel
            let x = link.rect.x + (link.isParentFixed ? panel.x : 0)
            let y = link.rect.y + (link.isParentFixed ? panel.y : 0)

            // Pre-find timeout interaction
            const timeOutReaction = link.reactions.find(r => r.trigger === "AFTER_TIMEOUT");
            if (timeOutReaction === "AFTER_TIMEOUT")
            {
                x = 0;
                y = 0;
                link.rect.x = 0;
                link.rect.y = 0;
                link.rect.width = 0;
                link.rect.height = 0;
            }

            const a = document.createElement("a");
            a.setAttribute("lpi", this.index);
            a.setAttribute("li", link.index);
            a.setAttribute("lppi", "fixedPanels" in panel ? -1 : panel.index);
            a.setAttribute("lpx", x);
            a.setAttribute("lpy", y);

            // scan other reactuonbs            
            for (var reaction of link.reactions)
            {
                var eventType = Constants.TRIGGER_ON_CLICK

                if ('frameIndex' in reaction)
                {
                    var destPageIndex = viewer.getPageIndex(parseInt(reaction.frameIndex))
                    var destPage = story.pages[destPageIndex];
                    //
                    if (reaction.trigger === "ON_HOVER")
                    {
                        eventType = Constants.TRIGGER_ON_HOVER
                        destPage.overlayByEvent = Constants.TRIGGER_ON_HOVER
                    } else if ('overlay' == destPage.type)
                    {
                        eventType = destPage.overlayByEvent
                    }
                }

                if (EVENT_HOVER == eventType)
                { // for Mouse over event
                    a.addEventListener("mouseenter", handleLinkEvent);
                    if
                        (
                        (Constants.FRAME_OVERLAY_PIN_HOTSPOT == reaction.overlayPinType) // FRAME_OVERLAY_PIN_HOTSPOT
                        && (3 == reaction.overlayPinHotspot) //FRAME_OVERLAY_PIN_HOTSPOT_TOP_LEFT
                    )                    
                    {
                    } else
                    {
                        // need to pass click event to overlayed layers
                        a.addEventListener("click", function (e)
                        {
                            if (undefined == e.originalEvent) return
                            var nextObjects = document.elementsFromPoint(e.originalEvent.x, e.originalEvent.y);
                            for (var i = 0; i < nextObjects.length; i++)
                            {
                                var obj = nextObjects[i].parentElement
                                if (!obj || obj.nodeName != 'A' || obj == this) continue
                                obj.click(e);
                                return
                            }
                        });
                    }
                } else if (reaction.trigger === "AFTER_TIMEOUT")
                {
                    this.linkTimeout = link;
                } else
                {
                    // for On click event                              
                    a.addEventListener("click", handleLinkEvent);
                }
                // we need the only first reaction
                // the second will be handled in handleLinkEvent_Final()
                break;
            }

            linksDiv.appendChild(a);
            link.a = a

            var linkDiv = document.createElement("div");
            linkDiv.className = (EVENT_HOVER == eventType ? "linkHoverDiv" : "linkDiv") + (story.highlightHotspot ? " linkDivHighlight" : "");
            linkDiv.style.left = link.rect.x + "px";
            linkDiv.style.top = link.rect.y + "px";
            linkDiv.style.width = link.rect.width + "px";
            linkDiv.style.height = link.rect.height + "px";

            a.appendChild(linkDiv);
            link.div = linkDiv;

        }
    }
}

//
// customEvent:
//  x,y,pageIndex
function handleLinkEvent(event, customEvent = undefined, reactionIndex = 0, obj = undefined)
{
    if (event) event.stopPropagation();
    if (viewer.linksDisabled) return false
    if (!obj) obj = this
    let currentPage = viewer.currentPage
    if (reactionIndex === 0) currentPage.currentAnimReaction = undefined;

    var customData = customEvent || viewer["customEvent"]
    let orgPage = customData ? story.pages[customData.pageIndex] : story.pages[parseInt(obj.getAttribute("lpi"), 10)];

    const linkIndex = customData ? customData.linkIndex : parseInt(obj.getAttribute("li"), 10);
    const link = orgPage._getLinkByIndex(linkIndex)

    // Check if we have a reaction with requested index
    if (link.reactions.length <= reactionIndex) return false;
    const reaction = link.reactions[reactionIndex];

    if (reaction.frameIndex != undefined)
    {
        var destPageIndex = parseInt(reaction.frameIndex)
        var linkParentFixed = "overlay" != orgPage.type ? link.isParentFixed : orgPage.inFixedPanel

        var destPage = story.pages[destPageIndex]
        if (!destPage) return

        if (reaction.transAnimType != Constants.FRAME_TRANS_ANIM_NONE)
        {
            destPage.currentTransAnimReaction = reaction;
        }

        if (reaction.navigationType === "SWAP")
        {
            const orgLink = {
                orgPage: orgPage,
                index: linkIndex,
                fixedPanelIndex: customData ? undefined : parseInt(obj.getAttribute("lppi")),
                this: this,
                x: customData ? customData.x : parseInt(obj.getAttribute("lpx")),
                y: customData ? customData.y : parseInt(obj.getAttribute("lpy")),
                width: link.rect.width,
                height: link.rect.height,
            }
            if (orgPage.type == "modal")
            {
                viewer.goTo(destPage.index);
            } else
            {
                destPage.showAsOverlayInCurrentPage(orgPage, orgLink, reaction, orgPage.currentX, orgPage.currentY, linkParentFixed)
            }
        } else if ('overlay' == destPage.type)
        {
            const orgLink = {
                orgPage: orgPage,
                index: linkIndex,
                fixedPanelIndex: customData ? undefined : parseInt(obj.getAttribute("lppi")),
                this: this,
                x: customData ? customData.x : parseInt(obj.getAttribute("lpx")),
                y: customData ? customData.y : parseInt(obj.getAttribute("lpy")),
                width: link.rect.width,
                height: link.rect.height,
            }
            if (orgLink.fixedPanelIndex >= 0)
            {
                orgLink.panel = currentPage.fixedPanels[orgLink.fixedPanelIndex]
            }

            // check if link in fixed panel aligned to bottom
            if (linkParentFixed && destPage.overlayAlsoFixed && orgLink.fixedPanelIndex >= 0 && currentPage.fixedPanels[orgLink.fixedPanelIndex].constrains.bottom && !currentPage.fixedPanels[orgLink.fixedPanelIndex].constrains.top)
            {
                orgLink.fixedBottomPanel = currentPage.fixedPanels[orgLink.fixedPanelIndex]
            } else
            { // clicked not from fixed panel           
                const pinHotspot = Constants.FRAME_OVERLAY_PIN_HOTSPOT == reaction.overlayPinType
                const pinPage = Constants.FRAME_OVERLAY_PIN_PAGE == reaction.overlayPinType

                var pageX = 0
                var pageY = 0

                if (pinHotspot)
                {
                    //////////////////////////////// PIN TO HOTSPOT ////////////////////////////////
                    // clicked from some other overlay
                    if ('overlay' == orgPage.type)
                    {
                        orgLink.x += orgPage.currentX
                        orgLink.y += orgPage.currentY
                    }
                    pageX = orgLink.x
                    pageY = orgLink.y

                    var offsetX = pinHotspot
                        && (
                            Constants.FRAME_OVERLAY_PIN_HOTSPOT_UNDER_LEFT == reaction.overlayPinHotspot
                            || Constants.FRAME_OVERLAY_PIN_HOTSPOT_UNDER_CENTER == reaction.overlayPinHotspot
                            || Constants.FRAME_OVERLAY_PIN_HOTSPOT_UNDER_RIGHT == reaction.overlayPinHotspot
                        )
                        ? 5 : 0

                    if (destPage.overlayClosePrevOverlay && ('overlay' == orgPage.type))
                    {
                        pageX = orgPage.currentX
                        pageY = orgPage.currentY
                    } else if (pinHotspot && Constants.FRAME_OVERLAY_PIN_HOTSPOT_UNDER_LEFT == reaction.overlayPinHotspot)
                    {
                        pageY += link.rect.height
                    } else if (pinHotspot && Constants.FRAME_OVERLAY_PIN_HOTSPOT_UNDER_CENTER == reaction.overlayPinHotspot)
                    {
                        pageX += parseInt(orgLink.width / 2) - parseInt(destPage.width / 2)
                        pageY += link.rect.height
                    } else if (pinHotspot && Constants.FRAME_OVERLAY_PIN_HOTSPOT_UNDER_RIGHT == reaction.overlayPinHotspot)
                    {
                        pageX += orgLink.width - destPage.width
                        pageY += link.rect.height
                    } else if (pinHotspot && Constants.FRAME_OVERLAY_PIN_HOTSPOT_TOP_LEFT == reaction.overlayPinHotspot)
                    {
                    } else if (pinHotspot && Constants.FRAME_OVERLAY_PIN_HOTSPOT_TOP_CENTER == reaction.overlayPinHotspot)
                    {
                        pageX += parseInt(orgLink.width / 2) - parseInt(destPage.width / 2)
                        //pageY -= destPage.height                            
                    } else if (pinHotspot && Constants.FRAME_OVERLAY_PIN_HOTSPOT_TOP_RIGHT == reaction.overlayPinHotspot)
                    {
                        pageX += orgLink.width - destPage.width
                        //pageY = pageY - destPage.height                            
                    } else if (pinHotspot && Constants.FRAME_OVERLAY_PIN_HOTSPOT_BOTTOM_RIGHT == reaction.overlayPinHotspot)
                    {
                        pageX += orgLink.width
                    } else if (pinHotspot && Constants.FRAME_OVERLAY_PIN_HOTSPOT_UP_CENTER == reaction.overlayPinHotspot)
                    {
                        pageX += parseInt(orgLink.width / 2) - parseInt(destPage.width / 2)
                        pageY -= destPage.height
                    } else
                    {
                        if (reaction.overlayPinHotspot === Constants.FRAME_OVERLAY_PIN_HOTSPOT_RELATIVE)
                        {
                            pageX += reaction.overlayPinHotspotX
                            pageY += reaction.overlayPinHotspotY

                        }
                    }

                    // check page right side
                    if (!pinHotspot || (Constants.FRAME_OVERLAY_PIN_HOTSPOT_TOP_LEFT != reaction.overlayPinHotspot))
                    {
                        const fullWidth = destPage.width + offsetX // + (('overlayShadowX' in destPage)?destPage.overlayShadowX:0)
                        if ((pageX + fullWidth) > currentPage.width)
                            pageX = currentPage.width - fullWidth

                        /*if(linkPosX < (offsetX + (('overlayShadowX' in destPage)?destPage.overlayShadowX:0))){  
                            linkPosX = offsetX + (('overlayShadowX' in destPage)?destPage.overlayShadowX:0)
                        }*/
                    }
                } else
                {
                    //////////////////////////////// PIN TO PAGE ////////////////////////////////
                    if (pinPage) [pageX, pageY] = _calcOverlayPos(currentPage, destPage, reaction.overlayPinPagePositionType)

                }

                if (pageX < 0) pageX = 0
                if (pageY < 0) pageY = 0
            }

            if (destPage.visible)
            {
                const sameLink = destPage.currentLink.index == orgLink.index
                if (sameLink)
                {
                    destPage.hide()
                } else
                {
                    destPage.hide(false, true) // hide without transition animation
                    if (orgPage != destPage)
                        destPage.showAsOverlayInCurrentPage(orgPage, orgLink, reaction, pageX, pageY, linkParentFixed, true)
                }
                return false
            }
            destPage.showAsOverlayInCurrentPage(orgPage, orgLink, reaction, pageX, pageY, linkParentFixed)
            return handleLinkEvent(event, undefined, reactionIndex + 1, obj);
        } else
        {
            // close modal if some link inside a modal opens the same modal
            if (destPageIndex == currentPage.index && currentPage.type === "modal")
            {
                viewer.closeModal()
                return false
            }

            // check if we need to close current overlay
            currentPage.hideCurrentOverlays()

            viewer.goTo(parseInt(destPageIndex), true, link)
            return handleLinkEvent(event, undefined, reactionIndex + 1, obj);
        }
    } else if (reaction.action === 'BACK')
    {
        viewer.currentPage.hideCurrentOverlays()
        viewer.goBack()
        return handleLinkEvent(event, undefined, reactionIndex + 1, obj);
    } else if (reaction.action === 'CLOSE')
    {
        if (orgPage.type === "modal")
        {
            viewer.closeModal()
        } else
        {
            orgPage.hide()
        }
        return handleLinkEvent(event, undefined, reactionIndex + 1, obj);
    } else if (reaction.url != null)
    {
        viewer.currentPage.hideCurrentOverlays()
        var target = event && event.metaKey ? "_blank" : reaction.target
        const extURL = viewer.convFigmaURL(reaction.url);
        //
        if (typeof extURL == "string" && extURL.includes("//"))
        { // Redirect to some URL
            window.open(extURL, target != undefined ? target : "_self")
        } else if (typeof extURL == "number")
        {
            viewer.goTo(extURL);
        } else
            if (extURL !== "")            
            { // Go to a local page
                var index = viewer.getPageIndex(extURL, null);
                if (index !== null)
                    viewer.goTo(index)
                else
                    console.log(`Can't find page by name "${extURL}"`)
            }
        return handleLinkEvent(event, undefined, reactionIndex + 1, obj);
    }

    // close last current overlay if it still has parent
    if ('overlay' == orgPage.type && undefined != orgPage.parentPage)
    {
        orgPage.hide()
    }

    return handleLinkEvent(event, undefined, reactionIndex + 1, obj);
}


function _calcOverlayPos(currentPage, destPage, overlayPinPage)
{
    let pageX = 0, pageY = 0
    //////////////////////////////// PIN TO PAGE ////////////////////////////////
    const padX = 0
    const padY = 0
    if (Constants.FRAME_OVERLAY_PIN_PAGE_TOP_LEFT == overlayPinPage)
    {
        pageX = padX
        pageY = padY
    } else if (Constants.FRAME_OVERLAY_PIN_PAGE_TOP_CENTER == overlayPinPage)
    {
        pageX = parseInt(currentPage.width / 2) - parseInt(destPage.width / 2)
        pageY = padY
    } else if (Constants.FRAME_OVERLAY_PIN_PAGE_TOP_RIGHT == overlayPinPage)
    {
        pageX = currentPage.width - destPage.width - padX
        pageY = padY
    } else if (Constants.FRAME_OVERLAY_PIN_PAGE_CENTER == overlayPinPage)
    {
        pageX = parseInt(currentPage.width / 2) - parseInt(destPage.width / 2)
        pageY = parseInt(currentPage.height / 2) - parseInt(destPage.height / 2)
    } else if (Constants.FRAME_OVERLAY_PIN_PAGE_BOTTOM_LEFT == overlayPinPage)
    {
        pageX = padX
        pageY = currentPage.height - destPage.height - padY
    } else if (Constants.FRAME_OVERLAY_PIN_PAGE_BOTTOM_CENTER == overlayPinPage)
    {
        pageX = parseInt(currentPage.width / 2) - parseInt(destPage.width / 2)
        pageY = currentPage.height - destPage.height - padY
    } else if (Constants.FRAME_OVERLAY_PIN_PAGE_BOTTOM_RIGHT == overlayPinPage)
    {
        pageX = currentPage.width - destPage.width - padX
        pageY = currentPage.height - destPage.height - padY
    }
    return [pageX, pageY]
}
