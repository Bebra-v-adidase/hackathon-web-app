class Message {
    from_id: number
    text: string
    date: number

    name?: string
    type?: string
    avatar?: string

    buttons?: string[]

    constructor(data: Message) {
        this.from_id = data.from_id
        this.text = data.text
        this.date = data.date

        this.type = ['sent', 'received', 'system'][data.from_id]

        this.name = data.name
        this.avatar = data.avatar

        this.buttons = data.buttons
    }
}

export default Message
