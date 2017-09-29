import React from 'react';
import _ from 'lodash';
import ReactPasswordStrength from 'react-password-strength';
import Dropzone from 'react-dropzone';
import DateTime from 'react-datetime';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import CountrySelect from '../lib/CountrySelect';
import Notification from 'react-notification-system';
import Halogen from 'halogen';
import Query from '../query';
import AdminConfig from '../AdminConfig';
import {riques, getValue, setValue, errorCallback, getFormData, disableForm, getConfig, swalert, defaultHalogenStyle} from '../../utils';
import {connect} from 'react-redux'
import {maskArea, setDateBirthAndTimezone, setAvatar} from '../../actions'

window.getBase64Image = function(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

let Profile = React.createClass({
	propTypes: {
    isProcessing: React.PropTypes.bool.isRequired,
    opacity: React.PropTypes.number.isRequired,
    avatar: React.PropTypes.string,
		passwordActive: React.PropTypes.bool,
		userMetaList: React.PropTypes.array,
		timezone: React.PropTypes.string,
		country: React.PropTypes.string,
		dateOfBirth: React.PropTypes.string,
		metaFields: React.PropTypes.array
  },
  getDefaultProps: function() {
  	var p = JSON.parse(localStorage.getItem("profile"));
		var dateOfBirth = "";
		var image = "";
		var timezone = "";

		if (p) {
			if (p.dateOfBirth && p.dateOfBirth!=="") 
				dateOfBirth = new Date(p.dateOfBirth)

			image = getConfig('rootUrl')+"/images/avatar-default.png";
			if (JSON.parse(localStorage.getItem("profile")).image)
				image = JSON.parse(localStorage.getItem("profile")).image;

			timezone = p.timezone;
		}

    return {
      isProcessing: false,
      opacity: 1,
      avatar: image,
			passwordActive: false,
			userMetaList: AdminConfig.userMetaList,
			timezone: timezone,
			country: "",
			dateOfBirth: dateOfBirth,
			metaFields: ['bio','website','facebook','twitter','linkedin','timezone','phone']
    }
  },
	setProfile: function(p) {
		var meta = {}
		_.forEach(this.props.userMetaList, function(item){
			meta[item] = _.find(p.meta.edges, {"node": {"item": item}});
		})
	  
    var profile = {
		  name: p.fullName?p.fullName:p.username,
	      username: p.username,
	      email: p.email,
	      gender: p.gender,
	      image: p.image,
	      lastLogin: p.lastLogin,
	      createdAt: p.createdAt,
	      biography: meta["bio"]?meta["bio"].node.value:"",
	      dateOfBirth: p.dateOfBirth?p.dateOfBirth:"",
	      phone: meta["phone"]?meta["phone"].node.value:"",
	      country: p.country?p.country:"",
	      timezone: meta["timezone"]?meta["timezone"].node.value:"",
	      website: meta["website"]?meta["website"].node.value:"",
	      facebook: meta["facebook"]?meta["facebook"].node.value:"",
	      twitter: meta["twitter"]?meta["twitter"].node.value:"",
	      linkedin: meta["linkedin"]?meta["linkedin"].node.value:"",
	      userPrefConfig: meta["userPrefConfig"]?meta["userPrefConfig"].node.value:""
	  }
	  this.props.dispatch(setDateBirthAndTimezone(profile.dateOfBirth, profile.timezone));
	  localStorage.setItem('profile', JSON.stringify(profile));
	},
	setUserMeta: function(metaList){
		var me = this;
  		var profile = JSON.parse(localStorage.getItem("profile"));
		_.forEach(this.props.userMetaList, function(item){
			var i = _.find(metaList, {"item": item});
			if (i){
				if (item==="timezone"){
					me.props.dispatch(setDateBirthAndTimezone(me.props.dateOfBirth, i.value))
				} else {
					profile[i.item] = i.value;
				}
			}
		})
  		localStorage.setItem('profile', JSON.stringify(profile));
	},
	disableForm: function(state){
		disableForm(state, this.notification);
		this.props.dispatch(maskArea(state))
	},
	handleSubmitBtn: function(event){
		event.preventDefault();
		
		var me = this;
		var _data = getFormData("rdt-input-form");
		_data["userId"] = localStorage.getItem("userId");
		_data["image"] = this.props.avatar;
		_data["dateOfBirth"] = this.props.dateOfBirth;
		_data["timezone"] = this.props.timezone;

		var isMetaEmpty = true;
		_.forEach(this.props.metaFields, function(item) { if (_data[item]!==null) isMetaEmpty = false } );

		// Change password
		var oldPassword = getValue("old-password");
		var password = getValue("new-password");
    var repassword = getValue("new-password-2");
    var changePassword = false;

    if (password) {
    	if (!oldPassword) {
    		swalert('error','Failed!', 'Please fill your old password')
	    	return;
    	}
    	if (password!==repassword) {
    		swalert('error','Failed!', 'Password is not match')
	    	return;
	    }
	    changePassword = true;
    }

		this.disableForm(true);

		riques(Query.saveProfileMtn(_data), 
			function(error, response, body){
				if(!error && !body.errors) {
					var p = body.data.updateUser.changedUser;
					me.props.dispatch(setAvatar(p.image))
          me.setProfile(p);
          var here = me;

          if (isMetaEmpty) {
          	me.notification.removeNotification('saving');
          }	else {
	          var userMetaData0 = {
	          	"bio": _data['bio'],
	          	"website": _data['website'],
	          	"facebook": _data['facebook'],
	          	"twitter": _data['twitter'],
	          	"linkedin": _data['linkedin'],
	          	"timezone": _data['timezone'],
	          	"phone": _data['phone']
	          };

	          var existMetaList = _.map(p.meta.edges, function(item){ return item.node.item });
	          var qry = Query.createUpdateUserMetaMtn(p.id, existMetaList,userMetaData0);

	          riques(qry, 
							function(error, response, body){
								if(!error && !body.errors) {
									var metaList = [];
									_.forEach(body.data, function(item){
										metaList.push(item.changedUserMeta);
									});
									
									if (metaList.length>0) {
										here.setUserMeta(metaList);
										this.disableForm(false);
									}
								} else {
									errorCallback(error, body.errors?body.errors[0].message:null);
								}
							}
						);
	        } 
				} else {
					errorCallback(error, body.errors?body.errors[0].message:null);
				}
			}
		);
		
		if (changePassword) {
			riques(Query.changePasswordMtn(oldPassword, password), 
				function(error, response, body){
					if(!error && !body.errors) {
						this.notification.addNotification({
							message: 'Password changed',
							level: 'success',
							position: 'tr',
							autoDismiss: 5
						});
					} else {
						errorCallback(error, body.errors?body.errors[0].message:null);
					}
				}
			);
		}
	}, 
	handleImageDrop: function(accepted){
		var me = this;
		var reader = new FileReader();
	    reader.onloadend = function(res) {
	      var imageBase64 = res.target.result;
	      me.props.dispatch(setAvatar(imageBase64));
	    }
	    reader.readAsDataURL(accepted[0]);
	},
	handlePasswordChange: function(event){
		var password = getValue("new-password");
		if (password) {
			this.setState({passwordActive: true});
		} else {
			this.setState({passwordActive: false})
		}
	},
	handleBirthDateChange: function(date){
		this.props.dispatch(setDateBirthAndTimezone(date.toISOString(), this.props.timezone))
	},
	handleGeneratePassword: function(event){
		event.preventDefault();
		var Password = require('node-password').Password;
		var pw = new Password();
		setValue("new-password", pw);
		setValue("new-password-2", pw);

		document.getElementById("togglePassword").checked=true;
		document.getElementById("new-password").setAttribute("type","text");
	},
	handleShowPassword: function(event){
		var checked = event.target.checked;
		if (checked)
			document.getElementById("new-password").setAttribute("type","text")
		else
			document.getElementById("new-password").setAttribute("type","password")
	},
	handleTimezoneChange: function(tz){
		this.props.dispatch(setDateBirthAndTimezone(this.props.dateOfBirth, tz));
	},
	componentDidMount: function(){
		require ('react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css');
		require ('react-datetime/css/react-datetime.css');
		this.notification = this.refs.notificationSystem;
	},
	render: function(){ 
		let p = JSON.parse(localStorage.getItem("profile"));
		var dateOfBirth = "";
		if (p.dateOfBirth && p.dateOfBirth!=="") 
			dateOfBirth = new Date(p.dateOfBirth)

		return (
			<div className="content-wrapper">
				<div className="container-fluid">
					<section className="content-header" style={{marginBottom:20}}>
			      <h1>My Profile</h1>
			      <ol className="breadcrumb">
			        <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
			        <li className="active">Profile</li>
			      </ol>
			      <div style={{borderBottom:"#eee" , borderBottomStyle:"groove", borderWidth:2, marginTop: 10}}></div>
			    </section>
			    <Notification ref="notificationSystem" />

			    <section className="content">
			    	<div className="row">
					  	<div className="col-md-8">
						  	<section className="content">
						  		{ this.props.isProcessing &&
                  <div style={defaultHalogenStyle}><Halogen.PulseLoader color="#4DAF7C"/></div>                   
                  }
				    			<form onSubmit={this.handleSubmitBtn} className="form-horizontal" id="profileForm">
				    			
						  			<div className="form-group">
									  	<label htmlFor="name" className="col-md-3">Name</label>
									  	<div className="col-md-9">
												<input type="text" name="name" id="name" className="form-control rdt-input-form" defaultValue={p.name} required="true"/>
												<p className="help-block">Your full name</p>
											</div>
										</div>

									<div className="form-group">
								  	<label htmlFor="name" className="col-md-3">Picture</label>
								  	<div className="col-md-9">
										<Dropzone onDrop={this.handleImageDrop}>
											<div className="avatar-container">
					              			  <img src={this.props.avatar} alt='' id="avatar"/> 
											  <div className="avatar-overlay"></div>
											  <div className="avatar-button"><a href="#"> Change </a></div>
											</div>
				            			</Dropzone>
									</div>
									</div>

						  			<div className="form-group">
									  	<label htmlFor="tagline" className="col-md-3">Username</label>
									  	<div className="col-md-9">
											<input type="text" name="username" id="username" className="form-control rdt-input-form" defaultValue={p.username} disabled/>
											<p className="help-block">The short unique name describes you</p>
										</div>
									</div>

									<div className="form-group">
									  	<label htmlFor="dateOfBirth" className="col-md-3">Date of Birth</label>
									  	<div className="col-md-9">
											<DateTime 
												timeFormat={false} 
												className="datetime-input" 
												defaultValue={dateOfBirth}
												onChange={this.handleBirthDateChange}/>
										</div>
									</div>

									<div className="form-group">
									 	<label htmlFor="homeUrl" className="col-md-3">Gender</label>
									 	<div className="col-md-9">
											<select id="gender" name="gender" className="rdt-input-form" defaultValue={p.gender} style={{width: 150}}>
												<option key="male" value="male" >Male</option>
												<option key="female" value="female" >Female</option>
											</select> 
										</div>
									</div>

						  			<div className="form-group">
									  	<label htmlFor="keywoards" className="col-md-3">Email</label>
									  	<div className="col-md-9">
											<input type="text" name="email" id="email" className="form-control rdt-input-form" defaultValue={p.email} disabled/>
										</div>
									</div>

									<div className="form-group">
									  	<label htmlFor="phone" className="col-md-3">Phone</label>
									  	<div className="col-md-9">
											<input type="text" name="phone" id="phone" className="form-control rdt-input-form" defaultValue={p.phone} />
										</div>
									</div>

						  			<div className="form-group">
									 	<label htmlFor="homeUrl" className="col-md-3">Biography</label>
									 	<div className="col-md-9">
											<textarea name="bio" id="bio" className="form-control rdt-input-form" defaultValue={p.biography}></textarea>
										</div>
									</div>

									<div className="form-group">
									  	<label htmlFor="country" className="col-md-3">Country</label>
									  	<div className="col-md-9">
									  		<CountrySelect id="country" name="country" defaultValue={p.country} required="true"/>
										</div>
									</div>

									<div className="form-group">
									  	<label htmlFor="timezone" className="col-md-3">Timezone</label>
									  	<div className="col-md-9">
											<TimezonePicker
											  absolute={true}
											  defaultValue={p.timezone}
											  style={{width: 300}}
											  placeholder="Select timezone..."
											  onChange={this.handleTimezoneChange}
											/>
										</div>
									</div>

									<div className="form-group">
									 	<label htmlFor="homeUrl" className="col-md-3">Member since</label>
									 	<div className="col-md-9">
											<input type="text" name="gender" className="form-control" defaultValue={p.createdAt} disabled/>
										</div>
									</div>

									<div className="form-group">
									 	<label htmlFor="homeUrl" className="col-md-3">Last login</label>
									 	<div className="col-md-9">
											<input type="text" name="gender" className="form-control" defaultValue={p.lastLogin} disabled/>
										</div>
									</div>

									<h4 style={{marginBottom: 20}}>Social Media Accounts</h4>
									<div className="form-group">
									  	<label htmlFor="website" className="col-md-3">Website</label>
									  	<div className="col-md-9">
											<input type="text" name="website" id="website" placeholder="example: www.ussunnah.com" className="form-control rdt-input-form" defaultValue={p.website} />
											<p className="help-block">Your website name</p>
										</div>
									</div>

									<div className="form-group">
									  	<label htmlFor="facebook" className="col-md-3">Facebook Account</label>
									  	<div className="col-md-9">
											<input type="text" name="facebook" id="facebook" placeholder="example: www.facebook.com/ussunnah" className="form-control rdt-input-form" defaultValue={p.facebook} />
											<p className="help-block">URL to your Facebook Page</p>
										</div>
									</div>

									<div className="form-group">
									  	<label htmlFor="twitter" className="col-md-3">Twitter Account</label>
									  	<div className="col-md-9">
											<input type="text" name="twitter" id="twitter" placeholder="example: www.twitter.com/ussunnah" className="form-control rdt-input-form" defaultValue={p.twitter} />
											<p className="help-block">URL to your Twitter Page</p>
										</div>
									</div>

									<div className="form-group">
									  	<label htmlFor="linkedin" className="col-md-3">Linkedin Account</label>
									  	<div className="col-md-9">
											<input type="text" name="linkedin" id="linkedin" placeholder="example: www.linkedin.com/in/ussunnah" className="form-control rdt-input-form" defaultValue={p.linkedin} />
											<p className="help-block">URL to your LinkedIn Page</p>
										</div>
									</div>

									<h4 style={{marginBottom: 20}}>Change Password</h4>
									<div className="form-group">
									 	<label htmlFor="old-password" className="col-md-3">Old password</label>
									 	<div className="col-md-9">
											<input type="password" name="old-password" id="old-password" className="form-control" style={{width:300}}/>
										</div>
									</div>

									<div className="form-group">
									 	<label htmlFor="new-password" className="col-md-3">New password</label>
									 	<div className="col-md-9">
									 			<ReactPasswordStrength
												  className="passwordTester"
												  style={{ width: 300, display: "inline-block" }}
												  minLength={5}
												  minScore={2}
												  changeCallback={this.handlePasswordChange}
												  scoreWords={['weak', 'poor', 'okay', 'good', 'strong']}
												  inputProps={{ name: "new-password", id:"new-password", value: "OK" }}
												  value="OK"
												/>
												<button className="btn" onClick={this.handleGeneratePassword} style={{height: 52, marginLeft: 5, marginBottom: 5}}>Generate</button>
												<div>
													<input type="checkbox" id="togglePassword" onChange={this.handleShowPassword}/> Show password
												</div>
										</div>
									</div>

									<div className="form-group">
									 	<label htmlFor="new-password-2" className="col-md-3">Re-type new password</label>
									 	<div className="col-md-9">
											<input type="password" name="new-password-2" id="new-password-2" className="form-control" style={{width:300}} disabled={!this.props.passwordActive}/>
										</div>
									</div>
																
									<div className="form-group">
										<div className="col-md-9">
											<div className="btn-group">
												<input type="submit" value="Update Profile" className="btn btn-primary btn-sm" />
											</div>
										</div>
									</div>
									</form>
								</section>
					  	</div>
						</div>
					
			    </section>

			    </div>
		    </div>
		)
	}
});

const mapStateToProps = function(state){
  if (!_.isEmpty(state.profile)) {
    return _.head(state.profile)
  } else return {}
}

Profile = connect(mapStateToProps)(Profile)
export default Profile;
