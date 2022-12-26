
/**
* A wrapper to createElement JS function
* @param    {String} tagName    the HTML tag of the element to create
* @param    {String} className  the class of HTML element to create
*/
function create(tagName, className=null){

    let element
    if (tagName == "svg")  { element = document.createElementNS("http://www.w3.org/2000/svg", "svg") }
    else                   { element = document.createElement(tagName) }

    if (className != null) { element.setAttribute("class", className) }
    return element

} 

/**
* A JS Object wrapper to HTML elements
* @property {string} id id of the object (not of the element) used for events 
* @property {HTML element} element  the HTML wrapped HTML elemement 
* @method tag    add attribute to the element
* @method untag  remove attribute to the element 
*/
class Component {
    
    /**
    * @param    {String} element    the HTML element to wrap  
    * @param    {Component} parent  the parent HTML element to (re)assign to - defaults to <body/>
    * @example  new Component( create("img") )
    * @example  new Component( create("svg"), otherComponent )
    */ 
   constructor(element, parent=null) {
       
        this.element = element
        this.id = this._uuidv4()

        parent != null ? 
            parent.element.appendChild(this.element) :
            document.body.appendChild(this.element)
    }
    
    /** wrapper to setAttributes and removeAttributes JS functions **/
    tag(key, value=null)  { value == null ? value = "" : null ; this.element.setAttribute(key, value) }
    untag(key, value=null)  { this.element.removeAttribute(key) }

    /** genrates random uuidv4(), e.g. 2bb81e27-a8af-440e-a274-e31f597d9f6d **/
    _uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }
}

/**
* A Component wrapper to <input>
* <div class="c-input">
*   <input class="input"> <!-- The actual input -->
*   <div class="helper"></div> <!-- input helper -->
*   <svg></svg> <!-- input feedback icon -->
* </div>
* @property {string} helper (set) helper 
* @property {string} value  (get, set) content of the text input 
* @property {enum}   status (set) the status of the input (ok, loading) 
* @method focus wrapper on JS focus() function
* @method select wrapper on JS select() function
*/
class CTextInput extends Component {
        
    constructor(parent=null) {

        super( create("div", "c-input"), parent )
        
        this._input  = new Component( create("input", "input")  , this )
        this._helper = new Component( create("div"  , "helper") , this )
        this._svg    = new CSVG( this, "loader" )

        this._input.element.addEventListener('input', _ => { this.status = "loading" } )

    }
    
    get helper()       { return this._helper.element.innerText }
    set helper(helper) {        this._helper.element.innerText = helper }

    get value()        { return this._input.element.value }
    set value(value)   {        this._input.element.value = value }

    set status(status) {

        switch(status) {
            case "loading":  this._svg.icon = "loader" ; this.tag("loading")    ; return ;
            case "ok"     :  this._svg.icon = null     ; this.untag("loading")  ; return ;
        }

    }

    focus  () { this._input.element.focus }
    select () { this._input.element.select }

}


/* SVG icons grabbed from https://remixicon.com */
let svg_collection = {}
/* loader-2-line */ svg_collection.loader = '<path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm10-5a1 1 0 0 1-1 1h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 1 1zM7 12a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h3a1 1 0 0 1 1 1zm12.071 7.071a1 1 0 0 1-1.414 0l-2.121-2.121a1 1 0 0 1 1.414-1.414l2.121 2.12a1 1 0 0 1 0 1.415zM8.464 8.464a1 1 0 0 1-1.414 0L4.93 6.344a1 1 0 0 1 1.414-1.415L8.464 7.05a1 1 0 0 1 0 1.414zM4.93 19.071a1 1 0 0 1 0-1.414l2.121-2.121a1 1 0 1 1 1.414 1.414l-2.12 2.121a1 1 0 0 1-1.415 0zM15.536 8.464a1 1 0 0 1 0-1.414l2.12-2.121a1 1 0 0 1 1.415 1.414L16.95 8.464a1 1 0 0 1-1.414 0z"/>'
/* qr-code-line */  svg_collection.qrcode = '<path fill="none" d="M0 0h24v24H0z"/><path d="M16 17v-1h-3v-3h3v2h2v2h-1v2h-2v2h-2v-3h2v-1h1zm5 4h-4v-2h2v-2h2v4zM3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zM6 6h2v2H6V6zm0 10h2v2H6v-2zM16 6h2v2h-2V6z"/>'

/**
* A Component wrapper to <svg>
* <svg></svg>
* @property {enum} svg (set) the svg content 
*/
class CSVG extends Component {

    constructor(parent=null, svg=null) {

        super( create("svg") , parent)
        this.tag("xmlns", "http://www.w3.org/2000/svg")
        this.tag("viewBox", "0 0 24 24") ; this.tag("width", "24") ; this.tag("height", "24")

        this.svg = svg
    }

    set svg(svg) {
        switch (svg) {
            case 'loader'   : this.element.innerHTML = svg_collection.loader ; return 
            case 'qrcode'   : this.element.innerHTML = svg_collection.qrcode ; return
            default         : this.element.innerHTML = ''                    ; return
        }
    } 
}


/**
* A Component wrapper for QRCOde
* <div class="c-qrcode">
*   <img></img> <!-- QRCode Image -->
*   <svg></svg> <!-- QRCode Placeholder -->
* </div>
* @property {string} helper (set) helper 
* @property {string} value  (get, set) content of the text input 
* @property {enum}   status (set) the status of the input (ok, loading) 
* @method update (async) updates the content of the QRCode
* @method select wrapper on JS select() function
*/
class CQRCode extends Component {
    
    /**
    * @param {string} endpoint endpoint of the qrcode generator
    * @param {string} param_key key of the url param to the endpoint
    * @param {Component} parent see Component
    * @fires "qrcode::ok" when QRCode fetch successfully completes 
    * @example CQRCode("/qrcode", "link")
    * * @example CQRCode("https:/www.acme.com/qrcode")
    */
    constructor(endpoint, param_key, parent=null) {

        super( create("div", "c-qrcode"), parent)
        this._img = new Component( create("img"), this )
        this._svg = new CSVG( this, "qrcode" )

        this._endpoint  = endpoint
        this._param_key = param_key

    }

    /**
    * @param {string} string actual content of the QRCode
    */
    async update(string) { 

        if (string != null) {
        
            let params = {}
            params[this._param_key] = string

            call( "GET", this._endpoint, params )
            .then( r => r.blob() )
            .then( blob => { 
                this._img.tag("src",""+URL.createObjectURL(blob))
                this._img.untag("hidden")
                this._svg.tag("hidden")
            })
            .then( _ => { fire(this.id, "qrcode::ok") } )
        }
        else {  this._img.tag("hidden") ; this._svg.untag("hidden") } 
    }

}