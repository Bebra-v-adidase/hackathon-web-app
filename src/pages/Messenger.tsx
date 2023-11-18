import React, { useState } from 'react'
import { Icon, Link, Message, Messagebar, Messages, MessagesTitle, Navbar, Page } from 'konsta/react'
import { MdSend } from 'react-icons/md'

const Messenger = () => {
  const [messageText, setMessageText] = useState('')
  const [messagesData, setMessagesData] = useState([
    {
      type: 'sent',
      text: 'здарова урод',
    },
    {
      name: 'Канеки Кен',
      type: 'received',
      text: 'здарова иди нахуй',
      avatar: 'https://i.pinimg.com/originals/f4/72/17/f4721731bd55554df29671aa790f0b01.jpg',
    }
  ])

  const handleSendClick = () => {
    const text = messageText.trim()
    const type = 'sent'
    const messagesToSend = []
    if (text.length) {
      messagesToSend.push({text, type})
    }
    if (messagesToSend.length === 0) {
      return
    }
    setMessagesData([...messagesData, ...messagesToSend])
    setMessageText('')
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

  return (
    <Page>
      <Navbar
        title="Центр-инвест Банк"
        subtitle="Поддержка"
        titleFontSizeIos="text-[15px]"
        left={
          <img
            alt="avatar"
            src="https://avatars.mds.yandex.net/get-altay/906486/2a00000162ef63ac29e0c1ef089ca1d2c811/h440"
            className="w-8 h-8 rounded-full"
          />
        }
      />
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
