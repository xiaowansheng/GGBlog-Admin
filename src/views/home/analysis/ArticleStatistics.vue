<script setup lang="ts">
import {
  getStatisticOfArticleCount,
  getStatisticOfTalkCount
} from "@/api/analysis";
import { NameValueDto } from "@/api/constant/result";
import {} from "vue";
import { ref, onBeforeUnmount, onMounted, shallowRef } from "vue";
import * as echarts from "echarts";
import { formatDate } from "@/utils/myUtils";

defineOptions({
  name: "Overview"
});
onMounted(() => {
  numberChart.value = echarts.init(chartRef.value);
  getData();
  window.addEventListener(
    "resize",
    () => {
      // 重新设置图表尺寸
      numberChart.value?.resize();
    },
    false
  );
});
onBeforeUnmount(() => {
  // 取消resize监听
  window.removeEventListener("resize", () => {});
});
const dateArr = ref<string[]>([]);
const initDateInterval = () => {
  const date = new Date();
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  const date2 = new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
  dateArr.value = [formatDate(date2), formatDate(date)];
};
const getData = () => {
  initDateInterval();
  const params = {
    beginDate: dateArr.value[0],
    endDate: dateArr.value[1]
  };

  getStatisticOfArticleCount(params).then((data: any) => {
    articleNumber.value = data;
    setNumberChart();
  });
  getStatisticOfTalkCount(params).then((data: any) => {
    talkNumber.value = data;
    setNumberChart();
  });
};
const articleNumber: any = ref<NameValueDto[]>([]);
const talkNumber: any = ref<NameValueDto[]>([]);
const chartRef = ref<HTMLDivElement>();
// 使用shallowRef，防止eachrt报type错误
const numberChart: any = shallowRef();

const setNumberChart = () => {
  // const dataset: any = [];
  let length = articleNumber.length;
  let show: boolean = length > 31 ? true : false;
  let startValue = length >= 31 ? length - 31 : 0;
  let endValue = length >= 31 ? 31 : length;
  let minValueSpan = length >= 31 ? 31 : length;

  const articleTotal = articleNumber.value.reduce(
    (sum: number, obj: any) => sum + obj.value,
    0
  );
  const talkTotal = talkNumber.value.reduce(
    (sum: number, obj: any) => sum + obj.value,
    0
  );
  // console.log("count:", total);
  let option: any = {
    //动画持续时间
    // animationDuration: 10000,
    title: {
      text: "发布的内容数量统计",
      left: "center",
      // subtext: 'Condition Statistic',
      subtext: `最近30天数据（文章数量：${articleTotal}，说说数量：${talkTotal}）`,
      // top: "center",
      textStyle: {
        fontSize: 20
      },
      subtextStyle: {
        fontSize: 15,
        left: 100
      }
    },
    //图例
    legend: {
      // Try 'horizontal'
      orient: "vertical",
      right: 10
      // top: 'center',
    },
    tooltip: {
      order: "valueDesc",
      trigger: "axis",
      axisPointer: {
        type: "shadow"
      }
    },
    xAxis: [
      {
        // name: "时间区间",
        type: "category",
        data: articleNumber.value.map((obj: any) => obj.name),
        //区域分割线
        splitLine: {
          show: true
        },
        // nameLocation: 'middle',
        axisLabel: {
          rotate: -45
        },
        axisPointer: {
          type: "shadow",
          label: {
            formatter: "时间：{value}"
          }
        }
      }
    ],
    yAxis: [
      {
        // name: "数量",
        min: 0,
        minInterval: 1
      }
    ],
    //滑动条
    // dataZoom: [
    //   {
    //     type: 'slider',
    //     start: 0,
    //     end: 100,
    //   },
    //   {
    //     type: 'inside',
    //     start: 0,
    //     end: 100,
    //   },
    // ],
    grid: {
      // right: 140,
    },
    dataZoom: [
      {
        show: show,
        startValue: startValue,
        endValue: endValue,
        minValueSpan: minValueSpan
      },
      {
        type: "inside",
        startValue: startValue,
        endValue: endValue,
        minValueSpan: minValueSpan
      }
      // {
      //   show: true,
      //   yAxisIndex: 0,
      //   filterMode: 'empty',
      //   width: 30,
      //   height: '80%',
      //   showDataShadow: false,
      //   left: '93%'
      // }
    ],
    series: [
      {
        //无效
        // show:this.showDatasource[0],
        name: "文章数量",
        // type: 'scatter',
        type: "bar",
        xAxisIndex: 0, // 指定使用第1个 x 轴,
        itemStyle: {
          normal: {
            color: "rgb(87, 100, 244)"
          }
        },
        data: articleNumber.value.map((obj: any) => obj.value)
      },
      {
        name: "说说数量",
        type: "bar",
        xAxisIndex: 0,

        itemStyle: {
          normal: {
            color: "rgb(108, 234, 171)"
          }
        },
        data: talkNumber.value.map((obj: any) => obj.value)
      }
    ]
  };
  option && numberChart.value?.setOption(option);
};
</script>

<template>
  <div class="article-statistics panel-bkcolor">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<style lang="scss" scoped>
.article-statistics {
  margin-bottom: 15px;
}
.chart {
  padding: 10px 0;
  height: 350px;
}
</style>
