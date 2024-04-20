import * as React from "react";
import Chart from 'chart.js/auto';
const COLORS = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#58595b',
  '#8549ba'
];

let timeoutId;
class BarChart extends React.Component {
  constructor(props) {
    super(props)
    this.data1 = {
      labels: [
        'Cont 20',
        'Cont 40',
      ],
      datasets: [
        {
          label: 'Sản lượng cont',
          data: this.props.dataImport.length > 0 ? this.props.dataImport : [0, 0],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
          hoverOffset: 4
        }
      ],
    };

    this.options1 = {
      type: 'pie',
      data: this.data1,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Sản lượng cont hướng nhập'
          },
          datalabels: {
            color: '#ffff',
            font: {
              weight: 'bold'
            },
            formatter: function (value, context) {
              console.log(value)
              return value + ' Cont';
            },
          },
          legend: {
            rtl: false,
            title: {
              display: true,
            }
          },
          tooltips: {
            enabled: false
          },
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      },
    };

    this.data2 = {
      labels: [
        'Cont 20',
        'Cont 40',
      ],
      datasets: [
        {
          label: 'Sản lượng cont',
          data: this.props.dataExport.length > 0 ? this.props.dataExport : [0, 0],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
          ],
          hoverOffset: 4
        }
      ],
    };
    this.options2 = {
      type: 'pie',
      data: this.data2,
      options: {
        responsive: true,
        legend: {
          position: 'top',
        },
        plugins: {
          title: {
            display: true,
            text: 'Sản lượng cont hướng xuất',
          },
          datalabels: {
            formatter: function (value, context) {
              return context.chart.data.labels[
                context.dataIndex
              ];
            },
          },
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      },
    }
  }

  numbers(config) {
    var cfg = config || {};
    var min = cfg.min || 0;
    var max = cfg.max || 100;
    var from = cfg.from || [];
    var count = cfg.count || 8;
    var decimals = cfg.decimals || 8;
    var continuity = cfg.continuity || 1;
    var dfactor = Math.pow(10, decimals) || 0;
    var data = [];
    var i, value;

    for (i = 0; i < count; ++i) {
      value = (from[i] || 0) + this.rand(min, max);
      if (this.rand() <= continuity) {
        data.push(Math.round(dfactor * value) / dfactor);
      } else {
        data.push(null);
      }
    }

    return data;
  }

  points(config) {
    const xs = this.numbers(config);
    const ys = this.numbers(config);
    return xs.map((x, i) => ({ x, y: ys[i] }));
  }

  bubbles(config) {
    return this.points(config).map(pt => {
      pt.r = this.rand(config.rmin, config.rmax);
      return pt;
    });
  }

  labels(config) {
    var cfg = config || {};
    var min = cfg.min || 0;
    var max = cfg.max || 100;
    var count = cfg.count || 8;
    var step = (max - min) / count;
    var decimals = cfg.decimals || 8;
    var dfactor = Math.pow(10, decimals) || 0;
    var prefix = cfg.prefix || '';
    var values = [];
    var i;

    for (i = min; i < max; i += step) {
      values.push(prefix + Math.round(dfactor * i) / dfactor);
    }

    return values;
  }

  color(index) {
    return COLORS[index % COLORS.length];
  }

  componentDidMount() {
    this.canvas1 = document.getElementById("chart1")
    this.canvas2 = document.getElementById("chart2")
    this.ctx1 = this.canvas1.getContext('2d')
    this.ctx2 = this.canvas2.getContext('2d')
    const gradient1 = this.ctx1.createLinearGradient(0, 10, 1000, 20);
    const gradient2 = this.ctx2.createLinearGradient(0, 10, 1000, 20);
    gradient1.addColorStop(0, '#111');
    gradient2.addColorStop(1, '#ff4000');
    this.chart1 = new Chart(this.ctx1, this.options1);
    this.chart2 = new Chart(this.ctx2, this.options2);

  }
  componentDidUpdate() {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    // this.chart1.data.datasets.forEach(dataset => {
    //   dataset.data = [0, 0]
    // });
    // this.chart1.update();
    // this.chart2.data.datasets.forEach(dataset => {
    //   dataset.data = [0, 0]
    // });
    this.chart2.update();
    timeoutId = setTimeout(() => {
      this.chart1.data.datasets.forEach(dataset => {
        dataset.data = this.props.dataImport.length > 0 ? this.props.dataImport : [0, 0]
      });
      this.chart1.update();
      this.chart2.data.datasets.forEach(dataset => {
        dataset.data = this.props.dataExport.length > 0 ? this.props.dataExport : [0, 0]
      });
      this.chart2.update();
    }, 900)

  }
  render() {
    return (
      <div style={{ display: "flex", gap: "50px", width: "47%" }}>
        <canvas id="chart1" />
        <canvas id="chart2" />
      </div>
    )
  }
}
export default BarChart;