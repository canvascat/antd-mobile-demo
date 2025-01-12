import { groupBy, kebabCase } from "lodash-es";

const files = import.meta.glob("./demos/**/demo[0-9].tsx", {
  eager: true,
}) as Record<
  string,
  {
    default: React.ComponentType;
  }
>;

export const demos = Object.entries(files).map(
  ([key, mod]) => [key.slice(8, -4), mod.default] as const
);

export const pathsGroups = groupBy(
  demos.map((demo) => demo[0]),
  (path) => path.split("/").slice(-2)[0]
);

// Array.from(document.querySelectorAll('.adm-list'), item => {
//   const header = item.querySelector('.adm-list-header')?.textContent?.trim()
//   const items = Array.from(item.querySelectorAll('.adm-list-body .adm-list-item-content-main'), item => item.textContent?.trim()).join(',')
//   return header + '>' + items
// }).join('|')

export type ComponentGroup = {
  title: string;
  children: {
    title: string;
    path: string;
    children: string[];
  }[];
};

const CONFIG_TEXT =
  "通用>Button 按钮,Icon 图标|布局>AutoCenter 自动居中,Divider 分割线,Grid 栅格,SafeArea 安全区,Space 间距|导航>CapsuleTabs 胶囊选项卡,IndexBar 序列,JumboTabs 复杂选项卡,NavBar 导航栏,SideBar 侧边导航,TabBar 标签栏,Tabs 标签页|信息展示>Avatar 头像,Card 卡片,Collapse 折叠面板,Ellipsis 文本省略,FloatingPanel 浮动面板,Image 图片,ImageViewer 图片查看器,InfiniteScroll 无限滚动,List 列表,PageIndicator 分页符,Steps 步骤条,Swiper 走马灯,Tag 标签,WaterMark 水印,Footer 页脚|信息录入>Cascader 级联选择,CascaderView 级联选择视图,CheckList 可勾选列表,Checkbox 复选框,Form 表单,Input 输入框,Picker 选择器,PickerView 选择器视图,Radio 单选框,Rate 评分,SearchBar 搜索框,Selector 选择组,Slider 滑动输入条,Stepper 步进器,Switch 开关,TextArea 文本域|反馈>ActionSheet 动作面板,Dialog 对话框,Empty 空状态,ErrorBlock 异常,Mask 背景蒙层,Modal 弹窗,Popover 气泡弹出框,Popup 弹出层,ProgressBar 进度条,ProgressCircle 进度圈,PullToRefresh 下拉刷新,Result 结果,Skeleton 骨架屏,SwipeAction 滑动操作,Toast 轻提示|引导提示>Badge 徽标,NoticeBar 通告栏|其他>ConfigProvider 配置|试验性>Calendar 日历,CalendarPicker 日历选择器,CalendarPickerView 日历选择器视图,Dropdown 下拉菜单,FloatingBubble 浮动气泡,ImageUploader 图片上传,NumberKeyboard 数字键盘,PasscodeInput 密码输入框,ResultPage 结果页面,TreeSelect 级联选择器,VirtualInput 虚拟输入框";
export const components: ComponentGroup[] = CONFIG_TEXT.split("|").map(
  (group) => {
    const [title, items] = group.split(">");
    const children = items
      .split(",")
      .map((item) => ({
        title: item,
        path: kebabCase(item.split(" ")[0]),
      }))
      .map((item) => ({ ...item, children: pathsGroups[item.path] || [] }));
    return { title, children };
  }
);
