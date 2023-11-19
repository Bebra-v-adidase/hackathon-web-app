import React, {useEffect, useState} from 'react'
import {Icon, Link, Message, Messagebar, Messages, MessagesTitle, Navbar, Page} from 'konsta/react'
import {MdSend} from 'react-icons/md'

import Service from "../modules/msgservice"
import MsgType from '../objects/MsgType'

const Messenger = () => {
    const [messageText, setMessageText] = useState('')
    const [messagesData, setMessagesData] = useState<MsgType[]>([
        new MsgType({
            name: 'Сервис доставки',
            from_id: 1,
            date: +Date.now(),
            text: 'Чем мы можем помочь?',
            avatar: '/logo.png',
        })
    ])

    const handleSendClick = () => {
        const text = messageText.trim()
        pushMessages([new MsgType({
            from_id: 0, text,
            date: +Date.now()
        })])

        setMessageText('')
        Service.sendMessage(text)
    }

    const inputOpacity = messageText ? 1 : 0.3
    const isClickable = messageText.trim().length > 0

    const currentDate = new Intl.DateTimeFormat('ru-RU', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    })
        .formatToParts(new Date())
        .map((part) => {
            if (['weekday', 'month', 'day'].includes(part.type)) {
                return <b key={part.type}>{part.value}</b>
            }
            return part.value
        })

    function pushMessages (messages: Array<MsgType>) {
        const m = [...messagesData, ...messages]
        setMessagesData(m)
    }

    Service.cb = pushMessages

    useEffect(() => {
        Service.initHistory()
    }, [])

    return (
        <Page>
            <Navbar title="Поддержка"/>
            <Messages>
                <MessagesTitle style={{marginBottom: '0.625rem'}}>{currentDate}</MessagesTitle>
                {messagesData.map((message, index) => (
                    <Message
                        key={index}
                        type={message.type}
                        name={message.name}
                        text={message.text}
                        avatar={
                            message.type === 'received' && (
                                <img
                                    alt="avatar"
                                    src={message.avatar}
                                    className="w-8 h-8 rounded-full"
                                />
                            )
                        }
                        className="whitespace-pre-line"
                    />
                ))}
            </Messages>
            <Messagebar
                placeholder="Напишите сообщение..."
                value={messageText}
                onInput={(e) => setMessageText(e.target.value)}
                right={
                    <Link
                        onClick={isClickable ? handleSendClick : undefined}
                        toolbar
                        style={{
                            opacity: inputOpacity,
                            cursor: isClickable ? 'pointer' : 'default',
                        }}
                    >
                        <Icon
                            ios={<MdSend className="w-7 h-7"/>}
                            material={
                                <MdSend className="w-6 h-6 fill-black dark:fill-md-dark-on-surface"/>
                            }
                        />
                    </Link>
                }
            />
        </Page>
    )
}

export default Messenger
