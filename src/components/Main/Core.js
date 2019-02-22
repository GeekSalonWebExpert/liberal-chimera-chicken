/*
	Basic Module
	=====================================================
*/
import { Component } from 'react';
import {browserHistory} from "react-router";

/*
	Private Variables
	=====================================================
*/
let eventMedia = document.createElement("a")

/*
	@Core
	標準のReact.Componentを拡張し
	汎用的なメソッドを定義するクラス。
	=====================================================
*/
export default class Core extends Component {

	constructor(props){
		super(props)
		this.handler = {}
	}

	/*
		イベントリスナーを設定する
	*/
	listen(eventName, reaction){
		if("function" !== typeof reaction) return false
		eventMedia.addEventListener(eventName, reaction)
	}

	/*
		イベントリスナーを解除する
	*/
	removeListener(eventName, handler){
		if("function" !== typeof handler) return false
		eventMedia.removeEventListener(eventName, handler)
	}

	/*
		イベントを発生させる
		第二引数に任意のオブジェクトを指定し、リスナーに渡すことができる
	*/
	trigger(eventName, data, isBubbles = false, isCancelable = false){
		if("string" !== typeof eventName) return false
		let e = document.createEvent("HTMLEvents")
		e.initEvent(eventName,isBubbles,isCancelable)
		if("object" === typeof data) e.data = data
		eventMedia.dispatchEvent(e)
	}

	/*
		renderしたDOMの中でクリックイベントなどが発生した場合、
		通常 this は render したコンポーネント自身を参照しない。

		this の参照先を固定するための設定を汎用的に次のメソッドで行える。
	*/
	bindFunction(functionName){
		if(Array.isArray(functionName)){
			functionName.forEach(fn=>{
				if(typeof fn !== "string" || typeof this[fn] !== "function") return false
				this[fn] = this[fn].bind(this)
			})
		} else if(
			"string" === typeof functionName &&
			"function" === typeof this[functionName]
		){
			this[functionName] = this[functionName].bind(this)
		}
		return false
	}

	pushURL(path){
		if(!path || typeof path !== "string") return false
		browserHistory.push(path)
	}

	getTimeString(){
		let d = new Date()
		let m = d.getMonth()+1
		let dd = d.getDate()
		let hh = ("00" +d.getHours()).slice(-2)
		let mm = ("00" +d.getMinutes()).slice(-2)
		let ss = ("00" +d.getSeconds()).slice(-2)
		return `${m}/${dd} ${hh}:${mm}:${ss}`
	}


}
