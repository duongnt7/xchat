import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Button } from "antd";
import UserService from "../services/user.service";
import { LOGIN_SUCCESS } from "../actions/types";
import { setLocalStorage } from "../helper/Helper";
import avt from "../icons/avt.png";
import userService from "../services/user.service";

class Profile extends Component {
  constructor(props) {
    super(props);

    const userInfo = this.props.user;

    this.state = {
      edit: false,
      // changePw: false,
      profile: true,
      username: userInfo.username,
      email: userInfo.email,
      newPw: "",
      renewPw: "",
      password: "",
      showSuccess: false,
      message: "",
      classPopup: "alert alert-success",
      showBlock: true,
    };
    this._edit = this._edit.bind(this);
    this._changePw = this._changePw.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
    this.updateUserPassword = this.updateUserPassword.bind(this);
    this._showSuccess = this._showSuccess.bind(this);
    this.unBlock = this.unBlock.bind(this);
  }

  _edit() {
    this.setState({
      profile: !this.state.profile,
      edit: !this.state.edit,
      showBlock: !this.state.showBlock,
    });
  }
  _changePw() {
    this.setState({
      profile: !this.state.profile,
      showBlock: !this.state.showBlock,
    });
  }

  updateUserInfo() {
    const { dispatch } = this.props;
    UserService.updateInfo(
      this.props.user.id,
      this.state.username,
      this.state.email,
      this.state.password
    ).then(
      (response) => {
        if (response.status === 200) {
          this.props.user.username = this.state.username;
          this.props.user.email = this.state.email;
          this._edit();
          this._showSuccess();
          setLocalStorage(this.state.username, this.state.email);
          this.setState({ message: "Update success!" });
          dispatch({
            type: LOGIN_SUCCESS,
            payload: { user: this.props.user },
          });
        }
      },
      (error) => {
        this.setState({
          message: error.response.data.message,
          classPopup: "alert alert-danger",
        });
        this._showSuccess();
      }
    );
  }

  updateUserPassword() {
    UserService.updatePassword(
      this.props.user.id,
      this.state.newPw,
      this.state.renewPw,
      this.state.password
    ).then(
      (response) => {
        if (response.status === 200) {
          this.setState({ message: "Update success!" });
          this._changePw();
          this._showSuccess();
        }
      },
      (error) => {
        this.setState({
          message: error.response.data.message,
          classPopup: "alert alert-danger",
        });
        this._showSuccess();
      }
    );
  }

  _showSuccess() {
    this.setState({ showSuccess: true });
    setTimeout(() => {
      this.setState({ showSuccess: false });
    }, 3000);
  }

  unBlock(blockId, index) {
    userService.unBlock(this.props.user.id, blockId).then((res) => {
      if (res.status === 200) {
        this.props.user.listBlock.splice(index, 1);
      }
    });
  }

  render() {
    const { user: currentUser } = this.props;

    if (!currentUser) {
      return <Redirect to="/login" />;
    }
    console.log(this.props.user);

    return (
      <div className="container">
        {this.state.profile ? (
          <div className="profile">
            <div className="prf-title">
              <h3>Profile</h3>
              <Button type="primary" onClick={this._edit} className="btEdit">
                Edit
              </Button>
              <Button
                type="primary"
                className="btEdit"
                onClick={this._changePw}
              >
                Change Password
              </Button>
            </div>
            <p>
              <strong>Username:</strong> <span>{currentUser.username}</span>
            </p>
            <p>
              <strong>Email:</strong> <span>{currentUser.email}</span>
            </p>
          </div>
        ) : this.state.edit ? (
          <div className="profile">
            <div className="prf-title">
              <h3>Update user info</h3>
              <Button type="primary" onClick={this._edit} className="btEdit">
                Back
              </Button>
              <Button
                type="primary"
                className="btEdit"
                onClick={() => this.updateUserInfo()}
              >
                Save
              </Button>
            </div>
            <p>
              <strong>Username:</strong>{" "}
              <input
                value={this.state.username}
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ username: e.target.value });
                }}
              ></input>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <input
                value={this.state.email}
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ email: e.target.value });
                }}
              ></input>
            </p>
            <p>
              <strong>Password:</strong>{" "}
              <input
                type="password"
                // value=""
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ password: e.target.value });
                }}
              ></input>
            </p>
          </div>
        ) : (
          <div className="profile">
            <div className="prf-title">
              <h3>Change password</h3>
              <Button
                type="primary"
                onClick={this._changePw}
                className="btEdit"
              >
                Back
              </Button>
              <Button
                type="primary"
                className="btEdit"
                onClick={() => this.updateUserPassword()}
              >
                Save
              </Button>
            </div>
            <p>
              <strong>Old Password:</strong>{" "}
              <input
                type="password"
                // value=""
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ password: e.target.value });
                }}
              ></input>
            </p>
            <p>
              <strong>New Password</strong>{" "}
              <input
                type="password"
                // value=""
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ newPw: e.target.value });
                }}
              ></input>
            </p>
            <p>
              <strong>Retype New Password:</strong>{" "}
              <input
                type="password"
                // value=""
                onChange={(e) => {
                  e.preventDefault();
                  this.setState({ renewPw: e.target.value });
                }}
              ></input>
            </p>
          </div>
        )}
        {this.state.showSuccess ? (
          <div className={this.state.classPopup}>{this.state.message}</div>
        ) : (
          ""
        )}
        {this.state.showBlock ? (
          <div className="profile">
            <div className="prf-title">
              <h3>Block list</h3>
            </div>
            {this.props.user.listBlock.length > 0 ? (
              <ul className="listSearch">
                {this.props.user.listBlock.map((data, index) => {
                  return (
                    <li key={data.blockId} className="listSearchItem">
                      <div style={{ float: "left" }}>
                        <img
                          src={avt}
                          className="searchAvt"
                          alt={data.blockName}
                        />
                        {data.blockName}
                      </div>
                      <div className="rightInnerContainer">
                        <Button
                          type="primary"
                          onClick={() => this.unBlock(data.blockId, index)}
                        >
                          Un Block
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              "Nobody blocked"
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Profile);
