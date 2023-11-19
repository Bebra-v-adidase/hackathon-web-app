class API {
    static url = 'http://localhost:8000/'

    static async request (method, data={}) {
        const url = API.url + method

        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        })

        return await res.json()
    }

    static async createRequest (text) {
        const {data} = await this.request('createRequest', {
           text
        })

        return data
    }

    static async sendMessage (request_id, text) {
        return await this.request('sendMessage', {
            request_id, text
        })
    }

    static async getHistory (request_id, start_from = 0) {
        const {data} = await this.request('getHistory', {
            request_id, start_from
        })

        return data
    }
}

export default API