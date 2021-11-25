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
  
  
  //log('* connected peer', peer.connection.channelName, userName)
  console.log(peer)
  peer.once('disconnected', () => {
    count.innerText = peerCount--
    //log('* disconnected peer', peer.connection.channelName, userName)
  })

})

channel.on('message', (peer, {message}) => {
  let msg = JSON.stringify(message)
  log(peer.connection.channelName, '<', msg)
})

inputform.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = input.value
  input.value = ''
  let msg = {user: userName, message: message}
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
