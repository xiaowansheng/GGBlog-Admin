<script setup lang="ts">
import { getStatisticOfCategory } from "@/api/analysis";
import { IdNameDto, NameValueDto } from "@/api/constant/result";
import { getAllTag } from "@/api/tag";
import { onBeforeMount } from "vue";
import { ref } from "vue";
import * as echarts from "echarts";
import { onMounted } from "vue";
import { shallowRef } from "vue";
import { computed } from "vue";
import { onBeforeUnmount } from "vue";
import { reactive } from "vue";

defineOptions({
  name: "CategoryAndTagStatistics"
});
onBeforeMount(() => {});
onMounted(() => {
  numberChart.value = echarts.init(categoryChartRef.value);
  computeConfig();
  getData();
  window.addEventListener(
    "resize",
    () => {
      console.log("CategoryAndTagStatistics");
      // 重新设置图表尺寸
      numberChart.value?.resize();
      // 重新计算tag div块宽高
      computeConfig();
    },
    false
  );
});
onBeforeUnmount(() => {
  stopInterval();
  window.removeEventListener("resize", () => {});
});
const computeConfig = () => {
  // 获取tag的div长和宽
  config.height = tagChartRef.value?.clientHeight;
  config.width = tagChartRef.value?.clientWidth;
};
const getData = () => {
  getStatisticOfCategory().then((data: any) => {
    categoryData.value = data;
    setNumberChart();
  });
  getAllTag().then((data: any) => {
    tagData.value = data;
    const arr: any = [];
    // const tagsNum = data.length;
    // for (let i = 0; i < tagsNum; i++) {
    //   let tag: any = {};
    //   let k = -1 + (2 * (i + 1) - 1) / tagsNum;
    //   let a = Math.acos(k);
    //   let b = a * Math.sqrt(tagsNum * Math.PI);
    //   tag.text = data[i].name;
    //   // console.log("cx:", CX.value, "CY:", CY.value);

    //   tag.x = CX.value + config.RADIUS * Math.sin(a) * Math.cos(b);
    //   tag.y = CY.value + config.RADIUS * Math.sin(a) * Math.sin(b);
    //   tag.z = config.RADIUS * Math.cos(a);
    //   // tag.href = 'https://imgss.github.io';
    //   arr.push(tag);
    // }

    // TODO 测试
    const tagsNum = 50;
    for (let i = 0; i < tagsNum; i++) {
      let tag: any = {};
      let k = -1 + (2 * (i + 1) - 1) / tagsNum;
      let a = Math.acos(k);
      let b = a * Math.sqrt(tagsNum * Math.PI);
      // console.log("cx:", CX.value, "CY:", CY.value);

      tag.text = i + "tag" + i;
      tag.x = CX.value + config.RADIUS * Math.sin(a) * Math.cos(b);
      tag.y = CY.value + config.RADIUS * Math.sin(a) * Math.sin(b);
      tag.z = config.RADIUS * Math.cos(a);
      // tag.href = 'https://imgss.github.io';
      arr.push(tag);
    }
    // console.log("tags:", arr);
    tags.value = arr;

    startInterval();
  });
};
const categoryData: any = ref<NameValueDto[]>([]);
const tagData: any = ref<IdNameDto[]>([]);
const categoryChartRef = ref<HTMLDivElement>();
const tagChartRef = ref<HTMLDivElement>();
// 使用shallowRef，防止eachrt报type错误
const numberChart: any = shallowRef();

const setNumberChart = () => {
  const categoryTotal = categoryData.value.reduce(
    (sum: number, obj: any) => sum + obj.value,
    0
  );
  let option: any = {
    //动画持续时间
    // animationDuration: 10000,
    title: {
      text: "分类的文章数量",
      left: "center",
      // subtext: 'Condition Statistic',
      subtext: `文章分类总数：${categoryTotal}`,
      // top: "center",
      textStyle: {
        fontSize: 20
      },
      subtextStyle: {
        fontSize: 15,
        left: 100
      }
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
        // name: "分类名称",
        type: "category",
        data: categoryData.value.map((obj: any) => obj.name),
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
            formatter: "分类名称：{value}"
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
    grid: {
      // right: 140,
    },
    series: [
      {
        //无效
        // show:this.showDatasource[0],
        name: "文章数量",
        // type: 'scatter',
        type: "bar",
        xAxisIndex: 0, // 指定使用第1个 x 轴
        itemStyle: {
          normal: {
            color: "rgb(123, 201, 240)"
          }
        },
        data: categoryData.value.map((obj: any) => obj.value)
      }
    ]
  };
  option && numberChart.value?.setOption(option);
};

const tagInterval = ref();
const startInterval = () => {
  tagInterval.value = setInterval(() => {
    rotateX(config.speedX);
    rotateY(config.speedY);
  }, 17);
};
const stopInterval = () => {
  if (tagInterval.value) {
    clearInterval(tagInterval.value);
  }
};
const tags = ref([]);
const config = reactive({
  width: 300,
  height: 300,
  RADIUS: 200,
  speedX: Math.PI / 360,
  speedY: Math.PI / 360
});
const CX: any = computed(() => {
  return config.width / 2;
});
const CY: any = computed(() => {
  return config.height / 2;
});
const listener = event => {
  console.log("mousemove");

  //响应鼠标移动
  const x = event.clientX - CX.value;
  const y = event.clientY - CY.value;
  config.speedX =
    x * 0.0001 > 0
      ? Math.min(config.RADIUS * 0.00002, x * 0.0001)
      : Math.max(-config.RADIUS * 0.00002, x * 0.0001);
  config.speedY =
    y * 0.0001 > 0
      ? Math.min(config.RADIUS * 0.00002, y * 0.0001)
      : Math.max(-config.RADIUS * 0.00002, y * 0.0001);
};
const rotateX = angleX => {
  const cos = Math.cos(angleX);
  const sin = Math.sin(angleX);
  for (let tag of tags.value) {
    const y1 = (tag.y - CY.value) * cos - tag.z * sin + CY.value;
    const z1 = tag.z * cos + (tag.y - CY.value) * sin;
    tag.y = y1;
    tag.z = z1;
  }
};
const rotateY = angleY => {
  const cos = Math.cos(angleY);
  const sin = Math.sin(angleY);
  for (let tag of tags.value) {
    const x1 = (tag.x - CX.value) * cos - tag.z * sin + CX.value;
    const z1 = tag.z * cos + (tag.x - CX.value) * sin;
    tag.x = x1;
    tag.z = z1;
  }
};
</script>

<template>
  <div class="cate-tag-statistics">
    <el-row :gutter="24" class="statistics">
      <el-col :xs="24" :sm="15" :lg="16">
        <div class="chart panel-bkcolor" ref="categoryChartRef"></div>
      </el-col>
      <el-col :xs="24" :sm="9" :lg="8" class="">
        <div class="tags panel-bkcolor" ref="tagChartRef">
          <!-- @touchmove="listener($event)" -->
          <svg
            :width="config.width"
            :height="config.height"
            @mousemove="listener($event)"
          >
            <a href="javascript:;" v-for="tag in tags">
              <text
                :x="tag.x"
                :y="tag.y"
                :font-size="20 * (600 / (600 - tag.z))"
                :fill-opacity="(400 + tag.z) / 600"
              >
                {{ tag.text }}
              </text>
            </a>
          </svg>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.cate-tag-statistics {
  margin-bottom: 15px;
}
.chart,.tags{
  height: 330px;
  overflow: hidden;
}
.chart {
  padding: 10px 10px;
}

</style>
