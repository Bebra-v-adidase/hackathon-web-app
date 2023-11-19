class MsgType {
    from_id: number;
    text: string;
    date: number;

    name: string;
    type: string;
    avatar: string;

    constructor(data: {
        from_id: number;
        text: string;
        date: number;
        name?: string;
        avatar?: string;
    }) {
        this.from_id = data.from_id;
        this.text = data.text;
        this.date = data.date;

        this.type = [
            'sent', 'received', 'system'
        ][data.from_id];

        this.name = data.name || '';
        this.avatar = data.avatar || '';
    }
}

export default MsgType;