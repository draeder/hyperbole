const HyperswarmUniversalChat = require('./')

const chat = new HyperswarmUniversalChat()

const url = new URL(window.location.href)
let channelName = url.searchParams.get('channel')

if(!channelName) {
  channelName = prompt('Enter a channel name, or default to global') || 'global'
  url.searchParams.set('channel', channelName)
  window.location.href = url.href
}

let userName = localStorage.getItem('userName')

if(!userName){
  userName = prompt('Enter your user name')
  localStorage.setItem('userName', userName)
}

const channel = chat.channel(channelName)

const count = $('#count')
const output = $('#output')
const input = $('#input')
const inputform = $('#inputform')

console.log('* Connecting to channel', channelName)

let peerCount = 0

channel.on('peer', (peer) => {
  count.innerText = peerCount++
  let msg = {state: 'connected', user: userName, peerId: peer.connection.channelName}
  channel.send(msg)
  
  log('* connected peer', userName)
  peer.once('disconnected', () => {
    count.innerText = peerCount--
    let msg = {state: 'disconnected', user: userName, peerId: peer.connection.channelName}
    channel.send(msg)
    log('* disconnected peer', userName)
  })

})

channel.on('message', (peer, {message}) => {
  if(message.state == 'connected'){
    log('* ', message.user, 'connected')
  } else 
  if(message.state == 'disconnected'){ 
    log('* ', message.user, 'disconnected')
  } else {
    let msg = JSON.stringify(message)
    log(message.user, '<', msg)
  }
})

inputform.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = input.value
  input.value = ''
  let msg = {state: '', user: userName, message: message}
  channel.send(msg)
  log('>', message)
})

function log(...messages) {
  console.log(...messages)
  output.innerText += messages.join(' ') + '\n'
}

function $(selector) {
  return document.querySelector(selector)
}
