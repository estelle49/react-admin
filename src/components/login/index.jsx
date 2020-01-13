import React, { Component } from 'react';
import { Form, Input, Button, Icon, message } from 'antd';
import axios from 'axios'

// 图片必须引入，才会被webpack打包
import logo from './logo.png';
import './index.less';

@Form.create()
class Login extends Component {
    // 自定义表单校验规则
    validator = (rule, value, callback) => {
        //rule.field 获取表单key
        // value 获取表单value
        const name = rule.field === 'username' ? '用户名' : '密码';

        const reg = /^\w+$/;

        if (!value) {

            callback(`${name}不能为空`);
        } else if (value.length < 4) {
            callback(`${name}必须大于4位`);
        } else if (value.length > 15) {
            callback(`${name}必须小于15位`);
        } else if (!reg.test(value)) {
            callback(`${name}只能包含英文、数字、下划线`);
        }
        // 必须要调用
        callback();
    };
    //发送请求，请求登录
  login = (e) => {
    e.preventDefault()
    /*通过validateFields方法来校验表单并收集表单数据  
    参数err:表示当表单校验失败，值为对象，表单校验成功，值为null
    参数value：表示用户输入的数据
*/
    this.props.form.validateFields((err, value) => {
      //判断是否校验成功
      if (!err) {
        //获取数据
        const { username, password } = value
        //发送请求
        axios.post('/api/login', { username, password })
          .then((response) => {
          //请求成功
            if (response.data.status === 0) {
              //登录成功，跳转页面
              //return <Redirect to="/" /> 用于render方法中，路由链接跳转
              //this.props.history.push('/')  可以返回登录页面
              this.props.history.replace('/')  // 不能返回登录页面
            } else {
              //登录失败，弹出提示，且清空密码
              message.error(response.data.msg)
              this.props.form.resetFields(['password']);
            }
            console.log(response); 
          })
          .catch((err) => {
            //请求失败，弹出提示，清空密码
            message.error('网络错误');
            this.props.form.resetFields(['password']);
        })
      }
    })
  }
     
     
    render() {
            // 用来表单校验
            const { getFieldDecorator } = this.props.form;

        return (
            <div className='login' >
                <header className = 'login-header' >
                    <img src = { logo } alt = 'logo'/ >
                    <h1> React项目: 后台管理系统 </h1> 
                </header>
           <section className='login-section' >
                <h2 > 用户登录 </h2>
                <Form className='login-form' onSubmit={this.login} >
                    <Form.Item >
                    {getFieldDecorator('username', {
                        rules: [              
               /*  // 用户名校验方式一
              { required: true, message: '请输入用户名!' },
              { min: 5, message: '用户名必须大于4位数' },
              { max: 15, message: '用户名必须小于15位数' },
              { pattern:/^\w+$/,message:'用户名只能包含英文，数字，下划线'}*/
                            // 用户名校验方式二
                            {
                                validator: this.validator
                            }
                        ]
                    })(
                        <Input prefix={
                            <Icon type='user'
                            style = {
                                { color: 'rgba(0,0,0,.25)' } }/>}
                            placeholder = '用户名'/> )
                    } 
                    </Form.Item> 
                    <Form.Item >
                      {getFieldDecorator('password', {
                            rules: [{
                                validator: this.validator
                            }]
                        })(
                          <Input type='password'
                            prefix={< Icon type='lock'
                                style = {
                                    { color: 'rgba(0,0,0,.25)' }}/>}
                                placeholder = '密码' / >
                            )
                        } 
                        </Form.Item> 
                        <Form.Item>
                  <Button className='login-form-btn'
                    htmlType='submit' /* 触发原生事件 */
                    type='primary'>
                        登录 </Button> 
                        </Form.Item> 
                        </Form> 
                        </section> 
                        </div>
                    );
                }
            }
            export default Login