import React from 'react';
import Board from '../../components/board/board';
import Square from '../../components/square/square';
import { Card } from 'antd';
import {
  ArrowRightOutlined
} from '@ant-design/icons';

import './main.less';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(36).fill(null),
      color: Array(36).fill(null),
      preColor: [],
      preCss: [],
    };
  }

  /**
   * @description: 点击空格触发的事件
   * @param {i为数组所处的对象} 
   * @return: null
   */
  onClick(i, e) {
    //点击先判断该格子是否激活
    if (this.state.squares[i] === null) {
      //let list = this.state.squares;
      let list = this.nextClick(this.state.squares, 36);
      let colorList = this.state.color;
      //dom为当前点击的节点
      let dom = e.currentTarget;
      //num控制当前属性
      let nextCss = "";
      let nextColor = undefined;
      var num = Math.floor(Math.random() * 5 + 1);
      switch (num) {
        case 1:
          nextColor = this.state.preColor.pop();
          nextCss = this.state.preCss.pop();
          this.state.preCss.unshift("#ee3f4d");
          this.state.preColor.unshift(num);
          dom.style.backgroundColor = nextCss;
          colorList[i] = nextColor;
          break;
        case 2:
          nextColor = this.state.preColor.pop();
          nextCss = this.state.preCss.pop();
          this.state.preCss.unshift("#2e317c");
          this.state.preColor.unshift(num);
          dom.style.backgroundColor = nextCss;
          colorList[i] = nextColor;
          break;
        case 3:
          nextColor = this.state.preColor.pop();
          nextCss = this.state.preCss.pop();
          this.state.preCss.unshift("#5cb3cc");
          this.state.preColor.unshift(num);
          dom.style.backgroundColor = nextCss;
          colorList[i] = nextColor;
          break;
        case 4:
          nextColor = this.state.preColor.pop();
          nextCss = this.state.preCss.pop();
          this.state.preCss.unshift("#5dbe8a");
          this.state.preColor.unshift(num);
          dom.style.backgroundColor = nextCss;
          colorList[i] = nextColor;
          break;
        case 5:
          nextColor = this.state.preColor.pop();
          nextCss = this.state.preCss.pop();
          this.state.preCss.unshift("#f8df72");
          this.state.preColor.unshift(num);
          dom.style.backgroundColor = nextCss;
          colorList[i] = nextColor;
          break;
        default:
          break;
      }
      list[i] = 5;

      //判定是否能消除
      let bingoList = this.bingo(list, colorList, i, colorList[i]);
      this.deleteView(bingoList);
      list = this.deleteList(bingoList, list);
      colorList = this.deleteList(bingoList, colorList);
      this.setState({
        squares: list,
        color: colorList,
      })
    } else {

    }

  }

  deleteView(list) {
    for (let index = 0; index < list.length; index++) {
      document.getElementById('s' + list[index]).style.background = "#fff";
      document.getElementById('n' + list[index]).innerText = "";
    }
  }

  deleteList(list, bList) {
    let newList = bList;
    for (let index = 0; index < list.length; index++) {
      newList[list[index]] = null;
    }
    return newList;
  }

  /**
   * @description: 找到需要消除加分的块
   * @param {type} 
   * @return: 返回一个list记录所有需要消除的块
   */
  bingo(list, colorList, i, c) {
    let lList = [];
    let rList = [];
    //找横排相同颜色的节点
    for (let index = parseInt(i / 6) * 6; index < parseInt(i / 6) * 6 + 6; index++) {
      if (colorList[index] === c) {
        lList.push(index)
      };
    };
    //找竖排相同颜色的节点
    for (let index1 = i % 6; index1 <= (i % 6) + 30; index1 = index1 + 6) {
      if (colorList[index1] === c) {
        rList.push(index1)
      };
    }
    let finalLList = [lList[0]];
    let lN = 1; //记录横排连号
    for (let l = 0; l < lList.length - 1; l++) {
      if (lList[l + 1] === lList[l] + 1) {
        lN++;
        finalLList.push(lList[l + 1]);
      } else {
        if (lN >= 3) {
          break;
        } else {
          lN = 1;
          finalLList.splice(0, finalLList.length);
          finalLList.push(lList[l + 1]);
        }
      }
    }
    let finalRList = [rList[0]];
    let rN = 1;
    for (let r = 0; r < rList.length - 1; r++) {
      if (rList[r + 1] === rList[r] + 6) {
        rN++;
        finalRList.push(rList[r + 1]);
      } else {
        if (rN >= 3) {
          break;
        } else {
          rN = 1;
          finalRList.splice(0, finalRList.length);
          finalRList.push(rList[r + 1]);
        }
      }
    }
    let finalList = []
    //把两个数组合在一起
    if (lN >= 3) {
      finalList = finalLList;
      if (rN >= 3) {
        for (let a1 = 0; a1 < finalRList.length; a1++) {
          if (finalRList[a1] !== i) {
            finalList.push(finalRList[a1]);
          }
        }
      }
    } else {
      if (rN >= 3) {
        finalList = finalRList;
      }
    }
    return finalList;
  }

  /**
   * @description: 每个新回合触发的事件
   * @param {type} 
   * @return: 
   */
  nextClick(list, length) {
    let newList = Array(36).fill(null);
    for (let i = 0; i < length; i++) {
      if (list[i] === 1) {
        newList[i] = 0;
        document.getElementById("s" + i).style.background = "#7a7374";
        document.getElementById("n" + i).style.display = "none";
        let colorList = this.state.color;
        colorList[i] = 0;
        this.setState({
          color: colorList
        })
      }
      else if (list[i] === 0) {
        newList[i] = 0;
      }
      else if (list[i] === null) {
        newList[i] = null;
      }
      else {
        newList[i] = list[i] - 1;
      }
    }
    return newList;
  }


  componentWillMount() {
    for (let index = 0; index < 3; index++) {
      var num = Math.floor(Math.random() * 5 + 1);
      switch (num) {
        case 1:
          this.state.preCss.unshift("#ee3f4d");
          this.state.preColor.unshift(num);
          break;
        case 2:
          this.state.preCss.unshift("#2e317c");
          this.state.preColor.unshift(num);
          break;
        case 3:
          this.state.preCss.unshift("#5cb3cc");
          this.state.preColor.unshift(num);
          break;
        case 4:
          this.state.preCss.unshift("#5dbe8a");
          this.state.preColor.unshift(num);
          break;
        case 5:
          this.state.preCss.unshift("#f8df72");
          this.state.preColor.unshift(num);
          break;
        default:
          break;
      }
    }
  }

  render() {

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
            newonClick={(i, e) => this.onClick(i, e)}
          />
        </div>
        <div className="game-info">
          <Card title="方块准备区域" style={{ width: 320, marginLeft: 80 }}>
            <Square
              Sid="preS2"
              Nid="preN2"
              color={this.state.preCss[0]}
            />
          <Square
            Sid="preS2"
            Nid="preN2"
            color={this.state.preCss[1]}
          />
          <Square
            Sid="preS3"
            Nid="preN3"
            color={this.state.preCss[2]}
          />
          <ArrowRightOutlined style={{ marginLeft: 15, fontSize: '60px' }} />
          </Card>

      </div>
      </div >
    );
  }
}