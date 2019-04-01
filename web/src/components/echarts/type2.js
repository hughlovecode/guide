import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/markPoint';
import 'echarts/lib/component/markLine';


export default class type2 extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount() { 
    console.log('111111111')
    console.log(this.props)
    
    // 初始化
    var myChart = echarts.init(document.getElementById('main'));
    // 绘制图表
    myChart.setOption({
        title: { text: this.props.data.detail.guideName+'签到情况' },
        tooltip : {
          trigger: 'axis'
      },
      legend: {
          data:['签到人数']
      },
      toolbox: {
          show : true,
          feature : {
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {
                show: true,
                type: 'jpg'
              }
          }
      },
        xAxis : [
          {
              type : 'category',
              data : this.props.data.xdata
          }
      ],
      yAxis : [
          {
              type : 'value'
          }
      ],
        series : [
          {
              name:'签到次数(总共'+this.props.data.len+'次)',
              type:'bar',
              data: this.props.data.ydata.ydata1,
              markPoint : {
                  data : [
                      {type : 'max', name: '最大值'},
                      {type : 'min', name: '最小值'}
                  ]
              },
              markLine : {
                  data : [
                      {type : 'average', name: '平均值'}
                  ]
              }
          }
      ]
    });
}
  render(){
    return(<div>
          <div id="main" style={{ width: '100%', height: 500 }}></div>
      </div>)
  }
}


