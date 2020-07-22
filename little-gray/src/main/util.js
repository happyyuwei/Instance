/**
 * 一些基本函数
 */
import axios from "axios"
//务必要引入 antd.css文件，否则无法产生样式
import "antd/dist/antd.css"
//使用什么组件加载什么组件
import { message } from 'antd';
import { Url } from "./url";

/**
 * 解析时间
 * @param {} millisecond 
 */
const parseTime = (millisecond) => {
    let date;
    if (millisecond !== undefined) {
        date = new Date(millisecond);
    } else {
        date = new Date();
    }
    //输出格式如：2020/7/13 上午10:12:01 再取出秒数进行显示
    const dataStr = date.toLocaleString();
    return dataStr.substring(0, dataStr.lastIndexOf(":"));
}

/**
 * 只返回日期
 * @param {} millisecond 
 */
const parseDate = (millisecond) => {
    const date = new Date(millisecond)
    return date.toLocaleDateString()
}

/**
   * 指定Url查询是不是拥有权限，要求该url返回 true或false无多余信息
   */
const auth = (url, onReturn) => {
    axios.get(url)
        .then((response) => {
            const authorized = response.data;
            onReturn(authorized);
        }).catch((error) => {
            message.error("查询权限失败");
        });
}

/**
 * 上传文件函数，作用于 ant design 中的上传组件
 * @param {*} param 
 */
const uploadFunction = (param) => {

    const serverURL = Url.imageUpload;
    const xhr = new XMLHttpRequest()
    const fd = new FormData()
  
    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      console.log(xhr.responseText);
      console.log(response)
      param.success({
        url: xhr.responseText,
        meta: {
          id: xhr.responseText,
          title: xhr.responseText,
        }
      });
    }
  
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }
  
    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    }
  
    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)
  
    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.send(fd)
  
  }

export { parseDate, parseTime, auth, uploadFunction }