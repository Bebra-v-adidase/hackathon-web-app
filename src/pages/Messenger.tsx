import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button, Icon, Link, Message as Msg, Messagebar, Messages, MessagesTitle, Navbar, Page } from 'konsta/react'
import { MdSend } from 'react-icons/md'
import { IoIosAdd } from "react-icons/io"

import MessageService from '../modules/MessageService'
import Message from '../objects/Message'

const Messenger = () => {
  const [messageText, setMessageText] = useState('')
  const [messagesData, setMessagesData] = useState<Message[]>([
    new Message({
      name: 'Маркетплейс',
      from_id: 1,
      date: +Date.now(),
      text: 'Чем мы можем помочь?',
      avatar: '/logo.png',
    })
  ])

  const ref = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const [barHeight, setBarHeight] = useState(0)

  const scrollToBottom = () => {
    ref.current?.scrollIntoView()
  }

  useEffect(() => {
    scrollToBottom()
  }, [messagesData])

  const handleSendClick = (text?: string) => {
    if (text) {
      text = text.trim()
    } else {
      text = messageText.trim()
    }
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
    document.addEventListener('keydown', listener)
    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [isClickable, messageText])

  useLayoutEffect(() => {
    function updateSize() {
      const height = barRef.current?.offsetHeight
      if (!height) return
      setBarHeight(height)
    }

    window.addEventListener('resize', updateSize)
    updateSize()
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <Page>
      <Navbar
        title="Поддержка"
        right={
          <Link onClick={() => {
            localStorage.removeItem('request_id')
            window.location.reload()
          }} navbar>
            <Icon
              ios={<IoIosAdd className="w-9 h-9"/>}
              material={
                <IoIosAdd className="w-6 h-6 fill-black dark:fill-md-dark-on-surface"/>
              }
            />
          </Link>
        }
      />
      <Messages style={{marginBottom: barHeight + 'px'}}>
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
              className="whitespace-pre-line break-all"
            />
        ))}
        <div ref={ref}/>
      </Messages>
      <div ref={barRef} className="fixed pt-1 bottom-0 start-0 pb-11 w-full bg-white dark:bg-black translucent">
        <div className="max-w-[80%] flex flex-wrap ml-2">
          {['Сделать заказ', 'Отследить заказ', 'Отменить заказ',
            'Возврат средств', 'Оставить отзыв', 'Жалоба'].map((text, index) => (
              <Button
                key={index}
                onClick={() => {
                  handleSendClick(text)
                }}
                className="mr-0.75 mb-0.75 w-fit normal-case"
                small
                tonal
              >
                {text}
              </Button>
          ))}
        </div>
      </div>
      <Messagebar
        className="bg-white dark:bg-black translucent"
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
