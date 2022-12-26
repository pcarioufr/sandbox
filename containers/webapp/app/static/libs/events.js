
/* collection of all listeners */
let LISTENERS = []

/**
* Fire an event, which triggers all listeners for that event 
* @param    {uuid} throwerId    id of the Component firing event 
* @param    {string} eventName  name that uniquely identifies the event  
* @param    {Object} data       data to pass alongwith the event  
* @return   {-} none 
* @example  call("GET", /products, params={ q: "car", color: "red"}) 
*           fetches /products?q=car&color=red and returns the promise
*/
function fire(throwerId, eventName, data=null) { 
    console.log(`${throwerId} fires ${eventName} with ${data}`)
    if (LISTENERS[eventName] != null) { for (const [id, f] of Object.entries(LISTENERS[eventName])) { f.call(this, throwerId, data) } }
}

/**
* Registers a Component to listen for an event, and execute some function
* That funciton has (throwerId, data) as parameters - see fire.
* @param    {uuid} listenerId  id of the Component listening to event 
* @param    {uuid} eventName   name that uniquely identifies the event 
* @param    {function} callback function to call on event 
* @example listen(cInput.id, "qrcode::ok", _ => cInput.status = "ok" )
* @example listen(this.id, "connect", (throwerId, data) => if ( throwerId != null ) {this.data = data} )
*/
function listen(listenerId, eventName, callback) { 
    console.log(`${listenerId} registers as listener for ${eventName}`)
    if ( !LISTENERS.hasOwnProperty(eventName) ) { LISTENERS[eventName] = [] }
    LISTENERS[eventName][listenerId] = callback
}

/**
* Deregisters a Component to listen for an event
* @param    {uuid} listenerId  id of the Component listening to event 
* @param    {uuid} eventName   name that uniquely identifies the event 
*/
function ignore(listenerId, eventName) { delete LISTENERS[eventName][listenerId] }
