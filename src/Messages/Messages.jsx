import React from 'react';
import { browserHistory } from 'react-router';
import Navbar from '../components/Navbar';
import Firebase from '../config/firebase';
import Button from '@material-ui/core/Button';
import ChatIcon from '../images/icons8-chat-100.png';
import Media from "react-media";

let selectedPersonUserUID = '';
//remove this variable and use this.state.userUID
let userUID;


class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: true,
      selectedPersonUsername: '',
      loadMessagesMobile: false,
      userUID: localStorage.getItem('userUID')
      //  messageKey: this.props.location.state.messageKey
    }
    this.loadMessages = this.loadMessages.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.messageSubmit = this.messageSubmit.bind(this);
    this.handleEnter = this.handleEnter.bind(this)

  }
  componentDidMount() {
    //this.loadMessages();
    this.LoadChatHistory();
  }

  handleEnter = (event) => {
    if (event.keyCode === 13) {
      alert("hello")
    }
    console.log("hello enter")
  }

  UNSAFE_componentWillMount() {
    // eslint-disable-next-line
    this.LoadChatHistory()
      // eslint-disable-next-line
      (this.props.location.state) ? (selectedPersonUserUID = this.props.location.state.messageKey)
      : null;
  }




  loadMessages = () => {

    const setMessage = function (snap) {
      const data = snap.val();

      this.displayMessage(snap.key, data.name, data.text, data.profilePicUrl, data.imageUrl);
    }.bind(this);
    Firebase.database()
      .ref(`Messages/${selectedPersonUserUID}`)
      .limitToLast(12)
      .on('child_added', setMessage);

  };
  displayMessage = (key, name, text, picUrl, imageUrl) => {

    const MESSAGE_TEMPLATE =
      '<div class="message-container">' +
      '<div><img class="smallpic" className=" rounded-circle"/>' +
      '<div class="spacing"><div class="message"></div>' +
      '<div class="name"></div></div>' +
      '</div></div>';

    let div = document.getElementById(key);
    // eslint-disable-next-line
    const messageList = document.getElementById('messages');
    // If an element for that message does not exists yet we create it.
    if (!div) {
      const container = document.createElement('div');
      container.innerHTML = MESSAGE_TEMPLATE;
      div = container.firstChild;
      div.setAttribute('id', key);
      messageList.appendChild(div);
    }
    div.querySelector('.name').textContent = name;
    div.querySelector('.message').textContent = text;
    div.querySelector('.smallpic').src = `${picUrl}`;

    // if (text) { // If the message is text.
    //     messageElement.textContent = text;
    //     // Replace all line breaks by <br>.
    //     messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    //   }

    if (!picUrl) {
      div.querySelector('.pic').src =
        'url(https://storage.googleapis.com/lsk-guide-jobs.appspot.com/profile_placeholder.png)';
    }

    // var div = document.getElementById("messages");

    // console.log(text)
    messageList.scrollTop = messageList.scrollHeight;
  };


  LoadChatHistory = () => {

    const setChatHistory = function (snap) {
      const data = snap.val();
      let elements = Object.values(data);

      //  console.log("loadchathistory", elements)
      let properties = [];
      for (const index in data) {
        properties.push(data[index])
      }
      // console.log(elements['0'])
      this.displayChatHistory(elements['1'], elements['3'], elements['0'], elements['2'])
    }.bind(this);
    //precaution incase userUID is null, dont push to database. preventing errors
    (userUID != null) ?
      Firebase.database()
        .ref(`Users/${userUID}/Messages`)
        .limitToLast(1)
        .on('child_added', setChatHistory) : this.setState({
          loginStatus: false
        })

  }

  displayChatHistory = (name, text, messageKey, picUrl) => {
    const MESSAGE_TEMPLATE =
      '<div class="message-container">' +
      '<div><img class="pic" className=" rounded-circle"/>' +
      '<div class="spacing"><div class="message"></div>' +
      '<div class="name"></div></div>' +
      '</div></div>';

    let div = document.getElementById(name);
    const messageList = document.getElementById('chatHistory');
    // If an element for that message does not exists yet we create it.
    if (!div) {
      const container = document.createElement('div');
      container.innerHTML = MESSAGE_TEMPLATE;
      div = container.firstChild;
      div.setAttribute('id', name);
      // eslint-disable-next-line
      (messageList != null) ? messageList.appendChild(div) : null;
    }
    div.querySelector('.name').textContent = name;
    div.querySelector('.message').textContent = text;
    div.onclick = (event) => {
      if (event.button === 0) {
        selectedPersonUserUID = messageKey;
        this.loadMessages()
      }
    }
    div.querySelector('.pic').src = `${picUrl}`;

    // if (text) { // If the message is text.
    //     messageElement.textContent = text;
    //     // Replace all line breaks by <br>.
    //     messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    //   }

    if (!picUrl) {
      div.querySelector('.pic').src =
        'url(https://storage.googleapis.com/lsk-guide-jobs.appspot.com/profile_placeholder.png)';
    }

    // var div = document.getElementById("messages");

    // console.log(text)
    // messageList.scrollTop = messageList.scrollHeight;
  };


  saveMessage = (messageText) => {
    // Add a new message entry to the Firebase Database.
    Firebase.database()
      .ref(`/Messages/${selectedPersonUserUID}`)
      // .ref(`/messages/${userUID}${seletcedPersonUserID}`)
      .push({
        name: this.getUserName(),
        text: messageText,
        profilePicUrl: this.getProfilePicUrl(),
        userUID: userUID
      })
      .catch((error) => {
        console.error('Error writing new message to Firebase Database', error);
      });
  };

  messageSubmit = (target) => {
    this.messageInput = document.getElementById('messageInput');
    if (this.messageInput.value || target.charCode === 13) {
      this.saveMessage(this.messageInput.value);
      this.messageInput.value = '';
    }
  };

  getUserName = () =>
    // remember to give provision for user to set displayName when signing up
    // currently using email address
    Firebase.auth().currentUser.email;

  getProfilePicUrl = () =>
    Firebase.auth().currentUser.photoURL ||
    'https://storage.googleapis.com/lsk-guide-jobs.appspot.com/profile_placeholder.png';
  render() {
    console.log(this.state.loadMessagesMobile)
    return (
      <div>

        <Navbar userUID={this.state.userUID} />
        <Media query="(max-width: 769px)"
          render={() => <div className='card mt-3' style={{ height: '100%' }}>
            <div id='chatHistoryMobile' className='chatHistory' style={{ padding: 8, height: '100%' }}>
            </div>
          </div>}
        />
        <Media query="(min-width: 770px)"
          render={() => (this.state.loginStatus) ? <div className="container row mt-3 mb-3" style={{ height: '80%' }}>
            <div className="col-md-4">
              <div className='card' style={{ height: '100%' }}>
                <div id='chatHistory' className='chatHistory' style={{ padding: 8, height: '100%' }}>
                </div>
              </div>
            </div>
            <div className="card justify-content-center col-md-8">
              <div className="card-body justify-content-center">
                <div className="text-center mb-5" style={{ backgroundColor: 'grey' }}>{this.state.selectedPersonUsername}</div>
                <div className="d-flex " style={{ flexDirection: "column" }}>
                  <div id="messages" className="message-form " ></div>
                  <div className="messageInputContainer" >
                    <input className="messageInput col" type="text" id="messageInput" />
                    <Button id='sendMessage' variant='outlined' style={{ backgroundColor: '#FFF', color: '#000' }}
                      onClick={this.messageSubmit}
                      onKeyDown={this.messageSubmit}>SEND</Button>
                  </div>
                </div>
              </div>
            </div>
          </div> : <div className="container text-center mt-5" style={{ height: '100%' }} >
              <img src={ChatIcon} alt="chat icon" />
              <h4 className="mt-5">Please login to view Messages</h4>
              <Button variant='outlined'
                style={{ backgroundColor: '#FFF', color: '#000', marginTop: 50 }}
                onClick={() => browserHistory.push('/phoneLogin')}>Login</Button>
            </div>
          } />

      </div>
    );
  }
}

export default Messages;
