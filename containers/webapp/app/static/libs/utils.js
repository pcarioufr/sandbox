
/**
* A wrapper to the JS fetch function
* @param    {String} method     HTTP method: GET, PUT, POST... 
* @param    {String} endpoint   endpoint to the resource (protocol and domain are optional) 
* @param    {Dictionary<string, string>} params URL parameters to append to the endpoint
* @return   {Promise} the fetch Promise 
* @example  call("GET", /products, params={ q: "car", color: "red"}) 
*           fetches /products?q=car&color=red and returns the promise
*/
async function call(method, endpoint, params={}) {
        
    let _url = endpoint
    let first = true ;
    Object.keys(params).forEach(
        key => {
            if (first) { _url = `${_url}?`; first = false ;}
            else { _url = `${_url}&`}
            _url = `${_url}${key}=${params[key]}`
        }) ;

    let headers = {}

    try {
        return await fetch( _url, { method: method, headers: headers });
    } catch (error) {
        alert(error);
    } 

}

/**
* Debounces a function
* @param    {Function}  func    The function to debounce 
* @param    {String}    wait    How long (in ms) without func call the function is actually executed 
* @return   {Function} the debounced function 
*/
function debounce(func, wait = 500) {   
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() { timeout = null; func.apply(context, args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);        
    }
}
