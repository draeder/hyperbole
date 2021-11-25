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
console.log(channel.peers)

let peerCount = 0
let peers = [{user: userName, id: ''}]


channel.on('peer', (peer) => {
  count.innerText = peerCount++
  if(peer.channelName != peers[0].id){
    log('Got a new peer - exchange usernames')
  }
  let msg = {state: 'connected', user: userName, peerId: peer.connection.channelName}
  channel.send(msg)
  
  peer.once('disconnected', () => {
    count.innerText = peerCount--
    let msg = {state: 'disconnected', user: userName, peerId: peer.connection.channelName}
    channel.send(msg)
  })

})

channel.on('message', (peer, {message}) => {
  if(message.state == 'connected' && message.user != userName){
    log('* ', message.user, 'connected')
  } 
  if(message.state == 'disconnected' && message.user != userName){ 
    log('* ', message.user, 'disconnected')
  } 
  if(message.state == '') {
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
