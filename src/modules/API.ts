class API {
  static url = 'http://45.152.114.81:8000/'

  static async request(method: string, data: object = {}): Promise<any> {
    const url = API.url + method

    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'Content-Type': 'application/json'}
    })

    return await res.json()
  }

  static async createRequest(text: string): Promise<any> {
    const {data} = await this.request('createRequest', {
      text
    })

    return data
  }

  static async sendMessage(request_id: number, text: string): Promise<any> {
    return await this.request('sendMessage', {
      request_id, text
    })
  }

  static async getHistory(request_id: number, start_from: number = 0): Promise<any> {
    const {data} = await this.request('getHistory', {
      request_id, start_from
    })

    return data
  }
}

export default API