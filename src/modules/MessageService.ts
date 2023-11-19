import API from './API'
import Message from '../objects/Message'

class MessageService {
  static cb: (messages: Message[]) => void
  static start_from: number = 0
  static no_poll: boolean = false
  static req_id: number = parseInt(localStorage.getItem('request_id') || '')

  static async initHistory(): Promise<void> {
    const cur_req_id = this.req_id
    if (cur_req_id) {
      const history = await API.getHistory(cur_req_id)

      this.startPolling()
      this.handleMessages(history)
    }
  }

  static handleMessages(messages: {items: Message[], count: number}): void {
    this.cb(messages.items.map(message => new Message(message)))
    this.start_from = messages.count
  }

  static startPolling(): void {
    setInterval(async () => {
      if (this.no_poll) return
      const data = await API.getHistory(this.req_id, this.start_from)
      if (data.items.length > 0) {
        this.handleMessages(data)
      }
    }, 1000)
  }

  static async createRequest(text: string): Promise<void> {
    const data = await API.createRequest(text)
    this.req_id = data
    this.start_from = 1

    this.startPolling()
    localStorage.setItem('request_id', data.toString())
  }

  static async sendMessage(text: string): Promise<void> {
    if (!this.req_id) {
      return this.createRequest(text)
    }

    this.no_poll = true
    const data = await API.sendMessage(this.req_id, text)
    this.start_from = data.data
    this.no_poll = false
  }
}

export default MessageService
