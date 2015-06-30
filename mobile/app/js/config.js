var CONFIG = {
    api_address: 'http://softsystemanager.appspot.com',
    api_version: '/api/v1',
    api: function (resource) {
        var res = this.api_address + this.api_version
        if(resource)
            res += "/" + resource
        return res
    },
    apiMethods: {
        update: { 
            method: 'PUT', 
            isArray: false
        }
        , save: { 
            method: 'POST',
            params: []
        }
        , get: { 
            isArray: false 
        }
    },
    pk: 'id',
    debug: false,
    media: {
        "jpg": "image/jpeg",
        "png": "image/png",
        "mp3": "audio/mp3",
        "mov": "video/quicktime",
        "wav": "audio/x-wav"
    },
    gcs: "https://www.googleapis.com/upload/storage/v1/b/ssmfiles/o?uploadType=multipart&predefinedAcl=publicRead"
}
