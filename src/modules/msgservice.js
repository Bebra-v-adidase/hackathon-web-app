import API from "./API"
import MsgType from "../objects/MsgType"

class Service {
    static cb
    static start_from = 0
    static no_poll = false
    static req_id = parseInt(localStorage.getItem('request_id'))

    static async initHistory () {
        const cur_req_id = this.req_id
        if (cur_req_id) {
            const history = await API.getHistory(cur_req_id)

            this.startPolling()
            this.handleMessages(history)
        }
    }

    static handleMessages (messages) {
        this.cb(messages.items.map(i => new MsgType(i)))
        this.start_from = messages.count
    }

    static startPolling () {
        setInterval(async () => {
            if (this.no_poll) return;
            const data = await API.getHistory(this.req_id, this.start_from)
            if (data.items.length > 0) {
                this.handleMessages(data)
            }
        }, 1000)
    }

    static async createRequest (text) {
        const data = await API.createRequest(text)
        this.req_id = data
        this.start_from = 1

        this.startPolling()
        localStorage.setItem('request_id', data)
    }

    static async sendMessage (text) {
        if (!this.req_id) {
            return this.createRequest(text)
        }

        this.no_poll = true
        const data = await API.sendMessage(this.req_id, text)
        this.start_from = data.data
        this.no_poll = false
    }
}

export default Service