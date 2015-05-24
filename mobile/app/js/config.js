var CONFIG = {
	api_address: 'http://softsystemanager.appspot.com',
	// api_address: 'http://croner-platform.requies.cl',
	// api_address: 'http://localhost:3000',
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
        },
        save: { method: 'POST' },
        get: { isArray: false }
    },
    pk: 'id',
    debug: false
}
