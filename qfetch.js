const amIOnline = () => {
    return navigator.onLine;
}

function qfetch (url, options) {
    if (amIOnline()) {
        return fetch(url, options)
    } else {

        if (!localStorage.getItem('qfetch')) {
            localStorage.setItem('qfetch', JSON.stringify([{
                url,
                options
            }]))
        } else {
            const queuedRequests = JSON.parse(localStorage.getItem('qfetch'))
            queuedRequests.push({
                url,
                options
            })
            localStorage.setItem('qfetch', JSON.stringify(queuedRequests))
        }
  
        return fetch(url, options)
    }
}

setInterval(function () {
    const queuedRequests = JSON.parse(localStorage.getItem('qfetch')) || []
    if (amIOnline() && queuedRequests.length != 0) {
        for (let i = 0; i < queuedRequests.length; i++) {
            const request = queuedRequests[i];
            fetch(request.url, request.options)
            queuedRequests.splice(i, 1);
        }
        localStorage.setItem('qfetch', JSON.stringify(queuedRequests))
    }
}, 5000);