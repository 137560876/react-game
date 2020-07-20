import React from 'react';
import Board from '../../components/board/board';
import Square from '../../components/square/square';
import { Card, Statistic, Button, Modal, Divider, message } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import './main.less';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(36).fill(null), //每个格子的剩余生命
      color: Array(36).fill(null), //每个格子的颜色数组
      preColor: [], //预读的颜色代码
      preCss: [], //预读的颜色样式
      score: 0, //计分变量
      num: 0, //场上的所有方块数量
      visible: false, //控制对话框显示或者隐藏
      ruleVisible: false, //规则介绍页面显示隐藏
      reNum: 3, //重置机会
    };
  }

  /**
   * @description: 点击空格触发的事件
   * @param {i为数组所处的对象} 
   * @return: null
   */
  onClick(i, e) {
    let nowNum = this.state.num + 1;
    //点击先判断该格子是否激活
    if (this.state.squares[i] === null) {
      let list = this.state.squares;
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
      //判定是否能消除
      let bingoList = this.bingo(list, colorList, i, colorList[i]);
      list = this.nextClick(list, 36);
      list[i] = 7;
      nowNum = nowNum - bingoList.length;

      this.deleteView(bingoList);
      list = this.deleteList(bingoList, list);
      colorList = this.deleteList(bingoList, colorList);
      this.setState({
        num: nowNum,
        squares: list,
        color: colorList,
      })
      if (nowNum === 36) {
        this.showModal();
      }
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
    this.add(finalList.length);
    return finalList;
  }

  /**
   * @description: 根据消除数量统计得分
   * @param {一次消除的行数} 
   * @return: null
   */
  add(num) {
    let newScore = this.state.score;
    let reNum = this.state.reNum;
    newScore = newScore + (num - 2) * 10 * num;
    if (num > 3) {
      reNum = reNum + 1;
      this.setState({
        score: newScore,
        reNum: reNum
      })
    } else {
      this.setState({
        score: newScore,
      })
    }
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

  /** 对话框相关方法 */
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.re();
    this.setState({
      visible: false,
    });
  };

  /**规则介绍页面控制机制 */
  /** 对话框相关方法 */
  showRuleModal = () => {
    this.setState({
      ruleVisible: true,
    });
  };

  ruleOk = e => {
    this.setState({
      ruleVisible: false,
    });
  };

  ruleCancel = e => {
    this.setState({
      ruleVisible: false,
    });
  };


  handleClick = e => {
    this.re();
  }


  changePre = e => {
    let reNum = this.state.reNum;
    if (reNum > 0) {
      this.setState({
        preColor: [],
        preCss: [],
      }, () => {
        let newCss = [];
        let newColor = [];
        for (let index = 0; index < 3; index++) {
          var num = Math.floor(Math.random() * 5 + 1);
          switch (num) {
            case 1:
              newCss.unshift("#ee3f4d");
              newColor.unshift(num);
              break;
            case 2:
              newCss.unshift("#2e317c");
              newColor.unshift(num);
              break;
            case 3:
              newCss.unshift("#5cb3cc");
              newColor.unshift(num);
              break;
            case 4:
              newCss.unshift("#5dbe8a");
              newColor.unshift(num);
              break;
            case 5:
              newCss.unshift("#f8df72");
              newColor.unshift(num);
              break;
            default:
              break;
          }
        }
        reNum = reNum - 1;
        this.setState({
          preColor: newColor,
          preCss: newCss,
          reNum: reNum
        })
      })
      this.forceUpdate();
    } else {
      message.info('没有重置机会惹');
    }

  }

  /**
   * @description: 游戏重来
   * @param {type} 
   * @return: 
   */
  re() {
    //先重置所有的状态参数
    this.setState({
      squares: Array(36).fill(null),
      color: Array(36).fill(null),
      preColor: [],
      preCss: [],
      score: 0,
      num: 0,
      reNum: 3,
      visible: false,
    }, () => {
      let newCss = [];
      let newColor = [];
      for (let index = 0; index < 3; index++) {
        var num = Math.floor(Math.random() * 5 + 1);
        switch (num) {
          case 1:
            newCss.unshift("#ee3f4d");
            newColor.unshift(num);
            break;
          case 2:
            newCss.unshift("#2e317c");
            newColor.unshift(num);
            break;
          case 3:
            newCss.unshift("#5cb3cc");
            newColor.unshift(num);
            break;
          case 4:
            newCss.unshift("#5dbe8a");
            newColor.unshift(num);
            break;
          case 5:
            newCss.unshift("#f8df72");
            newColor.unshift(num);
            break;
          default:
            break;
        }
      }
      this.setState({
        preColor: newColor,
        preCss: newCss,
      })
    })
    //修改所有的色块
    for (let i = 0; i < 36; i++) {
      document.getElementById("s" + i).style.background = "#fff";
      document.getElementById("n" + i).style.display = "inline";
    }
    this.forceUpdate();
  }

  rank = e => {
    message.warning('排行榜还没做好，v1.4上线');
  }

  UNSAFE_componentWillMount() {
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
      <div className="bg">
        <div className="game">

          <div className="game-board">
            <Board
              squares={this.state.squares}
              newonClick={(i, e) => this.onClick(i, e)}
            />
            <div className="xq">v1.3    @青小渊</div>
          </div>

          <div className="game-info">
            <Card bordered={false} style={{ width: 300, backgroundColor: "rgba(255, 255, 255, 0.4)" }}>
              <div className="game-mark">
                <Statistic style={{ marginLeft: 0, marginRight: "auto" }} valueStyle={{ color: '#20a162' }} title={<div className="box1">重置次数</div>} value={this.state.reNum} precision={0} />
                <Statistic style={{ marginLeft: "auto", marginRight: 0 }} valueStyle={{ color: '#2f90b9' }} title={<div className="box2">得分统计</div>} value={this.state.score} precision={0} />
              </div>
              <Divider />
              <div className="pre-frame">
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
                <div className="out"></div>

              </div>
            </Card>
            <div className="button-frame">
              <div className="re">
                <Button type="primary" shape="circle" icon={<RedoOutlined />} onClick={this.changePre} size="large" />
              </div>
              <div className="run">
                <div>
                  <Button shape="round" style={{ marginTop: 16 }} onClick={this.rank} type="primary" size="large" ghost>
                    查看排名
                </Button>
                </div>
                <div>
                  <Button shape="round" style={{ marginTop: 16 }} onClick={this.showRuleModal} type="danger" size="large" ghost>
                    规则介绍
                </Button>
                </div>
              </div>

            </div>

          </div>
        </div >

        <Modal
          title="游戏结束"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="重来"
        >
          <p>游戏结束,最终得分为{this.state.score}</p>
        </Modal>
        {/* 规则介绍对话框 */}
        <Modal
          title="游戏规则"
          visible={this.state.ruleVisible}
          onOk={this.ruleOk}
          onCancel={this.ruleCancel}
          okText="我知道了"
          cancelText="取消"
          width="1250px"
        >
          <div className="rule"></div>
        </Modal>
      </div>
    );
  }
}