const ICON_TAG = "Icon" // Use this string to find icon symbol
const ICON_TAG2 = "ic-" // Use this string to find icon symbol
const SUPPORT_TYPES = ["Text", "ShapePath", "Image", "ImageSymbol", "Symbol"]

class SymbolViewer extends AbstractViewer
{
    constructor()
    {
        super("symbol_viewer")
        //
        this.preventCustomTextSearch = true
        //
        this.loaded = false
        this.data = undefined
        //
        this.createdPages = {}
        //this.symbolIDs = {} // layer indexes ( in pages[].layers ) of symbols
        this.selected = null
        this.showSymbols = false
        this.insideExpViewer = false
        this.highlightWidgetName = null
    }

    initialize(force = false)
    {
        if (!super.initialize(force)) return

        // populate library select
        const libSelect = bySel('#symbol_viewer #lib_selector');

        const autoOpt = document.createElement("option");
        autoOpt.text = "Library autoselection";
        libSelect.add(autoOpt);

        for (const libName of Object.keys(this.getDataSymbolsDict))
        {
            const libOpt = document.createElement("option");
            libOpt.text = libName;
            libOpt.value = libName;
            libSelect.add(libOpt);
        }
        libSelect.addEventListener("change", function ()
        {
            var libName = this.options[this.selectedIndex].value;
            viewer.symbolViewer._selectLib(libName)

        })
        //
        const symCheck = byId('symbol_viewer_symbols');
        symCheck.addEventListener("click", function ()
        {
            viewer.symbolViewer._setSymCheck(this.checked)

        })
    }

    _setSymCheck(showSymbols)
    {
        this.showSymbols = showSymbols;
        toggleClass(byId('lib_selector'));
        this._reShowContent()

    }
    // return null or ref to unserialized handoff.json
    getData()
    {
        if (!story.cloud) return symbolData
        //
        if (this.loaded) return this.data
        this.loaded = true
        this.data = {}
        //
        var request = new XMLHttpRequest();
        request.open("GET", `data/handoff.json`, false);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        request.send(null);
        if (request.status === 200)
        {
            const data = JSON.parse(request.responseText)
            if (data["error"] !== undefined)
            {
                console.log("Got error: " + data["error"])
                return this.data
            } else
                this.data = data
        } else
        {
            console.log("Can't loaded data/handoff.json")
            return this.data
        }
        return this.data
    }
    getDataSymbolsDict()
    {
        const data = this.getData()
        return data.symbolsDict
    }
    // called by Viewer
    pageChanged()
    {
        this._reShowContent()
    }

    _reShowContent()
    {
        delete this.createdPages[viewer.currentPage.index]

        // remove existing symbol links        
        this.page.linksDiv.querySelectorAll(".modalSymbolLink,.symbolLink").forEach(el => el.remove());
        for (const panel of this.page.fixedPanels)
        {
            panel.linksDiv.querySelectorAll(".modalSymbolLink,.symbolLink").remove();
        }

        // drop selection
        this.setSelected()

        // rebuild links
        this._buildElementLinks()

        // redraw inspector
        this._showEmptyContent()

    }


    toggle()
    {
        return this.visible ? this.hide() : this.show()
    }

    hide()
    {
        super.hide()
        if (this.insideExpViewer)
        {
            this.insideExpViewer = false
            viewer.expViewer.show()
        }
        this.highlightWidgetName = null
    }

    showFromExpViewer(highlightWidgetName = null)
    {
        this.insideExpViewer = true
        this.highlightWidgetName = highlightWidgetName
        this.show()
    }

    _hideSelf()
    {
        var isModal = viewer.currentPage && viewer.currentPage.type === "modal"
        if (isModal)
        {
            byClassAll("modalSymbolLink").forEach(el => el.remove());
            delete this.createdPages[viewer.currentPage.index]
        }
        removeClass(byId(isModal ? 'content-modal' : 'content'), "contentSymbolsVisible");

        viewer.linksDisabled = false
        addClass(byId("symbol_viewer"), "hidden");

        this.setSelected()
        super._hideSelf()
    }

    onContentClick()
    {
        // this.setSelected() /. We don;t neet it really
        return true
    }

    handleKeyDown(event)
    {
        if (77 == event.which)
        { // m
            // Key "M" eactivates Symbol Viewer
            this.toggle()
        } else
        {
            return super.handleKeyDown(event)
        }

        event.preventDefault()
        return true
    }

    handleKeyDownWhileInactive(event)
    {
        if (77 == event.which)
        { // m
            // Key "M" activates Symbol Viewer
            this.toggle()
        } else
        {
            return super.handleKeyDownWhileInactive(event)
        }

        event.preventDefault()
        return true
    }

    _showSelf()
    {
        if (!this.inited) this.initialize()

        viewer.toogleHightlighSpots(false)
        viewer.toogleLayout(false)
        viewer.linksDisabled = true

        this._buildElementLinks()

        var isModal = viewer.currentPage && viewer.currentPage.type === "modal"
        const contentDiv = isModal ? byId("content-modal") : byId("content");
        addClass(contentDiv, "contentSymbolsVisible");

        this._showEmptyContent()
        removeClass(byId('symbol_viewer'), "hidden");

        super._showSelf()

    }

    _showEmptyContent()
    {
        const content = byId("symbol_viewer_content");
        content.innerHTML = "";

        const div = document.createElement("div");
        div.id = "empty";
        div.className = "panel";
        div.innerHTML = story.experimentalExisting ?
            "Click any element to inspect1.<br/>EXPERIMENTAL widgets are in <span style='color:orange'>orange</span>." :
            "Click any element to inspect";
        content.appendChild(div);
    }


    _buildElementLinks()
    {
        this._buildElementLinksForPage(viewer.currentPage)
        for (let overlay of viewer.currentPage.currentOverlays)
        {
            this._buildElementLinksForPage(overlay)
        }
    }


    _buildElementLinksForPage(page)
    {
        var pageIndex = page.index
        this.pageIndex = pageIndex
        this.page = page
        if (!(pageIndex in this.createdPages))
        {
            const newPageInfo = {
                layerArray: [],
                siLayerIndexes: {}
            }
            // cache only standalone pages
            this.createdPages[pageIndex] = newPageInfo

            this.pageInfo = newPageInfo
        } else
        {
            this.pageInfo = this.createdPages[pageIndex]
        }
        //
        if (this.pageInfo.layerArray.length === 0)
        {
            const data = this.getData()
            if (data === null) return
            const layers = data.layers[this.pageIndex].c
            if (undefined != layers)
            {
                if (this.showSymbols)
                    this._processSymbolList(layers)
                else
                    this._processLayerList(layers)
            }
            this.pageInfo.layerArray.reverse()
            this.pageInfo.layerArray.sort(function (a, b)
            {
                return (a.tp !== "Text" && b.tp === "Text") ? 1 :

                    ((a.tp === "Text" && b.tp !== "Text") ? -1 : 0)

            })
            //const len = this.pageInfo.layerArray.length - 1
            this.pageInfo.layerArray.forEach((l, index) => l.infoIndex = index)
        }
        this.pageInfo.layerArray.forEach(l => viewer.symbolViewer._showElement(l))
        //
    }

    _processSymbolList(layers, isParentSymbol = false)
    {
        for (var l of layers.slice().reverse())
        {
            // l.s: component name
            if (l.s)
            {
                this._addInfoElement(l)
            }
            // l.c : childs
            if (undefined != l.c)
                this._processSymbolList(l.c, l.s != undefined)
        }
    }

    _processLayerList(layers, sSI = null)
    {
        for (var l of layers.slice().reverse())
        {
            const isIcon = l.s && l.s.indexOf(ICON_TAG) > 0;
            if (isIcon || (SUPPORT_TYPES.indexOf(l.tp) >= 0))
            {
                this._addInfoElement(l, sSI)
            }
            // don't go deep inside an icon
            if (isIcon) continue
            // process childs
            if (undefined != l.c)
                this._processLayerList(l.c, "SI" == l.tp ? l : sSI)
        }
    }

    _addInfoElement(l, siLayer = null)
    {
        var currentPanel = this.page
        l.finalX = l.x
        l.finalY = l.y

        for (const panel of this.page.fixedPanels)
        {
            if (l.x >= panel.x && l.y >= panel.y &&
                ((l.x + l.w) <= (panel.x + panel.width)) && ((l.y + l.h) <= (panel.y + panel.height))
            )
            {
                l.finalX = l.x - panel.x
                l.finalY = l.y - panel.y
                currentPanel = panel
                break
            }
        }
        l.parentPanel = currentPanel

        // Check if layer is empty
        if ("Text" == l.tp)
        {
            if ("" == l.tx.trim()) return
        }

        // also push symbol instance to a list of layers (if was not aded before)        
        let indexOfSO = -1
        if (siLayer)
        {
            if (siLayer.s in this.pageInfo.siLayerIndexes)
            {
                indexOfSO = this.pageInfo.siLayerIndexes[siLayer.s]
            } else
            {
                indexOfSO = this.pageInfo.layerArray.length
                this.pageInfo.layerArray.push(siLayer)
            }
        }
        //
        l.indexOfSO = indexOfSO
        l.infoIndex = this.pageInfo.layerArray.length
        this.pageInfo.layerArray.push(l)
    }

    _showElement(l, siLayer = null)
    {
        const a = document.createElement("a");
        a.className = viewer.currentPage.type === "modal" ? "modalSymbolLink" : "symbolLink";
        a.style.zIndex = this.pageInfo.layerArray.length - l.infoIndex;
        a.setAttribute("pi", this.pageIndex);
        a.setAttribute("li", l.infoIndex);
        a.setAttribute("si", l.indexOfSO);

        /*
        var a1 = ("<a>", {
            class: viewer.currentPage.type === "modal" ? "modalSymbolLink" : "symbolLink",
            pi: this.pageIndex,
            li: l.infoIndex,
            si: l.indexOfSO,
            style: `z-index:${this.pageInfo.layerArray.length - l.infoIndex};`
        })
        */
        a.addEventListener("click", function (event)
        {
            const sv = viewer.symbolViewer;
            const pageIndex = this.getAttribute("pi");
            const layerIndex = this.getAttribute("li");
            const siLayerIndex = this.getAttribute("si");
            const pageInfo = sv.createdPages[pageIndex]
            let topLayer = pageInfo.layerArray[layerIndex]
            const siLayer = siLayerIndex >= 0 ? pageInfo.layerArray[siLayerIndex] : null

            sv.setSelected(event, topLayer)
            if (!sv.selected)
            {
                return false
            }
            const layer = sv.selected.layer // selection can be changed inside setSelected

            var symName = layer.s ? layer.s : (siLayer ? siLayer.s : null)
            //sv.showSymbols && layer.s ? layer.s : (siLayer ? siLayer.s : null)
            var styleName = layer.l

            const styleInfo = styleName != undefined ? viewer.symbolViewer._findStyleAndLibByStyleName(styleName) : undefined
            const symInfo = symName != undefined ? viewer.symbolViewer._findSymbolAndLibBySymbolName(symName) : undefined

            sv.docLinkAdded = false
            var info = ""
            // layer.b : shared library name, owner of style or symbol
            // layer.s : symbol name
            // layer.l : style name
            // layer.tp : layer type: SI, Text, ShapePath or Image
            // siLayer : symbol master, owner of the layer            

            // if layer has CSS classes described
            let decRes = undefined
            if (layer.pr != undefined)
            {
                let tokens = null
                if (styleInfo) tokens = styleInfo.style.tokens
                if (symInfo)
                {
                    const foundLayer = symInfo.symbol.layers[layer.n]
                    if (foundLayer)
                    {
                        if (null == tokens)
                            tokens = foundLayer.tokens
                        else
                            tokens = sv._mergeTokens(tokens, foundLayer.tokens)
                    }
                }
                decRes = sv._decorateCSS(layer, tokens, layer.b ? layer : siLayer)
            }

            info += sv._showLayerDimensions(layer)
            info += sv._showLayerSymbol(layer, symName, siLayer)
            info += sv._showLayerAutoLayout(layer)
            info += sv._showLayerComment(layer, siLayer)
            info += sv._showLayerText(layer, siLayer, decRes)
            info += sv._showLayerFrame(layer, siLayer, decRes)

            // if layer has CSS classes described
            if (decRes) info += decRes.css

            // Process image layar
            if ("Image" == layer.tp)
            {
                info += sv._showLayerImage(layer)
            }

            byId("symbol_viewer_content").innerHTML = info;
            removeClass(byId("symbol_viewer_content"), "hidden");

            //alert(info)
            return false
        });

        const pdiv = l.parentPanel.linksDiv;
        pdiv.insertBefore(a, pdiv.children[0]);

        ///
        const highlight = siLayer && siLayer.s && (
            (this.highlightWidgetName === null && siLayer.s.includes("EXPERIMENTAL")) ||
            (this.highlightWidgetName !== null && siLayer.s.includes(this.highlightWidgetName))
        )

        const div = new StageDiv(l.finalX, l.finalY, l.w, l.h, "symbolDiv")
        if (highlight) div.class += " exp"
        const symbolDiv = div.elDiv()

        symbolDiv.addEventListener("mouseenter", function ()
        {
            viewer.symbolViewer.mouseEnterLayerDiv(symbolDiv)
        });
        a.appendChild(symbolDiv);
    }



    _mergeTokens(list1, list2)
    {
        let adding = []
        list2.forEach(function (t2)
        {
            const res1 = list1.filter(t1 => t1[0] == t2[0])
            if (!res1.length) adding.push(t2)
        })
        if (adding.length)
            return list1.concat(adding)
        else
            return list1
    }



    _showLayerSymbol(layer, symName, siLayer)
    {
        if (undefined == symName) return ""
        // Drop path to icon, leave only name
        let categoryName = "Component"
        const iconTagPos = layer.n.indexOf(ICON_TAG)
        this.currLayerIsIcon = iconTagPos >= 0
        if (this.currLayerIsIcon)
        {
            const FIND_STR = "Name="
            if (symName.includes(FIND_STR))
            {
                symName = symName.split("=")[1]
                categoryName = "Icon"
            }
        }
        const libName = layer.r ? "Team library" : "Local";
        //
        let info = `
        <hr>
        <div class="panel">
            <div class="label">${symName}</div>
            <div class="descr">${libName}</div>
        `
        // Show variant values
        if (layer.cv && layer.cv.length)
        {
            layer.cv.forEach(v =>
            {
                info += `
                <div class="fieldset">
                    <span class="label">${v.n}</span>                
                    <span class="value">${v.v}</span>
                </div> 
                `
            })
        }
        info += `
        </div>
        `
        return info
    }

    _showExtDocRef(layer, symName, siLayer)
    {
        const emptyRes = ""
        if (this.docLinkAdded) return emptyRes
        if (undefined == layer.b && (undefined == siLayer || undefined == siLayer.b)) return emptyRes
        //
        let href = undefined
        let name = ""
        let parts = symName.split("/")

        const libName = layer.b ? layer.b : siLayer.b
        //  check if library has a dictionary file
        if (!(libName in this.getDataSymbolsDict())) return emptyRes

        const attrs = this.getDataSymbolsDict()[libName].attrs
        // check if dictionary file has attrs defined
        if (undefined == attrs) return emptyRes

        while (parts.length)
        {
            name = parts.join("/")
            if (name in attrs)
            {
                href = attrs[name]["ext-doc-href"]
                if (undefined != href)
                {
                    break
                }
            }
            parts.pop()
        }
        if (!href) return emptyRes
        //        
        name = name.replace("_atoms/", "")
        if (href.toLowerCase().includes("experimental") && !name.toLowerCase().includes("experimental")) name += "-EXPERIMENTAL"
        this.docLinkAdded = true
        return `
                <hr>
                <div class="panel">
                    <div class="label">Documentation</div>
                    <div style="value"><a href="${href}" target="_blank">${name}</a></div>
                </div>`
    }

    _showLayerComment(layer, siLayer)
    {
        var comment = layer.comment
        if (comment === undefined && siLayer != undefined) comment = siLayer.comment
        if (comment === undefined) return ""

        return `
                <hr>
                <div class="panel">
                    <div class="label">Comment</div>
                    <div style="value">${comment}</div>
                </div>`
    }

    _showLayerImage(layer)
    {
        let info = ""
        const url = layer.iu
        info += `
                <hr>
                <div class='block'>
                <div class='label'>Image Content&nbsp;<a class="svlink" href="`+ url + `">Download</a>`
        let cssClass = "code value"
        const width = "100%" //viewer.defSidebarWidth - 40
        info += `</div><div id='sv_content' class="` + cssClass + `"><img ` + `width="` + width + `" src="` + url + `"/></div>`
        return info
    }

    // siLayer: parent symbol 
    _showLayerText(layer, siLayer, cssInfo)
    {
        if (layer.tp !== "Text") return ""

        function fieldHtml(label, value)
        {
            if (label === undefined || value === undefined) return ""
            return `            
            <div class="fieldset">
                <span class="label">${label}</span>                
                <span class="value">${value}</span>
            </div>                                        
            `
        }

        let info = `
        <hr>
        <div class="panel">
            <div class="label">Text</div>
        `

        // Show text style
        if (layer.tsi !== undefined && layer.tsi !== "")
        {
            const data = this.getData()
            if (data === null) return
            //
            const styleInfo = data.styles[layer.tsi]
            if (styleInfo)
            {
                let styleName = styleInfo.name
                info += fieldHtml("Style", styleName)
            }
        }

        if (cssInfo)
        {
            info += fieldHtml("Font", cssInfo.styles["font-family"])
            info += fieldHtml("Weight", cssInfo.styles["font-weight"])
            info += fieldHtml("Size", cssInfo.styles["font-size"])
            info += fieldHtml("Letter", cssInfo.styles["letter-spacing"])
        }


        // Show text content
        if (layer.tx !== "")
        {
            info += `
                <div class= "fieldset">        
                <span class="label">Content</span>
                <span class="value"><button style="width:60px;" onclick = "copyToBuffer('sv_content')">Copy</button></span>
            </div>
                <div>
                    <span class="text" id="sv_content">${layer.tx}</span>
                </div>
            `
        }

        info += `
        </div>
                `
        return info
        //return this._showExtDocRef(layer, styleName, siLayer) + info
    }



    // siLayer: parent symbol 
    _showLayerFrame(layer, siLayer, cssInfo)
    {
        if (cssInfo === undefined || cssInfo === "") return ""
        let info = ""

        function colorHtml(value, styleIndex = undefined)
        {
            if (value === undefined) return ""
            if (Array.isArray(value))
            {
                let res = ""
                value.forEach(s => res += colorHtml(s))
                return res
            }
            //
            const data = viewer.symbolViewer.getData()
            if (data === null) return
            //
            const styleInfo = styleIndex !== undefined ? data.styles[styleIndex] : null
            return `            
            <div class="colorset">
                <span class="color" style="background-color:${value}">&nbsp;</span>                
                <span class="value">
                    ${styleInfo != null ? (styleInfo.name + " / ") : ""}
                    ${value}
                </span>
            </div>
            `
        }

        if (cssInfo.styles["background-color"] !== undefined)
        {
            info += `
                <hr/>
                <div class="panel">
                    <div class="label">${layer.tp !== "Text" ? "Backgrounds" : "Colors"}</div>
                    ${colorHtml(cssInfo.styles["background-color"], layer.fsi)}
                </div>
            `}
        if (cssInfo.styles["border-color"] !== undefined)
        {
            info += `
                <hr/>
                <div class="panel">
                    <div class="label">Borders</div>
                    ${colorHtml(cssInfo.styles["border-color"], layer.ssi)}
                </div>
            `}
        return info
    }

    _showLayerDimensions(layer)
    {
        let info = ""

        var frameX = layer.finalX
        var frameY = layer.finalY
        var frameWidth = layer.w
        var frameHeight = layer.h
        const PADDING = 20;

        info += `
                <hr/>
                <div class="panel" style="position:relative;height:64px">
                    <div class="label">Frame</div>
                    <div class="field" style="position:absolute;top:30px;left:0px;">
                        <span class="label">X</span><span class="value">${Math.round(frameX)}</span>
                    </div>
                    <div class="field" style="position:absolute;top:30px;left:120px;">
                        <span class="label">Y</span><span class="value">${Math.round(frameY)}</span>
                    </div>
                    <div class="field" style="position:absolute;top:54px;left:0px;">
                        <span class="label">W</span><span class="value">${Math.round(frameWidth)}</span>
                    </div>
                    <div class="field" style="position:absolute;top:54px;left:120px;">
                        <span class="label">H</span><span class="value">${Math.round(frameHeight)}</span>
                    </div>
                </div>
            `
        return info
    }

    _showLayerAutoLayout(layer)
    {
        if (layer.al === undefined) return ""

        function fieldType(value, unit = "")
        {
            if (value === undefined) return ""
            return `
                <div class="segmentedCntrol" >            
                <div class='svIconContainer${value == "VERTICAL" ? " selected" : ""}'>
                    <svg class='uiIcon'>
                        <use xlink:href="#svDown"></use> 
                    </svg>
                </div>
                <div class='svIconContainer${value == "HORIZONTAL" ? " selected" : ""}'>
                    <svg class='uiIcon' >
                        <use xlink:href="#svRight"></use> 
                    </svg>
                </div>
            </div>
                `
        }
        function fieldItemsSpace(autoLayoutType, value, unit = "")
        {
            if (autoLayoutType === undefined || value === undefined) return ""
            return `
                <div class="segmentedCntrol" >
                    <div class='svIconContainer'>
                        <svg class="uiIcon">
                            <use xlink:href="#svItemsSpace${autoLayoutType === " VERTICAL" ? "V" : "H"}"></use>
                    </svg>                                                            
                </div>
                <span class="value">${value}${unit}</span>
            </div>
                `}
        function fieldPadding(icon, value, unit = "")
        {
            if (icon === undefined || value === undefined) return ""
            return `
                <div class="segmentedCntrol" >                           
                <div class='svIconContainer'>
                    <svg class="uiIcon">
                        <use xlink:href="#${icon}"></use > 
                    </svg>                                                            
                </div>
                <span class="value">${value}${unit}</span>
            </div>
                `}
        function fieldHtml(label, value, unit = "")
        {
            if (label === undefined || value === undefined) return ""
            return `
                <div class="fieldset" >
                <span class="label">${label}</span>
                <span class="value">${value}${unit}</span>
            </div>
        `}
        function fieldGrid(al)
        {
            //
            let icon = "#sv-AL-"
            if (al.paai === "SPACE_BETWEEN")
            {
                icon += "AUTO-" + al.m + "-" + al.caai
            } else
            {
                icon += al.m + "-" + al.caai + al.paai
            }
            //
            let s = `
            <div class=''>
                 <svg class="uiIcon64">
                    <use xlink:href="${icon}"></use>
                </svg> 
            </div>
            `
            //s += "</div>"
            return s
        }

        const al = layer.al
        const vert = al.m === "VERTICAL"
        const sizeAuto = al.paai === "SPACE_BETWEEN"
        let info = `
                <hr/>
                <div class="panel">
                    <div class="label">Auto layout</div>
                    <div class="fieldset" >
                        <div class="label">
                            ${fieldType(al.m)}
                            ${fieldItemsSpace(al.m, sizeAuto ? "Auto" : al.is, sizeAuto ? "" : "px")}
                        </div>            
                        <div class="value">
                            ${fieldGrid(al)}
                        </div>
                    </div>
                `

        if (al.pl === al.pr && al.pt === al.pb)
        {
            info += `
            <div class="row3">
                ${fieldPadding("PaddingH", al.pl, "px")}
                ${fieldPadding("PaddingV", al.pt, "px")}            
            </div>
                `
        } else
        {
            info += `
            <div class="row3">
                ${fieldPadding("PaddingHL", al.pl, "px")}
                ${fieldPadding("PaddingVT", al.pt, "px")}
            </div>
            <div class="row3">
                ${fieldPadding("PaddingHR", al.pr, "px")}
                ${fieldPadding("PaddingVB", al.pb, "px")}
            </div>
            `
        }

        info += `
                </div>
            `
        return info
    }

    setSelected(event = null, layer = null, force = false)
    {
        const prevClickedLayer = this.lastClickedLayer
        this.lastClickedLayer = layer
        //
        const click = event ? {
            x: event.offsetX * viewer.currentZoom + layer.finalX,
            y: event.offsetY * viewer.currentZoom + layer.finalY
        } : {}
        let foundLayers = []
        this.findOtherSelection(click, null, foundLayers)
        // reset previous selection                
        if (this.selected)
        {
            if (!force && event && layer)
            {
                if (foundLayers.length > 1)
                {
                    let newIndex = undefined
                    if (undefined != prevClickedLayer && layer.ii != prevClickedLayer.ii)
                    {
                        // clicked on an other layer, find its index
                        newIndex = foundLayers.indexOf(layer)
                    } else if (undefined != this.selectedLayerIndex)
                    {
                        // clicked on the some layer, but 
                        // we have several overlaped objects under a cursor, so switch to the next 
                        newIndex = (this.selectedLayerIndex + 1) >= foundLayers.length ? 0 : this.selectedLayerIndex + 1
                    } else
                    {
                        newIndex = foundLayers.indexOf(layer)
                    }
                    layer = foundLayers[newIndex]
                    this.selectedLayerIndex = newIndex
                }
            }
            this.selected.marginDivs.forEach(d => d.remove())
            this.selected.borderDivs.forEach(d => d.remove())
        } else
        {
            this.selectedLayerIndex = foundLayers.indexOf(layer)
        }

        if (!layer)
        {
            this.selected = null
            this.lastClickedLayer = undefined
            this.selectedLayerIndex = undefined
            ////
            //showEl(bySel("#symbol_viewer #empty"));
            //hideEl(byId("symbol_viewer_content"));
            ////
            return
        }
        // select new
        this.selected = {
            layer: layer,
            a: this,
            marginDivs: [],
            borderDivs: [],
        }
        // draw left vertical border
        this.selected.borderDivs.push(
            this._drawMarginLine(layer.parentPanel, layer.finalX, 0, 1, layer.parentPanel.height, "svBorderLineDiv")
        )
        // draw right vertical border
        this.selected.borderDivs.push(
            this._drawMarginLine(layer.parentPanel, layer.finalX + layer.w, 0, 1, layer.parentPanel.height, "svBorderLineDiv")
        )
        // draw top horizonal border
        this.selected.borderDivs.push(
            this._drawMarginLine(layer.parentPanel, 0, layer.finalY, layer.parentPanel.width, 1, "svBorderLineDiv")
        )
        // draw bottom horizonal border
        this.selected.borderDivs.push(
            this._drawMarginLine(layer.parentPanel, 0, layer.finalY + layer.h, layer.parentPanel.width, 1, "svBorderLineDiv")
        )
    }

    findOtherSelection(click, layers, foundLayers)
    {
        const data = this.getData()
        if (data === null) return
        //
        if (null == layers) layers = data.layers[this.pageIndex].c

        if (undefined == layers) return
        for (var l of layers.slice().reverse())
        {
            if ((!this.showSymbols || l.s != undefined) &&
                SUPPORT_TYPES.indexOf(l.tp) >= 0)
            {
                if (click.x >= l.finalX && click.x <= (l.finalX + l.w) && click.y >= l.finalY && click.y <= (l.finalY + l.h))
                {
                    foundLayers.push(l)
                }
            }
            if (undefined != l.c)
                this.findOtherSelection(click, l.c, foundLayers)
        }
    }


    mouseEnterLayerDiv(div)
    {
        // get a layer under mouse 
        const a = div.parentElement
        const sv = viewer.symbolViewer
        const pageIndex = a.getAttribute("pi")
        const layerIndex = a.getAttribute("li")
        const layer = sv.createdPages[pageIndex].layerArray[layerIndex]
        if (!layer) return
        // get a currently selected layer
        if (!sv.selected) return
        const slayer = sv.selected.layer
        //
        if (!slayer || !layer) return
        // check if layers are in the same panel
        if (slayer.parentPanel != layer.parentPanel) return
        // remove previous margins
        this.selected.marginDivs.forEach(d => d.remove())
        this.selected.marginDivs = []
        // show margins
        this._drawTopVMargin(slayer.parentPanel, layer, slayer)
        this._drawBottomVMargin(slayer.parentPanel, layer, slayer)
        this._drawLeftHMargin(slayer.parentPanel, layer, slayer)
        this._drawRightHMargin(slayer.parentPanel, layer, slayer)
    }

    _drawLeftHMargin(currentPanel, layer, slayer)
    {
        let hmargin = 0
        let x = null
        if (layer.finalX == slayer.finalX)
        {
        } else if ((slayer.finalX + slayer.w) < layer.finalX)
        {
            // if layer bottom over slayer top => don't show top margin
        } else if ((layer.finalX + layer.w) < slayer.finalX)
        {
            // layer bottom over slayer.top
            x = layer.finalX + layer.w
            hmargin = slayer.finalX - x
        } else if (layer.finalX < slayer.finalX)
        {
            // layer top over slayer.top
            x = layer.finalX
            hmargin = slayer.finalX - x
        } else
        {
            // layer top over slayer.top
            x = slayer.finalX
            hmargin = layer.finalX - x
        }

        if (hmargin > 0)
        {
            let y = this._findLayersCenterY(layer, slayer)
            this.selected.marginDivs.push(this._drawMarginLine(currentPanel, x, y, hmargin, 1, "svMarginLineDiv"))
            this.selected.marginDivs.push(this._drawMarginValue(currentPanel, x + hmargin / 2, y, hmargin, "svMarginLineDiv"))
        }
    }


    _drawRightHMargin(currentPanel, layer, slayer)
    {
        let hmargin = 0
        let x = null

        const layerRight = layer.finalX + layer.w
        const slayerRight = slayer.finalX + slayer.w

        if (layerRight == slayerRight)
        {
        } else if (layerRight < slayer.finalX)
        {
            // if layer bottom over slayer bottom => don't show bottom margin                
        } else if (slayerRight < layer.finalX)
        {
            // slayer bottom over layer.top
            x = slayerRight
            hmargin = layer.finalX - x
        } else if (slayerRight < layerRight)
        {
            // slayer bottom over layer.bottom
            x = slayerRight
            hmargin = layerRight - x
        } else
        {
            // slayer bottom over layer.bottom
            x = layerRight
            hmargin = slayerRight - x
        }

        if (hmargin > 0)
        {
            let y = this._findLayersCenterY(layer, slayer)
            this.selected.marginDivs.push(this._drawMarginLine(currentPanel, x, y, hmargin, 1, "svMarginLineDiv"))
            this.selected.marginDivs.push(this._drawMarginValue(currentPanel, x + hmargin / 2, y, hmargin, "svMarginLineDiv"))
        }
    }


    _drawTopVMargin(currentPanel, layer, slayer)
    {
        let vmargin = 0
        let y = null
        if (layer.finalY == slayer.finalY)
        {
        } else if ((slayer.finalY + slayer.h) < layer.finalY)
        {
            // if layer bottom over slayer top => don't show top margin
        } else if ((layer.finalY + layer.h) < slayer.finalY)
        {
            // layer bottom over slayer.top
            y = layer.finalY + layer.h
            vmargin = slayer.finalY - y
        } else if (layer.finalY < slayer.finalY)
        {
            // layer top over slayer.top
            y = layer.finalY
            vmargin = slayer.finalY - y
        } else
        {
            // layer top over slayer.top
            y = slayer.finalY
            vmargin = layer.finalY - y
        }

        if (vmargin > 0)
        {
            let x = this._findLayersCenterX(layer, slayer)
            this.selected.marginDivs.push(this._drawMarginLine(currentPanel, x, y, 1, vmargin, "svMarginLineDiv"))
            this.selected.marginDivs.push(this._drawMarginValue(currentPanel, x, y + vmargin / 2, vmargin, "svMarginLineDiv"))
        }
    }

    _drawBottomVMargin(currentPanel, layer, slayer)
    {
        let vmargin = 0
        let y = null

        const layerBottom = layer.finalY + layer.h
        const slayerBottom = slayer.finalY + slayer.h

        if (layerBottom == slayerBottom)
        {
        } else if (layerBottom < slayer.finalY)
        {
            // if layer bottom over slayer bottom => don't show bottom margin        
        } else if (slayerBottom < layer.finalY)
        {
            // slayer bottom over layer.top
            y = slayerBottom
            vmargin = layer.finalY - y
        } else if (slayerBottom < layerBottom)
        {
            // slayer bottom over layer.bottom
            y = slayerBottom
            vmargin = layerBottom - y
        } else
        {
            // slayer bottom over layer.bottom
            y = layerBottom
            vmargin = slayerBottom - y
        }

        if (vmargin > 0)
        {
            let x = this._findLayersCenterX(layer, slayer)
            this.selected.marginDivs.push(this._drawMarginLine(currentPanel, x, y, 1, vmargin, "svMarginLineDiv"))
            this.selected.marginDivs.push(this._drawMarginValue(currentPanel, x, y + vmargin / 2, vmargin, "svMarginLineDiv"))
        }
    }


    _findLayersCenterX(l, sl)
    {
        let c = l.finalX + l.w / 2
        let sc = sl.finalX + sl.w / 2
        return sl.finalX > l.finalX && ((sl.finalX + sl.w) < (l.finalX + l.w)) ? sc : c
    }

    _findLayersCenterY(l, sl)
    {
        let c = l.finalY + l.h / 2
        let sc = sl.finalY + sl.h / 2
        return sl.finalY > l.finalY && ((sl.finalY + sl.h) < (l.finalY + l.h)) ? sc : c
    }

    _drawMarginLine(currentPanel, x, y, width, height, className)
    {
        const sd = new StageDiv(x, y, width, height, className)
        const div = sd.elDiv();
        currentPanel.linksDiv.appendChild(div);
        return div;
    }
    _drawMarginValue(currentPanel, x, y, value)
    {
        const valueHeight = 20
        const valueWidth = 30
        const sd = new StageDiv(x - valueWidth / 2, y - valueHeight / 2, null, null, "svMarginValueDiv")
        const div = sd.elDiv()
        //
        div.innerHTML = Number.parseFloat(value).toFixed(0)
        //
        currentPanel.linksDiv.appendChild(div);
        return div;
    }

    _decorateCSS(layer, tokens, siLayer)
    {
        let css = layer.pr
        let result = ""
        let styles = {}

        result += `
                <hr/>
                <div class="panel">
                    <div class="label">CSS Styles</div>
                    <div class="value code">
                        `

        // Decorate styles already described in CSS 
        css.split("\n").forEach(line =>
        {
            if ("" == line) return
            const props = line.split(": ", 2)
            if (!props.length) return
            const styleName = props[0]
            const styleValue = props[1].slice(0, -1)

            result += this._decorateCSSOneStyle(tokens, layer, siLayer, styleName, styleValue)
            if (styles[styleName] === undefined)
            {
                styles[styleName] = styleValue
            } else if (Array.isArray(styles[styleName]))
            {
                styles[styleName].push(styleValue)
            } else
            {
                // Convert exsting single into new array
                styles[styleName] = [styles[styleName], styleValue]
            }

        }, this);
        // Add missed CSS styles based on tokens
        result += this._decorateCSSLostTokens(tokens, styles, layer, siLayer)
        // Decorate non-CSS common styles
        result += this._decorateCSSOtherTokens(tokens, layer, siLayer)


        result += `</div></div>`
        return { "css": result, "styles": styles }
    }


    _decorateCSSOneStyle(tokens, layer, siLayer, styleName, styleValue)
    {
        let result = ""
        // Decorate style name
        let styleNameTxt = styleName
        if (this.currLayerIsIcon && styleName === "background-color") styleNameTxt = "color"
        result += "" + styleNameTxt + ": "
        result += "<span class='tokenName'>"
        //
        let cvTokens = null
        if (layer.cv && "color" == styleName)
        {
            // get token for color variable
            cvTokens = this._findSwatchTokens(layer.cv)
            if (cvTokens)
            {
                const tokenStr = this._decorateSwatchToken(cvTokens, styleValue)
                result += tokenStr != "" ? tokenStr : (styleValue + ";")
            }
        }
        if (null == cvTokens)
        {
            const tokenStr = tokens != null ? this._decorateStyleToken(styleName, tokens, siLayer, styleValue) : ""
            if (tokenStr === undefined) return ""
            result += tokenStr != "" ? tokenStr : (styleValue + ";")
        }
        //
        result += "</span>"
        result += "<br/>"
        return result
    }

    _decorateCSSLostTokens(tokens, styles, layer, siLayer)
    {
        if (null == tokens) return ""
        let result = ""
        const knownOtherStyles = ["width2", "height2"]
        const reversed = tokens.slice().reverse()
        const processed = {}
        tokens.filter(token => !(token[0] in styles) && knownOtherStyles.indexOf(token[0]) < 0).forEach(token =>
        {
            if (token[0] != "background-color" && (token[0] in processed)) return
            processed[token[0]] = true
            result += this._decorateCSSOneStyle(tokens, layer, siLayer, token[0], token[1])
        }, this)
        return result
    }

    _decorateCSSOtherTokens(tokens, layer, siLayer)
    {
        if (null == tokens) return ""
        let result = ""
        const knownOtherStyles = ["width2", "height2"]
        tokens.filter(t => knownOtherStyles.indexOf(t[0]) >= 0 || t[0].startsWith("margin") || t[0].startsWith("padding")).forEach(function (token)
        {
            result += this._decorateCSSOneStyle(tokens, layer, siLayer, token[0], token[1])
        }, this)
        return result
    }

    _decorateSwatchToken(tokens, styleValue)
    {
        const tokenName = tokens[0][1]
        //
        return tokenName + ";</span><span class='tokenValue'>//" + styleValue
    }

    _decorateStyleToken(style, tokens, siLayer, styleValue)
    {
        // search tokan name by style name 
        const foundTokens = tokens.filter(t => t[0] == style)
        if (!foundTokens.length) return ""
        const tokenName = foundTokens[foundTokens.length - 1][1]
        //
        const libName = siLayer && undefined != siLayer.b ? siLayer.b : story.docName
        const finalTokenInfo = this._findTokenValueByName(tokenName, libName, styleValue)
        //
        if (finalTokenInfo)
            return finalTokenInfo[0] + ";</span><span class='tokenValue'>//" + finalTokenInfo[1]
        else if (foundTokens[0].length == 3)
            return tokenName + ";</span><span class='tokenValue'>//" + foundTokens[0][2]
        else if (foundTokens[0].length == 2)
        {
            if (foundTokens[0][1].includes("@"))
                return undefined
            else
                return tokenName + ";</span><span class='tokenValue'>//" + foundTokens[0][1]
        } else
            return ""

    }


    _showTextPropery(propName, propValue, postfix = "")
    {
        let text = propName + ": " + propValue + postfix + ";"
        return text + "<br/>"
    }

    // result: undefined or [tokenName,tokenValue]
    _findTokenValueByName(tokenName, libName, styleValue = null)
    {
        const lib = TOKENS_DICT[libName]
        if (undefined == lib) return undefined
        let value = lib[tokenName]
        if (value != undefined || null == styleValue) return [tokenName, lib[tokenName]]

        ///// try to find a token with a similar name
        // cut magic postfix to get a string for search
        const pos = tokenName.indexOf("--token")
        if (pos < 0) return undefined
        styleValue = styleValue.toLowerCase()
        const newName = tokenName.slice(0, pos)
        // filter lib tokens by name and value
        const similarTokens = Object.keys(lib).filter(function (n)
        {
            return n.startsWith(newName) && lib[n].toLowerCase() == styleValue
        }, this)
        if (!similarTokens.length) return undefined
        //
        return [
            similarTokens[0],
            lib[similarTokens[0]]
        ]
    }

    _findSymbolAndLibBySymbolName(symName)
    {
        for (const libName of Object.keys(this.getDataSymbolsDict()))
        {
            const lib = this.getDataSymbolsDict()[libName]
            if (!(symName in lib)) continue
            return {
                lib: lib,
                libName: libName,
                symbol: lib[symName]
            }
        }
        return undefined
    }

    _findStyleAndLibByStyleName(styleName)
    {
        for (const libName of Object.keys(this.getDataSymbolsDict()))
        {
            const lib = this.getDataSymbolsDict()[libName]
            if (!("styles" in lib) || !(styleName in lib.styles)) continue
            return {
                lib: lib,
                libName: libName,
                style: lib.styles[styleName]
            }
        }
        return undefined
    }

    // cv:{
    //   sn: swatch name
    //   ln:  lib name
    // }
    _findSwatchTokens(cv)
    {
        const lib = this.getDataSymbolsDict()[cv.ln]
        if (!lib)
        {
            console.log("Can not find lib " + cv.ln)
            return null
        }
        //
        const swatch = lib.colors__[cv.sn]
        if (!swatch)
        {
            console.log("Can not find color name " + cv.sn)
            return null
        }

        return swatch
    }
}
