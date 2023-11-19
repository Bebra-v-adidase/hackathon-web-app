import React, { useEffect, useRef, useState } from 'react'
import { Icon, Link, Message as Msg, Messagebar, Messages, MessagesTitle, Navbar, Page } from 'konsta/react'
import { MdSend } from 'react-icons/md'

import MessageService from '../modules/MessageService'
import Message from '../objects/Message'

const Messenger = () => {
  const [messageText, setMessageText] = useState('')
  const [messagesData, setMessagesData] = useState<Message[]>([
    new Message({
      name: 'Сервис доставки',
      from_id: 1,
      date: +Date.now(),
      text: 'Чем мы можем помочь?',
      avatar: '/logo.png',
    })
  ])

  const ref = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    ref.current?.scrollIntoView()
  }

  useEffect(() => {
    scrollToBottom()
  }, [messagesData])

  const handleSendClick = () => {
    const text = messageText.trim()
    pushMessages([new Message({
      from_id: 0, text,
      date: +Date.now()
    })])

    setMessageText('')
    MessageService.sendMessage(text)
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

  function pushMessages(messages: Array<Message>) {
    const m = [...messagesData, ...messages]
    setMessagesData(m)
  }

  MessageService.cb = pushMessages

  useEffect(() => {
    MessageService.initHistory()
  }, [])

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault()
        if (isClickable) handleSendClick()
      }
    }
    document.addEventListener("keydown", listener)
    return () => {
      document.removeEventListener("keydown", listener)
    }
  }, [isClickable, messageText])

  return (
    <Page>
      <Navbar title="Поддержка"/>
      <Messages>
        <MessagesTitle style={{marginBottom: '0.625rem'}}>{currentDate}</MessagesTitle>
        {messagesData.map((message, index) => (
          message.type === 'system'
            ?
            <MessagesTitle key={index} style={{marginBottom: '0.625rem'}}>{message.text}</MessagesTitle>
            :
            <Msg
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
        <div ref={ref}/>
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
