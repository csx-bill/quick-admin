import * as React from "react";
import axios from "axios";
import { toast } from "amis";
import { RouteComponentProps } from "react-router-dom";
import { IMainStore } from "@/stores";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router";
import appStore from "@/stores/appStore"

import { InputBox, Button } from "amis-ui";
import '@/scss/Login.css';

interface LoginProps extends RouteComponentProps {
  store: IMainStore;
}

@inject("store")
// @ts-ignore
@withRouter
@observer
export default class LoginRoute extends React.Component<LoginProps, any> {
  state = {
    username: "",
    password: "",
  };
  
  handleFormSaved = (e) => {
    e.preventDefault();
    const { history, store } = this.props;
    axios
      .request({
        method: "post",
        url: "/api/auth/doLogin",
        data: {
          username: this.state.username,
          password: this.state.password
        },
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((res) => {
        if (res.data != null && res.data.status === 0) {
          appStore.userStore.login(this.state.username);
          toast.info("登陆成功", { timeout: "1400", position: "top-center" });
          history.replace(`/dashboard`);
        } else {
          toast["error"]("登陆失败", "消息");
        }
      });
  };

  handleChangeForPassword = (value) => {
    this.setState({
      password: value,
    });
  };

  handleChangeForUsername = (value) => {
    this.setState({
      username: value,
    });
  };

  componentDidMount() {
    console.log("appStore.userStore.name", appStore.userStore.name);
    console.log("store.user.isAuthenticated", appStore.userStore.isAuthenticated);
  }

  render() {
    return (
      <div className="background">
        <div className="login-container">
          <h1 className="title">Quick-Admin</h1>
          <form onSubmit={this.handleFormSaved}>
            <div>
              <label>账号</label>
              <InputBox
                clearable={true}
                value={this.state.username}
                onChange={this.handleChangeForUsername}
                required
              />
            </div>
            <div>
              <label>密码</label>
              <InputBox
                type="password"
                clearable={true}
                value={this.state.password}
                onChange={this.handleChangeForPassword}
                required
              />
            </div>
            <div className="login-button-container">
            <Button className="login-button" type="submit" level="info">登录</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}