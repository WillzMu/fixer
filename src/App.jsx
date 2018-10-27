import React, { Component } from 'react';
import { Router, browserHistory, Route } from 'react-router';
import './styles/App.css';
import Categories from './components/Categories';
import Home from './components/Home';
import Messages from './Messages/Messages';
import MessagesMobile from './Messages/MessagesMobile';
import ChatHistoryMobile from './Messages/ChatHistoryMobile';
import UpdateProfile from './Accounts/UpdateProfile';
import SignIn from './Accounts/SignIn'
import SignUp from './Accounts/SignUp'
import Loader from './components/Loader'
// eslint-disable-next-line
import jsonData from './database/NchitoUserDatabase.json'
import PhoneLogin from './Accounts/PhoneLogin'
<<<<<<< Updated upstream
import PrivacyPolicy from './components/PrivacyPolicy'
import RequestService from './components/RequestService'
=======
import ContactUs from './components/ContactUs'
>>>>>>> Stashed changes
import Firebase from './config/firebase';
import Profile from './Accounts/Profile';
import ProfileUser from './Accounts/User/ProfileUser';
import UpdateProfileUser from './Accounts/User/UpdateProfileUser';
import ProfileFixer from './Accounts/Fixer/ProfileFixer';
import UpdateProfileFixer from './Accounts/Fixer/UpdateProfileFixer'

var peopleArray = [];
var currentUser = []
var userUID
// = 'O29nIFjBn8N6U2Kh9eXMyXwGN5B3'
var JobsSnapshot;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      listOfPeople: []
    }
    this.handleLoadUsers = this.handleLoadUsers.bind(this)
    this.handleLoadUsers()
  }
  //fetching data from firebase or json in ./database folder
  handleLoadUsers = () => {

    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //handleLoadUsers()
        userUID = user.uid
        console.log("current user", userUID)
      } else {
        // this.setState({
        //   loading: true,
        //   listOfPeople: peopleArray
        // })

<<<<<<< Updated upstream
        browserHistory.push('/')
=======
    //JobsSnapshot = jsonData["Users"]
    let elements;
    // React doesnt accept objects in states so it has to be converted into an array
    for (const index in JobsSnapshot) {
>>>>>>> Stashed changes

      }
    })
    Firebase.database()
      .ref('Fixers/')
      .on('value', (snapshot) => {
        JobsSnapshot = snapshot.val();

        //JobsSnapshot = jsonData["Users"]
        let elements;
        // React doesnt accept objects in states so it has to be converted into an array
        for (const index in JobsSnapshot) {

          elements = JobsSnapshot[index];
          if (elements.profession != null) {
            peopleArray.push(elements);
          }
        }
        this.setState({
          loading: true,
          listOfPeople: peopleArray,
        });

        let currentUserObject;
        for (const index in JobsSnapshot) {
          // console.log(JobsSnapshot[index]['userUID'])

          if (
            JobsSnapshot[index].userUID ===
            userUID
            //'O29nIFjBn8N6U2Kh9eXMyXwGN5B3'
            //'HxzHuXo1E1M0F3kxBrKf550KsCa2'
            //'O6VVUA0fm1QpOt23QaOctFux27h1'
          ) {
            currentUserObject = JobsSnapshot[index];
          }
        }
        currentUser.push(currentUserObject);
      });

<<<<<<< Updated upstream
=======
      if (
        JobsSnapshot[index].userUID ===
        userUID
        //'O29nIFjBn8N6U2Kh9eXMyXwGN5B3'
        //'HxzHuXo1E1M0F3kxBrKf550KsCa2'
        //'O6VVUA0fm1QpOt23QaOctFux27h1'
      ) {
        currentUserObject = JobsSnapshot[index];
      }
    }
    currentUser.push(currentUserObject);
    // });
>>>>>>> Stashed changes
  }
  render() {

    if (this.state.loading) {
      return (

        < Router history={browserHistory} >
          <Route path="/" component={Home} userUID={userUID} />
          <Route path="/categories" component={Categories} userData={peopleArray} userUID={userUID} currentUser={currentUser} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/privacypolicy" component={PrivacyPolicy} />
          <Route path="/updateprofile" component={UpdateProfile} userData={currentUser} userUID={userUID} />
          <Route path="/messages" component={Messages} userUID={userUID} />
          <Route path='/profile' component={Profile} userData={currentUser} userUID={userUID} />
          <Route path='/phonelogin' component={PhoneLogin} userUID={userUID} />
          <Route path='/messagesmobile' component={MessagesMobile} userUID={userUID} />
          <Route path='/chathistorymobile' component={ChatHistoryMobile} userUID={userUID} />
<<<<<<< Updated upstream
          <Route path='/requestservice' component={RequestService} userUID={userUID} userData={currentUser} />
          <Route path='/user/profile' component={ProfileUser} userData={currentUser} userUID={userUID} />
          <Route path='/user/updateprofile' component={UpdateProfileUser} userData={currentUser} userUID={userUID} />
          <Route path='/fixer/profile' component={ProfileFixer} userData={currentUser} userUID={userUID} />
          <Route path='/fixer/updateprofile' component={UpdateProfileFixer} userData={currentUser} userUID={userUID} />
=======
          <Route path='/contactus' component={ContactUs} />
>>>>>>> Stashed changes
        </Router >

      );
    } else {
      return (<Loader />)
    }
  }
}

export default App;