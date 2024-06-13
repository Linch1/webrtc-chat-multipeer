class EventsDispatcher {
    constructor(){
        this._listeners = []; 
    }
    addListener(listener) {
        if( this._listeners.indexOf(listener) != -1 ) return;
        this._listeners.push(listener);
    }

    removeListener(listener) {
        let idx = this._listeners.indexOf(listener);
        if (idx == -1 ) return;
        this._listeners.splice(idx, 1);
    }
    dispatchEvent(evtType, payload, defer=false){ 
        for (let listener of this._listeners) {
            if (defer) {
                setTimeout(()=>{
                    listener(evtType, payload); 
                }, 1)
            } else {
                listener(evtType, payload); 
            }
        }
    }
}
export default new EventsDispatcher();