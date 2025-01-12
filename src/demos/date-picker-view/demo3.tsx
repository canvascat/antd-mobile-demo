import { DatePickerView, PickerView } from "antd-mobile";
import { DemoBlock } from "demos";
import styles from "./demo3.module.less";
import { PickerColumn } from "antd-mobile/es/components/picker-view";

const now = new Date();

const amPmColumns: PickerColumn[] = [
  [
    { value: "am", label: "上午" },
    { value: "pm", label: "下午" },
  ],
];

export default () => {
  return (
    <DemoBlock title="过滤时间" padding="0">
      <div className={styles.container}>
        <DatePickerView defaultValue={now} precision="day" />
        <PickerView columns={amPmColumns} />
      </div>
    </DemoBlock>
  );
};
