// This is the profile component

import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import { browserHistory } from 'react-router';
import Chip from '@material-ui/core/Chip';
import Firebase from '../config/firebase';
import Snackbar from '@material-ui/core/Snackbar';
import greybackground from '../images/greybackground.jpeg'

let userData
let galleryFiles = []
let userUID
class UpdateProfile extends Component {

  constructor(props) {
    super(props);
    userData = this.props.route.userData['0'];
    userUID = localStorage.getItem('userUID');
    if (userData != null) {
      this.state = {
        signedIn: true,
        chipData: userData.skills,
        input: '',
        selectedFile: ['asa', 'asa'],
        uploadedImages: userData.galleryOfWork,
        file: '',
        imagePreviewUrl: '',
        profilePic: userData.pic,
        firstName: userData.firstName,
        lastName: userData.lastName,
        age: userData.age,
        nrc: userData.nrc,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        city: userData.city,
        rating: 3,
        status: 'available',
        reviews: [],
        briefDescription: userData.briefDescription,
        profession: 'Other',
        UploadModalOpen: false,
        // skills : [],
        // profilePicPreviewUrl is actually base64 of the image
        profilePicPreviewUrl: userData.pic,
        // base64 of uploaded Images
        uploadedImagesBase64: [],
        userUID: localStorage.getItem('userUID'),
        open: false,
        snackbarText: ''
      }
    } else {
      this.state = {
        signedIn: true,
        chipData: [],
        input: '',
        selectedFile: ['asa', 'asa'],
        uploadedImages: [],
        file: '',
        imagePreviewUrl: '',
        profilePic: 'https://storage.googleapis.com/lsk-guide-jobs.appspot.com/profile_placeholder.png',
        firstName: '',
        lastName: '',
        age: '',
        nrc: '',
        phoneNumber: '',
        email: '',
        city: '',
        rating: 3,
        status: 'available',
        reviews: [],
        briefDescription: '',
        profession: 'Maid',
        UploadModalOpen: false,
        // skills : [],
        // profilePicPreviewUrl is actually base64 of the image
        profilePicPreviewUrl: '',
        // base64 of uploaded Images
        uploadedImagesBase64: [],
        userUID: '',
        open: false,
        snackbarText: ''
      }
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.addItem = this.addItem.bind(this);
    this.sendData = this.sendData.bind(this);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.handleChangeImages = this.handleChangeImages.bind(this);
    this.handleChangeProfilePic = this.handleChangeProfilePic.bind(this);
    this.handleProfessionChange = this.handleProfessionChange.bind(this);
    this.handleClose = this.handleClose.bind(this)
    this.saveImageMessage = this.saveImageMessage.bind(this)
    this.saveGalleryFiles = this.saveGalleryFiles.bind(this)
  }
  handleClose = () => {
    this.setState({ open: false });
  };


  handleProfessionChange(event) {
    this.setState({ profession: event.target.value });
  }

  handleDelete = data => () => {
    if (data.label === 'nameOfChip') {
      alert('Why would you want to delete specific Chip?! :)');
      return;
    }
    const chipData = [...this.state.chipData];
    const chipToDelete = chipData.indexOf(data);
    chipData.splice(chipToDelete, 1);
    this.setState({ chipData });
  };

  // handle the addition of a chip
  addItem = () => {
    this.state.chipData.push({ label: this.state.input });
    console.log("addItem", this.state.chipData);
    const chipData = [...this.state.chipData];
    this.setState({ chipData });
  };

  handleChangeChips = (event) => {
    event.preventDefault();
    this.setState({
      input: event.target.value,
    });
  };

  sendData = (event) => {
    if (galleryFiles.length === 0) {
      this.setState({
        open: true,
        snackbarText: "Please upload at least one image to Gallery of Work"
      })
    }
    event.preventDefault();
    console.log(this.state.firstName)
    const { firstName, lastName, email, phoneNumber, city,
      age, nrc, profession, chipData, briefDescription } = this.state;


    Firebase.database()
      .ref(`Users/${userUID}`)
      .update(
        {
          //pic: profilePicPreviewUrl,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          city: city,
          age: age,
          nrc: nrc,
          profession: profession,
          skills: chipData,
          briefDescription: briefDescription,
          //galleryOfWork: uploadedImagesBase64,
          userUID: userUID
        },
        (error) => {
          if (error) {
            this.setState({
              open: true,
              snackbarText: 'Error submiting form, please try again'
            })
          } else {
            this.setState({
              open: true,
              snackbarText: 'Successfully uploaded'
            });

            console.log('write successful');
          }
        },
      );
    setTimeout(() => {

    }, 2000);
    window.location.reload()
    browserHistory.push('/categories')
  }
  handleChangeImages(event) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        imagePreviewUrl: reader.result,
      });
    };
    //rewrite this to prevent upload of the same image twice
    galleryFiles.push(file)
    console.log(galleryFiles)
    reader.readAsDataURL(file);
  }

  // profile pic change handler
  handleChangeProfilePic = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        profilePicPreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
    this.saveImageMessage(file)
  }
  saveImageMessage = function (file) {
    console.log("save image")
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    // Firebase.database().ref(`pics/${this.state.userUID}`).set({
    //name: this.getUserName(),
    // pic: '',
    //profilePicUrl: this.getProfilePicUrl()
    // }).then(function (messageRef) {
    // 2 - Upload the image to Cloud Storage.
    var filePath = userUID + '/' + file.name;
    Firebase.storage().ref(filePath).put(file).then(function (fileSnapshot) {
      // 3 - Generate a public URL for the file.
      return fileSnapshot.ref.getDownloadURL().then((url) => {
        // 4 - Update the chat message placeholder with the image's URL.
        return Firebase.database().ref(`Users/${userUID}`).update({
          pic: url,
          //storageUri: fileSnapshot.metadata.fullPath
        });
      });
      //}.bind(this));
    }).catch(function (error) {
      console.error('There was an error uploading a file to Cloud Storage:', error);
    });
  };
  saveGalleryFiles = function () {
    console.log("save gallery files")
    //first remove previous images
    Firebase.database().ref(`Users/${userUID}`).update({
      galleryOfWork: [],
      //storageUri: fileSnapshot.metadata.fullPath
    });
    var uploadedImageURL = []
    for (var x = 0; x < galleryFiles.length; x++) {
      var filePath = userUID + '/' + galleryFiles[x].name;
      // eslint-disable-next-line
      Firebase.storage().ref(filePath).put(galleryFiles[x]).then(function (fileSnapshot) {
        // 3 - Generate a public URL for the file.

        return fileSnapshot.ref.getDownloadURL().then((url) => {
          // 4 - Update the chat message placeholder with the image's URL.

          uploadedImageURL.push(url)

          //rewrite this line so that it only updates once if it is update several times

          return Firebase.database().ref(`Users/${userUID}`).update({
            galleryOfWork: uploadedImageURL,
            //storageUri: fileSnapshot.metadata.fullPath
          });
        });

        //}.bind(this));
      }).catch(function (error) {
        console.error('There was an error uploading a file to Cloud Storage:', error);
      });
    }
    this.setState({
      uploadedImages: uploadedImageURL
    })
  }
  // handle input change except for those that need images
  // we can use a switch statement here 

  handleChangeInput = ({ target: { value, placeholder } }) => {
    switch (placeholder) {
      case 'First Name':
        this.setState({
          firstName: value,
        });
        break;
      case 'Last Name':
        this.setState({
          lastName: value,
        });
        break;
      case 'Phone Number e.g 0979999999':
        this.setState({
          phoneNumber: value,
        });
        break;
      case 'Email':
        this.setState({
          email: value,
        });
        break;
      case 'City':
        this.setState({
          city: value,
        });
        break;
      case 'Age':
        this.setState({
          age: value,
        });
        break;
      case 'NRC Number':
        this.setState({
          nrc: value,
        });
        break;
      case 'Profession':
        this.setState({
          profession: value,
        });
        break;

      case 'Brief Description of Profession/ Duties':
        this.setState({
          briefDescription: value,
        });
        break;
      // not so useful
      default:
        this.setState({
          error: 'Please fill in all required fields ',
        });
        break;
    }

  }

  render() {
    const { uploadedImages } = this.state;
    // Profile Picture Upload
    const { profilePicPreviewUrl } = this.state;
    let $profilePicPreview = null;
    if (profilePicPreviewUrl) {
      $profilePicPreview = <img alt='profile pic' style={{ width: 160, height: 160 }} className="img-thumbnail rounded-circle" src={profilePicPreviewUrl} />;
    } else {
      $profilePicPreview = <img alt='profile pic' style={{ width: 160, height: 160 }} className="img-thumbnail rounded-circle" src={greybackground} />;
    }
    // Gallery of Work Images
    const { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl && !this.state.uploadedImages.includes($imagePreview)
      && !this.state.uploadedImagesBase64.includes(imagePreviewUrl)) {
      $imagePreview = <img alt='gallery of work' style={{ widht: 160, height: 160 }} className="img-thumbnail  " src={imagePreviewUrl} />;
      //this.state.uploadedImages.push($imagePreview);
      //this.state.uploadedImagesBase64.push(imagePreviewUrl);
    }
    // } else {
    //   $imagePreview = <img alt='gallery of work' style={{ width: 300, height: 200 }} className="img-thumbnail" src={this.state.uploadedImages} />;
    // }
    // rename the following to better names
    return (
      <div>
        <Navbar userUID={this.state.userUID} />
        <div className="container justify-content-center">
          <div className="card">
            <div className="card-body">
              <form
                className="needs-validation" onSubmit={this.sendData}
              >
                <div className="card-title">
                  <h3>Update Profile</h3>
                </div>
                <div className="row" style={{ marginBottom: 50 }}>
                  <div className="col-md-6 mb-2 text-center">{$profilePicPreview}</div>
                  <div className="col-md-6">
                    <h5 className="mb-2">Upload Profile picture</h5>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={this.handleChangeProfilePic}
                      required
                    />
                  </div>
                </div>
                <h3>Personal Information</h3>
                <div className="mb-5">
                  <div className="form-row">
                    <div className="col mb-3">
                      <input
                        type="text"
                        value={this.state.firstName}
                        onChange={this.handleChangeInput}
                        className="form-control"
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div className="col mb-3">
                      <input
                        type="text"
                        value={this.state.lastName}
                        onChange={this.handleChangeInput}
                        className="form-control"
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col-md-6 col-sm-12 mb-3">
                      <input
                        type="text"
                        value={this.state.email}
                        onChange={this.handleChangeInput}
                        className="form-control"
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="col mb-3">
                      <input
                        type="text"
                        style={{ display: 'inline-block' }}
                        value={this.state.phoneNumber}
                        onChange={this.handleChangeInput}
                        className="form-control"
                        minlength='10'
                        maxlength='13'
                        placeholder="Phone Number e.g 0979999999"
                        required
                        pattern="[0-9,+]" />
                      {/* <span className="validity"></span> */}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col-md-6 mb-3">
                      <input
                        type="text"
                        value={this.state.city}
                        onChange={this.handleChangeInput}
                        className="form-control"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <input
                        type="number"
                        value={this.state.age}
                        onChange={this.handleChangeInput}
                        className="form-control"
                        placeholder="Age"
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <input
                        style={{ display: 'inline-block' }}
                        type="text"
                        value={this.state.nrc}
                        onChange={this.handleChangeInput}
                        className="form-control"
                        placeholder="NRC Number"
                        maxlength='11'
                        required
                        pattern="[0-9,/]{11}" />
                      {/* <span className="validity"></span> */}
                    </div>
                  </div>
                </div>
                <h3>Professional Information</h3>
                <div className="row">
                  <div className="col-md-6 col-sm-12 mb-3">
                    <select
                      className="form-control mb-3"
                      id="professionSelect"
                      onChange={this.handleProfessionChange}>
                      <option value={'Maid'}>Maid</option>
                      <option value={'Electrician'}>Electrician</option>
                      <option value={'Carpenter'}>Carpenter</option>
                      {/* <option value={'Plumber'}>Plumber</option>
                     <option value={'Painter'}>Painter</option>
                     <option value={'Other'}>Other</option> */}
                    </select>
                    {/* <input type="text" value={this.state.profession} onChange={this.handleChangeInput}
                class="form-control mb-3" placeholder="Profession" /> */}
                    <textarea
                      className="form-control"
                      value={this.state.briefDescription}
                      onChange={this.handleChangeInput}
                      id="exampleFormControlTextarea1"
                      rows="5"
                      placeholder="Brief Description of Profession/ Duties"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-sm-12 mb-3">
                    <div className="input-group">
                      <input
                        value={this.state.input}
                        onChange={this.handleChangeChips}
                        type="text"
                        className="form-control mb-3"
                        placeholder="Type in a skill e.g  'Painting'"

                      />

                      <div>
                        <button
                          className=" input-group-append btn btn-secondary"
                          onClick={this.addItem}
                          type="button">
                          Add
                       </button>
                      </div>
                    </div>

                    {(this.state.chipData) ? this.state.chipData.map((data, i) => (
                      <Chip
                        key={i}
                        label={data.label}
                        onDelete={this.handleDelete(data)}
                      />
                    )) : null}
                  </div>
                </div>

                <h3>Gallery of Your Work</h3>
                <div className=" mb-3">
                  <div className="input-group col-md-6 mb-3">
                    <div className="input-group mb-3">
                      <div className="custom-file">
                        <input
                          type="file"
                          onChange={this.handleChangeImages}
                          ref={(input) => {
                            this.fileInput = input;
                          }}
                          className="custom-file-input"
                          accept="image/png, image/jpeg, image/jpg"
                          required
                        />
                        <label className="custom-file-label" htmlFor="inputGroupFile04">
                          Choose file

                       </label>
                      </div>
                      <div className="input-group-append">
                        <button // onClick={this.uploadHandler}
                          onClick={this.saveGalleryFiles}
                          className="btn btn-outline-secondary"
                          type="button">
                          Upload
                       </button>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="row col-md-12 mb-5">
                  <div className="col-md-6 mb-2" >
                    <h5 className=" row mb-1">Preview</h5>
                    {$imagePreview}
                  </div>
                  <div className='col-md-6'>
                    <h5 className="mb-1">Uploaded Images</h5>
                    <div className="row">
                      {(uploadedImages) ? uploadedImages.map((element, i) => (
                        <div key={i} style={{ margin: 10 }}>{<img className="img-thumbnail"
                          alt='gallery of work' style={{ widht: 200, height: 150 }} src={element} />}</div>
                      )) : null}</div></div>
                </div>

                {/* To have the page reload after the submit button is pressed put the button inside the form div */}
                <div className="text-center col-md-12"> <button
                  className="btn btn-success" //type="submit" //change onClick to onSubmit if you want it not to submit without filling out all the fields

                  onSubmit={this.sendData}
                >
                  Update Profile
               </button>
                </div>

              </form>

            </div>
            <Snackbar className="mb-4"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={this.state.open} //change to this.state.open to show snackbar
              autoHideDuration={3000}
              onClose={this.handleClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">{this.state.snackbarText}</span>}
            />
          </div>
        </div>
      </div>



    );
  }
}

export default UpdateProfile;
